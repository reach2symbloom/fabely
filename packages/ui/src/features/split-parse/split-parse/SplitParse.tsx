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
 * `default`-state ("Parse here") text/icon rest at 0.6 alpha over
 * `--foreground` (quieter than Figma's flat black/white — this row is a
 * background affordance, not a primary action), going to full alpha on
 * hover/focus via a directional left-to-right activation sweep (not in
 * Figma, which shows no distinct hover swatch for this row) — see
 * `useSplitParseHover` below for the full choreography. The scissors icon
 * can't just carry that alpha on a translucent `currentColor` like a plain
 * `<g opacity>` swap would suggest, though: its blade paths cross at the
 * pivot, and a translucent stroke double-darkens wherever a shape overlaps
 * itself. Opaque `--foreground` + a separate animated `opacity` on a
 * nested `<g>` instead — same fix Icon Button's `fade` variant uses for
 * Plus/X (see its comment) — flattens the glyph to one shape before fading
 * it. Same reasoning gives the label its own explicit
 * `--foreground` + animated opacity, rather than inheriting a `color`
 * swap from the row (text has no self-overlap problem, but Motion can't
 * tween between two different CSS custom-property colors either way — see
 * `useSplitParseHover`'s comment for why opacity, not color, is the
 * animated value throughout).
 *
 * The dashed rule itself is a `repeating-linear-gradient`, not
 * `border-dashed` (CSS's native dashed border can't hit an exact dash/gap
 * length) — 6px dash / 6px gap per Figma's stroke settings.
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
/** Same dash geometry at full alpha — the hover sweep reveals this over the rest layer, left-to-right (see `useSplitParseHover`). */
const LINE_BRIGHT =
  'bg-[image:repeating-linear-gradient(to_right,var(--theme-alpha-black-switch-100)_0,var(--theme-alpha-black-switch-100)_6px,transparent_6px,transparent_12px)]';

/* ---------------------------------------------------------------------- */
/* Hover choreography (default-state row only)                            */
/* ---------------------------------------------------------------------- */
/*
 * A directional activation sweep, not a static hover swap — separate from,
 * and never touching, the click transition above. Hover-in (~360ms, inside
 * the requested 300-450ms):
 *
 *   0-100ms     scissors icon brightens (opacity 0.6 -> 1)
 *   60-210ms    left rule lights left-to-right
 *   170-280ms   "Parse here" brightens, as the left sweep nears its end
 *   200-360ms   right rule lights left-to-right in turn, completing the
 *               path all the way to the row's right edge
 *
 * Hover-out (~200ms, inside the requested 180-260ms) retreats faster and
 * in reverse — right rule first, then label, then left rule, then icon —
 * which, since each sweep's own clip-path formula unwinds from the same
 * edge it grew from, reads as the same activation reversing rather than a
 * different animation.
 */
const HOVER_IN_ICON_DURATION = 0.1;
const HOVER_IN_LEFT_SWEEP_DELAY = 0.06;
const HOVER_IN_LEFT_SWEEP_DURATION = 0.15;
const HOVER_IN_LABEL_DELAY = 0.17;
const HOVER_IN_LABEL_DURATION = 0.11;
const HOVER_IN_RIGHT_SWEEP_DELAY = 0.2;
const HOVER_IN_RIGHT_SWEEP_DURATION = 0.16;

const HOVER_OUT_RIGHT_SWEEP_DURATION = 0.09;
const HOVER_OUT_LABEL_DELAY = 0.03;
const HOVER_OUT_LABEL_DURATION = 0.08;
const HOVER_OUT_LEFT_SWEEP_DELAY = 0.05;
const HOVER_OUT_LEFT_SWEEP_DURATION = 0.09;
const HOVER_OUT_ICON_DELAY = 0.12;
const HOVER_OUT_ICON_DURATION = 0.08;

