import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from './carousel';
import { Card, CardContent } from '../card';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. Figma Carousel + shadcn / Embla docs.
 *
 * Deferred: Autoplay plugin story once `embla-carousel-autoplay` is added
 * (see README → Deferred / post-primitives docket).
 */

const meta = {
  title: 'Design System/Primitives/Carousel',
  component: Carousel,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const SLIDE_COUNT = 5;

/** Clearance for absolute Outline Round Icon Buttons outside the track. */
const NAV_GUTTER =
  'mx-[calc(var(--spacing-9)+var(--carousel-spacing))]';

function SlideCard({ n }: { n: number }) {
  return (
    <Card className="w-full">
      <CardContent className="flex aspect-square items-center justify-center p-[length:var(--spacing-md)]">
        <span
          className={[
            'font-[family-name:var(--font-family-headings)]',
            'text-[length:var(--text-heading-2-font-size)]',
            'leading-[var(--text-heading-2-line-height)]',
            'tracking-[var(--text-heading-2-letter-spacing)]',
            '[font-weight:var(--text-heading-2-font-weight)]',
          ].join(' ')}
        >
          {n}
        </span>
      </CardContent>
    </Card>
  );
}

function slideItems(count = SLIDE_COUNT, itemClassName?: string) {
  return Array.from({ length: count }, (_, i) => (
    <CarouselItem key={i} className={itemClassName}>
      <SlideCard n={i + 1} />
    </CarouselItem>
  ));
}

/* ---------- Canonical examples ---------- */

function BasicExample() {
  return (
    <Carousel className={`w-full max-w-xs ${NAV_GUTTER}`}>
      <CarouselContent>{slideItems()}</CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

function SizeExample() {
  return (
    <Carousel
      opts={{ align: 'start' }}
      className={`w-full max-w-sm ${NAV_GUTTER}`}
    >
      <CarouselContent>{slideItems(5, 'basis-1/3')}</CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

function SpacingExample({
  spacing = 'var(--spacing-md)',
}: {
  spacing?: string;
} = {}) {
  return (
    <Carousel
      className={`w-full max-w-sm ${NAV_GUTTER}`}
      style={{ ['--carousel-spacing' as string]: spacing }}
    >
      <CarouselContent>{slideItems(5, 'basis-1/2')}</CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

function OrientationExample() {
  return (
    <Carousel
      orientation="vertical"
      opts={{ align: 'start' }}
      className="mx-auto w-full max-w-xs py-[calc(var(--spacing-9)+var(--carousel-spacing))]"
    >
      <CarouselContent className="h-[200px]">
        {slideItems(5, 'basis-1/2')}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

function ApiExample() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex w-full max-w-xs flex-col gap-[length:var(--spacing-sm)]">
      <Carousel setApi={setApi} className={NAV_GUTTER}>
        <CarouselContent>{slideItems()}</CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <p className="text-center text-[length:var(--text-paragraph-small-regular-font-size)] text-[color:var(--muted-foreground)]">
        Slide {current} of {count}
      </p>
    </div>
  );
}

function RtlExample() {
  return (
    <Carousel
      dir="rtl"
      opts={{ direction: 'rtl' }}
      className={`w-full max-w-xs ${NAV_GUTTER}`}
    >
      <CarouselContent>{slideItems()}</CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

/* ---------- Playground ---------- */

function CarouselPlayground() {
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(
    'horizontal'
  );
  const [basis, setBasis] = useState<'full' | '1/2' | '1/3'>('full');
  const [spacing, setSpacing] = useState('var(--spacing-md)');
  const [loop, setLoop] = useState(false);

  const itemClass =
    basis === 'full' ? undefined : basis === '1/2' ? 'basis-1/2' : 'basis-1/3';

  return (
    <PlaygroundPanel
      preview={
        <Carousel
          orientation={orientation}
          opts={{ align: 'start', loop }}
          className={
            orientation === 'horizontal'
              ? `w-full max-w-sm ${NAV_GUTTER}`
              : 'mx-auto w-full max-w-xs py-[calc(var(--spacing-9)+var(--carousel-spacing))]'
          }
          style={{ ['--carousel-spacing' as string]: spacing }}
        >
          <CarouselContent
            className={orientation === 'vertical' ? 'h-[220px]' : undefined}
          >
            {slideItems(5, itemClass)}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
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
          />
          <InlineSegmentedControl
            label="Loop"
            value={loop ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setLoop(v === 'on')}
            fullWidth
          />
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Item size"
              value={basis}
              options={[
                { value: 'full', label: 'Full' },
                { value: '1/2', label: '1/2' },
                { value: '1/3', label: '1/3' },
              ]}
              onChange={(v) => setBasis(v as 'full' | '1/2' | '1/3')}
              fullWidth
            />
          </div>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Spacing"
              value={spacing}
              options={[
                { value: 'var(--spacing-xs)', label: '8' },
                { value: 'var(--spacing-sm)', label: '12' },
                { value: 'var(--spacing-md)', label: '16' },
                { value: 'var(--spacing-xl)', label: '24' },
              ]}
              onChange={setSpacing}
              fullWidth
            />
          </div>
        </div>
      }
    />
  );
}

/* ---------- Stories ---------- */

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Carousel"
      description={
        <>
          Embla carousel with Foundations slide gap (
          <code>--carousel-spacing</code>, default 16) and Fabely Icon Button
          nav (Outline · Round). API follows{' '}
          <a
            href="https://ui.shadcn.com/docs/components/base/carousel"
            className="underline underline-offset-2"
          >
            shadcn Carousel
          </a>
          .
        </>
      }
      playground={<CarouselPlayground />}
      variants={
        <div className="flex flex-wrap gap-8">
          <PrimitiveGalleryItem label="Basic">
            <BasicExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Sizes">
            <SizeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Spacing">
            <SpacingExample spacing="var(--spacing-xl)" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Vertical">
            <OrientationExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="API">
            <ApiExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Compose <code>Carousel</code> → <code>CarouselContent</code> →{' '}
            <code>CarouselItem</code>, plus optional Previous / Next.
          </li>
          <li>
            Size items with <code>basis-*</code> on <code>CarouselItem</code>.
          </li>
          <li>
            Tune gap with{' '}
            <code>[--carousel-spacing:var(--spacing-*)]</code> (Foundations
            only). Logical <code>ms</code>/<code>ps</code> keep RTL correct.
          </li>
          <li>
            Leave horizontal gutter for absolute nav — e.g.{' '}
            <code>mx-[calc(var(--spacing-9)+var(--carousel-spacing))]</code>.
          </li>
          <li>
            For RTL, set <code>dir</code> and <code>opts.direction</code> to{' '}
            <code>&quot;rtl&quot;</code>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Root is <code>role=&quot;region&quot;</code> with{' '}
            <code>aria-roledescription=&quot;carousel&quot;</code>; slides are
            groups with <code>aria-roledescription=&quot;slide&quot;</code>.
          </li>
          <li>
            Previous / Next are Icon Buttons with required{' '}
            <code>aria-label</code>s (defaults provided).
          </li>
          <li>
            Arrow Left / Right on the region call scroll previous / next.
          </li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {
  name: 'Basic',
  render: () => <BasicExample />,
};

export const Sizes: Story = {
  render: () => <SizeExample />,
};

export const Spacing: Story = {
  render: () => <SpacingExample />,
};

export const Orientation: Story = {
  name: 'Vertical',
  render: () => <OrientationExample />,
};

export const API: Story = {
  render: () => <ApiExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
