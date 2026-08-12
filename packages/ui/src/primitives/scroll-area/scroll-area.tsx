/**
 * Fabely Scroll Area — Base UI scroll region with Foundations scrollbar.
 *
 * Figma: Scrollbar (`164:18669`) Type × Vertical / Horizontal — 4px thumb,
 * `--theme-neutrals-200`, `--rounded-sm`. Public API matches
 * [shadcn Scroll Area](https://ui.shadcn.com/docs/components/base/scroll-area)
 * (Base UI [Scroll Area](https://base-ui.com/react/components/scroll-area)).
 * Import from this primitive, not `src/components/ui/scroll-area`.
 */

'use client';

import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';

import { cn } from '@/lib/utils';

function ScrollArea({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn('relative', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          'size-full rounded-[inherit] outline-none',
          'transition-[color,box-shadow] duration-[var(--duration-fast)]',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        'flex touch-none select-none',
        'transition-colors duration-[var(--duration-fast)]',
        /* Figma thumb is 4px (`--stroke-thick`); track matches thumb width. */
        'data-vertical:h-full data-vertical:w-[length:var(--stroke-thick)]',
        'data-horizontal:h-[length:var(--stroke-thick)] data-horizontal:flex-col',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className={cn(
          'relative flex-1',
          /* Figma Scrollbar: neutrals-200 · rounded-sm. */
          'rounded-[length:var(--rounded-sm)]',
          'bg-[color:var(--theme-neutrals-200)]',
        )}
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollArea, ScrollBar };
