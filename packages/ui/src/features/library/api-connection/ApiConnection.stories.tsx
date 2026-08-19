/**
 * API Connection — Figma set 16456:17880 / 16456:17949. Overview via PrimitivePage.
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
  'https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16456-17880';

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
        'dark w-[401px] bg-[color:var(--tw-raw-black)] p-[length:var(--spacing-md)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

function FigmaVariantExample({ brand }: { brand: ApiConnectionBrand }) {
  return (
    <LibraryCanvas>
      <ApiConnection brand={brand} />
    </LibraryCanvas>
  );
}

function ConnectionPlayground() {
  const [brand, setBrand] = useState<ApiConnectionBrand>('google-drive');
  const [connected, setConnected] = useState(true);
  const [forceHover, setForceHover] = useState(false);

  return (
    <PlaygroundPanel
      previewAlign="stretch"
      preview={
        <div className="-m-8 dark bg-[color:var(--tw-raw-black)] p-8">
          <div className="mx-auto w-[401px] py-[length:var(--spacing-md)]">
            <ApiConnection brand={brand} connected={connected} forceHover={forceHover} />
          </div>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Brand"
            value={brand}
            onChange={(value) => setBrand(value as ApiConnectionBrand)}
            options={[
              { value: 'google-drive', label: 'Google Drive' },
              { value: 'openai', label: 'OpenAI' },
            ]}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Connected"
            value={connected ? 'true' : 'false'}
            onChange={(value) => setConnected(value === 'true')}
            options={[
              { value: 'true', label: 'True' },
              { value: 'false', label: 'False' },
            ]}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Force hover"
            value={forceHover ? 'true' : 'false'}
            onChange={(value) => setForceHover(value === 'true')}
            options={[
              { value: 'false', label: 'False' },
              { value: 'true', label: 'True' },
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
          Third-party integration row — brand mark, name, connection
          status, an unlink control, and a &quot;Select files&quot;
          action. Figma{' '}
          <a href={FIGMA_SET_URL} target="_blank" rel="noreferrer">
            API Connections
          </a>{' '}
          (<code>16456:17880</code> Google Drive, <code>16456:17949</code>{' '}
          OpenAI) — nested inside Sources &amp; notes card&apos;s Linked
          state.
        </>
      }
      playground={<ConnectionPlayground />}
      variants={
        <div className="flex flex-col gap-[length:var(--spacing-lg)]">
          <PrimitiveGalleryItem label="Google Drive">
            <FigmaVariantExample brand="google-drive" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="OpenAI">
            <FigmaVariantExample brand="openai" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Hover=True">
            <LibraryCanvas>
              <ApiConnection brand="google-drive" forceHover />
            </LibraryCanvas>
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>brand</code> swaps the mark and the default{' '}
            <code>name</code> — Google Drive raster or an inline
            <code> currentColor</code> OpenAI mark.
          </li>
          <li>
            <code>connected</code> (default <code>true</code>, Figma&apos;s
            only published state) swaps the status dot color and default
            status copy.
          </li>
          <li>
            Set <code>selectFilesHref</code> to render &quot;Select
            files&quot; as a real link instead of a button.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Unlink is a real Icon Button with <code>aria-label</code>{' '}
            (defaults to &quot;Disconnect {'{name}'}&quot;); the brand
            mark is decorative.
          </li>
          <li>
            Status dot is <code>aria-hidden</code> — the status text
            carries the meaning.
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

export const GoogleDrive: Story = {
  name: 'Google Drive',
  render: () => <FigmaVariantExample brand="google-drive" />,
};

export const OpenAI: Story = {
  name: 'OpenAI',
  render: () => <FigmaVariantExample brand="openai" />,
};
