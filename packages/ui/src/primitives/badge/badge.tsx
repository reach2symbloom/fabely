/**
 * Fabely Badge primitive — wraps the upstream shadcn Badge primitive
 * (src/components/ui/badge.tsx) with Fabely's Foundations-sourced styling
 * and Figma-authored size / roundness / variant surface.
 *
 * Visual source of truth: Figma component set "Badge"
 * (file gV94L0qCmvwQkddNbEktry, node 19:6979). API ground truth for
 * polymorphism and the shared shadcn surface remains the vendored file
 * (`render` via Base UI `useRender` — not Radix `asChild`) plus the shadcn
 * docs' composition examples (icon, spinner, link-as-child, custom colors, RTL).
 *
 * This is the public API future Fabely components should import Badge
 * from, not the vendor path directly.
 */
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { Badge as BadgePrimitive } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type BadgeSize = 'default' | 'large';
export type BadgeRoundness = 'default' | 'round';

/**
 * Fabely variant surface, mapped from Figma's Variant axis onto the vendor
 * shadcn names where they overlap, then extended for Figma-only statuses:
 *
 * - `default`     ← Figma Primary (soft muted fill + neutrals-new-500 text —
 *                   NOT the vendor's solid `bg-primary` fill)
 * - `secondary`   ← Figma Secondary (secondary-ghost fill + secondary-200 text)
 * - `outline`     ← Figma Outline
 * - `ghost`       ← Figma Tertiary (same soft fill as Primary, foreground text)
 * - `destructive` ← Figma Destructive
 * - `success`     ← Figma Success (no vendor equivalent)
 * - `alert`       ← Figma Alert (no vendor equivalent)
 *
 * Link-as-anchor is not a variant — use Base UI `render={<a href=… />}` with
 * any Figma color variant (see Storybook Link composition / playground).
 */
export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'success'
  | 'alert';

type VendorVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';

function toVendorVariant(variant: BadgeVariant): VendorVariant {
  switch (variant) {
    /* Soft Figma fills must not mount the vendor's solid `bg-destructive`
     * (or its `dark:bg-destructive/60` leftover — twMerge does not strip
     * dark: bg when an unprefixed arbitrary bg follows). Stub to `default`
     * like success/alert; visible styles come from this primitive. */
    case 'destructive':
    case 'success':
    case 'alert':
      return 'default';
    default:
      return variant;
  }
}

/* Base layout/typography shared across every Figma variant. Vendor's own
 * `rounded-full` / `bg-primary` / `text-xs` / `px-2 py-0.5` are fully
 * overridden here — cn() on the vendor root merges our className after
 * badgeVariants(), so these win for conflicting utilities. Focus ring is
 * variant-specific (see each variant entry) because Figma wires a different
 * ring token per color (primary / secondary / error / success / alert). */
