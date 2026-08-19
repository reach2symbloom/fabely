/**
 * Library Cover — Figma set 16463:702. Overview via PrimitivePage.
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

import { LibraryCover } from './LibraryCover';

const meta = {
  title: 'Design System/Features/Library/Library Cover',
  component: LibraryCover,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof LibraryCover>;

export default meta;
type Story = StoryObj<typeof meta>;

const FIGMA_SET_URL =
  'https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16463-702';

const SAMPLE_COVER = new URL('./assets/sample-cover.jpg', import.meta.url).href;

/**
 * Library page canvas (`16428:12468`) — `--background` in `.dark` is
 * `--tw-raw-neutral-900` / `#27272A`, so the dark cover shadow reads.
 */
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
        'dark flex items-center justify-center bg-[color:var(--background)] p-[length:var(--spacing-2xl)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

function FigmaVariantExample({
  hasArt,
  forceHover,
}: {
  hasArt: boolean;
  forceHover: boolean;
}) {
  return (
    <LibraryCanvas>
      <LibraryCover
        src={hasArt ? SAMPLE_COVER : undefined}
        alt={hasArt ? 'The Lumithra Prophecy' : undefined}
        forceHover={forceHover}
      />
    </LibraryCanvas>
  );
}

function CoverPlayground() {
  const [hasArt, setHasArt] = useState(false);
  const [forceHover, setForceHover] = useState(false);
  const [src, setSrc] = useState<string | undefined>(undefined);

  const resolvedSrc = hasArt ? (src ?? SAMPLE_COVER) : undefined;

  return (
    <PlaygroundPanel
      previewAlign="stretch"
      preview={
        <div className="-m-8 flex justify-center dark bg-[color:var(--tw-raw-black)] p-8">
          <LibraryCover
            src={resolvedSrc}
            alt="The Lumithra Prophecy"
            forceHover={forceHover}
            onImageSelect={(file) => setSrc(URL.createObjectURL(file))}
          />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Art"
            value={hasArt ? 'on' : 'off'}
            onChange={(value) => setHasArt(value === 'on')}
            options={[
              { value: 'off', label: 'Empty' },
              { value: 'on', label: 'Uploaded' },
            ]}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Hover"
            value={forceHover ? 'on' : 'off'}
            onChange={(value) => setForceHover(value === 'on')}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
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
      title="Library Cover"
      description={
        <>
          Hero-scale manuscript cover — empty-state "Untitled" placeholder
          with a click/drag-to-upload card, or the uploaded cover art with an
          edit-on-hover scrim. Figma{' '}
          <a href={FIGMA_SET_URL} target="_blank" rel="noreferrer">
            Cover
          </a>{' '}
          set (<code>16463:702</code>) — Art × Hover.
        </>
      }
      playground={<CoverPlayground />}
      variants={
        <div className="flex flex-col gap-[length:var(--spacing-2xl)]">
          {(['off', 'on'] as const).map((art) => (
            <div
              key={art}
              className="flex flex-col gap-[length:var(--spacing-md)]"
            >
              <h3 className="font-sans text-sm font-medium text-foreground">
                {art === 'off' ? 'Empty' : 'Uploaded'}
              </h3>
              <div className="flex flex-col gap-[length:var(--spacing-lg)]">
                <PrimitiveGalleryItem label="Rest">
                  <FigmaVariantExample hasArt={art === 'on'} forceHover={false} />
                </PrimitiveGalleryItem>
                <PrimitiveGalleryItem label="Hover">
                  <FigmaVariantExample hasArt={art === 'on'} forceHover />
                </PrimitiveGalleryItem>
              </div>
            </div>
          ))}
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>src</code> drives the Art axis directly — omit it for the
            empty "Untitled" placeholder, pass it once cover art exists. No
            separate boolean prop.
          </li>
          <li>
            Empty state: hover the card for cover chrome; hover/click{' '}
            <strong>Upload cover art</strong> independently. The rest of the
            card still accepts a click or a dropped file. Uploaded state: the
            whole card is the hit target. Hover also runs Library List Item's
            pointer-follow glow. Wire the result via{' '}
            <code>onImageSelect</code>.
          </li>
          <li>
            Use <code>forceHover</code> in Storybook to lock the hover paint
            without a pointer.
          </li>
          <li>
            <code>title</code> / <code>tagline</code> / <code>authorLabel</code>{' '}
            override the empty-state copy; <code>uploadLabel</code> /{' '}
            <code>editLabel</code> / <code>dragLabel</code> override the
            button and hover-scrim copy.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Empty state: the named control is the <code>Upload cover art</code>{' '}
            <code>&lt;button&gt;</code> (visible label). Uploaded state: the
            named control is a nested <code>IconButton</code>{' '}
            <code>glow</code> whose <code>aria-label</code> is the edit
            label plus title.
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

export const EmptyRest: Story = {
  name: 'Empty / Rest',
  render: () => <FigmaVariantExample hasArt={false} forceHover={false} />,
};

export const EmptyHover: Story = {
  name: 'Empty / Hover',
  render: () => <FigmaVariantExample hasArt={false} forceHover />,
};

export const UploadedRest: Story = {
  name: 'Uploaded / Rest',
  render: () => <FigmaVariantExample hasArt forceHover={false} />,
};

export const UploadedHover: Story = {
  name: 'Uploaded / Hover',
  render: () => <FigmaVariantExample hasArt forceHover />,
};
