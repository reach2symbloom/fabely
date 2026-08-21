/**
 * Paragraph List — composes `ParagraphBlock` (molecule) and `DropTarget`
 * (atom) into an actual drag-reorderable manuscript. This is the only
 * layer that owns ordering: individual `ParagraphBlock`s never decide
 * where they sit relative to one another, they only report "I was
 * clicked" / "I started being dragged" / "my text was clicked" via
 * `onSelect`/`onDragStart`/`onTextClick` (see that component's README) —
 * this list decides what those mean for the array and for selection.
 *
 * `state` per row is `selected` while a row is the most-recently
 * clicked/dragged one, and separately dimmed (`opacity-40`, not `drag`
 * chrome) while dnd-kit reports it as the actively-dragged row — the row
 * that's actually shown with `drag` chrome is a `DragOverlay` copy
 * following the pointer, not the anchored original. See
 * `use-paragraph-list-dnd-kit.ts`'s doc comment for why (same choice
 * Chapter Menu's outline drag makes, and for the same reason).
 *
 * Each row wrapper is `motion.div layout` — Motion's own FLIP tracking, so
 * when the array reorders (drop or keyboard), every displaced sibling
 * glides to its new position instead of snapping; the dragged/keyboard-
 * moved row itself is just another row participating in the same
 * animation, not special-cased. Reorder the array once via
 * `onItemsChange`; Motion measures old vs. new position for each `key`
 * (paragraph id — never index, or React would match the wrong instance
 * across a reorder and layout tracking would break) and animates the
 * difference. Nothing here manually computes a sibling's y-offset.
 *
 * The `DropTarget` for the gap *before* a row is absolutely positioned
 * (`bottom-full`) inside that row's own `relative` wrapper, not a normal
 * flex sibling — it was briefly made a physically-pushing flex sibling to
 * get "surrounding blocks make room for the target," but that turned out
 * to fight the pointer-driven gap resolution below: an in-flow
 * `DropTarget` pushing the next row down changes that row's own measured
 * rect, which is exactly what decides whether the gap should still be
 * active, which can flip it back, closing the space, moving the row back,
 * flipping the gap again — a feedback loop between the thing being
 * measured and the thing doing the measuring (see
 * `use-paragraph-list-dnd-kit.ts`'s doc comment for the full story).
 * Absolutely positioned, it can render at any height without moving
 * anything it sits on top of, which is what actually removes the loop.
 * "Making room" still happens — just entirely from the *dragged* row's
 * own collapse and the sibling `layout` reflow that follows it (next
 * paragraph), neither of which has this problem, since `isDragging` is a
 * plain boolean this same calculation never reads back. The tail gap
 * (after the last row, no following row to live inside) is the one
 * `DropTarget` rendered as a plain flex sibling at the very end.
 *
 * The row actively being dragged collapses its own `ParagraphBlock` (a
 * `grid-template-rows` `1fr` → `0fr` tween, same technique `DropTarget`
 * itself uses, chosen over animating `height` directly or leaning on
 * `layout`'s own size-interpolation so text content doesn't visibly
 * distort mid-collapse) the instant `isDragging` flips true — not a
 * dimmed full-height placeholder anymore. Neighbors close the vacated
 * space immediately via the same `layout` tracking, matching how a block
 * editor like Notion detaches a block from its slot as soon as a drag is
 * confirmed, rather than leaving a static hole until drop.
 *
 * Visual source: composition of Figma **Paragraph block** (`16129:377`)
 * and **Paragraph drop line** (`16372:4438`) — no Figma frame of its own.
 */
'use client';

import * as React from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { motion } from 'motion/react';

import { DropTarget } from '@/atoms/drop-target';
import { LAYOUT_REFLOW } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { ParagraphBlock } from '@/molecules/paragraph-block';

