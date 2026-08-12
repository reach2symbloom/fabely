/**
 * Fabely Table primitive — responsive table from Figma Table
 * (Header `164:18430`, Cell `288:172242`, organism `5846:25478`) with the
 * shadcn Table API.
 *
 * Vendor file (`src/components/ui/table.tsx`) stays untouched.
 *
 * Figma → chrome:
 * - Header: Paragraph Small Medium + `--border` bottom border (`--stroke-regular`)
 *   — thickness separates header from body; color stays quiet in dark mode
 * - Cell: Paragraph Small Regular + `--border` bottom (`--stroke-thin`);
 *   Even parity → `--theme-alpha-black-switch-333` zebra on the row
 * - Pad / row height: `--spacing-xs` / `--spacing-3xl` (40)
 * - Alignment Left | Right → `text-start` / consumer `text-end` (no prop)
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn(
          'w-full caption-bottom',
          'font-[family-name:var(--font-family-body)]',
          'text-[length:var(--text-paragraph-small-regular-font-size)]',
          'leading-[var(--text-paragraph-small-regular-line-height)]',
          'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        '[&_tr]:border-b-[length:var(--stroke-regular)]',
        '[&_tr]:border-[color:var(--border)]',
        className,
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return <tbody data-slot="table-body" className={cn(className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'border-t-[length:var(--stroke-thin)] border-[color:var(--border)]',
        'bg-[color:var(--muted)]',
        '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
        '[&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'transition-[background-color] duration-[var(--duration-fast)]',
        /* Body only — keep header’s thicker `--border` rule intact. */
        'in-data-[slot=table-body]:border-b-[length:var(--stroke-thin)]',
        'in-data-[slot=table-body]:border-[color:var(--border)]',
        /* Figma Cell Parity=Even zebra. */
        'in-data-[slot=table-body]:odd:bg-transparent',
        'in-data-[slot=table-body]:even:bg-[color:var(--theme-alpha-black-switch-333)]',
        'in-data-[slot=table-body]:hover:bg-[color:var(--theme-alpha-black-switch-5)]',
        'in-data-[slot=table-body]:has-aria-expanded:bg-[color:var(--theme-alpha-black-switch-5)]',
        'data-[state=selected]:bg-[color:var(--muted)]',
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-[length:var(--spacing-3xl)]',
        'px-[var(--spacing-xs)] py-[var(--spacing-xs)]',
        'text-start align-middle whitespace-nowrap',
        'font-[family-name:var(--font-family-body)]',
        '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
        'text-[length:var(--text-paragraph-small-medium-font-size)]',
        'leading-[var(--text-paragraph-small-medium-line-height)]',
        'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
        'text-[color:var(--foreground)]',
        '[&:has([role=checkbox])]:pe-0',
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'h-[length:var(--spacing-3xl)]',
        'px-[var(--spacing-xs)] py-[var(--spacing-xs)]',
        'text-start align-middle whitespace-nowrap',
        'font-[family-name:var(--font-family-body)]',
        '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        'text-[color:var(--neutrals-new-800)]',
        '[&:has([role=checkbox])]:pe-0',
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        'mt-[var(--spacing-md)]',
        'font-[family-name:var(--font-family-body)]',
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
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
