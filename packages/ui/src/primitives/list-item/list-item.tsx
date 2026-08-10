/**
 * Fabely ListItem — shared leaf-row atom for menus and lists.
 *
 * Figma source: **Menu Item** set (`18:1010`, page Select & Combobox) in
 * Fabely Design System (`gV94L0qCmvwQkddNbEktry`). Code name is deliberately
 * `ListItem` — unscoped to Dropdown / Command / Select / Context Menu.
 *
 * No shadcn equivalent (vendor `Item` is a bordered card row). Primitives
 * compose this rather than hand-rolling rows — see docs/DESIGN.md.
 *
 * Interaction (Default quiet): Button-aligned hover `@5` / pressed `@10`,
 * not Figma’s `@333` hover. Active and Selected paint identically (`@10`);
 * Selected is distinguished via `data-selected`.
 *
 * Regular (default) layout mirrors Figma: root gap `--spacing-xs` (8) between
 * the leading group and trailing; leading group gap `--spacing-sm` (12)
 * between media and content; title↔description gap `--spacing-2xs` (4;
 * one step above Figma’s unbound 2px).
 */
import * as React from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export type ListItemVariant = 'default' | 'accent' | 'destructive';
/** Shared size-slot vocabulary — values are ListItem’s own (32 / 40). */
export type ListItemSize = 'default' | 'lg';

