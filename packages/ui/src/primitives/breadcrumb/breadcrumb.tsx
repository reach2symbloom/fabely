/**
 * Fabely Breadcrumb primitive — wraps the upstream shadcn Breadcrumb
 * (`src/components/ui/breadcrumb.tsx`) with Foundations-sourced styling.
 *
 * No Figma design exists. Per docs/DESIGN.md and the Accordion precedent,
 * this is primarily a faithful restyle: no new variants beyond what the
 * docs describe. One library-over-vendor exception: `BreadcrumbEllipsis`
 * is our Icon Button (interactive), not the vendor’s presentational span.
 *
 * `Breadcrumb` itself carries no default classes in the vendor file — re-exported
 * unchanged. Other parts override vendor Tailwind defaults via `className`.
 */
import * as React from 'react';
import { MoreHorizontalIcon } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList as BreadcrumbListPrimitive,
  BreadcrumbItem as BreadcrumbItemPrimitive,
  BreadcrumbLink as BreadcrumbLinkPrimitive,
  BreadcrumbPage as BreadcrumbPagePrimitive,
  BreadcrumbSeparator as BreadcrumbSeparatorPrimitive,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { IconButton, type IconButtonProps } from '../button/icon-button';

function BreadcrumbList({
  className,
  ...props
}: React.ComponentProps<typeof BreadcrumbListPrimitive>) {
  return (
    <BreadcrumbListPrimitive
      className={cn(
        'gap-[var(--spacing-1-5)] sm:gap-[var(--spacing-2-5)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        'font-[family-name:var(--font-family-body)]',
        '[font-weight:var(--font-weight-paragraph-regular)]',
        'text-[color:var(--muted-foreground)]',
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({
  className,
  ...props
}: React.ComponentProps<typeof BreadcrumbItemPrimitive>) {
  return (
    <BreadcrumbItemPrimitive
      className={cn('gap-[var(--spacing-1-5)]', className)}
      {...props}
    />
  );
}

function BreadcrumbLink({
  className,
  ...props
}: React.ComponentProps<typeof BreadcrumbLinkPrimitive>) {
  return (
    <BreadcrumbLinkPrimitive
      className={cn(
        'transition-colors hover:text-[color:var(--foreground)]',
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbPage({
  className,
  ...props
}: React.ComponentProps<typeof BreadcrumbPagePrimitive>) {
  return (
    <BreadcrumbPagePrimitive
      className={cn(
        '[font-weight:var(--font-weight-paragraph-regular)]',
        'text-[color:var(--foreground)]',
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BreadcrumbSeparatorPrimitive>) {
  return (
    <BreadcrumbSeparatorPrimitive
      className={cn("[&>svg]:size-[length:var(--icon-xs)]", className)}
      {...props}
    />
  );
}

/**
 * Collapsed / overflow control. Vendor ships a presentational `<span>`;
 * we use Icon Button because this is interactive in practice (dropdown).
 * Compose as `DropdownMenuTrigger` via `render={<BreadcrumbEllipsis … />}`.
 */
type BreadcrumbEllipsisProps = Omit<IconButtonProps, 'variant' | 'size'> & {
  'aria-label': string;
};

function BreadcrumbEllipsis({
  className,
  children,
  'aria-label': ariaLabel,
  ...props
}: BreadcrumbEllipsisProps) {
  return (
    <IconButton
      data-slot="breadcrumb-ellipsis"
      variant="ghost"
      size="mini"
      aria-label={ariaLabel}
      className={cn(className)}
      {...props}
    >
      {children ?? <MoreHorizontalIcon />}
    </IconButton>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
export type { BreadcrumbEllipsisProps };