import { moveParagraphByOffset, type ParagraphListItem } from './paragraph-list-dnd';
import type { ParagraphHistoryEvent } from './paragraph-list-history';
import {
  paragraphCollisionDetection,
  useParagraphListDragAndDrop,
  useParagraphRow,
} from './use-paragraph-list-dnd-kit';

export type { ParagraphListItem };
export type { ParagraphHistoryEvent } from './paragraph-list-history';

export type ParagraphListProps = {
  items: ParagraphListItem[];
  onItemsChange: (items: ParagraphListItem[]) => void;
  /** Fires once per completed user action — edit (on blur), split
   * (Enter), merge (Backspace), or move (drag drop / keyboard reorder
   * step) — with enough before/after data for a caller to undo and redo
   * it deterministically. Optional and additive: omitting it changes
   * nothing about how this component behaves. See
   * `paragraph-list-history.ts` for the full contract and why it stops
   * at *reporting* rather than owning an undo/redo stack itself. */
  onHistoryEvent?: (event: ParagraphHistoryEvent) => void;
  className?: string;
};

/** Slightly negative resting rhythm — flex `gap` can't go below 0px, so
 * pulling any tighter than the bare-adjacent (0px) rows needs a real
 * negative offset instead, applied per-row (`ROW_OVERLAP`) rather than
 * here. Safe to overlap: rows have a transparent border and real internal
 * padding (`ParagraphBlock`'s own `--spacing-sm`) at rest, so a few px of
 * row-to-row overlap eats into that padding, not into any visible edge or
 * the text itself. */
const ROW_GAP = '0px';
/** Each row is pulled up by half of this, top and bottom, so two adjacent
 * rows end up `ROW_OVERLAP` closer than the bare 0px `ROW_GAP` alone. */
const ROW_OVERLAP = 4;

/** `contentOffsetY` for the row immediately above an active *middle* gap
 * (`distance` `1` in `contentOffsetForRow` below, gap before some other
 * row) — negative pulls it up, away from the gap, opening breathing room.
 * Rows farther above fall off from this. */
const NEAREST_ABOVE_OFFSET_MIDDLE = -22;
/** Same, but for the row immediately above the *tail* gap specifically
 * (the last row, only when the active gap is `items.length`) — smaller
 * magnitude than `NEAREST_ABOVE_OFFSET_MIDDLE`: a middle gap also has a
 * row *below* it nudging closer via `NEAREST_BELOW_OFFSET`, balancing the
 * space around the divider from the other side; the tail gap has no row
 * below it to do that, so the same magnitude as the middle case reads as
 * noticeably more air above it than any middle gap has. */
const NEAREST_ABOVE_OFFSET_TAIL = -6;
/** `contentOffsetY` for the row the active gap renders against (`distance`
 * `1` below it) — small and negative, nudging it up toward the divider
 * rather than leaving it hugging the gap from below. Rows farther below
 * fall off from this. The tail gap has no row here (nothing follows it). */
const NEAREST_BELOW_OFFSET = -2;
/** Weight applied to the nearest-row offset above at each step of
 * index-distance from the active gap — index `0` is `distance` `1` (the
 * nearest row on that side), tapering out by the 4th. A local displacement
 * falloff (same feel as macOS Dock magnification) rather than only the
 * immediate neighbor moving while everything past it stays rigid and gets
 * visually crowded. Distances beyond this array's length get no offset
 * (`0`). */
const OFFSET_FALLOFF = [1, 0.6, 0.3, 0.12];

/** `contentOffsetY` for the row at `index`, given the currently active gap
 * (`null` when no drag is in progress) and the list's current `itemCount`
 * (to tell a middle gap from the tail gap, `dropGapIndex === itemCount`).
 * Rows above the gap (`index < dropGapIndex`) taper from
 * `NEAREST_ABOVE_OFFSET_MIDDLE` or `_TAIL`; the gap's own row and rows
 * below it (`index >= dropGapIndex`) taper from `NEAREST_BELOW_OFFSET` —
 * two separate falloff series, not one continuous one, since the two sides
 * move by different amounts even at distance `1` (see those constants).
 * Purely presentational: never read by `nearestGapIndex` or any row's own
 * measured rect, only passed to `ParagraphBlock`'s `contentOffsetY` prop. */
