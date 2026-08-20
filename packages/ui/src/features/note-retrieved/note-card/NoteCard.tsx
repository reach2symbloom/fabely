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

import { ChevronsUpDownIcon, Copy, EllipsisVerticalIcon, Highlighter, Trash2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

import { PinIconButton } from '@/atoms/pin-icon-button';
import { TRANSITION_EMPHASIZED_FAST } from '@/lib/motion';
import { cn } from '@/lib/utils';
import {
  GatherBookmarkButton,
  type GatherBookmarkButtonMode,
} from '@/features/note-retrieved/gather-bookmark-button';
import { Badge, type BadgeVariant } from '@/primitives/badge';
import { IconButton } from '@/primitives/button/icon-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/primitives/dropdown-menu';
import { Textarea } from '@/primitives/textarea';

/**
 * `layout` here (row + Pin wrapper), sharing the exact same transition as
 * Gather Bookmark Button's own internal layout tracking — Pin sits before
 * Bookmark in this row, and Bookmark's width change moves Pin's position
 * too (this row is itself the flex item `justify-between` right-aligns in
 * the title row above, so growing Bookmark pushes the whole cluster's
 * left edge — and Pin with it — rather than only affecting Bookmark's own
 * box). Without Pin also being layout-tracked, Motion's FLIP pass has no
 * way to know Pin moved at all and it just snaps.
 */
const MotionPinIconButton = motion.create(PinIconButton);

type NoteTag = 'notes' | 'research' | 'manuscript';

const NOTE_TAG_LABEL: Record<NoteTag, string> = {
  notes: 'Notes',
  research: 'Research',
  manuscript: 'Manuscript',
};

/** `notes` → Badge's own `default` (Figma Primary); `research` → the Fia
 * brand color (no Figma Badge axis for it — see Badge's own docstring);
 * `manuscript` → `secondary`. */
const NOTE_TAG_BADGE_VARIANT: Record<NoteTag, BadgeVariant> = {
  notes: 'default',
  research: 'fia',
  manuscript: 'secondary',
};

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
   * Fires when a truncated (long) body is double-clicked (or the footer's
   * Expand icon is clicked) — the hook point for opening the note in a
   * full-width view. That view doesn't exist yet; this only wires the
   * trigger. Double-click, not single: the body still reads as a normal
   * paragraph, and a single click would fire too easily while selecting
   * or reading text. Keyboard access is still a single Enter/Space.
   */
  onOpenNote?: () => void;
  date?: string;
  /**
   * Footer word count. Defaults to a live count of the actual `body` text
   * (updates as the user edits it inline) — pass this only to override
   * that with something else (e.g. a linked manuscript excerpt's count
   * rather than the note text itself).
   */
  wordCount?: number;
  /**
   * Trailing badge — a closed set, each with its own color: `notes` is the
   * default (Badge's own `default`/Primary), `research` uses the Fia brand
   * color, `manuscript` uses `secondary`.
   */
  tag?: NoteTag;
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
  /** Footer "more options" menu — hover-revealed trigger, Dropdown Menu content. */
  onCopyNote?: () => void;
  onCopyHighlights?: () => void;
  onDeleteNote?: () => void;
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
  tag = 'notes',
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
  onCopyNote,
  onCopyHighlights,
  onDeleteNote,
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
  /* Word count is computed from this, not live `body` — recounting on
   * every keystroke reads as distracting/jittery. Only syncs from `body`
   * on blur (see the body Textarea's onBlur below), i.e. once the edit is
   * actually "saved," matching how the truncate/read-only reassessment
   * itself is already gated on blur, not on every change. */
  const [committedBody, setCommittedBody] = useState(initialBody);
  const [isEditingBody, setIsEditingBody] = useState(false);
  const isBodyOverThreshold = body.length > bodyTruncateThreshold;
  /* Trimmed + split on whitespace runs — empty body counts as 0, not 1
   * (an empty string still "splits" into one empty-string element). */
  const trimmedCommittedBody = committedBody.trim();
  const computedWordCount = trimmedCommittedBody
    ? trimmedCommittedBody.split(/\s+/).length
    : 0;
  const displayWordCount = wordCount ?? computedWordCount;
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
  /* First two blank-line-separated paragraphs of the truncated read-only
   * body — see the render below for why this isn't a single `line-clamp`
   * over the whole flow. A body with no blank-line breaks at all (a
   * single long paragraph) yields one entry here, same as before. */
  const bodyParagraphs = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .slice(0, 2);

  const hasTitle = Boolean(title);

  const prefersReducedMotion = useReducedMotion();
  /* Same resolved --duration-fast/--ease-emphasized transition as Gather
   * Bookmark Button's own internal layout tracking, so Pin's glide and
   * Bookmark's own resize read as one coordinated motion, not two. */
  const layoutTransition = prefersReducedMotion
    ? { duration: 0 }
    : TRANSITION_EMPHASIZED_FAST;

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
          {/* Title + annotation share a tighter sub-column (2px flex-gap;
           * the shell's own 1px transparent border top/bottom nets it to
           * ~4px rendered) — kept close to each other while still being
           * "decoupled" from the icon cluster: annotation is its own full-
           * width row, no longer squeezed into title's row alongside Pin/
           * Bookmark. The outer gap-xs above governs the (unchanged) 8px
           * gap down to body. */}
          <div className="flex w-full flex-col items-start gap-[length:var(--spacing-3xs)]">
            {/* Title row — space-between: title flexes, icon cluster hugs
             * the right edge. */}
            <div className="flex w-full items-start justify-between gap-[length:var(--spacing-xs)]">
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
                  'min-w-0 flex-1 pt-[length:var(--spacing-3xs)]',
                  'font-[family-name:var(--text-paragraph-xl-regular-font-family)]',
                  '[font-weight:var(--text-paragraph-xl-regular-font-weight)]',
                  'text-[length:var(--text-paragraph-xl-regular-font-size)]',
                  'leading-[var(--text-paragraph-xl-regular-line-height)]',
                  'tracking-[var(--text-paragraph-xl-regular-letter-spacing)]',
                  'text-[color:var(--theme-alpha-black-switch-70)]',
                  /* Hover-only, one notch up the alpha scale (70 → 80 — the
                   * next +5 step at 75 read as too subtle to notice) — a
                   * quiet "this is editable" cue that doesn't compete with
                   * the focus/typing state, which is unchanged. */
                  'hover:text-[color:var(--theme-alpha-black-switch-80)]',
                  'placeholder:text-[color:var(--theme-alpha-black-switch-50)]'
                )}
              />
              <motion.div
                layout
                transition={layoutTransition}
                className="flex shrink-0 items-center gap-[length:var(--spacing-xs)] pl-[length:var(--spacing-xs)] pt-[length:var(--spacing-3xs)]"
              >
                {showPin && (
                  <MotionPinIconButton
                    layout
                    transition={layoutTransition}
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
              </motion.div>
            </div>
            {/* `body` textStyle (not `heading`) — annotation is allowed to
             * wrap 2-3 lines. Its own full-width row, decoupled from the
             * title row above — no longer squeezed by the icon cluster. */}
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
                /* Hover-only, one notch up (50 → 60) — same quiet cue as title. */
                'hover:text-[color:var(--theme-alpha-black-switch-60)]',
                'placeholder:text-[color:var(--theme-alpha-black-switch-50)]'
              )}
            />
          </div>
          {showReadOnlyBody ? (
            /* Long body is read-only + truncated — double-click opens the
             * full note (hook only; that view doesn't exist yet). Not a
             * plain onClick: this text otherwise looks and reads like a
             * normal paragraph, and a single click would fire mid-select
             * or mid-read far too easily. Keyboard access stays a single
             * Enter/Space via onKeyDown — a "double-press" convention
             * isn't a thing keyboard users would expect.
             *
             * Rendered as real, separate paragraph blocks — not one
             * `line-clamp` spanning the whole pre-line-flattened body. A
             * single shared clamp counts *total visual lines* across the
             * entire flow, so it clips wherever the Nth line happens to
             * fall — often mid-paragraph-one for a multi-paragraph body,
             * never even reaching paragraph two. Splitting on blank-line
             * breaks and showing the first two as independent blocks (each
             * with its own `line-clamp-6` safety net, not a shared one)
             * guarantees paragraph one renders in full and paragraph two
             * is genuinely visible, with anything beyond it dropped
             * outright rather than clipped partway through. */
            <button
              type="button"
              onDoubleClick={onOpenNote}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenNote?.();
                }
              }}
              aria-label="Open full note"
              className={cn(
                'flex w-full cursor-pointer flex-col text-left',
                'gap-[length:var(--spacing-sm)]',
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
              {bodyParagraphs.map((paragraph, index) => (
                <span key={index} className="line-clamp-6 block whitespace-pre-line">
                  {paragraph}
                </span>
              ))}
            </button>
          ) : (
            <Textarea
              variant="invisible"
              textStyle="body"
              resizable={false}
              value={body}
              placeholder="Add your note..."
              aria-label="Note body"
              onFocus={() => setIsEditingBody(true)}
              onBlur={() => {
                setIsEditingBody(false);
                setCommittedBody(body);
              }}
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
                /* Hover-only, one notch up (70 → 80) — same quiet cue as title. */
                'hover:text-[color:var(--theme-alpha-black-switch-80)]',
                'placeholder:text-[color:var(--theme-alpha-black-switch-50)]',
                /* Past the threshold mid-edit: stop growing at 2x the
                 * read-only view's own line-clamp-6 cap (12 lines) and
                 * scroll instead, rather than growing the row unbounded.
                 * A native <textarea> can't be meaningfully wrapped by our
                 * ScrollArea primitive — its own field-sizing-content
                 * intrinsic sizing silently caps at whatever fits inside a
                 * height-constrained ancestor rather than overflowing it,
                 * so ScrollArea's viewport never sees anything to scroll.
                 * Styling the textarea's own native scrollbar to match
                 * Foundations' look (thin thumb, 2px end padding) instead —
                 * see the [&::-webkit-scrollbar*] rules and
                 * scrollbar-color below. */
                isEditingBody &&
                  isBodyOverThreshold &&
                  cn(
                    'max-h-[calc(var(--text-paragraph-regular-regular-line-height)*12)] overflow-y-auto',
                    'pr-[length:var(--spacing-3xs)]',
                    '[scrollbar-width:thin] [scrollbar-color:var(--theme-alpha-white-no-switch-25)_transparent]',
                    '[&::-webkit-scrollbar]:w-[length:var(--spacing-2xs)]',
                    '[&::-webkit-scrollbar-track]:bg-transparent',
                    '[&::-webkit-scrollbar-thumb]:rounded-[length:var(--rounded-sm)]',
                    '[&::-webkit-scrollbar-thumb]:bg-[color:var(--theme-alpha-white-no-switch-25)]'
                  )
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
            {date && (
              <span className="text-[color:var(--theme-alpha-black-switch-50)]">·</span>
            )}
            <span
              className={cn(
                'whitespace-nowrap font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
                '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
                'text-[length:var(--text-paragraph-mini-regular-font-size)]',
                'leading-[var(--text-paragraph-mini-regular-line-height)]',
                'text-[color:var(--theme-alpha-black-switch-50)]'
              )}
            >
              {displayWordCount.toLocaleString()} words
            </span>
            <Badge variant={NOTE_TAG_BADGE_VARIANT[tag]}>{NOTE_TAG_LABEL[tag]}</Badge>
          </div>

          {/* Expand / more — revealed on card hover, never at rest.
           * Available in every mode, short or long body alike — even a
           * short, already-editable-inline note can still open the
           * full-width view. Both share the row's hover reveal; expand
           * reuses the same onOpenNote hook the truncated body button
           * itself calls. */}
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
              aria-label="Expand note"
              onClick={onOpenNote}
            >
              <ChevronsUpDownIcon aria-hidden />
            </IconButton>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <IconButton
                    variant="ghost"
                    roundness="round"
                    size="sm"
                    aria-label="More options"
                  />
                }
              >
                <EllipsisVerticalIcon aria-hidden />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onCopyNote}>
                  <Copy aria-hidden />
                  Copy note to clipboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onCopyHighlights}>
                  <Highlighter aria-hidden />
                  Copy all highlights
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={onDeleteNote}>
                  <Trash2 aria-hidden />
                  Delete note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

export { NoteCard, type NoteCardProps };
