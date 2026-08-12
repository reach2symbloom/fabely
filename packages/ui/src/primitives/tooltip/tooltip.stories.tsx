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
import { Kbd, KbdGroup } from '../kbd';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. shadcn Tooltip guide (Base UI Tooltip).
 */

type Side = 'top' | 'bottom' | 'left' | 'right';

const meta = {
  title: 'Design System/Primitives/Tooltip',
  component: Tooltip,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const SIDES: Side[] = ['left', 'top', 'bottom', 'right'];

function DemoExample() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>
        Hover
      </TooltipTrigger>
      <TooltipContent>Add to library</TooltipContent>
    </Tooltip>
  );
}

function SideExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-[var(--spacing-md)]">
      {SIDES.map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger render={<Button variant="outline" />}>
            {side}
          </TooltipTrigger>
          <TooltipContent side={side}>
            Tooltip on the <strong>{side}</strong>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

function KeyboardShortcutExample() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--spacing-md)]">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="small" />}>
          Save
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-[var(--spacing-2xs)]">
          Save
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>S</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="small" />}>
          Print
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-[var(--spacing-2xs)]">
          Print
          <Kbd>⌘P</Kbd>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

/** Disabled controls do not fire pointer events — wrap in a focusable span. */
function DisabledButtonExample() {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<span className="inline-flex" tabIndex={0} />}
      >
        <Button disabled>Submit</Button>
      </TooltipTrigger>
      <TooltipContent>You do not have permission</TooltipContent>
    </Tooltip>
  );
}

function RtlExample() {
  return (
    <div
      dir="rtl"
      className="flex flex-col items-center gap-[var(--spacing-md)]"
    >
      <p className="text-[color:var(--muted-foreground)]">العربية (RTL)</p>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          مرّر هنا
        </TooltipTrigger>
        <TooltipContent side="bottom" align="start">
          تلميح يظهر بمحاذاة البداية في تخطيط من اليمين لليسار
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function TooltipPlayground() {
  const [side, setSide] = useState<Side>('top');

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 items-center justify-center">
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Hover
            </TooltipTrigger>
            <TooltipContent side={side}>Tooltip text</TooltipContent>
          </Tooltip>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Side"
              value={side}
              onChange={(v) => setSide(v as Side)}
              options={SIDES.map((value) => ({ value, label: value }))}
            />
          </div>
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Tooltip"
      description="Short label on hover or focus. Foundations chrome from Figma Tooltip (Side axis); shadcn Tooltip + TooltipProvider API."
      playground={<TooltipPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Side">
            <SideExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="With Keyboard Shortcut">
            <KeyboardShortcutExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Disabled Button">
            <DisabledButtonExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Wrap the app (or Storybook) once with{' '}
            <code>TooltipProvider</code>. Compose{' '}
            <code>Tooltip</code> → <code>TooltipTrigger</code> +{' '}
            <code>TooltipContent</code>.
          </li>
          <li>
            Position with <code>side</code> / <code>align</code> on Content
            (Figma Side: Top / Bottom / Left / Right). Custom triggers use{' '}
            <code>render</code>.
          </li>
          <li>
            Disabled controls need a wrapping focusable element (e.g.{' '}
            <code>span</code> with <code>tabIndex=&#123;0&#125;</code>) so the
            tooltip can still open.
          </li>
          <li>
            Pair shortcut hints with <code>Kbd</code> / <code>KbdGroup</code>{' '}
            inside Content.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Tooltips supplement a control — do not put critical actions or the
            only copy of a label only inside the tooltip.
          </li>
          <li>
            Prefer a focusable trigger (button / link). Keyboard focus should
            reveal the same content as hover.
          </li>
          <li>
            Keep content short (a label or shortcut). Longer previews belong in
            Hover Card or Popover.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Side: Story = {
  parameters: { layout: 'padded' },
  render: () => <SideExample />,
};

export const WithKeyboardShortcut: Story = {
  name: 'With Keyboard Shortcut',
  render: () => <KeyboardShortcutExample />,
};

export const DisabledButton: Story = {
  name: 'Disabled Button',
  render: () => <DisabledButtonExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
