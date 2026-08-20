/**
 * Split & Parse — an inline manuscript-editor row: click to mark a split
 * point ("Parse here"), which flips to a confirmation row ("Note parsed")
 * with an undo trigger. Icon fused to a rule on the left; a second rule
 * fills the right, so the label always reads centered in whatever width
 * the row hugs.
 *
 * Figma's `mode` prop ("Light"/"Dark") is the app's own light/dark theme,
 * not a separate axis — no `mode`/`surface` prop here. "Note parsed" uses
 * the Ginseng pantone with a `dark:` override to its lighter tint (Figma
 * has no switch token for it). An earlier pass invented a
 * `surface: 'default' | 'primary'` prop instead — wrong: it decoupled the
 * Ginseng color (manually chosen) from `--foreground` (auto-switching), so
 * the two could desync depending on which prop value a caller picked vs.
 * the app's actual theme. Removed.
 *
 * `default`-state ("Parse here") text/icon rest at `--muted-foreground`
 * (quieter than Figma's flat black/white — this row is a background
 * affordance, not a primary action), going to full alpha (`--foreground`)
 * on hover/focus — same hover-to-full-alpha treatment as the dashed rule,
 * so text and rule read as one control brightening together. The scissors
 * icon can't just inherit that translucent color via `currentColor` like
 * the label does, though: its blade paths cross at the pivot, and a
 * translucent stroke double-darkens wherever a shape overlaps itself.
 * Opaque `--foreground` + a separate `opacity-60→100` on the `<svg>`
 * instead — same fix Icon Button's `fade` variant uses for Plus/X (see its
 * comment) — flattens the glyph to one shape before fading it.
 *
 * The dashed rule itself is a `repeating-linear-gradient`, not
 * `border-dashed` (CSS's native dashed border can't hit an exact dash/gap
 * length) — 6px dash / 6px gap per Figma's stroke settings. Hover state
 * itself isn't in Figma (which shows no distinct hover swatch for this
 * row) — reasoned as a legible affordance an inert-looking row shouldn't
 * lack.
 *
 * `split-created`-state ("Note parsed") rule is solid, not dashed — also
 * not in Figma (which keeps the same dash there) — in the Fia brand color
 * (`--tw-raw-fia-200`, same token Badge's `fia` variant uses), reading as a
 * confirmed/settled state contrasted against the still-pending dashed rule.
 *
 * The `default`↔`split-created` transition is Motion-animated (not in
 * Figma, which only specifies the two resting states) — see the
 * `useSplitParseTransition` hook below for the full choreography and its
 * rationale. Root is a `<div>` in both states, not a `<button>`: the
 * `split-created` state nests a real `<button>` (the undo trigger), and a
 * `<button>` can never validly contain another `<button>`. A stable root
 * element is also what makes the transition animatable at all — swapping
 * element types would force React to unmount and recreate the whole
 * subtree instead of animating between two renders of it. `default`'s
 * clickability is `role="button"` + keyboard handling on that same div,
 * not a nested real button.
 *
 * Visual source: Figma **Split & parse**
 * ([node](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16095-208)
 * `16095:208`).
 */
'use client';

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Undo2Icon } from 'lucide-react';

import { EASE_EMPHASIZED } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { IconButton } from '@/primitives/button/icon-button';

type SplitParseState = 'default' | 'split-created';

const LABEL_TYPE = [
  'shrink-0 whitespace-nowrap text-center',
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-medium)]',
  'text-[length:var(--text-paragraph-mini-medium-font-size)]',
  'leading-[var(--text-paragraph-mini-medium-line-height)]',
  'tracking-[var(--text-paragraph-mini-medium-letter-spacing)]',
].join(' ');

/* Figma stroke settings: Dashed, Dash 6, Gap 6, butt cap — a
 * `repeating-linear-gradient` reproduces that exactly (flat-ended 6px
 * segments); `border-dashed` cannot hit a specific dash/gap length. */
const LINE_REST =
  'bg-[image:repeating-linear-gradient(to_right,var(--theme-alpha-black-switch-10)_0,var(--theme-alpha-black-switch-10)_6px,transparent_6px,transparent_12px)]';
/** Deepens to full alpha on hover of the interactive (`default`-state) row only. */
const LINE_HOVER =
  'group-hover:bg-[image:repeating-linear-gradient(to_right,var(--theme-alpha-black-switch-100)_0,var(--theme-alpha-black-switch-100)_6px,transparent_6px,transparent_12px)]';

