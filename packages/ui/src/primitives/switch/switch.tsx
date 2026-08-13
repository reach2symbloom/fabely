/**
 * Fabely Switch — binary on/off control (Base UI Switch).
 *
 * API ground truth: shadcn Switch (Base UI)
 * (https://ui.shadcn.com/docs/components/base/switch).
 *
 * Visual source: Figma **Switch**
 * ([Switch](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16-1801)
 * `16:1801`) — Checked? × State (Default / Focus / Disabled).
 * Track 33×18 · thumb 16×16. Vendor (`src/components/ui/switch.tsx`) stays
 * untouched.
 */
'use client';

import { Switch as SwitchPrimitive } from '@base-ui/react/switch';

import { cn } from '@/lib/utils';

type SwitchSize = 'sm' | 'default';

function Switch({
  className,
  size = 'default',
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: SwitchSize;
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        [
          'peer group/switch relative inline-flex shrink-0 items-center',
          'rounded-[length:var(--rounded-full)]',
          'border-0 outline-none',
          'transition-[background-color,box-shadow,opacity]',
          'duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
          /* Expanded hit target — same geometry as shadcn base-nova. */
          'after:absolute after:-inset-x-3 after:-inset-y-2',
          /* Track — Figma unchecked alpha-10 · checked primary · shadow-xs. */
          'shadow-[var(--shadow-xs-black)]',
          'data-unchecked:bg-[var(--theme-alpha-black-switch-10)]',
          'data-checked:bg-[var(--primary)]',
          /* Focus — Figma Focus uses secondary ring. */
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          /* Invalid. */
          'aria-invalid:data-checked:bg-[var(--destructive)]',
          'aria-invalid:focus-visible:shadow-[var(--effect-focus-ring-error)]',
          /* Disabled. */
          'data-disabled:cursor-not-allowed data-disabled:opacity-50',
          'group-has-disabled/field:opacity-50',
          /* Size — Figma default ≈33×18; sm ≈28×16 (shadcn ladder). */
          'data-[size=default]:h-[length:calc(var(--spacing-md)+var(--spacing-3xs))]',
          'data-[size=default]:w-[length:calc(var(--spacing-2xl)+var(--spacing-3xs))]',
          'data-[size=default]:p-[length:var(--stroke-thin)]',
          'data-[size=sm]:h-[length:var(--spacing-md)]',
          'data-[size=sm]:w-[length:calc(var(--spacing-xl)+var(--spacing-2xs))]',
          'data-[size=sm]:p-[length:var(--stroke-thin)]',
        ].join(' '),
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          [
            'pointer-events-none block shrink-0',
            'rounded-[length:var(--rounded-full)]',
            'bg-[var(--background)]',
            'shadow-[var(--shadow-xs-black)]',
            'ring-0',
            'transition-transform',
            'duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
            'dark:data-unchecked:bg-[var(--foreground)]',
            'dark:data-checked:bg-[var(--primary-foreground)]',
            'group-data-[size=default]/switch:size-[length:var(--spacing-md)]',
            'group-data-[size=sm]/switch:size-[length:var(--spacing-sm)]',
            'data-unchecked:translate-x-0',
            /* Travel ≈ track − thumb − pads (Figma ~15 / sm ~14). */
            'group-data-[size=default]/switch:data-checked:translate-x-[length:calc(var(--spacing-md)-var(--spacing-3xs)+var(--stroke-thin))]',
            'group-data-[size=sm]/switch:data-checked:translate-x-[length:var(--spacing-3-5)]',
            'rtl:group-data-[size=default]/switch:data-checked:-translate-x-[length:calc(var(--spacing-md)-var(--spacing-3xs)+var(--stroke-thin))]',
            'rtl:group-data-[size=sm]/switch:data-checked:-translate-x-[length:var(--spacing-3-5)]',
          ].join(' ')
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch, type SwitchSize };
