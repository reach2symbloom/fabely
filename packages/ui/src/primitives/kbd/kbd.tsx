/**
 * Fabely Kbd primitive — keyboard key chrome from Figma Kbd (`12116:7780`,
 * Mode specimen `780:42498`) with the
 * [shadcn Kbd](https://ui.shadcn.com/docs/components/base/kbd) API.
 *
 * Every visual value maps to a Figma-bound Foundations token (pad 2xs/3xs,
 * rounded-sm, alpha fills/labels, paragraph mini type). Vendor
 * (`src/components/ui/kbd.tsx`) stays untouched.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Figma Mode axis: Default (quiet alpha fill) · Glow (white alpha on dark
 * surfaces). Glow also applies automatically inside Tooltip content.
 */
export type KbdVariant = 'default' | 'glow';

/** Dark specimen surface for Glow demos — Figma page charcoal, not --foreground. */
export const KBD_GLOW_SURFACE =
  'bg-[color:var(--theme-neutrals-900)]';

const kbdVariants = cva(
  [
    'pointer-events-none inline-flex w-fit items-center justify-center',
    'select-none',
    /* Figma: rounded-sm on all corners */
    'rounded-[length:var(--rounded-sm)]',
    /* Figma: paddingLeft/Right = 2xs, paddingTop/Bottom = 3xs */
    'px-[var(--spacing-2xs)] py-[var(--spacing-3xs)]',
    /* Figma text: font definitions/font-family-body + paragraph mini/* */
    'font-[family-name:var(--font-family-body)]',
    '[font-weight:var(--font-weight-paragraph-regular)]',
    'text-[length:var(--text-paragraph-mini-regular-font-size)]',
    'leading-[var(--text-paragraph-mini-regular-line-height)]',
    'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    '[&_svg:not([class*=size-])]:size-[length:var(--icon-xs)]',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          /* Figma: alpha/black/switch/alpha-5 */
          'bg-[color:var(--theme-alpha-black-switch-5)]',
          /* Figma: alpha/black/switch/alpha-50 */
          'text-[color:var(--theme-alpha-black-switch-50)]',
          /* Tooltip host — Figma Mode=Glow tokens without requiring the prop. */
          'in-data-[slot=tooltip-content]:bg-[color:var(--theme-alpha-white-no-switch-25)]',
          'in-data-[slot=tooltip-content]:text-[color:var(--theme-alpha-white-no-switch-60)]',
        ].join(' '),
        glow: [
          /* Figma: alpha/white/no-switch/alpha-25 (white @ 25% on dark) */
          'bg-[color:var(--theme-alpha-white-no-switch-25)]',
          /* Figma: alpha/white/no-switch/alpha-60 */
          'text-[color:var(--theme-alpha-white-no-switch-60)]',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Kbd({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'kbd'> & VariantProps<typeof kbdVariants>) {
  return (
    <kbd
      data-slot="kbd"
      data-variant={variant}
      className={cn(kbdVariants({ variant }), className)}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="kbd-group"
      className={cn(
        /* Figma kbd combo itemSpacing = 2xs */
        'inline-flex items-center gap-[var(--spacing-2xs)]',
        className,
      )}
      {...props}
    />
  );
}

export { Kbd, KbdGroup, kbdVariants };
