/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. shadcn Toggle Group guide (Base UI Toggle Group).
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  LayoutGridIcon,
  LayoutListIcon,
  MenuIcon,
  PhoneIcon,
  PhoneMissedIcon,
  UnderlineIcon,
} from 'lucide-react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { DirectionProvider } from '../direction';

import { ToggleGroup, ToggleGroupItem, type ToggleGroupRoundness } from './toggle-group';

const meta = {
  title: 'Design System/Primitives/Toggle Group',
  component: ToggleGroup,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type Variant = 'ghost' | 'outline';
type Size = 'sm' | 'default' | 'lg';
type Orientation = 'horizontal' | 'vertical';

const VARIANTS: Variant[] = ['ghost', 'outline'];
const SIZES: Size[] = ['sm', 'default', 'lg'];
const ORIENTATIONS: Orientation[] = ['horizontal', 'vertical'];
const ROUNDNESSES: ToggleGroupRoundness[] = ['default', 'round'];

/** shadcn Demo — single selection (Base UI `multiple={false}`). */
function DemoExample() {
  return (
    <ToggleGroup
      aria-label="Text formatting"
      defaultValue={['bold']}
      variant="outline"
      spacing={0}
    >
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function OutlineExample() {
  return (
    <ToggleGroup
      aria-label="Call filter"
      defaultValue={['missed']}
      variant="outline"
      spacing={0}
    >
      <ToggleGroupItem value="all" data-icon="inline-start">
        <PhoneIcon data-icon="inline-start" />
        All
      </ToggleGroupItem>
      <ToggleGroupItem value="missed" data-icon="inline-start">
        <PhoneMissedIcon data-icon="inline-start" />
        Missed
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function SizeExample() {
  return (
    <div className="flex flex-col items-start gap-[var(--spacing-md)]">
      {SIZES.map((size) => (
        <ToggleGroup
          key={size}
          aria-label={`Alignment ${size}`}
          defaultValue={['center']}
          variant="outline"
          size={size}
          spacing={0}
        >
          <ToggleGroupItem value="left" aria-label="Align left">
            <AlignLeftIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <AlignCenterIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <AlignRightIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  );
}

/** Default spacing=2 (spaced); spacing={0} connected (2026-05-17 changelog). */
function SpacingExample() {
  return (
    <div className="flex flex-col items-start gap-[var(--spacing-md)]">
      <ToggleGroup
        aria-label="Range spaced"
        defaultValue={['24h']}
        variant="outline"
      >
        <ToggleGroupItem value="24h">Last 24 hours</ToggleGroupItem>
        <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        aria-label="Range connected"
        defaultValue={['24h']}
        variant="outline"
        spacing={0}
      >
        <ToggleGroupItem value="24h">Last 24 hours</ToggleGroupItem>
        <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

/** Figma Roundness=Round — pill shell; Ghost keeps outer ring, no inner dividers. */
function RoundExample() {
  return (
    <div className="flex flex-col items-start gap-[var(--spacing-md)]">
      <ToggleGroup
        aria-label="Formatting ghost round connected"
        defaultValue={['bold']}
        variant="ghost"
        spacing={0}
        roundness="round"
      >
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        aria-label="Formatting outline round connected"
        defaultValue={['bold']}
        variant="outline"
        spacing={0}
        roundness="round"
      >
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        aria-label="Formatting round spaced"
        defaultValue={['bold']}
        variant="outline"
        roundness="round"
      >
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

function VerticalExample() {
  return (
    <ToggleGroup
      aria-label="Text formatting vertical"
      defaultValue={['bold']}
      orientation="vertical"
      variant="outline"
      spacing={0}
    >
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function DisabledExample() {
  return (
    <ToggleGroup
      aria-label="Formatting disabled"
      defaultValue={['bold']}
      variant="outline"
      spacing={0}
      disabled
    >
      <ToggleGroupItem value="bold" aria-label="Bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function CustomExample() {
  const [weight, setWeight] = useState<string[]>(['normal']);

  return (
    <div className="flex flex-col gap-[var(--spacing-xs)]">
      <p className="text-sm text-muted-foreground">Font Weight</p>
      <ToggleGroup
        aria-label="Font weight"
        variant="outline"
        value={weight}
        onValueChange={setWeight}
      >
        <ToggleGroupItem value="light" className="font-light">
          Aa Light
        </ToggleGroupItem>
        <ToggleGroupItem value="normal" className="font-normal">
          Aa Normal
        </ToggleGroupItem>
        <ToggleGroupItem value="medium" className="font-medium">
          Aa Medium
        </ToggleGroupItem>
        <ToggleGroupItem value="bold" className="font-bold">
          Aa Bold
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

function RtlExample() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl">
        <ToggleGroup
          aria-label="عرض القائمة"
          defaultValue={['list']}
          variant="outline"
          spacing={0}
        >
          <ToggleGroupItem value="menu" data-icon="inline-start">
            <MenuIcon data-icon="inline-start" />
            قائمة
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" data-icon="inline-start">
            <LayoutGridIcon data-icon="inline-start" />
            شبكة
          </ToggleGroupItem>
          <ToggleGroupItem value="list" data-icon="inline-start">
            <LayoutListIcon data-icon="inline-start" />
            بطاقات
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </DirectionProvider>
  );
}

function ToggleGroupPlayground() {
  const [variant, setVariant] = useState<Variant>('outline');
  const [size, setSize] = useState<Size>('default');
  const [orientation, setOrientation] = useState<Orientation>('horizontal');
  const [spacing, setSpacing] = useState<'0' | '2'>('2');
  const [roundness, setRoundness] = useState<ToggleGroupRoundness>('default');

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 items-center justify-center">
          <ToggleGroup
            aria-label="Playground formatting"
            defaultValue={['bold']}
            variant={variant}
            size={size}
            orientation={orientation}
            spacing={Number(spacing)}
            roundness={roundness}
          >
            <ToggleGroupItem value="bold" aria-label="Bold">
              <BoldIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <ItalicIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <UnderlineIcon />
            </ToggleGroupItem>
          </ToggleGroup>
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
            label="Orientation"
            value={orientation}
            onChange={(v) => setOrientation(v as Orientation)}
            options={ORIENTATIONS.map((value) => ({ value, label: value }))}
            fullWidth
          />
          <InlineSegmentedControl
            label="Spacing"
            value={spacing}
            onChange={(v) => setSpacing(v as '0' | '2')}
            options={[
              { value: '0', label: 'Connected' },
              { value: '2', label: 'Spaced' },
            ]}
            fullWidth
          />
          <InlineSegmentedControl
            label="Roundness"
            value={roundness}
            onChange={(v) => setRoundness(v as ToggleGroupRoundness)}
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
      title="Toggle Group"
      description="A set of two-state buttons that toggle exclusive or multi selection. Figma Toggle Button chrome; shadcn Toggle Group + Base UI API."
      playground={<ToggleGroupPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Outline">
            <OutlineExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Size">
            <SizeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Spacing">
            <SpacingExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Round">
            <RoundExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Vertical">
            <VerticalExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Disabled">
            <DisabledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Custom">
            <CustomExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Compose <code>ToggleGroup</code> → <code>ToggleGroupItem</code>.
            Prefer Toggle Group for option state; use Button Group for actions.
          </li>
          <li>
            Single selection is the Base UI default (
            <code>multiple=&#123;false&#125;</code>). Pass{' '}
            <code>multiple</code> for multi-select (shadcn docs{' '}
            <code>type=&quot;single&quot;</code> /{' '}
            <code>type=&quot;multiple&quot;</code>).
          </li>
          <li>
            Default <code>spacing=&#123;2&#125;</code> gaps items; use{' '}
            <code>spacing=&#123;0&#125;</code> for a connected strip (Figma
            Position join). Use <code>roundness=&quot;round&quot;</code> for a
            pill shell (connected) or full-round items (spaced).
          </li>
          <li>
            Pass <code>variant</code> / <code>size</code> on the group to
            cascade to items. Always set <code>aria-label</code> on the group.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Items are toggle buttons — pressed state is exposed via{' '}
            <code>aria-pressed</code> / <code>data-pressed</code>.
          </li>
          <li>
            Arrow keys move focus within the group; focus loops by default (
            <code>loopFocus</code>).
          </li>
          <li>
            Icon-only items need an accessible name (
            <code>aria-label</code>).
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

export const Size: Story = {
  render: () => <SizeExample />,
};

export const Spacing: Story = {
  render: () => <SpacingExample />,
};

export const Round: Story = {
  render: () => <RoundExample />,
};

export const Vertical: Story = {
  render: () => <VerticalExample />,
};

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

export const Custom: Story = {
  render: () => <CustomExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