/**
 * Owns the `default`-state row's hover/focus activation sweep — entirely
 * separate from `useSplitParseTransition` above (different motion values,
 * never reads or writes them). Returns `handlePointerActivate`/
 * `handlePointerDeactivate` (wire to `onMouseEnter`/`onMouseLeave`) and
 * `handleFocusActivate`/`handleFocusDeactivate` (wire to `onFocus`/
 * `onBlur`) — kept as four separate handlers, not two shared ones, because
 * pointer and focus are tracked as independent booleans internally (see
 * `pointerOverRef`'s own comment for why), each only ever touching its own
 * flag; `syncActive` is what actually decides whether the sweep should be
 * running, from `pointerOver || focused`, so releasing one source doesn't
 * drop the lit state the other is still holding up.
 *
 * `active` is `state === 'default'` — while it's false, an effect jumps
 * every value straight to 0 (no animation) and resets both flags.
 * Without this, hovering the row, then clicking straight through to
 * `split-created` without the mouse ever leaving it, orphans the sweep
 * mid-flight: `default`'s hover handlers unmount with the click (they're
 * only wired in that state), so nothing ever calls a deactivate handler to
 * unwind it. `leftProgress`/`rightProgress` clip the whole sweep away
 * regardless while `split-created`, so it isn't visible *then* — but the
 * stale values were still sitting at ~1, so undo-ing back to `default`
 * rendered it already fully lit, as if still hovered.
 *
 * That mount-time reset only covers the *forward* edge, though. A second,
 * different cause of the same symptom sits on the *reverse* edge: undo
 * removes the button the pointer was resting on, and every further DOM
 * change the reverse transition makes at that same screen position over
 * its ~280ms run (the icon crossfading back to scissors, the label
 * crossfading back, either rule's layer swapping) can fire a real
 * `mouseenter` on the row with no actual pointer motion behind it —
 * empirically, more than one across that window, not a single event right
 * at the start. `handlePointerActivate` can't just check
 * `event.movementX`/`movementY` to catch these (a tempting first idea): a
 * browser-synthesized re-hover carries the *same* zero-movement signature
 * as a genuine one landing exactly where the cursor was already sitting —
 * real usage is dominated by the latter (the cursor moving onto the row,
 * not already resting on it), so the two aren't reliably distinguishable
 * event-by-event. Instead, a window right after `active` flips *true* —
 * set below, alongside the reset for flipping *false* — suppresses
 * activation entirely, sized to comfortably outlast the whole reverse
 * transition rather than just its first frame.
 */
/** Comfortably past the reverse transition's own ~280ms run (`REVERSE_LEFT_WIPE_DELAY` + `REVERSE_LEFT_WIPE_DURATION`, defined further down) — see the comment above for why it needs to span the whole thing, not just its first frame. */
const SUPPRESS_PHANTOM_HOVER_MS = 400;

