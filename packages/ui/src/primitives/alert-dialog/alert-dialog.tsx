/**
 * Fabely Alert Dialog primitive — phase 1: full shadcn Alert Dialog API
 * surface.
 *
 * Most parts re-export the upstream vendor file (`src/components/ui/alert-dialog.tsx`)
 * with its shadcn styling intact. Content + Overlay are owned here so
 * Foundations overrides actually paint (vendor Content mounts its own
 * Overlay internally):
 * - Content radius → `--rounded-xl` (`--tw-raw-radius-20` / 20px)
 * - Overlay fill → `--overlay` (semantic scrim → `--theme-alpha-black-no-switch-30`)
 * `AlertDialogAction` and `AlertDialogCancel` compose our Button primitive —
 * not the vendor button. No further Figma remapping yet.
 *
 * Public API matches the shadcn docs composition tree (including
 * `AlertDialogMedia`); import from this primitive, not the vendor path.
 */
import * as React from 'react';
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog';

import { cn } from '@/lib/utils';
import { AlertDialogPortal } from '@/components/ui/alert-dialog';
import { Button } from '../button';
import type { ButtonProps } from '../button';

export {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

/** shadcn `AlertDialogContent` `size` prop — see docs API Reference. */
export type AlertDialogContentSize = 'default' | 'sm';

/**
 * Overlay scrim — Foundations semantic `--overlay`
 * (→ `--theme-alpha-black-no-switch-30` → `--tw-raw-black` #080B0C @ 30%).
 * Non-switching: stays dark in both themes. Shared role for Alert Dialog,
 * Dialog, Sheet, and Drawer. Replaces the vendor's literal `bg-black/30`.
 */
const OVERLAY_SCRIM = 'bg-overlay';

/**
 * Surface radius — Foundations `--rounded-xl` → `--tw-raw-radius-20` (20px).
 * Overrides the vendor's `rounded-4xl` (Tailwind `--radius-4xl` / 2rem).
 */
const SURFACE_RADIUS = 'rounded-[var(--rounded-xl)]';

/** Vendor overlay chrome with Foundations scrim (no literal `bg-black/30`). */
const OVERLAY_CHROME =
  'fixed inset-0 isolate z-50 duration-100 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0';

/** Vendor Content chrome minus radius (applied via SURFACE_RADIUS). */
const CONTENT_CHROME =
  'group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-6 bg-popover p-6 text-popover-foreground shadow-xl ring-1 ring-foreground/5 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-md dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95';

function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(OVERLAY_CHROME, OVERLAY_SCRIM, className)}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  size = 'default',
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  size?: AlertDialogContentSize;
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(CONTENT_CHROME, SURFACE_RADIUS, className)}
        {...props}
      />
    </AlertDialogPortal>
  );
}

/**
 * Primary action — our Button (default `primary`). Not a Close; callers
 * decide dismiss vs. side-effect (matches vendor / shadcn base-luma).
 */
function AlertDialogAction({
  className,
  ...props
}: ButtonProps) {
  return (
    <Button
      data-slot="alert-dialog-action"
      className={cn(className)}
      {...props}
    />
  );
}

/**
 * Dismiss action — Base UI Close rendered as our Button.
 * Fabely convention: Cancel defaults to Button `tertiary` (shadcn uses
 * `outline`, which Fabely Button does not expose).
 */
function AlertDialogCancel({
  className,
  variant = 'tertiary',
  size = 'default',
  ...props
}: AlertDialogPrimitive.Close.Props &
  Pick<ButtonProps, 'variant' | 'size'>) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={cn(className)}
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  );
}

export {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogOverlay,
};
