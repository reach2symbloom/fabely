import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BookOpenCheck,
  FileTextIcon,
  GitBranchIcon,
  RotateCcwIcon,
  SearchIcon,
} from 'lucide-react';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { Spinner } from '../spinner';

import { Marker, MarkerContent, MarkerIcon } from './marker';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages aligned with shadcn Marker docs.
 */

const meta = {
  title: 'Design System/Primitives/Marker',
  component: Marker,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type MarkerVariant = 'default' | 'border' | 'separator';

function MarkerPlayground() {
  const [variant, setVariant] = useState<MarkerVariant>('default');

  return (
    <PlaygroundPanel
      preview={
        <div className="w-full max-w-md">
          <Marker variant={variant}>
            {variant !== 'separator' ? (
              <MarkerIcon>
                <GitBranchIcon />
              </MarkerIcon>
            ) : null}
            <MarkerContent>
              {variant === 'separator'
                ? 'Today'
                : 'Switched to a new branch'}
            </MarkerContent>
          </Marker>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Variant"
            value={variant}
            onChange={(v) => setVariant(v as MarkerVariant)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'border', label: 'Border' },
              { value: 'separator', label: 'Separator' },
            ]}
          />
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Marker"
      description="Inline conversation markers — Foundations type from muted system notes; shadcn Marker API (default / border / separator)."
      playground={<MarkerPlayground />}
      variants={
        <div className="flex w-full max-w-lg flex-col gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Default">
            <Marker>
              <MarkerContent>A default marker for inline notes.</MarkerContent>
            </Marker>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Separator">
            <Marker variant="separator">
              <MarkerContent>A separator marker</MarkerContent>
            </Marker>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Border">
            <Marker variant="border">
              <MarkerContent>
                A border marker for row boundaries.
              </MarkerContent>
            </Marker>
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Use for system notes and labeled dividers in a conversation — not
            for message bubbles (see Bubble).
          </li>
          <li>
            <code>variant=&quot;separator&quot;</code> for dates / section
            breaks; do not put <code>role=&quot;separator&quot;</code> on
            labeled dividers.
          </li>
          <li>
            Pair streaming status with <code>role=&quot;status&quot;</code> and
            a Spinner in <code>MarkerIcon</code>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Presentational by default — set <code>role</code> (or{' '}
            <code>render</code> as <code>a</code> / <code>button</code>) from
            intent.
          </li>
          <li>
            <code>MarkerIcon</code> is <code>aria-hidden</code>; content (or{' '}
            <code>aria-label</code> for icon-only) carries the name.
          </li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-[var(--spacing-sm)]">
      <Marker>
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Switched to a new branch</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <SearchIcon />
        </MarkerIcon>
        <MarkerContent>Explored 4 files</MarkerContent>
      </Marker>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-[var(--spacing-md)]">
      <Marker>
        <MarkerContent>A default marker for inline notes.</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>A separator marker</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>A border marker for row boundaries.</MarkerContent>
      </Marker>
    </div>
  ),
};

export const Status: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-[var(--spacing-sm)]">
      <p className="text-[length:var(--text-paragraph-mini-regular-font-size)] text-[color:var(--muted-foreground)]">
        Spinner is still thin-pass — status layout only until Spinner is
        Foundations-matched.
      </p>
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent>Compacting conversation</MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent>Running tests</MarkerContent>
      </Marker>
    </div>
  ),
};

export const Separator: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-[var(--spacing-sm)]">
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker>
        <MarkerContent>Worked for 42s</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Conversation compacted</MarkerContent>
      </Marker>
    </div>
  ),
};

export const Border: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-[var(--spacing-sm)]">
      <Marker variant="border">
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Switched to release-candidate</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <SearchIcon />
        </MarkerIcon>
        <MarkerContent>Reviewed 8 related files</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <FileTextIcon />
        </MarkerIcon>
        <MarkerContent>Opened implementation notes</MarkerContent>
      </Marker>
    </div>
  ),
};

export const WithIcon: Story = {
  name: 'With Icon',
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-[var(--spacing-sm)]">
      <Marker>
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>Switched to a new branch</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <SearchIcon />
        </MarkerIcon>
        <MarkerContent>Explored 4 files</MarkerContent>
      </Marker>
      <Marker className="flex-col items-start">
        <MarkerIcon>
          <BookOpenCheck />
        </MarkerIcon>
        <MarkerContent>Syncing completed</MarkerContent>
      </Marker>
    </div>
  ),
};

export const LinksAndButtons: Story = {
  name: 'Links and Buttons',
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-[var(--spacing-sm)]">
      <Marker render={<a href="#pr" />}>
        <MarkerIcon>
          <GitBranchIcon />
        </MarkerIcon>
        <MarkerContent>View the pull request</MarkerContent>
      </Marker>
      <Marker render={<button type="button" />}>
        <MarkerIcon>
          <RotateCcwIcon />
        </MarkerIcon>
        <MarkerContent>Revert this change</MarkerContent>
      </Marker>
    </div>
  ),
};
