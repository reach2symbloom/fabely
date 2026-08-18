/**
 * Library List Item — book row in the Library grid/list.
 *
 * Figma set: Library list item (`16428:12557`). Axes are Hover / Active /
 * Variant (Existing book, New book) — Hover and Active never combine in
 * Figma (3 mutually exclusive states × 2 variants = the 6 published
 * combos), so `active` suppresses this row's own `:hover` styling rather
 * than layering on top of it.
 *
 * Meta content (category badge, series, timestamp, chapter/note/word
 * counts) is identical between the Figma "Hover" and "Rest" nodes — only
 * container padding and title/marker ink change — so this ports as one
 * meta block rather than duplicated hover/rest JSX.
 */
'use client';

import * as React from 'react';
import { EllipsisVerticalIcon, GitBranchIcon, MoveRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/primitives/badge';
import { ButtonLink, IconButton } from '@/primitives/button';

export type LibraryListItemVariant = 'existing-book' | 'new-book';

export type LibraryListItemProps = {
  /** Existing book (has content) vs. New book (freshly created, no stats yet). */
  variant?: LibraryListItemVariant;
  /** This row is the currently open manuscript — pins the gradient wash and suppresses hover. */
  active?: boolean;
  /** Storybook / playground — lock hover paint without a pointer. */
  forceHover?: boolean;
  /** Continue/Start writing link — only ever shown while `active`. */
  showLinkButton?: boolean;
  /** Trailing ellipsis actions button — hidden while hovering, shown at rest and active. */
  showMenuButton?: boolean;
  title?: string;
  category?: string;
  seriesLabel?: string;
  /** Defaults to "Last opened 2w ago" (existing book) / "Created just now" (new book). */
  timestampLabel?: string;
  chapterCount?: number;
  noteCount?: number;
  wordCount?: string;
  /** Manuscript route. Renders a stretched link behind the row when set. */
  href?: string;
  className?: string;
  onMenuClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const DEFAULT_TITLE =
  'The Semantic Continuum Theory: The Folding of Unity (t) into Meaning';

const paragraphRegular = [
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-regular)]',
  'text-[length:var(--text-paragraph-regular-regular-font-size)]',
  'leading-[var(--text-paragraph-regular-regular-line-height)]',
  'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
].join(' ');

const paragraphMiniRegular = [
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-regular)]',
  'text-[length:var(--text-paragraph-mini-regular-font-size)]',
  'leading-[var(--text-paragraph-mini-regular-line-height)]',
  'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
].join(' ');

/** Title ink — muted at rest, `--text` on hover/active (group-gated so `active` bypasses the pointer). */
const titleInk =
  'text-[color:var(--theme-alpha-black-switch-60)] transition-colors duration-[var(--duration-fast)] ease-emphasized motion-reduce:transition-none group-hover/library-list-item:text-[color:var(--text)] group-data-[force-hover=true]/library-list-item:text-[color:var(--text)] group-data-[active=true]/library-list-item:text-[color:var(--text)]';

