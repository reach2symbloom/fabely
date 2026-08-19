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
import { PressRippleLayer, usePressRipple } from '@/foundations/motion';
import { Badge, type BadgeVariant } from '@/primitives/badge';
import { ButtonLink, IconButton } from '@/primitives/button';

export type LibraryListItemVariant = 'existing-book' | 'new-book';

/** Category/genre badge color — Figma shows Fiction as `secondary` (purple), Non-fiction as `default` (grey). */
export type LibraryListItemCategoryVariant = Extract<BadgeVariant, 'default' | 'secondary'>;

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
  categoryVariant?: LibraryListItemCategoryVariant;
  /**
   * Series lockup inside the category Badge (git-branch + label).
   * Pass `false` to omit — Library Nav's third book is category-only.
   */
  seriesLabel?: string | false;
  /** Defaults to "Last opened 2w ago" (existing book) / "Created just now" (new book). */
  timestampLabel?: string;
  chapterCount?: number;
  noteCount?: number;
  wordCount?: string;
  /** Overrides the variant-derived Continue/Start writing label (e.g. Library Nav's uniform "Resume writing"). */
  linkLabel?: string;
  /** Manuscript route. Renders a stretched link behind the row when set. */
  href?: string;
  className?: string;
  onMenuClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Fires on any click on the row (after the ripple spawns) — e.g. Library Nav uses this to detect a click on the already-active book and treat it as "open". */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
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

/*
 * Hover-in (padding growing on the left), scoped to `:hover` /
 * `[data-force-hover=true]` only (see the literal classes below — not
 * factored into a constant, since Tailwind's scanner needs the complete
 * class string to appear literally in this file's text) — a full 5s draw,
 * deliberately hard to finish. Went through three curves tuning this:
 *   1. `cubic-bezier(0.05,0.9,0.05,1)` — way too front-loaded for a 4px
 *      travel (`--spacing-md` → `--spacing-lg`): hit ~90% within 100ms,
 *      then an imperceptible sub-pixel creep for the remaining ~4.9s.
 *   2. `cubic-bezier(0.33,1,0.68,1)` (easeOutCubic) — fixed that, but felt
 *      sluggish to *start* responding to the hover.
 *   3. `cubic-bezier(0.16,1,0.3,1)` (easeOutExpo-ish) — current. Quicker
 *      initial response than easeOutCubic without collapsing back into
 *      (1)'s "done in 100ms" problem; still decelerates hard and keeps
 *      visible motion spread across most of the 5s, like a bow getting
 *      harder to draw the further back it goes.
 */

/**
 * Un-hovering without clicking — no drama, just a quick retract back to
 * rest. Only the click "release" (below) gets the bounce; letting go of
 * the pointer isn't a release, it's just not holding anymore.
 */
const BOWSTRING_RETRACT_EASE = 'ease-[cubic-bezier(0.08,0.82,0.17,1)]';

/**
 * Entering/leaving `active` (the "release") — classic back-ease overshoot,
 * on the normal fast duration. Snaps past the resting padding before
 * settling, like letting go of a drawn bowstring — sharp contrast against
 * the 5s draw.
 */
const BOWSTRING_RELEASE_EASE = 'ease-[cubic-bezier(0.34,1.56,0.64,1)]';

