/**
 * Fabely Button primitive — phase 2: Figma Button component set.
 *
 * Visual source of truth: Figma "Button"
 * (file gV94L0qCmvwQkddNbEktry, page Button / set 9:1071).
 * Interaction model (hover / pressed) is library-authored — see README
 * and docs/DESIGN.md (Figma had no pressed state).
 *
 * Wraps Base UI Button (same primitive the vendor file uses). Styles and
 * the variant / size / roundness surface are Foundations-sourced from Figma.
 * Icon Button and Button Link are separate Figma components — not this API.
 */
import * as React from 'react';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/** Figma Variant axis (8 values). No `link` — Button Link is a separate set. */
export type ButtonVariant =
  | 'primary'
  | 'primaryOutline'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'destructive'
  | 'fiaFilled'
  | 'fiaOutline';

/** Figma Size axis — no icon-* sizes (Icon Button is a separate primitive). */
export type ButtonSize =
  | 'extraSmall'
  | 'small'
  | 'default'
  | 'large'
  | 'extraLarge';

/** Figma Roundness axis — Default 12px / Round fully rounded. */
export type ButtonRoundness = 'default' | 'round';

/**
 * Gradient border (Primary outline) — mask-composite ring on `::before`:
 *   background: var(--gradient-primary-top-bottom) border-box;
 *   mask: linear-gradient(#000 0 0) padding-box exclude, linear-gradient(#000 0 0);
 * Transparent button face; surface shows through. Ring is on `::before`
 * (not the button) so the mask does not hide label text. Negative inset
 * aligns the pseudo to the button's border-box. WebKit: xor composite.
 */
const GRADIENT_BORDER = [
  'relative bg-transparent',
  'border-[length:var(--stroke-regular)] border-solid border-transparent',
  "before:pointer-events-none before:absolute before:rounded-[inherit] before:content-['']",
  'before:inset-[calc(var(--stroke-regular)*-1)]',
  'before:border-[length:var(--stroke-regular)] before:border-solid before:border-transparent',
  'before:[background:var(--gradient-primary-top-bottom)_border-box]',
  'before:[mask:linear-gradient(#000_0_0)_padding-box_exclude,linear-gradient(#000_0_0)]',
  'before:[-webkit-mask:linear-gradient(#000_0_0)_padding-box,linear-gradient(#000_0_0)]',
  'before:[-webkit-mask-composite:xor]',
].join(' ');

/** Outline/quiet hover + pressed fills. `data-pressed` mirrors `:active` for stories. */
const QUIET_INTERACTION = [
  'hover:bg-[var(--theme-alpha-black-switch-5)]',
  'active:bg-[var(--theme-alpha-black-switch-10)]',
  'data-[pressed]:bg-[var(--theme-alpha-black-switch-10)]',
].join(' ');

