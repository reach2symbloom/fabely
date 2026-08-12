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
 * example pages. Figma Tooltip (`133:14788`) + inverse chip for dense chrome.
 */

type Side = 'top' | 'bottom' | 'left' | 'right';
type TooltipVariant = 'default' | 'inverse';

const meta = {
  title: 'Design System/Primitives/Tooltip',
  component: Tooltip,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/* ---------- Canonical examples ---------- */

function DefaultExample() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>
        Hover
      </TooltipTrigger>
      <TooltipContent>Tooltip text</TooltipContent>
    </Tooltip>
  );
}

function InverseExample() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>
        Hover
      </TooltipTrigger>
      <TooltipContent variant="inverse">Playground</TooltipContent>
    </Tooltip>
  );
}

function SidesExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-[var(--spacing-xl)]">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger render={<Button variant="outline" size="small" />}>
            {side}
          </TooltipTrigger>
          <TooltipContent side={side}>Tooltip text</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

function WithKbdExample() {
  return (
    <TooltipProvider>
      <div className="flex gap-[var(--spacing-md)]">
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="small" />}>
            Save
          </TooltipTrigger>
          <TooltipContent
            variant="inverse"
            className="flex items-center gap-[var(--spacing-2xs)]"
          >
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
          <TooltipContent
            variant="inverse"
            className="flex items-center gap-[var(--spacing-2xs)]"
          >
            Print
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>P</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

function VariantsExample() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--spacing-xl)]">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="small" />}>
          Default
        </TooltipTrigger>
        <TooltipContent variant="default">Figma surface</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" size="small" />}>
          Inverse
        </TooltipTrigger>
        <TooltipContent variant="inverse">High contrast</TooltipContent>
      </Tooltip>
    </div>
  );
}

function TooltipPlayground() {
  const [variant, setVariant] = useState<TooltipVariant>('default');
  const [side, setSide] = useState<Side>('top');

  return (
    <PlaygroundPanel
      preview={
        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            Hover me
          </TooltipTrigger>
          <TooltipContent variant={variant} side={side}>
            Tooltip text
          </TooltipContent>
        </Tooltip>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Variant"
            value={variant}
            onChange={setVariant}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'inverse', label: 'Inverse' },
            ]}
          />
          <InlineSegmentedControl
            label="Side"
            value={side}
            onChange={setSide}
            options={[
              { value: 'top', label: 'Top' },
              { value: 'right', label: 'Right' },
              { value: 'bottom', label: 'Bottom' },
              { value: 'left', label: 'Left' },
            ]}
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
      title="Tooltip"
      description="Figma Tooltip surface plus an inverse chip for dense chrome (sidebar). Opens with no hover delay."
      playground={<TooltipPlayground />}
      variants={
        <>
          <PrimitiveGalleryItem label="Default">
            <DefaultExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Inverse">
            <InverseExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Sides">
            <SidesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="With Kbd">
            <WithKbdExample />
          </PrimitiveGalleryItem>
        </>
      }
      usageGuidance={
        <ul className="list-disc space-y-[var(--spacing-2xs)] ps-[var(--spacing-md)] text-[length:var(--text-paragraph-small-regular-font-size)] text-muted-foreground">
          <li>
            Prefer <code>variant=&quot;default&quot;</code> for page chrome;
            use <code>inverse</code> on dark rails and icon-only controls
            (Sidebar collapsed labels).
          </li>
          <li>
            Delay is <code>0</code> by default — do not reintroduce a 600ms
            Base UI Trigger delay unless intentional.
          </li>
          <li>
            Compose shortcuts with <code>Kbd</code> / <code>KbdGroup</code>{' '}
            inside inverse (or dark) tooltips so Glow pairing holds.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-[var(--spacing-2xs)] ps-[var(--spacing-md)] text-[length:var(--text-paragraph-small-regular-font-size)] text-muted-foreground">
          <li>
            Tooltips appear on hover and keyboard focus; keep copy short and
            redundant with a visible label when possible.
          </li>
          <li>
            Do not put essential actions only inside a tooltip — triggers must
            remain operable without it.
          </li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {
  render: () => <DefaultExample />,
};

export const Inverse: Story = {
  render: () => <InverseExample />,
};

export const Sides: Story = {
  render: () => <SidesExample />,
};

export const WithKbd: Story = {
  name: 'With Kbd',
  render: () => <WithKbdExample />,
};

export const Variants: Story = {
  render: () => <VariantsExample />,
};
