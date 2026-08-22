/**
 * Book Cover — sizes + editable hover. Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import { BookCover, type BookCoverSize } from './book-cover';

const COVER_DEMO = '/cover-demo.png';

const meta = {
  title: 'Design System/Atoms/Book Cover',
  component: BookCover,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: {
    src: COVER_DEMO,
    alt: 'The Lumithra Prophecy cover',
    size: 'md',
    editLabel: 'Change cover',
  },
} satisfies Meta<typeof BookCover>;

export default meta;
type Story = StoryObj<typeof meta>;

const SIZES: BookCoverSize[] = ['sm', 'md', 'lg'];

function useObjectUrl(file: File | null) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);

  return url;
}

function DemoExample() {
  const [file, setFile] = useState<File | null>(null);
  const preview = useObjectUrl(file);

  return (
    <BookCover
      src={preview ?? COVER_DEMO}
      alt="The Lumithra Prophecy cover"
      size="md"
      onImageSelect={setFile}
    />
  );
}

function SizesExample() {
  return (
    <div className="flex items-end gap-[var(--spacing-md)]">
      {SIZES.map((size) => (
        <BookCover
          key={size}
          src={COVER_DEMO}
          alt="The Lumithra Prophecy cover"
          size={size}
        />
      ))}
    </div>
  );
}

function StaticExample() {
  return (
    <BookCover
      src={COVER_DEMO}
      alt="The Lumithra Prophecy cover"
      size="md"
      editable={false}
    />
  );
}

function PlaceholderExample() {
  const [file, setFile] = useState<File | null>(null);
  const preview = useObjectUrl(file);

  return (
    <BookCover
      src={preview ?? undefined}
      size="md"
      editLabel="Add cover"
      onImageSelect={setFile}
    />
  );
}

function BookCoverPlayground() {
  const [size, setSize] = useState<BookCoverSize>('md');
  const [mode, setMode] = useState<'editable' | 'static'>('editable');
  const [file, setFile] = useState<File | null>(null);
  const preview = useObjectUrl(file);

  return (
    <PlaygroundPanel
      className="w-fit max-w-full"
      preview={
        <div className="flex min-h-40 flex-col items-center justify-center gap-[var(--spacing-sm)]">
          <BookCover
            src={preview ?? COVER_DEMO}
            alt="The Lumithra Prophecy cover"
            size={size}
            editable={mode === 'editable'}
            onImageSelect={mode === 'editable' ? setFile : undefined}
          />
          {mode === 'editable' && file ? (
            <p className="text-xs text-muted-foreground">{file.name}</p>
          ) : null}
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Size"
            value={size}
            onChange={(value) => setSize(value as BookCoverSize)}
            options={SIZES.map((value) => ({ value, label: value }))}
            fullWidth
          />
          <InlineSegmentedControl
            label="Mode"
            value={mode}
            onChange={(value) => setMode(value as 'editable' | 'static')}
            options={[
              { value: 'editable', label: 'Editable' },
              { value: 'static', label: 'Static' },
            ]}
            fullWidth
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
      title="Book Cover"
      description="Portrait cover art with a hover/focus edit scrim. Ghost Icon Button (no rest ring) opens the OS image picker by default (onImageSelect). Pass editHref to navigate instead. sm is 160px — one step under md (192), matching Chapter Menu Header."
      playground={<BookCoverPlayground />}
      variants={
        <div className="flex w-full flex-col gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Default (file picker)" fill>
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Sizes" fill>
            <SizesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Static" fill>
            <StaticExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Empty + upload" fill>
            <PlaceholderExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Default edit opens the system file picker. Handle the result with{' '}
            <code>onImageSelect</code>.
          </li>
          <li>
            Pass <code>editHref</code> to navigate instead of uploading.
          </li>
          <li>
            Use <code>editable=&#123;false&#125;</code> for display-only
            covers.
          </li>
          <li>
            <code>size=&quot;sm&quot;</code> is 160px (Chapter Menu Header);
            <code>md</code> is 192px; prefer <code>lg</code> in large
            library grids.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Editable covers put an <code>IconButton</code> on the scrim —
            focus-within reveals the overlay. The file input is visually
            hidden and activated by the button.
          </li>
          <li>
            Static covers expose the image <code>alt</code> only (no control).
          </li>
        </ul>
      }
    />
  ),
};

export const Sizes: Story = {
  render: () => <SizesExample />,
};

export const Static: Story = {
  render: () => <StaticExample />,
};