const buttonVariants = cva(
  [
    'group/button inline-flex shrink-0 items-center justify-center',
    'border border-transparent',
    'font-[family-name:var(--font-family-body)] [font-weight:var(--font-weight-paragraph-medium)]',
    'whitespace-nowrap transition-[color,background-color,border-color,opacity,box-shadow]',
    'outline-none select-none',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-current',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-clip-padding bg-[image:var(--gradient-primary-top-bottom)] text-[color:var(--primary-foreground)]',
          'shadow-[var(--effect-focus-ring-primary-rest)]',
          'hover:opacity-[var(--opacity-hover-soft)]',
          'active:opacity-[var(--opacity-hover)] data-[pressed]:opacity-[var(--opacity-hover)]',
          'focus-visible:shadow-[var(--effect-focus-ring-primary)]',
          'disabled:bg-none disabled:bg-[var(--theme-neutrals-300)] disabled:text-[color:var(--theme-neutrals-700)]',
          'disabled:shadow-none disabled:opacity-50',
        ],
        primaryOutline: [
          GRADIENT_BORDER,
          'text-[color:var(--foreground)]',
          QUIET_INTERACTION,
          /* Focus fills surface; border width stays constant. */
          'focus-visible:bg-[var(--background)]',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          'disabled:opacity-50',
        ],
        secondary: [
          'bg-[var(--theme-alpha-white-switch-0)]',
          'border-[length:var(--stroke-regular)] border-[color:var(--tw-raw-secondary-200)]',
          'text-[color:var(--foreground)]',
          QUIET_INTERACTION,
          'focus-visible:bg-[var(--background)]',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          'disabled:opacity-50',
        ],
        tertiary: [
          'bg-[var(--theme-alpha-black-switch-0)]',
          'border-[length:var(--stroke-thin)] border-[color:var(--theme-alpha-black-switch-10)]',
          'text-muted-foreground',
          QUIET_INTERACTION,
          'hover:text-secondary-foreground',
          'active:text-secondary-foreground data-[pressed]:text-secondary-foreground',
          'focus-visible:text-secondary-foreground',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          'disabled:opacity-50',
        ],
        ghost: [
          'bg-[var(--theme-alpha-white-switch-001)] border-transparent',
          'text-muted-foreground',
          QUIET_INTERACTION,
          'hover:text-foreground',
          'active:text-foreground data-[pressed]:text-foreground',
          'focus-visible:text-foreground',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          'disabled:opacity-50',
        ],
        destructive: [
          'bg-[color-mix(in_srgb,var(--tw-raw-error-ghost)_12%,transparent)]',
          'text-[color:var(--tw-raw-error-600)] border-transparent',
          'hover:opacity-[var(--opacity-hover)]',
          'active:opacity-[var(--opacity-pressed)] data-[pressed]:opacity-[var(--opacity-pressed)]',
          'focus-visible:shadow-[var(--effect-focus-ring-error)]',
          'disabled:opacity-50',
        ],
        fiaFilled: [
          'bg-[var(--tw-raw-fia-200)] text-[color:var(--tw-raw-fia-950)] border-transparent',
          'hover:opacity-[var(--opacity-hover)]',
          'active:opacity-[var(--opacity-pressed)] data-[pressed]:opacity-[var(--opacity-pressed)]',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          'disabled:opacity-50',
        ],
        fiaOutline: [
          'bg-transparent',
          'border-[length:var(--stroke-regular)] border-[color:var(--tw-raw-fia-200)]',
          'text-[color:var(--foreground)]',
          QUIET_INTERACTION,
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          'disabled:opacity-50',
        ],
      },
      size: {
        extraSmall: [
          'h-[length:var(--spacing-xl)]',
          'gap-[var(--spacing-1-5)]',
          'px-[var(--spacing-xs)] py-[var(--spacing-2xs)]',
          'text-[length:var(--text-paragraph-mini-medium-font-size)]',
          'leading-[var(--text-paragraph-mini-medium-line-height)]',
          'tracking-[var(--text-paragraph-mini-medium-letter-spacing)]',
          '[&>svg]:size-[length:var(--icon-xs)]',
        ],
        small: [
          'h-[length:var(--spacing-2xl)]',
          'gap-[var(--spacing-1-5)]',
          'px-[var(--spacing-2-5)] py-[var(--spacing-1-5)]',
          'text-[length:var(--text-paragraph-small-medium-font-size)]',
          'leading-[var(--text-paragraph-small-medium-line-height)]',
          'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
          '[&>svg]:size-[length:var(--icon-sm)]',
        ],
        default: [
          'h-[length:var(--spacing-3xl)]',
          'gap-[var(--spacing-xs)]',
          'px-[var(--spacing-2-5)] py-[var(--spacing-xs)]',
          'text-[length:var(--text-paragraph-small-medium-font-size)]',
          'leading-[var(--text-paragraph-small-medium-line-height)]',
          'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
          '[&>svg]:size-[length:var(--icon-sm)]',
        ],
        large: [
          'h-[length:var(--spacing-11)]',
          'gap-[var(--spacing-xs)]',
          'px-[var(--spacing-2-5)] py-[var(--spacing-2-5)]',
          'text-[length:var(--text-paragraph-regular-medium-font-size)]',
          'leading-[var(--text-paragraph-regular-medium-line-height)]',
          'tracking-[var(--text-paragraph-regular-medium-letter-spacing)]',
          '[&>svg]:size-[length:var(--icon-sm)]',
        ],
        extraLarge: [
          'h-[length:var(--spacing-13)]',
          'gap-[var(--spacing-xs)]',
          'px-[var(--spacing-xl)] py-[var(--spacing-sm)]',
          'text-[length:var(--text-paragraph-regular-medium-font-size)]',
          'leading-[var(--text-paragraph-regular-medium-line-height)]',
          'tracking-[var(--text-paragraph-regular-medium-letter-spacing)]',
          '[&>svg]:size-[length:var(--icon-sm)]',
        ],
      },
      roundness: {
        default: 'rounded-[var(--rounded-lg)]',
        round: 'rounded-[var(--rounded-full)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      roundness: 'default',
    },
  }
);

type ButtonProps = Omit<ButtonPrimitive.Props, 'className'> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
  };

function Button({
  className,
  variant = 'primary',
  size = 'default',
  roundness = 'default',
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-roundness={roundness}
      className={cn(buttonVariants({ variant, size, roundness }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
