/**
 * Fabely Switch Light — soft-track binary control with optional opposite-side
 * icon (Figma **Toggle Light**).
 *
 * Visual source: Figma **Toggle Light**
 * ([Toggle Light](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=5846-24869)
 * `5846:24869`) — State × Icon × Size (Mini / Regular).
 *
 * Active chrome: Figma
 * ([5846:24890](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=5846-24890))
 * — soft alpha track, hollow neutrals rim (greyscale only).
 *
 * Motion: Figma Smart Animate on Toggle Light reactions —
 * `duration: 300ms` (`--duration-normal`) · `EASE_OUT` (`--ease-out`).
 * Thumb + icon share one translate axis (icon mirrors thumb travel).
 *
 * Composes Base UI Switch (same API ground as [Switch](./switch.tsx)). Prefer
 * standard Switch for form settings; use Switch Light for light/soft chrome
 * (e.g. theme / ambient toggles).
 */
'use client';

import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type SwitchLightSize = 'sm' | 'default';

type SwitchLightProps = SwitchPrimitive.Root.Props & {
  /**
   * Figma Size — Mini → `sm` (24 tall), Regular → `default` (32 tall).
   */
  size?: SwitchLightSize;
  /**
   * Decorative glyph opposite the thumb (Figma Icon=True). Omit for Icon=False.
   */
  icon?: ReactNode;
};