function LibraryListItem({
  variant = 'existing-book',
  active = false,
  forceHover = false,
  showLinkButton = true,
  showMenuButton = false,
  title = DEFAULT_TITLE,
  category = 'Non-fiction',
  categoryVariant = 'default',
  seriesLabel = 'Series',
  timestampLabel,
  chapterCount = 31,
  noteCount = 4030,
  wordCount = '100.5k',
  linkLabel,
  href,
  className,
  onMenuClick,
  onClick,
}: LibraryListItemProps) {
  const isExistingBook = variant === 'existing-book';
  const resolvedTimestamp =
    timestampLabel ?? (isExistingBook ? 'Last opened 2w ago' : 'Created just now');
  const resolvedLinkLabel =
    linkLabel ?? (isExistingBook ? 'Continue writing' : 'Start writing');

  const { ripples, spawnRipple, dismissRipple } = usePressRipple();

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    spawnRipple(event);
    onClick?.(event);
  }

  /**
   * Cursor glow — position only, no re-render. Set directly on the DOM node
   * (not React state) since this fires on every `pointermove`; matches the
   * pattern in Add Section Inline Button's own pointer-follow glow.
   */
  function updateGlowPosition(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--glow-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--glow-y', `${event.clientY - bounds.top}px`);
  }

  return (
    <div
      data-slot="library-list-item"
      data-variant={variant}
      data-active={active || undefined}
      data-force-hover={forceHover || undefined}
      onPointerMove={updateGlowPosition}
      onPointerEnter={updateGlowPosition}
      onClick={handleClick}
      className={cn(
        'group/library-list-item relative flex w-full max-w-[325px] flex-col items-start gap-[length:var(--spacing-xs)]',
        'rounded-[length:var(--rounded-lg)] pt-[length:var(--spacing-sm)] pb-[length:var(--spacing-md)]',
        /* duration-fast is a bare Tailwind class, not var(--duration-fast) — Tailwind
         * v4 has no dynamic `--duration-*` theme namespace (only `--ease-*` is dynamic),
         * so it silently resolves to nothing and falls back to the 150ms default.
         * Spelled out explicitly here to actually get the intended 200ms. */
        'transition-[padding] motion-reduce:transition-none',
        active
          ? [
              'duration-[var(--duration-fast)]',
              BOWSTRING_RELEASE_EASE,
              'px-[length:var(--spacing-md)]',
            ]
          : [
              /* Base (this is what applies leaving :hover — un-hovering isn't
               * a release, just a quick retract). */
              'duration-[var(--duration-fast)]',
              BOWSTRING_RETRACT_EASE,
              'px-[length:var(--spacing-md)]',
              'hover:pr-[length:var(--spacing-md)] hover:pl-[length:var(--spacing-lg)]',
              'data-[force-hover=true]:pr-[length:var(--spacing-md)]',
              'data-[force-hover=true]:pl-[length:var(--spacing-lg)]',
              /*
               * Scoped to :hover / force-hover itself — this is what applies
               * entering hover, overriding the base duration/ease above with
               * the slow 5s draw. CSS transitions use whichever
               * duration/timing-function is in effect on the state being
               * transitioned *into*, so declaring it only here (not on the
               * base rule) is what makes hover-in slow and hover-out fast.
               *
               * Written as complete literal classes, not built via string
               * interpolation — Tailwind's scanner greps this file's raw
               * text for whole class-name substrings; a runtime-concatenated
               * string never appears literally in the source, so it
               * wouldn't get generated.
               */
              'hover:duration-[5000ms] hover:ease-[cubic-bezier(0.16,1,0.3,1)]',
              'data-[force-hover=true]:duration-[5000ms]',
              'data-[force-hover=true]:ease-[cubic-bezier(0.16,1,0.3,1)]',
            ],
        className,
      )}
    >
      {/*
        Active wash is always mounted; only its opacity toggles. `background-image`
        and `backdrop-filter` have no interpolable path from `none`, so swapping
        them in/out via the `active` ternary (as this used to) can only snap —
        opacity is what's actually animatable here.
      */}
      <div
        aria-hidden
        data-slot="library-list-item-active-wash"
        className={cn(
          'pointer-events-none absolute inset-0 z-0 rounded-[inherit]',
          'backdrop-blur-[3px] bg-gradient-to-l from-[color:rgba(255,255,255,0)] to-[color:rgba(166,160,155,0.1)]',
          'opacity-0 transition-opacity duration-[var(--duration-fast)] ease-emphasized motion-reduce:transition-none',
          active && 'opacity-100',
        )}
      />

      {/*
        Cursor glimmer + glass edge highlight — mounted regardless of
        `active` (a pinned/open book can still show pointer feedback; only
        the padding bow-draw is active-exclusive, per Figma). Reveal is
        purely `group-hover`/`group-data-[force-hover]`, so this stays inert
        until the pointer is actually over the row either way.

        Glimmer: an ambient lift in the surface around the pointer, not a
        spotlight — deliberately wide (260px radius, well past the card's
        own ~325-350px width, so it reads as general ambient brightening
        rather than a defined hot spot) and very low-contrast (peak 4.5%
        white, tapering through 2.5%/1%/transparent over 4 stops for a long,
        smooth fade with no perceptible edge anywhere). A first pass at a
        tight 56px/7% version still read as a "searchlight" despite the low
        opacity — a small, sharply-bounded shape reads as a spotlight
        regardless of how faint it is; going wider and flatter is what
        actually kills that look. Position updates via `pointermove` writing
        `--glow-x`/`--glow-y` directly (see `updateGlowPosition`), same
        mechanism as Add Section Inline Button's pointer-follow glow, just
        restyled much quieter and broader for a card-sized surface instead
        of a thin insert line.

        Edge highlight: same --glow-x/--glow-y (so both move together), but
        painted only onto the card's own hairline border, not the surface.
        Ring-only via the mask-composite "exclude" technique already used
        for Button's `GRADIENT_BORDER` (padding-box mask excluded from the
        full box leaves just the border-width band visible) — a radial
        gradient centered at the cursor, once restricted to that thin band,
        naturally reads as a bright point on the edge nearest the pointer
        that feathers away in both directions along the perimeter as
        arc-distance from that point grows, without any conic-gradient or
        manual per-side math. No base/static border is added — this
        codebase's card has never had one; this is purely the hover-only
        localized highlight.
      */}
      <div
        aria-hidden
        data-slot="library-list-item-glow"
        className={cn(
          'pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit] opacity-0',
          'transition-opacity duration-[var(--duration-fast)] ease-emphasized motion-reduce:transition-none',
          'group-hover/library-list-item:opacity-100 group-data-[force-hover=true]/library-list-item:opacity-100',
        )}
        style={{
          background:
            'radial-gradient(circle 260px at var(--glow-x, 50%) var(--glow-y, 50%), color-mix(in srgb, var(--tw-raw-white) 4.5%, transparent) 0%, color-mix(in srgb, var(--tw-raw-white) 2.5%, transparent) 30%, color-mix(in srgb, var(--tw-raw-white) 1%, transparent) 60%, transparent 100%)',
        }}
      />
      <div
        aria-hidden
        data-slot="library-list-item-edge-highlight"
        className={cn(
          'pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0',
          'border-[length:var(--stroke-thin)] border-solid border-transparent',
          '[mask:linear-gradient(#000_0_0)_padding-box_exclude,linear-gradient(#000_0_0)]',
          'transition-opacity duration-[var(--duration-fast)] ease-emphasized motion-reduce:transition-none',
          'group-hover/library-list-item:opacity-100 group-data-[force-hover=true]/library-list-item:opacity-100',
        )}
        style={{
          background:
            'radial-gradient(circle 90px at var(--glow-x, 50%) var(--glow-y, 50%), color-mix(in srgb, var(--tw-raw-white) 45%, transparent) 0%, color-mix(in srgb, var(--tw-raw-white) 12%, transparent) 50%, transparent 85%) border-box',
        }}
      />

      <PressRippleLayer
        ripples={ripples}
        onDismiss={dismissRipple}
        dataSlot="library-list-item-ripple-layer"
      />

      {href != null ? (
        <a
          href={href}
          aria-label={title}
          aria-current={active ? 'page' : undefined}
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
          <Badge variant={categoryVariant}>
            {category}
            {seriesLabel !== false ? (
              <>
                <GitBranchIcon />
                <span className="max-w-[100px] overflow-hidden text-ellipsis">
                  {seriesLabel}
                </span>
              </>
            ) : null}
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

      {showLinkButton ? (
        <div
          aria-hidden={!active}
          inert={!active}
          data-slot="library-list-item-link-reveal"
          /*
           * Height snaps instantly (no transition on grid-template-rows) —
           * only the content inside animates (opacity/translate below).
           * This used to animate the row height too, until a Base UI
           * Tabs-based Library Nav organism (since replaced by the current
           * `<nav>`/`<ul>`/`<li>` Library Nav) exposed a real bug: that
           * continuously-changing height fired Tabs.Indicator's
           * ResizeObserver mid-grow, so the indicator locked onto an early,
           * too-small intermediate height and had to visibly correct once
           * this settled — measured live, it froze at the wrong height for
           * ~140ms before catching up, reading as an overshoot/glitch.
           * Kept the instant-snap fix even after that consumer was
           * removed — it's simpler regardless, and any future consumer
           * that measures this row's rect would hit the same issue.
           */
          className={cn(
            'relative z-10 grid w-full',
            active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={cn(
                'flex flex-col items-start pt-[length:var(--spacing-2xs)]',
                /*
                 * Cascades down from above, not up out of a bottom clip.
                 * Two things make that read unambiguous:
                 *  1. A much larger drop distance (spacing-md, not the
                 *     original spacing-2xs/4px) so "moving downward" is the
                 *     dominant visual cue, not a subtle nudge.
                 *  2. A short delay before the fade starts, entering only
                 *     AFTER the grid-rows wrapper (see below) has already
                 *     opened most of the way. Without the delay, this was
                 *     fading in while still partially clipped by the
                 *     `overflow-hidden` wrapper mid-height-grow, and a
                 *     bottom-clipped fade-in reads as content rising up out
                 *     of a mask, not dropping in from above.
                 */
                'transition-[opacity,translate] duration-[var(--duration-fast)] delay-[60ms] ease-emphasized motion-reduce:transition-none motion-reduce:delay-0',
                active
                  ? 'translate-y-0 opacity-100'
                  : '-translate-y-[length:var(--spacing-md)] opacity-0 delay-0',
              )}
            >
              <ButtonLink
                variant="primary"
                size="default"
                tabIndex={-1}
                aria-hidden
                data-slot="library-list-item-link-button"
              >
                {resolvedLinkLabel}
                <MoveRightIcon />
              </ButtonLink>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { LibraryListItem };
