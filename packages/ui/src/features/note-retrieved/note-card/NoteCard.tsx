/**
 * Note Card — a single note/answer row in the Gather panel's note list.
 * Empty title shows "Add title" / "Add annotation" placeholders; pinning
 * surfaces a persistent Pin + Bookmark pair top-right; hovering the row
 * reveals reorder/more actions in the footer.
 *
 * Figma encodes this as 7 named `Title × Hover × Pin` variants — decoded
 * here into real CSS `:hover` plus two content booleans (`title`, `pinned`)
 * rather than reproduced as literal named states. One nuance worth keeping
 * explicit: the bookmark control's Figma `mode` tracks whether the note
 * *has* a title — `gather` (hover-reveals "Add to scene") when it does,
 * `roam` (icon-only chip) when it doesn't yet.
 *
 * Visual source: Figma **Note card**
 * ([Note card](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16064-4975)
 * `16064:4975`).
 */
'use client';

import { ChevronsUpDownIcon, EllipsisVerticalIcon } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { PinButton } from '@/atoms/pin-button';
import { cn } from '@/lib/utils';
import { GatherBookmarkButton } from '@/features/note-retrieved/gather-bookmark-button';
import { Badge } from '@/primitives/badge';
import { IconButton } from '@/primitives/button/icon-button';

type NoteCardProps = {
  /** Note title. Empty/undefined shows the "Add title" placeholder. */
  title?: string;
  /** Short author annotation. Empty/undefined shows "Add annotation". */
  annotation?: string;
  /** Main note/answer body — always shown. */
  body: string;
  date?: string;
  wordCount?: number;
  /** Trailing badge label. */
  badgeLabel?: string;
  /** Small ordinal shown bottom-left of the card (list position). */
  index?: ReactNode;
  /** Pinned-to-scene state (controlled). */
  pinned?: boolean;
  defaultPinned?: boolean;
  onPinnedChange?: (pinned: boolean) => void;
  /** Bookmarked state (controlled). */
  bookmarked?: boolean;
  defaultBookmarked?: boolean;
  onBookmarkedChange?: (bookmarked: boolean) => void;
  /** Footer "reorder" action — hover-revealed. */
  onReorder?: () => void;
  /** Footer "more options" action — hover-revealed. */
  onMoreOptions?: () => void;
  className?: string;
  /** Storybook / playground — lock the row's hover paint without a pointer. */
  forceHover?: boolean;
};