const listItemVariants = cva(
  [
    'group/list-item relative flex w-full min-w-0 items-center',
    'rounded-[var(--rounded-md)]',
    'border border-transparent',
    'font-[family-name:var(--font-family-body)]',
    '[font-weight:var(--font-weight-paragraph-regular)]',
    'outline-none select-none',
    'transition-[color,background-color,border-color,opacity,box-shadow,background-image]',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          'text-[color:var(--foreground)]',
          '[&_[data-slot=list-item-media]_svg]:text-primary',
          'hover:bg-[var(--theme-alpha-black-switch-5)]',
          'data-[hovered]:bg-[var(--theme-alpha-black-switch-5)]',
          /* Menu hosts (Dropdown / Select / …) highlight via data-highlighted. */
          'data-highlighted:bg-[var(--theme-alpha-black-switch-5)]',
          'active:bg-[var(--theme-alpha-black-switch-10)]',
          'data-[pressed]:bg-[var(--theme-alpha-black-switch-10)]',
          'data-[selected]:bg-[var(--theme-alpha-black-switch-10)]',
          'data-checked:bg-[var(--theme-alpha-black-switch-10)]',
          'data-[selected]:hover:bg-[var(--theme-alpha-black-switch-10)]',
          'data-[selected]:data-[hovered]:bg-[var(--theme-alpha-black-switch-10)]',
          'data-[selected]:data-highlighted:bg-[var(--theme-alpha-black-switch-10)]',
          'data-checked:data-highlighted:bg-[var(--theme-alpha-black-switch-10)]',
          'focus-visible:bg-[var(--theme-alpha-black-switch-5)]',
          'data-[focused]:bg-[var(--theme-alpha-black-switch-5)]',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          'data-[focused]:shadow-[var(--effect-focus-ring-secondary)]',
          'data-[selected]:focus-visible:bg-[var(--theme-alpha-black-switch-10)]',
          'data-[selected]:data-[focused]:bg-[var(--theme-alpha-black-switch-10)]',
        ],
        accent: [
          'text-[color:var(--foreground)]',
          'bg-[color-mix(in_srgb,var(--tw-raw-secondary-ghost)_12%,transparent)]',
          'border-[length:var(--stroke-thin)]',
          'border-[color:color-mix(in_srgb,var(--tw-raw-secondary-ghost)_12%,transparent)]',
          'hover:border-[color:var(--theme-alpha-black-switch-15)]',
          'data-[hovered]:border-[color:var(--theme-alpha-black-switch-15)]',
          'data-highlighted:border-[color:var(--theme-alpha-black-switch-15)]',
          'hover:[background-image:linear-gradient(var(--theme-alpha-black-switch-5),var(--theme-alpha-black-switch-5))]',
          'data-[hovered]:[background-image:linear-gradient(var(--theme-alpha-black-switch-5),var(--theme-alpha-black-switch-5))]',
          'data-highlighted:[background-image:linear-gradient(var(--theme-alpha-black-switch-5),var(--theme-alpha-black-switch-5))]',
          'active:[background-image:linear-gradient(var(--theme-alpha-black-switch-10),var(--theme-alpha-black-switch-10))]',
          'data-[pressed]:[background-image:linear-gradient(var(--theme-alpha-black-switch-10),var(--theme-alpha-black-switch-10))]',
          'data-[selected]:[background-image:linear-gradient(var(--theme-alpha-black-switch-10),var(--theme-alpha-black-switch-10))]',
          'data-[selected]:hover:[background-image:linear-gradient(var(--theme-alpha-black-switch-10),var(--theme-alpha-black-switch-10))]',
          'data-[selected]:data-[hovered]:[background-image:linear-gradient(var(--theme-alpha-black-switch-10),var(--theme-alpha-black-switch-10))]',
          'data-[selected]:data-highlighted:[background-image:linear-gradient(var(--theme-alpha-black-switch-10),var(--theme-alpha-black-switch-10))]',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          'data-[focused]:shadow-[var(--effect-focus-ring-secondary)]',
          'focus-visible:[background-image:linear-gradient(var(--theme-alpha-black-switch-5),var(--theme-alpha-black-switch-5))]',
          'data-[focused]:[background-image:linear-gradient(var(--theme-alpha-black-switch-5),var(--theme-alpha-black-switch-5))]',
          '[&_[data-slot=list-item-description]]:text-[color:var(--tw-raw-secondary-200)]',
          '[&_[data-slot=list-item-description]]:opacity-70',
        ],
        destructive: [
          'text-[color:var(--destructive)]',
          'hover:[background-image:linear-gradient(var(--theme-alpha-white-switch-95),var(--theme-alpha-white-switch-95)),linear-gradient(var(--destructive),var(--destructive))]',
          'data-[hovered]:[background-image:linear-gradient(var(--theme-alpha-white-switch-95),var(--theme-alpha-white-switch-95)),linear-gradient(var(--destructive),var(--destructive))]',
          'data-highlighted:[background-image:linear-gradient(var(--theme-alpha-white-switch-95),var(--theme-alpha-white-switch-95)),linear-gradient(var(--destructive),var(--destructive))]',
          'active:[background-image:linear-gradient(var(--theme-alpha-white-switch-85),var(--theme-alpha-white-switch-85)),linear-gradient(var(--destructive),var(--destructive))]',
          'data-[pressed]:[background-image:linear-gradient(var(--theme-alpha-white-switch-85),var(--theme-alpha-white-switch-85)),linear-gradient(var(--destructive),var(--destructive))]',
          'data-[selected]:[background-image:linear-gradient(var(--theme-alpha-white-switch-85),var(--theme-alpha-white-switch-85)),linear-gradient(var(--destructive),var(--destructive))]',
          'data-[selected]:hover:[background-image:linear-gradient(var(--theme-alpha-white-switch-85),var(--theme-alpha-white-switch-85)),linear-gradient(var(--destructive),var(--destructive))]',
          'data-[selected]:data-[hovered]:[background-image:linear-gradient(var(--theme-alpha-white-switch-85),var(--theme-alpha-white-switch-85)),linear-gradient(var(--destructive),var(--destructive))]',
          'data-[selected]:data-highlighted:[background-image:linear-gradient(var(--theme-alpha-white-switch-85),var(--theme-alpha-white-switch-85)),linear-gradient(var(--destructive),var(--destructive))]',
          'focus-visible:[background-image:linear-gradient(var(--theme-alpha-white-switch-95),var(--theme-alpha-white-switch-95)),linear-gradient(var(--destructive),var(--destructive))]',
          'data-[focused]:[background-image:linear-gradient(var(--theme-alpha-white-switch-95),var(--theme-alpha-white-switch-95)),linear-gradient(var(--destructive),var(--destructive))]',
          'focus-visible:shadow-[var(--effect-focus-ring-error)]',
          'data-[focused]:shadow-[var(--effect-focus-ring-error)]',
          '[&_[data-slot=list-item-description]]:opacity-70',
          '[&_svg]:text-[color:var(--destructive)]',
        ],
      },
      size: {
        /** Regular — pad xs / 1.375; root gap xs (to trailing). */
        default: [
          'min-h-[length:var(--spacing-2xl)]',
          'gap-[var(--spacing-xs)]',
          'px-[var(--spacing-xs)]',
          'py-[var(--spacing-1-375)]',
        ],
        /** Large — pad sm / 1.875; root gap sm. */
        lg: [
          'min-h-[length:var(--spacing-3xl)]',
          'gap-[var(--spacing-sm)]',
          'px-[var(--spacing-sm)]',
          'py-[var(--spacing-1-875)]',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function ListItemMedia({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="list-item-media"
      className={cn(
        /* Figma .Select Left Decoration Size=Default → 20×20 (= --icon-md).
         * Size=Large → 32×32 (= --icon-xl). Glyph fills the frame. */
        'flex shrink-0 flex-col items-center justify-center',
        'size-[length:var(--icon-md)]',
        'group-data-[size=lg]/list-item:size-[length:var(--icon-xl)]',
        "[&_svg:not([class*='size-'])]:size-[length:var(--icon-md)]",
        'group-data-[size=lg]/list-item:[&_svg:not([class*="size-"])]:size-[length:var(--icon-xl)]',
        className
      )}
      {...props}
    />
  );
}

function ListItemContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="list-item-content"
      className={cn(
        'flex min-w-0 flex-1 flex-col items-start justify-center overflow-hidden',
        /* Figma Label↔Line 2 is 2px; library bumps one step to --spacing-2xs (4). */
        'gap-[var(--spacing-2xs)]',
        className
      )}
      {...props}
    />
  );
}

