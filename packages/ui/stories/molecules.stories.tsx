import type { Meta, StoryObj } from '@storybook/react-vite';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Molecules',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div>
      <PendingNotice>
        <strong>Placeholder — no components implemented yet.</strong> Molecules are simple groups
        of atoms functioning together as a single unit — a labeled input, a search field, a menu
        item with an icon and a label. This page exists only to establish the Storybook
        navigation category ahead of any molecule-level components; it will be replaced by real
        component stories, not appended to.
      </PendingNotice>

      <SectionHeading>Where Molecules fit</SectionHeading>
      <PendingNotice>
        Per <code>docs/DESIGN.md</code>: molecules compose atoms rather than duplicating their
        implementation, and should consume semantic tokens once a reusable role emerges rather
        than one being invented prematurely. Molecules are not scaffolded with any components yet
        — Atoms come first.
      </PendingNotice>
    </div>
  ),
};
