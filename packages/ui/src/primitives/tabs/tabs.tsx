/**
 * Fabely Tabs — layered tab panels (Base UI Tabs).
 *
 * API ground truth: shadcn Tabs (Base UI)
 * (https://ui.shadcn.com/docs/components/base/tabs).
 *
 * Visual source: Figma **Tabs** page
 * ([Tab (segmented)](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=9-634)
 * `9:634` · [Tabs (segmented)](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=9-639)
 * `9:639` · [Tab (line)](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=5508-2187)
 * `5508:2187` · [Tabs (line)](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=5508-1899)
 * `5508:1899`).
 *
 * `TabsList` `variant="default"` → segmented pill track;
 * `variant="line"` → underline tabs. Vendor
 * (`src/components/ui/tabs.tsx`) stays untouched.
 */
'use client';

import * as React from 'react';
import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

type TabsSize = 'sm' | 'default' | 'lg';

const TabsListContext = React.createContext<{
  variant: 'default' | 'line';
  size: TabsSize;
}>({
  variant: 'default',
  size: 'default',
});

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        [
          'group/tabs flex gap-[length:var(--spacing-xs)]',
          'data-[orientation=horizontal]:flex-col',
        ].join(' '),
        className
      )}
      {...props}
    />
  );
}

/**
 * List chrome — Figma Tabs (segmented) Fill=True → `default`;
 * Tabs (line) → `line`. Size maps Small / Default / Large.
 */
