/**
 * Split & Parse — Fabely feature composite. Overview + focused demos.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import { SplitParse, type SplitParseState } from './SplitParse';

const meta = {
  title: 'Design System/Features/Split & Parse',
  component: SplitParse,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SplitParse>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches Figma's own 443px specimen width. */
const DEMO_WIDTH = 'w-[443px]';

function DemoExample() {
  return (
    <div className={DEMO_WIDTH}>
      <SplitParse />
    </div>
  );
}

function StateExample() {
  return (
    <div className={`${DEMO_WIDTH} flex flex-col gap-[var(--spacing-md)]`}>
      <SplitParse state="default" />
      <SplitParse state="split-created" />
    </div>
  );
}

function InteractiveExample() {
  const [state, setState] = useState<SplitParseState>('default');

  return (
    <div className={DEMO_WIDTH}>
      <SplitParse
        state={state}
        onParse={() => setState('split-created')}
        onUndo={() => setState('default')}
      />
    </div>
  );
}

function SplitParsePlayground() {
  const [state, setState] = useState<SplitParseState>('default');

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 w-full items-center justify-center p-[var(--spacing-lg)]">
          <div className={DEMO_WIDTH}>
            <SplitParse
              state={state}
              onParse={() => setState('split-created')}
              onUndo={() => setState('default')}
            />
          </div>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="State"
            value={state}
            onChange={(v) => setState(v as SplitParseState)}
            options={[
              { value: 'default', label: 'Parse here' },
              { value: 'split-created', label: 'Note parsed' },
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
      title="Split & Parse"
      description="Inline manuscript-editor row — click to mark a split point, flips to a parsed confirmation with undo. Figma Split & parse (16095:208)."
      playground={<SplitParsePlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="State">
            <StateExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Interactive">
            <InteractiveExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            No <code>mode</code>/<code>surface</code> prop — colors flip with
            the app&apos;s own light/dark theme automatically. Use
            Storybook&apos;s theme toolbar toggle (top toolbar, sun/moon icon)
            to see the dark-mode look, rather than a separate demo. See the
            component README for why an earlier <code>surface</code> prop
            was removed.
          </li>
          <li>
            <code>onParse</code>/<code>onUndo</code> only fire the callback —
            this component doesn&apos;t own the split/undo state itself. See
            Interactive for the expected controlled pattern.
          </li>
          <li>
            The undo trigger reuses Icon Button&apos;s <code>fade</code>{' '}
            variant (Figma&apos;s own &quot;Fade button&quot;) at a smaller,
            padding-free footprint.
          </li>
          <li>
            Hovering (or keyboard-focusing) the <code>default</code>-state
            row plays a left-to-right activation sweep — icon, then the left
            rule, then the label, then the right rule — rather than a static
            brighten. Not in Figma (which shows no distinct hover swatch).
            Hover the row in the Overview playground or Demo to see it.
          </li>
          <li>
            The <code>default</code> ↔ <code>split-created</code> flip is
            Motion-animated (also not in Figma) — click through Interactive
            to see it both directions. Respects{' '}
            <code>prefers-reduced-motion</code> (instant, no keyframes). See
            the component README for the full choreography.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            The <code>default</code>-state row is a{' '}
            <code>role=&quot;button&quot;</code> div (keyboard-operable via
            Enter/Space) rather than a real <code>&lt;button&gt;</code> — the{' '}
            <code>split-created</code>-state row nests a real undo{' '}
            <code>&lt;button&gt;</code> (&quot;Undo split&quot;), and a{' '}
            <code>&lt;button&gt;</code> can never validly contain another
            one. A stable root across both states is also what makes the
            transition animatable — see the README.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const State: Story = {
  render: () => <StateExample />,
};

export const Interactive: Story = {
  render: () => <InteractiveExample />,
};
