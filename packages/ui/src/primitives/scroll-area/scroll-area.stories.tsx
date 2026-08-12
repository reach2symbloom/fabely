import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { Separator } from '../separator';

import { ScrollArea, ScrollBar } from './scroll-area';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground + shadcn Scroll Area docs (Demo / Horizontal /
 * RTL).
 *
 * Figma: https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=164-18669
 */

const meta = {
  title: 'Design System/Primitives/Scroll Area',
  component: ScrollArea,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

const works = [
  {
    artist: 'Ornella Binni',
    art: 'https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80',
  },
  {
    artist: 'Tom Byrom',
    art: 'https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80',
  },
  {
    artist: 'Vladimir Malyav',
    art: 'https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80',
  },
] as const;

const CARD = [
  'rounded-[length:var(--rounded-md)]',
  'border border-[color:var(--border)]',
].join(' ');

const TITLE = [
  'font-[family-name:var(--text-paragraph-small-medium-font-family)]',
  '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
  'text-[length:var(--text-paragraph-small-medium-font-size)]',
  'leading-[var(--text-paragraph-small-medium-line-height)]',
  'text-[color:var(--foreground)]',
].join(' ');

const META = [
  'font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
  '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
  'text-[length:var(--text-paragraph-mini-regular-font-size)]',
  'leading-[var(--text-paragraph-mini-regular-line-height)]',
  'text-[color:var(--muted-foreground)]',
].join(' ');

type DemoKind = 'vertical' | 'horizontal';

/* ---------- Canonical examples (shadcn docs) ---------- */

/** Tags list — shadcn scroll-area-demo. */
function DemoExample() {
  return (
    <ScrollArea className={cnShell('h-72 w-48')}>
      <div className="p-[var(--spacing-md)]">
        <h4 className={`mb-[var(--spacing-md)] ${TITLE}`}>Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className={`py-[var(--spacing-xs)] text-[color:var(--foreground)] ${META}`}>
              {tag}
            </div>
            <Separator className="my-[var(--spacing-3xs)]" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

/** Photo strip — shadcn scroll-area-horizontal-demo. */
function HorizontalExample() {
  return (
    <ScrollArea className={cnShell('w-96 whitespace-nowrap')}>
      <div className="flex w-max gap-[var(--spacing-md)] p-[var(--spacing-md)]">
        {works.map((artwork) => (
          <figure key={artwork.artist} className="shrink-0">
            <div className="overflow-hidden rounded-[length:var(--rounded-md)]">
              <img
                src={artwork.art}
                alt={`Photo by ${artwork.artist}`}
                className="aspect-[3/4] w-[length:var(--spacing-9xl)] object-cover"
                width={150}
                height={200}
              />
            </div>
            <figcaption className={`pt-[var(--spacing-xs)] ${META}`}>
              Photo by{' '}
              <span className="text-[color:var(--foreground)]">
                {artwork.artist}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

function RtlExample() {
  return (
    <div dir="rtl" className="flex flex-col gap-[var(--spacing-sm)]">
      <p className={META}>العربية (RTL)</p>
      <ScrollArea className={cnShell('h-72 w-48')}>
        <div className="p-[var(--spacing-md)]">
          <h4 className={`mb-[var(--spacing-md)] ${TITLE}`}>العلامات</h4>
          {tags.map((tag) => (
            <div key={tag}>
              <div className={`py-[var(--spacing-xs)] text-[color:var(--foreground)] ${META}`}>
                {tag}
              </div>
              <Separator className="my-[var(--spacing-3xs)]" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function cnShell(...parts: string[]) {
  return [CARD, ...parts].join(' ');
}

/* ---------- Playground ---------- */

function ScrollAreaPlayground() {
  const [kind, setKind] = useState<DemoKind>('vertical');

  return (
    <PlaygroundPanel
      previewAlign="center"
      preview={
        kind === 'horizontal' ? <HorizontalExample /> : <DemoExample />
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Orientation"
              value={kind}
              options={[
                { value: 'vertical', label: 'Vertical' },
                { value: 'horizontal', label: 'Horizontal' },
              ]}
              onChange={(v) => setKind(v as DemoKind)}
              fullWidth
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
      title="Scroll Area"
      description="Augments native scroll with a Foundations scrollbar (Figma 4px neutrals-200 thumb)."
      playground={<ScrollAreaPlayground />}
      variants={
        <div className="flex flex-col gap-[var(--spacing-xl)]">
          <PrimitiveGalleryItem label="Demo (tags)">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Horizontal">
            <HorizontalExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-[var(--spacing-xs)] ps-[var(--spacing-md)]">
          <li>
            Size the root with height/width (e.g.{' '}
            <code>h-72 w-48</code>) — the viewport fills the root.
          </li>
          <li>
            Vertical scrollbar is included by default. For horizontal overflow,
            add <code>&lt;ScrollBar orientation=&quot;horizontal&quot; /&gt;</code>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-[var(--spacing-xs)] ps-[var(--spacing-md)]">
          <li>
            Viewport is keyboard-focusable; focus uses Foundations{' '}
            <code>--effect-focus-ring-secondary</code>.
          </li>
          <li>
            Prefer meaningful labels on scrollable regions when content is not
            otherwise announced.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Horizontal: Story = {
  render: () => <HorizontalExample />,
};

export const RTL: Story = {
  name: 'RTL',
  render: () => <RtlExample />,
};
