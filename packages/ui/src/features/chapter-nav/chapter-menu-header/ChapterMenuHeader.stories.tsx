/**
 * Chapter Menu Header — Main / Alt. Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import {
  ChapterMenuHeader,
  type ChapterMenuHeaderVariant,
} from './ChapterMenuHeader';

/** Fabely mark (§) — also at `assets/logo-mark.png`. */
const LOGO_MARK = '/logo-mark.png';
/** Main Figma wordmark. */
const LOGO_WORDMARK = '/logo-dark.png';
/** Demo cover — also at `assets/cover-demo.png`. */
const COVER_DEMO = '/cover-demo.png';

const meta = {
  title: 'Design System/Features/Chapter Menu Header',
  component: ChapterMenuHeader,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: {
    bookTitle: 'The Lumithra Prophecy and the Aurora Sorceress',
    authorName: 'Christian Davis',
    authorInitials: 'CD',
    logoSrc: LOGO_WORDMARK,
    coverSrc: COVER_DEMO,
    coverAlt: 'The Lumithra Prophecy cover',
    upgradeHref: '/pricing',
    homeHref: '/',
  },
} satisfies Meta<typeof ChapterMenuHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const DEMO_FRAME = 'w-[494px] max-w-full';

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

function MainExample() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState(
    'The Lumithra Prophecy and the Aurora Sorceress',
  );
  const preview = useObjectUrl(file);

  return (
    <div className={DEMO_FRAME}>
      <ChapterMenuHeader
        variant="main"
        bookTitle={title}
        onBookTitleChange={setTitle}
        authorName="Christian Davis"
        authorInitials="CD"
        logoSrc={LOGO_WORDMARK}
        coverSrc={preview ?? COVER_DEMO}
        coverAlt="The Lumithra Prophecy cover"
        onCoverImageSelect={setFile}
        defaultOutlineValue="full"
      />
    </div>
  );
}

function AltExample() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState(
    'The Lumithra Prophecy and the Aurora Sorceress',
  );
  const preview = useObjectUrl(file);

  return (
    <div className={DEMO_FRAME}>
      <ChapterMenuHeader
        variant="alt"
        bookTitle={title}
        onBookTitleChange={setTitle}
        authorName="Christian Davis"
        authorInitials="CD"
        logoSrc={LOGO_MARK}
        coverSrc={preview ?? COVER_DEMO}
        coverAlt="The Lumithra Prophecy cover"
        onCoverImageSelect={setFile}
        defaultOutlineValue="scenes"
      />
    </div>
  );
}

function HeaderPlayground() {
  const [variant, setVariant] = useState<ChapterMenuHeaderVariant>('main');
  const [outline, setOutline] = useState('full');
  const [title, setTitle] = useState(
    'The Lumithra Prophecy and the Aurora Sorceress',
  );
  const [file, setFile] = useState<File | null>(null);
  const preview = useObjectUrl(file);

  return (
    <PlaygroundPanel
      /* w-fit: panel must grow past 494 — preview has p-8, header min is 494. */
      className="w-fit max-w-full"
      previewAlign="stretch"
      preview={
        <div className={DEMO_FRAME}>
          <ChapterMenuHeader
            variant={variant}
            bookTitle={title}
            onBookTitleChange={setTitle}
            authorName="Christian Davis"
            authorInitials="CD"
            logoSrc={variant === 'alt' ? LOGO_MARK : LOGO_WORDMARK}
            coverSrc={preview ?? COVER_DEMO}
            coverAlt="The Lumithra Prophecy cover"
            onCoverImageSelect={setFile}
            outlineValue={outline}
            onOutlineValueChange={setOutline}
          />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Variant"
            value={variant}
            onChange={(value) => setVariant(value as ChapterMenuHeaderVariant)}
            options={[
              { value: 'main', label: 'Main' },
              { value: 'alt', label: 'Alt' },
            ]}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Outline"
            value={outline}
            onChange={setOutline}
            options={[
              { value: 'chapters', label: 'Chapters' },
              { value: 'scenes', label: 'Scenes' },
              { value: 'full', label: 'Full' },
            ]}
            fullWidth
            className="col-span-2"
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
      title="Chapter Menu Header"
      description="Book chrome for Chapter Menu — Main and Alt Figma explorations (16373:11236 / 16373:11235). Both kept for comparison until one is designated. Composes Avatar with Label, Cycle Switch, Separator, Book Cover (OS image picker on edit). Logo → `/` (home); Upgrade → `/pricing`."
      playground={<HeaderPlayground />}
      variants={
        <div className="flex w-full flex-col gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Main" fill>
            <MainExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Alt" fill>
            <AltExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Pass <code>variant=&quot;main&quot;</code> or{' '}
            <code>&quot;alt&quot;</code> — structural alternatives, not
            visual states. Designate the product winner before shipping one.
          </li>
          <li>
            Author row composes <code>AvatarWithLabel</code> static by
            default (no link / hover). Pass{' '}
            <code>authorHref=&quot;/author&quot;</code> for interactive.
            Logo → <code>homeHref=&quot;/&quot;</code>; Upgrade →{' '}
            <code>upgradeHref=&quot;/pricing&quot;</code>.
          </li>
          <li>
            Wire the book title with <code>bookTitle</code> /{' '}
            <code>onBookTitleChange</code> (quiet Heading Textarea — wraps,
            no resize grip). Outline filtering uses <code>outlineValue</code> /{' '}
            <code>onOutlineValueChange</code> (Cycle Switch). Cover composes{' '}
            <code>BookCover</code> — edit opens the OS image picker (
            <code>onCoverImageSelect</code>); pass <code>coverEditHref</code>{' '}
            to navigate instead, or <code>cover</code> to fully override.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Title is a quiet Heading <code>Textarea</code> (
            <code>onBookTitleChange</code>). Cover needs <code>coverAlt</code>{' '}
            when using <code>coverSrc</code>. Cycle Switch exposes its own{' '}
            <code>aria-label</code>.
          </li>
        </ul>
      }
    />
  ),
};

export const Main: Story = {
  render: () => <MainExample />,
};

export const Alt: Story = {
  render: () => <AltExample />,
};
