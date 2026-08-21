/**
 * dnd-kit adapter for `paragraph-list-dnd.ts` — the ONLY file in this pair
 * allowed to know dnd-kit exists, same split as Chapter Menu's
 * `use-outline-dnd-kit.ts`.
 *
 * Built on `@dnd-kit/core`'s `useDraggable` + `useDroppable`, not
 * `@dnd-kit/sortable`'s `useSortable` — same reasoning as Chapter Menu
 * (see that file's doc comment): sortable auto-reflows every sibling to
 * "make room" as you drag, which would fight the explicit `DropTarget`
 * atom this list renders at the prospective insertion gap. The dragged
 * row's own slot collapses on pickup (see `ParagraphList.tsx`); a
 * `ParagraphBlock` in `drag` chrome follows the pointer via `DragOverlay`
 * instead.
 *
 * The active gap is resolved in `onDragMove` by `nearestGapIndex` —
 * genuinely pointer-driven: every gap between the *current* rows gets a Y
 * coordinate from a fresh `getBoundingClientRect()` (via `getRowNode`,
 * live DOM refs Paragraph List already owns — not dnd-kit's own
 * `over`/`rect` cache, which lags during a `layout` reflow, e.g. right
 * after the source row's own collapse animates its neighbors into new
 * positions: dnd-kit's droppable rects only re-measure on specific
 * triggers, not every animation frame, so comparing against them mid-FLIP
 * could still read a pre-reflow position), and the pointer position comes
 * from `activatorEvent.clientY + delta.y` (dnd-kit's `delta` is
 * cumulative since drag start), not `active.rect.current.translated` (the
 * dragged item's own ghost rect — whatever's tall about the dragged block
 * carries into that rect's *top* edge, putting the resolved gap however
 * far that edge sits above wherever the pointer actually is inside it).
 * Neither dnd-kit's collision detection nor the dragged item's own
 * geometry has any say in which gap is active; `paragraphCollisionDetection`
 * still runs (dnd-kit's `KeyboardSensor` needs *some* collision system to
 * move `over` between droppables), but nothing here reads its result for
 * pointer-driven drags.
 *
 * `DropTarget` itself stays absolutely positioned (`ParagraphList.tsx`),
 * not a normal flex sibling that physically pushes rows apart while
 * active. That was tried: measuring rows live (the paragraph above) while
 * an in-flow `DropTarget` is *also* live-expanding based on that same
 * measurement is a feedback loop — activating a gap push-opens space
 * above the next row, which moves that row, which changes what the very
 * next `getBoundingClientRect()` reads for it, which can flip the
 * resolved gap back, closing the space, moving the row back, flipping the
 * gap again. An absolutely positioned overlay can render at any height
 * without ever moving anything it didn't already sit on top of — the
 * geometry this file measures stays stable while a drag is in progress,
 * which is what removes the loop, not a smarter hysteresis value.
 */

'use client';

