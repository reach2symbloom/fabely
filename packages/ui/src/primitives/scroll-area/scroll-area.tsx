/**
 * Fabely Scroll Area — Base UI scroll region with Foundations scrollbar.
 *
 * Figma: Scrollbar (`164:18669`) Type × Vertical / Horizontal — elegant 2px
 * thumb (`--stroke-regular`), `--rounded-sm`. Thumb fill is a white alpha
 * overlay (`--theme-alpha-white-no-switch-25`) so it reads lighter than the
 * surface in both themes. Public API matches
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
      className={cn(
        'relative',
        /* Clip absolute scrollbar to the consumer’s border-radius. */
        'overflow-hidden',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          'size-full rounded-[inherit] outline-none',
          /* Top + bottom edge fade when content overflows (see scroll-fade.css). */
          'scroll-fade-y',
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
        /*
         * Base UI sets `data-orientation`, not `data-vertical`. Tailwind’s
         * `data-vertical:` utility targets `[data-vertical]` and never matched,
         * so the track collapsed to 0×width and the thumb was invisible.
         */
        /* Track = 2px thumb + 2px end padding (`--spacing-3xs`).
         * Block padding keeps the thumb clear of the rounded corner arc;
         * root `overflow-hidden` clips anything that still meets the radius. */
        'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[length:var(--spacing-2xs)]',
        'data-[orientation=vertical]:pe-[length:var(--spacing-3xs)]',
        'data-[orientation=vertical]:py-[length:var(--spacing-xs)]',
        'data-[orientation=horizontal]:h-[length:var(--stroke-regular)] data-[orientation=horizontal]:flex-col',
        'data-[orientation=horizontal]:px-[length:var(--spacing-xs)]',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className={cn(
          'relative flex-1',
          'rounded-[length:var(--rounded-sm)]',
          /* Lighter than the surface — white alpha (no-switch) both themes. */
          'bg-[color:var(--theme-alpha-white-no-switch-25)]',
        )}
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollArea, ScrollBar };
