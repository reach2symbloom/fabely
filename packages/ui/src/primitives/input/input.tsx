/**
 * Fabely Input primitive — Base UI text field restyled from Figma Input
 * (`16:1738`) with the shadcn Input API.
 *
 * Vendor file (`src/components/ui/input.tsx`) stays untouched. Prepend /
 * append text stay on Input Group; Figma Decoration left / right are icon
 * slots on this control (`decorationLeft` / `decorationRight`).
 *
 * Figma axes → props:
 * - Size Regular | Large | Small | Mini → `size` default | large | small | mini
 * - Roundness Default | Round → `roundness`
 * - Style Default | Ghost | Quiet → `variant`
 */

'use client';

import * as React from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { selectAllOnModA } from '@/lib/select-all-on-mod-a';

const inputChrome = [
  'border-[length:var(--stroke-thin)] border-transparent',
  'outline-none transition-[color,background-color,border-color,box-shadow,opacity]',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  'group-has-disabled/field:opacity-50',
  /* Error — solid background + destructive border (Figma Error / Error Focus). */
  'aria-invalid:border-[color:var(--destructive)]',
  'aria-invalid:bg-[color:var(--background)]',
  'aria-invalid:focus-visible:shadow-[var(--effect-focus-ring-error)]',
].join(' ');

const inputShellChrome = [
  'flex w-full min-w-0 items-center',
  'border-[length:var(--stroke-thin)] border-transparent',
  'outline-none transition-[color,background-color,border-color,box-shadow,opacity]',
  'has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50',
  'group-has-disabled/field:opacity-50',
  /* Invalid via nested control (Figma Error). */
  'has-[[data-slot=input][aria-invalid=true]]:border-[color:var(--destructive)]',
  'has-[[data-slot=input][aria-invalid=true]]:bg-[color:var(--background)]',
  'has-[[data-slot=input][aria-invalid=true]]:[&_[data-slot=input-decoration-left]]:text-[color:var(--destructive)]',
  'has-[[data-slot=input][aria-invalid=true]]:[&_[data-slot=input-decoration-right]]:text-[color:var(--destructive)]',
].join(' ');

