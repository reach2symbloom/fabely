import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { Button } from '../button';
import { Field, FieldGroup, FieldLabel } from '../field';
import { Input } from '../input';

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. Patterns follow shadcn Popover docs (Base UI Popover).
 */

type Align = 'start' | 'center' | 'end';
type Side = 'top' | 'bottom' | 'left' | 'right';

const meta = {
  title: 'Design System/Primitives/Popover',
  component: Popover,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/* ---------- Canonical examples (shadcn docs) ---------- */

function BasicExample() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Open Popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Title</PopoverTitle>
          <PopoverDescription>Description text here.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}

function AlignExample() {
  return (
    <div className="flex gap-[var(--spacing-xl)]">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="small" />}>
          Start
        </PopoverTrigger>
        <PopoverContent align="start" className="w-40">
          Aligned to start
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="small" />}>
          Center
        </PopoverTrigger>
        <PopoverContent align="center" className="w-40">
          Aligned to center
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="small" />}>
          End
        </PopoverTrigger>
        <PopoverContent align="end" className="w-40">
          Aligned to end
        </PopoverContent>
      </Popover>
    </div>
  );
}

function WithFormExample() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Open Popover
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
        <FieldGroup className="gap-[var(--spacing-md)]">
          <Field orientation="horizontal">
            <FieldLabel htmlFor="popover-width" className="w-1/2">
              Width
            </FieldLabel>
            <Input id="popover-width" defaultValue="100%" />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="popover-height" className="w-1/2">
              Height
            </FieldLabel>
            <Input id="popover-height" defaultValue="25px" />
          </Field>
        </FieldGroup>
      </PopoverContent>
    </Popover>
  );
}

function RtlExample() {
  return (
    <div dir="rtl" className="flex flex-col items-center gap-[var(--spacing-md)]">
      <p className="text-[color:var(--muted-foreground)]">العربية (RTL)</p>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          فتح النافذة
        </PopoverTrigger>
        <PopoverContent align="start">
          <PopoverHeader>
            <PopoverTitle>الأبعاد</PopoverTitle>
            <PopoverDescription>
              عيّن أبعاد الطبقة من هنا.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  );
}

/* ---------- Playground ---------- */

function PopoverPlayground() {
  const [side, setSide] = useState<Side>('bottom');
  const [align, setAlign] = useState<Align>('center');
  const [shadow, setShadow] = useState(true);

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 items-center justify-center">
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
              Open Popover
            </PopoverTrigger>
            <PopoverContent side={side} align={align} shadow={shadow}>
              <PopoverHeader>
                <PopoverTitle>Title</PopoverTitle>
                <PopoverDescription>Description text here.</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Side"
            value={side}
            onChange={(v) => setSide(v as Side)}
            options={(
              ['top', 'bottom', 'left', 'right'] as const
            ).map((value) => ({ value, label: value }))}
          />
          <InlineSegmentedControl
            label="Align"
            value={align}
            onChange={(v) => setAlign(v as Align)}
            options={[
              { value: 'start', label: 'Start' },
              { value: 'center', label: 'Center' },
              { value: 'end', label: 'End' },
            ]}
          />
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Shadow"
              value={shadow ? 'on' : 'off'}
              onChange={(v) => setShadow(v === 'on')}
              options={[
                { value: 'on', label: 'On' },
                { value: 'off', label: 'Off' },
              ]}
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
      title="Popover"
      description={
        <>
          Rich content in a portal, triggered by a button. No Figma source —
          Foundations floating panel (<code>--popover</code> fill) matching
          Dialog / Hover Card chrome. API from{' '}
          <a href="https://ui.shadcn.com/docs/components/base/popover">
            shadcn Popover
          </a>
          .
        </>
      }
      playground={<PopoverPlayground />}
      variants={
        <div className="flex flex-col gap-6">
          <PrimitiveGalleryItem label="Basic">
            <BasicExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Align">
            <AlignExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="With Form">
            <WithFormExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Compose <code>Popover</code> → <code>PopoverTrigger</code> +{' '}
            <code>PopoverContent</code> (optional Header / Title / Description).
          </li>
          <li>
            Custom triggers: Base UI <code>render</code> (e.g.{' '}
            <code>render=&#123;&lt;Button variant=&quot;outline&quot; /&gt;&#125;</code>
            ).
          </li>
          <li>
            Position with <code>side</code> / <code>align</code> on Content.
            Override width / padding via <code>className</code> (Date Picker uses{' '}
            <code>w-auto p-0</code>).
          </li>
          <li>
            Set <code>shadow=&#123;false&#125;</code> for a flat bordered panel.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Prefer a focusable trigger (button). Content is portaled and focus
            moves into the popup when appropriate (Base UI).
          </li>
          <li>
            Use <code>PopoverTitle</code> / <code>PopoverDescription</code> for
            accessible naming when the panel has meaningful chrome.
          </li>
          <li>
            See{' '}
            <a href="https://base-ui.com/react/components/popover#api-reference">
              Base UI Popover API
            </a>
            .
          </li>
        </ul>
      }
    />
  ),
};

/* ---------- Individual example pages ---------- */

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const Align: Story = {
  render: () => <AlignExample />,
};

export const WithForm: Story = {
  name: 'With Form',
  render: () => <WithFormExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
