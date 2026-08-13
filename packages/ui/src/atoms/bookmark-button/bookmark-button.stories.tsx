/**
 * Bookmark Button — first Fabely atom. Overview + focused demos.
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
import type { ToggleRoundness } from '../../primitives/toggle';

import { BookmarkButton } from './bookmark-button';

const meta = {
  title: 'Design System/Atoms/Bookmark Button',
  component: BookmarkButton,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof BookmarkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

type Variant = 'ghost' | 'outline';
type Size = 'sm' | 'default' | 'lg';

const VARIANTS: Variant[] = ['ghost', 'outline'];
const SIZES: Size[] = ['sm', 'default', 'lg'];
const ROUNDNESSES: ToggleRoundness[] = ['default', 'round'];

function DemoExample() {
  return <BookmarkButton defaultPressed />;
}

function OffOnExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-md)]">
      <BookmarkButton aria-label="Bookmark" />
      <BookmarkButton defaultPressed aria-label="Remove bookmark" />
    </div>
  );
}

function SizeExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-xs)]">
      <BookmarkButton size="sm" defaultPressed />
      <BookmarkButton size="default" defaultPressed />
      <BookmarkButton size="lg" defaultPressed />
    </div>
  );
}

function ControlledExample() {
  const [pressed, setPressed] = useState(false);

  return (
    <BookmarkButton
      pressed={pressed}
      onPressedChange={setPressed}
      variant="outline"
    />
  );
}

function BookmarkPlayground() {
  const [variant, setVariant] = useState<Variant>('ghost');
  const [size, setSize] = useState<Size>('default');
  const [roundness, setRoundness] = useState<ToggleRoundness>('round');

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 items-center justify-center">
          <BookmarkButton
            variant={variant}
            size={size}
            roundness={roundness}
            defaultPressed
          />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Variant"
            value={variant}
            onChange={(v) => setVariant(v as Variant)}
            options={VARIANTS.map((value) => ({ value, label: value }))}
            fullWidth
          />
          <InlineSegmentedControl
            label="Size"
            value={size}
            onChange={(v) => setSize(v as Size)}
            options={SIZES.map((value) => ({ value, label: value }))}
            fullWidth
          />
          <InlineSegmentedControl
            label="Roundness"
            value={roundness}
            onChange={(v) => setRoundness(v as ToggleRoundness)}
            options={ROUNDNESSES.map((value) => ({ value, label: value }))}
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
      title="Bookmark Button"
      description="Icon toggle that fills the Lucide bookmark when pressed. Composes Toggle; Figma Bookmark Icon Button (16066:5970)."
      playground={<BookmarkPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Off / On">
            <OffOnExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Size">
            <SizeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Controlled">
            <ControlledExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Use <code>BookmarkButton</code> for save / bookmark affordances.
            Prefer bare <code>Toggle</code> for generic on/off chrome.
          </li>
          <li>
            Glyph fill animates via <code>fill-opacity</code> on pressed —
            outline empty when off, solid when on.
          </li>
          <li>
            Default <code>aria-label</code> switches between &quot;Bookmark&quot;
            and &quot;Remove bookmark&quot;; override when the action differs.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Built on Toggle — <code>aria-pressed</code> /{' '}
            <code>data-pressed</code>, Space / Enter to flip.
          </li>
          <li>Icon-only; always exposes an accessible name.</li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const OffOn: Story = {
  render: () => <OffOnExample />,
};

export const Size: Story = {
  render: () => <SizeExample />,
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};
