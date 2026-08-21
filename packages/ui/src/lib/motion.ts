/**
 * Shared Motion (`motion/react`) presets — the standard animation engine
 * for Fabely component motion. Reserve Motion for interactions that
 * benefit from spring physics, enter/exit, layout animation, sequencing,
 * or gesture-driven motion; keep plain CSS transitions for everything
 * that already works well (color/opacity/shadow swaps, etc.).
 */

import type { Transition } from 'motion/react';

/**
 * Hover/press "bloom" spring — fast response, slight overshoot, quick
 * settle. Damping ratio ~0.71 (underdamped, not the ~0.3–0.5 range that
 * reads as bouncy/cartoonish). Drives scale/transform only — the visual
 * glow itself stays on Foundation tokens via CSS (box-shadow, bg-color),
 * transitioned independently by their own `transition-*` classes.
 */
export const SPRING_BLOOM: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 22,
  mass: 0.6,
};

/**
 * Eased (non-spring) layout/crossfade preset — Foundations' own
 * `--duration-fast` (200ms) / `--ease-emphasized`
 * (`cubic-bezier(0.22, 1, 0.36, 1)`), the same curve already driving this
 * codebase's CSS hover/fill transitions. Motion can't consume a CSS
 * `var()` directly, so this is that curve's resolved value, not a new
 * one — reach for it for layout/FLIP and content crossfades that should
 * read as controlled and precise, not springy (see `SPRING_BLOOM` for
 * when a spring fits better instead).
 */
export const EASE_EMPHASIZED: Transition['ease'] = [0.22, 1, 0.36, 1];

export const TRANSITION_EMPHASIZED_FAST: Transition = {
  duration: 0.2,
  ease: EASE_EMPHASIZED,
};

/**
 * Foundations' `--ease-out` (`cubic-bezier(0, 0, 0.58, 1)`) resolved for
 * Motion. Starts at true rest (control point `(0, 0)`, no initial
 * velocity) rather than `EASE_EMPHASIZED`'s aggressive front-loaded burst —
 * reach for this where a punchy start would read as "shooting" rather
 * than "floating" (e.g. small particles drifting outward).
 */
export const EASE_OUT: Transition['ease'] = [0, 0, 0.58, 1];

/**
 * Calm, continuous vertical float — an ambient positional cue while
 * something is visible, not feedback for a user action. Contrast with
 * `SPRING_BLOOM`/`EASE_EMPHASIZED`, both tuned to respond snappily to a
 * press or hover; this instead has no start or end to feel snappy
 * about — a smooth symmetric ease-in-out both ways, no spring, no
 * overshoot. Pair with a keyframe array shaped `[0, -amplitude, 0]`
 * (amplitude 2–4px reads as "calm," not attention-grabbing) so each
 * repeat starts exactly where the last one ended, never snapping back to
 * a start position. Used by Drop Target's chevron; reuse this rather than
 * a one-off duration/ease pair for any other ambient loop.
 */
export const FLOAT_LOOP: Transition = {
  duration: 1.5,
  repeat: Infinity,
  ease: 'easeInOut',
};
