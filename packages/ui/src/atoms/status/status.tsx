/**
 * Status — colored-dot status readout, in two variants:
 *
 * - `'label'` (default) — dot + required text label, connection/state
 *   readout. Figma: Status (`16456:17778`), part of the API Connections
 *   set (`16456:17857`), using "Icon / dot large" (`16456:17766`) for the
 *   dot — a 24×24 icon frame with a *solid filled* 8×8 circle centered
 *   inside it (`inset: 33.33%`), not a glyph. Lucide's `Dot` is visually
 *   different (a thin r=1 stroke-outlined mark meant to read as a small
 *   '·' character) and was the wrong icon — reproduced directly as a
 *   `bg-current` circle in the same 24×24/8×8 proportions instead.
 *
 * - `'glyph'` — bare pulsing dot inside a soft semantic ghost halo, no
 *   label. Figma: Promptbar status badges (`16199:2312`) — the small
 *   circle shown next to "The Eldergrove" on the Scene Desk / All Notes
 *   examples ("Dot divider", a plain filled 6×6 circle, inset 3px inside a
 *   12×12 `success-ghost` halo). Traced by fetching that asset's own SVG
 *   directly (`fill: #76E0B2`, solid — matches `--tw-raw-success-500`
 *   exactly). Meant to sit inside another component's trailing slot (e.g.
 *   `StatusBadge`), not stand alone with text.
 *
 * Two different Figma sources, two different anatomies (label has no
 * halo and a 24×24 frame; glyph has no label, is half the size, and adds
 * a pulsing ghost halo) — folded into one component as a `variant` rather
 * than kept as the two separate atoms (`Status` / `StatusIndicator`) they
 * originally shipped as, since both express the same semantic idea (a
 * colored-dot status readout).
 *
 * Placement: YES — reusable status indicator, not API-Connection- or
 * Promptbar-specific. Lives in `src/atoms/status/`.
 *
 * Overlap: Badge is a filled pill for categorical tags (Library List
 * Item's genre/series lockup) — different job, not composed here.
 */
'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { FLOAT_LOOP } from '@/lib/motion';

export type StatusTone = 'success';

type StatusBaseProps = {
  /** Defaults to (and today only supports) `'success'`. */
  tone?: StatusTone;
  className?: string;
};

export type StatusProps =
  | (StatusBaseProps & {
      variant?: 'label';
      /** Required for the `'label'` variant — every Figma example has one. */
      label: string;
      pulse?: never;
    })
  | (StatusBaseProps & {
      variant: 'glyph';
      label?: never;
      /** Plays the calm connected pulse. Defaults to `true` — the only
       * shown Figma state is "connected", which is always pulsing. */
      pulse?: boolean;
    });

const TONE_DOT_CLASS: Record<StatusTone, string> = {
  success: 'text-[color:var(--tw-raw-success-500)]',
};

const TONE_GLYPH_CLASSNAME: Record<StatusTone, { halo: string; dot: string }> = {
  success: {
    /* `--tw-raw-success-ghost` itself is an opaque hex, not a translucent
     * one, in this codebase today (a token-definition gap, not something
     * this atom should route around independently) — wrapped in the same
     * `color-mix(... 12%, transparent)` the Badge primitive's own
     * `success` variant already uses for the identical reason, so this
     * matches Badge's existing shipped treatment rather than introducing
     * a second, differently-computed "success ghost." */
    halo: 'bg-[color-mix(in_srgb,var(--tw-raw-success-ghost)_12%,transparent)]',
    dot: 'bg-[var(--tw-raw-success-500)]',
  },
};

const paragraphMiniRegular = [
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-regular)]',
  'text-[length:var(--text-paragraph-mini-regular-font-size)]',
  'leading-[var(--text-paragraph-mini-regular-line-height)]',
  'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
].join(' ');

function Status(props: StatusProps) {
  const { tone = 'success', className } = props;
  /* Called unconditionally — Rules of Hooks — even though only the
   * `'glyph'` branch below uses the result. */
  const prefersReducedMotion = useReducedMotion();

  if (props.variant === 'glyph') {
    const { pulse = true } = props;
    const animated = pulse && !prefersReducedMotion;
    const glyphClasses = TONE_GLYPH_CLASSNAME[tone];
    return (
      <motion.span
        aria-hidden
        data-slot="status"
        data-variant="glyph"
        data-tone={tone}
        className={cn(
          'inline-flex shrink-0 items-center justify-center',
          'rounded-[length:var(--rounded-full)] p-[length:var(--spacing-0-75)]',
          glyphClasses.halo,
          className
        )}
        animate={animated ? { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] } : undefined}
        transition={animated ? FLOAT_LOOP : undefined}
      >
        <span
          className={cn(
            'size-[length:var(--spacing-1-5)] rounded-[length:var(--rounded-full)]',
            glyphClasses.dot
          )}
        />
      </motion.span>
    );
  }

  const { label } = props;
  return (
    <div
      data-slot="status"
      data-variant="label"
      data-tone={tone}
      className={cn('flex shrink-0 items-center', className)}
    >
      <span
        aria-hidden
        data-slot="status-dot-icon"
        className={cn(
          'flex size-[length:var(--icon-lg)] shrink-0 items-center justify-center',
          TONE_DOT_CLASS[tone],
        )}
      >
        <span className="size-[length:var(--icon-2xs)] rounded-[length:var(--rounded-full)] bg-current" />
      </span>
      <p
        className={cn(
          paragraphMiniRegular,
          /* --theme-alpha-black-switch-60 directly, not --muted-foreground
           * — the latter is declared once at :root with no redeclaration
           * inside .dark, so it doesn't re-resolve on a locally-.dark-
           * wrapped canvas (e.g. Storybook's LibraryCanvas) and renders
           * near-invisible on black. Same fix as Image Button / API
           * Connection. */
          'whitespace-nowrap text-[color:var(--theme-alpha-black-switch-60)]',
        )}
      >
        {label}
      </p>
    </div>
  );
}

export { Status };
