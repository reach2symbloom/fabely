/**
 * AI Mode Toggle — switches the Promptbar between AI operating modes
 * (Gather / Scene Desk / Fia).
 *
 * Built on the existing `Tabs` primitive (`variant="default"`, the
 * segmented-pill treatment), not a hand-rolled segmented control. Figma's
 * own docket lists this exact size ("AI toggle / Size5") as a *deferred*
 * Tabs primitive variant — `Tabs` itself is intentionally left unmodified
 * here; this stays a Promptbar-local composition on top of the existing
 * `default`/`size="default"` surface (className overrides only), per
 * `.cursor/rules/overlap-check.mdc`'s "compose, don't fork" guidance.
 *
 * Triggers genuinely resize with state (icon-only ↔ icon+label) — the row
 * reflows, exactly like ordinary Tabs. What must feel like one continuous
 * object is the active glass pill riding that reflow. See the pill's own
 * comment below for why that means rendering it *inside* whichever
 * trigger is active, with `layoutId`, rather than positioning it
 * independently at the list level.
 */

'use client';

import * as React from 'react';
import { BookOpenText } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { TRANSITION_EMPHASIZED_FAST } from '@/lib/motion';
import { FiaSilcrow, GatherSearchNotesIcon } from '@/foundations/icons';
import { Tabs, TabsList, TabsTrigger } from '@/primitives/tabs';

export type AIMode = 'gather' | 'scene-desk' | 'fia';

export type AIModeToggleProps = {
  /** Controlled value. */
  value?: AIMode;
  /** Uncontrolled initial value. */
  defaultValue?: AIMode;
  onValueChange?: (mode: AIMode) => void;
  className?: string;
};

type ModeConfig = {
  value: AIMode;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  /** Each mode's own semantic ghost token — the pill's background as it
   * settles into this mode, not a shared/generic fill. */
  ghostToken: string;
  activeText: string;
};

const MODES: readonly ModeConfig[] = [
  {
    value: 'gather',
    label: 'Gather',
    Icon: GatherSearchNotesIcon,
    ghostToken: 'var(--tw-raw-secondary-ghost)',
    activeText: 'data-active:text-[color:var(--tw-raw-secondary-200)]',
  },
  {
    value: 'scene-desk',
    label: 'Scene Desk',
    Icon: BookOpenText,
    ghostToken: 'var(--tw-raw-scene-desk-ghost)',
    activeText: 'data-active:text-[color:var(--tw-raw-scene-desk-500)]',
  },
  {
    value: 'fia',
    label: 'Fia',
    Icon: FiaSilcrow,
    ghostToken: 'var(--tw-raw-fia-ghost)',
    activeText: 'data-active:text-[color:var(--tw-raw-fia-200)]',
  },
];

/**
 * Primary version has no extra ring at all — the fill/border/shadow live
 * entirely on the pill, not on the trigger. This needs two separate
 * overrides, not one, because Tabs' `default` variant paints its generic
 * active look with *two* properties that both had to be killed once the
 * pill took over the whole visual job:
 *
 * 1. `background` — the two-layer opaque neutral gradient
 *    (`data-active:[background:linear-gradient(...)]` etc., across
 *    `data-active`/`hover`/`focus-visible` × light/dark).
 * 2. `shadow` — `data-active:shadow-[var(--effect-focus-ring-primary)]`,
 *    applied *unconditionally* on `data-active` (not gated on focus at
 *    all — it's the other half of the same gradient-border illusion, a
 *    resting-state ring around every active segmented tab elsewhere in
 *    the app). Killing only `background` and leaving this alone was the
 *    bug behind "I can still see the gap": a visible ring around the
 *    pill at all times, with or without keyboard focus, that had nothing
 *    to do with focus at all.
 *
 * `tailwind-merge` has a real gap here worth flagging: `shadow-none` does
 * **not** dedupe against `shadow-[var(...)]` in this project's config —
 * confirmed empirically — so the override below uses `shadow-[none]`
 * (bracket syntax, not the bare keyword utility) specifically because
 * that's the form `tailwind-merge` actually recognizes as the same class
 * group as the primitive's own `shadow-[...]`.
 *
 * The extra keyboard-focus ring (Figma's "Alt active state" reference
 * frame) exists, but only as a Storybook Playground comparison — see
 * `--ai-mode-toggle-ring-width` below, default `0` (invisible). It isn't
 * shown by default in the primary version, per product decision.
 */
