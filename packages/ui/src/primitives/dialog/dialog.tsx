/**
 * Fabely Dialog primitive — Base UI Dialog restyled with Foundations tokens
 * and Figma Dialog / Dialog Header / Dialog Footer.
 *
 * Figma: Dialog page (`842:51941`) — component sets Dialog, Dialog Header,
 * Dialog Footer. Vendor file (`src/components/ui/dialog.tsx`) stays untouched;
 * this module owns the public surface.
 *
 * Overlay scrim shared with Alert Dialog (`--overlay`). Close uses Icon Button.
 */

'use client';

import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button, IconButton } from '../button';

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/**
 * Overlay scrim — Foundations `--overlay`
 * (→ `--theme-alpha-black-no-switch-30`). Shared with Alert Dialog / Sheet /
 * Drawer. Replaces vendor `bg-black/30`.
 */
function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 isolate z-50 bg-overlay duration-100',
        'supports-backdrop-filter:backdrop-blur-sm',
        'data-open:animate-in data-open:fade-in-0',
        'data-closed:animate-out data-closed:fade-out-0',
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          'fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2',
          'max-w-[calc(100%-var(--spacing-4xl))] sm:max-w-xl',
          'gap-[var(--spacing-md)] p-[var(--spacing-md)]',
          /* Figma Dialog surface — `--radius` (16), not vendor rounded-4xl / Alert xl. */
          'rounded-[length:var(--radius)]',
          'border border-[color:var(--border)]',
          'bg-[color:var(--popover)] text-[color:var(--popover-foreground)]',
          'shadow-[var(--shadow-lg-black)] dark:shadow-[var(--shadow-lg-white)]',
          'duration-100 outline-none',
          'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
          'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            data-slot="dialog-close"
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
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        'flex flex-col gap-[var(--spacing-xs)] pe-[var(--spacing-3xl)] text-start',
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-[var(--spacing-xs)] sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      ) : null}
    </div>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
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

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        '[font-weight:var(--font-weight-paragraph-regular)]',
        'text-[color:var(--muted-foreground)]',
        '*:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-[color:var(--foreground)]',
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
