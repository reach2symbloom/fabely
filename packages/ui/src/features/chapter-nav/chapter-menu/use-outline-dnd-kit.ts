/**
 * dnd-kit adapter for `outline-dnd.ts` — the ONLY file in this pair allowed
 * to know dnd-kit exists. Translates pointer/keyboard drag events into the
 * reducer's `{ activeId, overId }` shape and applies the result; the
 * reducer itself never sees a dnd-kit type.
 *
 * Wires `@dnd-kit/core`'s Pointer + Keyboard sensors (keyboard dragging —
 * space to pick up, arrows to move, space to drop — is a `KeyboardSensor`
 * default, not extra work here) and reports rejected drops (the
 * chapter-with-scenes guard) via `onRejected` instead of a silent no-op, so
 * the caller can drive a visible signal (shake, blocked cursor, toast…).
 */

'use client';

import * as React from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragCancelEvent,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { reorderOutline, type OutlineItem } from './outline-dnd';

export type UseOutlineDragAndDropOptions = {
  items: OutlineItem[];
  onItemsChange: (items: OutlineItem[]) => void;
  /** A drop was rejected (e.g. a chapter with scenes) — nothing changed. */
  onRejected?: (activeId: string, reason: string) => void;
};

export type UseOutlineDragAndDropResult = {
  sensors: ReturnType<typeof useSensors>;
  collisionDetection: typeof closestCenter;
  /** Id of the item currently being dragged, for a DragOverlay if wanted. */
  activeId: string | null;
  /** Id of the item whose drop was just rejected — drive a shake off this. */
  rejectedId: string | null;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragCancel: (event: DragCancelEvent) => void;
};

const REJECTED_SIGNAL_MS = 420;

export function useOutlineDragAndDrop({
  items,
  onItemsChange,
  onRejected,
}: UseOutlineDragAndDropOptions): UseOutlineDragAndDropResult {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      /* A few px of slop before a drag starts — otherwise every click
         (e.g. the double-click that renames) would also start a drag. */
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [rejectedId, setRejectedId] = React.useState<string | null>(null);
  const rejectedTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(
    undefined,
  );

  React.useEffect(
    () => () => {
      clearTimeout(rejectedTimeoutRef.current);
    },
    [],
  );

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = String(active.id);
    const result = reorderOutline(items, {
      activeId: activeIdStr,
      overId: String(over.id),
    });

    if (result.type === 'rejected') {
      onRejected?.(activeIdStr, result.reason);
      clearTimeout(rejectedTimeoutRef.current);
      setRejectedId(activeIdStr);
      rejectedTimeoutRef.current = setTimeout(() => {
        setRejectedId((current) => (current === activeIdStr ? null : current));
      }, REJECTED_SIGNAL_MS);
      return;
    }

    onItemsChange(result.items);
  }

  function onDragCancel() {
    setActiveId(null);
  }

  return {
    sensors,
    collisionDetection: closestCenter,
    activeId,
    rejectedId,
    onDragStart,
    onDragEnd,
    onDragCancel,
  };
}
