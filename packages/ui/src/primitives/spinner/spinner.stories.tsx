import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Badge } from '../badge';
import { Button } from '../button';
import { DirectionProvider } from '../direction';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '../input-group';
import { Item, ItemContent, ItemMedia, ItemTitle } from '../item';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import { Spinner } from './spinner';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages from the shadcn Spinner guide + Figma Spinner axes.
 */

const meta = {
  title: 'Design System/Primitives/Spinner',
  component: Spinner,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const ICON_SIZE_CLASS: Record<IconSize, string> = {
  xs: 'size-[length:var(--icon-xs)]',
  sm: 'size-[length:var(--icon-sm)]',
  md: 'size-[length:var(--icon-md)]',
  lg: 'size-[length:var(--icon-lg)]',
  xl: 'size-[length:var(--icon-xl)]',
};

function SizeExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-md)]">
      {(Object.keys(ICON_SIZE_CLASS) as IconSize[]).map((size) => (
        <Spinner key={size} className={ICON_SIZE_CLASS[size]} />
      ))}
    </div>
  );
}

function ButtonExample() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--spacing-sm)]">
      <Button disabled>
        <Spinner data-icon="inline-start" />
        Loading…
      </Button>
      <Button variant="secondary" disabled>
        <Spinner data-icon="inline-start" />
        Please wait
      </Button>
      <Button variant="outline" disabled>
        Processing
        <Spinner data-icon="inline-end" />
      </Button>
    </div>
  );
}

function BadgeExample() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--spacing-sm)]">
      <Badge variant="secondary">
        <Spinner data-icon="inline-start" className="size-[length:var(--icon-xs)]" />
        Syncing
      </Badge>
      <Badge variant="outline">
        <Spinner data-icon="inline-start" className="size-[length:var(--icon-xs)]" />
        Updating
      </Badge>
      <Badge>
        <Spinner data-icon="inline-start" className="size-[length:var(--icon-xs)]" />
        Processing
      </Badge>
    </div>
  );
}

function InputGroupExample() {
  return (
    <div className="w-full max-w-xs">
      <InputGroup>
        <InputGroupInput placeholder="Send a message…" disabled />
        <InputGroupAddon align="inline-end">
          <Spinner className="size-[length:var(--icon-xs)]" />
          <InputGroupText>Validating…</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupButton disabled>Send</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function EmptyExample() {
  return (
    <Empty className="w-full max-w-sm border border-[color:var(--border)]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Processing your request</EmptyTitle>
        <EmptyDescription>
          Please wait while we process your request. Do not refresh the page.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="small">
          Cancel
        </Button>
      </EmptyContent>
    </Empty>
  );
}

function ItemExample() {
  return (
    <div className="w-full max-w-xs">
      <Item variant="muted">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Processing payment…</ItemTitle>
        </ItemContent>
        <div className="text-[length:var(--text-paragraph-small-regular-font-size)] text-[color:var(--muted-foreground)]">
          $100.00
        </div>
      </Item>
    </div>
  );
}

function RtlExample() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="w-full max-w-xs">
        <Item variant="muted">
          <ItemMedia>
            <Spinner />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>جاري معالجة الدفع...</ItemTitle>
          </ItemContent>
          <div className="text-[length:var(--text-paragraph-small-regular-font-size)] text-[color:var(--muted-foreground)]">
            ١٠٠.٠٠ دولار
          </div>
        </Item>
      </div>
    </DirectionProvider>
  );
}

function SpinnerPlayground() {
  const [size, setSize] = useState<IconSize>('sm');
  const [mirrored, setMirrored] = useState(false);

  return (
    <PlaygroundPanel
      preview={<Spinner mirrored={mirrored} className={ICON_SIZE_CLASS[size]} />}
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Size"
            value={size}
            options={[
              { value: 'xs', label: 'XS' },
              { value: 'sm', label: 'SM' },
              { value: 'md', label: 'MD' },
              { value: 'lg', label: 'LG' },
              { value: 'xl', label: 'XL' },
            ]}
            onChange={(v) => setSize(v as IconSize)}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Mirrored"
            value={mirrored ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Default' },
              { value: 'on', label: 'Mirrored' },
            ]}
            onChange={(v) => setMirrored(v === 'on')}
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
      title="Spinner"
      description={
        <>
          Loading indicator from Figma{' '}
          <a
            href="https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=757-154511"
            target="_blank"
            rel="noreferrer"
          >
            Spinner
          </a>{' '}
          with the{' '}
          <a
            href="https://ui.shadcn.com/docs/components/base/spinner"
            target="_blank"
            rel="noreferrer"
          >
            shadcn Spinner
          </a>{' '}
          API. Default size is <code>--icon-sm</code> (16).
        </>
      }
      playground={<SpinnerPlayground />}
      variants={
        <div className="flex flex-wrap gap-6">
          <PrimitiveGalleryItem label="Demo">
            <ItemExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Size">
            <SizeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Button">
            <ButtonExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Badge">
            <BadgeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Input Group">
            <InputGroupExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Empty">
            <EmptyExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Size with <code>--icon-*</code> via{' '}
            <code>className=&quot;size-[length:var(--icon-md)]&quot;</code> — never
            raw px.
          </li>
          <li>
            In Button / Badge, place with <code>data-icon=&quot;inline-start&quot;</code>{' '}
            or <code>inline-end</code> and disable the host while loading.
          </li>
          <li>
            <code>mirrored</code> maps Figma Type=Mirrored (reverse spin).
          </li>
          <li>
            Page-load “Spinner large” (frame sequence) is not this leaf — see
            Deferred.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Default <code>role=&quot;status&quot;</code> and{' '}
            <code>aria-label=&quot;Loading&quot;</code>. Override the label when
            context needs a more specific name.
          </li>
          <li>
            Prefer disabling interactive hosts (Button, Input) while the
            spinner is shown.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <ItemExample />,
};

export const Size: Story = {
  render: () => <SizeExample />,
};

export const ButtonStory: Story = {
  name: 'Button',
  render: () => <ButtonExample />,
};

export const BadgeStory: Story = {
  name: 'Badge',
  render: () => <BadgeExample />,
};

export const InputGroupStory: Story = {
  name: 'Input Group',
  render: () => <InputGroupExample />,
};

export const EmptyStory: Story = {
  name: 'Empty',
  render: () => <EmptyExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
