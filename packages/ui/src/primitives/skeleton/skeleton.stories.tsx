import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { Card, CardContent, CardHeader } from '../card';

import { Skeleton } from './skeleton';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground + gallery mirroring shadcn base-nova docs
 * previews (`skeleton-demo` … `skeleton-rtl`), plus Figma placeholder recipes.
 *
 * Docs: https://ui.shadcn.com/docs/components/base/skeleton
 * Sources: apps/v4/examples/base/skeleton-*.tsx (base-nova)
 * Figma: https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-52052
 */

type Shape = 'line' | 'avatar' | 'object';

const meta = {
  title: 'Design System/Primitives/Skeleton',
  component: Skeleton,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/* ---------- shadcn base-nova docs previews ---------- */

/** `skeleton-demo` — avatar + two lines. */
function DemoExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-md)]">
      <Skeleton className="size-[length:var(--spacing-4xl)] shrink-0 rounded-full" />
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        <Skeleton className="h-[length:var(--spacing-md)] w-[15.625rem]" />
        <Skeleton className="h-[length:var(--spacing-md)] w-[12.5rem]" />
      </div>
    </div>
  );
}

/** `skeleton-avatar` — size-10 circle + two lines. */
function AvatarExample() {
  return (
    <div className="flex w-fit items-center gap-[var(--spacing-md)]">
      <Skeleton className="size-[length:var(--spacing-3xl)] shrink-0 rounded-full" />
      <div className="grid gap-[var(--spacing-xs)]">
        <Skeleton className="h-[length:var(--spacing-md)] w-[9.375rem]" />
        <Skeleton className="h-[length:var(--spacing-md)] w-[6.25rem]" />
      </div>
    </div>
  );
}

/** `skeleton-card` — header lines + aspect-video media. */
function CardExample() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="gap-[var(--spacing-xs)]">
        <Skeleton className="h-[length:var(--spacing-md)] w-2/3" />
        <Skeleton className="h-[length:var(--spacing-md)] w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
  );
}

/** `skeleton-text` — three lines. */
function TextExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-[var(--spacing-xs)]">
      <Skeleton className="h-[length:var(--spacing-md)] w-full" />
      <Skeleton className="h-[length:var(--spacing-md)] w-full" />
      <Skeleton className="h-[length:var(--spacing-md)] w-3/4" />
    </div>
  );
}

/** `skeleton-form` — labels + h-8 fields + submit bone. */
function FormExample() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-[1.75rem]">
      <div className="flex flex-col gap-[var(--spacing-sm)]">
        <Skeleton className="h-[length:var(--spacing-md)] w-20" />
        <Skeleton className="h-[length:var(--spacing-2xl)] w-full" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-sm)]">
        <Skeleton className="h-[length:var(--spacing-md)] w-24" />
        <Skeleton className="h-[length:var(--spacing-2xl)] w-full" />
      </div>
      <Skeleton className="h-[length:var(--spacing-2xl)] w-24" />
    </div>
  );
}

/** `skeleton-table` — five rows × three columns. */
function TableExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-[var(--spacing-xs)]">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="flex gap-[var(--spacing-md)]" key={index}>
          <Skeleton className="h-[length:var(--spacing-md)] flex-1" />
          <Skeleton className="h-[length:var(--spacing-md)] w-24" />
          <Skeleton className="h-[length:var(--spacing-md)] w-20" />
        </div>
      ))}
    </div>
  );
}

/** `skeleton-rtl` — demo composition under `dir="rtl"`. */
function RtlExample() {
  return (
    <div dir="rtl">
      <DemoExample />
    </div>
  );
}

/* ---------- Figma placeholder recipes ---------- */

/** Figma Placeholder Avatar / Line / Object (`222:27480` … `222:27487`). */
function PlaceholdersExample() {
  return (
    <div className="flex flex-col gap-[var(--spacing-xl)]">
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        <p className="text-[length:var(--text-paragraph-mini-regular-font-size)] text-muted-foreground">
          Avatar
        </p>
        <Skeleton className="size-[length:var(--spacing-4xl)] rounded-full" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        <p className="text-[length:var(--text-paragraph-mini-regular-font-size)] text-muted-foreground">
          Line
        </p>
        <Skeleton className="h-[length:var(--spacing-md)] w-[min(100%,16.25rem)]" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        <p className="text-[length:var(--text-paragraph-mini-regular-font-size)] text-muted-foreground">
          Object
        </p>
        <Skeleton className="h-[8.25rem] w-[min(100%,16.25rem)]" />
      </div>
    </div>
  );
}

function SkeletonPlayground() {
  const [shape, setShape] = useState<Shape>('line');

  return (
    <PlaygroundPanel
      preview={
        shape === 'avatar' ? (
          <Skeleton className="size-[length:var(--spacing-4xl)] rounded-full" />
        ) : shape === 'object' ? (
          <Skeleton className="h-[8.25rem] w-[min(100%,16.25rem)]" />
        ) : (
          <Skeleton className="h-[length:var(--spacing-md)] w-[min(100%,16.25rem)]" />
        )
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Shape"
            value={shape}
            onChange={setShape}
            options={[
              { value: 'line', label: 'Line' },
              { value: 'avatar', label: 'Avatar' },
              { value: 'object', label: 'Object' },
            ]}
            fullWidth
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
      title="Skeleton"
      description="Use to show a placeholder while content is loading."
      playground={<SkeletonPlayground />}
      variants={
        <>
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Avatar">
            <AvatarExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Card">
            <CardExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Text">
            <TextExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Form">
            <FormExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Table">
            <TableExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Figma placeholders">
            <PlaceholdersExample />
          </PrimitiveGalleryItem>
        </>
      }
      usageGuidance={
        <ul className="list-disc space-y-[var(--spacing-2xs)] ps-[var(--spacing-md)] text-[length:var(--text-paragraph-small-regular-font-size)] text-muted-foreground">
          <li>
            Story pages mirror{' '}
            <a href="https://ui.shadcn.com/docs/components/base/skeleton">
              shadcn Skeleton
            </a>{' '}
            base-nova previews (
            <code>skeleton-demo</code>, <code>skeleton-avatar</code>,{' '}
            <code>skeleton-card</code>, <code>skeleton-text</code>,{' '}
            <code>skeleton-form</code>, <code>skeleton-table</code>,{' '}
            <code>skeleton-rtl</code>).
          </li>
          <li>
            Size and shape via <code>className</code>. Default radius is{' '}
            <code>--rounded-md</code>; use <code>rounded-full</code> for
            Avatar.
          </li>
          <li>
            Figma Avatar / Line / Object:
            <code>--spacing-4xl</code> / <code>--spacing-md</code> / content
            height.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-[var(--spacing-2xs)] ps-[var(--spacing-md)] text-[length:var(--text-paragraph-small-regular-font-size)] text-muted-foreground">
          <li>
            Decorative only — put <code>aria-busy</code> / status text on the
            loading host, not on each bone.
          </li>
          <li>
            Pulse is the default motion; Figma Wave wash is deferred.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Avatar: Story = {
  render: () => <AvatarExample />,
};

export const CardStory: Story = {
  name: 'Card',
  render: () => <CardExample />,
};

export const Text: Story = {
  render: () => <TextExample />,
};

export const Form: Story = {
  render: () => <FormExample />,
};

export const Table: Story = {
  render: () => <TableExample />,
};

export const RTL: Story = {
  name: 'RTL',
  render: () => <RtlExample />,
};

export const Placeholders: Story = {
  name: 'Figma placeholders',
  render: () => <PlaceholdersExample />,
};
