'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../../lib/utils';

/**
 * Fabely Link Button — Figma set `11:2014`.
 *
 * Text-only / icon+label chrome with **underline on hover & pressed**. No fill,
 * border, or padding chrome beyond Small’s vertical `--spacing-3xs`.
 *
 * Prefer this for in-flow text actions (show more, inline CTAs). For real
 * navigation `<a>` elements, compose with {@link buttonLinkVariants} so Base UI
 * does not force `role="button"` (see Text Button README).
 */
const buttonLinkVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-[length:var(--spacing-xs)]',
    'whitespace-nowrap transition-all outline-none',
    'underline-offset-4 hover:underline data-[pressed]:underline',
    'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-invalid:shadow-[var(--effect-focus-ring-destructive)]',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
  ].join(' '),
  {
    variants: {
      variant: {
        /** Figma Style=Tertiary — `--foreground`. */
        tertiary: 'text-foreground',
        /** Figma Style=Secondary — `--tw-raw-secondary-200`. */
        secondary: 'text-[color:var(--tw-raw-secondary-200)]',
        /** Figma Style=Primary — `--neutrals-new-600`. */
        primary: 'text-[color:var(--neutrals-new-600)]',
        /** Figma Style=Fia — `--tw-raw-fia-200`. */
        fia: 'text-[color:var(--tw-raw-fia-200)]',
      },
      size: {
        /**
         * Figma Size=Mini — body-xs / Regular→Medium in file (12/16 Medium).
         * Height is line-box only.
         */
        mini: [
          'text-[length:var(--text-body-xs)]',
          'leading-[var(--text-body-xs--line-height)]',
          'font-[number:var(--font-weight-medium)]',
        ].join(' '),
        /**
         * Figma Size=Small — body-sm Medium + py `--spacing-3xs`.
         */
        sm: [
          'py-[length:var(--spacing-3xs)]',
          'text-[length:var(--text-body-sm)]',
          'leading-[var(--text-body-sm--line-height)]',
          'font-[number:var(--font-weight-medium)]',
        ].join(' '),
        /**
         * Figma Size=Default — body-sm Medium, no vertical pad.
         */
        default: [
          'text-[length:var(--text-body-sm)]',
          'leading-[var(--text-body-sm--line-height)]',
          'font-[number:var(--font-weight-medium)]',
        ].join(' '),
        /**
         * Figma Size=Large — body-base Regular (16/24).
         */
        lg: [
          'text-[length:var(--text-body-base)]',
          'leading-[var(--text-body-base--line-height)]',
          'font-[number:var(--font-weight-regular)]',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'tertiary',
      size: 'default',
    },
  },
);

type ButtonLinkVariantProps = VariantProps<typeof buttonLinkVariants>;

type ButtonLinkProps = ButtonPrimitive.Props & ButtonLinkVariantProps;

function ButtonLink({
  className,
  variant = 'tertiary',
  size = 'default',
  ...props
}: ButtonLinkProps) {
  return (
    <ButtonPrimitive
      data-slot="button-link"
      className={cn(buttonLinkVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export {
  ButtonLink,
  buttonLinkVariants,
  type ButtonLinkProps,
  type ButtonLinkVariantProps,
};
export type ButtonLinkVariant = NonNullable<ButtonLinkVariantProps['variant']>;
export type ButtonLinkSize = NonNullable<ButtonLinkVariantProps['size']>;
