/**
 * PromptbarShelf — the small elevated card that docks to the top of the
 * Promptbar, showing a status summary (built from `StatusBadge` /
 * `Status`) and, for its expandable configurations, a `ListItem` menu
 * revealed on click.
 *
 * Figma: "Promptbar shelf" (`16199:2558`), 6 symbols across 3 "Type"
 * variants (Default / Fia / Fia workflows) × collapsed/expanded/hover.
 * Like `StatusBadge`, this does not translate Figma's Type axis into a
 * baked-in prop — the 3 Figma types are anatomically the same shell
 * (status content + optional expand trigger + optional revealed content),
 * just composed with different children. See
 * `PromptbarShelf.stories.tsx`'s Figma reference section for all 3 as
 * configurations of this one component.
 *
 * `statusContent` is generic on purpose — every Figma example is a
 * `StatusBadge` (or two), but this shell has no opinion about that; it
 * just lays out whatever's passed. `trigger` is the same idea: an
 * optional slot beside the chevron (Fia workflows' own count
 * `StatusBadge`, say) — expandability itself is driven by whether
 * `children` is given, not by `trigger`, since a shelf can expand with no
 * extra trigger content at all (Default type shows a bare chevron; no
 * "Change" label — the whole card lighting up on hover plus the chevron
 * itself already read as interactive, and a text label there would
 * wrongly imply the chevron edits something rather than expands the
 * shelf).
 *
 * The Promptbar organism itself does not exist yet — this only prepares
 * the shelf so it's ready to dock into that organism later. No Promptbar
 * state/context is read or assumed here.
 */
'use client';

import * as React from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';

import { cn } from '@/lib/utils';
import { EASE_EMPHASIZED_IN, EASE_OUT } from '@/lib/motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/primitives/collapsible';

/* Staggered cascade for the expanded menu — top to bottom entering,
 * bottom to top leaving (mirrors "unfolding down, folding back up").
 * `index`/`total` come from `React.Children.toArray`, so the divider
 * (rendered as a plain child alongside the ListItems) participates in
 * the same sequence naturally, no special-casing. Opacity + `y` only —
 * never anything that affects layout (width/height/margin), so Base
 * UI's own scrollHeight measurement for the panel's height animation
 * stays accurate and nothing reflows underneath this.
 *
 * Items are always mounted (see the render below) — visibility is driven
 * purely by which variant `animate` targets, not by conditionally
 * rendering/unmounting them. An earlier version gated rendering on
 * `open &&` inside an `AnimatePresence`, which made the whole cascade
 * disappear instantly on collapse instead of playing its exit: removing
 * an element from the tree is a mount/unmount decision React makes
 * immediately, and by the time `AnimatePresence` could react, the
 * elements — and the chance to animate them out — were already gone. */
const CASCADE_Y_PX = 8;
const CASCADE_STAGGER_S = 0.035;
const CASCADE_ENTER_DURATION_S = 0.17;
const CASCADE_EXIT_DURATION_S = 0.13;

/** Total time for every item's exit to finish, bottom-to-top — the header's
 * own padding-collapse waits for exactly this long (see the header
 * wrapper's `style` below) so the cascade finishes *before* the top
 * section starts shrinking, not alongside it. */
function cascadeExitTotalMs(total: number, reducedMotion: boolean): number {
  if (reducedMotion || total === 0) return 0;
  return Math.round((CASCADE_EXIT_DURATION_S + (total - 1) * CASCADE_STAGGER_S) * 1000);
}

function cascadeItemVariants(index: number, total: number, reducedMotion: boolean): Variants {
  if (reducedMotion) {
    return {
      hidden: { opacity: 0, transition: { duration: 0 } },
      visible: { opacity: 1, transition: { duration: 0 } },
    };
  }
  return {
    hidden: {
      opacity: 0,
      y: CASCADE_Y_PX,
      transition: {
        duration: CASCADE_EXIT_DURATION_S,
        ease: EASE_EMPHASIZED_IN,
        delay: (total - 1 - index) * CASCADE_STAGGER_S,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: CASCADE_ENTER_DURATION_S, ease: EASE_OUT, delay: index * CASCADE_STAGGER_S },
    },
  };
}

