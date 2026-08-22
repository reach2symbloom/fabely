/**
 * dnd-kit adapter for `outline-dnd.ts` — the ONLY file in this pair allowed
 * to know dnd-kit exists. Translates pointer/keyboard drag events into the
 * reducer's `{ activeId, overId, placement }` shape and applies the result;
 * the reducer itself never sees a dnd-kit type or a pixel.
 *
 * Deliberately built on `@dnd-kit/core`'s `useDraggable` + `useDroppable`,
 * not `@dnd-kit/sortable`'s `useSortable` — sortable's whole point is
 * auto-reflowing every sibling to "make room" as you drag, which is the
 * wrong interaction here. The original row stays anchored at its own
 * position (dragging is not destructive until you actually drop), a
 * translucent "hologram" copy follows the pointer via `DragOverlay`, and a
 * separate divider — driven by `dropIndicator` below — shows where a drop
 * would land. Nothing else moves.
 *
 * `dropIndicator.placement` ('before' | 'nest') is resolved from geometry
 * here, not in the reducer: comparing the dragged ghost's current top edge
 * against the vertical midpoint of whatever it's over. Top half of a
 * target → 'before' (sibling, ahead of it); bottom half of a chapter/scene
 * → 'nest' (its new first child); bottom half of anything else has no nest
 * zone, so it also resolves to 'before' — there's always a way to land
 * ahead of an item, never behind one directly (drop on the top half of the
 * NEXT item instead, or nest into the last container-capable item on the
 * page to reach the very end of its children).
 *
 * Keyboard dragging has no pointer position to read, so it always resolves
 * 'before' — arrow-key movement is plain sibling reordering. Nesting via
 * keyboard isn't wired up (⚠️ ASSUMPTION — no obvious non-pointer gesture
 * for "the bottom half of a row"; revisit if keyboard nesting turns out to
 * matter).
 *
 * Rejected/needs-confirmation drops (the chapter-with-scenes depth-overflow
 * case) surface via `onRejected` / `pendingConfirmation` instead of a
 * silent no-op, so the caller can drive a visible signal (shake, a dialog).
 */

'use client';

import * as React from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

import {
  canOwnChildren,
  isOutlineDropIntoOwnSubtree,
  isOutlineDropNoOp,
  reorderOutline,
  type OutlineDropPlacement,
  type OutlineItem,
} from './outline-dnd';

export type DropIndicator = {
  overId: string;
  placement: OutlineDropPlacement;
};

