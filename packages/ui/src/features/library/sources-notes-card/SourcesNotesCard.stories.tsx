/**
 * Sources & Notes Card — Figma set 16456:17608. Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import { SourcesNotesCard, type SourcesNotesCardConnection } from './SourcesNotesCard';

const meta = {
  title: 'Design System/Features/Library/Sources & Notes Card',
  component: SourcesNotesCard,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SourcesNotesCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const FIGMA_SET_URL =
  'https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16456-17608';

const SAMPLE_CONNECTIONS: SourcesNotesCardConnection[] = [
  { brand: 'google-drive' },
  { brand: 'openai' },
];

function LibraryCanvas({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'dark w-[665px] bg-[color:var(--tw-raw-black)] p-[length:var(--spacing-md)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

function FigmaVariantExample({ linked }: { linked: boolean }) {
  return (
    <LibraryCanvas>
      <SourcesNotesCard connections={linked ? SAMPLE_CONNECTIONS : []} />
    </LibraryCanvas>
  );
}

type PreviewWidth = 'wide' | 'narrow';

const PREVIEW_WIDTH: Record<PreviewWidth, string> = {
  wide: '665px',
  narrow: '360px',
};

function CardPlayground() {
  const [linked, setLinked] = useState(true);
  const [showManuscriptButton, setShowManuscriptButton] = useState(true);
  const [width, setWidth] = useState<PreviewWidth>('wide');

  return (
    <PlaygroundPanel
      previewAlign="stretch"
      preview={
        <div className="-m-8 dark bg-[color:var(--tw-raw-black)] p-8">
          <div
            className="mx-auto py-[length:var(--spacing-md)] transition-[width] duration-[var(--duration-fast)]"
            style={{ width: PREVIEW_WIDTH[width] }}
          >
            <SourcesNotesCard
              connections={linked ? SAMPLE_CONNECTIONS : []}
              showManuscriptButton={showManuscriptButton}
            />
          </div>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Linked"
            value={linked ? 'true' : 'false'}
            onChange={(value) => setLinked(value === 'true')}
            options={[
              { value: 'false', label: 'False' },
              { value: 'true', label: 'True' },
            ]}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Manuscript button"
            value={showManuscriptButton ? 'true' : 'false'}
            onChange={(value) => setShowManuscriptButton(value === 'true')}
            options={[
              { value: 'true', label: 'Shown' },
              { value: 'false', label: 'Suppressed' },
            ]}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Container width"
            value={width}
            onChange={(value) => setWidth(value as PreviewWidth)}
            options={[
              { value: 'wide', label: 'Wide (row)' },
              { value: 'narrow', label: 'Narrow (stacked)' },
            ]}
            fullWidth
            className="col-span-2"
          />
        </div>
      }
    />
  );
}

function OverviewPage() {
  return (
    <PrimitivePage
      title="Sources & Notes Card"
      description={
        <>
          Library entry point for bringing in notes, an existing draft,
          or files from a linked integration. Figma{' '}
          <a href={FIGMA_SET_URL} target="_blank" rel="noreferrer">
            Sources &amp; notes card
          </a>{' '}
          set (<code>16456:17608</code>) — Linked axis mapped to whether
          <code> connections</code> is non-empty.
        </>
      }
      playground={<CardPlayground />}
      variants={
        <div className="flex flex-col gap-[length:var(--spacing-lg)]">
          <PrimitiveGalleryItem label="Linked=False">
            <FigmaVariantExample linked={false} />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Linked=True">
            <FigmaVariantExample linked />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Narrow container (stacked)">
            <div
              className="dark bg-[color:var(--tw-raw-black)] p-[length:var(--spacing-md)]"
              style={{ width: PREVIEW_WIDTH.narrow }}
            >
              <SourcesNotesCard connections={SAMPLE_CONNECTIONS} />
            </div>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Manuscript button suppressed">
            <LibraryCanvas>
              <SourcesNotesCard showManuscriptButton={false} />
            </LibraryCanvas>
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Nests two <code>ImageButton</code> (<code>import-notes</code> /{' '}
            <code>import-manuscript</code>) — override via{' '}
            <code>notesButtonProps</code> / <code>manuscriptButtonProps</code>.
          </li>
          <li>
            Pass <code>connections</code> (an{' '}
            <code>ApiConnectionProps[]</code>) to render the Connections
            section — one nested <code>ApiConnection</code> per entry.
            Omit or pass an empty array for Figma&apos;s Linked=False.
          </li>
          <li>
            The button row is a named <code>@container</code> query, not
            a viewport breakpoint — it stacks Import manuscript below
            Bring in your notes once the <em>card itself</em> narrows
            past <code>@lg</code> (512px), regardless of viewport width.
          </li>
          <li>
            <code>showManuscriptButton={'{false}'}</code> hides Import
            manuscript entirely — Bring in your notes then fills the row
            alone.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            The eyebrow cloud-upload glyph is decorative; the header
            label carries the meaning.
          </li>
          <li>
            Every interactive control (Image Buttons, each API
            Connection&apos;s unlink / select files) is its own real
            control — the card itself is not a hit target.
          </li>
        </ul>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <OverviewPage />,
};

export const LinkedFalse: Story = {
  name: 'Linked=False',
  render: () => <FigmaVariantExample linked={false} />,
};

export const LinkedTrue: Story = {
  name: 'Linked=True',
  render: () => <FigmaVariantExample linked />,
};
