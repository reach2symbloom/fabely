/**
 * Shared "captured" celebration for icon toggles that select something into
 * a persistent state (Bookmark Icon Button, Pin Icon Button) — a quick icon
 * scale pop plus a handful of tiny star/glint particles emerging from
 * behind the glyph, fired once on the unselected→selected edge only.
 * Deselecting stays a plain, uncelebrated color/fill transition;
 * celebrating a *removal* would read backwards. One shared implementation
 * (not two copies) so both controls stay on "the same timing language" by
 * construction, not by convention.
 *
 * Pure Motion + Lucide's `Sparkle` glyph (already a dependency elsewhere in
 * this codebase) — no particle/confetti library. Absolutely positioned,
 * `pointer-events-none`, and stacked *behind* the glyph (`z-0` vs the
 * glyph's `z-10`), so it never affects layout/hit targets and the icon
 * stays visually on top throughout. Unmounts itself once the last star's
 * own animation completes.
 */
'use client';

import { Sparkle } from 'lucide-react';
import { motion, useAnimate, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { EASE_EMPHASIZED, EASE_OUT } from '@/lib/motion';

/** Overshoot past 1, undershoot slightly, settle — crisp "landed", not a bounce. */
const POP_KEYFRAMES = [1, 1.2, 0.96, 1];
const POP_TIMES = [0, 0.3, 0.65, 1];
const POP_DURATION_S = 0.4;

/** 5-way, not an even count — avoids the axis-aligned symmetry a square/
 * hexagon reads as "mechanical"; an odd spread reads more like a glint
 * scatter. Each angle gets a slightly different radius + size + duration
 * so the five stars don't all read as one uniform ring. */
const STARS = [
  { angle: 0, size: 7, startOffset: 1, travel: 9, duration: 0.34 },
  { angle: 72, size: 5, startOffset: 3, travel: 11, duration: 0.38 },
  { angle: 144, size: 8, startOffset: 0, travel: 8, duration: 0.3 },
  { angle: 216, size: 6, startOffset: 2, travel: 12, duration: 0.4 },
  { angle: 288, size: 6, startOffset: 1, travel: 10, duration: 0.36 },
];
/** Stars begin essentially with the icon pop, not after it — nearly
 * immediate off the click. */
const STAR_BASE_DELAY_S = 0.03;
/** Slight, not sequential — organic without reading as one-at-a-time. */
const STAR_STAGGER_S = 0.015;

function StarBurst({ onSettled }: { onSettled: () => void }) {
  const lastIndex = STARS.length - 1;
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-visible"
    >
      {STARS.map((star, i) => (
        <span
          key={star.angle}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ rotate: `${star.angle}deg` }}
        >
          <motion.span
            className="block text-[color:var(--primary)]"
            initial={{ y: -star.startOffset, opacity: 0, scale: 0.4, rotate: 0 }}
            animate={{
              y: -(star.startOffset + star.travel),
              opacity: [0, 1, 0],
              scale: 1,
              rotate: 25,
            }}
            transition={{
              duration: star.duration,
              delay: STAR_BASE_DELAY_S + i * STAR_STAGGER_S,
              ease: EASE_OUT,
            }}
            onAnimationComplete={i === lastIndex ? onSettled : undefined}
          >
            <Sparkle
              aria-hidden
              fill="currentColor"
              stroke="none"
              style={{ width: star.size, height: star.size }}
            />
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/**
 * Drives the celebration off a `selected` boolean — mount this hook's
 * `iconScope` ref on the `motion.span` wrapping just the glyph (give that
 * span `relative z-10` so it stacks above the burst), and render the
 * returned `burst` as an absolutely-positioned sibling *before* it in the
 * same `relative` container (DOM order doesn't matter for stacking once
 * z-index is set, but keeping the burst first mirrors the visual "behind"
 * relationship).
 */
function useSelectionCelebration(selected: boolean) {
  const prefersReducedMotion = useReducedMotion();
  const [iconScope, animateIcon] = useAnimate();
  const [showBurst, setShowBurst] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const wasSelectedRef = useRef(selected);

  useEffect(() => {
    const justSelected = selected && !wasSelectedRef.current;
    wasSelectedRef.current = selected;
    if (!justSelected || prefersReducedMotion) return;

    animateIcon(
      iconScope.current,
      { scale: POP_KEYFRAMES },
      { duration: POP_DURATION_S, ease: EASE_EMPHASIZED, times: POP_TIMES }
    );
    setBurstKey((key) => key + 1);
    setShowBurst(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return {
    /** Attach to the `motion.span` wrapping just the glyph. */
    iconScope,
    /** Render as an absolutely-positioned sibling of the glyph. */
    burst: showBurst ? (
      <StarBurst key={burstKey} onSettled={() => setShowBurst(false)} />
    ) : null,
  };
}

export { useSelectionCelebration };