const TRIGGER_BASE_CLASSNAME = cn(
  /**
   * `flex-none`, overriding Tabs' own `flex-1` — with three triggers in a
   * row, `flex-1` (its default: grow to fill *any* leftover space in the
   * container) split the space left over after the active trigger claimed
   * what its icon+label content needed equally between the two inactive
   * ones, stretching them wider than their own icon-only content needs.
   * `flex-none` makes every trigger size to just its own content, so
   * inactive tabs hug their icon instead of carrying dead space.
   */
  'relative flex-none gap-0',
  /**
   * The active pill's box now extends 1px beyond the trigger's own
   * padding-box, flush with the trigger's true outer (border-box) edge —
   * see the pill's own `-inset-[length:var(--stroke-thin)]` below. That's
   * what lets the ring here consume Foundations' `--effect-focus-ring-
   * neutral` directly as a plain `box-shadow`: a non-inset `box-shadow`
   * starts its spread at the border-box edge, so once the pill's edge
   * sits there too, there's no gap left to compensate for. An earlier
   * pass used `outline` + a manual `-1px` offset instead, needed only
   * because the pill sat flush with the padding-box (1px further in)
   * while the ring math assumed the border-box edge; fixing the
   * geometry at its source removed the need for that workaround, and for
   * composing the ring's color/width/style by hand at all.
   *
   * Two rulesets, not one, because they serve different purposes and
   * must stay independent — both read the *same* Foundations token as
   * their "on" value, toggled via a CSS variable that defaults to `none`:
   *
   * 1. Real keyboard focus (`data-active:focus-visible:`) — the
   *    production behavior. `--ai-mode-toggle-ring` defaults to `none`
   *    (invisible) — ships with no ring on real focus, per product
   *    decision — and no code sets it to anything else; it's left wired
   *    rather than deleted so a real keyboard-triggered ring stays
   *    possible without touching this file again, without changing
   *    today's shipped (ringless) behavior.
   * 2. Storybook's "With ring" alternative (`data-active:`, deliberately
   *    *not* gated on `:focus-visible`) — needs to render the Figma
   *    reference state persistently in a static story, regardless of
   *    whether the browser's real focus-visible heuristic currently
   *    considers the element focused (mouse clicks never trigger it, and
   *    even real keyboard focus is momentary — neither suits a
   *    persistent comparison view). `--ai-mode-toggle-ring-force` is a
   *    second, independent variable defaulting to `none` for the same
   *    reason: nothing but that one Storybook control ever sets it (to
   *    `var(--effect-focus-ring-neutral)`), so normal usage — keyboard-
   *    focused or not — never shows it.
   *
   * Both declarations also supersede Tabs' own `data-active:shadow-[var(
   * --effect-focus-ring-primary)]` (its half of the gradient-border
   * illusion, applied unconditionally on `data-active` — see `tabs.tsx`)
   * simply by being the last `shadow-[...]` declaration in their
   * respective variant chains; defaulting to `none` already nulls it out,
   * without a separate explicit override.
   */
  'data-active:focus-visible:shadow-[var(--ai-mode-toggle-ring,none)]',
  'data-active:shadow-[var(--ai-mode-toggle-ring-force,none)]',
  'data-active:[background:none] dark:data-active:[background:none]',
  'data-active:hover:[background:none] dark:data-active:hover:[background:none]',
  'data-active:focus-visible:[background:none] dark:data-active:focus-visible:[background:none]'
);

/**
 * Motion-wrapped, not rebuilt — `motion.create` passes an untouched ref
 * through to `TabsTrigger`'s own root element (same pattern as
 * `GatherBookmarkButton`'s motion-wrapped primitives), so `layout` here
 * gets FLIP tracking on the real DOM box with zero changes to the
 * primitive itself. Every trigger shares this, plus one `transition`
 * value with the label and the pill below — a resizing trigger, its
 * repositioning siblings, the label crossfade, and the pill riding along
 * are all driven by that one shared timing, which is what makes them read
 * as one coordinated motion instead of separately-tuned pieces.
 */
const MotionTabsTrigger = motion.create(TabsTrigger);

const PILL_LAYOUT_ID = 'ai-mode-toggle-pill';

