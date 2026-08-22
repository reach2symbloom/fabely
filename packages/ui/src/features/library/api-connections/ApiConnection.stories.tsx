/**
 * API Connection — Figma set 16456:17857. Overview via PrimitivePage.
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

import { ApiConnection, type ApiConnectionBrand } from './ApiConnection';

const meta = {
  title: 'Design System/Features/Library/API Connection',
  component: ApiConnection,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ApiConnection>;

export default meta;
type Story = StoryObj<typeof meta>;

const FIGMA_SET_URL =
  'https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16456-17857';

const BRAND_LABEL: Record<ApiConnectionBrand, string> = {
  apple: 'Apple',
  claude: 'Claude',
  dropbox: 'Dropbox',
  evernote: 'Evernote',
  'google-drive': 'Google Drive',
  icloud: 'iCloud',
  keep: 'Keep',
  notion: 'Notion',
  obsidian: 'Obsidian',
  onedrive: 'OneDrive',
  openai: 'OpenAI',
  'play-store': 'Play Store',
};

const ALL_BRANDS = (Object.keys(BRAND_LABEL) as ApiConnectionBrand[]).sort((a, b) =>
  BRAND_LABEL[a].localeCompare(BRAND_LABEL[b]),
);

/** Library canvas — Foundations tw-raw/black (#080B0C); dark so switch alphas resolve for Library. */
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
        'dark bg-[color:var(--tw-raw-black)] p-[length:var(--spacing-md)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

function FigmaVariantExample({
  brand = 'google-drive',
  forceHover,
}: {
  brand?: ApiConnectionBrand;
  forceHover: boolean;
}) {
  return (
    <LibraryCanvas className="w-[513px]">
      <ApiConnection brand={brand} forceHover={forceHover} noteCount={3} />
    </LibraryCanvas>
  );
}

function ConnectionPlayground() {
  const [brand, setBrand] = useState<ApiConnectionBrand>('google-drive');
  const [forceHover, setForceHover] = useState(false);
  const [showNoteCount, setShowNoteCount] = useState(true);

  return (
    <PlaygroundPanel
      previewAlign="stretch"
      preview={
        <div className="-m-8 dark bg-[color:var(--tw-raw-black)] p-8">
          <div className="mx-auto w-[513px] py-[length:var(--spacing-md)]">
            <ApiConnection
              brand={brand}
              forceHover={forceHover}
              noteCount={showNoteCount ? 3 : undefined}
            />
          </div>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          {/* No `fullWidth` — that forces every chip to `flex-1 min-w-0`
              (equal-width, shrink to fit one row), which is right for a
              2-4 option toggle but wrong here: 12 brands would get
              squeezed illegibly narrow instead of wrapping onto more
              rows. Natural content width + flex-wrap lets it wrap. */}
          <InlineSegmentedControl
            label="Brand"
            value={brand}
            onChange={(value) => setBrand(value as ApiConnectionBrand)}
            options={ALL_BRANDS.map((value) => ({ value, label: BRAND_LABEL[value] }))}
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
          <InlineSegmentedControl
            label="Note count"
            value={showNoteCount ? 'on' : 'off'}
            onChange={(value) => setShowNoteCount(value === 'on')}
            options={[
              { value: 'off', label: 'Hidden' },
              { value: 'on', label: 'Shown' },
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
      title="API Connection"
      description={
        <>
          Connected-service row. Figma{' '}
          <a href={FIGMA_SET_URL} target="_blank" rel="noreferrer">
            API Connections
          </a>{' '}
          set (<code>16456:17857</code>) — Rest / Hover.
        </>
      }
      playground={<ConnectionPlayground />}
      variants={
        <div className="flex flex-col gap-[length:var(--spacing-2xl)]">
          <div className="flex flex-col gap-[length:var(--spacing-md)]">
            <h3 className="font-sans text-sm font-medium text-foreground">
              Rest / Hover
            </h3>
            <div className="flex flex-col gap-[length:var(--spacing-lg)]">
              <PrimitiveGalleryItem label="Rest">
                <FigmaVariantExample forceHover={false} />
              </PrimitiveGalleryItem>
              <PrimitiveGalleryItem label="Hover">
                <FigmaVariantExample forceHover />
              </PrimitiveGalleryItem>
            </div>
          </div>
          <div className="flex flex-col gap-[length:var(--spacing-md)]">
            <h3 className="font-sans text-sm font-medium text-foreground">
              All brands
            </h3>
            <LibraryCanvas className="flex w-[513px] flex-col gap-[length:var(--spacing-xs)]">
              {ALL_BRANDS.map((value) => (
                <ApiConnection key={value} brand={value} />
              ))}
            </LibraryCanvas>
          </div>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>brand</code> defaults to <code>&quot;google-drive&quot;</code>{' '}
            — every mark in Foundations' brand-logo catalog is a valid
            value except <code>&quot;openai-light&quot;</code>/
            <code>&quot;openai-dark&quot;</code>, which collapse to one{' '}
            <code>&quot;openai&quot;</code> option (always the white
            <code>openai-dark</code> mark — Library rows sit on a dark
            surface).
          </li>
          <li>
            Omit <code>noteCount</code> to hide the "N notes added" line
            entirely.
          </li>
          <li>
            The whole row is the select-files hit target — clicking
            anywhere fires <code>onSelectFiles</code>, and it shows{' '}
            <code>cursor-pointer</code>. Unlink is the opposite-intent
            action nested inside, so clicking it fires only{' '}
            <code>onUnlink</code>, never <code>onSelectFiles</code>.
          </li>
          <li>
            Both are plain callbacks — no confirmation dialog or file
            browser built in.
          </li>
          <li>
            Use <code>forceHover</code> in Storybook to lock the hover state
            without a pointer.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Two independently focusable controls live in the row: the
            unlink Icon Button (<code>aria-label</code> defaults to
            "Disconnect
            {'  '}
            {'{label}'}") and the Select files Button — keyboard users
            reach the row's primary action through the latter, same as a
            mouse click anywhere else on the row.
          </li>
          <li>The logo image is decorative (<code>alt=&quot;&quot;</code>).</li>
        </ul>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <OverviewPage />,
};

export const Rest: Story = {
  render: () => <FigmaVariantExample forceHover={false} />,
};

export const Hover: Story = {
  render: () => <FigmaVariantExample forceHover />,
};

export const AllBrands: Story = {
  name: 'All brands',
  render: () => (
    <LibraryCanvas className="flex w-[513px] flex-col gap-[length:var(--spacing-xs)]">
      {ALL_BRANDS.map((value) => (
        <ApiConnection key={value} brand={value} />
      ))}
    </LibraryCanvas>
  ),
};
