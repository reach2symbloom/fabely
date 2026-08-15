import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import {
  CommentCard,
  type CommentCardScene,
} from './CommentCard';

const meta = {
  title: 'Design System/Features/Comments/Comment Card',
  component: CommentCard,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof CommentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

function CommentCardPlayground() {
  const [scene, setScene] = useState<CommentCardScene>('new-comment');

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-72 w-full items-center justify-center pe-16">
          <CommentCard scene={scene} collaborationEnabled={scene === 'reply' || scene === 'replying' || scene === 'replied'} />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Scene"
            value={scene}
            onChange={(value) => setScene(value as CommentCardScene)}
            options={[
              { value: 'new-comment', label: 'New comment' },
              { value: 'existing', label: 'Existing' },
              { value: 'edit-existing', label: 'Edit existing' },
              { value: 'reply', label: 'Reply' },
              { value: 'replying', label: 'Replying' },
              { value: 'replied', label: 'Replied' },
            ]}
            fullWidth
            className="col-span-4"
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
      title="Comment Card"
      description="Contextual writing comments, replies, and their document anchor."
      playground={<CommentCardPlayground />}
      variants={
        <div className="grid gap-8 pe-12 lg:grid-cols-2">
          <PrimitiveGalleryItem label="New comment">
            <CommentCard scene="new-comment" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Existing">
            <CommentCard scene="existing" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Existing · hover">
            <CommentCard scene="existing" forceHover />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Edit existing">
            <CommentCard scene="edit-existing" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Reply">
            <CommentCard scene="reply" collaborationEnabled />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Replying">
            <CommentCard scene="replying" collaborationEnabled />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Replied">
            <CommentCard scene="replied" collaborationEnabled />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Existing hover is native interaction, not a separate backend state.</li>
          <li>The anchor is a visual relationship marker, not an interactive control.</li>
          <li>Promote the anchor to a standalone component only if another feature needs it independently.</li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>The visual anchor is hidden from assistive technology.</li>
          <li>Composer actions use native buttons and support Command/Ctrl + Enter and Escape.</li>
          <li>The textarea exposes its character count as polite live text.</li>
        </ul>
      }
    />
  ),
};

export const NewComment: Story = { args: { scene: 'new-comment' } };
export const Existing: Story = { args: { scene: 'existing' } };
export const ExistingHover: Story = { args: { scene: 'existing', forceHover: true } };
export const EditExisting: Story = { args: { scene: 'edit-existing' } };
export const Reply: Story = { args: { scene: 'reply', collaborationEnabled: true } };
export const Replying: Story = { args: { scene: 'replying', collaborationEnabled: true } };
export const Replied: Story = { args: { scene: 'replied', collaborationEnabled: true } };
