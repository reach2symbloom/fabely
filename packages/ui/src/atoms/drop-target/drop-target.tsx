/**
 * Drop Target — the glowing insertion-line indicator a drag-reorderable list
 * renders between items to show where a drop would land. Presentation only:
 * a caller (Paragraph List, Chapter Menu's outline drag) owns computing
 * *which* gap is currently active and re-renders this in that gap.
 *
 * Promoted from Chapter Menu's own `DropIndicatorDivider`/`DropIndicatorSlot`
 * (originally `ChapterMenu.stories.tsx`) into a shared atom rather than
 * duplicating it for Paragraph List — both are the same Figma component,
 * **Paragraph drop line** (`Orientation=H`; the `Orientation=V` variant
 * isn't used by either caller yet). `SecondaryGlowRail` itself moved here
 * too (was previously defined in
 * `features/chapter-nav/add-section-inline-button/AddSectionInlineButton.tsx`,
 * which now imports it back) — an atom can't reach into a feature for a
 * piece it depends on.
 *
 * `active` toggles a `grid-template-rows` `0fr` → `1fr` tween (not
 * `height`/`max-height`) so the slot can be always-mounted at zero size
 * rather than conditionally rendered — every gap in a list can render one of
 * these permanently, and only the currently-active one visibly opens. No
 * layout jump between "not rendered" and "rendered at 0 height", and no
 * `max-height` guess to pick.
 *
 * No gap-compensation margin is baked in — Chapter Menu's own row gap needed
 * `[margin-block:calc(var(--outline-row-gap,0px)*-0.5)]` to sit flush
 * between rows, but that's specific to how *that* list spaces its rows, not
 * a Drop Target concern. Pass it (or an equivalent) via `className` if a
 * caller's own row gap needs the same treatment.
 *
 * `chevron` adds the **Chevron=Yes** variant's centered down-glyph below
 * the rail — see `DropLineChevron` below for why its glow can't be
 * tokenized the way the rail's can, and for the slow vertical float it
 * plays for as long as `active` stays true.
 *
 * Visual source: Figma **Paragraph drop line**
 * ([node](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16372-4438)
 * `16372:4438`).
 */
'use client';

import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { FLOAT_LOOP } from '@/lib/motion';
import { cn } from '@/lib/utils';

const SECONDARY_GLOW_LINE =
  'linear-gradient(90deg, color-mix(in srgb, var(--tw-raw-secondary-200) 0%, transparent) 0%, var(--tw-raw-secondary-200) 18.931%, var(--tw-raw-secondary-200) 85%, color-mix(in srgb, var(--tw-raw-secondary-200) 0%, transparent) 100%)';

/** The rail itself, with no open/close animation — used standalone by
 * callers that already own their own show/hide (e.g. Add Section Inline
 * Button's own hover chrome), and internally by `DropTarget`. */
export function SecondaryGlowRail({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative flex min-h-0 min-w-0 flex-1 flex-col justify-center self-stretch py-[var(--spacing-xs)]',
        className,
      )}
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[length:var(--stroke-regular)] -translate-y-1/2 blur-[length:var(--spacing-3xs)]"
        style={{ background: SECONDARY_GLOW_LINE }}
      />
      <span
        className="h-[length:var(--stroke-thin)] w-full"
        style={{ background: SECONDARY_GLOW_LINE }}
      />
    </div>
  );
}

