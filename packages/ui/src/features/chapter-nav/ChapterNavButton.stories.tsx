/**
 * Chapter Nav Button — manuscript location trigger. Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
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

function EmptyExample() {
  return <ChapterNavButton empty />;
}

function FilledExample() {
  return (
    <ChapterNavButton
      empty={false}
      bookTitle="The Long Way Home"
      chapterNumber={3}
      chapterName="River Crossing"
    />
  );
}

function ChapterNavPlayground() {
  const [appearance, setAppearance] = useState<Appearance>('empty');
  const isEmpty = appearance === 'empty';

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 items-center justify-center">
          <ChapterNavButton
            empty={isEmpty}
            bookTitle={isEmpty ? 'Untitled book' : 'The Long Way Home'}
            chapterNumber={isEmpty ? 1 : 3}
            chapterName={isEmpty ? 'Untitled' : 'River Crossing'}
          />
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
      title="Chapter Nav Button"
      description="Manuscript location trigger: muted book title over serif chapter line. The whole control is one trigger; the panel is stubbed with a ghost mini Input for rename. Figma Chapter nav button, first variant only (16038:15485)."
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
            Use for manuscript location chrome only. Clicking anywhere on the
            control opens the outline / book-admin panel (Chapter Menu later).
          </li>
          <li>
            Collapsed trigger is presentational text — not an Input. Rename
            lives inside the open panel via Input <code>ghost</code> /{' '}
            <code>mini</code>.
          </li>
          <li>
            Empty vs Filled is chapter-line contrast (placeholder vs named),
            not a rest fill. Hover and open fill the outer{' '}
            <code>--rounded-lg</code> shape.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Single button trigger. Accessible name is book title plus{' '}
            <code>Ch. N: Chapter Name</code>.
          </li>
          <li>
            Chevron is decorative (fade Icon Button chrome on a span) so the
            control is one button, not nested buttons.
          </li>
          <li>
            Panel Input exposes <code>aria-label=&quot;Chapter name&quot;</code>.
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
