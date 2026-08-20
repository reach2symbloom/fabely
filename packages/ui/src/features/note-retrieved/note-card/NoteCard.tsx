/**
 * Note Card — a single note/answer row in the Gather panel's note list.
 * Empty title shows "Add title" / "Add annotation" placeholders; pinning
 * surfaces a persistent Pin + Bookmark pair top-right; hovering the row
 * reveals reorder/more actions in the footer.
 *
 * Figma encodes this as 7 named `Title × Hover × Pin` variants — decoded
 * here into real CSS `:hover` plus two content booleans (`title`, `pinned`)
 * rather than reproduced as literal named states.
 *
 * `mode` (`gather` / `roam`) is the surrounding page context this card is
 * rendered in — Gather panel vs. Roam — and passes straight through to the
 * `GatherBookmarkButton`. It is NOT derived from whether the note has a
 * title; Figma's mockup only happens to show Roam mode in its title-less
 * example frames, which is a coincidence of that particular mockup, not a
 * rule.
 *
 * Visual source: Figma **Note card**
 * ([Note card](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16064-4975)
 * `16064:4975`).
 */
'use client';

import { ChevronsUpDownIcon, EllipsisVerticalIcon } from 'lucide-react';
import { useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

import { PinButton } from '@/atoms/pin-button';
import { cn } from '@/lib/utils';
import {
  GatherBookmarkButton,
  type GatherBookmarkButtonMode,
} from '@/features/note-retrieved/gather-bookmark-button';
import { Badge } from '@/primitives/badge';
import { IconButton } from '@/primitives/button/icon-button';
import { Textarea } from '@/primitives/textarea';

type NoteCardProps = {
  /** Note title — an editable invisible input; empty shows "Add title". */
  title?: string;
  defaultTitle?: string;
  onTitleChange?: (title: string) => void;
  /** Short author annotation — an editable invisible input; empty shows "Add annotation". */
  annotation?: string;
  defaultAnnotation?: string;
  onAnnotationChange?: (annotation: string) => void;
  /**
   * Main note/answer body — always shown. Initial/uncontrolled value; edits
   * are self-managed internally and reported via `onBodyChange`, unlike
   * `title`/`annotation`'s full controlled/uncontrolled pair (there's no
   * "empty body" placeholder state to mirror, so the simpler pattern fits).
   */
  body: string;
  onBodyChange?: (body: string) => void;
  /**
   * Above this character count, body renders truncated (`line-clamp`) and
   * read-only instead of editable — click opens the full note instead of
   * editing inline. Below it, body is a genuinely editable `Textarea` like
   * `annotation`.
   */
  bodyTruncateThreshold?: number;
  /**
   * Fires when a truncated (long) body is clicked — the hook point for
   * opening the note in a full-width view. That view doesn't exist yet;
   * this only wires the trigger.
   */
  onOpenNote?: () => void;
  date?: string;
  wordCount?: number;
  /** Trailing badge label. */
  badgeLabel?: string;
  /** Small ordinal shown bottom-left of the card (list position). */
  index?: ReactNode;
  /**
   * Surrounding page context — Gather panel vs. Roam — forwarded directly
   * to `GatherBookmarkButton`'s own `mode`. Not derived from `title`.
   */
  mode?: GatherBookmarkButtonMode;
  /**
   * Whether the Pin control renders at all — distinct from `pinned` (its
   * current state) and `pinInteractive` (whether it can be toggled). A
   * context that doesn't support pinning sets this `false`; Figma's own
   * source only ever showed Pin once already pinned, which meant there was
   * no way to pin from an unpinned state through this control.
   */
  showPin?: boolean;
  /**
   * Whether the Pin control (when shown) can be toggled — distinct from
   * whether it's shown at all. `false` renders it read-only/disabled,
   * reflecting `pinned` without letting the user change it.
   */
  pinInteractive?: boolean;
  /** Pinned-to-scene state (controlled). */
  pinned?: boolean;
  defaultPinned?: boolean;
  onPinnedChange?: (pinned: boolean) => void;
  /** Bookmarked state (controlled). */
  bookmarked?: boolean;
  defaultBookmarked?: boolean;
  onBookmarkedChange?: (bookmarked: boolean) => void;
  /** Footer "more options" action — hover-revealed. */
  onMoreOptions?: () => void;
  /** Bottom divider — off for the last row in a list, or a caller that draws its own separators. */
  showBottomBorder?: boolean;
  className?: string;
  /** Storybook / playground — lock the row's hover paint without a pointer. */
  forceHover?: boolean;
};

function NoteCard({
  title: titleProp,
  defaultTitle = '',
  onTitleChange,
  annotation: annotationProp,
  defaultAnnotation = '',
  onAnnotationChange,
  body: initialBody,
  onBodyChange,
  bodyTruncateThreshold = 359,
  onOpenNote,
  date,
  wordCount,
  badgeLabel = 'Notes',
  index,
  mode = 'gather',
  showPin = true,
  pinInteractive = true,
  pinned: pinnedProp,
  defaultPinned = false,
  onPinnedChange,
  bookmarked: bookmarkedProp,
  defaultBookmarked = false,
  onBookmarkedChange,
  onMoreOptions,
  showBottomBorder = true,
  className,
  forceHover = false,
}: NoteCardProps) {
  const isPinnedControlled = pinnedProp !== undefined;
  const [uncontrolledPinned, setUncontrolledPinned] = useState(defaultPinned);
  const pinned = isPinnedControlled ? Boolean(pinnedProp) : uncontrolledPinned;

  const isBookmarkedControlled = bookmarkedProp !== undefined;
  const [uncontrolledBookmarked, setUncontrolledBookmarked] = useState(defaultBookmarked);
  const bookmarked = isBookmarkedControlled ? Boolean(bookmarkedProp) : uncontrolledBookmarked;

  const isTitleControlled = titleProp !== undefined;
  const [uncontrolledTitle, setUncontrolledTitle] = useState(defaultTitle);
  const title = isTitleControlled ? titleProp : uncontrolledTitle;

  const isAnnotationControlled = annotationProp !== undefined;
  const [uncontrolledAnnotation, setUncontrolledAnnotation] = useState(defaultAnnotation);
  const annotation = isAnnotationControlled ? annotationProp : uncontrolledAnnotation;

  const [body, setBody] = useState(initialBody);
  const [isEditingBody, setIsEditingBody] = useState(false);
  const isBodyOverThreshold = body.length > bodyTruncateThreshold;
  /**
   * Typing past the threshold mid-edit must not eject the field into the
   * read-only truncated view — that would drop focus/cursor position out
   * from under the user's own keystroke. So the switch to read-only is
   * gated on `!isEditingBody`, not on length alone: growth is capped and
   * scrollable instead (see the body `Textarea` below), and the read-only
   * view only takes over once they click off and the length is
   * reassessed.
   */
  const showReadOnlyBody = isBodyOverThreshold && !isEditingBody;

  const hasTitle = Boolean(title);

  /** Enter commits (blurs) instead of inserting a newline — title/annotation aren't paragraphs. */
  const commitOnEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.blur();
    }
  };

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
      <div
        className={cn(
          'flex w-full flex-col items-start py-[length:var(--spacing-md)]',
          showBottomBorder &&
            'border-b-[length:var(--stroke-thin)] border-solid border-[color:var(--theme-alpha-black-switch-5)]'
        )}
      >
        <div className="flex w-full flex-col items-start gap-[length:var(--spacing-xs)]">
          <div className="flex w-full items-start gap-[length:var(--spacing-xs)]">
            <div className="flex min-w-0 flex-1 flex-col items-start gap-[length:var(--spacing-3xs)]">
              <Textarea
                variant="invisible"
                textStyle="heading"
                rows={1}
                value={title}
                placeholder="Add title"
                aria-label="Note title"
                onKeyDown={commitOnEnter}
                onChange={(event) => {
                  const next = event.target.value;
                  if (!isTitleControlled) {
                    setUncontrolledTitle(next);
                  }
                  onTitleChange?.(next);
                }}
                className={cn(
                  'font-[family-name:var(--text-paragraph-xl-regular-font-family)]',
                  '[font-weight:var(--text-paragraph-xl-regular-font-weight)]',
                  'text-[length:var(--text-paragraph-xl-regular-font-size)]',
                  'leading-[var(--text-paragraph-xl-regular-line-height)]',
                  'tracking-[var(--text-paragraph-xl-regular-letter-spacing)]',
                  'text-[color:var(--theme-alpha-black-switch-70)]',
                  'placeholder:text-[color:var(--theme-alpha-black-switch-50)]'
                )}
              />
              {/* `body` textStyle (not `heading`) — annotation is allowed to
               * wrap 2-3 lines, unlike the single-row title. */}
              <Textarea
                variant="invisible"
                textStyle="body"
                resizable={false}
                value={annotation}
                placeholder="Add annotation"
                aria-label="Note annotation"
                onKeyDown={commitOnEnter}
                onChange={(event) => {
                  const next = event.target.value;
                  if (!isAnnotationControlled) {
                    setUncontrolledAnnotation(next);
                  }
                  onAnnotationChange?.(next);
                }}
                className={cn(
                  'min-h-[length:var(--text-paragraph-small-regular-line-height)] px-0 py-0',
                  'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
                  '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
                  'text-[length:var(--text-paragraph-small-regular-font-size)]',
                  'leading-[var(--text-paragraph-small-regular-line-height)]',
                  'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
                  'text-[color:var(--theme-alpha-black-switch-50)]',
                  'placeholder:text-[color:var(--theme-alpha-black-switch-50)]'
                )}
              />
            </div>
            <div className="flex shrink-0 items-center gap-[length:var(--spacing-xs)] pl-[length:var(--spacing-xs)] pt-[length:var(--spacing-3xs)]">
              {showPin && (
                <PinButton
                  pressed={pinned}
                  disabled={!pinInteractive}
                  aria-label={pinned ? 'Unpin' : 'Pin'}
                  onPressedChange={(next) => {
                    if (!isPinnedControlled) {
                      setUncontrolledPinned(next);
                    }
                    onPinnedChange?.(next);
                  }}
                />
              )}
              <GatherBookmarkButton
                mode={mode}
                size="sm"
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
          {showReadOnlyBody ? (
            /* Long body is read-only + truncated — click opens the full
             * note (hook only; that view doesn't exist yet). */
            <button
              type="button"
              onClick={onOpenNote}
              aria-label="Open full note"
              className={cn(
                'line-clamp-6 w-full cursor-pointer text-left',
                'border-0 bg-transparent p-0 outline-none',
                'rounded-[length:var(--rounded-xs)]',
                'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
                'font-[family-name:var(--text-paragraph-regular-regular-font-family)]',
                '[font-weight:var(--text-paragraph-regular-regular-font-weight)]',
                'text-[length:var(--text-paragraph-regular-regular-font-size)]',
                'leading-[var(--text-paragraph-regular-regular-line-height)]',
                'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
                'text-[color:var(--theme-alpha-black-switch-70)]'
              )}
            >
              {body}
            </button>
          ) : (
            <Textarea
              variant="invisible"
              textStyle="body"
              resizable={false}
              value={body}
              aria-label="Note body"
              onFocus={() => setIsEditingBody(true)}
              onBlur={() => setIsEditingBody(false)}
              onChange={(event) => {
                const next = event.target.value;
                setBody(next);
                onBodyChange?.(next);
              }}
              className={cn(
                'min-h-[length:var(--text-paragraph-regular-regular-line-height)] px-0 py-0',
                'font-[family-name:var(--text-paragraph-regular-regular-font-family)]',
                '[font-weight:var(--text-paragraph-regular-regular-font-weight)]',
                'text-[length:var(--text-paragraph-regular-regular-font-size)]',
                'leading-[var(--text-paragraph-regular-regular-line-height)]',
                'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
                'text-[color:var(--theme-alpha-black-switch-70)]',
                /* Past the threshold mid-edit: stop growing at 2x the
                 * read-only view's own line-clamp-6 cap (12 lines) and
                 * scroll instead, rather than growing the row unbounded. */
                isEditingBody &&
                  isBodyOverThreshold &&
                  'max-h-[calc(var(--text-paragraph-regular-regular-line-height)*12)] overflow-y-auto'
              )}
            />
          )}
        </div>

        <div className="mt-[length:var(--spacing-sm)] flex h-[length:var(--spacing-2xl)] w-full items-center gap-[length:var(--spacing-xs)]">
          <div className="flex min-w-0 flex-1 items-center gap-[length:var(--spacing-xs)]">
            {index !== undefined && (
              <span
                aria-hidden
                className={cn(
                  'whitespace-nowrap font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
                  '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
                  'text-[length:var(--text-paragraph-mini-regular-font-size)]',
                  'leading-[var(--text-paragraph-mini-regular-line-height)]',
                  'text-[color:var(--theme-alpha-black-switch-20)]'
                )}
              >
                {index}.
              </span>
            )}
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

          {/* Expand / more — revealed on card hover, never at rest. Expand
           * only appears when body is actually truncated — a short body is
           * already fully visible and editable inline, nothing to expand
           * into. Both share the row's hover reveal; expand reuses the same
           * onOpenNote hook the truncated body button itself calls. */}
          <div
            className={cn(
              'flex shrink-0 items-center gap-[length:var(--spacing-3xs)] pl-[length:var(--spacing-xs)]',
              'opacity-0 transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
              'group-hover/card:opacity-100 group-data-[force-hover=true]/card:opacity-100'
            )}
          >
            {showReadOnlyBody && (
              <IconButton
                variant="ghost"
                roundness="round"
                size="sm"
                aria-label="Expand note"
                onClick={onOpenNote}
              >
                <ChevronsUpDownIcon aria-hidden />
              </IconButton>
            )}
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
    </div>
  );
}

export { NoteCard, type NoteCardProps };
