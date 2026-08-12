/**
 * Fabely Pagination primitive — page navigation with prev / next / page links.
 *
 * Vendor file (`src/components/ui/pagination.tsx`) stays untouched. No Figma
 * Pagination set — Accordion / Breadcrumb-style Foundations restyle of the
 * shadcn Pagination API. Page and prev/next controls use Button family
 * variants on `<a>` (not vendor Button).
 *
 * Public API matches https://ui.shadcn.com/docs/components/base/pagination
 */
import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '../button';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex items-center gap-[var(--spacing-2xs)]', className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

/** shadcn size vocabulary — `icon` = page digit, `default` = labeled prev/next. */
type PaginationLinkSize = 'icon' | 'default';

type PaginationLinkProps = {
  isActive?: boolean;
  size?: PaginationLinkSize;
} & React.ComponentProps<'a'>;

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          /* Digits: small type + square `--spacing-9` box (Icon Button default). */
          size: size === 'icon' ? 'small' : 'default',
        }),
        size === 'icon' && 'size-[length:var(--spacing-9)] px-0',
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  text = 'Previous',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn(className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" className="rtl:rotate-180" />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  text = 'Next',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn(className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon data-icon="inline-end" className="rtl:rotate-180" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        'flex size-[length:var(--spacing-9)] items-center justify-center',
        "[&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
export type { PaginationLinkProps, PaginationLinkSize };
