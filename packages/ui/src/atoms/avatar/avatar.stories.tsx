import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';

const meta = {
  title: 'Design System/Atoms/Avatar',
  component: Avatar,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Canonical usage: Avatar always paired with a fallback so it renders
 * something even before an image is provided or if one is never set. A
 * bare `<Avatar />` with no children is a valid but degenerate primitive
 * state (nothing to display, so nothing renders) — not what consumers
 * should copy as the recommended pattern. */
export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

/** The common case: an image that loads successfully. */
export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

/** AvatarImage with a src that fails to load — Radix falls back to
 * AvatarFallback's children automatically. */
export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://broken-image-url.invalid/nope.png" alt="" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

/** Several fallback initials side by side, demonstrating the fallback
 * pattern isn't tied to any one set of initials. */
export const SeveralFallbackInitials: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Avatar>
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>XY</AvatarFallback>
      </Avatar>
    </div>
  ),
};
