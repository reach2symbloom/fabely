/**
 * Fabely Bookmark Icon Button — bare icon toggle, no button chrome (no fill
 * container, no roundness, no ghost/outline skin). Three states only:
 * unselected `alpha-20` (stroke) → unselected hover `alpha-50` (stroke) →
 * selected `primary` (a genuinely filled glyph, not just recolored).
 *
 * Entering selected plays a one-shot, restrained "captured" celebration —
 * a quick icon scale pop plus a handful of tiny sparks radiating from
 * behind the glyph — never on the reverse (unselecting), which is a plain
 * unfill. See the README for the full rationale.
 *
 * Composes the headless Base UI Toggle primitive directly (not the styled
 * [Toggle](../../primitives/toggle/README.md) atom — that one carries pill
 * chrome this control deliberately has none of).
 * Visual source: Figma **Bookmark Icon Button**
 * ([Bookmark Icon Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16066-5970)
 * `16066:5970`).
 */
'use client';

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { BookmarkIcon } from 'lucide-react';
import { motion, useAnimate, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { EASE_EMPHASIZED } from '@/lib/motion';
import { useSuperscript } from '@/hooks/use-superscript';
import { cn } from '@/lib/utils';

type BookmarkIconButtonSize = 'sm' | 'default' | 'lg';

const ICON_SIZE: Record<BookmarkIconButtonSize, string> = {
  sm: 'size-[length:var(--icon-sm)]',
  default: 'size-[length:var(--icon-md)]',
  lg: 'size-[length:var(--icon-lg)]',
};

/** 7-way, not an even count — avoids the axis-aligned symmetry a square/
 * hexagon reads as "mechanical"; an odd spread reads more like a sparkle. */
const SPARK_ANGLES = [0, 51, 103, 154, 206, 257, 309];
/** Three size tiers, cycled by index, so the burst isn't one uniform ring —
 * bigger sparks also travel slightly further, both within the 12–16px ask. */
const SPARK_TIERS = [
  { width: 2, height: 6, travel: 12 },
  { width: 2.5, height: 8, travel: 14 },
  { width: 3, height: 10, travel: 16 },
];
const SPARK_DURATION_S = 0.22;
const SPARK_BASE_DELAY_S = 0.11; // syncs the burst to the pop's first (biggest) peak
const SPARK_STAGGER_S = 0.015; // slight — gives the burst life, not a scatter
const POP_DURATION_S = 0.4;

/**
 * Tiny radial burst behind the glyph — pure Motion + CSS, no particle
 * dependency. Each spark is a static-rotated wrapper (sets its outward
 * direction) around a `motion.span` that only ever animates its own
 * local `y` + `opacity`, so no per-spark trig is needed: rotating the
 * parent first means "move up" in the child's local space already points
 * radially outward at that angle. Delayed to fire around the icon pop's
 * peak (~30% into `POP_DURATION_S`), not at the click itself, and lightly
 * staggered per-spark so the burst reads as one small event, not a single
 * static frame.
 */
function SparkBurst({ onSettled }: { onSettled: () => void }) {
  const lastIndex = SPARK_ANGLES.length - 1;
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-visible"
    >
      {SPARK_ANGLES.map((angle, i) => {
        const tier = SPARK_TIERS[i % SPARK_TIERS.length];
        return (
          <span
            key={angle}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ rotate: `${angle}deg` }}
          >
            <motion.span
              className="block rounded-[length:var(--rounded-full)] bg-[var(--primary)]"
              style={{ width: tier.width, height: tier.height }}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -tier.travel, opacity: 0 }}
              transition={{
                duration: SPARK_DURATION_S,
                delay: SPARK_BASE_DELAY_S + i * SPARK_STAGGER_S,
                ease: EASE_EMPHASIZED,
              }}
              onAnimationComplete={i === lastIndex ? onSettled : undefined}
            />
          </span>
        );
      })}
    </span>
  );
}

type BookmarkIconButtonProps = Omit<TogglePrimitive.Props, 'children'> & {
  /** Glyph size — `--icon-sm` / `--icon-md` / `--icon-lg`. */
  size?: BookmarkIconButtonSize;
  /** Figma `Show superscript` — badge only renders while pressed. */
  showSuperscript?: boolean;
  /** Badge content when `showSuperscript` is active. Figma default is "2". */
  superscriptValue?: ReactNode;
  /** Storybook / playground — lock hover paint without a pointer. */
  forceHover?: boolean;
  /**
   * Extra content rendered inside this same button, after the glyph — e.g. a
   * composite wrapping this atom with a revealed label that should share its
   * click target and cursor, not sit as an inert sibling next to it.
   */
  trailingContent?: ReactNode;
};

