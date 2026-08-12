import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import {
  Card,
  CardContent,
  CardHeader,
} from '../card';

import { Skeleton } from './skeleton';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground + Figma placeholder gallery, then shadcn-aligned
 * Demo / Avatar / Card / Text examples.
 *
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

/* ---------- Canonical examples ---------- */

/** Figma composed Skeleton (`303:246698`) — Avatar + Line + Object. */
function DemoExample() {
  return (
    <div className="flex w-[min(100%,20rem)] items-start gap-[var(--spacing-sm)]">
      <Skeleton className="size-[length:var(--spacing-4xl)] shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-sm)]">
        <Skeleton className="h-[length:var(--spacing-md)] w-full" />
        <Skeleton className="h-[8.25rem] w-full" />
      </div>
    </div>
  );
}

/** Figma Placeholder Avatar (`222:27480`). */
function AvatarExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-md)]">
      <Skeleton className="size-[length:var(--spacing-4xl)] rounded-full" />
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        <Skeleton className="h-[length:var(--spacing-md)] w-[10rem]" />
        <Skeleton className="h-[length:var(--spacing-md)] w-[7.5rem]" />
      </div>
    </div>
  );
}

/** shadcn Card skeleton composition. */
function CardExample() {
  return (
    <Card className="w-[min(100%,22rem)]">
      <CardHeader className="gap-[var(--spacing-sm)]">
        <Skeleton className="h-[length:var(--spacing-md)] w-2/3" />
        <Skeleton className="h-[length:var(--spacing-md)] w-1/2" />
      </CardHeader>
      <CardContent className="flex flex-col gap-[var(--spacing-sm)]">
        <Skeleton className="h-[7.5rem] w-full" />
        <Skeleton className="h-[length:var(--spacing-md)] w-full" />
        <Skeleton className="h-[length:var(--spacing-md)] w-4/5" />
      </CardContent>
    </Card>
  );
}

/** Figma Placeholder Line (`222:27481`) stack — shadcn Text demo. */
function TextExample() {
  return (
    <div className="flex w-[min(100%,16rem)] flex-col gap-[var(--spacing-xs)]">
      <Skeleton className="h-[length:var(--spacing-md)] w-full" />
      <Skeleton className="h-[length:var(--spacing-md)] w-11/12" />
      <Skeleton className="h-[length:var(--spacing-md)] w-4/5" />
      <Skeleton className="h-[length:var(--spacing-md)] w-2/3" />
    </div>
  );
}

/** Figma Placeholder Object (`222:27487`). */
function ObjectExample() {
  return <Skeleton className="h-[8.25rem] w-[min(100%,16.25rem)]" />;
}

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
        <ObjectExample />
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
      description="Figma placeholder blocks (Avatar, Line, Object) with pulse — size and shape via className."
      playground={<SkeletonPlayground />}
      variants={
        <>
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Placeholders">
            <PlaceholdersExample />
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
        </>
      }
      usageGuidance={
        <ul className="list-disc space-y-[var(--spacing-2xs)] ps-[var(--spacing-md)] text-[length:var(--text-paragraph-small-regular-font-size)] text-muted-foreground">
          <li>
            Size the bone with <code>className</code> — do not invent height /
            width tokens. Prefer Foundations spacing for known Figma sizes
            (Avatar <code>--spacing-4xl</code>, Line <code>--spacing-md</code>).
          </li>
          <li>
            Default radius is <code>--rounded-md</code>; use{' '}
            <code>rounded-full</code> for Avatar.
          </li>
          <li>
            Compose layouts (card headers, text stacks) from multiple{' '}
            <code>Skeleton</code>s — the primitive stays a single bone.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-[var(--spacing-2xs)] ps-[var(--spacing-md)] text-[length:var(--text-paragraph-small-regular-font-size)] text-muted-foreground">
          <li>
            Decorative only — wrap loading regions with{' '}
            <code>aria-busy</code> / live status text on the host, not on each
            bone.
          </li>
          <li>
            Prefer reduced-motion-friendly pulse; Wave wash from Figma loader
            atoms is deferred.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Placeholders: Story = {
  render: () => <PlaceholdersExample />,
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
