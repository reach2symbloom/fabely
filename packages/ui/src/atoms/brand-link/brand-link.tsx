/**
 * Brand Link — service logo + name lockup.
 *
 * Figma: Brand link (`16456:17763`), part of the API Connections set
 * (`16456:17857`). Presentation-only — takes a resolved `logoSrc` rather
 * than knowing about any specific brand catalog; API Connection owns the
 * brand → logo/label mapping (`@/foundations/images/brand-logos`).
 *
 * Placement: YES — reusable logo+name lockup wherever a brand mark needs
 * to read as one unit (API connections today; import-source pickers or
 * settings rows later). Lives in `src/atoms/brand-link/`.
 *
 * Overlap: Book Cover is portrait manuscript art with an edit scrim —
 * different job. Image Button's thumbnail is a decorative illustration,
 * not a brand-mark lockup.
 */
'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export type BrandLinkProps = {
  logoSrc: string;
  label: string;
  /**
   * Override the logo `<img>`'s classes — e.g. an invert filter for a
   * mark with no light/dark ink pair (see API Connection's Apple case).
   */
  logoClassName?: string;
  className?: string;
};

const paragraphSmallMedium = [
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-medium)]',
  'text-[length:var(--text-paragraph-small-medium-font-size)]',
  'leading-[var(--text-paragraph-small-medium-line-height)]',
  'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
].join(' ');

function BrandLink({ logoSrc, label, logoClassName, className }: BrandLinkProps) {
  return (
    <div
      data-slot="brand-link"
      className={cn(
        'flex shrink-0 items-center gap-[length:var(--spacing-2xs)]',
        className,
      )}
    >
      <span className="flex size-[length:var(--tw-raw-spacing-10)] shrink-0 items-center justify-center p-[length:var(--spacing-xs)]">
        <img
          src={logoSrc}
          alt=""
          className={cn('size-full object-contain', logoClassName)}
        />
      </span>
      <p
        className={cn(
          paragraphSmallMedium,
          'whitespace-nowrap text-[color:var(--foreground)]',
        )}
      >
        {label}
      </p>
    </div>
  );
}

export { BrandLink };
