/**
 * Fabely Command — cmdk command menu restyled with Foundations tokens.
 *
 * Figma: Command (`66:5046`) + Command Item (`66:5600`). Rows compose
 * ListItem (same Menu Item family as Dropdown / Combobox). Public API
 * matches [shadcn Command](https://ui.shadcn.com/docs/components/base/command).
 * Import from this primitive, not `src/components/ui/command`.
 */

'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { SearchIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../dialog';
import {
  InputGroup,
  InputGroupAddon,
} from '../input-group';
import {
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemMedia,
  ListItemTitle,
  ListItemTrailing,
} from '../list-item';

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        'flex size-full flex-col overflow-hidden',
        /* Figma Command surface — 16px card radius (semantic `--radius`). */
        'rounded-[length:var(--radius)]',
        'bg-[var(--background)] text-[color:var(--foreground)]',
        'border-[length:var(--stroke-thin)] border-[color:var(--border)]',
        'p-[var(--spacing-xs)]',
        'shadow-[var(--shadow-sm-black)] dark:shadow-[var(--shadow-sm-white)]',
        className,
      )}
      {...props}
    />
  );
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, 'children'> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          'top-[30%] translate-y-0 overflow-hidden p-0',
          'rounded-[length:var(--radius)]!',
          'sm:max-w-lg',
          className,
        )}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className={cn(
        /* Side/top inset is Command root `--spacing-xs`. Air below the field. */
        'pb-[var(--spacing-xs)]',
      )}
    >
      {/* cmdk Input is a third-party control — Input Group chrome lives on the shell. */}
      <InputGroup>
        <CommandPrimitive.Input
          data-slot="input-group-control"
          className={cn(
            'h-full min-h-0 w-full flex-1 self-stretch bg-transparent outline-hidden',
            'rounded-none border-0 px-0 py-0 shadow-none',
            'text-[length:var(--text-paragraph-small-regular-font-size)]',
            'leading-[var(--text-paragraph-small-regular-line-height)]',
            'focus-visible:border-transparent focus-visible:shadow-none',
            'disabled:cursor-not-allowed',
            className,
          )}
          {...props}
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        'no-scrollbar scroll-fade max-h-[calc(var(--spacing-3xl)*7)] scroll-py-[var(--spacing-2xs)] overflow-x-hidden overflow-y-auto outline-none',
        className,
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn(
        'py-[var(--spacing-xl)] text-center',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        /* Side inset comes from Command root (`--spacing-2xs` / 4) only. */
        'overflow-hidden py-[var(--spacing-2xs)] text-foreground',
        '**:[[cmdk-group-heading]]:px-[var(--spacing-xs)]',
        '**:[[cmdk-group-heading]]:py-[var(--spacing-1-375)]',
        '**:[[cmdk-group-heading]]:font-[family-name:var(--font-family-body)]',
        '**:[[cmdk-group-heading]]:[font-weight:var(--font-weight-sans-medium)]',
        '**:[[cmdk-group-heading]]:text-[length:var(--text-caption-mini-font-size)]',
        '**:[[cmdk-group-heading]]:leading-[var(--text-caption-mini-line-height)]',
        '**:[[cmdk-group-heading]]:tracking-[length:var(--text-caption-mini-letter-spacing)]',
        '**:[[cmdk-group-heading]]:text-muted-foreground',
        '**:[[cmdk-group-heading]]:uppercase',
        className,
      )}
      {...props}
    />
  );
}

/**
 * Same content width as results — side inset is Command root pad only.
 * Color: Figma alpha-5. Inset model shared with groups (see README).
 */
function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn(
        'my-[var(--spacing-xs)]',
        'h-[length:var(--stroke-thin)] bg-[color:var(--theme-alpha-black-switch-5)]',
        className,
      )}
      {...props}
    />
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        'text-[length:var(--text-paragraph-mini-regular-font-size)]',
        'leading-[var(--text-paragraph-mini-regular-line-height)]',
        'tracking-widest text-muted-foreground',
        'group-data-highlighted/list-item:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

