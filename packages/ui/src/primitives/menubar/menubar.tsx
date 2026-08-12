/**
 * Fabely Menubar primitive — persistent menu bar with the
 * [shadcn Menubar](https://ui.shadcn.com/docs/components/base/menubar) API.
 *
 * No dedicated Figma Menubar set. Bar + trigger use Foundations; menus compose
 * the owned [Dropdown Menu](../dropdown-menu) (ListItem rows, card surface).
 * Vendor (`src/components/ui/menubar.tsx`) stays untouched.
 */

'use client';

import * as React from 'react';
import { Menubar as MenubarPrimitive } from '@base-ui/react/menubar';

import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../dropdown-menu';

function Menubar({ className, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn(
        'flex items-center gap-[var(--spacing-2xs)]',
        'rounded-[length:var(--rounded-lg)]',
        'border border-[color:var(--border)]',
        'bg-[color:var(--background)]',
        'p-[var(--spacing-2xs)]',
        className,
      )}
      {...props}
    />
  );
}

function MenubarMenu({ ...props }: React.ComponentProps<typeof DropdownMenu>) {
  return <DropdownMenu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuGroup>) {
  return <DropdownMenuGroup data-slot="menubar-group" {...props} />;
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPortal>) {
  return <DropdownMenuPortal data-slot="menubar-portal" {...props} />;
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuTrigger>) {
  return (
    <DropdownMenuTrigger
      data-slot="menubar-trigger"
      className={cn(
        'flex items-center select-none outline-hidden',
        'rounded-[length:var(--rounded-md)]',
        'px-[var(--spacing-xs)] py-[var(--spacing-2xs)]',
        'font-[family-name:var(--text-paragraph-small-medium-font-family)]',
        '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
        'text-[length:var(--text-paragraph-small-medium-font-size)]',
        'leading-[var(--text-paragraph-small-medium-line-height)]',
        'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
        'text-[color:var(--foreground)]',
        'hover:bg-[color:var(--muted)]',
        'aria-expanded:bg-[color:var(--muted)]',
        className,
      )}
      {...props}
    />
  );
}

function MenubarContent({
  className,
  align = 'start',
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="menubar-content"
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn('min-w-48 p-[var(--spacing-2xs)]', className)}
      {...props}
    />
  );
}

function MenubarItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem>) {
  return (
    <DropdownMenuItem
      data-slot="menubar-item"
      className={cn('group/menubar-item', className)}
      {...props}
    >
      {mapMenubarShortcuts(children)}
    </DropdownMenuItem>
  );
}

/** Rewrite MenubarShortcut → DropdownMenuShortcut so ListItem trailing maps. */
function mapMenubarShortcuts(children: React.ReactNode) {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === MenubarShortcut) {
      return (
        <DropdownMenuShortcut
          data-slot="menubar-shortcut"
          {...(child.props as React.ComponentProps<typeof DropdownMenuShortcut>)}
        />
      );
    }
    return child;
  });
}

function MenubarCheckboxItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuCheckboxItem>) {
  return (
    <DropdownMenuCheckboxItem
      data-slot="menubar-checkbox-item"
      className={className}
      {...props}
    >
      {mapMenubarShortcuts(children)}
    </DropdownMenuCheckboxItem>
  );
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuRadioGroup>) {
  return <DropdownMenuRadioGroup data-slot="menubar-radio-group" {...props} />;
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuRadioItem>) {
  return (
    <DropdownMenuRadioItem
      data-slot="menubar-radio-item"
      className={className}
      {...props}
    >
      {mapMenubarShortcuts(children)}
    </DropdownMenuRadioItem>
  );
}

function MenubarLabel({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuLabel>) {
  return (
    <DropdownMenuLabel
      data-slot="menubar-label"
      className={className}
      {...props}
    />
  );
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSeparator>) {
  return (
    <DropdownMenuSeparator
      data-slot="menubar-separator"
      className={cn('-mx-[var(--spacing-2xs)]', className)}
      {...props}
    />
  );
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuShortcut>) {
  return (
    <DropdownMenuShortcut
      data-slot="menubar-shortcut"
      className={className}
      {...props}
    />
  );
}

function MenubarSub({ ...props }: React.ComponentProps<typeof DropdownMenuSub>) {
  return <DropdownMenuSub data-slot="menubar-sub" {...props} />;
}

function MenubarSubTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuSubTrigger>) {
  return (
    <DropdownMenuSubTrigger
      data-slot="menubar-sub-trigger"
      className={className}
      {...props}
    >
      {mapMenubarShortcuts(children)}
    </DropdownMenuSubTrigger>
  );
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSubContent>) {
  return (
    <DropdownMenuSubContent
      data-slot="menubar-sub-content"
      className={cn('min-w-32 p-[var(--spacing-2xs)]', className)}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
