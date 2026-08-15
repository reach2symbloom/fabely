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
  type CommentAnchorState,
  type CommentCardMode,
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
  const [mode, setMode] = useState<CommentCardMode>('compose');
  const [anchor, setAnchor] = useState<CommentAnchorState>('active');

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-72 w-full items-center justify-center pe-16">
          <CommentCard mode={mode} anchor={anchor} />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Mode"
            value={mode}
            onChange={(value) => setMode(value as CommentCardMode)}
            options={[
              { value: 'compose', label: 'Compose' },
              { value: 'existing', label: 'Existing' },
              { value: 'edit', label: 'Edit' },
              { value: 'reply', label: 'Reply' },
            ]}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Anchor"
            value={anchor}
            onChange={(value) => setAnchor(value as CommentAnchorState)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'quiet', label: 'Quiet' },
              { value: 'active', label: 'Active' },
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
      title="Comment Card"
      description="Contextual writing comments, replies, and their document anchor."
      playground={<CommentCardPlayground />}
      variants={
        <div className="grid gap-8 pe-12 lg:grid-cols-2">
          <PrimitiveGalleryItem label="New comment · active anchor">
            <CommentCard mode="compose" anchor="active" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Existing · quiet anchor">
            <CommentCard mode="existing" anchor="quiet" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Edit existing">
            <CommentCard mode="edit" anchor="active" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Replying">
            <CommentCard mode="reply" anchor="active" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Without anchor">
            <CommentCard mode="existing" anchor="none" />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Use the anchor variant only when the card is attached to document content.</li>
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

export const NewComment: Story = { args: { mode: 'compose', anchor: 'active' } };
export const Existing: Story = { args: { mode: 'existing', anchor: 'quiet' } };
export const EditExisting: Story = { args: { mode: 'edit', anchor: 'active' } };
export const Replying: Story = { args: { mode: 'reply', anchor: 'active' } };
export const WithoutAnchor: Story = { args: { mode: 'existing', anchor: 'none' } };
