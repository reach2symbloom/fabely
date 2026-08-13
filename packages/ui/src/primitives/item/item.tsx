/**
 * Fabely Item primitive — content row with media, title, description, and
 * actions from Figma Item (`920:4754`) with the
 * [shadcn Item](https://ui.shadcn.com/docs/components/base/item) API.
 *
 * Vendor (`src/components/ui/item.tsx`) stays untouched. Distinct from
 * ListItem (Figma Menu Item) — Item is a bordered / muted card-style row.
 */

'use client';

import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Separator } from '../separator';

function ItemGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn(
        'group/item-group flex w-full flex-col',
        'gap-[var(--spacing-md)]',
        'has-data-[size=sm]:gap-[var(--spacing-1-5)]',
        'has-data-[size=xs]:gap-[var(--spacing-xs)]',
        className,
      )}
      {...props}
    />
  );
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn('my-[var(--spacing-xs)]', className)}
      {...props}
    />
  );
}

const itemVariants = cva(
  [
    'group/item flex w-full flex-wrap items-center',
    'rounded-[length:var(--rounded-lg)]',
    'border-[length:var(--stroke-thin)]',
    'font-[family-name:var(--font-family-body)]',
    'text-[length:var(--text-paragraph-small-medium-font-size)]',
    'leading-[var(--text-paragraph-small-medium-line-height)]',
    'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
    'outline-none transition-[color,background-color,border-color,box-shadow]',
    'duration-[var(--duration-fast)]',
    'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
    /* Link Item (`render={<a />}`) — Figma asChild Hover uses secondary fill. */
    '[a]:transition-[background-color]',
    '[a]:hover:bg-[color:var(--secondary)]',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-transparent bg-transparent',
        outline: 'border-[color:var(--border)] bg-transparent',
        /* Default size — Figma muted fill. Small/xs overridden below. */
        muted: 'border-transparent bg-[color:var(--muted)]',
      },
      size: {
        /* Figma Default — pad md, gap md. */
        default: 'gap-[var(--spacing-md)] p-[var(--spacing-md)]',
        /* Figma Small — pad x md / y sm, gap xs. */
        sm: 'gap-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)]',
        /* shadcn-only denser size (not in Figma Item). */
        xs: [
          'gap-[var(--spacing-1-5)] px-[var(--spacing-sm)] py-[var(--spacing-1-5)]',
          'in-data-[slot=dropdown-menu-content]:p-0',
        ].join(' '),
      },
    },
    compoundVariants: [
      /* Figma Small Muted uses --secondary, not --muted. */
      {
        variant: 'muted',
        size: 'sm',
        class: 'bg-[color:var(--secondary)]',
      },
      {
        variant: 'muted',
        size: 'xs',
        class: 'bg-[color:var(--secondary)]',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Item({
  className,
  variant = 'default',
  size = 'default',
  render,
  ...props
}: useRender.ComponentProps<'div'> & VariantProps<typeof itemVariants>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn(itemVariants({ variant, size }), className),
      },
      props,
    ),
    render,
    state: {
      slot: 'item',
      variant,
      size,
    },
  });
}

const itemMediaVariants = cva(
  [
    /* Always vertically centered with the row (Item uses items-center). */
    'flex shrink-0 items-center justify-center self-center',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: [
          /* Figma Decorative icon — 32 box, --icon-md glyph. */
          'size-[length:var(--spacing-2xl)]',
          'rounded-[length:var(--rounded-md)]',
          'border-[length:var(--stroke-thin)] border-[color:var(--theme-alpha-black-switch-10)]',
          'bg-[color:var(--theme-alpha-black-switch-333)]',
          '[&_svg]:size-[length:var(--icon-md)]',
          '[&_svg]:text-[color:var(--foreground)]',
        ].join(' '),
        image: [
          'size-[length:var(--spacing-3xl)] overflow-hidden',
          'rounded-[length:var(--rounded-lg)]',
          'group-data-[size=sm]/item:size-[length:var(--spacing-2xl)]',
          'group-data-[size=xs]/item:size-[length:var(--spacing-xl)]',
          'group-data-[size=xs]/item:rounded-[length:var(--rounded-md)]',
          '[&_img]:size-full [&_img]:object-cover',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function ItemMedia({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant }), className)}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        'flex min-w-0 flex-1 flex-col',
        'gap-[var(--spacing-2xs)]',
        'group-data-[size=sm]/item:gap-0',
        'group-data-[size=xs]/item:gap-0',
        '[&+[data-slot=item-content]]:flex-none',
        className,
      )}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        'line-clamp-1 flex w-fit items-center gap-[var(--spacing-xs)]',
        'font-[family-name:var(--font-family-body)]',
        '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
        'text-[length:var(--text-paragraph-small-medium-font-size)]',
        'leading-[var(--text-paragraph-small-medium-line-height)]',
        'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
        'text-[color:var(--foreground)]',
        'underline-offset-4',
        className,
      )}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        'line-clamp-2 text-start',
        'font-[family-name:var(--font-family-body)]',
        /* Figma Description uses Paragraph Small Medium + muted. */
        '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
        'text-[length:var(--text-paragraph-small-medium-font-size)]',
        'leading-[var(--text-paragraph-small-medium-line-height)]',
        'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
        'text-[color:var(--muted-foreground)]',
        '[&>a]:underline [&>a]:underline-offset-4',
        '[&>a:hover]:text-[color:var(--foreground)]',
        className,
      )}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-actions"
      className={cn(
        'flex shrink-0 items-center gap-[var(--spacing-xs)]',
        className,
      )}
      {...props}
    />
  );
}

function ItemHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        'flex basis-full items-center justify-between gap-[var(--spacing-xs)]',
        className,
      )}
      {...props}
    />
  );
}

function ItemFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        'flex basis-full items-center justify-between gap-[var(--spacing-xs)]',
        className,
      )}
      {...props}
    />
  );
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
  itemVariants,
  itemMediaVariants,
};
