import type { Meta, StoryObj } from '@storybook/react-vite';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Shadows/Semantic',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div>
      <PendingNotice>
        <strong>Placeholder — no tokens implemented yet.</strong> Semantic shadow tokens will
        represent component intent rather than visual primitives (e.g. a dialog's elevation, a
        popover's surface) — the reusable meanings components actually consume, rather than
        components referencing foundation shadow tokens directly.
        <br />
        <br />
        Semantic shadow tokens will compose the existing foundation shadow tokens (geometry and
        polarity — size, blur, color; see <em>Foundations / Shadows</em>) into those reusable,
        named meanings. No semantic shadow tokens exist yet — this page exists only to establish
        the documentation architecture so the Storybook navigation mirrors the filesystem
        architecture (<code>src/foundations/shadows/raw/</code>,{' '}
        <code>src/foundations/shadows/semantic/</code>).
      </PendingNotice>

      <SectionHeading>Planned semantic tokens (not yet implemented)</SectionHeading>
      <PendingNotice>
        Examples of future semantic shadow tokens include <code>dialog.shadow.surface</code>,{' '}
        <code>popover.shadow.surface</code>, <code>dropdown.shadow.surface</code>,{' '}
        <code>tooltip.shadow.surface</code>, and <code>menu.shadow.surface</code>.
      </PendingNotice>
    </div>
  ),
};