function AIModeToggle({
  value: valueProp,
  defaultValue = 'gather',
  onValueChange,
  className,
}: AIModeToggleProps) {
  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<AIMode>(defaultValue);
  const value = isControlled ? valueProp : uncontrolled;

  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? { duration: 0 } : TRANSITION_EMPHASIZED_FAST;

  function handleValueChange(next: string) {
    const mode = next as AIMode;
    if (!isControlled) setUncontrolled(mode);
    onValueChange?.(mode);
  }

  return (
    <Tabs value={value} onValueChange={handleValueChange} className={cn('w-fit', className)}>
      <TabsList
        aria-label="AI mode"
        className={cn(
          'h-[length:var(--spacing-2xl)] items-stretch p-[length:var(--spacing-3xs)]',
          // Inner ring, not a real `border` — an inset `box-shadow` sits
          // flush against the inside of the box purely visually, without
          // consuming any of the declared 32px/2px padding box the way a
          // real `border` (part of the box model) does.
          'shadow-[inset_0_0_0_var(--stroke-thin)_var(--theme-alpha-black-switch-333)]'
        )}
      >
        {MODES.map((mode) => {
          const isActive = mode.value === value;
          return (
            <MotionTabsTrigger
              key={mode.value}
              value={mode.value}
              aria-label={mode.label}
              layout
              transition={transition}
              className={cn(TRIGGER_BASE_CLASSNAME, mode.activeText)}
            >
              {/*
               * The active pill lives *inside* the active trigger, not as
               * an independently-positioned list-level sibling. That's
               * what makes it ride the trigger's own `layout` resize for
               * free — as an `inset-0` child, its box is a pure CSS
               * consequence of its parent's box, recomputed every frame
               * the parent's FLIP is mid-animation, with no separate
               * measurement or animation of its own needed for that part.
               *
               * `layoutId` is what makes it *feel* like one persistent
               * object across the jump from one trigger to another: this
               * instance unmounts here and a same-`layoutId` instance
               * mounts inside the newly-active trigger in the same
               * render, and Motion treats that pair as a single element
               * to morph between — this is Motion's own standard pattern
               * for an animated tab/segmented-control indicator, and the
               * only one of the three techniques worth considering here
               * that's actually built to stay correct *while* the row
               * around it keeps reflowing (a one-shot `animate({x,width})`
               * computed from a snapshot measurement — tried in an
               * earlier pass — has no way to track a target that's still
               * moving under its own separate FLIP animation; the two
               * inevitably drift out of sync).
               *
               * Also carries its own `layout` alongside `layoutId` —
               * without it, this child would inherit the *scale*-based
               * transform Motion uses to fake its resizing parent's FLIP,
               * stretching/squishing the pill's own rounded corners into
               * exactly the blob shape an earlier pass already hit once.
               * `layout` tells Motion to counter-scale this element so it
               * keeps its own true aspect ratio regardless of what its
               * parent's transform is doing.
               */}
              {isActive ? (
                <motion.div
                  layoutId={PILL_LAYOUT_ID}
                  layout
                  transition={transition}
                  aria-hidden
                  className={cn(
                    // `-inset-[...]`, not `inset-0` — extends the pill 1px
                    // beyond the trigger's padding-box to meet the
                    // trigger's true outer (border-box) edge, exactly
                    // where the trigger's own ring `box-shadow` starts its
                    // spread. See the ring comment above for why this
                    // (not an outline offset) is what lets the ring
                    // consume Foundations' token directly with no gap.
                    'pointer-events-none absolute -inset-[length:var(--stroke-thin)] z-0',
                    'rounded-[length:var(--radius)]',
                    'border-[length:var(--stroke-thin)] border-[color:var(--theme-alpha-black-switch-333)]',
                    'shadow-[var(--shadow-sm-black)]',
                    'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]'
                  )}
                  style={{ backgroundColor: mode.ghostToken }}
                />
              ) : null}
              <mode.Icon className="relative z-10" />
              {/*
               * Clips just the label's own enter/exit `y`-slide — not on
               * the trigger itself, which would also clip the pill's
               * `layoutId` travel (it has to visually paint outside its
               * own trigger's box mid-flight to look like it's sliding
               * across the row at all).
               *
               * The icon-label gap comes from this wrapper's own
               * `ms-[...]` margin, tied to `isActive`, not from the
               * trigger's `gap-*` (overridden to `gap-0` above) — `gap`
               * applies between flex children unconditionally, so with
               * this wrapper *always* mounted (needed so a label's exit
               * has somewhere to clip against while it plays), `gap`
               * would reserve that space even while empty, exactly the
               * "dead space right of the icon" bug on inactive triggers.
               * A margin tied to `isActive` collapses immediately once
               * inactive, regardless of the label's own brief exit tail.
               */}
              <span className={cn('relative z-10 overflow-hidden', isActive && 'ms-[length:var(--spacing-1-5)]')}>
                <AnimatePresence mode="popLayout" initial={false}>
                  {isActive ? (
                    <motion.span
                      key="label"
                      className="block"
                      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -3 }}
                      transition={transition}
                    >
                      {mode.label}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </span>
            </MotionTabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}

export { AIModeToggle };