import * as React from 'react';
import {
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  KeyboardSensor,
  PointerSensor,
  type CollisionDetection,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

import {
  isParagraphMoveNoOp,
  reorderParagraphs,
  type ParagraphGapIndex,
  type ParagraphListItem,
} from './paragraph-list-dnd';

export type UseParagraphListDragAndDropOptions = {
  items: ParagraphListItem[];
  onItemsChange: (items: ParagraphListItem[]) => void;
  /** Fires once a drag resolves to a real move, with the id that just
   * moved and its index before/after — callers use the id to keep it
   * `selected` after the drop, and the indices to emit a `moveParagraph`
   * history event (see `paragraph-list-history.ts`). Both indices are
   * captured at commit time, not re-derived later. */
  onMoved?: (id: string, fromIndex: number, toIndex: number) => void;
  /** Live DOM node for a row, keyed by item id — Paragraph List's own ref
   * map. Measured fresh on every move; see module doc comment for why
   * dnd-kit's own rect cache isn't used instead. */
  getRowNode: (id: string) => HTMLElement | null;
};

export type UseParagraphListDragAndDropResult = {
  sensors: ReturnType<typeof useSensors>;
  activeId: string | null;
  dropGapIndex: ParagraphGapIndex | null;
  onDragStart: (event: DragStartEvent) => void;
  onDragMove: (event: DragMoveEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragCancel: () => void;
};

/** Still needed for the `KeyboardSensor`'s own `over` tracking — not
 * consulted for pointer-driven gap resolution (see module doc comment). */
export const paragraphCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};

/** Current pointer Y for a pointer-driven drag; `null` for a
 * keyboard-driven one (`activatorEvent` is a `KeyboardEvent`, no real
 * pointer position to read). */
function currentPointerY(event: DragMoveEvent | DragEndEvent): number | null {
  const activator = event.activatorEvent;
  if (typeof (activator as Partial<PointerEvent>).clientY === 'number') {
    return (activator as PointerEvent).clientY + event.delta.y;
  }
  return null;
}

/** A few px of stickiness around the currently-active gap so hovering
 * almost exactly on a boundary doesn't flicker between two adjacent gaps
 * on sub-pixel pointer jitter — deliberately small; this is not a
 * generous dead zone, just enough to settle a tie. */
const GAP_HYSTERESIS_PX = 4;

/**
 * Walks the live rows top to bottom and finds the one whose own measured
 * span (`top`..`bottom`) actually contains `pointerY`, splitting *that*
 * row's own midpoint — not, e.g., the average of its top edge and the
 * previous row's bottom edge, which is a materially different number for
 * anything but same-height neighbors, and for a genuinely tall row (a
 * long, multi-line paragraph) put the flip-over point however far a
 * neighboring row's own edge happened to sit, not halfway through the row
 * the pointer is actually over. Splitting each row against only its own
 * height means a tall row's boundary is exactly as responsive as a short
 * one's, and matches "top half of a row → before it, bottom half → after
 * it" — the same semantics the pointer-precision fix above already
 * assumed, just computed from live rects instead of dnd-kit's `over`.
 *
 * A row this list is currently dragging has already collapsed to ~0
 * height (see `ParagraphList.tsx`), so it never meaningfully "contains"
 * any pointer position — it's skipped by id, not by measuring a
 * near-zero `rect.height`: the collapsing wrapper's own grid track does
 * shrink to `0px`, but `ParagraphBlock` inside it keeps reporting its
 * full, un-shrunk `getBoundingClientRect()` regardless (the ancestor's
 * `overflow-hidden` clips it from view, it doesn't shrink the child's own
 * box) — so a height check here would silently never fire, leaving the
 * dragged row's stale rect competing for gap resolution the entire drag.
 * Rows with no live node yet (shouldn't happen post-mount, but
 * `getRowNode` is a plain lookup, not a guarantee) are skipped the same
 * way as a missing rect always was.
 */
function nearestGapIndex(
  items: ParagraphListItem[],
  pointerY: number,
  getRowNode: (id: string) => HTMLElement | null,
  currentGapIndex: ParagraphGapIndex | null,
  draggedId: string,
): ParagraphGapIndex | null {
  if (items.length === 0) return null;

  let resolved: ParagraphGapIndex | null = null;
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === draggedId) continue;
    const rect = getRowNode(items[i].id)?.getBoundingClientRect();
    if (!rect) continue;

    if (pointerY <= rect.top) {
      resolved = i;
      break;
    }
    if (pointerY < rect.bottom) {
      // Ascending (the active gap is currently below this row, i.e. the
      // pointer arrived from beneath and is moving up through this row's
      // body without yet reaching its own top): stay at `i + 1` rather
      // than jumping to `i` at the row's midpoint. `i`'s own `DropTarget`
      // renders at `rect.top`, not the midpoint — resolving to `i` here
      // would light it up while the pointer is still up to half a row
      // away from where it's drawn. The clause above already resolves to
      // `i` the instant `pointerY` actually reaches `rect.top`, so this
      // only delays the switch until the divider and the pointer meet.
      // Descending (no established "coming from below" state) keeps the
      // row's own midpoint — that direction already matches the pointer
      // correctly, since entering a row from above is caught by the
      // clause above right as it happens.
      const risingFromBelow = currentGapIndex !== null && currentGapIndex > i;
      if (risingFromBelow) {
        resolved = i + 1;
      } else {
        const rowMidY = rect.top + rect.height / 2;
        resolved = pointerY < rowMidY ? i : i + 1;
      }
      break;
    }
    // Past this row entirely — keep walking; if nothing else matches,
    // the loop falls through to the tail gap below.
    resolved = i + 1;
  }
  if (resolved === null) return null;

  // A few px of stickiness around whichever gap was already active, so
  // hovering almost exactly on a boundary doesn't flicker between two
  // adjacent gaps on sub-pixel pointer jitter.
  if (currentGapIndex !== null && currentGapIndex !== resolved) {
    const currentRow = getRowNode(items[Math.min(currentGapIndex, items.length - 1)]?.id ?? '');
    if (currentRow) {
      const currentRect = currentRow.getBoundingClientRect();
      const currentBoundaryY =
        currentGapIndex === items.length ? currentRect.bottom : currentRect.top;
      if (Math.abs(currentBoundaryY - pointerY) < GAP_HYSTERESIS_PX) {
        return currentGapIndex;
      }
    }
  }

  return resolved;
}