function contentOffsetForRow(
  index: number,
  dropGapIndex: number | null,
  itemCount: number,
): number {
  if (dropGapIndex === null) return 0;
  const distance = index < dropGapIndex ? dropGapIndex - index : index - dropGapIndex + 1;
  const weight = OFFSET_FALLOFF[distance - 1];
  if (weight === undefined) return 0;
  if (index < dropGapIndex) {
    const nearestAbove =
      dropGapIndex === itemCount ? NEAREST_ABOVE_OFFSET_TAIL : NEAREST_ABOVE_OFFSET_MIDDLE;
    return nearestAbove * weight;
  }
  return NEAREST_BELOW_OFFSET * weight;
}

/** Dragged-block-in-`DragOverlay` background: translucent + blurred
 * rather than `drag` chrome's normal opaque `--card` fill, so the
 * insertion rail (and its chevron) stay visible underneath as the block
 * passes over them — border/shadow untouched, so the lifted-card edge
 * stays as readable as any other `drag`-state block. `cn`'s
 * tailwind-merge resolves this against `ParagraphBlock`'s own internal
 * `bg-[color:var(--card)]` for the `drag` state (same utility group,
 * later value wins) rather than stacking both. Text stays full-opacity —
 * only the background surface is translucent. */
const DRAG_OVERLAY_SURFACE =
  'bg-[color:color-mix(in_srgb,var(--card)_50%,transparent)] backdrop-blur-[3px]';

