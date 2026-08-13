import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { DirectionProvider } from '../direction';

import { AspectRatio } from './aspect-ratio';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages from Figma Aspect + shadcn Aspect Ratio.
 *
 * Docs: https://ui.shadcn.com/docs/components/base/aspect-ratio
 * Figma: https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-52053
 */

type AspectKey = '16:9' | '4:3' | '1:1' | '3:4' | '9:16';

const ASPECTS: { key: AspectKey; ratio: number; widthClass: string }[] = [
  { key: '16:9', ratio: 16 / 9, widthClass: 'w-80' },
  { key: '4:3', ratio: 4 / 3, widthClass: 'w-64' },
  { key: '1:1', ratio: 1, widthClass: 'w-52' },
  { key: '3:4', ratio: 3 / 4, widthClass: 'w-44' },
  { key: '9:16', ratio: 9 / 16, widthClass: 'w-36' },
];

const PHOTOS: Record<AspectKey, { src: string; alt: string }> = {
  '16:9': {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1280&h=720&fit=crop',
    alt: 'Mountain lake at dusk',
  },
  '4:3': {
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    alt: 'Sunlit studio interior',
  },
  '1:1': {
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop',
    alt: 'Abstract color field',
  },
  '3:4': {
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop',
    alt: 'Portrait',
  },
  '9:16': {
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=540&h=960&fit=crop',
    alt: 'Fashion portrait',
  },
};

const meta = {
  title: 'Design System/Primitives/Aspect Ratio',
  component: AspectRatio,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

function Frame({
  aspect,
  fill,
}: {
  aspect: AspectKey;
  fill: 'image' | 'empty';
}) {
  const { ratio, widthClass } = ASPECTS.find((item) => item.key === aspect)!;
  const photo = PHOTOS[aspect];

  return (
    <div className={widthClass}>
      <AspectRatio ratio={ratio}>
        {fill === 'image' ? (
          <img src={photo.src} alt={photo.alt} />
        ) : null}
      </AspectRatio>
    </div>
  );
}

/** shadcn aspect-ratio-demo — 16:9 photo. */
function DemoExample() {
  return <Frame aspect="16:9" fill="image" />;
}

/** shadcn aspect-ratio-square. */
function SquareExample() {
  return <Frame aspect="1:1" fill="image" />;
}

/** shadcn aspect-ratio-portrait — 9:16. */
function PortraitExample() {
  return <Frame aspect="9:16" fill="image" />;
}

/** shadcn aspect-ratio-rtl — caption + portrait. */
function RtlExample() {
  const photo = PHOTOS['3:4'];

  return (
    <DirectionProvider direction="rtl">
      <figure
        dir="rtl"
        className="flex w-44 flex-col gap-[var(--spacing-sm)]"
      >
        <AspectRatio ratio={3 / 4}>
          <img src={photo.src} alt="منظر طبيعي" />
        </AspectRatio>
        <figcaption className="text-[length:var(--text-paragraph-mini-regular-font-size)] text-[color:var(--muted-foreground)]">
          منظر طبيعي جميل
        </figcaption>
      </figure>
    </DirectionProvider>
  );
}

function AspectRatioPlayground() {
  const [aspect, setAspect] = useState<AspectKey>('16:9');
  const [fill, setFill] = useState<'image' | 'empty'>('image');

  return (
    <PlaygroundPanel
      preview={<Frame aspect={aspect} fill={fill} />}
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Aspect"
            value={aspect}
            options={ASPECTS.map((item) => ({
              value: item.key,
              label: item.key,
            }))}
            onChange={(v) => setAspect(v as AspectKey)}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Fill"
            value={fill}
            options={[
              { value: 'image', label: 'Image' },
              { value: 'empty', label: 'Empty' },
            ]}
            onChange={(v) => setFill(v as 'image' | 'empty')}
            fullWidth
            className="col-span-2"
          />
        </div>
      }
    />
  );
}

export const Overview: Story = {
  args: { ratio: 16 / 9 },
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Aspect Ratio"
      description={
        <>
          Media frame from Figma{' '}
          <a
            href="https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-52053"
            target="_blank"
            rel="noreferrer"
          >
            Aspect Ratio
          </a>{' '}
          with the{' '}
          <a
            href="https://ui.shadcn.com/docs/components/base/aspect-ratio"
            target="_blank"
            rel="noreferrer"
          >
            shadcn Aspect Ratio
          </a>{' '}
          API. Optional — lock a hole when the layout needs it; skip it when
          the crop already looks right.
        </>
      }
      playground={<AspectRatioPlayground />}
      variants={
        <div className="flex flex-wrap items-start gap-6">
          {ASPECTS.map((item) => (
            <PrimitiveGalleryItem key={item.key} label={item.key}>
              <Frame aspect={item.key} fill="image" />
            </PrimitiveGalleryItem>
          ))}
          <PrimitiveGalleryItem label="Empty (Figma shade)">
            <Frame aspect="16:9" fill="empty" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Pass <code>ratio</code> as width ÷ height (
            <code>16 / 9</code>, <code>1</code>, <code>9 / 16</code>). Width
            comes from the parent.
          </li>
          <li>
            Figma Aspects are 16:9, 4:3, 1:1, 3:4, 9:16 — use another number
            if the crop looks better.
          </li>
          <li>
            Do not wrap every image. Use the frame for cards, rails, and
            thumbnails; leave hero / editorial media intrinsic when that reads
            stronger.
          </li>
          <li>
            Empty frames paint <code>--theme-neutrals-300</code>. Images and
            video fill and cover automatically.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            The frame is a layout <code>div</code> — put the accessible name
            on the media (<code>alt</code> on images, captions on figures).
          </li>
          <li>
            Decorative empty placeholders can stay unlabeled; pair product
            media with visible text or an <code>aria-label</code> on the
            figure.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  args: { ratio: 16 / 9 },
  render: () => <DemoExample />,
};

export const Square: Story = {
  args: { ratio: 1 },
  render: () => <SquareExample />,
};

export const Portrait: Story = {
  args: { ratio: 9 / 16 },
  render: () => <PortraitExample />,
};

export const RTL: Story = {
  args: { ratio: 3 / 4 },
  render: () => <RtlExample />,
};
