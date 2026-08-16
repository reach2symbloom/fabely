/**
 * Highlight Color — selectable color swatch, e.g. one option in a
 * text-highlight color picker.
 *
 * Figma: Highlight color atom (`16317:950`) — Default / Hover / Selected
 * states, 16px circle. `color` is caller-supplied (Figma's own example
 * instance uses `--tw-raw-secondary-200`, #bdb7ea); Selected shows a check
 * and a glow built from that same color, so the glow always matches
 * whatever color is passed rather than one fixed swatch.
 *
 * Hover/press use Motion's `SPRING_BLOOM` (see `@/lib/motion`) for the
 * scale — a snappy spring, not a linear CSS transition. The glow/ring
 * itself stays CSS (`hover:shadow-*`, the inline box-shadow above),
 * transitioned independently via `transition-shadow`.
 */

'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { SPRING_BLOOM } from '@/lib/motion';

/*
 * `onDrag`/`onDragStart`/`onDragEnd`/`onAnimation*` — native DOM and
 * Motion define these with incompatible signatures; omit the DOM
 * versions since nothing here uses native drag or CSS animation events.
 */
export type HighlightColorProps = Omit<
  React.ComponentProps<'button'>,
  | 'color'
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
> & {
  /** Swatch fill — any CSS color value or token. */
  color: string;
  /** Figma's "Active" state — persistent selection, not `:active`. */
  selected?: boolean;
};

function HighlightColor({
  className,
  color,
  selected = false,
  style,
  'aria-label': ariaLabel,
  ...props
}: HighlightColorProps) {
  return (
    <motion.button
      type="button"
      data-slot="highlight-color"
      aria-pressed={selected}
      aria-label={ariaLabel}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.92 }}
      transition={SPRING_BLOOM}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer items-center justify-center',
        'size-[length:var(--icon-sm)] overflow-hidden rounded-[var(--rounded-full)]',
        'outline-none transition-shadow duration-[var(--duration-fast)]',
        !selected && 'hover:shadow-[0_0_0_3px_var(--ring)]',
        selected && 'border border-solid border-[color:var(--foreground)]',
        'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
        className,
      )}
      style={{
        backgroundColor: color,
        /* Inline (not a Tailwind class) — `color` is a runtime value, and
         * the glow must always match it, not one fixed swatch. Wins over
         * the hover shadow class unconditionally, which is correct here:
         * once selected, hovering shouldn't swap back to the plain ring. */
        ...(selected
          ? {
              boxShadow: `0 0 12px 0 ${color}, 0 0 0 2px color-mix(in srgb, ${color} 16%, transparent)`,
            }
          : null),
        ...style,
      }}
      {...props}
    >
      {selected ? (
        <Check
          aria-hidden="true"
          className="size-[length:var(--icon-xs)] text-[color:var(--foreground)]"
        />
      ) : null}
    </motion.button>
  );
}

export { HighlightColor };
