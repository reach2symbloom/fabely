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
 * Shared variants: `../shared` (`buttonVariantClasses`), plus Icon-only
 * `fade` from Figma Fade button (`12042:25189`).
 */
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  buttonVariantClasses,
  type ButtonRoundness,
} from '../shared';

/**
 * Shared Button variants plus Icon-only `fade` (Figma Fade button).
 * Fade is not on Text Button — rest is a quieter icon, not a labeled face.
 */
export type IconButtonVariant = keyof typeof buttonVariantClasses | 'fade';

/**
 * Figma Fade button (`12042:25189`) — rest is Figma alpha-40, hover alpha-100.
 * Color stays opaque `--theme-alpha-black-switch-100`; rest uses
 * `--opacity-fade` on the SVG so overlapping Lucide strokes (Plus, X)
 * composite as one glyph. Painting alpha-40 as `currentColor` would darken
 * the crossing. No hover fill (unlike Ghost). Face fill is Ghost’s
 * near-invisible `--theme-alpha-white-switch-001`.
 */
const fadeVariantClasses = [
  'bg-[var(--theme-alpha-white-switch-001)] border-transparent',
  'text-[color:var(--theme-alpha-black-switch-100)]',
  '[&_svg]:opacity-[var(--opacity-fade)]',
  '[&_svg]:transition-opacity [&_svg]:duration-fast [&_svg]:ease-emphasized',
  'hover:[&_svg]:opacity-100',
  'active:[&_svg]:opacity-100',
  'data-[pressed]:[&_svg]:opacity-100',
  'focus-visible:[&_svg]:opacity-100',
  'disabled:[&_svg]:opacity-100',
  'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
];

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
        fade: fadeVariantClasses,
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
        /* Icon steps up from sm (`--icon-sm` → `--icon-md`). Pad `--spacing-1-5`
           (not xs): 8+8+20+border exceeds 36 border-box. */
        default: [
          'size-[length:var(--spacing-9)]',
          'p-[var(--spacing-1-5)]',
          "[&_svg:not([class*='size-'])]:size-[length:var(--icon-md)]",
        ],
        /* Icon steps up from default (`--icon-md` → `--icon-lg`). Pad
           `--spacing-1-5` (not xs): 8+8+24+border exceeds 40 border-box. */
        lg: [
          'size-[length:var(--spacing-3xl)]',
          'p-[var(--spacing-1-5)]',
          "[&_svg:not([class*='size-'])]:size-[length:var(--icon-lg)]",
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
