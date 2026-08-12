/**
 * Fabely Toast primitive — Base UI Toast with the shadcn Toast API
 * (`Toaster` / `toast` manager / composition parts).
 *
 * No dedicated Toast set in Fabely Design System. Surface follows Foundations
 * floating panels (popover fill, radius, border, lg shadow). Vendor
 * (`src/components/ui/toast.tsx`) stays untouched.
 *
 * Docs: https://ui.shadcn.com/docs/components/base/toast
 * API: https://base-ui.com/react/components/toast
 */

'use client';

import * as React from 'react';
import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button, IconButton } from '../button';

const toast = ToastPrimitive.createToastManager();

/**
 * Viewport placement for `<Toaster />`. Default matches shadcn / prior
 * Fabely behavior (`bottom-right`). Top placements deferred until a real
 * consumer needs them (same pattern as Toggle Group Mini).
 */
export type ToasterPosition =
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left';

const ToasterPositionContext =
  React.createContext<ToasterPosition>('bottom-right');

/** Viewport inset — corner positions keep vendor mobile-center → sm+ corner. */
const VIEWPORT_POSITION: Record<ToasterPosition, string> = {
  'bottom-right': [
    'inset-x-[var(--spacing-md)] bottom-[var(--spacing-md)] mx-auto',
    'sm:right-[var(--spacing-md)] sm:left-auto sm:mx-0 sm:w-full',
  ].join(' '),
  'bottom-center':
    'bottom-[var(--spacing-md)] left-1/2 w-[min(100%-calc(var(--spacing-md)*2),24rem)] -translate-x-1/2',
  'bottom-left': [
    'inset-x-[var(--spacing-md)] bottom-[var(--spacing-md)] mx-auto',
    'sm:left-[var(--spacing-md)] sm:right-auto sm:mx-0 sm:w-full',
  ].join(' '),
};

/** Stack anchor inside the viewport. */
const TOAST_ANCHOR: Record<ToasterPosition, string> = {
  'bottom-right': 'right-0 left-auto origin-bottom-right',
  'bottom-center': 'inset-x-0 origin-bottom',
  'bottom-left': 'left-0 right-auto origin-bottom-left',
};

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider data-slot="toast-provider" {...props} />;
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

function ToastViewport({
  className,
  position = 'bottom-right',
  ...props
}: ToastPrimitive.Viewport.Props & { position?: ToasterPosition }) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      data-position={position}
      className={cn(
        'pointer-events-none fixed z-50 w-auto max-w-sm outline-none',
        VIEWPORT_POSITION[position],
        className,
      )}
      {...props}
    />
  );
}

/**
 * Stacked toast chrome — popover surface + Base UI stack transforms.
 * Motion: `--ease-emphasized` + `--duration-drawer` (closest Foundations
 * duration to vendor’s 500ms stack tween; height uses `--duration-fast`).
 */
const TOAST_SURFACE = [
  'group/toast pointer-events-auto absolute bottom-0',
  'z-[calc(1000-var(--toast-index))] w-full',
  'rounded-[length:var(--rounded-2xl)]',
  'border border-[color:var(--border)]',
  'bg-[color:var(--popover)] text-[color:var(--popover-foreground)]',
  'shadow-[var(--shadow-lg-black)] dark:shadow-[var(--shadow-lg-white)]',
  'will-change-transform outline-none select-none',
  'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
  /* Stack geometry — gap/peek = `--spacing-sm` (12). */
  '[--gap:var(--spacing-sm)] [--peek:var(--spacing-sm)]',
  '[--height:var(--toast-frontmost-height,var(--toast-height))]',
  '[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]',
  '[--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]',
  'h-(--height)',
  '[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]',
  '[transition:transform_var(--duration-drawer)_var(--ease-emphasized),opacity_var(--duration-drawer)_var(--ease-emphasized),height_var(--duration-fast)_var(--ease-emphasized)]',
  "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
  'data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]',
  'data-limited:opacity-0 data-starting-style:[transform:translateY(150%)]',
  '[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]',
  'data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]',
  'data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
  'data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
  'data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]',
  'data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]',
  'data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]',
  'data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]',
  'data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]',
].join(' ');

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  const position = React.useContext(ToasterPositionContext);

  return (
    <ToastPrimitive.Root
      data-slot="toast"
      data-position={position}
      className={cn(TOAST_SURFACE, TOAST_ANCHOR[position], className)}
      {...props}
    />
  );
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        'flex h-full items-center overflow-hidden',
        'gap-[var(--spacing-sm)] p-[var(--spacing-md)]',
        'transition-opacity duration-[var(--duration-normal)] ease-[var(--ease-emphasized)]',
        'data-behind:opacity-0 data-expanded:opacity-100',
        className,
      )}
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn(
        'font-[family-name:var(--text-paragraph-small-medium-font-family)]',
        '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
        'text-[length:var(--text-paragraph-small-medium-font-size)]',
        'leading-[var(--text-paragraph-small-medium-line-height)]',
        'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
        className,
      )}
      {...props}
    />
  );
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn(
        'text-[color:var(--muted-foreground)]',
        'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
        '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        className,
      )}
      {...props}
    />
  );
}