function NoteCard({
  title,
  annotation,
  body,
  date,
  wordCount,
  badgeLabel = 'Notes',
  index,
  pinned: pinnedProp,
  defaultPinned = false,
  onPinnedChange,
  bookmarked: bookmarkedProp,
  defaultBookmarked = false,
  onBookmarkedChange,
  onReorder,
  onMoreOptions,
  className,
  forceHover = false,
}: NoteCardProps) {
  const isPinnedControlled = pinnedProp !== undefined;
  const [uncontrolledPinned, setUncontrolledPinned] = useState(defaultPinned);
  const pinned = isPinnedControlled ? Boolean(pinnedProp) : uncontrolledPinned;

  const isBookmarkedControlled = bookmarkedProp !== undefined;
  const [uncontrolledBookmarked, setUncontrolledBookmarked] = useState(defaultBookmarked);
  const bookmarked = isBookmarkedControlled ? Boolean(bookmarkedProp) : uncontrolledBookmarked;

  const hasTitle = Boolean(title);

  return (
    <div
      data-slot="note-card"
      data-force-hover={forceHover || undefined}
      className={cn(
        'group/card relative flex w-full flex-col items-start gap-[length:var(--spacing-2xs)] px-[length:var(--spacing-md)]',
        'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
        'hover:bg-[var(--theme-alpha-black-switch-333)] data-[force-hover=true]:bg-[var(--theme-alpha-black-switch-333)]',
        className
      )}
    >
      <div className="flex w-full flex-col items-start border-b-[length:var(--stroke-thin)] border-solid border-[color:var(--theme-alpha-black-switch-5)] py-[length:var(--spacing-md)]">
        <div
          className={cn(
            'flex w-full flex-col items-start',
            hasTitle ? 'gap-[length:var(--spacing-2xs)]' : 'gap-[length:var(--spacing-sm)]'
          )}
        >
          <div className="flex w-full items-start gap-[length:var(--spacing-xs)]">
            <div className="flex min-w-0 flex-1 flex-col items-start gap-[length:var(--spacing-2xs)]">
              <p
                className={cn(
                  'w-full font-[family-name:var(--text-paragraph-xl-medium-font-family)]',
                  '[font-weight:var(--text-paragraph-xl-medium-font-weight)]',
                  'text-[length:var(--text-paragraph-xl-medium-font-size)]',
                  'leading-[var(--text-paragraph-xl-medium-line-height)]',
                  'tracking-[var(--text-paragraph-xl-medium-letter-spacing)]',
                  hasTitle
                    ? 'text-[color:var(--theme-alpha-black-switch-70)]'
                    : 'text-[color:var(--theme-alpha-black-switch-50)]'
                )}
              >
                {hasTitle ? title : 'Add title'}
              </p>
              <p
                className={cn(
                  'w-full font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
                  '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
                  'text-[length:var(--text-paragraph-mini-regular-font-size)]',
                  'leading-[var(--text-paragraph-mini-regular-line-height)]',
                  'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
                  'text-[color:var(--theme-alpha-black-switch-50)]'
                )}
              >
                {hasTitle ? (annotation ?? '') : 'Add annotation'}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-[length:var(--spacing-3xs)] pl-[length:var(--spacing-xs)] pt-[length:var(--spacing-3xs)]">
              {pinned && (
                <PinButton
                  pressed
                  aria-label="Unpin"
                  onPressedChange={(next) => {
                    if (!isPinnedControlled) {
                      setUncontrolledPinned(next);
                    }
                    onPinnedChange?.(next);
                  }}
                />
              )}
              <GatherBookmarkButton
                mode={hasTitle ? 'gather' : 'roam'}
                active={isBookmarkedControlled ? bookmarkedProp : undefined}
                defaultActive={isBookmarkedControlled ? undefined : defaultBookmarked}
                onActiveChange={(next) => {
                  if (!isBookmarkedControlled) {
                    setUncontrolledBookmarked(next);
                  }
                  onBookmarkedChange?.(next);
                }}
              />
            </div>
          </div>
          <p
            className={cn(
              'w-full font-[family-name:var(--text-paragraph-regular-regular-font-family)]',
              '[font-weight:var(--text-paragraph-regular-regular-font-weight)]',
              'text-[length:var(--text-paragraph-regular-regular-font-size)]',
              'leading-[var(--text-paragraph-regular-regular-line-height)]',
              'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
              'text-[color:var(--theme-alpha-black-switch-70)]'
            )}
          >
            {body}
          </p>
        </div>

        <div className="mt-[length:var(--spacing-2xs)] flex h-[length:var(--spacing-2xl)] w-full items-center gap-[length:var(--spacing-xs)]">
          <div className="flex min-w-0 flex-1 items-center gap-[length:var(--spacing-xs)]">
            {date && (
              <span
                className={cn(
                  'whitespace-nowrap font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
                  '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
                  'text-[length:var(--text-paragraph-mini-regular-font-size)]',
                  'leading-[var(--text-paragraph-mini-regular-line-height)]',
                  'text-[color:var(--theme-alpha-black-switch-50)]'
                )}
              >
                {date}
              </span>
            )}
            {date && wordCount !== undefined && (
              <span className="text-[color:var(--theme-alpha-black-switch-50)]">·</span>
            )}
            {wordCount !== undefined && (
              <span
                className={cn(
                  'whitespace-nowrap font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
                  '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
                  'text-[length:var(--text-paragraph-mini-regular-font-size)]',
                  'leading-[var(--text-paragraph-mini-regular-line-height)]',
                  'text-[color:var(--theme-alpha-black-switch-50)]'
                )}
              >
                {wordCount.toLocaleString()} words
              </span>
            )}
            <Badge>{badgeLabel}</Badge>
          </div>

          {/* Reorder / more — revealed on card hover, never at rest. */}
          <div
            className={cn(
              'flex shrink-0 items-center gap-[length:var(--spacing-3xs)] pl-[length:var(--spacing-xs)]',
              'opacity-0 transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
              'group-hover/card:opacity-100 group-data-[force-hover=true]/card:opacity-100'
            )}
          >
            <IconButton
              variant="ghost"
              roundness="round"
              size="sm"
              aria-label="Reorder"
              onClick={onReorder}
            >
              <ChevronsUpDownIcon aria-hidden />
            </IconButton>
            <IconButton
              variant="ghost"
              roundness="round"
              size="sm"
              aria-label="More options"
              onClick={onMoreOptions}
            >
              <EllipsisVerticalIcon aria-hidden />
            </IconButton>
          </div>
        </div>
      </div>

      {index !== undefined && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute left-[length:var(--spacing-md)] top-[22px]',
            'font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
            '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
            'text-[length:var(--text-paragraph-mini-regular-font-size)]',
            'leading-[var(--text-paragraph-mini-regular-line-height)]',
            'text-[color:var(--theme-alpha-black-switch-20)]'
          )}
        >
          {index}
        </span>
      )}
    </div>
  );
}

export { NoteCard, type NoteCardProps };
