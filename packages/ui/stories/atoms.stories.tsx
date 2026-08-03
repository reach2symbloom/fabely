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
        <strong>Placeholder — no components implemented yet.</strong> Atoms are the smallest UI
        building blocks we design ourselves — compositions built on Foundations and, when useful,
        Primitives. Vendor-derived wrappers live under{' '}
        <code>Design System → Primitives</code>, not here. This page exists only to establish the
        Storybook navigation category; it will be replaced by real component stories, not appended
        to.
      </PendingNotice>

      <SectionHeading>Where Atoms fit</SectionHeading>
      <PendingNotice>
        Per <code>docs/DESIGN.md</code>: Foundations → Primitives → Atoms → Molecules → Organisms →
        Templates. Atoms consume semantic tokens from <em>Foundations</em> wherever a stable
        semantic role already exists, and foundation tokens directly during exploration. A
        component may start as a Primitive and later be composed into an Atom once we design a
        Fabely composition around it.
      </PendingNotice>
    </div>
  ),
};
