/**
 * Fabely Toggle — standalone two-state button (Figma Position=Single).
 *
 * API ground truth: shadcn Toggle (Base UI)
 * (https://ui.shadcn.com/docs/components/base/toggle).
 *
 * Visual source: Figma **Toggle Button**
 * ([Toggle Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=816-112827)
 * `816:112827`) — Skin Ghost / Outline, Size, Active, Roundness.
 *
 * Shared chrome: [`toggleVariants`](./toggle-variants.ts) — also used by
 * [Toggle Group](../toggle-group/README.md) items. Vendor
 * (`src/components/ui/toggle.tsx`) stays untouched.
 */
'use client';

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import {
  toggleVariants,
  type ToggleRoundness,
} from './toggle-variants';

function Toggle({
  className,
  variant = 'ghost',
  size = 'default',
  roundness = 'default',
  ...props
}: TogglePrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    /** Figma Roundness — `default` roundrect; `round` pill / full round. */
    roundness?: ToggleRoundness;
  }) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      data-variant={variant}
      data-size={size}
      data-roundness={roundness}
      className={cn(toggleVariants({ variant, size, roundness }), className)}
      {...props}
    />
  );
}

export { Toggle, toggleVariants, type ToggleRoundness };
