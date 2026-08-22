/**
 * Lateral Toggles — Fabely atom. Overview + focused demos.
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

import { LateralToggles, type LateralTogglesDirection } from './lateral-toggles';

const FIGMA_PREV = 'The dragon of the Eldergrove';
const FIGMA_NEXT = 'The Wand that Would Not Fall';

const meta = {
  title: 'Design System/Atoms/Lateral Toggles',
  component: LateralToggles,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  /* Every story below supplies its own `title` via `render` — this default
   * only exists to satisfy CSF3's `args` requirement for a component with a
   * required prop. */
  args: { title: FIGMA_PREV },
} satisfies Meta<typeof LateralToggles>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-xl)]">
      <LateralToggles direction="prev" title={FIGMA_PREV} />
      <LateralToggles direction="next" title={FIGMA_NEXT} />
    </div>
  );
}

function DirectionExample() {
  return (
    <div className="flex flex-col gap-[var(--spacing-md)]">
      <div className="flex flex-col items-center gap-[var(--spacing-xs)]">
        <LateralToggles direction="prev" title={FIGMA_PREV} forceHover />
        <span className="text-xs text-muted-foreground">Prev</span>
      </div>
      <div className="flex flex-col items-center gap-[var(--spacing-xs)]">
        <LateralToggles direction="next" title={FIGMA_NEXT} forceHover />
        <span className="text-xs text-muted-foreground">Next</span>
      </div>
    </div>
  );
}

function HoverExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-lg)]">
      <div className="flex flex-col items-center gap-[var(--spacing-xs)]">
        <LateralToggles direction="prev" title={FIGMA_PREV} />
        <span className="text-xs text-muted-foreground">Rest</span>
      </div>
      <div className="flex flex-col items-center gap-[var(--spacing-xs)]">
        <LateralToggles direction="prev" title={FIGMA_PREV} forceHover />
        <span className="text-xs text-muted-foreground">Hover</span>
      </div>
    </div>
  );
}

function TruncationExample() {
  return (
    <LateralToggles
      direction="next"
      title="A title so long it will not fit on one line and must truncate"
    />
  );
}

function ShortcutExample() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center gap-[var(--spacing-sm)]">
      <div className="flex items-center gap-[var(--spacing-xl)]">
        <LateralToggles
          direction="prev"
          title={FIGMA_PREV}
          onClick={() => setCount((n) => n - 1)}
        />
        <LateralToggles
          direction="next"
          title={FIGMA_NEXT}
          onClick={() => setCount((n) => n + 1)}
        />
      </div>
      <span className="text-xs text-muted-foreground">
        Press ⌘←/⌘→ (or Ctrl+←/→) — count: {count}
      </span>
    </div>
  );
}

function LateralTogglesPlayground() {
  const [direction, setDirection] = useState<LateralTogglesDirection>('prev');
  const [hover, setHover] = useState(false);

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 items-center justify-center">
          <LateralToggles
            direction={direction}
            title={direction === 'prev' ? FIGMA_PREV : FIGMA_NEXT}
            forceHover={hover}
          />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Direction"
            value={direction}
            onChange={(v) => setDirection(v as LateralTogglesDirection)}
            options={[
              { value: 'prev', label: 'Prev' },
              { value: 'next', label: 'Next' },
            ]}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="State"
            value={hover ? 'hover' : 'rest'}
            onChange={(v) => setHover(v === 'hover')}
            options={[
              { value: 'rest', label: 'Rest' },
              { value: 'hover', label: 'Hover' },
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
      title="Lateral Toggles"
      description="Prev/Next chapter-navigation control for the Gather panel — shortcut hint, label, and truncated chapter title. Figma Lateral Toggles (16091:10251)."
      playground={<LateralTogglesPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Direction">
            <DirectionExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Hover">
            <HoverExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Truncation">
            <TruncationExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Shortcut">
            <ShortcutExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>direction</code> is the only axis that matters — it drives
            the label, shortcut glyph (<code>⌘←</code>/<code>⌘→</code>),
            kbd position, and which side the block hugs. Figma&apos;s own
            four-value <code>alignment</code> prop folds two of those values
            into what is really the hover state of the other two; that
            distinction isn&apos;t reproduced here.
          </li>
          <li>
            Hover/focus is real CSS, not a prop — <code>forceHover</code> is
            Storybook-only, for demoing the hover state without a pointer.
          </li>
          <li>
            The <code>⌘←</code>/<code>⌘→</code> hint is live, not
            decorative — a <code>window</code> keydown listener calls{' '}
            <code>onClick</code> for you (see Shortcut). Suppressed while
            focus sits in an input/textarea/contenteditable. Set{' '}
            <code>shortcutEnabled={'{false}'}</code> if a host screen wants
            to own the binding itself instead (e.g. one listener driving a
            pair).
          </li>
          <li>
            Place a <code>prev</code> and <code>next</code> instance side by
            side (or at opposite panel edges) as a pair — see Demo.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Renders a native <code>&lt;button&gt;</code> with an
            action-oriented accessible name (&quot;Previous chapter: …&quot;
            / &quot;Next chapter: …&quot;) independent of the visible
            &quot;Prev:&quot;/&quot;Next:&quot; label.
          </li>
          <li>
            Opacity strengthens on <code>:focus-visible</code> as well as
            hover, so keyboard users get the same affordance.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Direction: Story = {
  render: () => <DirectionExample />,
};

export const Hover: Story = {
  render: () => <HoverExample />,
};

export const Truncation: Story = {
  render: () => <TruncationExample />,
};

export const Shortcut: Story = {
  render: () => <ShortcutExample />,
};
