/**
 * Fabely Select — Base UI select restyled from Figma Select & Combobox.
 *
 * Figma: Select & Combobox (`16:1732`) — field chrome (radius 12, sizes,
 * focus/error); chevron-down decoration. Popup rows use ListItem (same Menu
 * Item set as Dropdown / Combobox). Public API matches
 * [shadcn Select](https://ui.shadcn.com/docs/components/base/select).
 * Import from this primitive, not `src/components/ui/select`.
 */

'use client';

import * as React from 'react';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemMedia,
  ListItemTitle,
  ListItemTrailing,
} from '../list-item';

const Select = SelectPrimitive.Root;

/**
 * Figma Select & Combobox field chrome — radius 12 / stroke @10.
 * Default height `--spacing-9` (36); sm → `--spacing-2xl` (32).
 */
const TRIGGER_CHROME = [
  'flex w-fit min-w-0 items-center justify-between gap-[var(--spacing-xs)]',
  'rounded-[length:var(--rounded-lg)]',
  'border-[length:var(--stroke-thin)] border-[color:var(--theme-alpha-black-switch-10)]',
  'bg-transparent',
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
  'text-[length:var(--text-paragraph-small-regular-font-size)]',
  'leading-[var(--text-paragraph-small-regular-line-height)]',
  'text-[color:var(--foreground)]',
  'whitespace-nowrap outline-none select-none',
  'transition-[color,box-shadow,background-color,border-color,opacity]',
  'focus-visible:border-[color:var(--input)]',
  'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  'aria-invalid:border-[color:var(--destructive)]',
  'aria-invalid:focus-visible:shadow-[var(--effect-focus-ring-error)]',
  'data-placeholder:text-[color:var(--muted-foreground)]',
  '*:data-[slot=select-value]:line-clamp-1',
  '*:data-[slot=select-value]:flex',
  '*:data-[slot=select-value]:items-center',
  '*:data-[slot=select-value]:gap-[var(--spacing-xs)]',
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  "[&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
].join(' ');

/** Popup surface — aligned with Dropdown Menu / Combobox Content. */
const CONTENT_SURFACE = [
  'relative isolate z-50',
  'max-h-(--available-height) w-(--anchor-width) min-w-36',
  'origin-(--transform-origin) overflow-x-hidden overflow-y-auto',
  'scroll-fade-y',
  'rounded-[var(--radius)]',
  'bg-[var(--card)] text-[color:var(--card-foreground)]',
  'border-[length:var(--stroke-thin)] border-[color:var(--border)]',
  'p-[var(--spacing-xs)]',
  'shadow-[var(--shadow-lg-black)] dark:shadow-[var(--shadow-lg-white)]',
  'outline-none duration-[var(--duration-fast)]',
  'data-[align-trigger=true]:animate-none',
  'data-[side=bottom]:slide-in-from-top-2',
  'data-[side=inline-end]:slide-in-from-left-2',
  'data-[side=inline-start]:slide-in-from-right-2',
  'data-[side=left]:slide-in-from-right-2',
  'data-[side=right]:slide-in-from-left-2',
  'data-[side=top]:slide-in-from-bottom-2',
  'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
  'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
].join(' ');

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn('scroll-my-[var(--spacing-xs)]', className)}
      {...props}
    />
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn('flex flex-1 text-left', className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: 'sm' | 'default';
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        TRIGGER_CHROME,
        size === 'default' && [
          'h-[length:var(--spacing-9)] min-h-[length:var(--spacing-9)]',
          'py-[var(--spacing-xs)] pl-[var(--spacing-sm)] pr-[var(--spacing-xs)]',
        ],
        size === 'sm' && [
          'h-[length:var(--spacing-2xl)] min-h-[length:var(--spacing-2xl)]',
          'gap-[var(--spacing-1-5)] px-[var(--spacing-xs)]',
          'py-[var(--spacing-1-375)]',
        ],
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon
            className={cn(
              'pointer-events-none shrink-0',
              'size-[length:var(--icon-sm)]',
              'text-[color:var(--muted-foreground)]',
            )}
          />
        }
      />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(CONTENT_SURFACE, className)}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        'px-[var(--spacing-xs)] py-[var(--spacing-1-375)]',
        'font-[family-name:var(--font-family-body)]',
        '[font-weight:var(--font-weight-sans-medium)]',
        'text-[length:var(--text-caption-mini-font-size)]',
        'leading-[var(--text-caption-mini-line-height)]',
        'tracking-[length:var(--text-caption-mini-letter-spacing)]',
        'text-[color:var(--muted-foreground)] uppercase',
        className,
      )}
      {...props}
    />
  );
}

