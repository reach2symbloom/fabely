import type { Meta, StoryObj } from '@storybook/react-vite';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Templates',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div>
      <PendingNotice>
        <strong>Placeholder — no components implemented yet.</strong> Templates are page-level
        layout skeletons that arrange organisms, molecules, and atoms into a structure without
        final content. This page exists only to establish the Storybook navigation category; it
        will be replaced by real component stories, not appended to.
      </PendingNotice>

      <SectionHeading>Where Templates fit</SectionHeading>
      <PendingNotice>
        Per <code>docs/DESIGN.md</code>: Foundations → Primitives → Atoms → Molecules → Organisms →
        Templates. Templates sit above Organisms in the hierarchy and may remain empty until a
        recurring page-level layout pattern emerges.
      </PendingNotice>
    </div>
  ),
};
