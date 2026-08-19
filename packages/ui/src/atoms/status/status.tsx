/**
 * Status — colored dot + label, connection/state readout.
 *
 * Figma: Status (`16456:17778`), part of the API Connections set
 * (`16456:17857`), using "Icon / dot large" (`16456:17766`) for the
 * dot — a 24×24 icon frame with a *solid filled* 8×8 circle centered
 * inside it (`inset: 33.33%`), not a glyph. Lucide's `Dot` is visually
 * different (a thin r=1 stroke-outlined mark meant to read as a small
 * '·' character) and was the wrong icon — reproduced directly as a
 * `bg-current` circle in the same 24×24/8×8 proportions instead.
 *
 * Placement: YES — reusable status indicator, not API-Connection-specific.
 * Lives in `src/atoms/status/`.
 *
 * Overlap: Badge is a filled pill for categorical tags (Library List
 * Item's genre/series lockup) — different job, not composed here.
 */
'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export type StatusTone = 'success';

export type StatusProps = {
  label: string;
  /** Defaults to (and today only supports) `'success'`. */
  tone?: StatusTone;
  className?: string;
};

const TONE_DOT_CLASS: Record<StatusTone, string> = {
  success: 'text-[color:var(--tw-raw-success-500)]',
};

const paragraphMiniRegular = [
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-regular)]',
  'text-[length:var(--text-paragraph-mini-regular-font-size)]',
  'leading-[var(--text-paragraph-mini-regular-line-height)]',
  'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
].join(' ');

function Status({ label, tone = 'success', className }: StatusProps) {
  return (
    <div
      data-slot="status"
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
