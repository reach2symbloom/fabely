/**
 * Fabely Skeleton — Figma Skeleton placeholders (`222:27480` Avatar,
 * `222:27481` Line, `222:27487` Object; page `842:52052`) with the
 * [shadcn Skeleton](https://ui.shadcn.com/docs/components/base/skeleton) API.
 *
 * Vendor (`src/components/ui/skeleton.tsx`) stays untouched. Size and shape
 * come from `className` (Avatar → `rounded-full`; Line / Object → default
 * `--rounded-md`).
 */

import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'animate-pulse',
        'rounded-[length:var(--rounded-md)]',
        'bg-[color:var(--theme-alpha-black-switch-333)]',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
