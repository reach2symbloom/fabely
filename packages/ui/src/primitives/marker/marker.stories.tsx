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
import type {
  MarkerIconSize,
  MarkerSize,
  MarkerTextStyle,
} from './marker';

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
  const [textStyle, setTextStyle] = useState<MarkerTextStyle>('paragraph');
  const [size, setSize] = useState<MarkerSize>('sm');
  const [showIcon, setShowIcon] = useState(true);
  const [iconSize, setIconSize] = useState<MarkerIconSize>('auto');
  const [shimmer, setShimmer] = useState(false);
  const [animatedIcon, setAnimatedIcon] = useState(false);

  const label = shimmer
    ? 'Thinking...'
    : variant === 'separator'
      ? 'Today'
      : 'Switched to a new branch';

  return (
    <PlaygroundPanel
      preview={
        <div className="w-full max-w-md">
          <Marker
            variant={variant}
            textStyle={textStyle}
            size={size}
            iconSize={iconSize}
            role={shimmer || animatedIcon ? 'status' : undefined}
          >
            {showIcon ? (
              <MarkerIcon>
                {animatedIcon ? (
                  <Spinner className="size-full" />
                ) : (
                  <GitBranchIcon />
                )}
              </MarkerIcon>
            ) : null}
            <MarkerContent className={shimmer ? 'shimmer' : undefined}>
              {label}
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
          <InlineSegmentedControl
            label="Text style"
            value={textStyle}
            onChange={(v) => setTextStyle(v as MarkerTextStyle)}
            options={[
              { value: 'paragraph', label: 'Paragraph' },
              { value: 'caption', label: 'Caption' },
              { value: 'heading', label: 'Heading' },
            ]}
          />
          <InlineSegmentedControl
            label="Size"
            value={size}
            onChange={(v) => setSize(v as MarkerSize)}
            options={[
              { value: 'mini', label: 'Mini' },
              { value: 'sm', label: 'Sm' },
            ]}
          />
          <InlineSegmentedControl
            label="Icon"
            value={showIcon ? 'on' : 'off'}
            onChange={(v) => setShowIcon(v === 'on')}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
          />
          <InlineSegmentedControl
            label="Icon size"
            value={iconSize}
            onChange={(v) => setIconSize(v as MarkerIconSize)}
            options={[
              { value: 'auto', label: 'Auto' },
              { value: 'xs', label: 'Xs' },
              { value: 'sm', label: 'Sm' },
              { value: 'md', label: 'Md' },
              { value: 'lg', label: 'Lg' },
            ]}
          />
          <InlineSegmentedControl
            label="Shimmer"
            value={shimmer ? 'on' : 'off'}
            onChange={(v) => setShimmer(v === 'on')}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
          />
          <InlineSegmentedControl
            label="Animated icon"
            value={animatedIcon ? 'on' : 'off'}
            onChange={(v) => {
              const on = v === 'on';
              setAnimatedIcon(on);
              if (on) setShowIcon(true);
            }}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
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
      description="Inline conversation markers — Paragraph / Caption / Heading × Mini / Sm; shadcn Marker API (default / border / separator)."
      playground={<MarkerPlayground />}
      variants={
        <div className="flex w-full max-w-lg flex-col gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Shimmer">
            <div className="flex w-full flex-col gap-[var(--spacing-sm)]">
              <Marker role="status">
                <MarkerIcon>
                  <Spinner className="size-full" />
                </MarkerIcon>
                <MarkerContent className="shimmer">Thinking...</MarkerContent>
              </Marker>
              <Marker role="status">
                <MarkerContent className="shimmer">Thinking...</MarkerContent>
              </Marker>
              <Marker variant="separator" role="status">
                <MarkerContent className="shimmer">
                  Reading 4 files
                </MarkerContent>
              </Marker>
            </div>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Paragraph Sm">
            <Marker textStyle="paragraph" size="sm">
              <MarkerIcon>
                <GitBranchIcon />
              </MarkerIcon>
              <MarkerContent>A default marker for inline notes.</MarkerContent>
            </Marker>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Paragraph Mini">
            <Marker textStyle="paragraph" size="mini">
              <MarkerIcon>
                <GitBranchIcon />
              </MarkerIcon>
              <MarkerContent>A mini marker for denser notes.</MarkerContent>
            </Marker>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Caption Sm">
            <Marker textStyle="caption" size="sm">
              <MarkerIcon>
                <GitBranchIcon />
              </MarkerIcon>
              <MarkerContent>Caption sm marker</MarkerContent>
            </Marker>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Caption Mini">
            <Marker textStyle="caption" size="mini">
              <MarkerIcon>
                <GitBranchIcon />
              </MarkerIcon>
              <MarkerContent>Caption mini marker</MarkerContent>
            </Marker>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Heading 4 (Mini)">
            <Marker textStyle="heading" size="mini">
              <MarkerIcon>
                <GitBranchIcon />
              </MarkerIcon>
              <MarkerContent>Heading marker</MarkerContent>
            </Marker>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Heading 3 (Sm)">
            <Marker textStyle="heading" size="sm">
              <MarkerIcon>
                <GitBranchIcon />
              </MarkerIcon>
              <MarkerContent>Heading marker</MarkerContent>
            </Marker>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Separator">
            <Marker variant="separator">
              <MarkerIcon>
                <GitBranchIcon />
              </MarkerIcon>
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
            <code>textStyle</code>: <code>paragraph</code>,{' '}
            <code>caption</code> (uppercase), or <code>heading</code>{' '}
            (Heading 4 at mini / Heading 3 at sm). <code>size</code>:{' '}
            <code>mini</code> / <code>sm</code>.
          </li>
          <li>
            Icon is optional — omit <code>MarkerIcon</code> for text-only.
            <code>iconSize</code>: <code>auto</code> (follows text recipe) or{' '}
            <code>xs</code> / <code>sm</code> / <code>md</code> /{' '}
            <code>lg</code>.
          </li>
          <li>
            Streaming status: <code>role=&quot;status&quot;</code> and{' '}
            <code>className=&quot;shimmer&quot;</code> on{' '}
            <code>MarkerContent</code>; optional animated{' '}
            <code>Spinner</code> in <code>MarkerIcon</code> (playground
            Shimmer + Animated icon).
          </li>
          <li>
            <code>variant=&quot;separator&quot;</code> for dates / section
            breaks; do not put <code>role=&quot;separator&quot;</code> on
            labeled dividers.
          </li>
          <li>
            Pair streaming status with a Spinner in <code>MarkerIcon</code>{' '}
            when needed.
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
          <Spinner className="size-full" />
        </MarkerIcon>
        <MarkerContent>Compacting conversation</MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerIcon>
          <Spinner className="size-full" />
        </MarkerIcon>
        <MarkerContent>Running tests</MarkerContent>
      </Marker>
    </div>
  ),
};

export const Shimmer: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-[var(--spacing-xl)] py-[var(--spacing-2xl)]">
      <Marker role="status">
        <MarkerIcon>
          <Spinner className="size-full" />
        </MarkerIcon>
        <MarkerContent className="shimmer">Thinking...</MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerContent className="shimmer">Thinking...</MarkerContent>
      </Marker>
      <Marker variant="separator" role="status">
        <MarkerContent className="shimmer">Reading 4 files</MarkerContent>
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
