/**
 * Fabely Text Button — labeled control in the Button family.
 *
 * Visual source of truth: Figma "Button"
 * (file gV94L0qCmvwQkddNbEktry, page Button / set 9:1071).
 * Interaction model (hover / pressed) is library-authored — see README
 * and docs/DESIGN.md (Figma had no pressed state).
 *
 * Exported as `Button` (component name unchanged). Icon Button is the
 * sibling under this family. Shared variants live in `../shared`.
 */
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { buttonVariantClasses } from '../shared';
/**
 * Size slots — shared vocabulary with Icon Button (`mini` / `default` overlap;
 * each component owns its own values). See docs/DESIGN.md “Size slots”.
 */
export type ButtonSize = 'mini' | 'small' | 'default' | 'large' | 'extraLarge';
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
      variant: buttonVariantClasses,
      size: {
        mini: [
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