function SwitchLight({
  className,
  size = 'default',
  icon,
  ...props
}: SwitchLightProps) {
  const hasIcon = icon != null;

  return (
    <SwitchPrimitive.Root
      data-slot="switch-light"
      data-size={size}
      data-icon={hasIcon ? 'true' : 'false'}
      className={cn(
        [
          'peer group/switch-light relative inline-flex shrink-0 items-center',
          'rounded-[length:var(--rounded-full)]',
          'border-[length:var(--stroke-thin)] border-solid',
          'outline-none',
          'transition-[background-color,border-color,box-shadow,opacity]',
          /* Figma Smart Animate — 300ms EASE_OUT. */
          'duration-[var(--duration-normal)] ease-[var(--ease-out)]',
          /* Expanded hit target. */
          'after:absolute after:-inset-x-3 after:-inset-y-2',
          /*
           * Soft greyscale track (Figma 5846:24890) — no messaging / primary tint.
           * Off is the same chrome, dimmed; on is full strength.
           */
          'bg-[color:var(--theme-alpha-white-no-switch-5)]',
          'border-[color:var(--theme-alpha-black-switch-333)]',
          'data-unchecked:opacity-[var(--opacity-focus-ring-rest)]',
          'data-unchecked:hover:opacity-[var(--opacity-pressed)]',
          'data-checked:opacity-100',
          'data-checked:hover:border-[color:var(--theme-alpha-white-no-switch-10)]',
          'data-checked:hover:bg-[color:var(--theme-alpha-white-no-switch-10)]',
          /* Focus — soft white-alpha ring (no chromatic glow). */
          'focus-visible:shadow-[0_0_0_var(--stroke-medium)_var(--theme-alpha-white-no-switch-15)]',
          /* Disabled. */
          'data-disabled:cursor-not-allowed data-disabled:opacity-[var(--opacity-focus-ring-rest)]',
          'group-has-disabled/field:opacity-[var(--opacity-focus-ring-rest)]',
          /* Padding — Figma ~3–4px inset. */
          'p-[length:var(--spacing-0-75)]',
          /* Mini — 24 tall; 40 / 42 wide. */
          'data-[size=sm]:h-[length:var(--spacing-xl)]',
          'data-[size=sm]:data-[icon=false]:w-[length:var(--spacing-3xl)]',
          'data-[size=sm]:data-[icon=true]:w-[length:calc(var(--spacing-3xl)+var(--spacing-3xs))]',
          /* Regular — 32 tall; 56 / 60 wide. */
          'data-[size=default]:h-[length:var(--spacing-2xl)]',
          'data-[size=default]:data-[icon=false]:w-[length:calc(var(--spacing-2xl)+var(--spacing-xl))]',
          'data-[size=default]:data-[icon=true]:w-[length:calc(var(--spacing-2xl)+var(--spacing-xl)+var(--spacing-2xs))]',
        ].join(' '),
        className
      )}
      {...props}
    >
      {hasIcon ? (
        <span
          data-slot="switch-light-icon"
          aria-hidden
          className={cn(
            [
              'pointer-events-none absolute top-1/2',
              'start-[length:var(--spacing-0-75)]',
              'flex -translate-y-1/2 items-center justify-center',
              'text-[color:var(--theme-neutrals-500)]',
              /* Slide with thumb (mirrored) — don’t swap inset sides. */
              'transition-[transform,translate,opacity,color]',
              'duration-[var(--duration-normal)] ease-[var(--ease-out)]',
              'group-data-unchecked/switch-light:opacity-70',
              'group-data-checked/switch-light:opacity-100',
              'group-data-[size=sm]/switch-light:size-[length:var(--icon-sm)]',
              'group-data-[size=default]/switch-light:size-[length:var(--icon-lg)]',
              "[&_svg]:size-full [&_svg:not([class*='size-'])]:size-full",
              /* Unchecked — sit opposite the thumb (end side). */
              'group-data-[size=sm]/switch-light:group-data-[icon=true]/switch-light:group-data-unchecked/switch-light:translate-x-[length:calc(var(--spacing-3xl)+var(--spacing-3xs)-var(--spacing-md)-2*var(--spacing-0-75))]',
              'group-data-[size=default]/switch-light:group-data-[icon=true]/switch-light:group-data-unchecked/switch-light:translate-x-[length:calc(var(--spacing-2xl)+var(--spacing-2xs)-2*var(--spacing-0-75))]',
              /* Checked — home at start (keep -translate-y via tw compose). */
              'group-data-checked/switch-light:translate-x-0',
              /*
               * Hover nudge — Figma Hover: icon eases toward thumb (−5).
               * On hover leaves icon parked (Figma Regular On hover).
               */
              'group-hover/switch-light:group-data-[size=sm]/switch-light:group-data-unchecked/switch-light:translate-x-[length:calc(var(--spacing-3xl)+var(--spacing-3xs)-var(--spacing-md)-2*var(--spacing-0-75)-var(--spacing-1-25))]',
              'group-hover/switch-light:group-data-[size=default]/switch-light:group-data-unchecked/switch-light:translate-x-[length:calc(var(--spacing-2xl)+var(--spacing-2xs)-2*var(--spacing-0-75)-var(--spacing-1-25))]',
              /* RTL — mirror travel. */
              'rtl:group-data-[size=sm]/switch-light:group-data-[icon=true]/switch-light:group-data-unchecked/switch-light:-translate-x-[length:calc(var(--spacing-3xl)+var(--spacing-3xs)-var(--spacing-md)-2*var(--spacing-0-75))]',
              'rtl:group-data-[size=default]/switch-light:group-data-[icon=true]/switch-light:group-data-unchecked/switch-light:-translate-x-[length:calc(var(--spacing-2xl)+var(--spacing-2xs)-2*var(--spacing-0-75))]',
              'rtl:group-data-checked/switch-light:translate-x-0',
              'rtl:group-hover/switch-light:group-data-[size=sm]/switch-light:group-data-unchecked/switch-light:-translate-x-[length:calc(var(--spacing-3xl)+var(--spacing-3xs)-var(--spacing-md)-2*var(--spacing-0-75)-var(--spacing-1-25))]',
              'rtl:group-hover/switch-light:group-data-[size=default]/switch-light:group-data-unchecked/switch-light:-translate-x-[length:calc(var(--spacing-2xl)+var(--spacing-2xs)-2*var(--spacing-0-75)-var(--spacing-1-25))]',
            ].join(' ')
          )}
        >
          {icon}
        </span>
      ) : null}
      <SwitchPrimitive.Thumb
        data-slot="switch-light-thumb"
        className={cn(
          [
            'pointer-events-none relative z-10 box-border block shrink-0',
            'rounded-[length:var(--rounded-full)]',
            'bg-transparent',
            /* Hollow ring — Figma 5846:24892 (neutrals rim, open center). */
            'border-[length:var(--stroke-regular)] border-solid',
            'border-[color:var(--theme-neutrals-600)]',
            'group-data-checked/switch-light:border-[color:var(--theme-neutrals-500)]',
            'transition-[transform,translate,border-color,box-shadow]',
            'duration-[var(--duration-normal)] ease-[var(--ease-out)]',
            'group-data-[size=sm]/switch-light:size-[length:var(--spacing-md)]',
            'group-data-[size=default]/switch-light:size-[length:var(--spacing-xl)]',
            'data-unchecked:translate-x-0',
            /* Off hover nudge (+5 ≈ Figma Toggle 4→9). */
            'group-hover/switch-light:data-unchecked:translate-x-[length:var(--spacing-1-25)]',
            /* Checked travel. */
            'group-data-[size=sm]/switch-light:group-data-[icon=false]/switch-light:data-checked:translate-x-[length:calc(var(--spacing-3xl)-var(--spacing-md)-2*var(--spacing-0-75))]',
            'group-data-[size=sm]/switch-light:group-data-[icon=true]/switch-light:data-checked:translate-x-[length:calc(var(--spacing-3xl)+var(--spacing-3xs)-var(--spacing-md)-2*var(--spacing-0-75))]',
            'group-data-[size=default]/switch-light:group-data-[icon=false]/switch-light:data-checked:translate-x-[length:calc(var(--spacing-2xl)-2*var(--spacing-0-75))]',
            'group-data-[size=default]/switch-light:group-data-[icon=true]/switch-light:data-checked:translate-x-[length:calc(var(--spacing-2xl)+var(--spacing-2xs)-2*var(--spacing-0-75))]',
            /* On hover — ease back (~7px, Figma Toggle 32→25). */
            'group-hover/switch-light:group-data-[size=sm]/switch-light:group-data-[icon=false]/switch-light:data-checked:translate-x-[length:calc(var(--spacing-3xl)-var(--spacing-md)-2*var(--spacing-0-75)-var(--spacing-1-75))]',
            'group-hover/switch-light:group-data-[size=sm]/switch-light:group-data-[icon=true]/switch-light:data-checked:translate-x-[length:calc(var(--spacing-3xl)+var(--spacing-3xs)-var(--spacing-md)-2*var(--spacing-0-75)-var(--spacing-1-75))]',
            'group-hover/switch-light:group-data-[size=default]/switch-light:group-data-[icon=false]/switch-light:data-checked:translate-x-[length:calc(var(--spacing-2xl)-2*var(--spacing-0-75)-var(--spacing-1-75))]',
            'group-hover/switch-light:group-data-[size=default]/switch-light:group-data-[icon=true]/switch-light:data-checked:translate-x-[length:calc(var(--spacing-2xl)+var(--spacing-2xs)-2*var(--spacing-0-75)-var(--spacing-1-75))]',
            /* RTL. */
            'rtl:group-hover/switch-light:data-unchecked:-translate-x-[length:var(--spacing-1-25)]',
            'rtl:group-data-[size=sm]/switch-light:group-data-[icon=false]/switch-light:data-checked:-translate-x-[length:calc(var(--spacing-3xl)-var(--spacing-md)-2*var(--spacing-0-75))]',
            'rtl:group-data-[size=sm]/switch-light:group-data-[icon=true]/switch-light:data-checked:-translate-x-[length:calc(var(--spacing-3xl)+var(--spacing-3xs)-var(--spacing-md)-2*var(--spacing-0-75))]',
            'rtl:group-data-[size=default]/switch-light:group-data-[icon=false]/switch-light:data-checked:-translate-x-[length:calc(var(--spacing-2xl)-2*var(--spacing-0-75))]',
            'rtl:group-data-[size=default]/switch-light:group-data-[icon=true]/switch-light:data-checked:-translate-x-[length:calc(var(--spacing-2xl)+var(--spacing-2xs)-2*var(--spacing-0-75))]',
            'rtl:group-hover/switch-light:group-data-[size=sm]/switch-light:group-data-[icon=false]/switch-light:data-checked:-translate-x-[length:calc(var(--spacing-3xl)-var(--spacing-md)-2*var(--spacing-0-75)-var(--spacing-1-75))]',
            'rtl:group-hover/switch-light:group-data-[size=sm]/switch-light:group-data-[icon=true]/switch-light:data-checked:-translate-x-[length:calc(var(--spacing-3xl)+var(--spacing-3xs)-var(--spacing-md)-2*var(--spacing-0-75)-var(--spacing-1-75))]',
            'rtl:group-hover/switch-light:group-data-[size=default]/switch-light:group-data-[icon=false]/switch-light:data-checked:-translate-x-[length:calc(var(--spacing-2xl)-2*var(--spacing-0-75)-var(--spacing-1-75))]',
            'rtl:group-hover/switch-light:group-data-[size=default]/switch-light:group-data-[icon=true]/switch-light:data-checked:-translate-x-[length:calc(var(--spacing-2xl)+var(--spacing-2xs)-2*var(--spacing-0-75)-var(--spacing-1-75))]',
          ].join(' ')
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { SwitchLight, type SwitchLightProps, type SwitchLightSize };