function useSplitParseHover(active: boolean) {
  const prefersReducedMotion = useReducedMotion();
  const iconGlow = useMotionValue(0);
  const leftSweep = useMotionValue(0);
  const labelGlow = useMotionValue(0);
  const rightSweep = useMotionValue(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  /*
   * Pointer-over and focused are tracked as two independent, idempotent
   * booleans — *not* a shared increment/decrement counter. The phantom
   * re-hover this hook works around (see the comment above
   * `SUPPRESS_PHANTOM_HOVER_MS`) doesn't reliably fire exactly once per
   * genuine mouseleave; Chromium was observed firing it *twice* for a
   * single Undo click. A counter desyncs the moment activate/deactivate
   * calls for one source aren't 1:1 — e.g. two suppressed phantom
   * `mouseenter`s followed by one real `mouseleave` left a counter-based
   * version stuck at a nonzero count forever, silently swallowing every
   * hover after the first Undo for the rest of the row's life. Setting a
   * boolean `true` twice has no such failure mode.
   */
  const pointerOverRef = useRef(false);
  const focusedRef = useRef(false);
  const sweepActiveRef = useRef(false);
  const suppressPointerUntilRef = useRef(0);
  const hasMountedRef = useRef(false);

  const clearPending = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };
  useEffect(() => clearPending, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (active) {
      suppressPointerUntilRef.current = Date.now() + SUPPRESS_PHANTOM_HOVER_MS;
      return;
    }
    clearPending();
    pointerOverRef.current = false;
    focusedRef.current = false;
    sweepActiveRef.current = false;
    iconGlow.jump(0);
    leftSweep.jump(0);
    labelGlow.jump(0);
    rightSweep.jump(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const after = (fn: () => void, delaySeconds: number) => {
    timeoutsRef.current.push(setTimeout(fn, delaySeconds * 1000));
  };

  const runIn = () => {
    clearPending();
    if (prefersReducedMotion) {
      iconGlow.jump(1);
      leftSweep.jump(1);
      labelGlow.jump(1);
      rightSweep.jump(1);
      return;
    }
    animate(iconGlow, 1, { duration: HOVER_IN_ICON_DURATION, ease: EASE_EMPHASIZED });
    after(
      () => animate(leftSweep, 1, { duration: HOVER_IN_LEFT_SWEEP_DURATION, ease: EASE_EMPHASIZED }),
      HOVER_IN_LEFT_SWEEP_DELAY
    );
    after(
      () => animate(labelGlow, 1, { duration: HOVER_IN_LABEL_DURATION, ease: EASE_EMPHASIZED }),
      HOVER_IN_LABEL_DELAY
    );
    after(
      () => animate(rightSweep, 1, { duration: HOVER_IN_RIGHT_SWEEP_DURATION, ease: EASE_EMPHASIZED }),
      HOVER_IN_RIGHT_SWEEP_DELAY
    );
  };

  const runOut = () => {
    clearPending();
    if (prefersReducedMotion) {
      iconGlow.jump(0);
      leftSweep.jump(0);
      labelGlow.jump(0);
      rightSweep.jump(0);
      return;
    }
    animate(rightSweep, 0, { duration: HOVER_OUT_RIGHT_SWEEP_DURATION, ease: EASE_EMPHASIZED });
    after(
      () => animate(labelGlow, 0, { duration: HOVER_OUT_LABEL_DURATION, ease: EASE_EMPHASIZED }),
      HOVER_OUT_LABEL_DELAY
    );
    after(
      () => animate(leftSweep, 0, { duration: HOVER_OUT_LEFT_SWEEP_DURATION, ease: EASE_EMPHASIZED }),
      HOVER_OUT_LEFT_SWEEP_DELAY
    );
    after(
      () => animate(iconGlow, 0, { duration: HOVER_OUT_ICON_DURATION, ease: EASE_EMPHASIZED }),
      HOVER_OUT_ICON_DELAY
    );
  };

  /** Fires `runIn`/`runOut` only on a genuine false->true / true->false edge of `pointerOver || focused` — never twice in a row regardless of how many redundant activate/deactivate calls land on either source. */
  const syncActive = () => {
    const next = pointerOverRef.current || focusedRef.current;
    if (next === sweepActiveRef.current) return;
    sweepActiveRef.current = next;
    if (next) runIn();
    else runOut();
  };

  /*
   * See the `SUPPRESS_PHANTOM_HOVER_MS` comment above for why this is a
   * time window rather than an event-property check. Keyboard focus has
   * no such ambiguity — it's always genuine — so only this pointer path
   * checks it. Suppressed calls still record `pointerOverRef = true` (so
   * a later genuine `mouseleave` correctly clears it) but skip `syncActive`
   * entirely, rather than letting it run and then immediately reversing —
   * that would still flash the sweep on for one frame.
   */
  const handlePointerActivate = () => {
    pointerOverRef.current = true;
    if (Date.now() < suppressPointerUntilRef.current) return;
    syncActive();
  };
  const handleFocusActivate = () => {
    focusedRef.current = true;
    syncActive();
  };
  const handlePointerDeactivate = () => {
    pointerOverRef.current = false;
    syncActive();
  };
  const handleFocusDeactivate = () => {
    focusedRef.current = false;
    syncActive();
  };

  return {
    iconGlow,
    leftSweep,
    labelGlow,
    rightSweep,
    handlePointerActivate,
    handleFocusActivate,
    handlePointerDeactivate,
    handleFocusDeactivate,
  };
}

/* ---------------------------------------------------------------------- */
/* Transition choreography                                                */
/* ---------------------------------------------------------------------- */
/*
 * All values in seconds. Forward (Parse here -> Note parsed) sequence,
 * measured from click at t=0:
 *
 *   0.00       the undo icon's `16px` + gap footprint is reserved in the
 *              right rule's flex row immediately (`reserveUndoSlot`) —
 *              *not* the icon itself, just its layout space, so the right
 *              rule's flex-1 share is final-width for the rest of this
 *              sequence and never has to reflow narrower later
 *   0.00-0.18  scissors "snip" (its own AnimatePresence `exit` keyframes)
 *              + left rule begins wiping/cutting left-to-right
 *   0.00-0.22  left rule finishes; feeds directly into
 *   0.16       icon crossfades scissors -> check (fade/scale + pathLength
 *              draw on the checkmark only)
 *   0.20       label crossfades "Parse here" -> "Note parsed"
 *   0.20-0.42  right rule wipes left-to-right in turn, continuing the same
 *              travelling cut through to the row's right edge — growing
 *              directly to its resting length with no overshoot, since
 *              the space it's animating within has been final-width
 *              since 0.00
 *   0.42-0.58  undo icon fades/slides in (now that its space already
 *              exists), once the rule has fully resolved to solid so it
 *              isn't fading in against a mid-wipe line, and doesn't move
 *              the rule when it appears
 *
 * Total ~0.58s, inside the requested 450-600ms window. Reverse (undo) is
 * deliberately simpler/quicker — a "cancel," not a re-parse — with no
 * snip, but still one continuous cascade, not two rules retreating in
 * parallel: the solid line un-resolves as a single sequence, right side
 * first (where the cut finished), then left (back to where it started at
 * the scissors) — the same travelling-cut continuity as forward, reversed.
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

/** Right retreats first (cascade starts where the forward cut finished)... */
const REVERSE_RIGHT_WIPE_DURATION = 0.16;
/** ...then left picks up before right fully finishes, so the cascade reads as one continuous unwind rather than two separate moves. */
const REVERSE_LEFT_WIPE_DELAY = 0.12;
const REVERSE_LEFT_WIPE_DURATION = 0.16;
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
  /**
   * Whether the undo icon's `16px` + gap footprint is reserved in the
   * right rule's flex row — *not* the same thing as `showUndo` (which
   * gates the icon's own visibility). Forward: true from the first
   * instant of the click (`isParsed` itself already flips synchronously
   * then, so this just mirrors it), so the right rule's flex-1 share is
   * final-width from the start and never has to reflow narrower once the
   * icon actually fades in near the end. Reverse: stays true until the
   * cascade (both rules) has fully settled back to rest, rather than
   * dropping the instant `isParsed` goes false — dropping it early would
   * widen the rule out from under the icon mid-exit.
   */
  const [reserveUndoSlot, setReserveUndoSlot] = useState(isParsed);

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
      setReserveUndoSlot(isParsed);
      return;
    }

    if (isParsed) {
      setReserveUndoSlot(true);
      animate(leftProgress, 1, { duration: LEFT_WIPE_DURATION, ease: EASE_EMPHASIZED });
      after(() => setIcon('check'), ICON_SWAP_DELAY_FWD);
      after(() => setLabel('parsed'), LABEL_SWAP_DELAY_FWD);
      after(() => {
        animate(rightProgress, 1, { duration: RIGHT_WIPE_DURATION, ease: EASE_EMPHASIZED });
      }, RIGHT_WIPE_DELAY_FWD);
      after(() => setShowUndo(true), UNDO_DELAY_FWD);
    } else {
      setShowUndo(false);
      // Cascade, not parallel: right retreats first (where the forward
      // cut finished), left picks up before right is fully done so the
      // two read as one continuous unwind back to the scissors.
      animate(rightProgress, 0, { duration: REVERSE_RIGHT_WIPE_DURATION, ease: EASE_EMPHASIZED });
      after(() => {
        animate(leftProgress, 0, { duration: REVERSE_LEFT_WIPE_DURATION, ease: EASE_EMPHASIZED });
      }, REVERSE_LEFT_WIPE_DELAY);
      after(() => setIcon('scissors'), REVERSE_CROSSFADE_DELAY);
      after(() => setLabel('parse'), REVERSE_CROSSFADE_DELAY);
      after(
        () => setReserveUndoSlot(false),
        REVERSE_LEFT_WIPE_DELAY + REVERSE_LEFT_WIPE_DURATION
      );
    }

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return {
    leftProgress,
    rightProgress,
    icon,
    label,
    showUndo,
    reserveUndoSlot,
    prefersReducedMotion,
    isParsed,
  };
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
 *
 * A third layer, `hoverSweep`, nests *inside* the dashed one — a
 * full-alpha copy of the same dash pattern, revealed left-to-right by its
 * own `clip-path` (see `useSplitParseHover`). Nesting (rather than a
 * sibling layer) means it's automatically cropped by the dashed layer's
 * own clip too, so it can never show through once `progress` has moved
 * the row past the dashed state. Always rendered, on every row this
 * component draws — at `hoverSweep=0` (its resting value whenever hover
 * isn't wired, e.g. the `split-created` row's lines) it's fully clipped
 * away and costs nothing visually.
 */
function TransformingLine({
  progress,
  hoverSweep,
}: {
  progress: MotionValue<number>;
  hoverSweep: MotionValue<number>;
}) {
  const dashedClip = useTransform(progress, (p) => `inset(0 0 0 ${p * 100}%)`);
  const solidClip = useTransform(progress, (p) => `inset(0 ${(1 - p) * 100}% 0 0)`);
  const hoverClip = useTransform(hoverSweep, (p) => `inset(0 ${(1 - p) * 100}% 0 0)`);

  return (
    <span
      data-slot="split-parse-line"
      className="relative h-[length:var(--stroke-thin)] min-w-0 flex-1"
    >
      <motion.span aria-hidden style={{ clipPath: dashedClip }} className="absolute inset-0">
        <span aria-hidden className={cn('absolute inset-0', LINE_REST)} />
        <motion.span
          aria-hidden
          style={{ clipPath: hoverClip }}
          className={cn('absolute inset-0', LINE_BRIGHT)}
        />
      </motion.span>
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
  const {
    leftProgress,
    rightProgress,
    icon,
    label,
    showUndo,
    reserveUndoSlot,
    prefersReducedMotion,
    isParsed,
  } = useSplitParseTransition(state);
  const {
    iconGlow,
    leftSweep,
    labelGlow,
    rightSweep,
    handlePointerActivate,
    handleFocusActivate,
    handlePointerDeactivate,
    handleFocusDeactivate,
  } = useSplitParseHover(state === 'default');
  const iconGlowOpacity = useTransform(iconGlow, [0, 1], [0.6, 1]);
  const labelGlowOpacity = useTransform(labelGlow, [0, 1], [0.6, 1]);

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
      onMouseEnter={state === 'default' ? handlePointerActivate : undefined}
      onMouseLeave={state === 'default' ? handlePointerDeactivate : undefined}
      onFocus={state === 'default' ? handleFocusActivate : undefined}
      onBlur={state === 'default' ? handleFocusDeactivate : undefined}
      className={cn(
        state === 'default' && 'cursor-pointer',
        state === 'default'
          ? 'text-[color:var(--muted-foreground)]'
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
                 * already Motion-controlled (mount/exit, 0<->1); an inline
                 * style always beats a CSS rule on the *same* element, so
                 * the two can't share one node. `iconGlowOpacity` (part of
                 * the hover sweep, `useSplitParseHover`) composes with the
                 * outer opacity multiplicatively instead — rest = 1×0.6,
                 * hovered = 1×1, mid-exit = (fading)×0.6.
                 */}
                <motion.g style={{ opacity: iconGlowOpacity }}>
                  <circle cx={6} cy={6} r={3} />
                  <path d="M8.12 8.12 12 12" />
                  <path d="M20 4 8.12 15.88" />
                  <circle cx={6} cy={18} r={3} />
                  <path d="M14.8 14.8 20 20" />
                </motion.g>
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
        <TransformingLine progress={leftProgress} hoverSweep={leftSweep} />
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
            {label === 'parse' ? (
              /*
               * Same nested-opacity composition as the scissors' `<g>`
               * above: this span's own opacity is the hover glow
               * (0.6->1), independent of the outer crossfade span's own
               * mount/unmount opacity (0<->1) — the two multiply rather
               * than fight over one property.
               */
              <motion.span
                className="text-[color:var(--foreground)]"
                style={{ opacity: labelGlowOpacity }}
              >
                Parse here
              </motion.span>
            ) : (
              'Note parsed'
            )}
          </motion.span>
        </AnimatePresence>
      </span>

      <span className="flex min-w-0 flex-1 items-center gap-[var(--spacing-xs)]">
        <TransformingLine progress={rightProgress} hoverSweep={rightSweep} />
        {/*
         * Fixed-size reservation, present for the whole transition (see
         * `reserveUndoSlot`'s own comment) — not just while `showUndo` is
         * true. Without this, the right rule's `flex-1` share had the
         * *entire* row width to itself while wiping, then had to give up
         * this box's width the instant the icon appeared, snapping the
         * rule's own final edge backward. Reserving it from the start
         * means `rightProgress` animates against the *same* final width
         * throughout, so the rule grows directly to its resting length
         * with no overshoot-and-retract. The icon itself still only
         * fades/slides in late (`showUndo`) — only the space is early.
         */}
        {reserveUndoSlot && (
          <span className="relative size-[length:var(--icon-sm)] shrink-0">
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
                  className="absolute inset-0 size-[length:var(--icon-sm)] rounded-[length:var(--rounded-lg)] p-0"
                >
                  <Undo2Icon aria-hidden className="size-[length:var(--icon-sm)]" />
                </MotionIconButton>
              )}
            </AnimatePresence>
          </span>
        )}
      </span>
    </div>
  );
}

export { SplitParse, type SplitParseProps, type SplitParseState };