function ParagraphListRow({
  item,
  isSelected,
  isDropBefore,
  contentOffsetY,
  isAnyDragging,
  autoFocus,
  autoFocusOffset,
  onSelect,
  onDeselect,
  onKeyReorder,
  onTextChange,
  onEnter,
  onBackspaceAtStart,
  registerRef,
}: {
  item: ParagraphListItem;
  isSelected: boolean;
  isDropBefore: boolean;
  contentOffsetY: number;
  isAnyDragging: boolean;
  autoFocus: boolean;
  autoFocusOffset: number;
  onSelect: (id: string) => void;
  onDeselect: () => void;
  onKeyReorder: (id: string, direction: -1 | 1) => void;
  onTextChange: (id: string, text: string) => void;
  onEnter: (id: string, caretOffset: number) => void;
  onBackspaceAtStart: (id: string) => void;
  registerRef: (id: string, node: HTMLElement | null) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useParagraphRow(item.id);

  const setRefs = React.useCallback(
    (node: HTMLElement | null) => {
      setNodeRef(node);
      registerRef(item.id, node);
    },
    [setNodeRef, registerRef, item.id],
  );

  return (
    // Always `relative` — the `DropTarget` below is absolutely positioned
    // against *this* box (see `use-paragraph-list-dnd-kit.ts`'s doc
    // comment for why it doesn't physically push this row's neighbor: an
    // in-flow, live-expanding indicator and pointer-driven gap resolution
    // that measures live rects turned out to be a feedback loop). `z-10`
    // only while this row's own gap is active — a `layout` reflow puts a
    // CSS `transform` on every animating row, and `transform` creates a
    // stacking context on its own, so DOM order alone can't be trusted to
    // keep the active rail above a mid-reflow neighbor.
    //
    // `layout="position"`, not plain `layout` — a Backspace-merge can
    // change *this* row's own height (the previous block gaining the
    // merged-in text, possibly wrapping an extra line) on the same render
    // that removes the row below it. Plain `layout` FLIPs size changes too,
    // which means Motion puts a live `scaleY` transform on this row while
    // its height tweens to the new value — and everything inside stretches
    // with it, including the plain (non-motion) contentEditable text, which
    // isn't part of Motion's own descendant-unscaling correction. A row
    // whose own content just grew should show the new text at its real
    // size immediately, not visibly stretched mid-animation.
    // `layout="position"` still FLIPs the x/y shift a sibling insert/remove
    // causes (the actual "glide to new position" this list wants) without
    // touching size, so a height change lands instantly instead.
    <motion.div
      layout="position"
      transition={LAYOUT_REFLOW}
      className={cn('relative flex flex-col', isDropBefore && 'z-10')}
      style={{ marginBlock: -(ROW_OVERLAP / 2) }}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-full z-10">
        <DropTarget active={isDropBefore} chevron />
      </div>
      <div
        // `overflow-hidden` only while this row has no falloff offset —
        // it exists to hide this row's own collapse/grow-back tween
        // (`gridTemplateRows` below), which needs it, but with zero slack
        // beyond the content's natural size it also clips a lifted
        // neighbor's translated content at the top. Safe to drop for a
        // nonzero `contentOffsetY`: a drop always clears `dropGapIndex`
        // (zeroing every row's offset) in the same tick `isDragging`
        // clears for the just-dropped row, so its own grow-back tween
        // never runs with clipping off — this condition and that one
        // never overlap.
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-normal ease-emphasized',
          contentOffsetY === 0 && 'overflow-hidden',
        )}
        style={{ gridTemplateRows: isDragging ? '0fr' : '1fr', opacity: isDragging ? 0 : 1 }}
      >
        <div className="min-h-0">
          <ParagraphBlock
            ref={setRefs}
            state={isSelected ? 'selected' : 'default'}
            handleProps={{
              ...attributes,
              ...listeners,
              onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
                // Direct arrow-key nudge while merely selected (no separate
                // "pick up" step) — only when dnd-kit isn't already mid
                // keyboard-drag on some row, so the two never both react to
                // the same keypress. Space/Enter (dnd-kit's own activation
                // keys) fall through untouched either way.
                if (
                  !isAnyDragging &&
                  isSelected &&
                  (event.key === 'ArrowUp' || event.key === 'ArrowDown')
                ) {
                  event.preventDefault();
                  onKeyReorder(item.id, event.key === 'ArrowUp' ? -1 : 1);
                  return;
                }
                listeners?.onKeyDown?.(event);
              },
            }}
            onDragStart={() => onSelect(item.id)}
            onSelect={() => onSelect(item.id)}
            onTextClick={() => {
              if (isSelected) onDeselect();
            }}
            onTextChange={(text) => onTextChange(item.id, text)}
            onEnter={(caretOffset) => onEnter(item.id, caretOffset)}
            onBackspaceAtStart={() => onBackspaceAtStart(item.id)}
            autoFocus={autoFocus}
            autoFocusOffset={autoFocusOffset}
            // Purely visual separation from an active DropTarget somewhere
            // nearby — the divider itself never moves (still fixed to
            // whichever row's own measured top it renders against), only
            // this block's *rendered* content nudges toward/away from it.
            // Precomputed per-row (`contentOffsetForRow`) so the falloff
            // across several rows on either side of the gap is one shared
            // function, not a per-row special case.
            contentOffsetY={contentOffsetY}
          >
            {item.text}
          </ParagraphBlock>
        </div>
      </div>
    </motion.div>
  );
}