function isListItemSlot(child: React.ReactElement): boolean {
  return (
    child.type === ListItemMedia ||
    child.type === ListItemContent ||
    child.type === ListItemTitle ||
    child.type === ListItemDescription ||
    child.type === ListItemTrailing
  );
}

function isLeadingIcon(child: React.ReactElement): boolean {
  if (typeof child.type === 'string') return false;
  if (isListItemSlot(child)) return false;
  const kids = (child.props as { children?: React.ReactNode }).children;
  return kids === undefined || kids === null || kids === false;
}

/** Map free-form children onto ListItem slots (same idea as Combobox / Dropdown). */
function toListItemSlots(children: React.ReactNode) {
  const arr = React.Children.toArray(children);
  const media: React.ReactNode[] = [];
  const content: React.ReactNode[] = [];
  const titles: React.ReactNode[] = [];
  const descriptions: React.ReactNode[] = [];
  const trailingExplicit: React.ReactNode[] = [];
  const rest: React.ReactNode[] = [];

  for (const child of arr) {
    if (!React.isValidElement(child)) {
      rest.push(child);
      continue;
    }
    if (child.type === ListItemMedia) {
      media.push(child);
      continue;
    }
    if (child.type === ListItemContent) {
      content.push(child);
      continue;
    }
    if (child.type === ListItemTitle) {
      titles.push(child);
      continue;
    }
    if (child.type === ListItemDescription) {
      descriptions.push(child);
      continue;
    }
    if (child.type === ListItemTrailing) {
      trailingExplicit.push(child);
      continue;
    }
    if (isLeadingIcon(child)) {
      media.push(child);
      continue;
    }
    rest.push(child);
  }

  const mediaNodes = media.map((node, i) =>
    React.isValidElement(node) && node.type === ListItemMedia ? (
      node
    ) : (
      <ListItemMedia key={`media-${i}`}>{node}</ListItemMedia>
    ),
  );

  const contentNodes: React.ReactNode[] = [...content];
  if (titles.length > 0 || descriptions.length > 0 || rest.length > 0) {
    contentNodes.push(
      <ListItemContent key="content">
        {titles.length > 0 ? (
          titles
        ) : (
          <ListItemTitle>
            <SelectPrimitive.ItemText>{rest}</SelectPrimitive.ItemText>
          </ListItemTitle>
        )}
        {descriptions}
        {titles.length > 0 && rest.length > 0 ? (
          <ListItemTitle key="title-rest">
            <SelectPrimitive.ItemText>{rest}</SelectPrimitive.ItemText>
          </ListItemTitle>
        ) : null}
      </ListItemContent>,
    );
  }

  return (
    <>
      {mediaNodes}
      {contentNodes}
      {trailingExplicit}
      <ListItemTrailing
        key="select-indicator"
        className="size-auto w-auto shrink-0 p-0"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon
            className="size-[length:var(--icon-xs)]"
            aria-hidden="true"
          />
        </SelectPrimitive.ItemIndicator>
      </ListItemTrailing>
    </>
  );
}

function SelectItem({
  className,
  children,
  disabled,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      disabled={disabled}
      className={cn('cursor-default outline-hidden select-none', className)}
      render={<ListItem disabled={disabled} />}
      {...props}
    >
      {toListItemSlots(children)}
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        'pointer-events-none -mx-[var(--spacing-xs)] my-[var(--spacing-xs)]',
        'h-[length:var(--stroke-thin)] bg-[color:var(--border)]',
        className,
      )}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        'top-0 z-10 flex w-full cursor-default items-center justify-center',
        'bg-[var(--card)] py-[var(--spacing-3xs)]',
        "[&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        'bottom-0 z-10 flex w-full cursor-default items-center justify-center',
        'bg-[var(--card)] py-[var(--spacing-3xs)]',
        "[&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
