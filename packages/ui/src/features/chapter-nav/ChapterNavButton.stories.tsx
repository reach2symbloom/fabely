/**
 * Chapter Nav Button — manuscript location trigger. Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState, type RefObject } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import {
  MeasurementOverlay,
  type MeasurementTarget,
} from '../../../stories/MeasurementOverlay';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import {
  TokenSpecSheet,
  type SpecTarget,
} from '../../../stories/TokenSpecSheet';

import { ChapterNavButton } from './ChapterNavButton';

const meta = {
  title: 'Design System/Features/Chapter Nav Button',
  component: ChapterNavButton,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ChapterNavButton>;

export default meta;
type Story = StoryObj<typeof meta>;

type Appearance = 'empty' | 'filled';

/** Figma Chapter nav button copy (16038:15527). */
const FIGMA_EMPTY = {
  bookTitle: 'Untitled book',
  chapterNumber: 1,
  chapterName: '',
} as const;

const FIGMA_FILLED = {
  bookTitle: 'The Lumithra Prophecy',
  chapterNumber: 1,
  chapterName: 'The Eldergrove',
} as const;

const DEMO_FRAME = 'w-[length:var(--tw-raw-spacing-80)]';

const CHAPTER_NAV_MEASURES: MeasurementTarget[] = [
  {
    name: 'shell',
    measure: ['padding', 'gap', 'width', 'height'],
  },
  {
    name: 'chapter row',
    selector: '[data-slot=chapter-nav-row]',
    measure: ['gap'],
  },
];

const CHAPTER_NAV_SPEC: SpecTarget[] = [
  { name: 'Container' },
  { name: 'Book title', selector: '[data-slot=chapter-nav-title]' },
  {
    name: 'Chapter name',
    selector: '[data-slot=input-group]',
    textSelector: '[data-slot=input-group-control]',
    colorSelector: '[data-slot=input-group-text]',
  },
  { name: 'Chevron', selector: '[data-slot=icon-button]' },
];

function EmptyExample() {
  return (
    <div className={DEMO_FRAME}>
      <ChapterNavButton {...FIGMA_EMPTY} />
    </div>
  );
}

function FilledExample() {
  return (
    <div className={DEMO_FRAME}>
      <ChapterNavButton {...FIGMA_FILLED} />
    </div>
  );
}

function ChapterNavPlayground({
  subjectRef,
}: {
  subjectRef?: RefObject<HTMLDivElement | null>;
}) {
  const [appearance, setAppearance] = useState<Appearance>('empty');
  const [showMeasures, setShowMeasures] = useState(false);
  const isEmpty = appearance === 'empty';

  const demo = (
    <ChapterNavButton {...(isEmpty ? FIGMA_EMPTY : FIGMA_FILLED)} />
  );

  return (
    <PlaygroundPanel
      previewAlign={showMeasures ? 'stretch' : 'center'}
      preview={
        <div
          className={
            showMeasures
              ? 'flex w-full flex-col gap-[var(--spacing-xl)] md:flex-row md:items-start'
              : `flex min-h-40 items-center justify-center ${DEMO_FRAME} mx-auto`
          }
        >
          <div className={showMeasures ? 'min-w-0 flex-1' : 'w-full'}>
            {showMeasures ? (
              <p className="mb-[var(--spacing-sm)] font-sans text-xs text-muted-foreground">
                Live
              </p>
            ) : null}
            <div ref={subjectRef}>{demo}</div>
          </div>
          {showMeasures ? (
            <div className="min-w-0 flex-1 overflow-x-auto">
              <p className="mb-[var(--spacing-sm)] font-sans text-xs text-muted-foreground">
                Measured — live getComputedStyle / getBoundingClientRect
              </p>
              <MeasurementOverlay enabled targets={CHAPTER_NAV_MEASURES}>
                {demo}
              </MeasurementOverlay>
            </div>
          ) : null}
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Appearance"
            value={appearance}
            onChange={(value) => setAppearance(value as Appearance)}
            options={[
              { value: 'empty', label: 'Empty' },
              { value: 'filled', label: 'Filled' },
            ]}
            fullWidth
          />
          <InlineSegmentedControl
            label="Show measurements"
            value={showMeasures ? 'on' : 'off'}
            onChange={(value) => setShowMeasures(value === 'on')}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            fullWidth
          />
        </div>
      }
    />
  );
}

function OverviewPage() {
  const subjectRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div className="absolute top-[length:var(--spacing-6xl)] end-[length:var(--spacing-6xl)] z-20">
        <TokenSpecSheet
          title="Chapter Nav Button"
          subjectRef={subjectRef}
          rootSelector="[data-slot=chapter-nav]"
          targets={CHAPTER_NAV_SPEC}
        />
      </div>
      <PrimitivePage
        title="Chapter Nav Button"
        description="Manuscript location chrome: muted book title over an Input Group (Quiet Mini, Prepend Ch. N:) for inline rename. The Fade chevron opens a stubbed Chapter Menu. Figma Chapter nav button, first variant (16038:15485)."
        playground={<ChapterNavPlayground subjectRef={subjectRef} />}
        variants={
          <div className="flex flex-wrap gap-[var(--spacing-md)]">
            <PrimitiveGalleryItem label="Empty">
              <EmptyExample />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Filled">
              <FilledExample />
            </PrimitiveGalleryItem>
          </div>
        }
        usageGuidance={
          <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
            <li>
              Use for manuscript location chrome only. The chapter line is an
              Input Group with prepend — click the name to rename inline. The
              field hugs the placeholder / value; the chevron sits after the
              text and moves as the name grows.
            </li>
            <li>
              The Fade chevron (and book title / shell padding) opens Chapter
              Menu. That panel is stubbed; do not put rename there.
            </li>
            <li>
              Empty vs Filled is placeholder vs named value, not a rest fill.
              Clearing the name and blurring restores the{' '}
              <code>Untitled</code> placeholder. Hover and open fill the outer{' '}
              <code>--rounded-lg</code> shape.
            </li>
          </ul>
        }
        accessibility={
          <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
            <li>
              Two controls: chapter-name field (
              <code>aria-label=&quot;Chapter name&quot;</code>) and Icon Button
              trigger (<code>aria-label=&quot;Open chapter menu&quot;</code>).
            </li>
            <li>
              Overview playground has a story-only <code>Show measurements</code>{' '}
              toggle (spacing / size) and a <code>View spec</code> sheet
              (color, type, radius, shadow, hover). Both read live from the
              DOM — they are not part of the component.
            </li>
          </ul>
        }
      />
    </div>
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <OverviewPage />,
};

export const Empty: Story = {
  render: () => <EmptyExample />,
};

export const Filled: Story = {
  render: () => <FilledExample />,
};
