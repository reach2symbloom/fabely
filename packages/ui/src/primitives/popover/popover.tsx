/**
 * Fabely Popover primitive — rich content in a portal, triggered by a button.
 *
 * Vendor file (`src/components/ui/popover.tsx`) stays untouched. No dedicated
 * Figma Popover set — content surface follows Foundations floating panels
 * (Dialog / Dropdown / Hover Card family) with fill `--popover`.
 *
 * Public API matches https://ui.shadcn.com/docs/components/base/popover
 */

'use client';

import * as React from 'react';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';

import { cn } from '@/lib/utils';

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

/** Floating content surface — `--popover` fill; Dialog/Dropdown radius/border/shadow. */
const CONTENT_SURFACE = [
  'z-50 flex w-72 origin-(--transform-origin) flex-col',
  'gap-[var(--spacing-md)]',
  'rounded-[length:var(--radius)]',
  'border border-[color:var(--border)]',
  'bg-[color:var(--popover)] text-[color:var(--popover-foreground)]',
  'p-[var(--spacing-md)]',
  'outline-hidden duration-100',
  'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
  '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
  'text-[length:var(--text-paragraph-small-regular-font-size)]',
  'leading-[var(--text-paragraph-small-regular-line-height)]',
  'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
  'data-[side=bottom]:slide-in-from-top-2',
  'data-[side=inline-end]:slide-in-from-left-2',
  'data-[side=inline-start]:slide-in-from-right-2',
  'data-[side=left]:slide-in-from-right-2',
  'data-[side=right]:slide-in-from-left-2',
  'data-[side=top]:slide-in-from-bottom-2',
  'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
  'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
].join(' ');

const CONTENT_SHADOW =
  'shadow-[var(--shadow-lg-black)] dark:shadow-[var(--shadow-lg-white)]';

function PopoverContent({
  className,
  align = 'center',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  shadow = true,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  > & {
    /** Elevation under the panel. Default `true`; set `false` for a flat bordered card. */
    shadow?: boolean;
  }) {
  return (
    <PopoverPrimitive.Portal data-slot="popover-portal">
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          data-shadow={shadow ? undefined : 'false'}
          className={cn(CONTENT_SURFACE, shadow && CONTENT_SHADOW, className)}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="popover-header"
      className={cn(
        'flex flex-col gap-[var(--spacing-2xs)]',
        'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        className,
      )}
      {...props}
    />
  );
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn(
        'font-[family-name:var(--text-paragraph-small-medium-font-family)]',
        '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
        'text-[length:var(--text-paragraph-small-medium-font-size)]',
        'leading-[var(--text-paragraph-small-medium-line-height)]',
        'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
        'text-[color:var(--popover-foreground)]',
        className,
      )}
      {...props}
    />
  );
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn(
        'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
        '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        'text-[color:var(--muted-foreground)]',
        className,
      )}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