/* ---------------------------------------------------------------------- */
/* Transition choreography                                                */
/* ---------------------------------------------------------------------- */
/*
 * All values in seconds. Forward (Parse here -> Note parsed) sequence,
 * measured from click at t=0:
 *
 *   0.00-0.18  scissors "snip" (its own AnimatePresence `exit` keyframes)
 *              + left rule begins wiping/cutting left-to-right
 *   0.00-0.22  left rule finishes; feeds directly into
 *   0.16       icon crossfades scissors -> check (fade/scale + pathLength
 *              draw on the checkmark only)
 *   0.20       label crossfades "Parse here" -> "Note parsed"
 *   0.20-0.42  right rule wipes left-to-right in turn, continuing the same
 *              travelling cut through to the row's right edge
 *   0.42-0.58  undo icon fades/slides in, once the rule has fully resolved
 *              to solid so it isn't fading in against a mid-wipe line
 *
 * Total ~0.58s, inside the requested 450-600ms window. Reverse (undo) is
 * deliberately simpler/quicker — a "cancel," not a re-parse — with no snip
 * and both rules retreating together rather than travelling in sequence.
 */
const SNIP_EXIT_DURATION = 0.18;
const ICON_SWAP_DURATION = 0.22;
const ICON_SWAP_DELAY_FWD = 0.16;
const CHECK_DRAW_DURATION = 0.16;
const CHECK_DRAW_DELAY_FWD = 0.22;
const LABEL_SWAP_DURATION = 0.18;
const LABEL_SWAP_DELAY_FWD = 0.2;
const LEFT_WIPE_DURATION = 0.22;
const RIGHT_WIPE_DURATION = 0.22;
const RIGHT_WIPE_DELAY_FWD = 0.2;
const UNDO_DELAY_FWD = 0.42;
const UNDO_DURATION = 0.18;

const REVERSE_WIPE_DURATION = 0.28;
const REVERSE_CROSSFADE_DURATION = 0.16;
const REVERSE_CROSSFADE_DELAY = 0.04;
const REVERSE_UNDO_DURATION = 0.1;

type IconKind = 'scissors' | 'check';
type LabelKind = 'parse' | 'parsed';

/**
 * Owns the whole `default` <-> `split-created` transition: two rule
 * "wipe" progress values (left segment, then right — the travelling-cut
 * continuity the row asks for) plus the staggered icon/label/undo swaps
 * that ride alongside them. `state` is a controlled prop, so this only
 * fires on genuine *changes* to it (a ref guards the first render) —
 * mounting directly into either state must render it at rest, with
 * nothing animating in.
 */
function useSplitParseTransition(state: SplitParseState) {
  const prefersReducedMotion = useReducedMotion();
  const isParsed = state === 'split-created';

  const leftProgress = useMotionValue(isParsed ? 1 : 0);
  const rightProgress = useMotionValue(isParsed ? 1 : 0);
  const [icon, setIcon] = useState<IconKind>(isParsed ? 'check' : 'scissors');
  const [label, setLabel] = useState<LabelKind>(isParsed ? 'parsed' : 'parse');
  const [showUndo, setShowUndo] = useState(isParsed);

  const hasMountedRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const after = (fn: () => void, delaySeconds: number) => {
      if (delaySeconds <= 0) {
        fn();
        return;
      }
      timeoutsRef.current.push(setTimeout(fn, delaySeconds * 1000));
    };

    if (prefersReducedMotion) {
      leftProgress.jump(isParsed ? 1 : 0);
      rightProgress.jump(isParsed ? 1 : 0);
      setIcon(isParsed ? 'check' : 'scissors');
      setLabel(isParsed ? 'parsed' : 'parse');
      setShowUndo(isParsed);
      return;
    }

    if (isParsed) {
      animate(leftProgress, 1, { duration: LEFT_WIPE_DURATION, ease: EASE_EMPHASIZED });
      after(() => setIcon('check'), ICON_SWAP_DELAY_FWD);
      after(() => setLabel('parsed'), LABEL_SWAP_DELAY_FWD);
      after(() => {
        animate(rightProgress, 1, { duration: RIGHT_WIPE_DURATION, ease: EASE_EMPHASIZED });
      }, RIGHT_WIPE_DELAY_FWD);
      after(() => setShowUndo(true), UNDO_DELAY_FWD);
    } else {
      setShowUndo(false);
      animate(leftProgress, 0, { duration: REVERSE_WIPE_DURATION, ease: EASE_EMPHASIZED });
      animate(rightProgress, 0, { duration: REVERSE_WIPE_DURATION, ease: EASE_EMPHASIZED });
      after(() => setIcon('scissors'), REVERSE_CROSSFADE_DELAY);
      after(() => setLabel('parse'), REVERSE_CROSSFADE_DELAY);
    }

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return { leftProgress, rightProgress, icon, label, showUndo, prefersReducedMotion, isParsed };
}

