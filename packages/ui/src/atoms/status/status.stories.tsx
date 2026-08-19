/**
 * Status — Figma Status (16456:17778), part of API Connections (16456:17857).
 */

import type { Meta, StoryObj } from '@storybook/react-vite';

import { cn } from '@/lib/utils';
import { PrimitiveGalleryItem, PrimitivePage } from '../../../stories/PrimitivePage';

import { Status } from './status';

const meta = {
  title: 'Design System/Atoms/Status',
  component: Status,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: { label: 'Connected' },
} satisfies Meta<typeof Status>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Library canvas — Foundations tw-raw/black (#080B0C); dark so switch alphas resolve for Library. */
function LibraryCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn('dark bg-[color:var(--tw-raw-black)] p-[length:var(--spacing-md)]')}>
      {children}
    </div>
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Status"
      description="Colored dot + label, connection/state readout. Figma Status (16456:17778), part of the API Connections set. Only the 'Connected' (green) tone is published today."
      playground={
        <LibraryCanvas>
          <Status label="Connected" />
        </LibraryCanvas>
      }
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Connected">
            <LibraryCanvas>
              <Status label="Connected" />
            </LibraryCanvas>
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>tone</code> defaults to (and today only supports){' '}
            <code>&quot;success&quot;</code> — extend{' '}
            <code>TONE_DOT_CLASS</code> when a second state is designed.
          </li>
          <li>Purely presentational — no built-in polling or live state.</li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            The dot is <code>aria-hidden</code>; the label text alone
            carries the meaning.
          </li>
        </ul>
      }
    />
  ),
};

export const Connected: Story = {
  render: () => (
    <LibraryCanvas>
      <Status label="Connected" />
    </LibraryCanvas>
  ),
};
