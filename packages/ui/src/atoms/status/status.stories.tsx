/**
 * Status — two variants folded into one atom:
 * - `'label'` (default): Figma Status (16456:17778), part of API Connections (16456:17857).
 * - `'glyph'`: Figma "Dot divider" glyph from Promptbar status badges
 *   (16199:2312), used on the Scene Desk / All Notes examples — the
 *   former standalone `StatusIndicator` atom, now `<Status variant="glyph" />`.
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
      description="Colored-dot status readout, in two variants: 'label' (dot + text, connection/state readout — Figma Status 16456:17778) and 'glyph' (bare pulsing dot inside a soft ghost halo, meant for another component's trailing slot — Figma Promptbar status badges 16199:2312). Only the 'Connected' (green) tone is published today."
      playground={
        <LibraryCanvas>
          <Status label="Connected" />
        </LibraryCanvas>
      }
      variants={
        <div className="flex flex-col gap-[var(--spacing-lg)]">
          <div>
            <p className="mb-2 text-sm font-medium">Label variant</p>
            <div className="flex flex-wrap gap-[var(--spacing-md)]">
              <PrimitiveGalleryItem label="Connected">
                <LibraryCanvas>
                  <Status label="Connected" />
                </LibraryCanvas>
              </PrimitiveGalleryItem>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Glyph variant</p>
            <div className="flex flex-wrap items-center gap-[var(--spacing-md)]">
              <PrimitiveGalleryItem label="Pulsing (default)">
                <Status variant="glyph" />
              </PrimitiveGalleryItem>
              <PrimitiveGalleryItem label="Static (pulse=false)">
                <Status variant="glyph" pulse={false} />
              </PrimitiveGalleryItem>
            </div>
          </div>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>tone</code> defaults to (and today only supports){' '}
            <code>&quot;success&quot;</code> — extend{' '}
            <code>TONE_DOT_CLASS</code> / <code>TONE_GLYPH_CLASSNAME</code>{' '}
            when a second state is designed.
          </li>
          <li>
            <code>variant=&quot;label&quot;</code> is for a standalone
            connection/state row with visible text.{' '}
            <code>variant=&quot;glyph&quot;</code> is a bare dot meant to sit
            inside another component&apos;s trailing slot (e.g.{' '}
            <code>StatusBadge</code>), not to stand alone with a label.
          </li>
          <li>
            <code>pulse</code> (glyph only) defaults to <code>true</code>;
            set <code>false</code> for a static reading (e.g. a snapshot in
            a list where motion would be distracting). Automatically
            respects <code>prefers-reduced-motion</code> regardless.
          </li>
          <li>Purely presentational — no built-in polling or live state.</li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            The dot is <code>aria-hidden</code> in both variants. For{' '}
            <code>&quot;label&quot;</code>, the label text alone carries the
            meaning. For <code>&quot;glyph&quot;</code>, the surrounding
            text (e.g. a <code>StatusBadge</code>&apos;s primary/secondary
            text) is what should carry the actual accessible meaning.
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

export const Pulsing: Story = {
  render: () => <Status variant="glyph" />,
};

export const Static: Story = {
  render: () => <Status variant="glyph" pulse={false} />,
};
