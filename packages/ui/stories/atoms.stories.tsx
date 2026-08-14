import type { Meta, StoryObj } from '@storybook/react-vite';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Atoms',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div>
      <SectionHeading>Atoms</SectionHeading>
      <PendingNotice>
        Atoms are the smallest UI building blocks we design ourselves —
        compositions built on Foundations and, when useful, Primitives. Vendor
        wrappers live under <code>Design System → Primitives</code>.
      </PendingNotice>

      <SectionHeading>Components</SectionHeading>
      <PendingNotice>
        <ul className="list-disc space-y-1 ps-5">
          <li>
            <strong>Bookmark Button</strong> —{' '}
            <code>Design System/Atoms/Bookmark Button</code>. Icon toggle that
            fills the bookmark glyph when pressed (composes Toggle).
          </li>
          <li>
            <strong>Add Section Button</strong> —{' '}
            <code>Design System/Atoms/Add Section Button</code>. Icon + label
            pill from Figma Default; product always composes it with dividers
            via Features / Add Section Inline Button.
          </li>
          <li>
            <strong>Cycle Switch</strong> —{' '}
            <code>Design System/Atoms/Cycle Switch</code>. Advances through
            options in one direction (Figma Cycle switch); not binary Switch.
          </li>
          <li>
            <strong>Book Cover</strong> —{' '}
            <code>Design System/Atoms/Book Cover</code>. Portrait cover art
            with an optional hover/focus edit scrim.
          </li>
        </ul>
      </PendingNotice>
    </div>
  ),
};
