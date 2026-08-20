/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. shadcn Toggle guide (Base UI Toggle).
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  BoldIcon,
  BookmarkIcon,
  ItalicIcon,
  UnderlineIcon,
} from 'lucide-react';

import { BookmarkIconButton } from '../../atoms/bookmark-icon-button';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { DirectionProvider } from '../direction';

import { Toggle, type ToggleRoundness } from './toggle';

const meta = {
  title: 'Design System/Primitives/Toggle',
  component: Toggle,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type Variant = 'ghost' | 'outline';
type Size = 'sm' | 'default' | 'lg';

const VARIANTS: Variant[] = ['ghost', 'outline'];
const SIZES: Size[] = ['sm', 'default', 'lg'];
const ROUNDNESSES: ToggleRoundness[] = ['default', 'round'];

/** Demo — Bookmark Button atom (outline unselected, filled on pressed). */
function DemoExample() {
  return <BookmarkIconButton defaultPressed />;
}

function OutlineExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-xs)]">
      <Toggle variant="outline" aria-label="Italic">
        <ItalicIcon />
      </Toggle>
      <Toggle variant="outline" aria-label="Bold" defaultPressed>
        <BoldIcon />
      </Toggle>
    </div>
  );
}

function WithTextExample() {
  return (
    <Toggle aria-label="Toggle italic" defaultPressed>
      <ItalicIcon data-icon="inline-start" />
      Italic
    </Toggle>
  );
}

function SizeExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-xs)]">
      <Toggle size="sm" aria-label="Toggle small">
        Small
      </Toggle>
      <Toggle size="default" aria-label="Toggle default">
        Default
      </Toggle>
      <Toggle size="lg" aria-label="Toggle large">
        Large
      </Toggle>
    </div>
  );
}

function DisabledExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-xs)]">
      <Toggle disabled aria-label="Disabled off">
        Disabled
      </Toggle>
      <Toggle disabled defaultPressed aria-label="Disabled on">
        Disabled
      </Toggle>
    </div>
  );
}

function RtlExample() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl">
        <Toggle aria-label="إشارة مرجعية" defaultPressed>
          <BookmarkIcon data-icon="inline-start" />
          إشارة مرجعية
        </Toggle>
      </div>
    </DirectionProvider>
  );
}

function CustomExample() {
  const [pressed, setPressed] = useState(false);

  return (
    <Toggle
      pressed={pressed}
      onPressedChange={setPressed}
      variant="outline"
      aria-label="Underline"
    >
      <UnderlineIcon data-icon="inline-start" />
      Underline
    </Toggle>
  );
}

function TogglePlayground() {
  const [variant, setVariant] = useState<Variant>('ghost');
  const [size, setSize] = useState<Size>('default');
  const [roundness, setRoundness] = useState<ToggleRoundness>('round');

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 items-center justify-center gap-[var(--spacing-md)]">
          <BookmarkIconButton size={size} defaultPressed />
          <Toggle
            variant={variant}
            size={size}
            roundness={roundness}
            aria-label="Playground toggle"
            defaultPressed
          >
            <BoldIcon data-icon="inline-start" />
            Bold
          </Toggle>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Variant"
            value={variant}
            onChange={(v) => setVariant(v as Variant)}
            options={VARIANTS.map((value) => ({ value, label: value }))}
            fullWidth
          />
          <InlineSegmentedControl
            label="Size"
            value={size}
            onChange={(v) => setSize(v as Size)}
            options={SIZES.map((value) => ({ value, label: value }))}
            fullWidth
          />
          <InlineSegmentedControl
            label="Roundness"
            value={roundness}
            onChange={(v) => setRoundness(v as ToggleRoundness)}
            options={ROUNDNESSES.map((value) => ({ value, label: value }))}
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
      title="Toggle"
      description="A two-state button that can be on or off. Figma Toggle Button (Position=Single); shadcn Toggle + Base UI API."
      playground={<TogglePlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Outline">
            <OutlineExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="With Text">
            <WithTextExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Size">
            <SizeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Disabled">
            <DisabledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Custom">
            <CustomExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Use <code>Toggle</code> for a single on/off control. Prefer{' '}
            <code>Toggle Group</code> when options toggle as a cluster.
          </li>
          <li>
            For a bookmark / save affordance, use the{' '}
            <code>BookmarkIconButton</code> atom (see Demo) — it composes Base
            UI&apos;s headless Toggle directly, without this component&apos;s
            chrome.
          </li>
          <li>
            Figma Skin=Ghost → <code>variant=&quot;ghost&quot;</code>; Skin=Outline
            → <code>variant=&quot;outline&quot;</code>.
          </li>
          <li>
            Pass <code>roundness=&quot;round&quot;</code> for a pill face. Icon-only
            toggles need an accessible name (<code>aria-label</code>).
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Toggle is a button with pressed state via{' '}
            <code>aria-pressed</code> / <code>data-pressed</code>.
          </li>
          <li>
            Space / Enter flips pressed. Icon-only instances need{' '}
            <code>aria-label</code>.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Outline: Story = {
  render: () => <OutlineExample />,
};

export const WithText: Story = {
  render: () => <WithTextExample />,
};

export const Size: Story = {
  render: () => <SizeExample />,
};

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};

export const Custom: Story = {
  render: () => <CustomExample />,
};
