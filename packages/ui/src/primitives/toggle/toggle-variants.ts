/**
 * Shared Toggle chrome — Figma Toggle Button (`816:112827`) Position=Single.
 * Consumed by Toggle and Toggle Group items so skins stay aligned.
 */
import { cva, type VariantProps } from 'class-variance-authority';

export type ToggleRoundness = 'default' | 'round';

/**
 * Item / standalone skins — Figma Skin=Ghost → `ghost`; Skin=Outline → `outline`.
 * Active fill is quiet `@5` (Figma Active?=Yes).
 */
const toggleVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center',
    'gap-[length:var(--spacing-xs)]',
    'font-[family-name:var(--font-family-body)]',
    '[font-weight:var(--font-weight-paragraph-medium)]',
    'whitespace-nowrap',
    'text-[color:var(--foreground)]',
    'outline-none select-none',
    'transition-[color,background-color,border-color,opacity,box-shadow]',
    'duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-current',
    "[&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
    'hover:bg-[var(--theme-alpha-black-switch-5)]',
    'data-pressed:bg-[var(--theme-alpha-black-switch-5)]',
    'aria-pressed:bg-[var(--theme-alpha-black-switch-5)]',
    'focus-visible:z-10',
    'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
  ].join(' '),
  {
    variants: {
      variant: {
        /** Figma Skin=Ghost — near-invisible face until hover / pressed. */
        ghost: [
          'bg-[var(--theme-alpha-white-switch-001)]',
          'border border-transparent',
        ].join(' '),
        /** Figma Skin=Outline — stroke + quiet active fill. */
        outline: [
          'border-[length:var(--stroke-thin)] border-[color:var(--border)]',
          'bg-transparent',
        ].join(' '),
      },
      size: {
        /** Figma Size=Small (32). */
        sm: [
          'h-[length:var(--spacing-2xl)] min-w-[length:var(--spacing-2xl)]',
          'gap-[length:var(--spacing-1-5)]',
          'px-[length:var(--spacing-1-5)] py-[length:var(--spacing-1-375)]',
          'text-[length:var(--text-paragraph-small-medium-font-size)]',
          'leading-[var(--text-paragraph-small-medium-line-height)]',
          'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
          'has-data-[icon=inline-end]:pe-[length:var(--spacing-xs)]',
          'has-data-[icon=inline-start]:ps-[length:var(--spacing-xs)]',
        ].join(' '),
        /** Figma Size=Default (36). */
        default: [
          'h-[length:var(--spacing-9)] min-w-[length:var(--spacing-9)]',
          'gap-[length:var(--spacing-xs)]',
          'px-[length:var(--spacing-xs)] py-[length:var(--spacing-1-875)]',
          'text-[length:var(--text-paragraph-small-medium-font-size)]',
          'leading-[var(--text-paragraph-small-medium-line-height)]',
          'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
          'has-data-[icon=inline-end]:pe-[length:var(--spacing-1-5)]',
          'has-data-[icon=inline-start]:ps-[length:var(--spacing-1-5)]',
        ].join(' '),
        /** Figma Size=Large (40). */
        lg: [
          'h-[length:var(--spacing-3xl)] min-w-[length:var(--spacing-3xl)]',
          'gap-[length:var(--spacing-xs)]',
          'px-[length:var(--spacing-sm)] py-[length:var(--spacing-2-375)]',
          'text-[length:var(--text-paragraph-small-medium-font-size)]',
          'leading-[var(--text-paragraph-small-medium-line-height)]',
          'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
          'has-data-[icon=inline-end]:pe-[length:var(--spacing-xs)]',
          'has-data-[icon=inline-start]:ps-[length:var(--spacing-xs)]',
        ].join(' '),
      },
      roundness: {
        /** Figma Roundness=Default — `--rounded-lg`. */
        default: 'rounded-[length:var(--rounded-lg)]',
        /** Figma Roundness=Round — pill / full round. */
        round: 'rounded-[length:var(--rounded-full)]',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'default',
      roundness: 'default',
    },
  }
);

type ToggleVariantsProps = VariantProps<typeof toggleVariants>;

export { toggleVariants, type ToggleVariantsProps };
