/**
 * Chapter Nav Button — manuscript location trigger. Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

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

const DEMO_FRAME = 'w-[length:var(--tw-raw-spacing-80)]';

const CHAPTER_NAV_MEASURES: MeasurementTarget[] = [
  {
    name: 'shell',
    measure: ['padding', 'gap', 'width', 'height'],
  },
  {
    name: 'stack',
    selector: ':scope > div',
    measure: ['gap'],
  },
];

function EmptyExample() {
  return (
    <div className={DEMO_FRAME}>
      <ChapterNavButton />
    </div>
  );
}

function FilledExample() {
  return (
    <div className={DEMO_FRAME}>
      <ChapterNavButton
        bookTitle="The Long Way Home"
        chapterNumber={3}
        chapterName="River Crossing"
      />
    </div>
  );
}

function ChapterNavPlayground() {
  const [appearance, setAppearance] = useState<Appearance>('empty');
  const [showMeasures, setShowMeasures] = useState(false);
  const isEmpty = appearance === 'empty';

  const demo = (
    <ChapterNavButton
      bookTitle={isEmpty ? 'Untitled book' : 'The Long Way Home'}
      chapterNumber={isEmpty ? 1 : 3}
      chapterName={isEmpty ? '' : 'River Crossing'}
    />
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
          <div className={showMeasures ? `min-w-0 flex-1 ${DEMO_FRAME}` : 'w-full'}>
            {showMeasures ? (
              <p className="mb-[var(--spacing-sm)] font-sans text-xs text-muted-foreground">
                Live
              </p>
            ) : null}
            {demo}
          </div>
          {showMeasures ? (
            <div className={`min-w-0 flex-1 ${DEMO_FRAME}`}>
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

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Chapter Nav Button"
      description="Manuscript location chrome: muted book title over an Input Group (Ghost Mini, Prepend Ch. N:) for inline rename. The Fade chevron opens a stubbed Chapter Menu. Figma Chapter nav button, first variant (16038:15485)."
      playground={<ChapterNavPlayground />}
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
            Input Group with prepend — click the name to rename inline.
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
            toggle. The overlay reads live layout from the DOM — it is not part
            of the component.
          </li>
        </ul>
      }
    />
  ),
};

export const Empty: Story = {
  render: () => <EmptyExample />,
};

export const Filled: Story = {
  render: () => <FilledExample />,
};