const tabsListVariants = cva(
  [
    'group/tabs-list inline-flex w-fit items-center justify-center',
    'text-[color:var(--muted-foreground)]',
    'group-data-[orientation=vertical]/tabs:h-fit',
    'group-data-[orientation=vertical]/tabs:flex-col',
    'group-data-[orientation=vertical]/tabs:items-stretch',
  ].join(' '),
  {
    variants: {
      variant: {
        /** Figma Tabs (segmented) — alpha-333 track + inset padding (room for active ring). */
        default: [
          'overflow-visible',
          /* Equal gap on every item — active ring has room without selection reflow. */
          'gap-[length:var(--spacing-3xs)]',
          'bg-[var(--theme-alpha-black-switch-333)]',
        ].join(' '),
        /** Figma Tabs (line) — track hugs the tab cluster (not full container). */
        line: [
          'relative w-fit',
          'gap-[length:var(--spacing-2xs)]',
          'rounded-none bg-transparent',
          /* Track — same width as the list / tabs; `--stroke-thick` (4px). */
          'before:pointer-events-none before:absolute before:z-0',
          'before:bg-[var(--theme-alpha-black-switch-5)]',
          'before:rounded-[length:var(--stroke-hairline)]',
          'group-data-[orientation=horizontal]/tabs:before:inset-x-0',
          'group-data-[orientation=horizontal]/tabs:before:bottom-0',
          'group-data-[orientation=horizontal]/tabs:before:h-[length:var(--stroke-thick)]',
          'group-data-[orientation=vertical]/tabs:before:inset-y-0',
          'group-data-[orientation=vertical]/tabs:before:end-0',
          'group-data-[orientation=vertical]/tabs:before:w-[length:var(--stroke-thick)]',
        ].join(' '),
      },
      size: {
        sm: '',
        default: '',
        lg: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        size: 'sm',
        class: [
          'rounded-[length:var(--rounded-lg)]',
          'p-[length:var(--spacing-3xs)]',
        ].join(' '),
      },
      {
        variant: 'default',
        size: 'default',
        class: [
          'rounded-[length:var(--rounded-full)]',
          'p-[length:var(--spacing-1-375)]',
        ].join(' '),
      },
      {
        variant: 'default',
        size: 'lg',
        class: [
          'rounded-[length:var(--rounded-full)]',
          'p-[length:var(--spacing-2xs)]',
        ].join(' '),
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function TabsList({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsListContext.Provider
      value={{ variant: variant ?? 'default', size: size ?? 'default' }}
    >
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        data-size={size}
        className={cn(tabsListVariants({ variant, size }), className)}
        {...props}
      >
        {children}
        {variant === 'line' ? <TabsIndicator /> : null}
      </TabsPrimitive.List>
    </TabsListContext.Provider>
  );
}

/**
 * Sliding underline for `variant="line"` — Base UI Tabs.Indicator driven by
 * `--active-tab-*` CSS vars. Injected by TabsList; export kept for overrides.
 */
function TabsIndicator({
  className,
  ...props
}: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        [
          'pointer-events-none absolute z-[1]',
          'rounded-[length:var(--stroke-hairline)]',
          'bg-[var(--primary)]',
          'transition-[translate,width,height]',
          'duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
          'motion-reduce:transition-none',
          /* Horizontal — 4px bar (`--stroke-thick` = regular + 2px). */
          'group-data-[orientation=horizontal]/tabs:inset-x-auto',
          'group-data-[orientation=horizontal]/tabs:bottom-0',
          'group-data-[orientation=horizontal]/tabs:left-0',
          'group-data-[orientation=horizontal]/tabs:h-[length:var(--stroke-thick)]',
          'group-data-[orientation=horizontal]/tabs:w-[var(--active-tab-width)]',
          'group-data-[orientation=horizontal]/tabs:translate-x-[var(--active-tab-left)]',
          /* Vertical — end-edge bar. */
          'group-data-[orientation=vertical]/tabs:inset-y-auto',
          'group-data-[orientation=vertical]/tabs:end-0',
          'group-data-[orientation=vertical]/tabs:top-0',
          'group-data-[orientation=vertical]/tabs:w-[length:var(--stroke-thick)]',
          'group-data-[orientation=vertical]/tabs:h-[var(--active-tab-height)]',
          'group-data-[orientation=vertical]/tabs:translate-y-[var(--active-tab-top)]',
        ].join(' '),
        className
      )}
      {...props}
    />
  );
}

const tabsTriggerVariants = cva(
  [
    'relative inline-flex flex-1 items-center justify-center',
    'font-[family-name:var(--font-family-body)]',
    '[font-weight:var(--font-weight-paragraph-medium)]',
    'whitespace-nowrap',
    'outline-none select-none',
    'transition-[color,background-color,border-color,opacity,box-shadow]',
    'duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-disabled:pointer-events-none aria-disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-current',
    "[&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
    'group-data-[orientation=vertical]/tabs:w-full',
    'group-data-[orientation=vertical]/tabs:justify-start',
    'focus-visible:z-10',
  ].join(' '),
  {
    variants: {
      variant: {
        /**
         * Figma Tab (segmented) `9:634` — Inactive @50; Hover alpha-333;
         * Active Neutrals/200 fill + gradient-primary border (padding/border-box
         * layers — same recipe as Avatar) + `--effect-focus-ring-primary`;
         * inactive Focus → secondary ring + muted fill.
         */
        default: [
          'border-[length:var(--stroke-thin)] border-transparent',
          'text-[color:var(--foreground)]',
          'opacity-50',
          'hover:opacity-100',
          'hover:bg-[var(--theme-alpha-black-switch-333)]',
          'focus-visible:z-10',
          'focus-visible:opacity-100',
          'focus-visible:bg-[var(--muted)]',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          'data-active:z-[1]',
          'data-active:opacity-100',
          /* Kill hover/focus solid fills so gradient border layers stay intact. */
          'data-active:bg-transparent',
          'data-active:hover:bg-transparent',
          'data-active:focus-visible:bg-transparent',
          'data-active:[background:linear-gradient(var(--theme-neutrals-200),var(--theme-neutrals-200))_padding-box,var(--gradient-primary-top-bottom)_border-box]',
          'data-active:hover:[background:linear-gradient(var(--theme-neutrals-200),var(--theme-neutrals-200))_padding-box,var(--gradient-primary-top-bottom)_border-box]',
          'data-active:focus-visible:[background:linear-gradient(var(--theme-neutrals-200),var(--theme-neutrals-200))_padding-box,var(--gradient-primary-top-bottom)_border-box]',
          'dark:data-active:[background:linear-gradient(var(--theme-neutrals-700),var(--theme-neutrals-700))_padding-box,var(--gradient-primary-top-bottom)_border-box]',
          'dark:data-active:hover:[background:linear-gradient(var(--theme-neutrals-700),var(--theme-neutrals-700))_padding-box,var(--gradient-primary-top-bottom)_border-box]',
          'dark:data-active:focus-visible:[background:linear-gradient(var(--theme-neutrals-700),var(--theme-neutrals-700))_padding-box,var(--gradient-primary-top-bottom)_border-box]',
          'data-active:shadow-[var(--effect-focus-ring-primary)]',
          'data-active:focus-visible:shadow-[var(--effect-focus-ring-primary)]',
        ].join(' '),
        line: [
          'flex-none',
          'rounded-none border-0 bg-transparent',
          'text-[color:var(--muted-foreground)]',
          'hover:text-[color:var(--foreground)]',
          'data-active:text-[color:var(--foreground)]',
          /* Underline is TabsIndicator (slides via --active-tab-*). */
          /* Focus ring sits on the inner Content slot (Figma Tab line). */
          'focus-visible:[&>[data-slot=tabs-trigger-content]]:shadow-[var(--effect-focus-ring-secondary)]',
        ].join(' '),
      },
      size: {
        sm: [
          'gap-[length:var(--spacing-2xs)]',
          'text-[length:var(--text-paragraph-mini-medium-font-size)]',
          'leading-[var(--text-paragraph-mini-medium-line-height)]',
          'tracking-[var(--text-paragraph-mini-medium-letter-spacing)]',
        ].join(' '),
        default: [
          'gap-[length:var(--spacing-1-5)]',
          'text-[length:var(--text-paragraph-small-medium-font-size)]',
          'leading-[var(--text-paragraph-small-medium-line-height)]',
          'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
        ].join(' '),
        lg: [
          'gap-[length:var(--spacing-xs)]',
          'text-[length:var(--text-paragraph-regular-medium-font-size)]',
          'leading-[var(--text-paragraph-regular-medium-line-height)]',
          'tracking-[var(--text-paragraph-regular-medium-letter-spacing)]',
        ].join(' '),
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        size: 'sm',
        class: [
          'rounded-[length:var(--rounded-md)]',
          'px-[length:var(--spacing-1-5)] py-px',
        ].join(' '),
      },
      {
        variant: 'default',
        size: 'default',
        class: [
          'rounded-[length:var(--radius)]',
          'px-[length:var(--spacing-xs)] py-[length:var(--spacing-2xs)]',
        ].join(' '),
      },
      {
        variant: 'default',
        size: 'lg',
        class: [
          'rounded-[length:var(--rounded-full)]',
          'px-[length:var(--spacing-md)] py-[length:var(--spacing-2-125)]',
        ].join(' '),
      },
      {
        variant: 'line',
        size: 'sm',
        class: [
          'group-data-[orientation=horizontal]/tabs:pb-[length:var(--spacing-xs)]',
          'group-data-[orientation=vertical]/tabs:pe-[length:var(--spacing-xs)]',
          '[&>[data-slot=tabs-trigger-content]]:rounded-[length:var(--rounded-md)]',
          '[&>[data-slot=tabs-trigger-content]]:px-[length:var(--spacing-1-5)]',
          '[&>[data-slot=tabs-trigger-content]]:py-[length:var(--spacing-3xs)]',
        ].join(' '),
      },
      {
        variant: 'line',
        size: 'default',
        class: [
          'group-data-[orientation=horizontal]/tabs:pb-[length:var(--spacing-xs)]',
          'group-data-[orientation=vertical]/tabs:pe-[length:var(--spacing-xs)]',
          /* Figma Content radius ~10 — closest Foundations `--rounded-md`. */
          '[&>[data-slot=tabs-trigger-content]]:rounded-[length:var(--rounded-md)]',
          '[&>[data-slot=tabs-trigger-content]]:px-[length:var(--spacing-xs)]',
          '[&>[data-slot=tabs-trigger-content]]:py-[length:var(--spacing-2xs)]',
        ].join(' '),
      },
      {
        variant: 'line',
        size: 'lg',
        class: [
          'group-data-[orientation=horizontal]/tabs:pb-[length:var(--spacing-xs)]',
          'group-data-[orientation=vertical]/tabs:pe-[length:var(--spacing-xs)]',
          '[&>[data-slot=tabs-trigger-content]]:rounded-[length:var(--rounded-md)]',
          '[&>[data-slot=tabs-trigger-content]]:px-[length:var(--spacing-2-5)]',
          '[&>[data-slot=tabs-trigger-content]]:py-[length:var(--spacing-1-5)]',
        ].join(' '),
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function TabsTrigger({
  className,
  children,
  ...props
}: TabsPrimitive.Tab.Props) {
  const { variant, size } = React.useContext(TabsListContext);

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      data-variant={variant}
      data-size={size}
      className={cn(tabsTriggerVariants({ variant, size }), className)}
      {...props}
    >
      {variant === 'line' ? (
        <span
          data-slot="tabs-trigger-content"
          className="inline-flex items-center justify-center gap-[inherit]"
        >
          {children}
        </span>
      ) : (
        children
      )}
    </TabsPrimitive.Tab>
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn(
        [
          'flex-1 outline-none',
          'font-[family-name:var(--font-family-body)]',
          'text-[length:var(--text-paragraph-small-medium-font-size)]',
          'leading-[var(--text-paragraph-small-medium-line-height)]',
          'text-[color:var(--foreground)]',
        ].join(' '),
        className
      )}
      {...props}
    />
  );
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
  tabsListVariants,
  tabsTriggerVariants,
  type TabsSize,
};
