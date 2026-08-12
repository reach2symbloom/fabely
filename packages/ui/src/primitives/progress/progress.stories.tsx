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
  type ProgressSize,
} from './progress';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground mirrors Figma Progress axes (Size / Progress /
 * Show), then shadcn Label / Controlled / RTL examples.
 *
 * Figma: https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=5010-29
 */

/** Figma Progress property steps (Thin + Thick). */
const FIGMA_PROGRESS_STEPS = [
  0, 10, 20, 25, 33, 40, 50, 60, 66, 75, 80, 90, 100,
] as const;

const meta = {
  title: 'Design System/Primitives/Progress',
  component: Progress,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/* ---------- Canonical examples ---------- */

function ThinGalleryExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-[var(--spacing-md)]">
      {FIGMA_PROGRESS_STEPS.map((v) => (
        <Progress key={v} value={v} size="thin" />
      ))}
    </div>
  );
}

function ThickGalleryExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-[var(--spacing-md)]">
      {FIGMA_PROGRESS_STEPS.map((v) => (
        <Progress key={v} value={v} size="thick" />
      ))}
    </div>
  );
}

function LabelExample() {
  return (
    <Progress value={56} size="thick" className="w-full max-w-sm">
      <ProgressLabel>Upload progress</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}

function ControlledExample() {
  const [value, setValue] = useState(50);

  return (
    <div className="flex w-full max-w-sm flex-col gap-[var(--spacing-md)]">
      <Progress value={value} size="thick" className="w-full">
        <ProgressValue />
      </Progress>
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
      <Progress value={56} size="thick" className="w-full">
        <ProgressValue />
      </Progress>
    </div>
  );
}

/* ---------- Playground (Figma axes) ---------- */

function ProgressPlayground() {
  const [value, setValue] = useState(50);
  const [size, setSize] = useState<ProgressSize>('thick');
  const [showPercent, setShowPercent] = useState(true);

  return (
    <PlaygroundPanel
      preview={
        <Progress value={value} size={size} className="w-full max-w-sm">
          {showPercent ? <ProgressValue /> : null}
        </Progress>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Size"
            value={size}
            options={[
              { value: 'thin', label: 'Thin' },
              { value: 'thick', label: 'Thick' },
            ]}
            onChange={(v) => setSize(v as ProgressSize)}
            fullWidth
          />
          <InlineSegmentedControl
            label="Show %"
            value={showPercent ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setShowPercent(v === 'on')}
            fullWidth
          />
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Progress"
              value={String(value)}
              options={FIGMA_PROGRESS_STEPS.map((v) => ({
                value: String(v),
                label: String(v),
              }))}
              onChange={(v) => setValue(Number(v))}
              fullWidth
            />
          </div>
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
          Task completion bar from Figma Progress (Size Thin / Thick, optional
          trailing %). Indicator uses{' '}
          <code>--gradient-primary-left-right</code> +{' '}
          <code>--effect-glow-primary-2</code>; track is{' '}
          <code>--theme-alpha-black-switch-333</code>. Composition API matches{' '}
          <a href="https://ui.shadcn.com/docs/components/base/progress">
            shadcn Progress
          </a>
          .
        </>
      }
      playground={<ProgressPlayground />}
      variants={
        <div className="flex flex-col gap-6">
          <PrimitiveGalleryItem label="Thin">
            <ThinGalleryExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Thick">
            <ThickGalleryExample />
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
            Figma axes: <code>size=&quot;thin&quot; | &quot;thick&quot;</code>,{' '}
            <code>value</code> (0–100), optional <code>ProgressValue</code>{' '}
            trailing % (Show).
          </li>
          <li>
            Thick indicators use a slanted leading edge below 100%; Thin is a
            flat 4px bar.
          </li>
          <li>
            Optional header: <code>ProgressLabel</code> +{' '}
            <code>ProgressValue</code> (shadcn Label pattern — wraps above the
            track).
          </li>
          <li>
            Track + Indicator auto-compose inside <code>Progress</code>; export
            them for custom shells.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Root is a progressbar (Base UI). Prefer visible{' '}
            <code>ProgressValue</code> / <code>ProgressLabel</code> or{' '}
            <code>aria-label</code> when context is unclear.
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

export const Thin: Story = {
  render: () => <ThinGalleryExample />,
};

export const Thick: Story = {
  render: () => <ThickGalleryExample />,
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
