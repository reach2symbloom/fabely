import type { Meta, StoryObj } from '@storybook/react-vite';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Organisms',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div>
      <PendingNotice>
        <strong>Placeholder — no components implemented yet.</strong> Organisms are more complex,
        distinct sections of an interface composed of molecules and/or atoms — a toolbar, a sidebar
        panel, a manuscript editor&apos;s chrome. This page exists only to establish the Storybook
        navigation category; it will be replaced by real component stories, not appended to.
      </PendingNotice>

      <SectionHeading>Where Organisms fit</SectionHeading>
      <PendingNotice>
        Per <code>docs/DESIGN.md</code>: Foundations → Primitives → Atoms → Molecules → Organisms →
        Templates. Organisms should be built by composition, not by copy-pasting variants, and
        should promote recurring patterns into semantic component tokens as they emerge.
      </PendingNotice>
    </div>
  ),
};
