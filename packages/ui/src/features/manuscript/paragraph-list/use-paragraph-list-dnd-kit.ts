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
 * row's original stays anchored (dimmed, not hidden); a `ParagraphBlock`
 * in `drag` chrome follows the pointer via `DragOverlay` instead.
 *
 * Each row is both draggable and droppable (its own id). A gap index
 * (`0..items.length`) is resolved from geometry in `onDragMove` — the
 * dragged ghost's current top edge vs. the vertical midpoint of whatever
 * row it's over: top half → the gap ahead of that row, bottom half → the
 * gap after it. Reusing dnd-kit's own collision-detected `over` for *which
 * row*, and only geometry for *which side of it*, means the whole flat
 * list needs exactly `items.length` droppables, not `items.length + 1` —
 * the tail gap (after the last row) is just that row's bottom half.
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
   * moved — callers use this to keep it `selected` after the drop. */
  onMoved?: (id: string) => void;
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

/** Prefer the pointer's unambiguous target over competing row-overlap
 * scores — same choice Chapter Menu's outline drag makes. */
export const paragraphCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};

/** Which side of `event.over`'s row the dragged ghost's top edge sits on. */
function gapIndexFromGeometry(
  items: ParagraphListItem[],
  event: DragMoveEvent | DragEndEvent,
): ParagraphGapIndex | null {
  const overId = event.over ? String(event.over.id) : null;
  const overIndex = overId ? items.findIndex((item) => item.id === overId) : -1;
  const overRect = event.over?.rect;
  const draggedRect = event.active.rect.current.translated;
  if (overIndex === -1 || !overRect || !draggedRect) return null;

  const overMidY = overRect.top + overRect.height / 2;
  return draggedRect.top < overMidY ? overIndex : overIndex + 1;
}

export function useParagraphListDragAndDrop({
  items,
  onItemsChange,
  onMoved,
}: UseParagraphListDragAndDropOptions): UseParagraphListDragAndDropResult {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      /* Matches ParagraphBlock's own DRAG_THRESHOLD_PX — a plain click
         never reaches either threshold, so the two never disagree about
         whether a given press turned into a drag. */
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor),
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [dropGapIndex, setDropGapIndex] = React.useState<ParagraphGapIndex | null>(null);
  const itemsRef = React.useRef(items);
  itemsRef.current = items;

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function onDragMove(event: DragMoveEvent) {
    const activeIdStr = String(event.active.id);
    const next = gapIndexFromGeometry(itemsRef.current, event);
    const resolved =
      next !== null && !isParagraphMoveNoOp(itemsRef.current, activeIdStr, next) ? next : null;
    setDropGapIndex((current) => (current === resolved ? current : resolved));
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveId(null);
    setDropGapIndex(null);

    const activeIdStr = String(event.active.id);
    const gapIndex = gapIndexFromGeometry(itemsRef.current, event);
    if (gapIndex === null || isParagraphMoveNoOp(itemsRef.current, activeIdStr, gapIndex)) {
      return;
    }

    onItemsChange(reorderParagraphs(itemsRef.current, activeIdStr, gapIndex));
    onMoved?.(activeIdStr);
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
