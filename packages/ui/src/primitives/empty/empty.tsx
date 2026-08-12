/**
 * Fabely Empty primitive — empty-state layout from Figma Empty
 * (`842:44451` / set `989:27679`) with the shadcn composition API.
 *
 * Vendor file (`src/components/ui/empty.tsx`) stays untouched.
 *
 * Figma `Variant`: Default | Outline | Background | Outline dashed → `variant`.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const emptyVariants = cva(
  [
    'flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance',
    'gap-[var(--spacing-md)] p-[var(--spacing-2xl)]',
    'rounded-[length:var(--rounded-xl)]',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-0 bg-transparent',
        outline: 'border border-[color:var(--border)] bg-transparent',
        background: 'border-0 bg-[color:var(--muted)]',
        'outline-dashed':
          'border border-dashed border-[color:var(--border)] bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Empty({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof emptyVariants>) {
  return (
    <div
      data-slot="empty"
      data-variant={variant}
      className={cn(emptyVariants({ variant }), className)}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        'flex max-w-sm flex-col items-center gap-[var(--spacing-2xs)]',
        className,
      )}
      {...props}
    />
  );
}

const emptyMediaVariants = cva(
  'mb-[var(--spacing-2xs)] flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        /* Figma Decorative icon media — muted well, ~48 outer, lg glyph. */
        icon: [
          'flex size-[length:var(--icon-3xl)] items-center justify-center',
          'rounded-[length:var(--rounded-xl)]',
          'bg-[color:var(--muted)] text-[color:var(--foreground)]',
          "[&_svg:not([class*='size-'])]:size-[length:var(--icon-lg)]",
        ].join(' '),
        /* Illustration / photo frame — Media slot with cover crop. */
        image: [
          'w-full max-w-xs overflow-hidden',
          'aspect-[4/3]',
          'rounded-[length:var(--rounded-xl)]',
          'bg-[color:var(--muted)]',
          '[&_img]:size-full [&_img]:object-cover',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function EmptyMedia({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-media"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant }), className)}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        'w-full',
        'font-[family-name:var(--text-paragraph-regular-medium-font-family)]',
        '[font-weight:var(--text-paragraph-regular-medium-font-weight)]',
        'text-[length:var(--text-paragraph-regular-medium-font-size)]',
        'leading-[var(--text-paragraph-regular-medium-line-height)]',
        'tracking-[var(--text-paragraph-regular-medium-letter-spacing)]',
        'text-[color:var(--foreground)]',
        className,
      )}
      {...props}
    />
  );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        'w-full text-balance',
        'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
        '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        'text-[color:var(--muted-foreground)]',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
        className,
      )}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        'flex w-full max-w-sm min-w-0 flex-col items-center gap-[var(--spacing-md)] text-balance',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        className,
      )}
      {...props}
    />
  );
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
  emptyVariants,
};
