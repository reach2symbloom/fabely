import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { DirectionProvider } from '../direction';
import { Label } from '../label';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import { Slider } from './slider';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages from the shadcn Slider guide + Figma Slider axes.
 */

const meta = {
  title: 'Design System/Primitives/Slider',
  component: Slider,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Docs Usage — https://ui.shadcn.com/docs/components/base/slider */
function DemoExample() {
  return <Slider defaultValue={[30]} className="w-60" max={100} step={1} />;
}

/** Discrete notches — opt-in via `interaction="discrete"`. */
function DiscreteExample() {
  return (
    <Slider
      defaultValue={[30]}
      className="w-60"
      max={100}
      step={10}
      interaction="discrete"
    />
  );
}

/** shadcn Range preview / slider-example SliderRange */
function RangeExample() {
  return (
    <Slider
      defaultValue={[25, 50]}
      className="w-60"
      max={100}
      step={5}
      interaction="discrete"
    />
  );
}

/** shadcn Multiple Thumbs / slider-example SliderMultiple */
function MultipleThumbsExample() {
  return (
    <Slider
      defaultValue={[10, 20, 70]}
      className="w-60"
      max={100}
      step={10}
      interaction="discrete"
    />
  );
}

/** shadcn Vertical / slider-example SliderVertical */
function VerticalExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-xl)]">
      <Slider
        defaultValue={[50]}
        orientation="vertical"
        className="h-40"
        max={100}
        step={10}
        interaction="discrete"
      />
      <Slider
        defaultValue={[25]}
        orientation="vertical"
        className="h-40"
        max={100}
        step={10}
        interaction="discrete"
      />
    </div>
  );
}

/** shadcn Controlled / slider-example SliderControlled */
function ControlledExample() {
  const [value, setValue] = useState([0.3, 0.7]);

  return (
    <div className="grid w-60 gap-[var(--spacing-sm)]">
      <div className="flex items-center justify-between gap-[var(--spacing-sm)]">
        <Label htmlFor="slider-demo-temperature">Temperature</Label>
        <span className="text-[length:var(--text-paragraph-small-regular-font-size)] text-[color:var(--muted-foreground)] tabular-nums">
          {value.join(', ')}
        </span>
      </div>
      <Slider
        id="slider-demo-temperature"
        value={value}
        onValueChange={(next) => setValue(next as number[])}
        min={0}
        max={1}
        step={0.1}
        interaction="discrete"
        className="w-full"
      />
    </div>
  );
}

/** shadcn Disabled / slider-example SliderDisabled */
function DisabledExample() {
  return (
    <Slider defaultValue={[50]} max={100} step={1} disabled className="w-60" />
  );
}

/** shadcn RTL preview — DirectionProvider + dir=rtl */
function RtlExample() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="flex w-60 flex-col gap-[var(--spacing-md)]">
        <div className="flex items-center justify-between gap-[var(--spacing-sm)]">
          <Label htmlFor="slider-rtl">مستوى الصوت</Label>
          <span className="text-[length:var(--text-paragraph-mini-regular-font-size)] text-[color:var(--muted-foreground)]">
            العربية
          </span>
        </div>
        <Slider
          id="slider-rtl"
          defaultValue={[33]}
          max={100}
          step={1}
          className="w-full"
        />
        <Slider defaultValue={[25, 50]} max={100} step={5} interaction="discrete" className="w-full" />
      </div>
    </DirectionProvider>
  );
}

function SliderPlayground() {
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(
    'horizontal',
  );
  const [mode, setMode] = useState<'default' | 'range' | 'multiple'>('default');
  const [interaction, setInteraction] = useState<'smooth' | 'discrete'>(
    'smooth',
  );
  const [disabled, setDisabled] = useState(false);

  const defaultValue =
    mode === 'default' ? [50] : mode === 'range' ? [25, 75] : [10, 30, 60, 80];

  return (
    <PlaygroundPanel
      preview={
        <div
          className={
            orientation === 'vertical'
              ? 'flex h-40 items-center justify-center'
              : 'flex w-60 items-center'
          }
        >
          <Slider
            key={`${orientation}-${mode}-${interaction}`}
            defaultValue={defaultValue}
            orientation={orientation}
            interaction={interaction}
            disabled={disabled}
            className={orientation === 'vertical' ? 'h-40' : 'w-full'}
            max={100}
            step={interaction === 'discrete' ? 10 : 1}
          />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Orientation"
            value={orientation}
            options={[
              { value: 'horizontal', label: 'Horizontal' },
              { value: 'vertical', label: 'Vertical' },
            ]}
            onChange={(v) => setOrientation(v as 'horizontal' | 'vertical')}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Type"
            value={mode}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'range', label: 'Range' },
              { value: 'multiple', label: 'Multiple' },
            ]}
            onChange={(v) => setMode(v as 'default' | 'range' | 'multiple')}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Interaction"
            value={interaction}
            options={[
              { value: 'smooth', label: 'Smooth' },
              { value: 'discrete', label: 'Discrete' },
            ]}
            onChange={(v) => setInteraction(v as 'smooth' | 'discrete')}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Disabled"
            value={disabled ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setDisabled(v === 'on')}
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
      title="Slider"
      description={
        <>
          Range input from Figma{' '}
          <a
            href="https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=65-4902"
            target="_blank"
            rel="noreferrer"
          >
            Slider Horizontal
          </a>{' '}
          /{' '}
          <a
            href="https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=162-17939"
            target="_blank"
            rel="noreferrer"
          >
            Vertical
          </a>{' '}
          with the{' '}
          <a
            href="https://ui.shadcn.com/docs/components/base/slider"
            target="_blank"
            rel="noreferrer"
          >
            shadcn Slider
          </a>{' '}
          API. Thumb count follows the value array length.
        </>
      }
      playground={<SliderPlayground />}
      variants={
        <div className="flex flex-wrap gap-6">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Discrete">
            <DiscreteExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Range">
            <RangeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Multiple Thumbs">
            <MultipleThumbsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Vertical">
            <VerticalExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Controlled">
            <ControlledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Disabled">
            <DisabledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Pass a one-item array (or a bare <code>number</code>) for a single
            thumb; two+ items for range / multiple thumbs (Figma Type Default |
            Range). Docs Usage:{' '}
            <code>defaultValue=&#123;[33]&#125;</code>.
          </li>
          <li>
            Use <code>orientation=&quot;vertical&quot;</code> and give the root
            a height (shadcn demos use <code>h-40</code>).
          </li>
          <li>
            <code>interaction=&quot;smooth&quot;</code> (default) has no track
            notches. <code>interaction=&quot;discrete&quot;</code> draws step
            stops (≤ 21) and snaps drag + keys stop-to-stop.
          </li>
          <li>
            Value fill is Primary gradient; track is{' '}
            <code>--theme-alpha-black-switch-333</code>.
          </li>
          <li>
            Field Slider hosts stay on Field until that revisit lands — see
            Deferred.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Pair with a visible <code>Label</code> (and optional live value
            text) for controlled / form use.
          </li>
          <li>
            Thumbs are keyboard-focusable; focus uses{' '}
            <code>--effect-focus-ring-secondary</code>.
          </li>
          <li>
            Prefer <code>disabled</code> on the root when the field is
            unavailable — opacity mute applies to the whole control.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Discrete: Story = {
  render: () => <DiscreteExample />,
};

export const Range: Story = {
  render: () => <RangeExample />,
};

export const MultipleThumbs: Story = {
  name: 'Multiple Thumbs',
  render: () => <MultipleThumbsExample />,
};

export const Vertical: Story = {
  render: () => <VerticalExample />,
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