function LibraryListItem({
  variant = 'existing-book',
  active = false,
  forceHover = false,
  showLinkButton = true,
  showMenuButton = false,
  title = DEFAULT_TITLE,
  category = 'Non-fiction',
  seriesLabel = 'Series',
  timestampLabel,
  chapterCount = 31,
  noteCount = 4030,
  wordCount = '100.5k',
  href,
  className,
  onMenuClick,
}: LibraryListItemProps) {
  const isExistingBook = variant === 'existing-book';
  const resolvedTimestamp =
    timestampLabel ?? (isExistingBook ? 'Last opened 2w ago' : 'Created just now');
  const linkLabel = isExistingBook ? 'Continue writing' : 'Start writing';

  return (
    <div
      data-slot="library-list-item"
      data-variant={variant}
      data-active={active || undefined}
      data-force-hover={forceHover || undefined}
      className={cn(
        'group/library-list-item relative flex w-full max-w-[325px] flex-col items-start gap-[length:var(--spacing-xs)]',
        'rounded-[length:var(--rounded-lg)] pt-[length:var(--spacing-sm)] pb-[length:var(--spacing-md)]',
        /* duration-fast is a bare Tailwind class, not var(--duration-fast) — Tailwind
         * v4 has no dynamic `--duration-*` theme namespace (only `--ease-*` is dynamic),
         * so it silently resolves to nothing and falls back to the 150ms default.
         * Spelled out explicitly here to actually get the intended 200ms. */
        'transition-[padding,background-image,backdrop-filter] duration-[var(--duration-fast)] ease-emphasized motion-reduce:transition-none',
        active
          ? [
              'px-[length:var(--spacing-md)] backdrop-blur-[3px]',
              'bg-gradient-to-l from-[color:rgba(255,255,255,0)] to-[color:rgba(166,160,155,0.1)]',
            ]
          : [
              'px-[length:var(--spacing-md)]',
              'hover:pr-[length:var(--spacing-md)] hover:pl-[length:var(--spacing-lg)]',
              'data-[force-hover=true]:pr-[length:var(--spacing-md)]',
              'data-[force-hover=true]:pl-[length:var(--spacing-lg)]',
            ],
        className,
      )}
    >
      {href != null ? (
        <a
          href={href}
          aria-label={title}
          data-slot="library-list-item-link"
          className="absolute inset-0 z-0 rounded-[inherit]"
        />
      ) : null}

      <div className="relative z-10 flex w-full items-start justify-between gap-[length:var(--spacing-xs)]">
        <p
          data-slot="library-list-item-title"
          className={cn('min-w-0 flex-1 break-words', paragraphRegular, titleInk)}
        >
          {title}
        </p>

        {showMenuButton ? (
          <IconButton
            type="button"
            variant="ghost"
            size="mini"
            aria-label="Book actions"
            data-slot="library-list-item-actions"
            onClick={onMenuClick}
            className={cn(
              'shrink-0 opacity-0 pointer-events-none',
              'transition-opacity duration-[var(--duration-fast)] ease-emphasized',
              'group-hover/library-list-item:opacity-100 group-hover/library-list-item:pointer-events-auto',
              'group-data-[force-hover=true]/library-list-item:opacity-100',
              'group-data-[force-hover=true]/library-list-item:pointer-events-auto',
              'focus-visible:opacity-100 focus-visible:pointer-events-auto',
            )}
          >
            <EllipsisVerticalIcon />
          </IconButton>
        ) : null}
      </div>

      <div
        data-slot="library-list-item-meta"
        className="relative z-10 flex flex-col items-start gap-[length:var(--spacing-xs)] py-[length:var(--spacing-3xs)]"
      >
        <div className="flex items-center gap-[length:var(--spacing-md)]">
          <Badge>
            {category}
            <GitBranchIcon />
            <span className="max-w-[100px] overflow-hidden text-ellipsis">
              {seriesLabel}
            </span>
          </Badge>
          <span
            className={cn(
              paragraphMiniRegular,
              'text-[color:var(--muted-foreground)] italic whitespace-nowrap',
            )}
          >
            {resolvedTimestamp}
          </span>
        </div>
        {isExistingBook ? (
          <div className="flex items-center gap-[length:var(--spacing-xs)] pl-[length:var(--spacing-1-5)]">
            <span
              className={cn(paragraphMiniRegular, 'whitespace-nowrap text-[color:var(--theme-alpha-black-switch-30)]')}
            >
              {chapterCount} chapters
            </span>
            <span
              aria-hidden
              className="size-[2px] rounded-[length:var(--rounded-full)] bg-[color:var(--theme-alpha-black-switch-30)]"
            />
            <span
              className={cn(paragraphMiniRegular, 'whitespace-nowrap text-[color:var(--theme-alpha-black-switch-30)]')}
            >
              {noteCount.toLocaleString()} notes
            </span>
            <span
              aria-hidden
              className="size-[2px] rounded-[length:var(--rounded-full)] bg-[color:var(--theme-alpha-black-switch-30)]"
            />
            <span
              className={cn(paragraphMiniRegular, 'whitespace-nowrap text-[color:var(--theme-alpha-black-switch-30)]')}
            >
              {wordCount} words
            </span>
          </div>
        ) : null}
      </div>

      {active && showLinkButton ? (
        <div className="relative z-10 flex flex-col items-start pt-[length:var(--spacing-2xs)]">
          <ButtonLink
            variant="primary"
            size="default"
            tabIndex={-1}
            aria-hidden
            data-slot="library-list-item-link-button"
          >
            {linkLabel}
            <MoveRightIcon />
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}

export { LibraryListItem };
