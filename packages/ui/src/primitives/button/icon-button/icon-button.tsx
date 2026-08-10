/**
 * Fabely Icon Button — icon-only control in the Button family.
 *
 * Figma set (page Icon Button / 9:775) defines a 5-variant subset.
 * Library is master: full shared variant surface (including `outline` from
 * Button Group Figma). Interaction model matches Text Button (see README).
 *
 * Size slots share vocabulary with Text Button (`mini` / `default`); values
 * are Icon Button’s own (24 / 32 / 36 / 40). See docs/DESIGN.md “Size slots”.
 *
 * Shared variants: `../shared` (`buttonVariantClasses`).
 */
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  buttonVariantClasses,
  type ButtonRoundness,
} from '../shared';

/** Same variant axis as Text Button (shared `buttonVariantClasses`). */
export type IconButtonVariant = keyof typeof buttonVariantClasses;

/** Shared size vocabulary — slots this control implements. */
export type IconButtonSize = 'mini' | 'sm' | 'default' | 'lg';

export type IconButtonRoundness = ButtonRoundness;

const iconButtonVariants = cva(
  [
    'group/icon-button inline-flex shrink-0 items-center justify-center',
    /*
     * `min-h-0` + `overflow-hidden` — flex min-content otherwise grows past
     * `size-*` when pad+glyph+border exceed the box (Button Group rows).
     */
    'box-border min-h-0 min-w-0 overflow-hidden',
    'border border-transparent',
    'transition-[color,background-color,border-color,opacity,box-shadow]',
    'outline-none select-none',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-current',
  ],
  {
    variants: {
      variant: {
        ...buttonVariantClasses,
      },
      size: {
        mini: [
          'size-[length:var(--spacing-xl)]',
          'p-[var(--spacing-2xs)]',
          "[&_svg:not([class*='size-'])]:size-[length:var(--icon-xs)]",
        ],
        sm: [
          'size-[length:var(--spacing-2xl)]',
          'p-[var(--spacing-xs)]',
          "[&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
        ],
        default: [
          'size-[length:var(--spacing-9)]',
          'p-[var(--spacing-xs)]',
          "[&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
        ],
        /* Pad `--spacing-xs` (not 2-5): 10+10+20+border exceeds 40 border-box. */
        lg: [
          'size-[length:var(--spacing-3xl)]',
          'p-[var(--spacing-xs)]',
          "[&_svg:not([class*='size-'])]:size-[length:var(--icon-md)]",
        ],
      },
      roundness: {
        default: '',
        round: 'rounded-[var(--rounded-full)]',
      },
    },
    compoundVariants: [
      {
        roundness: 'default',
        size: 'mini',
        class: 'rounded-[var(--rounded-sm)]',
      },
      {
        roundness: 'default',
        size: 'sm',
        class: 'rounded-[var(--rounded-lg)]',
      },
      {
        roundness: 'default',
        size: 'default',
        class: 'rounded-[var(--rounded-lg)]',
      },
      {
        roundness: 'default',
        size: 'lg',
        class: 'rounded-[var(--rounded-lg)]',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      roundness: 'default',
    },
  }
);

type IconButtonProps = Omit<ButtonPrimitive.Props, 'className'> &
  VariantProps<typeof iconButtonVariants> & {
    className?: string;
    /** Required — icon-only control has no visible text label. */
    'aria-label': string;
  };

function IconButton({
  className,
  variant = 'primary',
  size = 'default',
  roundness = 'default',
  'aria-label': ariaLabel,
  ...props
}: IconButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="icon-button"
      data-variant={variant}
      data-size={size}
      data-roundness={roundness}
      aria-label={ariaLabel}
      className={cn(iconButtonVariants({ variant, size, roundness }), className)}
      {...props}
    />
  );
}

export { IconButton, iconButtonVariants };
export type { IconButtonProps };