/**
 * One rule, two stacked layers (dashed + solid) whose complementary
 * `clip-path`s are driven by the same `progress` value — at 0 only the
 * dashed layer shows, at 1 only the solid, and animating between them
 * reads as the solid line "growing into place" from the left while the
 * dashed one is "cut away" ahead of it, not a crossfade. Same component
 * for both resting states and the transition between them: at rest
 * `progress` just sits at 0 or 1, no different from the plain dashed/solid
 * rules this replaced.
 */
function TransformingLine({
  progress,
  interactive = false,
}: {
  progress: MotionValue<number>;
  interactive?: boolean;
}) {
  const dashedClip = useTransform(progress, (p) => `inset(0 0 0 ${p * 100}%)`);
  const solidClip = useTransform(progress, (p) => `inset(0 ${(1 - p) * 100}% 0 0)`);

  return (
    <span
      data-slot="split-parse-line"
      className="relative h-[length:var(--stroke-thin)] min-w-0 flex-1"
    >
      <motion.span
        aria-hidden
        style={{ clipPath: dashedClip }}
        className={cn(
          'absolute inset-0',
          'transition-[background-image] duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
          LINE_REST,
          interactive && LINE_HOVER
        )}
      />
      <motion.span
        aria-hidden
        style={{ clipPath: solidClip }}
        className="absolute inset-0 bg-[color:var(--tw-raw-fia-200)]"
      />
    </span>
  );
}

const MotionIconButton = motion.create(IconButton);

/** Lucide's own defaults (`defaultAttributes.js`) — kept identical so a hand-built icon matches every other Lucide glyph in the app. */
const LUCIDE_SVG_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/**
 * Hand-built, not `<CircleCheckIcon />` — Motion's `pathLength` draw-in
 * needs a `motion.path` of its own; Lucide's pre-built icon components
 * don't expose their child paths individually. Path data is Lucide's own
 * `circle-check` node (`circle cx=12 cy=12 r=10` + `path d="m9 12 2 2 4-4"`)
 * copied verbatim, so this remains pixel-identical to the real icon.
 */
function AnimatedCheckIcon({
  drawDelay,
  drawDuration,
  reduceMotion,
}: {
  drawDelay: number;
  drawDuration: number;
  reduceMotion: boolean;
}) {
  return (
    <>
      <circle cx={12} cy={12} r={10} />
      <motion.path
        d="m9 12 2 2 4-4"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: drawDuration, delay: drawDelay, ease: 'easeOut' }
        }
      />
    </>
  );
}

type SplitParseProps = {
  /** `'default'` ("Parse here", clickable) or `'split-created'` ("Note parsed", with an undo trigger). */
  state?: SplitParseState;
  /** Fires when the `default`-state row is clicked. */
  onParse?: () => void;
  /** Fires when the `split-created`-state undo trigger is clicked. */
  onUndo?: () => void;
  className?: string;
};

