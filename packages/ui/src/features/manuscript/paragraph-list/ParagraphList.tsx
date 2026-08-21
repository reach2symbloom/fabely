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
 * The `DropTarget` for the gap *before* a row is rendered inside that
 * row's own wrapper, absolutely positioned (`bottom-full`) rather than as
 * a sibling in normal flow — the earlier version put every `DropTarget`
 * in flex flow with a negative-margin compensation trick to avoid double-
 * counting the row gap, which technically netted out correctly but still
 * left the *resting* list looking too spread out (each `DropTarget`,
 * however compensated, still ate its own flex-gap budget). Absolute
 * positioning removes it from flow entirely: at rest it contributes
 * nothing to row spacing, and expanding it while `active` overlays the
 * gap visually without shifting any row's actual position. The tail gap
 * (after the last row) has no following row to attach to, so it's the
 * one `DropTarget` still rendered as a plain flex sibling at the end.
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
import {
  paragraphCollisionDetection,
  useParagraphListDragAndDrop,
  useParagraphRow,
} from './use-paragraph-list-dnd-kit';

export type { ParagraphListItem };

export type ParagraphListProps = {
  items: ParagraphListItem[];
  onItemsChange: (items: ParagraphListItem[]) => void;
  className?: string;
};

/** Modest resting rhythm between blocks — the actual inter-block spacing
 * now that `DropTarget` no longer occupies a flex slot for the gaps
 * before each row (see module doc comment). */
const ROW_GAP = 'var(--spacing-xs)';

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
  isAnyDragging,
  onSelect,
  onDeselect,
  onKeyReorder,
  registerRef,
}: {
  item: ParagraphListItem;
  isSelected: boolean;
  isDropBefore: boolean;
  isAnyDragging: boolean;
  onSelect: (id: string) => void;
  onDeselect: () => void;
  onKeyReorder: (id: string, direction: -1 | 1) => void;
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
    <motion.div layout transition={LAYOUT_REFLOW} className="relative">
      <div className="pointer-events-none absolute inset-x-0 bottom-full z-10">
        <DropTarget active={isDropBefore} />
      </div>
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
        className={cn(isDragging && 'opacity-40')}
      >
        {item.text}
      </ParagraphBlock>
    </motion.div>
  );
}

export function ParagraphList({ items, onItemsChange, className }: ParagraphListProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [announcement, setAnnouncement] = React.useState('');
  const rowRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const itemsRef = React.useRef(items);
  itemsRef.current = items;

  const registerRef = React.useCallback((id: string, node: HTMLElement | null) => {
    rowRefs.current[id] = node;
  }, []);

  const announceMove = React.useCallback((id: string, nextItems: ParagraphListItem[]) => {
    const position = nextItems.findIndex((item) => item.id === id);
    if (position === -1) return;
    setAnnouncement(`Moved paragraph to position ${position + 1} of ${nextItems.length}.`);
  }, []);

  const { sensors, activeId, dropGapIndex, onDragStart, onDragMove, onDragEnd, onDragCancel } =
    useParagraphListDragAndDrop({
      items,
      onItemsChange,
      onMoved: (id) => {
        setSelectedId(id);
        announceMove(id, itemsRef.current);
      },
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
    const next = moveParagraphByOffset(itemsRef.current, id, direction);
    if (next === itemsRef.current) return; // boundary no-op
    onItemsChange(next);
    announceMove(id, next);
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
            isAnyDragging={activeId !== null}
            onSelect={setSelectedId}
            onDeselect={() => setSelectedId(null)}
            onKeyReorder={handleKeyReorder}
            registerRef={registerRef}
          />
        ))}
        <DropTarget active={dropGapIndex === items.length} />
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
