/**
 * Paragraph List — Fabely feature composite. Overview + focused demo.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { PrimitiveGalleryItem, PrimitivePage } from '../../../../stories/PrimitivePage';

import { ParagraphList, type ParagraphListItem } from './ParagraphList';

const DEMO_WIDTH = 'w-full max-w-[720px]';

const INITIAL_ITEMS: ParagraphListItem[] = [
  {
    id: 'p1',
    text: 'Long before Zeera knew the true shape of magic, the Eldergrove was already waiting for her — breathing softly beneath its ancient leaves, with wands sleeping in the branches and something vast beginning to stir in the dark between the trees.',
  },
  {
    id: 'p2',
    text: 'She had grown up hearing the grove spoken of only in warnings, the kind adults trade in low voices when they think a child is asleep — a place that took what it was given and rarely gave it back the same shape it arrived in.',
  },
  {
    id: 'p3',
    text: 'The path in was never where she remembered it, as if the grove reshuffled its own edges each night, testing who still wanted in badly enough to find it twice.',
  },
  {
    id: 'p4',
    text: 'By the third crossing she had stopped counting the trees and started counting her own breaths instead, a habit her mother once called "keeping time with what you can trust."',
  },
  {
    id: 'p5',
    text: 'Something vast was beginning to stir in the dark between the trees, and for the first time since she’d entered, Zeera understood that the grove had been waiting for her specifically, not merely tolerating her arrival.',
  },
];

const meta = {
  title: 'Design System/Features/Manuscript/Paragraph List',
  component: ParagraphList,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: { items: INITIAL_ITEMS, onItemsChange: () => {} },
} satisfies Meta<typeof ParagraphList>;

export default meta;
type Story = StoryObj<typeof meta>;

function ParagraphListDemo() {
  const [items, setItems] = useState<ParagraphListItem[]>(INITIAL_ITEMS);

  return (
    <div className={DEMO_WIDTH}>
      <ParagraphList items={items} onItemsChange={setItems} />
    </div>
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Paragraph List"
      description="Composes Paragraph Block and Drop Target into a drag-reorderable manuscript. Pick a row up by its grip handle to reorder; a plain click selects it instead. Resting blocks sit at the natural manuscript rhythm — the Drop Target only takes up space while actively showing an insertion point."
      playground={
        <div className="flex min-h-40 w-full items-center justify-center p-[var(--spacing-lg)]">
          <ParagraphListDemo />
        </div>
      }
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo" fill>
            <ParagraphListDemo />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Press and drag a row&apos;s grip handle past a few pixels to pick
            it up — a translucent copy follows the pointer, the original
            dims in place, and the <code>Drop Target</code> rail opens at
            whichever gap you&apos;re currently over. Release to drop; the
            list reorders and the moved row ends up <code>selected</code>.
          </li>
          <li>
            A plain click on the handle (no movement) selects the row
            directly, without ever starting a drag — try it on a row that
            isn&apos;t already selected. Clicking into the selected
            row&apos;s own text drops selection (you&apos;re editing now,
            not reordering); clicking anywhere else — another row&apos;s
            text, blank space — also clears it.
          </li>
          <li>
            While dragging, the floating copy is translucent
            (50%-alpha background + a light blur, not a faded block) so the{' '}
            <code>Drop Target</code> rail and its chevron stay visible
            underneath it as it passes over them.
          </li>
          <li>
            Every displaced sibling glides to its new position on drop
            (Motion&apos;s <code>layout</code> tracking) rather than
            snapping — try dragging the first row down past a few others
            and watch the ones in between.
          </li>
          <li>
            Ordering lives entirely in this component — Paragraph Block
            itself only reports clicks/drags via callbacks, it never knows
            its own position in the list. See the component README for the
            full architecture (why <code>@dnd-kit/core</code> rather than{' '}
            <code>@dnd-kit/sortable</code>, how the active gap is resolved,
            why <code>DropTarget</code> is absolutely positioned instead of
            a flex sibling).
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Select a row (click its handle), then <code>ArrowUp</code>/
            <code>ArrowDown</code> move it one position at a time — no
            separate "pick up" step, and it stays selected and focused so
            repeated presses keep moving the same row. Does nothing past
            the first/last position. An <code>aria-live</code> region
            announces each move.
          </li>
          <li>
            dnd-kit&apos;s <code>KeyboardSensor</code> is also wired
            alongside the pointer sensor, as a separate path — Tab to a
            row&apos;s grip handle, Space to pick it up, arrow keys to move
            it, Space again to drop.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <ParagraphListDemo />,
};