function SplitParse({ state = 'default', onParse, onUndo, className }: SplitParseProps) {
  const { leftProgress, rightProgress, icon, label, showUndo, prefersReducedMotion, isParsed } =
    useSplitParseTransition(state);

  const rowClassName = cn(
    'flex w-full items-center gap-[var(--spacing-xs)]',
    'pt-[var(--spacing-2xs)] pb-[var(--spacing-3xs)]',
    className
  );

  const iconCrossfade = prefersReducedMotion
    ? { duration: 0 }
    : { duration: ICON_SWAP_DURATION, ease: EASE_EMPHASIZED };
  const labelCrossfade = prefersReducedMotion
    ? { duration: 0 }
    : { duration: isParsed ? LABEL_SWAP_DURATION : REVERSE_CROSSFADE_DURATION, ease: EASE_EMPHASIZED };
  const undoTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: isParsed ? UNDO_DURATION : REVERSE_UNDO_DURATION, ease: EASE_EMPHASIZED };
  const snipExit = prefersReducedMotion
    ? { opacity: 0, transition: { duration: 0 } }
    : {
        opacity: 0,
        rotate: [0, -14, 12, 0],
        scale: [1, 0.88, 1.05, 0.7],
        transition: { duration: SNIP_EXIT_DURATION, ease: EASE_EMPHASIZED },
      };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onParse?.();
  };

  return (
    <div
      data-slot="split-parse"
      data-state={state}
      role={state === 'default' ? 'button' : undefined}
      tabIndex={state === 'default' ? 0 : undefined}
      aria-label={state === 'default' ? 'Parse here' : undefined}
      onClick={state === 'default' ? onParse : undefined}
      onKeyDown={state === 'default' ? handleKeyDown : undefined}
      className={cn(
        'group',
        state === 'default' && 'cursor-pointer',
        'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
        state === 'default'
          ? 'text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] focus-visible:text-[color:var(--foreground)]'
          : 'text-[color:var(--tw-raw-pantones-ginseng)] dark:text-[color:var(--tw-raw-pantones-ginseng-light)]',
        rowClassName
      )}
    >
      <span className="flex min-w-0 flex-1 items-center gap-[var(--spacing-3xs)]">
        <span className="relative flex size-[length:var(--icon-md)] shrink-0 items-center justify-center">
          <AnimatePresence initial={false}>
            {icon === 'scissors' ? (
              <motion.svg
                key="scissors"
                {...LUCIDE_SVG_PROPS}
                className="absolute inset-0 size-full text-[color:var(--foreground)]"
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={snipExit}
                transition={iconCrossfade}
              >
                {/*
                 * Rest/hover muting lives on this inner `<g>`, not the
                 * `motion.svg` above — that element's own `opacity` is
                 * already Motion-controlled (mount/exit, 0<->1); CSS
                 * opacity on a nested `<g>` composes multiplicatively
                 * with it instead of fighting over the same inline style
                 * (an inline style always beats a CSS `:hover` rule on
                 * the same element, so the two can't share one node).
                 */}
                <g className="opacity-60 transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-emphasized)] group-hover:opacity-100 group-focus-visible:opacity-100">
                  <circle cx={6} cy={6} r={3} />
                  <path d="M8.12 8.12 12 12" />
                  <path d="M20 4 8.12 15.88" />
                  <circle cx={6} cy={18} r={3} />
                  <path d="M14.8 14.8 20 20" />
                </g>
              </motion.svg>
            ) : (
              <motion.svg
                key="check"
                {...LUCIDE_SVG_PROPS}
                className="absolute inset-0 size-full"
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.6, transition: iconCrossfade }}
                transition={iconCrossfade}
              >
                <AnimatedCheckIcon
                  drawDelay={Math.max(0, CHECK_DRAW_DELAY_FWD - ICON_SWAP_DELAY_FWD)}
                  drawDuration={CHECK_DRAW_DURATION}
                  reduceMotion={!!prefersReducedMotion}
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </span>
        <TransformingLine progress={leftProgress} interactive={state === 'default'} />
      </span>

      <span className="relative grid shrink-0 place-items-center">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={label}
            className={cn(LABEL_TYPE, 'col-start-1 row-start-1')}
            initial={prefersReducedMotion ? false : { opacity: 0, y: isParsed ? 3 : -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, y: isParsed ? -3 : 3, transition: labelCrossfade }
            }
            transition={labelCrossfade}
          >
            {label === 'parse' ? 'Parse here' : 'Note parsed'}
          </motion.span>
        </AnimatePresence>
      </span>

      <span className="flex min-w-0 flex-1 items-center gap-[var(--spacing-xs)]">
        <TransformingLine progress={rightProgress} />
        <AnimatePresence>
          {showUndo && (
            <MotionIconButton
              key="undo"
              variant="fade"
              size="mini"
              aria-label="Undo split"
              onClick={onUndo}
              initial={prefersReducedMotion ? false : { opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, x: 4, transition: undoTransition }
              }
              transition={undoTransition}
              className="size-[length:var(--icon-sm)] shrink-0 rounded-[length:var(--rounded-lg)] p-0"
            >
              <Undo2Icon aria-hidden className="size-[length:var(--icon-sm)]" />
            </MotionIconButton>
          )}
        </AnimatePresence>
      </span>
    </div>
  );
}

export { SplitParse, type SplitParseProps, type SplitParseState };
