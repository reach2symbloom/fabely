/**
 * Fabely Input primitive — Base UI text field restyled from Figma Input
 * (`16:1738`) with the shadcn Input API.
 *
 * Vendor file (`src/components/ui/input.tsx`) stays untouched. Prepend /
 * append / decoration slots live on Input Group — not this control.
 *
 * Figma axes → props:
 * - Size Regular | Large | Small | Mini → `size` default | large | small | mini
 * - Roundness Default | Round → `roundness`
 * - Style Default | Ghost → `variant`
 */

'use client';

import { Input as InputPrimitive } from '@base-ui/react/input';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const inputVariants = cva(
  [
    'w-full min-w-0',
    'border-[length:var(--stroke-thin)] border-transparent',
    'font-[family-name:var(--font-family-body)]',
    '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
    'text-[color:var(--foreground)]',
    'placeholder:text-[color:var(--muted-foreground)]',
    'outline-none transition-[color,background-color,border-color,box-shadow,opacity]',
    'file:inline-flex file:border-0 file:bg-transparent',
    'file:font-[family-name:var(--font-family-body)]',
    'file:[font-weight:var(--text-paragraph-small-medium-font-weight)]',
    'file:text-[color:var(--foreground)]',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    'group-has-disabled/field:opacity-50',
    /* Error — solid background + destructive border (Figma Error / Error Focus). */
    'aria-invalid:border-[color:var(--destructive)]',
    'aria-invalid:bg-[color:var(--background)]',
    'aria-invalid:focus-visible:shadow-[var(--effect-focus-ring-error)]',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-[color:var(--theme-alpha-black-switch-333)]',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
        ].join(' '),
        ghost: [
          'bg-transparent',
          'focus-visible:bg-[color:var(--theme-alpha-black-switch-333)]',
          'focus-visible:border-[color:var(--theme-alpha-black-switch-333)]',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          'aria-invalid:bg-[color:var(--background)]',
        ].join(' '),
      },
      size: {
        mini: [
          'h-[length:var(--spacing-xl)]',
          'min-h-[length:var(--spacing-xl)]',
          'px-[var(--spacing-1-5)]',
          'text-[length:var(--text-paragraph-mini-regular-font-size)]',
          'leading-[var(--text-paragraph-mini-regular-line-height)]',
          'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
          'file:h-[length:var(--spacing-lg)]',
          'file:text-[length:var(--text-paragraph-mini-medium-font-size)]',
        ].join(' '),
        small: [
          'h-[length:var(--spacing-2xl)]',
          'min-h-[length:var(--spacing-2xl)]',
          'px-[var(--spacing-xs)]',
          'text-[length:var(--text-paragraph-small-regular-font-size)]',
          'leading-[var(--text-paragraph-small-regular-line-height)]',
          'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
          'file:h-[length:var(--spacing-xl)]',
          'file:text-[length:var(--text-paragraph-small-medium-font-size)]',
        ].join(' '),
        default: [
          'h-[length:var(--spacing-3xl)]',
          'min-h-[length:var(--spacing-9)]',
          'px-[var(--spacing-sm)]',
          'text-[length:var(--text-paragraph-small-regular-font-size)]',
          'leading-[var(--text-paragraph-small-regular-line-height)]',
          'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
          'file:h-[length:var(--spacing-2xl)]',
          'file:text-[length:var(--text-paragraph-small-medium-font-size)]',
        ].join(' '),
        large: [
          'h-[length:var(--spacing-4xl)]',
          'min-h-[length:var(--spacing-3xl)]',
          'px-[var(--spacing-md)]',
          'text-[length:var(--text-paragraph-regular-regular-font-size)]',
          'leading-[var(--text-paragraph-regular-regular-line-height)]',
          'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
          'file:h-[length:var(--spacing-3xl)]',
          'file:text-[length:var(--text-paragraph-regular-medium-font-size)]',
        ].join(' '),
      },
      roundness: {
        default: [
          'rounded-[length:var(--rounded-lg)]',
          'focus-visible:border-[color:var(--neutrals-new-400)]',
        ].join(' '),
        round: [
          'rounded-[length:var(--rounded-full)]',
          'focus-visible:border-[color:var(--theme-alpha-black-switch-15)]',
        ].join(' '),
      },
    },
    compoundVariants: [
      {
        roundness: 'default',
        size: 'mini',
        class: 'rounded-[length:var(--rounded-md)]',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      roundness: 'default',
    },
  },
);

type InputProps = Omit<React.ComponentProps<'input'>, 'size'> &
  VariantProps<typeof inputVariants>;

function Input({
  className,
  type,
  variant = 'default',
  size = 'default',
  roundness = 'default',
  ...props
}: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-variant={variant}
      data-size={size}
      data-roundness={roundness}
      className={cn(inputVariants({ variant, size, roundness }), className)}
      {...props}
    />
  );
}

export { Input, inputVariants };
export type { InputProps };
