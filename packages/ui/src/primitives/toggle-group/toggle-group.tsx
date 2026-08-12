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
 * Item chrome: shared [`toggleVariants`](../toggle/toggle-variants.ts) from
 * [Toggle](../toggle/README.md). Connected Position CSS (spacing=0 shell,
 * dividers, outer radius) lives here. Vendor
 * (`src/components/ui/toggle-group.tsx`) stays untouched.
 */
'use client';

import * as React from 'react';
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import {
  toggleVariants,
  type ToggleRoundness,
} from '../toggle/toggle-variants';

export type ToggleGroupRoundness = ToggleRoundness;

/** @deprecated Prefer `toggleVariants` from Toggle — alias for item chrome. */
const toggleGroupItemVariants = toggleVariants;

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: 'horizontal' | 'vertical';
    roundness?: ToggleGroupRoundness;
  }
>({
  size: 'default',
  variant: 'ghost',
  spacing: 2,
  orientation: 'horizontal',
  roundness: 'default',
});

function ToggleGroup({
  className,
  variant = 'ghost',
  size,
  spacing = 2,
  orientation = 'horizontal',
  roundness = 'default',
  children,
  style,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
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
          'data-[spacing=0]:data-[roundness=round]:data-[variant=ghost]:border-[length:var(--stroke-thin)]',
          'data-[spacing=0]:data-[roundness=round]:data-[variant=ghost]:border-[color:var(--border)]',
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
  variant = 'ghost',
  size = 'default',
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
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
        toggleVariants({
          variant: resolvedVariant,
          size: resolvedSize,
          roundness,
        }),
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
  toggleVariants,
};