function ListItemTitle({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="list-item-title"
      className={cn(
        'min-w-0 max-w-full truncate',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        className
      )}
      {...props}
    />
  );
}

function ListItemDescription({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="list-item-description"
      className={cn(
        'min-w-0 max-w-full whitespace-normal wrap-break-word',
        'line-clamp-2',
        'text-[length:var(--text-paragraph-mini-regular-font-size)]',
        'leading-[var(--text-paragraph-mini-regular-line-height)]',
        'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
        'text-[color:var(--muted-foreground)]',
        className
      )}
      {...props}
    />
  );
}

function ListItemTrailing({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="list-item-trailing"
      className={cn(
        'flex shrink-0 flex-col items-center justify-center',
        'size-[length:var(--icon-md)]',
        'group-data-[size=lg]/list-item:size-[length:var(--icon-xl)]',
        "[&_svg:not([class*='size-'])]:size-[length:var(--icon-md)]",
        'group-data-[size=lg]/list-item:[&_svg:not([class*="size-"])]:size-[length:var(--icon-xl)]',
        className
      )}
      {...props}
    />
  );
}

type ListItemProps = Omit<useRender.ComponentProps<'div'>, 'className'> &
  VariantProps<typeof listItemVariants> & {
    className?: string;
    /** Selected paint matches pressed (`@10`); distinguished by this flag. */
    selected?: boolean;
    disabled?: boolean;
  };

function ListItem({
  className,
  variant = 'default',
  size = 'default',
  selected = false,
  disabled = false,
  render,
  children,
  ...props
}: ListItemProps) {
  const childArray = React.Children.toArray(children);
  const media: React.ReactNode[] = [];
  const content: React.ReactNode[] = [];
  const trailing: React.ReactNode[] = [];
  const rest: React.ReactNode[] = [];

  for (const child of childArray) {
    if (!React.isValidElement(child)) {
      rest.push(child);
      continue;
    }
    if (child.type === ListItemMedia) media.push(child);
    else if (child.type === ListItemContent) content.push(child);
    else if (child.type === ListItemTrailing) trailing.push(child);
    else rest.push(child);
  }

  /**
   * Figma Regular: root gap xs between [media+content] and trailing;
   * inner AL gap sm between media and content. Leading wrapper carries sm.
   */
  const leading = (
    <div
      data-slot="list-item-leading"
      className="flex min-w-0 flex-1 items-center gap-[var(--spacing-sm)]"
    >
      {media}
      {content}
      {rest}
    </div>
  );

  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn(listItemVariants({ variant, size }), className),
        'aria-selected': selected || undefined,
        'aria-disabled': disabled || undefined,
        children: (
          <>
            {leading}
            {trailing}
          </>
        ),
      },
      props
    ),
    render,
    state: {
      slot: 'list-item',
      variant,
      size,
      selected: selected ? '' : undefined,
      disabled: disabled ? '' : undefined,
    },
  });
}

export {
  ListItem,
  ListItemMedia,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemTrailing,
  listItemVariants,
};
export type { ListItemProps };
