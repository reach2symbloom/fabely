/**
 * Fabely Icon Button — icon-only control in the Button family.
 *
 * Figma set (page Icon Button / 9:775) defines a 5-variant subset.
 * Library is master: full shared variant surface (including `outline` from
 * Button Group Figma). Interaction model matches Text Button (see README).
 *
 * Size slots share vocabulary with Text Button (`mini` / `default`); values
 * are Icon Button’s own (28 / 32 / 36 / 40). See docs/DESIGN.md “Size slots”.
 *
 * Shared variants: `../shared` (`buttonVariantClasses`), plus Icon-only
 * `fade` / `fadeGold` from Figma Fade button (`12042:25189`), and `glow`
 * (lavender halo — Resume Writing Button go-control).
 */
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  buttonVariantClasses,
  type ButtonRoundness,
} from '../shared';

/**
 * Shared Button variants plus Icon-only `fade` / `fadeGold` (Figma Fade button)
 * and `glow` (lavender halo).
 */
export type IconButtonVariant =
  | keyof typeof buttonVariantClasses
  | 'subtleFilled'
  | 'fade'
  | 'fadeGold'
  | 'glow';

/**
 * Quiet filled face for icon affordances that must remain visibly distinct
 * from bare glyphs at rest. Unlike Ghost, the circular/roundrect surface is
 * always present; direct interaction deepens that same semantic alpha fill.
 */
const subtleFilledVariantClasses = [
  'bg-[color:var(--theme-alpha-black-switch-333)] border-transparent',
  'text-[color:var(--muted-foreground)]',
  'hover:bg-[color:var(--theme-alpha-black-switch-5)] hover:text-[color:var(--foreground)]',
  'active:bg-[color:var(--theme-alpha-black-switch-10)] active:text-[color:var(--foreground)]',
  'data-[pressed]:bg-[color:var(--theme-alpha-black-switch-10)] data-[pressed]:text-[color:var(--foreground)]',
  'focus-visible:bg-[color:var(--theme-alpha-black-switch-5)] focus-visible:text-[color:var(--foreground)]',
  'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
  'disabled:opacity-50',
];

/**
 * Figma Fade button (`12042:25189`) — rest is Figma alpha-40, hover alpha-100.
 * Color stays opaque `--theme-alpha-black-switch-100`; rest uses
 * `--opacity-fade` on the SVG so overlapping Lucide strokes (Plus, X)
 * composite as one glyph. Painting alpha-40 as `currentColor` would darken
 * the crossing. No hover fill (unlike Ghost). Face fill is Ghost’s
 * near-invisible `--theme-alpha-white-switch-001`.
 *
 * `fadeGold` is the same rest; hover / pressed / focus paint the glyph
 * `--primary` at full opacity.
 */
const fadeFaceClasses = [
  'bg-[var(--theme-alpha-white-switch-001)] border-transparent',
  '[&_svg]:opacity-[var(--opacity-fade)]',
  '[&_svg]:transition-[opacity,color] [&_svg]:duration-fast [&_svg]:ease-emphasized',
  'hover:[&_svg]:opacity-100',
  'active:[&_svg]:opacity-100',
  'data-[pressed]:[&_svg]:opacity-100',
  'focus-visible:[&_svg]:opacity-100',
  'disabled:[&_svg]:opacity-100',
  'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
];

const fadeVariantClasses = [
  ...fadeFaceClasses,
  'text-[color:var(--theme-alpha-black-switch-100)]',
];

const fadeGoldVariantClasses = [
  ...fadeFaceClasses,
  'text-[color:var(--theme-alpha-black-switch-100)]',
  'hover:text-[color:var(--primary)]',
  'active:text-[color:var(--primary)]',
  'data-[pressed]:text-[color:var(--primary)]',
  'focus-visible:text-[color:var(--primary)]',
];

/**
 * Icon-only `glow` — opaque face, hairline secondary ring, lavender halo.
 * Halo is a drop-shadow so the secondary focus ring can still use
 * `box-shadow`. `overflow-visible` so the halo is not clipped.
 *
 * `group-hover` / `group-data-[force-hover=true]` let a parent hit-target
 * (Resume Writing Button) widen the halo without nesting a real button.
 */
const glowVariantClasses = [
  'overflow-visible',
  'bg-[color:var(--background)]',
  'border-[length:var(--stroke-hairline)]',
  'border-[color:color-mix(in_srgb,var(--tw-raw-secondary-200)_42%,transparent)]',
  'text-[color:var(--tw-raw-secondary-200)]',
  'drop-shadow-[0_0_4px_color-mix(in_srgb,var(--tw-raw-pantones-lavendar)_50%,transparent)]',
  'hover:drop-shadow-[0_0_12px_color-mix(in_srgb,var(--tw-raw-pantones-lavendar)_40%,transparent)]',
  'active:drop-shadow-[0_0_12px_color-mix(in_srgb,var(--tw-raw-pantones-lavendar)_40%,transparent)]',
  'data-[pressed]:drop-shadow-[0_0_12px_color-mix(in_srgb,var(--tw-raw-pantones-lavendar)_40%,transparent)]',
  'group-hover:drop-shadow-[0_0_12px_color-mix(in_srgb,var(--tw-raw-pantones-lavendar)_40%,transparent)]',
  'group-data-[force-hover=true]:drop-shadow-[0_0_12px_color-mix(in_srgb,var(--tw-raw-pantones-lavendar)_40%,transparent)]',
  '[&_svg]:origin-center [&_svg]:transition-transform [&_svg]:duration-fast [&_svg]:ease-emphasized',
  'hover:[&_svg]:scale-125',
  'active:[&_svg]:scale-125',
  'data-[pressed]:[&_svg]:scale-125',
  'group-hover:[&_svg]:scale-125',
  'group-data-[force-hover=true]:[&_svg]:scale-125',
  'motion-reduce:[&_svg]:transition-none',
  'motion-reduce:hover:[&_svg]:scale-100 motion-reduce:active:[&_svg]:scale-100',
  'motion-reduce:data-[pressed]:[&_svg]:scale-100',
  'motion-reduce:group-hover:[&_svg]:scale-100',
  'motion-reduce:group-data-[force-hover=true]:[&_svg]:scale-100',
  'transition-[color,background-color,border-color,opacity,box-shadow,filter]',
  'duration-fast ease-emphasized',
  'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
  'disabled:opacity-50',
];

/** Shared size vocabulary — slots this control implements. */
export type IconButtonSize = 'mini' | 'sm' | 'default' | 'lg';

export type IconButtonRoundness = ButtonRoundness;

const iconButtonVariants = cva(
  [
    'group/icon-button inline-flex shrink-0 cursor-pointer items-center justify-center',
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
        subtleFilled: subtleFilledVariantClasses,
        fade: fadeVariantClasses,
        fadeGold: fadeGoldVariantClasses,
        glow: glowVariantClasses,
      },
      size: {
        /* 28, not the `--spacing-xl` (24) rest of the scale would suggest —
           4+4+16+border(2) = 26 doesn't fit 24 for a 16px (`--icon-sm`)
           glyph, the size used whenever a caller opts out of this size's
           own forced `--icon-xs` (12px) via a `size-` className. */
        mini: [
          'size-[length:var(--spacing-7)]',
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
