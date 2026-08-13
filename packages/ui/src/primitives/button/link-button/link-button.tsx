'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../../lib/utils';

/**
 * Fabely Link Button — Figma set `11:2014`.
 *
 * Text-only / icon+label chrome with **underline on hover & pressed**. No fill,
 * border, or padding — height hugs the type line-box.
 *
 * Prefer this for in-flow text actions (show more, inline CTAs). For real
 * navigation `<a>` elements, compose with {@link buttonLinkVariants} so Base UI
 * does not force `role="button"` (see Text Button README).
 */
const buttonLinkVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-[length:var(--spacing-xs)]',
    'font-[family-name:var(--font-family-body)]',
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
         * Figma Size=Mini — Paragraph Mini Medium (12/16).
         * Height is line-box only.
         */
        mini: [
          'text-[length:var(--text-paragraph-mini-medium-font-size)]',
          'leading-[var(--text-paragraph-mini-medium-line-height)]',
          'tracking-[var(--text-paragraph-mini-medium-letter-spacing)]',
          '[font-weight:var(--text-paragraph-mini-medium-font-weight)]',
        ].join(' '),
        /**
         * Figma Size=Default — Paragraph Small Medium (14/20). Line-box hug only.
         *
         * Figma also has Size=Small (same type + 2px vertical pad). Library drops
         * that pad (hug height); map Figma Small → `default` when composing from
         * nested instances. See link-button README.
         */
        default: [
          'text-[length:var(--text-paragraph-small-medium-font-size)]',
          'leading-[var(--text-paragraph-small-medium-line-height)]',
          'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
          '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
        ].join(' '),
        /**
         * Figma Size=Large — Paragraph Regular Regular (16/24).
         */
        lg: [
          'text-[length:var(--text-paragraph-regular-regular-font-size)]',
          'leading-[var(--text-paragraph-regular-regular-line-height)]',
          'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
          '[font-weight:var(--text-paragraph-regular-regular-font-weight)]',
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