const badgeVariants = cva(
  [
    'inline-flex w-fit shrink-0 items-center justify-center overflow-hidden',
    'border border-transparent whitespace-nowrap transition-[color,box-shadow]',
    'font-[family-name:var(--font-family-body)] [font-weight:var(--font-weight-paragraph-medium)]',
    'gap-[var(--spacing-2xs)] px-[var(--spacing-1-5)] py-[var(--spacing-3xs)]',
    'focus-visible:outline-none',
    /* Icon sizing — Default matches Figma's 12px left/right icon frames
     * (--tw-raw-spacing-3). Large uses Foundations --icon-xs (12px).
     * data-icon attrs support the shadcn docs' inline-start / inline-end
     * composition without adding new product props. */
    '[&>svg]:pointer-events-none',
    /* Icons inherit the badge text color (currentColor) — no separate
     * icon swatch; keeps destructive/success/etc. text and glyph in sync. */
    '[&>svg]:text-current',
    /* data-icon marks start/end composition for docs parity; icon side is
     * determined by DOM order (icon before label = start, after = end) —
     * do not flex-row-reverse on inline-end or a trailing icon flips left. */
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--theme-alpha-black-switch-333)] text-[color:var(--neutrals-new-500)]',
          'focus-visible:shadow-[var(--effect-focus-ring-primary)]',
          '[a&]:hover:bg-[var(--theme-alpha-black-switch-5)]',
        ],
        /* Ghost raw tokens are solid hex in foundations/colors.css; Figma
         * applies them at 12% (secondary/error/success) or 8% (alert)
         * opacity for badge fills — color-mix reconstructs that soft tint
         * without inventing a new token. Using the solid value as a fill
         * would make Secondary/Success text invisible (text swatch equals
         * the ghost hex). */
        secondary: [
          'bg-[color-mix(in_srgb,var(--tw-raw-secondary-ghost)_12%,transparent)] text-[color:var(--tw-raw-secondary-200)]',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          '[a&]:hover:opacity-90',
        ],
        outline: [
          'bg-[var(--theme-alpha-white-switch-001)] text-[color:var(--foreground)]',
          'border-[length:var(--stroke-thin)] border-[color:var(--theme-alpha-black-switch-5)]',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          '[a&]:hover:bg-[var(--theme-alpha-black-switch-333)]',
        ],
        ghost: [
          'bg-[var(--theme-alpha-black-switch-333)] text-[color:var(--foreground)]',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          '[a&]:hover:bg-[var(--theme-alpha-black-switch-5)]',
        ],
        /* Fill: Foundations `--tw-raw-error-ghost` at its documented 12%
         * (solid hex in colors.css — color-mix reconstructs the soft tint).
         * Text/icon: `--tw-raw-error-300`. */
        destructive: [
          'bg-[color-mix(in_srgb,var(--tw-raw-error-ghost)_12%,transparent)] text-[color:var(--tw-raw-error-300)]',
          'focus-visible:shadow-[var(--effect-focus-ring-error)]',
          '[a&]:hover:opacity-90',
        ],
        success: [
          'bg-[color-mix(in_srgb,var(--tw-raw-success-ghost)_12%,transparent)] text-[color:var(--tw-raw-success-500)]',
          'focus-visible:shadow-[var(--effect-focus-ring-success)]',
          '[a&]:hover:opacity-90',
        ],
        alert: [
          'bg-[color-mix(in_srgb,var(--tw-raw-alert-ghost)_8%,transparent)] text-[color:var(--tw-raw-alert-600)]',
          'focus-visible:shadow-[var(--effect-focus-ring-alert)]',
          '[a&]:hover:opacity-90',
        ],
      },
      size: {
        default: [
          'text-[length:var(--text-paragraph-mini-medium-font-size)]',
          'leading-[var(--text-paragraph-mini-medium-line-height)]',
          'tracking-[var(--text-paragraph-mini-medium-letter-spacing)]',
          '[&>svg]:size-[length:var(--tw-raw-spacing-3)]',
        ],
        large: [
          'text-[length:var(--text-paragraph-small-medium-font-size)]',
          'leading-[var(--text-paragraph-small-medium-line-height)]',
          'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
          '[&>svg]:size-[length:var(--icon-xs)]',
        ],
      },
      roundness: {
        default: 'rounded-[var(--rounded-sm)]',
        round: 'rounded-[var(--rounded-full)]',
      },
    },
    compoundVariants: [
      /* Figma pins fixed heights per size×roundness (Round is taller than
       * Default at the same Size). 24px maps to --spacing-xl; 18 / 22 / 28
       * have no published spacing token at that exact value. */
      {
        size: 'default',
        roundness: 'default',
        // TODO: 18px badge height not backed by a Foundation spacing token
        class: 'h-[18px]',
      },
      {
        size: 'default',
        roundness: 'round',
        class: 'h-[length:var(--spacing-xl)]',
      },
      {
        size: 'large',
        roundness: 'default',
        // TODO: 22px badge height not backed by a Foundation spacing token
        class: 'h-[22px]',
      },
      {
        size: 'large',
        roundness: 'round',
        // TODO: 28px has --tw-raw-spacing-7 but no published --spacing-* alias
        class: 'h-[length:var(--tw-raw-spacing-7)]',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      roundness: 'default',
    },
  }
);

type BadgeProps = Omit<React.ComponentProps<typeof BadgePrimitive>, 'variant'> & {
  variant?: BadgeVariant;
  size?: BadgeSize;
  roundness?: BadgeRoundness;
};

function Badge({
  className,
  variant = 'default',
  size = 'default',
  roundness = 'default',
  ...props
}: BadgeProps) {
  return (
    <BadgePrimitive
      variant={toVendorVariant(variant)}
      data-variant={variant}
      data-size={size}
      data-roundness={roundness}
      className={cn(badgeVariants({ variant, size, roundness }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