function isCommandShortcut(
  child: React.ReactElement,
): child is React.ReactElement<React.ComponentProps<'span'>> {
  return (
    child.type === CommandShortcut ||
    (child.props as { 'data-slot'?: string })['data-slot'] ===
      'command-shortcut'
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
  if (isCommandShortcut(child) || isListItemSlot(child)) return false;
  const kids = (child.props as { children?: React.ReactNode }).children;
  return kids === undefined || kids === null || kids === false;
}

/** Map shadcn children (icon + label + Shortcut) onto ListItem slots. */
function toListItemSlots(children: React.ReactNode) {
  const arr = React.Children.toArray(children);
  const media: React.ReactNode[] = [];
  const content: React.ReactNode[] = [];
  const titles: React.ReactNode[] = [];
  const descriptions: React.ReactNode[] = [];
  const trailingExplicit: React.ReactNode[] = [];
  const shortcuts: React.ReactNode[] = [];
  const rest: React.ReactNode[] = [];

  for (const child of arr) {
    if (!React.isValidElement(child)) {
      rest.push(child);
      continue;
    }
    if (isCommandShortcut(child)) {
      shortcuts.push(child);
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
        {titles.length > 0 ? titles : <ListItemTitle>{rest}</ListItemTitle>}
        {descriptions}
        {titles.length > 0 && rest.length > 0 ? (
          <ListItemTitle key="title-rest">{rest}</ListItemTitle>
        ) : null}
      </ListItemContent>,
    );
  }

  const trailingNodes = [
    ...trailingExplicit,
    ...(shortcuts.length > 0
      ? [
          <ListItemTrailing
            key="command-shortcut"
            className="size-auto w-auto shrink-0 p-0"
          >
            {shortcuts}
          </ListItemTrailing>,
        ]
      : []),
  ];

  return (
    <>
      {mediaNodes}
      {contentNodes}
      {trailingNodes}
    </>
  );
}

/**
 * cmdk merges `data-selected` / `data-disabled` as booleans (`true`/`false`).
 * Remap active → ListItem `data-highlighted` (quiet @5), and drop the attrs so
 * idle rows stay unfilled.
 *
 * ListItem also paints on CSS `:hover`. cmdk keeps its own active row via
 * `onPointerMove` → `data-selected`, so `:hover` would highlight a second row
 * under the pointer. Disable hover fill here; only `data-highlighted` paints.
 */
const CommandListItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ListItem> & {
    'data-selected'?: boolean | string;
    'data-disabled'?: boolean | string;
  }
>(function CommandListItem(
  {
    className,
    disabled,
    'data-selected': dataSelected,
    'data-disabled': dataDisabled,
    ...props
  },
  ref,
) {
  const active =
    dataSelected === true || dataSelected === 'true' || dataSelected === '';
  const isDisabled =
    disabled ||
    dataDisabled === true ||
    dataDisabled === 'true' ||
    dataDisabled === '';

  return (
    <ListItem
      ref={ref}
      disabled={isDisabled}
      className={cn(
        /* Figma Command Item radius 12 (ListItem default is md / 8). */
        'rounded-[var(--rounded-lg)]',
        'cursor-default',
        /* One active row only — kill ListItem hover/hovered paint (`!` beats CVA order). */
        'hover:bg-transparent!',
        'data-[hovered]:bg-transparent!',
        /* Re-assert highlight under the pointer so transparent hover does not win. */
        'data-highlighted:bg-[var(--theme-alpha-black-switch-5)]!',
        'data-highlighted:hover:bg-[var(--theme-alpha-black-switch-5)]!',
        'data-highlighted:data-[hovered]:bg-[var(--theme-alpha-black-switch-5)]!',
        className,
      )}
      {...props}
      data-selected={undefined}
      data-disabled={undefined}
      data-highlighted={active ? true : undefined}
    />
  );
});

function CommandItem({
  className,
  children,
  disabled,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      asChild
      disabled={disabled}
      {...props}
    >
      <CommandListItem disabled={disabled} className={className}>
        {toListItemSlots(children)}
      </CommandListItem>
    </CommandPrimitive.Item>
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
