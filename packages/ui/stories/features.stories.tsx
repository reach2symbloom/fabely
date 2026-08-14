import type { Meta, StoryObj } from '@storybook/react-vite';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Features',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div>
      <SectionHeading>Features</SectionHeading>
      <PendingNotice>
        Features are product-specific compositions assembled from primitives,
        atoms, molecules, and organisms. They are allowed to be single-purpose.
        Before building here, search those reusable tiers for overlap — see{' '}
        <code>.cursor/rules/overlap-check.mdc</code>. If a piece built here
        turns out to be reusable, promote it; do not duplicate it in a second
        feature folder.
      </PendingNotice>

      <SectionHeading>Components</SectionHeading>
      <PendingNotice>
        <ul className="list-disc space-y-1 ps-5">
          <li>
            <strong>Chapter Nav</strong> —{' '}
            <code>src/features/chapter-nav/</code>. Manuscript location chrome.{' '}
            <code>Design System/Features/Chapter Nav Button</code> and{' '}
            <code>Design System/Features/Chapter Menu List Item</code> are
            landed; header and menu shell are next.
          </li>
        </ul>
      </PendingNotice>
    </div>
  ),
};