const inputVariants = cva(
  [
    'w-full min-w-0',
    inputChrome,
    'font-[family-name:var(--font-family-body)]',
    '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
    'text-[color:var(--foreground)]',
    'placeholder:text-[color:var(--muted-foreground)]',
    'file:inline-flex file:border-0 file:bg-transparent',
    'file:font-[family-name:var(--font-family-body)]',
    'file:[font-weight:var(--text-paragraph-small-medium-font-weight)]',
    'file:text-[color:var(--foreground)]',
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
        /**
         * Inline / in-chrome field: rest transparent, hover fills alpha-333
         * independently of focus. Focus is a semantic `--border` — no ring
         * and no extra fill (the value slot must not paint over prepend).
         */
        quiet: [
          'bg-transparent',
          'hover:bg-[color:var(--theme-alpha-black-switch-333)]',
          'focus-visible:border-[color:var(--border)]',
          'focus-visible:shadow-none',
          'aria-invalid:bg-[color:var(--background)]',
          'aria-invalid:hover:bg-[color:var(--background)]',
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
      {
        variant: 'quiet',
        class: [
          'focus-visible:border-[color:var(--border)]',
          'focus-visible:shadow-none',
        ].join(' '),
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      roundness: 'default',
    },
  },
);

/** Shell when Figma Decoration left / right are present. */
const inputShellVariants = cva(inputShellChrome, {
  variants: {
    variant: {
      default: [
        'bg-[color:var(--theme-alpha-black-switch-333)]',
        'focus-within:shadow-[var(--effect-focus-ring-secondary)]',
        'has-[[data-slot=input][aria-invalid=true]]:focus-within:shadow-[var(--effect-focus-ring-error)]',
      ].join(' '),
      ghost: [
        'bg-transparent',
        'focus-within:bg-[color:var(--theme-alpha-black-switch-333)]',
        'focus-within:border-[color:var(--theme-alpha-black-switch-333)]',
        'focus-within:shadow-[var(--effect-focus-ring-secondary)]',
        'has-[[data-slot=input][aria-invalid=true]]:bg-[color:var(--background)]',
        'has-[[data-slot=input][aria-invalid=true]]:focus-within:shadow-[var(--effect-focus-ring-error)]',
      ].join(' '),
      quiet: [
        'bg-transparent',
        'hover:bg-[color:var(--theme-alpha-black-switch-333)]',
        'focus-within:border-[color:var(--border)]',
        'focus-within:shadow-none',
        'has-[[data-slot=input][aria-invalid=true]]:bg-[color:var(--background)]',
        'has-[[data-slot=input][aria-invalid=true]]:hover:bg-[color:var(--background)]',
        'has-[[data-slot=input][aria-invalid=true]]:focus-within:shadow-[var(--effect-focus-ring-error)]',
      ].join(' '),
    },
    size: {
      mini: [
        'h-[length:var(--spacing-xl)]',
        'min-h-[length:var(--spacing-xl)]',
        'gap-[var(--spacing-2xs)]',
        'px-[var(--spacing-1-5)]',
      ].join(' '),
      small: [
        'h-[length:var(--spacing-2xl)]',
        'min-h-[length:var(--spacing-2xl)]',
        'gap-[var(--spacing-1-5)]',
        'px-[var(--spacing-xs)]',
      ].join(' '),
      default: [
        'h-[length:var(--spacing-3xl)]',
        'min-h-[length:var(--spacing-9)]',
        'gap-[var(--spacing-xs)]',
        'px-[var(--spacing-sm)]',
      ].join(' '),
      large: [
        'h-[length:var(--spacing-4xl)]',
        'min-h-[length:var(--spacing-3xl)]',
        'gap-[var(--spacing-sm)]',
        'px-[var(--spacing-md)]',
      ].join(' '),
    },
    roundness: {
      default: [
        'rounded-[length:var(--rounded-lg)]',
        'focus-within:border-[color:var(--neutrals-new-400)]',
      ].join(' '),
      round: [
        'rounded-[length:var(--rounded-full)]',
        'focus-within:border-[color:var(--theme-alpha-black-switch-15)]',
      ].join(' '),
    },
  },
  compoundVariants: [
    {
      roundness: 'default',
      size: 'mini',
      class: 'rounded-[length:var(--rounded-md)]',
    },
    {
      variant: 'quiet',
      class: [
        'focus-within:border-[color:var(--border)]',
        'focus-within:shadow-none',
      ].join(' '),
    },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'default',
    roundness: 'default',
  },
});

const inputFieldVariants = cva(
  [
    'min-w-0 flex-1 bg-transparent',
    'border-0 shadow-none outline-none',
    'font-[family-name:var(--font-family-body)]',
    '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
    'text-[color:var(--foreground)]',
    'placeholder:text-[color:var(--muted-foreground)]',
    'disabled:cursor-not-allowed',
    'file:inline-flex file:border-0 file:bg-transparent',
    'file:font-[family-name:var(--font-family-body)]',
    'file:[font-weight:var(--text-paragraph-small-medium-font-weight)]',
    'file:text-[color:var(--foreground)]',
  ].join(' '),
  {
    variants: {
      size: {
        mini: [
          'h-full py-0',
          'text-[length:var(--text-paragraph-mini-regular-font-size)]',
          'leading-[var(--text-paragraph-mini-regular-line-height)]',
          'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
          'file:text-[length:var(--text-paragraph-mini-medium-font-size)]',
        ].join(' '),
        small: [
          'h-full py-0',
          'text-[length:var(--text-paragraph-small-regular-font-size)]',
          'leading-[var(--text-paragraph-small-regular-line-height)]',
          'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
          'file:text-[length:var(--text-paragraph-small-medium-font-size)]',
        ].join(' '),
        default: [
          'h-full py-0',
          'text-[length:var(--text-paragraph-small-regular-font-size)]',
          'leading-[var(--text-paragraph-small-regular-line-height)]',
          'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
          'file:text-[length:var(--text-paragraph-small-medium-font-size)]',
        ].join(' '),
        large: [
          'h-full py-0',
          'text-[length:var(--text-paragraph-regular-regular-font-size)]',
          'leading-[var(--text-paragraph-regular-regular-line-height)]',
          'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
          'file:text-[length:var(--text-paragraph-regular-medium-font-size)]',
        ].join(' '),
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

const inputDecorationVariants = cva(
  [
    /* Open Decorations slot — bare SVG scales with Input size; interactive kids size themselves. */
    'flex shrink-0 items-center justify-center',
    'text-[color:var(--muted-foreground)]',
    '[&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      size: {
        /* Figma locks Decorations at 16 (--icon-sm); we step mini→xs and large→md (20 max). */
        mini: "[&_svg:not([class*='size-'])]:size-[length:var(--icon-xs)]",
        small: "[&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
        default: "[&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
        large: "[&_svg:not([class*='size-'])]:size-[length:var(--icon-md)]",
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

type InputProps = Omit<React.ComponentProps<'input'>, 'size'> &
  VariantProps<typeof inputVariants> & {
    /** Figma Decorations left — open slot (icon, Fade Button, …). */
    decorationLeft?: React.ReactNode;
    /** Figma Decorations right — open slot (icon, Fade Button, …). */
    decorationRight?: React.ReactNode;
  };

function Input({
  className,
  type,
  variant = 'default',
  size = 'default',
  roundness = 'default',
  decorationLeft,
  decorationRight,
  onKeyDownCapture,
  ...props
}: InputProps) {
  const hasDecoration = decorationLeft != null || decorationRight != null;

  const handleKeyDownCapture = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    selectAllOnModA(event);
    onKeyDownCapture?.(event);
  };

  if (!hasDecoration) {
    return (
      <InputPrimitive
        type={type}
        data-slot="input"
        data-variant={variant}
        data-size={size}
        data-roundness={roundness}
        className={cn(
          inputVariants({ variant, size, roundness }),
          'select-text',
          className,
        )}
        onKeyDownCapture={handleKeyDownCapture}
        {...props}
      />
    );
  }

  return (
    <div
      data-slot="input-control"
      data-variant={variant}
      data-size={size}
      data-roundness={roundness}
      className={cn(inputShellVariants({ variant, size, roundness }), className)}
    >
      {decorationLeft != null ? (
        <span data-slot="input-decoration-left" className={inputDecorationVariants({ size })}>
          {decorationLeft}
        </span>
      ) : null}
      <InputPrimitive
        type={type}
        data-slot="input"
        data-variant={variant}
        data-size={size}
        data-roundness={roundness}
        className={cn(inputFieldVariants({ size }), 'select-text')}
        onKeyDownCapture={handleKeyDownCapture}
        {...props}
      />
      {decorationRight != null ? (
        <span
          data-slot="input-decoration-right"
          className={inputDecorationVariants({ size })}
        >
          {decorationRight}
        </span>
      ) : null}
    </div>
  );
}

export { Input, inputVariants };
export type { InputProps };
