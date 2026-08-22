/**
 * Drop Target — Fabely atom. Overview + focused demos.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import { DropTarget } from './drop-target';

const meta = {
  title: 'Design System/Atoms/Drop Target',
  component: DropTarget,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DropTarget>;

export default meta;
type Story = StoryObj<typeof meta>;

const DEMO_WIDTH = 'w-full max-w-[520px]';

function MockRow({ label }: { label: string }) {
  return (
    <div className="rounded-[length:var(--rounded-lg)] border border-[color:var(--border)] p-[length:var(--spacing-sm)] text-sm text-muted-foreground">
      {label}
    </div>
  );
}

function DemoExample() {
  return (
    <div className={DEMO_WIDTH}>
      <MockRow label="Paragraph one" />
      <DropTarget active />
      <MockRow label="Paragraph two" />
    </div>
  );
}

function ChevronExample() {
  return (
    <div className={`${DEMO_WIDTH} flex flex-col gap-[var(--spacing-lg)]`}>
      <div>
        <MockRow label="Paragraph one" />
        <DropTarget active />
        <MockRow label="Paragraph two" />
      </div>
      <div>
        <MockRow label="Paragraph one" />
        <DropTarget active chevron />
        <MockRow label="Paragraph two" />
      </div>
    </div>
  );
}

function GapPositionExample() {
  const [activeGap, setActiveGap] = useState(1);

  return (
    <div className={`${DEMO_WIDTH} flex flex-col`}>
      {['Paragraph one', 'Paragraph two', 'Paragraph three'].map((label, index) => (
        <div key={label}>
          <DropTarget active={activeGap === index} />
          <MockRow label={label} />
        </div>
      ))}
      <DropTarget active={activeGap === 3} />
      <button
        type="button"
        className="mt-[var(--spacing-md)] self-start text-xs text-muted-foreground underline"
        onClick={() => setActiveGap((gap) => (gap + 1) % 4)}
      >
        Move to next gap
      </button>
    </div>
  );
}

function DropTargetPlayground() {
  const [active, setActive] = useState(true);
  const [chevron, setChevron] = useState(false);

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 w-full items-center justify-center p-[var(--spacing-lg)]">
          <div className={DEMO_WIDTH}>
            <MockRow label="Paragraph one" />
            <DropTarget active={active} chevron={chevron} />
            <MockRow label="Paragraph two" />
          </div>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Active"
            value={active ? 'true' : 'false'}
            onChange={(v) => setActive(v === 'true')}
            options={[
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Chevron"
            value={chevron ? 'true' : 'false'}
            onChange={(v) => setChevron(v === 'true')}
            options={[
              { value: 'false', label: 'No' },
              { value: 'true', label: 'Yes' },
            ]}
            fullWidth
            className="col-span-2"
          />
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Drop Target"
      description="Glowing insertion-line indicator for drag-reorderable lists. Figma Paragraph drop line (16372:4438)."
      playground={<DropTargetPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo" fill>
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Gap position" fill>
            <GapPositionExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Chevron" fill>
            <ChevronExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Presentation only — a caller (e.g. Paragraph List) computes which
            gap is currently the prospective drop point and passes{' '}
            <code>active</code> for that one gap; this component doesn&apos;t
            know about drag state itself.
          </li>
          <li>
            Every gap in a list can mount one of these permanently — only the
            active one visibly opens (<code>grid-template-rows</code> tween,
            not <code>height</code>), so nothing needs to conditionally
            mount/unmount as the drop point moves. See "Gap position" above.
          </li>
          <li>
            Promoted out of Chapter Menu&apos;s outline drag-and-drop (see the
            component README) rather than Paragraph List growing a second
            copy of the same Figma component.
          </li>
          <li>
            <code>chevron</code> adds Figma&apos;s <code>Chevron=Yes</code>{' '}
            down-glyph centered under the rail — off by default, matching
            both current callers. See "Chevron" above.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>aria-hidden</code> when inactive — purely visual drag
            feedback, not part of the list&apos;s accessible structure.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const GapPosition: Story = {
  render: () => <GapPositionExample />,
};

export const Chevron: Story = {
  render: () => <ChevronExample />,
};

export const Playground: Story = {
  render: () => (
    <div className="w-full max-w-[640px]">
      <DropTargetPlayground />
    </div>
  ),
};