/* Horizontal padding deliberately lives on inner content wrappers, not
 * here — the expanded header's hover veil needs to span the card's full
 * width, flush with these rounded corners, rather than sitting inset
 * inside a shared padding (which reads as a separate boxed chip/button
 * floating inside the shelf, not the shelf's own top surface lighting
 * up).
 *
 * Every configuration's own bottom padding is `--spacing-4xl` (48px), not
 * a smaller step — the Promptbar organism this docks into doesn't exist
 * yet, but it will sit *below* this shelf and the shelf is meant to slide
 * partway *under* it (the Promptbar's own opaque surface covering the
 * shelf's bottom ~48px), not stack cleanly above it with a visible gap.
 * That extra padding is this shelf's own background reaching down into
 * where the future Promptbar will overlap it, so real content
 * (`statusContent`, menu rows) stays clear of that overlap zone and
 * never gets visually clipped by the bar sitting on top of it. Looks like
 * extra empty space at the bottom in isolation today (no Promptbar exists
 * to cover it yet) — that's expected, not a bug. */
const SHELF_BASE = [
  'flex w-full flex-col items-center overflow-hidden',
  'rounded-t-[length:var(--rounded-xl)]',
  'bg-[var(--neutrals-new-200)]',
].join(' ');

/**
 * Figma's own "Drop shadow" effect, confirmed directly from the panel:
 * X 0, Y -16, Blur 24, Spread -4, Color black at 12%. An earlier reading
 * of this had Blur wrong (12, not 24) and dropped Spread entirely — `box-
 * shadow` is the only CSS primitive with a spread parameter at all,
 * `filter: drop-shadow()` structurally can't express one, so this can't
 * live on the same element as `overflow-hidden` (a *box-shadow*, unlike a
 * drop-shadow filter, gets clipped by its own element's overflow) — hence
 * this on a separate OUTER wrapper, with `SHELF_BASE`'s overflow-hidden
 * staying on the inner card underneath it. Geometry (`-16px 24px -4px`)
 * stays literal, same as before, since no published Shadow-scale step
 * matches it; closest existing alpha token used for the 12% (`-10`, no
 * exact 12% step exists in that scale either).
 */
const SHELF_SHADOW = 'rounded-t-[length:var(--rounded-xl)] shadow-[0px_-16px_24px_-4px_var(--theme-alpha-black-no-switch-10)]';

