/**
 * Fabely Marker primitive — inline conversation status, bordered row, or
 * labeled separator with the
 * [shadcn Marker](https://ui.shadcn.com/docs/components/base/marker) API.
 *
 * No dedicated Figma conversation Marker set (Todo marker OC is unrelated).
 * Type / color / gaps map to Foundations. Vendor
 * (`src/components/ui/marker.tsx`) stays untouched.
 */

import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const markerVariants = cva(
  [
    'group/marker relative flex w-full items-center text-left',
    'min-h-[length:var(--icon-sm)]',
    'gap-[var(--spacing-xs)]',
    /* Paragraph Small Regular + muted — system / status voice */
    'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
    '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
    'text-[length:var(--text-paragraph-small-regular-font-size)]',
    'leading-[var(--text-paragraph-small-regular-line-height)]',
    'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
    'text-[color:var(--muted-foreground)]',
    '[&_svg:not([class*=size-])]:size-[length:var(--icon-sm)]',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    /* Nested / render-as links */
    '[a]:underline [a]:underline-offset-4 [a]:hover:text-[color:var(--foreground)]',
  ].join(' '),
  {
    variants: {
      variant: {
        default: '',
        separator: [
          'before:me-[var(--spacing-2xs)] before:h-px before:min-w-0 before:flex-1',
          'before:bg-[color:var(--border)]',
          'after:ms-[var(--spacing-2xs)] after:h-px after:min-w-0 after:flex-1',
          'after:bg-[color:var(--border)]',
        ].join(' '),
        border: [
          'border-b border-[color:var(--border)]',
          'pb-[var(--spacing-xs)]',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Marker({
  className,
  variant = 'default',
  render,
  ...props
}: useRender.ComponentProps<'div'> & VariantProps<typeof markerVariants>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn(markerVariants({ variant, className })),
      },
      props,
    ),
    render,
    state: {
      slot: 'marker',
      variant,
    },
  });
}

function MarkerIcon({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn(
        'size-[length:var(--icon-sm)] shrink-0',
        '[&_svg:not([class*=size-])]:size-[length:var(--icon-sm)]',
        className,
      )}
      {...props}
    />
  );
}

function MarkerContent({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="marker-content"
      className={cn(
        'min-w-0 wrap-break-word',
        'group-data-[variant=separator]/marker:flex-none',
        'group-data-[variant=separator]/marker:text-center',
        '*:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-[color:var(--foreground)]',
        className,
      )}
      {...props}
    />
  );
}

export { Marker, MarkerIcon, MarkerContent, markerVariants };
