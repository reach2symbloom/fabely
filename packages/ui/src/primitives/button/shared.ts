/**
 * Shared Button-family building blocks — consumed by Text Button and
 * Icon Button so the eight-variant interaction model stays unified.
 *
 * Lives at the family root (`src/primitives/button/shared.ts`), not inside
 * either sibling, so neither owns the other.
 */

/** Shared Variant axis (8 values). No `link` — Button Link is a separate set. */
export type ButtonVariant =
  | 'primary'
  | 'primaryOutline'
  | 'secondary'
  | 'tertiary'
  | 'outline'
  | 'ghost'
  | 'fiaGhost'
  | 'destructive'
  | 'fiaFilled'
  | 'fiaOutline';

/** Shared Roundness axis — Default / Round. Each sibling owns radius values. */
export type ButtonRoundness = 'default' | 'round';

/**
 * Gradient border (Primary outline) — mask-composite ring on `::before`:
 *   background: var(--gradient-primary-top-bottom) border-box;
 *   mask: linear-gradient(#000 0 0) padding-box exclude, linear-gradient(#000 0 0);
 * Transparent button face; surface shows through. Ring is on `::before`
 * (not the button) so the mask does not hide label text. Negative inset
 * aligns the pseudo to the button's border-box. WebKit: xor composite.
 */
export const GRADIENT_BORDER = [
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
export const QUIET_INTERACTION = [
  'hover:bg-[var(--theme-alpha-black-switch-5)]',
  'active:bg-[var(--theme-alpha-black-switch-10)]',
  'data-[pressed]:bg-[var(--theme-alpha-black-switch-10)]',
].join(' ');

/**
 * Shared variant styles — Text Button and Icon Button both spread these.
 */
export const buttonVariantClasses = {
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
  /**
   * Figma Button Group Variant=Outline (`784:82792`) — quiet fill + `--border`.
   * Shared by Text Button and Icon Button (Icon’s former local `outline`
   * converges here).
   */
  outline: [
    'bg-[var(--theme-alpha-black-switch-333)]',
    'border-[length:var(--stroke-thin)] border-[color:var(--border)]',
    'text-muted-foreground',
    QUIET_INTERACTION,
    'hover:text-foreground',
    'active:text-foreground data-[pressed]:text-foreground',
    'focus-visible:text-foreground',
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
  fiaGhost: [
    'bg-[var(--theme-alpha-white-switch-001)] border-transparent',
    'text-[color:var(--tw-raw-fia-200)]',
    QUIET_INTERACTION,
    'hover:text-[color:var(--tw-raw-fia-200)]',
    'active:text-[color:var(--tw-raw-fia-200)] data-[pressed]:text-[color:var(--tw-raw-fia-200)]',
    'focus-visible:text-[color:var(--tw-raw-fia-200)]',
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
} as const;
