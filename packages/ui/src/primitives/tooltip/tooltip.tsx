/**
 * Fabely Tooltip — Figma Tooltip (`133:14788`, page `842:44449`) with the
 * [shadcn Tooltip](https://ui.shadcn.com/docs/components/base/tooltip) API.
 *
 * Vendor (`src/components/ui/tooltip.tsx`) stays untouched. Open delay is `0`
 * (Provider + Trigger) so labels appear on hover immediately.
 */

'use client';

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/** Shared open delay — instant hover for Provider and Trigger defaults. */
const TOOLTIP_OPEN_DELAY = 0;
const TOOLTIP_CLOSE_DELAY = 0;

function TooltipProvider({
  delay = TOOLTIP_OPEN_DELAY,
  closeDelay = TOOLTIP_CLOSE_DELAY,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      closeDelay={closeDelay}
      {...props}
    />
  );
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  delay = TOOLTIP_OPEN_DELAY,
  closeDelay = TOOLTIP_CLOSE_DELAY,
  ...props
}: TooltipPrimitive.Trigger.Props) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      delay={delay}
      closeDelay={closeDelay}
      {...props}
    />
  );
}

const tooltipContentVariants = cva(
  [
    'z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center',
    'gap-[var(--spacing-xs)]',
    'rounded-[length:var(--rounded-md)]',
    'border border-[color:var(--border)] border-solid',
    'px-[var(--spacing-xs)] py-[var(--spacing-1-5)]',
    'font-[family-name:var(--font-family-body)]',
    '[font-weight:var(--font-weight-paragraph-regular)]',
    'text-[length:var(--text-paragraph-mini-regular-font-size)]',
    'leading-[var(--text-paragraph-mini-regular-line-height)]',
    'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
    'text-balance',
    '**:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50',
    'has-data-[slot=kbd]:pe-[var(--spacing-2xs)]',
    /* No border on whichever edge the pointer attaches to — same fill
     * color makes the pointer read as a continuous part of the body
     * instead of a shape sitting behind a border seam. */
    'data-[side=bottom]:border-t-0',
    'data-[side=top]:border-b-0',
    'data-[side=left]:border-r-0',
    'data-[side=inline-start]:border-r-0',
    'data-[side=right]:border-l-0',
    'data-[side=inline-end]:border-l-0',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=inline-end]:slide-in-from-left-2',
    'data-[side=inline-start]:slide-in-from-right-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=top]:slide-in-from-bottom-2',
    'data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95',
    'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
    'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
  ].join(' '),
  {
    variants: {
      variant: {
        /** Figma Tooltip — Neutrals (New)/150 surface + border + foreground. */
        default: [
          'bg-[color:var(--neutrals-new-150)]',
          'text-[color:var(--foreground)]',
        ].join(' '),
        /**
         * High-contrast inverted chip (sidebar icon labels, dense chrome).
         * Matches prior shadcn vendor fill: foreground plate / background type.
         */
        inverse: [
          'border-transparent',
          'bg-[color:var(--foreground)]',
          'text-[color:var(--background)]',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * Pointer — a single CSS border-triangle (no separate outline layer; see
 * `highlight-action-menu.tsx`'s `ActionTooltipContent`, where the same
 * technique was worked out first) built as a genuine part of the popup's
 * shape rather than Base UI's own rotated-square Arrow. `size-0` box +
 * one colored border side + the two perpendicular sides transparent is
 * the classic CSS-triangle recipe; the third side (facing the popup body)
 * is left at width `0` so the base sits flush with — and reads as one
 * continuous fill with — the popup edge that has its own border omitted
 * above.
 *
 * Cross-axis placement: top/bottom sides keep Base UI's own floating-ui
 * computed `left` (so the pointer tracks the real anchor position even
 * when `align` isn't centered); left/right sides force vertical centering
 * (`top-1/2!`, `!` beating Base UI's inline `top` style) — ported as-is
 * from the previous Arrow's own left/right behavior, unchanged.
 *
 * 7px half-size — matches the Action Menu's own triangle, and roughly
 * the same visual "reach" as the previous 10px diamond's ~7px half
 * diagonal. `sideOffset` was bumped 4 → 8 on `TooltipContent` below so
 * this larger reach doesn't dip into the trigger.
 */
const tooltipArrowVariants = cva(
  [
    'z-50 size-0 border-transparent',
    'data-[side=bottom]:top-[-7px] data-[side=bottom]:border-x-[7px] data-[side=bottom]:border-b-[7px]',
    'data-[side=top]:-bottom-[7px] data-[side=top]:border-x-[7px] data-[side=top]:border-t-[7px]',
    'data-[side=right]:top-1/2! data-[side=right]:left-0 data-[side=right]:-translate-x-full data-[side=right]:-translate-y-1/2 data-[side=right]:border-y-[7px] data-[side=right]:border-r-[7px]',
    'data-[side=inline-end]:top-1/2! data-[side=inline-end]:left-0 data-[side=inline-end]:-translate-x-full data-[side=inline-end]:-translate-y-1/2 data-[side=inline-end]:border-y-[7px] data-[side=inline-end]:border-r-[7px]',
    'data-[side=left]:top-1/2! data-[side=left]:right-0 data-[side=left]:translate-x-full data-[side=left]:-translate-y-1/2 data-[side=left]:border-y-[7px] data-[side=left]:border-l-[7px]',
    'data-[side=inline-start]:top-1/2! data-[side=inline-start]:right-0 data-[side=inline-start]:translate-x-full data-[side=inline-start]:-translate-y-1/2 data-[side=inline-start]:border-y-[7px] data-[side=inline-start]:border-l-[7px]',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'data-[side=top]:border-t-[color:var(--neutrals-new-150)]',
          'data-[side=bottom]:border-b-[color:var(--neutrals-new-150)]',
          'data-[side=left]:border-l-[color:var(--neutrals-new-150)]',
          'data-[side=inline-start]:border-l-[color:var(--neutrals-new-150)]',
          'data-[side=right]:border-r-[color:var(--neutrals-new-150)]',
          'data-[side=inline-end]:border-r-[color:var(--neutrals-new-150)]',
        ].join(' '),
        inverse: [
          'data-[side=top]:border-t-[color:var(--foreground)]',
          'data-[side=bottom]:border-b-[color:var(--foreground)]',
          'data-[side=left]:border-l-[color:var(--foreground)]',
          'data-[side=inline-start]:border-l-[color:var(--foreground)]',
          'data-[side=right]:border-r-[color:var(--foreground)]',
          'data-[side=inline-end]:border-r-[color:var(--foreground)]',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function TooltipContent({
  className,
  side = 'top',
  /* 4 (Base UI's own default) sits the pointer's 7px reach inside the
   * trigger; 8 gives the triangle room without dipping into it. */
  sideOffset = 8,
  align = 'center',
  alignOffset = 0,
  variant = 'default',
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  > &
  VariantProps<typeof tooltipContentVariants>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          data-variant={variant ?? 'default'}
          className={cn(tooltipContentVariants({ variant }), className)}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow
            className={cn(tooltipArrowVariants({ variant }))}
          />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  tooltipContentVariants,
};
