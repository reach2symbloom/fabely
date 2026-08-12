import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { Slider } from '../slider';

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from './progress';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. Patterns follow shadcn Progress docs (Base UI Progress).
 */

const meta = {
  title: 'Design System/Primitives/Progress',
  component: Progress,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/* ---------- Canonical examples (shadcn docs) ---------- */

function DemoExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-[var(--spacing-md)]">
      <Progress value={0} />
      <Progress value={25} />
      <Progress value={50} />
      <Progress value={75} />
      <Progress value={100} />
    </div>
  );
}

function LabelExample() {
  return (
    <Progress value={56} className="w-full max-w-sm">
      <ProgressLabel>Upload progress</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}

function ControlledExample() {
  const [value, setValue] = useState(50);

  return (
    <div className="flex w-full max-w-sm flex-col gap-[var(--spacing-md)]">
      <Progress value={value} className="w-full" />
      {/* Slider is still thin-pass — deferred partner chrome. */}
      <Slider
        value={[value]}
        onValueChange={(next) => {
          const n = Array.isArray(next) ? next[0] : next;
          if (typeof n === 'number') setValue(n);
        }}
        min={0}
        max={100}
        step={1}
      />
    </div>
  );
}

function RtlExample() {
  return (
    <div dir="rtl" className="flex w-full max-w-sm flex-col gap-[var(--spacing-md)]">
      <p className="text-[color:var(--muted-foreground)]">العربية (RTL)</p>
      <Progress value={56} className="w-full">
        <ProgressLabel>تقدم الرفع</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  );
}

/* ---------- Playground ---------- */

function ProgressPlayground() {
  const [value, setValue] = useState(56);
  const [showLabel, setShowLabel] = useState(true);

  return (
    <PlaygroundPanel
      preview={
        <Progress value={value} className="w-full max-w-sm">
          {showLabel ? (
            <>
              <ProgressLabel>Upload progress</ProgressLabel>
              <ProgressValue />
            </>
          ) : null}
        </Progress>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Value"
            value={String(value)}
            options={[0, 25, 50, 56, 75, 100].map((v) => ({
              value: String(v),
              label: String(v),
            }))}
            onChange={(v) => setValue(Number(v))}
            fullWidth
          />
          <InlineSegmentedControl
            label="Label / value"
            value={showLabel ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setShowLabel(v === 'on')}
            fullWidth
          />
        </div>
      }
    />
  );
}

/* ---------- Overview ---------- */

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Progress"
      description={
        <>
          Task completion bar. No Figma source — Foundations restyle of the{' '}
          <a href="https://ui.shadcn.com/docs/components/base/progress">
            shadcn Progress
          </a>{' '}
          API (Base UI Progress). Track uses <code>--muted</code>; indicator{' '}
          <code>--primary</code>.
        </>
      }
      playground={<ProgressPlayground />}
      variants={
        <div className="flex flex-col gap-6">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Label">
            <LabelExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Controlled">
            <ControlledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Pass <code>value</code> (0–100) on <code>Progress</code>. Track +
            Indicator are composed automatically.
          </li>
          <li>
            Optional chrome: <code>ProgressLabel</code> +{' '}
            <code>ProgressValue</code> as children (wrap above the track).
          </li>
          <li>
            Override width via <code>className</code> (e.g.{' '}
            <code>w-full max-w-sm</code>).
          </li>
          <li>
            For custom track chrome, compose <code>ProgressTrack</code> /{' '}
            <code>ProgressIndicator</code> yourself (exported).
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Root is a progressbar (Base UI). Prefer a visible{' '}
            <code>ProgressLabel</code> or <code>aria-label</code> when context
            is not clear.
          </li>
          <li>
            <code>ProgressValue</code> exposes the formatted percent for
            sighted users; keep it in sync with <code>value</code>.
          </li>
          <li>
            See{' '}
            <a href="https://base-ui.com/react/components/progress#api-reference">
              Base UI Progress API
            </a>
            .
          </li>
        </ul>
      }
    />
  ),
};

/* ---------- Individual example pages ---------- */

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Label: Story = {
  render: () => <LabelExample />,
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
