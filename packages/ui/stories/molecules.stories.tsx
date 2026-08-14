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
      <SectionHeading>Molecules</SectionHeading>
      <PendingNotice>
        Simple groups of atoms/primitives as a unit. Per{' '}
        <code>docs/DESIGN.md</code>: Foundations → Primitives → Atoms → Molecules
        → Organisms → Templates.
      </PendingNotice>

      <SectionHeading>Components</SectionHeading>
      <PendingNotice>
        <ul className="list-disc space-y-1 ps-5">
          <li>
            <strong>Avatar with Label</strong> —{' '}
            <code>src/molecules/avatar-with-label/</code>. Story:{' '}
            <code>Design System/Molecules/Avatar with Label</code>.
          </li>
        </ul>
      </PendingNotice>
    </div>
  ),
};