export type PromptbarShelfProps = {
  /** Status summary — typically one or two `StatusBadge`s. Always visible. */
  statusContent: React.ReactNode;
  /** Optional content shown beside the chevron (Fia workflows' own count
   * `StatusBadge`, say). Does not itself decide expandability — a shelf
   * with `children` but no `trigger` still expands via a bare chevron
   * (Default type). */
  trigger?: React.ReactNode;
  /** Revealed when expanded — a group-label caption + `ListItem`s,
   * optionally followed by a `Separator` + more `ListItem`s as a footer.
   * Presence of `children` is what makes the shelf expandable at all —
   * omit entirely for a static shelf (Figma's plain Fia type has no
   * chevron and doesn't expand). */
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

function PromptbarShelf({
  statusContent,
  trigger,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
}: PromptbarShelfProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;
  const expandable = children !== undefined;
  const reducedMotion = Boolean(useReducedMotion());
  const childArray = React.Children.toArray(children);
  /* On collapse, the header's own padding-shrink waits for the cascade to
   * fully finish first (series, not parallel) — on expand it's immediate,
   * since the first item is meant to start "the moment the shelf starts
   * expanding," not after the header settles. */
  const headerPaddingDelayMs = open ? 0 : cascadeExitTotalMs(childArray.length, reducedMotion);

  function handleOpenChange(next: boolean) {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  if (!expandable) {
    return (
      <div className={cn(SHELF_SHADOW, className)}>
        <div
          data-slot="promptbar-shelf"
          className={cn(SHELF_BASE, 'pt-[var(--spacing-xs)] pb-[var(--spacing-4xl)]')}
        >
          <div className="flex w-full items-center px-[var(--spacing-sm)]">{statusContent}</div>
        </div>
      </div>
    );
  }

  /* A dismissible StatusBadge's own remove control (or the chevron
   * CollapsibleTrigger itself) must handle its own click — never also
   * toggle the shelf. */
  function isInteractiveTarget(event: React.MouseEvent<HTMLElement>) {
    return (event.target as HTMLElement).closest('button') !== null;
  }

  /*
   * Collapsed: the whole card is the hover/click target — clicking
   * anywhere expands it. Manual + guarded rather than one big <button>:
   * `statusContent` can contain a real interactive control, and nesting
   * that inside another <button> is invalid HTML and breaks the inner
   * control's own click handling.
   */
  function handleCardClick(event: React.MouseEvent<HTMLDivElement>) {
    if (open || isInteractiveTarget(event)) return;
    handleOpenChange(true);
  }

  /*
   * Expanded: only the header row (chips + chevron) is the hover/collapse
   * target — not the whole card, and not the menu body below (each
   * ListItem keeps its own independent hover). Mirrors the collapsed
   * card's treatment, just scoped to this row instead of the whole card.
   */
  function handleHeaderClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!open || isInteractiveTarget(event)) return;
    handleOpenChange(false);
  }

  return (
    <div className={cn(SHELF_SHADOW, className)}>
      <Collapsible
        data-slot="promptbar-shelf"
        open={open}
        onOpenChange={handleOpenChange}
        onClick={handleCardClick}
        className={cn(
          SHELF_BASE,
          'group/shelf',
          /* Unconditional (not tied to either branch below) — padding-top
           * and gap both change value when `open` flips, and only animate
           * smoothly if this declaration is present on both sides of the
           * toggle for the browser to interpolate between; scoping it to
           * just one branch made the switch instant in one direction. */
          'transition-[background-image,padding,gap] duration-200 ease-out',
          open
            ? /* No root-level gap before CollapsibleContent — the menu
               * content starts flush against the header's own bottom edge.
               * Top padding lives on the header's own wrapper, not here —
               * so its hover veil reaches this card's rounded top edge (the
               * true "top part"), instead of leaving a dead strip of
               * padding above it that doesn't react. Bottom padding here is
               * --spacing-4xl (48px), not --spacing-md — see SHELF_BASE's
               * own note on why every configuration needs that much. */
              'pb-[var(--spacing-4xl)]'
            : [
                'cursor-pointer pt-[var(--spacing-xs)] pb-[var(--spacing-4xl)]',
                /* Illumination, not recoloring — a faint white veil layered
                 * over the constant base fill (background-image on top of
                 * background-color) rather than swapping to a lighter
                 * neutral step, so hover reads as the same surface
                 * responding to the pointer, not a material/state change. */
                'hover:[background-image:linear-gradient(var(--theme-alpha-white-no-switch-333),var(--theme-alpha-white-no-switch-333))]',
              ]
        )}
      >
      {/*
       * Two tiers on purpose: this outer element spans the full card
       * width (no horizontal padding of its own) so its hover veil is a
       * full-bleed band flush with the card's edges — the shelf's own
       * top surface lighting up, not a separate inset chip/button. The
       * inner row below carries the actual padding/layout.
       */}
      <div
        onClick={handleHeaderClick}
        /* Delays only on collapse (0ms on expand) — see
         * `headerPaddingDelayMs`'s own comment above. Inline style, not a
         * Tailwind class: the delay is a computed number of ms depending
         * on how many menu rows there are, not a fixed step. */
        style={{ transitionDelay: `${headerPaddingDelayMs}ms` }}
        className={cn(
          'flex w-full',
          /* Unconditional, not inside the `open &&` branch below — same
           * fix as the root's own transition declaration: `py-md` is
           * added/removed entirely based on `open`, and only animates if
           * a transition covering `padding` is present on BOTH sides of
           * that toggle. Declaring it only when open meant it vanished at
           * the exact instant `py-md` did, so on collapse this padding
           * jumped straight to 0 instead of easing out — visible as the
           * chip snapping to the very top before the root's own padding
           * (which *did* transition) settled it back down to 8px. */
          'transition-[background-image,padding] duration-200 ease-out',
          open && [
            'group/header cursor-pointer py-[var(--spacing-md)]',
            /* Deliberately NOT the collapsed card's own veil token
             * (`--theme-alpha-white-no-switch-333`) — that read as a
             * separate illuminated bar sitting on top of the panel, not
             * part of it. `--theme-alpha-black-switch-5` is the same
             * token `ListItem`'s own row hover already uses (it resolves
             * to a white overlay too, since `switch` tokens flip base
             * color in `.dark` — this shelf is always dark), so the
             * header's hover reads as "the same surface family as the
             * menu below," not a distinct hover species. Collapsed-card
             * hover is untouched — this only affects the expanded header. */
            'hover:[background-image:linear-gradient(var(--theme-alpha-black-switch-5),var(--theme-alpha-black-switch-5))]',
          ]
        )}
      >
        <div className="flex w-full items-center justify-between gap-[var(--spacing-2xs)] px-[var(--spacing-sm)]">
          {statusContent}
          {/*
           * CollapsibleTrigger wraps only the chevron, not `trigger` —
           * `trigger` can itself be a dismissible StatusBadge (a real
           * `<button>` remove control, e.g. a picked workflow's chip).
           * Nesting that inside another `<button>` is invalid HTML and
           * breaks the dismiss button's own click handling, the same
           * class of bug already fixed for `statusContent`. `trigger`
           * sits as a sibling instead — clicks on its non-interactive
           * parts still bubble up to the header's own click-to-collapse.
           */}
          <div className="flex shrink-0 items-center gap-[var(--spacing-2xs)]">
            {trigger}
            <CollapsibleTrigger>
              {/* One glyph, rotated — not a discrete swap between two
               * icons. ChevronUp at 0deg (collapsed) is pixel-identical
               * to a ChevronDown at 180deg (expanded), so the open/close
               * rotation and the hover nudge both land on the same
               * `transform` property and animate as one continuous
               * motion, never resetting or snapping between states. */}
              <ChevronUp
                aria-hidden
                className={cn(
                  'size-[length:var(--icon-sm)] text-[color:var(--muted-foreground)] opacity-70',
                  /* Tailwind v4 writes rotate/translate to their own
                   * standalone CSS properties, not `transform` — list
                   * those, not `transform`, or the rotation/nudge would
                   * snap instead of animating. */
                  'transition-[opacity,color,rotate,translate] duration-200 ease-out',
                  open
                    ? /* A bit more prominent here specifically, since this
                       * chevron is the collapse affordance for an already-
                       * open panel — brighten color, not just opacity
                       * (collapsed-state chevron hover is untouched). */
                      'group-hover/header:translate-y-px group-hover/header:text-[color:var(--foreground)] group-hover/header:opacity-100 rotate-180'
                    : 'rotate-0 group-hover/shelf:-translate-y-px group-hover/shelf:opacity-100'
                )}
              />
            </CollapsibleTrigger>
          </div>
        </div>
      </div>
      {/* No negative margin here — a prior version pulled this up into
       * the header's own bottom padding to tighten the caption's spacing,
       * but that made "Change scene link" visually read as sitting
       * inside the header/chip zone (the hover-reactive "top part")
       * rather than belonging to this menu body. It starts in normal
       * flow, right after the header's own true bottom edge — that edge
       * alone (--spacing-md) is the entire gap now that no other source
       * stacks on top of it (no root-level gap, no GroupLabel top
       * padding), which reads as tight without the overlap.
       *
       * duration-[340ms] overrides the Collapsible primitive's own
       * default (200ms): the staggered cascade below can take longer than
       * that to fully enter/exit once there are more than a couple of
       * rows (e.g. 6 top-level children exiting bottom-up finishes around
       * 305ms — index 0's exit delay alone is (6-1)*35ms=175ms, plus its
       * own 130ms). If the panel's own height reached 0 before that, this
       * clips the still-animating earlier rows instead of letting them
       * finish — 340ms comfortably covers realistic menu sizes for this
       * component without needing to compute an exact per-instance value.
       *
       * Items are always rendered here (no `open &&` gate, no
       * AnimatePresence) — only their `animate` target changes between
       * "visible" and "hidden". See this file's top comment for why
       * conditionally mounting/unmounting them broke the exit animation.
       *
       * `keepMounted` is required for that to actually work: Base UI's
       * Panel defaults to `keepMounted={false}` — it doesn't render its
       * children *at all* until the first time it opens. Without this,
       * the motion.div items below only ever mount for the first time
       * already `open`, so `initial={false}` (needed to avoid animating
       * on every subsequent close→open remount) suppresses their very
       * first enter transition — items simply appeared at full opacity
       * instantly, no stagger, only on the *first* expand of a session. */}
      <CollapsibleContent keepMounted className="w-full px-[var(--spacing-sm)] duration-[340ms]">
        {childArray.map((child, index) => (
          <motion.div
            key={(child as { key?: React.Key }).key ?? index}
            variants={cascadeItemVariants(index, childArray.length, reducedMotion)}
            initial={false}
            animate={open ? 'visible' : 'hidden'}
          >
            {child}
          </motion.div>
        ))}
      </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export { PromptbarShelf };
