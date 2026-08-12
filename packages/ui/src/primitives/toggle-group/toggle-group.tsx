/**
 * Fabely Toggle Group — exclusive / multi option toggles in one cluster.
 *
 * API ground truth: shadcn Toggle Group (Base UI)
 * (https://ui.shadcn.com/docs/components/base/toggle-group).
 * Base UI uses `multiple` (not Radix `type`); single = default.
 *
 * Visual source: Figma **Toggle & Toggle Group**
 * ([Toggle Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=816-112827)
 * `816:112827`) — Skin Outline / Ghost, Size, Position, Active, Roundness.
 * Position is derived via sibling CSS when `spacing={0}` (connected).
 *
 * Item chrome lives here — partner [Toggle](../toggle/README.md) is still
 * thin-pass. Vendor (`src/components/ui/toggle-group.tsx`) stays untouched.
 */
'use client';

import * as React from 'react';
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export type ToggleGroupRoundness = 'default' | 'round';

/**
 * Item skins — Figma Skin=Ghost → `default`; Skin=Outline → `outline`.
 * Active fill is quiet `@5` (Figma Active?=Yes).
 */
const toggleGroupItemVariants = cva(
  [
    'group/toggle-group-item inline-flex shrink-0 items-center justify-center',
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
        default: [
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
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleGroupItemVariants> & {
    spacing?: number;
    orientation?: 'horizontal' | 'vertical';
    roundness?: ToggleGroupRoundness;
  }
>({
  size: 'default',
  variant: 'default',
  spacing: 2,
  orientation: 'horizontal',
  roundness: 'default',
});

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 2,
  orientation = 'horizontal',
  roundness = 'default',
  children,
  style,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleGroupItemVariants> & {
    spacing?: number;
    orientation?: 'horizontal' | 'vertical';
    /** Figma Roundness — `default` roundrect; `round` pill / full round. */
    roundness?: ToggleGroupRoundness;
  }) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      data-roundness={roundness}
      orientation={orientation}
      style={
        {
          ...style,
          ['--gap' as string]: spacing,
        } as React.CSSProperties
      }
      className={cn(
        [
          'group/toggle-group flex w-fit items-center',
          /* spacing units × --spacing-2xs (4px) — shadcn default spacing=2 → 8px. */
          'gap-[length:calc(var(--spacing-2xs)*var(--gap))]',
          /* Base UI sets data-orientation — not a bare data-vertical attribute. */
          'data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
          /*
           * Connected — outer shell owns radius + clip. overflow-clip contains
           * item fills, internal borders, and focus rings.
           */
          'data-[spacing=0]:relative data-[spacing=0]:isolate',
          'data-[spacing=0]:overflow-clip',
          'data-[spacing=0]:rounded-[length:var(--rounded-lg)]',
          'data-[spacing=0]:data-[roundness=round]:rounded-[length:var(--rounded-full)]',
          /* Outline (any roundness) — shell stroke follows clipped radius. */
          'data-[spacing=0]:data-[variant=outline]:border-[length:var(--stroke-thin)]',
          'data-[spacing=0]:data-[variant=outline]:border-[color:var(--border)]',
          /*
           * Round + connected — also stroke the shell for Ghost so the outer
           * ring frames circular items with no inner dividers.
           */
          'data-[spacing=0]:data-[roundness=round]:data-[variant=default]:border-[length:var(--stroke-thin)]',
          'data-[spacing=0]:data-[roundness=round]:data-[variant=default]:border-[color:var(--border)]',
        ].join(' '),
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ variant, size, spacing, orientation, roundness }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant = 'default',
  size = 'default',
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleGroupItemVariants>) {
  const context = React.useContext(ToggleGroupContext);
  const resolvedVariant = context.variant || variant;
  const resolvedSize = context.size || size;
  const roundness = context.roundness ?? 'default';
  const connected = context.spacing === 0;
  const connectedRound = connected && roundness === 'round';

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      data-spacing={context.spacing}
      data-roundness={roundness}
      className={cn(
        toggleGroupItemVariants({
          variant: resolvedVariant,
          size: resolvedSize,
        }),
        /* Spaced / connected-round — circular (or pill) faces. */
        roundness === 'round'
          ? 'rounded-[length:var(--rounded-full)]'
          : 'rounded-[length:var(--rounded-lg)]',
        /* Connected + default roundness — square items; group clips the shell. */
        connected && roundness === 'default' && 'rounded-none shadow-none',
        connectedRound && 'shadow-none border-transparent',
        /*
         * Connected + outline + default roundness — internal dividers only.
         * Round connected keeps outer shell border only (no inner borders).
         */
        connected &&
          roundness === 'default' &&
          resolvedVariant === 'outline' && [
            'border-0',
            'group-data-[orientation=horizontal]/toggle-group:border-s-[length:var(--stroke-thin)]',
            'group-data-[orientation=horizontal]/toggle-group:border-s-[color:var(--border)]',
            'group-data-[orientation=horizontal]/toggle-group:first:border-s-0',
            'group-data-[orientation=vertical]/toggle-group:border-t-[length:var(--stroke-thin)]',
            'group-data-[orientation=vertical]/toggle-group:border-t-[color:var(--border)]',
            'group-data-[orientation=vertical]/toggle-group:first:border-t-0',
          ],
        className
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
}

export {
  ToggleGroup,
  ToggleGroupItem,
  toggleGroupItemVariants,
};