export function useParagraphListDragAndDrop({
  items,
  onItemsChange,
  onMoved,
  getRowNode,
}: UseParagraphListDragAndDropOptions): UseParagraphListDragAndDropResult {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      /* Matches ParagraphBlock's own DRAG_THRESHOLD_PX — a plain click
         never reaches either threshold, so the two never disagree about
         whether a given press turned into a drag. */
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor),
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [dropGapIndex, setDropGapIndex] = React.useState<ParagraphGapIndex | null>(null);
  const itemsRef = React.useRef(items);
  itemsRef.current = items;
  const dropGapIndexRef = React.useRef(dropGapIndex);
  dropGapIndexRef.current = dropGapIndex;

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  /** Pointer-driven: nearest live gap to the actual cursor. Keyboard-
   * driven (no real pointer): dnd-kit's own collision-detected `over`,
   * placed 'before' it — simpler than the pointer path needs to be, since
   * keyboard movement is quantized per keypress rather than continuous,
   * and Paragraph List's primary keyboard-reorder path (`ArrowUp`/`Down`
   * on a merely-*selected* row) doesn't go through dnd-kit's drag
   * lifecycle at all; this only covers dnd-kit's own supplementary
   * Space-to-pick-up flow. */
  function resolveGapIndex(event: DragMoveEvent | DragEndEvent): ParagraphGapIndex | null {
    const pointerY = currentPointerY(event);
    if (pointerY !== null) {
      return nearestGapIndex(
        itemsRef.current,
        pointerY,
        getRowNode,
        dropGapIndexRef.current,
        String(event.active.id),
      );
    }
    const overId = event.over ? String(event.over.id) : null;
    const overIndex = overId ? itemsRef.current.findIndex((item) => item.id === overId) : -1;
    return overIndex === -1 ? null : overIndex;
  }

  function onDragMove(event: DragMoveEvent) {
    // Not filtered through `isParagraphMoveNoOp` here — the two gaps
    // touching the dragged item's own current position are exactly the
    // block's original spot, and hovering back over it should still light
    // up a `DropTarget` there ("drop it back where it was" is a valid,
    // indicated choice, not a dead zone with no feedback). The no-op guard
    // stays in `onDragEnd`/`reorderParagraphs` below, where it belongs —
    // actually dropping there is still skipped as the zero-effect move it
    // is, just not hidden from the pointer on the way there.
    const resolved = resolveGapIndex(event);
    setDropGapIndex((current) => (current === resolved ? current : resolved));
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveId(null);
    setDropGapIndex(null);

    const activeIdStr = String(event.active.id);
    const gapIndex = resolveGapIndex(event);
    if (gapIndex === null || isParagraphMoveNoOp(itemsRef.current, activeIdStr, gapIndex)) {
      return;
    }

    const fromIndex = itemsRef.current.findIndex((item) => item.id === activeIdStr);
    const next = reorderParagraphs(itemsRef.current, activeIdStr, gapIndex);
    const toIndex = next.findIndex((item) => item.id === activeIdStr);
    onItemsChange(next);
    onMoved?.(activeIdStr, fromIndex, toIndex);
  }

  function onDragCancel() {
    setActiveId(null);
    setDropGapIndex(null);
  }

  return { sensors, activeId, dropGapIndex, onDragStart, onDragMove, onDragEnd, onDragCancel };
}

/** Row wrapper — draggable AND droppable on the same element, but never
 * transforms itself; the original stays anchored (see module doc
 * comment), just dimmed via `isDragging`. */
export function useParagraphRow(id: string) {
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({ id });
  const { setNodeRef: setDropRef } = useDroppable({ id });

  const setNodeRef = React.useCallback(
    (node: HTMLElement | null) => {
      setDragRef(node);
      setDropRef(node);
    },
    [setDragRef, setDropRef],
  );

  return { attributes, listeners, setNodeRef, isDragging };
}
