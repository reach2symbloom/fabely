import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import { TopicMapCard } from './TopicMapCard';

const copy = {
  index: 1,
  title: 'Forest magic behaves like an ecosystem, not a spell system',
  description:
    'Magic moves through roots, weather, animals, and old paths rather than being cast as isolated actions.',
};

const meta = {
  title: 'Design System/Features/Topic Map Card',
  component: TopicMapCard,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: copy,
} satisfies Meta<typeof TopicMapCard>;

export default meta;
type Story = StoryObj<typeof meta>;

function TopicMapCardPlayground() {
  const [forceHover, setForceHover] = useState(false);

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-32 w-full items-center justify-center">
          <TopicMapCard {...copy} forceHover={forceHover} href="#forest-magic" />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Hover"
            value={forceHover ? 'true' : 'false'}
            onChange={(value) => setForceHover(value === 'true')}
            options={[
              { value: 'false', label: 'Off' },
              { value: 'true', label: 'On' },
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
      title="Topic Map Card"
      description="Compact chat/assistant row summarizing one topic-map item."
      playground={<TopicMapCardPlayground />}
      variants={
        <div className="flex flex-col gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Default">
            <TopicMapCard {...copy} href="#forest-magic" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Hover">
            <TopicMapCard {...copy} href="#forest-magic" forceHover />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Unnumbered">
            <TopicMapCard
              title="A topic without an index"
              description="Omitting index removes the numbered prefix."
            />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Pass <code>href</code> when the row navigates to a topic-map entry.</li>
          <li>Omit <code>index</code> for an unnumbered entry.</li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Linked cards use a native anchor and expose the secondary focus ring.</li>
          <li>The visible title and description form the link's accessible name.</li>
        </ul>
      }
    />
  ),
};

export const Default: Story = { args: { href: '#forest-magic' } };
export const Hover: Story = { args: { href: '#forest-magic', forceHover: true } };