/**
 * The `Chevron=Yes` variant's down-glyph, centered under the rail. A filled
 * shape, not a Lucide stroke icon (Figma's own vector, copied verbatim —
 * same "hand-built from the exact export" precedent Split & Parse's
 * check-circle sets) — with its own drop-shadow glow, distinct from the
 * rail's `linear-gradient` glow because an SVG `<filter>`'s
 * `feColorMatrix` can't consume a CSS custom property the way `fill` can;
 * the matrix values below are `--tw-raw-secondary-200` (`#BDB7EA`)
 * hand-converted to the 0–1 decimals `feColorMatrix` requires. Same
 * "invariant visual treatment bypasses tokens" precedent as the
 * Foundations glows.
 *
 * `filterId` is a per-instance suffix (`useId()` in `DropTarget`) — a
 * `<filter id>` is a document-wide id; two `DropTarget`s both rendering
 * `filter0_d_16372_4423` verbatim would collide and one would silently
 * lose its glow.
 *
 * Figma's own `16x16` frame, uncropped — sits `spacing-2xs` (4px) below
 * the rendered line, not touching it. Without any margin here, the gap
 * would be `SecondaryGlowRail`'s own bottom `py-xs` (8px) — `DropTarget`
 * cancels 4px of that (`-mt-[spacing-2xs]`) to land on the target 4px
 * rather than that padding's own value. The glyph is also drawn with
 * headroom inside its own 16x16 box on top of that (ink starts around
 * y=5, not y=0) — part of the icon as designed, not this component's to
 * adjust either way.
 *
 * `active` drives a slow, continuous vertical float (`FLOAT_LOOP`,
 * `@/lib/motion`) — a calm positional cue that this gap is the live
 * insertion point, not feedback for an action, so it deliberately isn't
 * the snappy spring/emphasized-ease presets the rest of this codebase's
 * Motion reaches for. Only `y` animates — no scale/rotate/opacity — and
 * the `[0, -3, 0]` keyframe array is one full cycle, so each repeat starts
 * exactly where the last one ended rather than snapping back. Animates
 * the `<g>`, not the outer `<svg>`, so the filter's glow travels with the
 * glyph. `useReducedMotion` (Motion's own media-query hook, already this
 * codebase's pattern — see Split & Parse) holds it at rest instead.
 */
function DropLineChevron({
  filterId,
  active,
  className,
}: {
  filterId: string;
  active: boolean;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const floating = active && !prefersReducedMotion;

  return (
    <svg
      aria-hidden
      className={cn('pointer-events-none size-[length:var(--icon-sm)]', className)}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g
        filter={`url(#${filterId})`}
        animate={{ y: floating ? [0, -3, 0] : 0 }}
        transition={floating ? FLOAT_LOOP : { duration: 0.2, ease: 'easeOut' }}
      >
        <path
          d="M11.5286 5.52864C11.789 5.26829 12.211 5.26829 12.4713 5.52864C12.7317 5.78899 12.7317 6.211 12.4713 6.47134L8.47134 10.4713C8.211 10.7317 7.78899 10.7317 7.52864 10.4713L3.52864 6.47134C3.26829 6.211 3.26829 5.78899 3.52864 5.52864C3.78899 5.26829 4.211 5.26829 4.47134 5.52864L7.00004 8.00004H9.00004L11.5286 5.52864Z"
          fill="var(--tw-raw-secondary-200)"
        />
      </motion.g>
      <defs>
        <filter
          id={filterId}
          x="1.33337"
          y="3.33337"
          width="13.3333"
          height="9.33325"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.741176 0 0 0 0 0.717647 0 0 0 0 0.917647 0 0 0 1 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

export type DropTargetProps = {
  /** Whether this is the live prospective insertion point right now. */
  active?: boolean;
  /** Figma's `Chevron=Yes` variant — adds the down-glyph centered under
   * the rail, with `--spacing-xs` (8px) of top padding ahead of the rail
   * and the whole assembly pulled 4px closer to whatever follows it
   * (`-mb-[4px]`) (Chapter Menu's plain rail, `chevron` off, keeps its own
   * `min-h-[spacing-xl]` centering instead — the two aren't the same
   * layout, so this isn't unified into one rule for both). Default
   * `false` (`Chevron=No`) — Chapter Menu still renders the plain rail;
   * Paragraph List is the one caller that turns this on. */
  chevron?: boolean;
  className?: string;
};

export function DropTarget({ active = false, chevron = false, className }: DropTargetProps) {
  const filterId = `drop-target-chevron-glow-${useId()}`;

  return (
    <div
      aria-hidden={!active}
      data-slot="drop-target"
      data-active={active}
      className={cn(
        'grid transition-[grid-template-rows,opacity] duration-normal ease-emphasized',
        active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        chevron && '-mb-[4px]',
        className,
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div
          className={cn(
            'pointer-events-none relative z-20 flex flex-col items-center',
            chevron
              ? 'pt-[length:var(--spacing-xs)]'
              : 'min-h-[length:var(--spacing-xl)] justify-center',
          )}
        >
          <div className="w-full">
            <SecondaryGlowRail />
          </div>
          {chevron ? (
            <DropLineChevron
              filterId={filterId}
              active={active}
              className="-mt-[length:var(--spacing-2xs)]"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