export function ParagraphList({
  items,
  onItemsChange,
  onHistoryEvent,
  className,
}: ParagraphListProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [announcement, setAnnouncement] = React.useState('');
  // Which row should grab focus (and at what text offset) right now — a
  // block Enter just inserted (offset 0, freshly mounted), or the previous
  // block after a Backspace-merge (offset = the join point, already
  // mounted). Never explicitly cleared: ParagraphBlock's own effect only
  // re-fires on an actual *new* request (see its doc comment), so a stale
  // id/offset pair here just means no row currently matches it.
  const [autoFocusId, setAutoFocusId] = React.useState<string | null>(null);
  const [autoFocusOffset, setAutoFocusOffset] = React.useState(0);
  const rowRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const itemsRef = React.useRef(items);
  itemsRef.current = items;

  const registerRef = React.useCallback((id: string, node: HTMLElement | null) => {
    rowRefs.current[id] = node;
  }, []);
  const getRowNode = React.useCallback((id: string) => rowRefs.current[id] ?? null, []);

  const announceMove = React.useCallback((id: string, nextItems: ParagraphListItem[]) => {
    const position = nextItems.findIndex((item) => item.id === id);
    if (position === -1) return;
    setAnnouncement(`Moved paragraph to position ${position + 1} of ${nextItems.length}.`);
  }, []);

  const { sensors, activeId, dropGapIndex, onDragStart, onDragMove, onDragEnd, onDragCancel } =
    useParagraphListDragAndDrop({
      items,
      onItemsChange,
      onMoved: (id, fromIndex, toIndex) => {
        setSelectedId(id);
        announceMove(id, itemsRef.current);
        onHistoryEvent?.({ type: 'moveParagraph', id, fromIndex, toIndex });
      },
      getRowNode,
    });

  // Clicking anywhere outside the currently selected row's own DOM
  // subtree deselects it — including another row's text (which has no
  // handler of its own to select it) or blank space entirely. Clicking
  // the selected row's own text is handled separately, by
  // `onTextClick` below, since that's a click *inside* this row's
  // subtree, not outside it.
  React.useEffect(() => {
    if (!selectedId) return;

    function handlePointerDown(event: PointerEvent) {
      const selectedNode = selectedId ? rowRefs.current[selectedId] : null;
      if (selectedNode && event.target instanceof Node && !selectedNode.contains(event.target)) {
        setSelectedId(null);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [selectedId]);

  function handleKeyReorder(id: string, direction: -1 | 1) {
    const fromIndex = itemsRef.current.findIndex((item) => item.id === id);
    const next = moveParagraphByOffset(itemsRef.current, id, direction);
    if (next === itemsRef.current) return; // boundary no-op
    const toIndex = next.findIndex((item) => item.id === id);
    onItemsChange(next);
    announceMove(id, next);
    onHistoryEvent?.({ type: 'moveParagraph', id, fromIndex, toIndex });
  }

  // Coalesced to one event per edit session, not per keystroke — this
  // only fires on blur (see `ParagraphBlock.onTextChange`'s own doc
  // comment), same as the DOM commit itself.
  function handleTextChange(id: string, text: string) {
    const before = itemsRef.current.find((item) => item.id === id)?.text;
    onItemsChange(itemsRef.current.map((item) => (item.id === id ? { ...item, text } : item)));
    if (before !== undefined && before !== text) {
      onHistoryEvent?.({ type: 'editParagraph', id, before, after: text });
    }
  }

  // Enter always creates a genuinely empty new block right after this one
  // (not a split at the caret) and hands it focus/selection — selection
  // moves off the block being typed into, same as any other text
  // interaction (see the click-to-deselect handling above).
  function handleEnter(id: string, caretOffset: number) {
    const index = itemsRef.current.findIndex((item) => item.id === id);
    if (index === -1) return;
    const current = itemsRef.current[index];
    const textBefore = current.text.slice(0, caretOffset);
    const textAfter = current.text.slice(caretOffset);
    const newItem: ParagraphListItem = { id: crypto.randomUUID(), text: textAfter };
    const next = itemsRef.current.slice();
    next[index] = { ...current, text: textBefore };
    next.splice(index + 1, 0, newItem);
    onItemsChange(next);
    setAutoFocusId(newItem.id);
    setAutoFocusOffset(0);
    setSelectedId(null);
    onHistoryEvent?.({
      type: 'splitParagraph',
      sourceId: id,
      sourceTextBefore: current.text,
      newId: newItem.id,
      index: index + 1,
      caretOffset,
      textBefore,
      textAfter,
    });
  }

  // Backspace at offset 0 merges this block into the previous one — the
  // previous block keeps its id and gains this block's text appended (with
  // exactly one joining space inserted if neither side already has
  // whitespace there, so a merge never runs two words together or lands
  // straight after the previous block's own closing punctuation), this
  // block's id goes away entirely. First block in the list: no previous
  // block to merge into, so this is a structural no-op (Backspace still
  // did nothing to the text, since ParagraphBlock only calls this for a
  // collapsed caret genuinely at 0 — nothing was there to delete either).
  function handleBackspaceAtStart(id: string) {
    const index = itemsRef.current.findIndex((item) => item.id === id);
    if (index <= 0) return;
    const current = itemsRef.current[index];
    const previous = itemsRef.current[index - 1];
    // A join with nothing between the two halves reads as one run-on word
    // (or lands straight after whatever punctuation the previous block
    // happened to end on) unless one side already supplies the
    // whitespace — insert exactly one space only when neither does.
    const needsSpace =
      previous.text.length > 0 &&
      current.text.length > 0 &&
      !/\s$/.test(previous.text) &&
      !/^\s/.test(current.text);
    const joinOffset = previous.text.length;
    const survivingTextAfter = previous.text + (needsSpace ? ' ' : '') + current.text;
    const next = itemsRef.current.slice();
    next[index - 1] = { ...previous, text: survivingTextAfter };
    next.splice(index, 1);
    onItemsChange(next);
    setAutoFocusId(previous.id);
    setAutoFocusOffset(joinOffset);
    setSelectedId(null);
    onHistoryEvent?.({
      type: 'mergeParagraphs',
      survivingId: previous.id,
      survivingTextBefore: previous.text,
      survivingTextAfter,
      removedId: current.id,
      removedText: current.text,
      removedIndex: index,
      insertedSpace: needsSpace,
      joinOffset,
    });
  }

  const activeItem = activeId ? items.find((item) => item.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={paragraphCollisionDetection}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div data-slot="paragraph-list" className={cn('flex flex-col', className)} style={{ gap: ROW_GAP }}>
        {items.map((item, index) => (
          <ParagraphListRow
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            isDropBefore={dropGapIndex === index}
            contentOffsetY={contentOffsetForRow(index, dropGapIndex, items.length)}
            isAnyDragging={activeId !== null}
            autoFocus={autoFocusId === item.id}
            autoFocusOffset={autoFocusOffset}
            onSelect={setSelectedId}
            onDeselect={() => setSelectedId(null)}
            onKeyReorder={handleKeyReorder}
            onTextChange={handleTextChange}
            onEnter={handleEnter}
            onBackspaceAtStart={handleBackspaceAtStart}
            registerRef={registerRef}
          />
        ))}
        {/* `h-0` wrapper, not a plain flex sibling — every *other* gap's
            `DropTarget` is absolutely positioned and contributes zero
            height to the list; this one, having no following row to
            anchor `bottom-full` against, used to render as a genuine flex
            child instead, so activating it actually grew the list's own
            rendered height (confirmed: ~29px). In a page that responds to
            that (a centered story, a container that reflows around its
            content), every row silently shifts while this is active —
            harmless while hovering it, but the shift doesn't reverse
            until this collapses back, so an upward sweep started right
            after leaving the tail gap was judging thresholds against
            geometry that was still mid-shift. Zero-height + `absolute
            top-0` makes it match every other gap's footprint exactly:
            visually unchanged, but it can never move anything else. */}
        <div className={cn('relative h-0', dropGapIndex === items.length && 'z-10')}>
          <DropTarget
            active={dropGapIndex === items.length}
            chevron
            className="absolute inset-x-0 top-0"
          />
        </div>
      </div>
      <DragOverlay>
        {activeItem ? (
          <ParagraphBlock state="drag" className={DRAG_OVERLAY_SURFACE}>
            {activeItem.text}
          </ParagraphBlock>
        ) : null}
      </DragOverlay>
      <div aria-live="polite" role="status" className="sr-only">
        {announcement}
      </div>
    </DndContext>
  );
}