export type PendingConfirmation = {
  reason: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export type UseOutlineDragAndDropOptions = {
  items: OutlineItem[];
  onItemsChange: (items: OutlineItem[]) => void;
  /** Persistence hook with the exact move that produced the replacement array. */
  onMove?: (items: OutlineItem[], move: { activeId: string; overId: string; placement: OutlineDropPlacement; resolution?: 'flatten' }) => void;
  /** A drop was rejected outright (dragged/target vanished mid-drag). */
  onRejected?: (activeId: string, reason: string) => void;
};

export type UseOutlineDragAndDropResult = {
  sensors: ReturnType<typeof useSensors>;
  activeId: string | null;
  /** Id of the item whose drop was just rejected — drive a shake off this. */
  rejectedId: string | null;
  dropIndicator: DropIndicator | null;
  pendingConfirmation: PendingConfirmation | null;
  onDragStart: (event: DragStartEvent) => void;
  onDragMove: (event: DragMoveEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragCancel: () => void;
};

const REJECTED_SIGNAL_MS = 420;

/** Prefer the pointer's unambiguous target over competing row-overlap scores. */
export const outlineCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  return pointerCollisions.length > 0
    ? pointerCollisions
    : rectIntersection(args);
};

/** Top edge of the dragged ghost vs. the vertical midpoint of the target. */
function placementFromGeometry(event: DragMoveEvent | DragEndEvent): OutlineDropPlacement {
  const overRect = event.over?.rect;
  const draggedRect = event.active.rect.current.translated;
  if (!overRect || !draggedRect) return 'before';
  const overMidY = overRect.top + overRect.height / 2;
  return draggedRect.top < overMidY ? 'before' : 'nest';
}

export function useOutlineDragAndDrop({
  items,
  onItemsChange,
  onMove,
  onRejected,
}: UseOutlineDragAndDropOptions): UseOutlineDragAndDropResult {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      /* A few px of slop before a drag starts — otherwise every click
         (e.g. the double-click that renames) would also start a drag. */
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor),
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [rejectedId, setRejectedId] = React.useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = React.useState<DropIndicator | null>(
    null,
  );
  const [pendingConfirmation, setPendingConfirmation] =
    React.useState<PendingConfirmation | null>(null);
  const rejectedTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(
    undefined,
  );
  const keyboardDragRef = React.useRef(false);
  const itemsRef = React.useRef(items);
  itemsRef.current = items;

  React.useEffect(
    () => () => {
      clearTimeout(rejectedTimeoutRef.current);
    },
    [],
  );

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
    keyboardDragRef.current = event.activatorEvent.type.startsWith('key');
    setPendingConfirmation(null);
  }

  function resolvePlacement(event: DragMoveEvent | DragEndEvent): OutlineDropPlacement {
    return keyboardDragRef.current ? 'before' : placementFromGeometry(event);
  }

  function computeIndicator(event: DragMoveEvent): DropIndicator | null {
    if (!event.over) return null;
    const overId = String(event.over.id);
    const activeIdStr = String(event.active.id);
    if (isOutlineDropIntoOwnSubtree(itemsRef.current, activeIdStr, overId)) {
      return null;
    }
    const overItem = itemsRef.current.find((item) => item.id === overId);
    const wantsNest = resolvePlacement(event) === 'nest';
    const placement: OutlineDropPlacement =
      wantsNest && overItem && canOwnChildren(overItem.kind) ? 'nest' : 'before';
    if (
      isOutlineDropNoOp(itemsRef.current, {
        activeId: activeIdStr,
        overId,
        placement,
      })
    ) {
      return null;
    }
    return { overId, placement };
  }

  function onDragMove(event: DragMoveEvent) {
    const next = computeIndicator(event);
    setDropIndicator((current) =>
      current?.overId === next?.overId && current?.placement === next?.placement
        ? current
        : next,
    );
  }

  function applyMove(activeIdStr: string, overId: string, placement: OutlineDropPlacement) {
    const result = reorderOutline(itemsRef.current, {
      activeId: activeIdStr,
      overId,
      placement,
    });

    if (result.type === 'moved') {
      onItemsChange(result.items);
      onMove?.(result.items, { activeId: activeIdStr, overId, placement });
      return;
    }

    if (result.type === 'needs-confirmation') {
      setPendingConfirmation({
        reason: result.reason,
        onConfirm: () => {
          const flattened = reorderOutline(itemsRef.current, {
            ...result.event,
            resolution: 'flatten',
          });
          if (flattened.type === 'moved') {
            onItemsChange(flattened.items);
            onMove?.(flattened.items, { activeId: activeIdStr, overId, placement, resolution: 'flatten' });
          }
          setPendingConfirmation(null);
        },
        onCancel: () => setPendingConfirmation(null),
      });
      return;
    }

    // type === 'rejected'
    onRejected?.(activeIdStr, result.reason);
    clearTimeout(rejectedTimeoutRef.current);
    setRejectedId(activeIdStr);
    rejectedTimeoutRef.current = setTimeout(() => {
      setRejectedId((current) => (current === activeIdStr ? null : current));
    }, REJECTED_SIGNAL_MS);
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveId(null);
    setDropIndicator(null);
    const placement = resolvePlacement(event);
    keyboardDragRef.current = false;
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = String(active.id);
    const overId = String(over.id);
    if (isOutlineDropIntoOwnSubtree(itemsRef.current, activeIdStr, overId)) {
      return;
    }

    const overItem = itemsRef.current.find((item) => item.id === overId);
    const resolved: OutlineDropPlacement =
      placement === 'nest' && overItem && canOwnChildren(overItem.kind)
        ? 'nest'
        : 'before';

    if (
      isOutlineDropNoOp(itemsRef.current, {
        activeId: activeIdStr,
        overId,
        placement: resolved,
      })
    ) {
      return;
    }

    applyMove(activeIdStr, overId, resolved);
  }

  function onDragCancel() {
    setActiveId(null);
    setDropIndicator(null);
    keyboardDragRef.current = false;
  }

  return {
    sensors,
    activeId,
    rejectedId,
    dropIndicator,
    pendingConfirmation,
    onDragStart,
    onDragMove,
    onDragEnd,
    onDragCancel,
  };
}

/** Row wrapper — draggable AND droppable, but never transforms itself; the
 * original stays anchored in place (see module doc comment). Expanded
 * branches render inside this wrapper too, so refs deliberately measure the
 * first visible row rather than the whole descendant tree. */
export function useOutlineRow(id: string) {
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } =
    useDraggable({ id });
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id });

  const setNodeRef = React.useCallback(
    (node: HTMLElement | null) => {
      const visibleRow =
        node?.querySelector<HTMLElement>(
          '[data-slot="chapter-menu-list-item"], [data-slot="add-section-inline-button"]',
        ) ?? node;
      setDragRef(visibleRow);
      setDropRef(visibleRow);
    },
    [setDragRef, setDropRef],
  );

  return { attributes, listeners, setNodeRef, isDragging, isOver };
}
