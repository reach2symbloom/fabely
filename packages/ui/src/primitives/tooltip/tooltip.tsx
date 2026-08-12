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

const tooltipArrowVariants = cva(
  [
    'z-50 size-[length:var(--spacing-2-5)] translate-y-[calc(-50%-var(--spacing-3xs))] rotate-45',
    'rounded-[length:var(--rounded-xs)]',
    'data-[side=bottom]:top-[var(--spacing-3xs)]',
    'data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-[var(--spacing-3xs)] data-[side=inline-end]:translate-x-[length:var(--spacing-1-5)] data-[side=inline-end]:-translate-y-1/2',
    'data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-[var(--spacing-3xs)] data-[side=inline-start]:-translate-x-[length:var(--spacing-1-5)] data-[side=inline-start]:-translate-y-1/2',
    'data-[side=left]:top-1/2! data-[side=left]:-right-[var(--spacing-3xs)] data-[side=left]:-translate-x-[length:var(--spacing-1-5)] data-[side=left]:-translate-y-1/2',
    'data-[side=right]:top-1/2! data-[side=right]:-left-[var(--spacing-3xs)] data-[side=right]:translate-x-[length:var(--spacing-1-5)] data-[side=right]:-translate-y-1/2',
    'data-[side=top]:-bottom-[length:var(--spacing-2-5)]',
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'bg-[color:var(--neutrals-new-150)] fill-[color:var(--neutrals-new-150)]',
        inverse:
          'bg-[color:var(--foreground)] fill-[color:var(--foreground)]',
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
  sideOffset = 4,
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
