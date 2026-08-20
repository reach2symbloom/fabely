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

import { BookmarkButton } from './bookmark-button';

const meta = {
  title: 'Design System/Atoms/Bookmark Button',
  component: BookmarkButton,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof BookmarkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

type Size = 'sm' | 'default' | 'lg';

const SIZES: Size[] = ['sm', 'default', 'lg'];

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

  return <BookmarkButton pressed={pressed} onPressedChange={setPressed} />;
}

function SuperscriptExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-md)]">
      <BookmarkButton defaultPressed={false} showSuperscript aria-label="Bookmark" />
      <BookmarkButton defaultPressed showSuperscript aria-label="Remove bookmark" />
    </div>
  );
}

function BookmarkPlayground() {
  const [size, setSize] = useState<Size>('default');
  const [showSuperscript, setShowSuperscript] = useState(false);

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 items-center justify-center">
          <BookmarkButton size={size} showSuperscript={showSuperscript} defaultPressed />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Size"
            value={size}
            onChange={(v) => setSize(v as Size)}
            options={SIZES.map((value) => ({ value, label: value }))}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Superscript"
            value={showSuperscript ? 'on' : 'off'}
            onChange={(v) => setShowSuperscript(v === 'on')}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
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
      title="Bookmark Button"
      description="Bare icon toggle, no button chrome. Unselected alpha-20 → alpha-50 hover (stroke); selected primary (filled). Figma Bookmark Icon Button (16066:5970)."
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
          <PrimitiveGalleryItem label="Superscript">
            <SuperscriptExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Use <code>BookmarkButton</code> for save / bookmark affordances.
            It carries no container chrome — no fill, no radius, no hover
            pill; only the glyph itself changes.
          </li>
          <li>
            Unselected is a stroked outline (<code>alpha-20</code> rest,{' '}
            <code>alpha-50</code> hover); selected swaps to a solid filled
            glyph in <code>primary</code>.
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
            Built on Base UI Toggle — <code>aria-pressed</code> /{' '}
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

export const Superscript: Story = {
  render: () => <SuperscriptExample />,
};
