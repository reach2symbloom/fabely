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

/** Bare Avatar with no image and no fallback content — the unstyled shape
 * shadcn/Radix render before either resolves. */
export const Default: Story = {
  render: () => <Avatar />,
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
