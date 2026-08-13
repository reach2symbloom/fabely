/**
 * Fabely Navigation Menu primitive — site/section link collection with the
 * [shadcn Navigation Menu](https://ui.shadcn.com/docs/components/base/navigation-menu)
 * API (Base UI Navigation Menu).
 *
 * Figma: [Navigation Menu](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=294-233298)
 * (`294:233298`) — Ghost Button triggers; example popup via Menu (Slots).
 * Vendor (`src/components/ui/navigation-menu.tsx`) stays untouched.
 */

'use client';

import * as React from 'react';
import { NavigationMenu as NavigationMenuPrimitive } from '@base-ui/react/navigation-menu';
import { cva } from 'class-variance-authority';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

/** Popup surface — Figma Menu (Slots): popover fill, `--rounded-xl`, xl shadow. */
const POPUP_SURFACE = [
  'rounded-[length:var(--rounded-xl)]',
  'bg-[color:var(--popover)] text-[color:var(--popover-foreground)]',
  'border-[length:var(--stroke-thin)] border-[color:var(--border)]',
  'shadow-[var(--shadow-lg-black)] dark:shadow-[var(--shadow-lg-white)]',
  'outline-none',
].join(' ');

const MOTION_EMPHASIZED =
  'duration-[var(--duration-normal)] ease-[var(--ease-emphasized)]';

function NavigationMenu({
  align = 'start',
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, 'align'>) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
        className,
      )}
      {...props}
    >
      {children}
      <NavigationMenuPositioner align={align} />
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        'group flex flex-1 list-none items-center justify-center gap-0',
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn('relative', className)}
      {...props}
    />
  );
}

