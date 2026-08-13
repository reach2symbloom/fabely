/**
 * Fabely Sheet — Base UI Dialog restyled as an edge panel.
 *
 * Figma: Sheet (Orientation Left | Right; Scrollable variants). Surface fill
 * `--background`, flush edges (radius 0), DROP_SHADOW → `--shadow-lg-*`.
 * Header carries Icon Button close; Footer optional CTA row.
 *
 * Public API matches [shadcn Sheet](https://ui.shadcn.com/docs/components/base/sheet)
 * (`side` top | right | bottom | left; `showCloseButton`). Prefer Drawer for
 * bottom-sheet / swipe gestures.
 *
 * Vendor (`src/components/ui/sheet.tsx`) stays untouched.
 */

'use client';

import * as React from 'react';
import { Dialog as SheetPrimitive } from '@base-ui/react/dialog';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { IconButton } from '../button';

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

/**
 * Overlay scrim — Foundations `--overlay` (shared with Dialog / Alert Dialog /
 * Drawer). Replaces vendor `bg-black/30`.
 */
function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 isolate z-50 bg-overlay',
        'supports-backdrop-filter:backdrop-blur-sm',
        'transition-opacity duration-[var(--duration-drawer)] ease-drawer',
        'data-ending-style:opacity-0 data-starting-style:opacity-0',
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: 'top' | 'right' | 'bottom' | 'left';
  showCloseButton?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          'fixed z-50 flex flex-col gap-[var(--spacing-md)]',
          'bg-[color:var(--background)] bg-clip-padding text-[color:var(--foreground)]',
          'shadow-[var(--shadow-lg-black)] dark:shadow-[var(--shadow-lg-white)]',
          'outline-none transition duration-[var(--duration-drawer)] ease-drawer',
          'data-ending-style:opacity-0 data-starting-style:opacity-0',
          'data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:border-[color:var(--border)] data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem]',
          'data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:border-[color:var(--border)] data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=left]:sm:max-w-sm',
          'data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:border-[color:var(--border)] data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=right]:sm:max-w-sm',
          'data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:border-[color:var(--border)] data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem]',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="Close"
                className="absolute top-[var(--spacing-md)] end-[var(--spacing-md)]"
              />
            }
          >
            <XIcon />
          </SheetPrimitive.Close>
        ) : null}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        'flex flex-col gap-[var(--spacing-xs)] p-[var(--spacing-md)] pe-[var(--spacing-3xl)] text-start',
        className,
      )}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        'mt-auto flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)]',
        className,
      )}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        'font-[family-name:var(--text-heading-4-font-family)]',
        '[font-weight:var(--text-heading-4-font-weight)]',
        'text-[length:var(--text-heading-4-font-size)]',
        'leading-[var(--text-heading-4-line-height)]',
        'tracking-[var(--text-heading-4-letter-spacing)]',
        'text-[color:var(--foreground)]',
        className,
      )}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn(
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        '[font-weight:var(--font-weight-paragraph-regular)]',
        'text-[color:var(--muted-foreground)]',
        className,
      )}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
