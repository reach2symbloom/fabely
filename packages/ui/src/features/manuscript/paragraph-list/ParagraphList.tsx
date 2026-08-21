/**
 * Paragraph List — composes `ParagraphBlock` (molecule) and `DropTarget`
 * (atom) into an actual drag-reorderable manuscript. This is the only
 * layer that owns ordering: individual `ParagraphBlock`s never decide
 * where they sit relative to one another, they only report "I was
 * clicked" / "I started being dragged" via `onSelect`/`onDragStart` (see
 * that component's README) — this list decides what those mean for the
 * array.
 *
 * `state` per row is `selected` while a row is the most-recently
 * clicked/dragged one, and separately dimmed (`opacity-40`, not `drag`
 * chrome) while dnd-kit reports it as the actively-dragged row — the row
 * that's actually shown with `drag` chrome is a `DragOverlay` copy
 * following the pointer, not the anchored original. See
 * `use-paragraph-list-dnd-kit.ts`'s doc comment for why (same choice
 * Chapter Menu's outline drag makes, and for the same reason).
 *
 * Visual source: composition of Figma **Paragraph block** (`16129:377`)
 * and **Paragraph drop line** (`16372:4438`) — no Figma frame of its own.
 */
'use client';

import * as React from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';

import { DropTarget } from '@/atoms/drop-target';
import { cn } from '@/lib/utils';
import { ParagraphBlock } from '@/molecules/paragraph-block';

import type { ParagraphListItem } from './paragraph-list-dnd';
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

/** Row's own gap-compensation margin — see `DropTarget`'s README "No
 * gap-compensation margin baked in". Kept as one shared constant so the
 * container's real `gap` and each `DropTarget`'s negative-margin offset
 * can never drift out of sync with each other. */
const ROW_GAP_VAR = '--paragraph-list-row-gap';
const ROW_GAP_VALUE = 'var(--spacing-md)';

function ParagraphListRow({
  item,
  isSelected,
  onSelect,
}: {
  item: ParagraphListItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useParagraphRow(item.id);

  return (
    <ParagraphBlock
      ref={setNodeRef}
      state={isSelected ? 'selected' : 'default'}
      handleProps={{ ...attributes, ...listeners }}
      onDragStart={() => onSelect(item.id)}
      onSelect={() => onSelect(item.id)}
      className={cn(isDragging && 'opacity-40')}
    >
      {item.text}
    </ParagraphBlock>
  );
}

export function ParagraphList({ items, onItemsChange, className }: ParagraphListProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const { sensors, activeId, dropGapIndex, onDragStart, onDragMove, onDragEnd, onDragCancel } =
    useParagraphListDragAndDrop({
      items,
      onItemsChange,
      onMoved: setSelectedId,
    });

  const activeItem = activeId ? items.find((item) => item.id === activeId) : null;
  const gapClassName = '[margin-block:calc(var(--paragraph-list-row-gap,0px)*-0.5)]';

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={paragraphCollisionDetection}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div
        data-slot="paragraph-list"
        className={cn('flex flex-col', className)}
        style={{ [ROW_GAP_VAR]: ROW_GAP_VALUE, gap: ROW_GAP_VALUE } as React.CSSProperties}
      >
        <DropTarget active={dropGapIndex === 0} className={gapClassName} />
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <ParagraphListRow item={item} isSelected={selectedId === item.id} onSelect={setSelectedId} />
            <DropTarget active={dropGapIndex === index + 1} className={gapClassName} />
          </React.Fragment>
        ))}
      </div>
      <DragOverlay>
        {activeItem ? <ParagraphBlock state="drag">{activeItem.text}</ParagraphBlock> : null}
      </DragOverlay>
    </DndContext>
  );
}