function ToastAction({
  className,
  render = <Button variant="outline" size="small" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn('shrink-0', className)}
      {...props}
    />
  );
}

function ToastClose({
  className,
  children,
  render = (
    <IconButton variant="ghost" size="sm" aria-label="Close toast" />
  ),
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      render={render}
      className={cn(
        'relative shrink-0 text-[color:var(--muted-foreground)]',
        "after:absolute after:-inset-[var(--spacing-xs)] after:content-['']",
        'hover:text-[color:var(--foreground)]',
        className,
      )}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" />}
    </ToastPrimitive.Close>
  );
}

const TOAST_ICON_COLOR: Record<string, string> = {
  success: 'text-[color:var(--tw-raw-success-600)]',
  /* TODO(design-tokens): promote to a semantic `--info` accent when Foundations defines one. */
  info: 'text-[color:var(--muted-foreground)]',
  /* TODO(design-tokens): promote to `--warning` once Foundations defines it (mirrors Alert). */
  warning: 'text-[color:var(--tw-raw-alert-600)]',
  error: 'text-[color:var(--destructive)]',
  loading: 'text-[color:var(--muted-foreground)]',
};

function ToastIcon({ type }: { type: string | undefined }) {
  let icon: React.ReactNode = null;

  if (type === 'success') {
    icon = <CircleCheckIcon aria-hidden="true" />;
  }

  if (type === 'info') {
    icon = <InfoIcon aria-hidden="true" />;
  }

  if (type === 'warning') {
    icon = <TriangleAlertIcon aria-hidden="true" />;
  }

  if (type === 'error') {
    icon = <OctagonXIcon aria-hidden="true" />;
  }

  if (type === 'loading') {
    icon = <Loader2Icon className="animate-spin" aria-hidden="true" />;
  }

  if (!icon || !type) {
    return null;
  }

  return (
    <span
      data-slot="toast-icon"
      data-type={type}
      className={cn(
        'shrink-0',
        TOAST_ICON_COLOR[type],
        '[&_svg]:pointer-events-none',
        "[&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
      )}
    >
      {icon}
    </span>
  );
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-2xs)]">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ));
}

function Toaster({
  children,
  toastManager = toast,
  /** Viewport placement. Default `bottom-right` — unchanged from prior Toaster. */
  position = 'bottom-right',
  ...props
}: ToastPrimitive.Provider.Props & {
  position?: ToasterPosition;
}) {
  return (
    <ToasterPositionContext.Provider value={position}>
      <ToastProvider toastManager={toastManager} {...props}>
        {children}
        <ToastPortal>
          <ToastViewport position={position}>
            <ToastList />
          </ToastViewport>
        </ToastPortal>
      </ToastProvider>
    </ToasterPositionContext.Provider>
  );
}

const createToastManager = ToastPrimitive.createToastManager;
const useToastManager = ToastPrimitive.useToastManager;

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
};