function BookmarkIconButton({
  className,
  size = 'default',
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  showSuperscript = false,
  superscriptValue = 2,
  forceHover = false,
  trailingContent,
  'aria-label': ariaLabelProp,
  ...props
}: BookmarkIconButtonProps) {
  const isControlled = pressedProp !== undefined;
  const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed);
  const pressed = isControlled ? Boolean(pressedProp) : uncontrolledPressed;

  const handlePressedChange: NonNullable<TogglePrimitive.Props['onPressedChange']> = (
    next,
    eventDetails
  ) => {
    if (!isControlled) {
      setUncontrolledPressed(next);
    }
    onPressedChange?.(next, eventDetails);
  };

  const ariaLabel =
    ariaLabelProp ?? (pressed ? 'Remove bookmark' : 'Bookmark');

  const superscriptVisible = useSuperscript({ show: showSuperscript, active: pressed });
  const prefersReducedMotion = useReducedMotion();

  const [iconScope, animateIcon] = useAnimate();
  const [showBurst, setShowBurst] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const wasPressedRef = useRef(pressed);

  /* Celebrate only on the unselected → selected edge, never on mount and
   * never on the reverse — "removing from scene" is a plain unfill via
   * the existing CSS color transition below, untouched. */
  useEffect(() => {
    const justSelected = pressed && !wasPressedRef.current;
    wasPressedRef.current = pressed;
    if (!justSelected) return;

    if (prefersReducedMotion) {
      /* State still changes (fill/stroke CSS transition), just no pop, no sparks. */
      return;
    }

    /* Overshoot past 1, undershoot slightly, settle — reads as a crisp
     * "landed" confirmation rather than a bounce. Peaks early (30%) so
     * the spark burst's own delay can fire right at that crest. */
    animateIcon(
      iconScope.current,
      { scale: [1, 1.2, 0.96, 1] },
      { duration: POP_DURATION_S, ease: EASE_EMPHASIZED, times: [0, 0.3, 0.65, 1] }
    );
    setBurstKey((key) => key + 1);
    setShowBurst(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pressed]);

  return (
    <TogglePrimitive
      data-slot="bookmark-icon-button"
      data-force-hover={forceHover || undefined}
      {...props}
      pressed={isControlled ? pressedProp : undefined}
      defaultPressed={isControlled ? undefined : defaultPressed}
      onPressedChange={handlePressedChange}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center',
        'bg-transparent border-0 p-0 outline-none select-none',
        'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
        'disabled:pointer-events-none disabled:opacity-50',
        /* Figma 16066:5970 — unselected alpha-20 → alpha-50 hover; selected primary. */
        'text-[color:var(--theme-alpha-black-switch-20)]',
        'not-data-pressed:not-aria-pressed:hover:text-[color:var(--theme-alpha-black-switch-50)]',
        'not-data-pressed:not-aria-pressed:data-[force-hover=true]:text-[color:var(--theme-alpha-black-switch-50)]',
        'data-pressed:text-[color:var(--primary)]',
        'aria-pressed:text-[color:var(--primary)]',
        '[&_svg]:transition-colors',
        '[&_svg]:duration-[var(--duration-fast)]',
        '[&_svg]:ease-[var(--ease-emphasized)]',
        className
      )}
    >
      <span className="relative inline-flex">
        {showBurst && (
          <SparkBurst key={burstKey} onSettled={() => setShowBurst(false)} />
        )}
        {/* Scale only — color/fill still comes from the CSS `transition-colors`
         * above (unchanged), not from Motion. `ref` is the useAnimate scope
         * the celebration pop imperatively targets on the selecting edge;
         * otherwise this span just sits at rest (scale 1). */}
        <motion.span ref={iconScope} className="relative z-10 inline-flex">
          <BookmarkIcon
            aria-hidden
            className={ICON_SIZE[size]}
            fill={pressed ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={pressed ? 0 : 2}
          />
        </motion.span>
        {superscriptVisible && (
          <span
            aria-hidden
            className={cn(
              /* Figma 16231:7082/7091 — Superscript, offset from the Icon box. */
              'absolute -top-2 left-4',
              'flex items-center justify-center',
              'px-[length:var(--spacing-2xs)] py-[length:var(--spacing-3xs)]',
              'font-[family-name:var(--text-paragraph-mini-medium-font-family)]',
              '[font-weight:var(--text-paragraph-mini-medium-font-weight)]',
              'text-[10px] leading-[var(--text-paragraph-mini-medium-line-height)]',
              'tracking-[var(--text-paragraph-mini-medium-letter-spacing)]',
              'text-[color:var(--muted-foreground)]',
              'whitespace-nowrap'
            )}
          >
            {superscriptValue}
          </span>
        )}
      </span>
      {trailingContent}
    </TogglePrimitive>
  );
}

export {
  BookmarkIconButton,
  type BookmarkIconButtonProps,
  type BookmarkIconButtonSize,
};
