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
      <PendingNotice>
        <strong>Placeholder — no components implemented yet.</strong> Atoms are the smallest
        indivisible UI building blocks — Button, Input, Label, Badge, and similar shadcn
        primitives wrapped with Fabely's design layer on top. This page exists only to establish
        the Storybook navigation category ahead of the first component imports (see the{' '}
        <code>atoms-shadcn-import</code> branch); it will be replaced by real component stories,
        not appended to.
      </PendingNotice>

      <SectionHeading>Where Atoms fit</SectionHeading>
      <PendingNotice>
        Per <code>docs/DESIGN.md</code>'s Component Layer workflow: match Figma faithfully first,
        then identify recurring patterns before introducing semantic component tokens. Atoms
        should consume semantic tokens from <em>Foundations</em> wherever a stable semantic role
        already exists, and foundation tokens directly during exploration — semantic abstraction
        is expected to be an evolution of the system, not a prerequisite for building it.
      </PendingNotice>
    </div>
  ),
};