/** Ghost Button default chrome — Figma Navigation Menu triggers. */
const navigationMenuTriggerStyle = cva(
  [
    'group/navigation-menu-trigger inline-flex w-max items-center justify-center',
    'h-[length:var(--spacing-3xl)]',
    'gap-[var(--spacing-xs)]',
    'rounded-[length:var(--rounded-lg)]',
    'px-[var(--spacing-2-5)] py-[var(--spacing-xs)]',
    'font-[family-name:var(--text-paragraph-small-medium-font-family)]',
    '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
    'text-[length:var(--text-paragraph-small-medium-font-size)]',
    'leading-[var(--text-paragraph-small-medium-line-height)]',
    'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
    'text-[color:var(--muted-foreground)]',
    'bg-[color:var(--theme-alpha-white-switch-001)]',
    'transition-[color,background-color,box-shadow,opacity]',
    'outline-none select-none',
    'hover:bg-[color:var(--theme-alpha-black-switch-5)]',
    'hover:text-[color:var(--foreground)]',
    'focus-visible:bg-[color:var(--theme-alpha-black-switch-5)]',
    'focus-visible:text-[color:var(--foreground)]',
    'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
    'disabled:pointer-events-none disabled:opacity-50',
    'data-popup-open:bg-[color:var(--theme-alpha-black-switch-5)]',
    'data-popup-open:text-[color:var(--foreground)]',
    'data-open:bg-[color:var(--theme-alpha-black-switch-5)]',
    'data-open:text-[color:var(--foreground)]',
  ].join(' '),
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), 'group', className)}
      {...props}
    >
      {children}{' '}
      <ChevronDownIcon
        className={cn(
          'relative top-px size-[length:var(--icon-xs)] shrink-0',
          'transition-transform',
          MOTION_EMPHASIZED,
          'group-data-popup-open/navigation-menu-trigger:rotate-180',
          'group-data-open/navigation-menu-trigger:rotate-180',
        )}
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        'h-full w-auto p-[var(--spacing-xs)]',
        'transition-[opacity,transform,translate]',
        MOTION_EMPHASIZED,
        'data-ending-style:data-activation-direction=left:translate-x-[50%]',
        'data-ending-style:data-activation-direction=right:translate-x-[-50%]',
        'data-starting-style:data-activation-direction=left:translate-x-[-50%]',
        'data-starting-style:data-activation-direction=right:translate-x-[50%]',
        'data-ending-style:opacity-0 data-starting-style:opacity-0',
        'data-[motion=from-end]:slide-in-from-right-52',
        'data-[motion=from-start]:slide-in-from-left-52',
        'data-[motion=to-end]:slide-out-to-right-52',
        'data-[motion=to-start]:slide-out-to-left-52',
        'data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in',
        'data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out',
        '**:data-[slot=navigation-menu-link]:focus:shadow-none',
        '**:data-[slot=navigation-menu-link]:focus:outline-none',
        /* Non-viewport mode — same Menu (Slots) chrome as Popup */
        'group-data-[viewport=false]/navigation-menu:rounded-[length:var(--rounded-xl)]',
        'group-data-[viewport=false]/navigation-menu:bg-[color:var(--popover)]',
        'group-data-[viewport=false]/navigation-menu:text-[color:var(--popover-foreground)]',
        'group-data-[viewport=false]/navigation-menu:border-[length:var(--stroke-thin)]',
        'group-data-[viewport=false]/navigation-menu:border-[color:var(--border)]',
        'group-data-[viewport=false]/navigation-menu:shadow-[var(--shadow-lg-black)]',
        'group-data-[viewport=false]/navigation-menu:dark:shadow-[var(--shadow-lg-white)]',
        'group-data-[viewport=false]/navigation-menu:duration-[var(--duration-normal)]',
        'group-data-[viewport=false]/navigation-menu:data-open:animate-in',
        'group-data-[viewport=false]/navigation-menu:data-open:fade-in-0',
        'group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95',
        'group-data-[viewport=false]/navigation-menu:data-closed:animate-out',
        'group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0',
        'group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95',
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuPositioner({
  className,
  side = 'bottom',
  sideOffset = 8,
  align = 'start',
  alignOffset = 0,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className={cn(
          'isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)',
          'transition-[top,left,right,bottom]',
          MOTION_EMPHASIZED,
          'data-instant:transition-none',
          'data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0',
          className,
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Popup
          className={cn(
            'xs:w-(--popup-width) relative h-(--popup-height) w-(--popup-width)',
            'origin-(--transform-origin)',
            POPUP_SURFACE,
            'transition-[opacity,transform,width,height,scale,translate]',
            MOTION_EMPHASIZED,
            'data-ending-style:scale-90 data-ending-style:opacity-0',
            'data-ending-style:duration-[var(--duration-fast)]',
            'data-starting-style:scale-90 data-starting-style:opacity-0',
          )}
        >
          <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        'flex flex-col items-start gap-[var(--spacing-2xs)]',
        'rounded-[length:var(--rounded-md)]',
        'p-[var(--spacing-xs)]',
        'font-[family-name:var(--font-family-body)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        'text-[color:var(--foreground)]',
        'transition-[color,background-color,box-shadow]',
        'outline-none',
        'hover:bg-[color:var(--theme-alpha-black-switch-5)]',
        'focus-visible:bg-[color:var(--theme-alpha-black-switch-5)]',
        'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
        'data-[active=true]:bg-[color:var(--theme-alpha-black-switch-10)]',
        'data-[active=true]:hover:bg-[color:var(--theme-alpha-black-switch-10)]',
        '[&_svg:not([class*=size-])]:size-[length:var(--icon-sm)]',
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Icon>) {
  return (
    <NavigationMenuPrimitive.Icon
      data-slot="navigation-menu-indicator"
      className={cn(
        'top-full z-1 flex h-[length:var(--spacing-1-5)] items-end justify-center overflow-hidden',
        'data-[state=hidden]:animate-out data-[state=hidden]:fade-out',
        'data-[state=visible]:animate-in data-[state=visible]:fade-in',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'relative top-[60%] size-[length:var(--spacing-xs)] rotate-45',
          'rounded-tl-[length:var(--rounded-sm)]',
          'bg-[color:var(--border)]',
          'shadow-[var(--shadow-sm-black)] dark:shadow-[var(--shadow-sm-white)]',
        )}
      />
    </NavigationMenuPrimitive.Icon>
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuPositioner,
};
