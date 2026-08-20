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

import { SplitParse, type SplitParseState, type SplitParseSurface } from './SplitParse';

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

function PrimarySurfaceExample() {
  return (
    <div
      className={`${DEMO_WIDTH} flex flex-col gap-[var(--spacing-md)] rounded-[length:var(--rounded-lg)] bg-[color:var(--primary)] p-[var(--spacing-md)]`}
    >
      <SplitParse surface="primary" state="default" />
      <SplitParse surface="primary" state="split-created" />
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
  const [surface, setSurface] = useState<SplitParseSurface>('default');

  const preview = (
    <div className={DEMO_WIDTH}>
      <SplitParse
        state={state}
        surface={surface}
        onParse={() => setState('split-created')}
        onUndo={() => setState('default')}
      />
    </div>
  );

  return (
    <PlaygroundPanel
      preview={
        <div
          className={`flex min-h-40 w-full items-center justify-center p-[var(--spacing-lg)] ${surface === 'primary' ? 'bg-[color:var(--primary)]' : ''}`}
        >
          {preview}
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
          <InlineSegmentedControl
            label="Surface"
            value={surface}
            onChange={(v) => setSurface(v as SplitParseSurface)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'primary', label: 'Primary' },
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
          <PrimitiveGalleryItem label="Primary surface">
            <PrimarySurfaceExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Interactive">
            <InteractiveExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>surface=&quot;primary&quot;</code> is for a split marker
            placed inside a <code>--primary</code>-colored highlight span —
            not app dark theme. See the component README for why Figma&apos;s
            <code>mode</code> prop isn&apos;t reproduced as-is.
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
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            The <code>default</code>-state row is a real{' '}
            <code>&lt;button&gt;</code>; the <code>split-created</code>-state
            row is a status display with its own independently focusable
            undo <code>&lt;button&gt;</code> (&quot;Undo split&quot;).
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

export const PrimarySurface: Story = {
  name: 'Primary surface',
  render: () => <PrimarySurfaceExample />,
};

export const Interactive: Story = {
  render: () => <InteractiveExample />,
};
