/**
 * Fabely Context Menu primitive — shadcn composition API, rows via ListItem.
 *
 * Vendor chrome lives in `src/components/ui/context-menu.tsx`. This primitive
 * owns the public surface: Content/SubContent Foundations tokens, and every
 * leaf row (Item, CheckboxItem, RadioItem, SubTrigger) rendered through
 * ListItem rather than hand-rolled row styles — see docs/DESIGN.md.
 *
 * Mirrors Dropdown Menu (same surface, ListItem composition, leading
 * checkbox/radio indicators). Deviations: Context Menu Base UI package,
 * Trigger `select-none`, Content position defaults from vendor, and
 * `scroll-fade` + `no-scrollbar` on the overflow popup.
 */
import * as React from 'react';
import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemMedia,
  ListItemTitle,
  ListItemTrailing,
} from '../list-item';

function ContextMenu({ ...props }: ContextMenuPrimitive.Root.Props) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuPortal({ ...props }: ContextMenuPrimitive.Portal.Props) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  );
}

function ContextMenuTrigger({
  className,
  ...props
}: ContextMenuPrimitive.Trigger.Props) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      className={cn('select-none', className)}
      {...props}
    />
  );
}

/** Content surface — Foundations radius, border, shadow, card colors. */
const CONTENT_SURFACE = [
  'z-50 max-h-(--available-height) min-w-72',
  'origin-(--transform-origin)',
  'no-scrollbar scroll-fade overflow-x-hidden overflow-y-auto',
  'rounded-[var(--radius)]',
  'bg-[var(--card)] text-[color:var(--card-foreground)]',
  'border-[length:var(--stroke-thin)] border-[color:var(--border)]',
  'p-[var(--spacing-xs)]',
  'shadow-[var(--shadow-lg-black)] dark:shadow-[var(--shadow-lg-white)]',
  'outline-none duration-100',
  'data-[side=bottom]:slide-in-from-top-2',
  'data-[side=inline-end]:slide-in-from-left-2',
  'data-[side=inline-start]:slide-in-from-right-2',
  'data-[side=left]:slide-in-from-right-2',
  'data-[side=right]:slide-in-from-left-2',
  'data-[side=top]:slide-in-from-bottom-2',
  'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
  'data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95',
].join(' ');

function ContextMenuContent({
  align = 'start',
  alignOffset = 4,
  side = 'right',
  sideOffset = 0,
  className,
  ...props
}: ContextMenuPrimitive.Popup.Props &
  Pick<
    ContextMenuPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  >) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <ContextMenuPrimitive.Popup
          data-slot="context-menu-content"
          className={cn(CONTENT_SURFACE, className)}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuGroup({ ...props }: ContextMenuPrimitive.Group.Props) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  );
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: ContextMenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.GroupLabel
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        'px-[var(--spacing-xs)] py-[var(--spacing-1-375)]',
        'font-[family-name:var(--font-family-body)]',
        '[font-weight:var(--font-weight-sans-medium)]',
        'text-[length:var(--text-caption-mini-font-size)]',
        'leading-[var(--text-caption-mini-line-height)]',
        'tracking-[length:var(--text-caption-mini-letter-spacing)]',
        'text-[color:var(--muted-foreground)] uppercase',
        'data-inset:pl-[var(--spacing-9)]',
        className
      )}
      {...props}
    />
  );
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        'text-[length:var(--text-paragraph-mini-regular-font-size)]',
        'leading-[var(--text-paragraph-mini-regular-line-height)]',
        'tracking-[length:var(--text-caption-mini-letter-spacing)]',
        'text-[color:var(--muted-foreground)]',
        className
      )}
      {...props}
    />
  );
}

function isShortcutElement(
  child: React.ReactNode
): child is React.ReactElement<React.ComponentProps<'span'>> {
  return (
    React.isValidElement(child) &&
    (child.type === ContextMenuShortcut ||
      (child.props as { 'data-slot'?: string })['data-slot'] ===
        'context-menu-shortcut')
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

/** Leading glyph heuristic — element with no / empty children (Lucide, etc.). */
function isLeadingIcon(child: React.ReactElement): boolean {
  if (typeof child.type === 'string') return false;
  if (isShortcutElement(child) || isListItemSlot(child)) return false;
  const kids = (child.props as { children?: React.ReactNode }).children;
  return kids === undefined || kids === null || kids === false;
}

/**
 * Map free-form shadcn children (icon + label + Shortcut) onto ListItem slots.
 * Explicit ListItem* children pass through; Shortcut always → Trailing.
 */
function toListItemSlots(
  children: React.ReactNode,
  options?: { inset?: boolean; trailing?: React.ReactNode }
) {
  const arr = React.Children.toArray(children);
  const shortcuts: React.ReactNode[] = [];
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
    if (isShortcutElement(child)) {
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

  const trailingNodes = [
    ...trailingExplicit,
    ...(shortcuts.length > 0 || options?.trailing
      ? [
          <ListItemTrailing
            key="menu-trailing"
            className="size-auto w-auto shrink-0 gap-[var(--spacing-xs)] p-0"
          >
            {shortcuts}
            {options?.trailing}
          </ListItemTrailing>,
        ]
      : []),
  ];

  const mediaNodes =
    media.length > 0
      ? media.map((node, i) =>
          React.isValidElement(node) && node.type === ListItemMedia ? (
            node
          ) : (
            <ListItemMedia key={`media-${i}`}>{node}</ListItemMedia>
          )
        )
      : options?.inset
        ? [<ListItemMedia key="inset-spacer" aria-hidden />]
        : [];

  const contentNodes: React.ReactNode[] = [...content];

  if (titles.length > 0 || descriptions.length > 0 || rest.length > 0) {
    contentNodes.push(
      <ListItemContent key="content">
        {titles.length > 0 ? titles : <ListItemTitle>{rest}</ListItemTitle>}
        {descriptions}
        {titles.length > 0 && rest.length > 0 ? (
          <ListItemTitle key="title-rest">{rest}</ListItemTitle>
        ) : null}
      </ListItemContent>
    );
  }

  return (
    <>
      {mediaNodes}
      {contentNodes}
      {trailingNodes}
    </>
  );
}

function ContextMenuItem({
  className,
  inset,
  variant = 'default',
  children,
  disabled,
  ...props
}: ContextMenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      disabled={disabled}
      className={cn('cursor-default', className)}
      render={
        <ListItem
          variant={variant === 'destructive' ? 'destructive' : 'default'}
          disabled={disabled}
        />
      }
      {...props}
    >
      {toListItemSlots(children, { inset })}
    </ContextMenuPrimitive.Item>
  );
}

function ContextMenuSub({ ...props }: ContextMenuPrimitive.SubmenuRoot.Props) {
  return (
    <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />
  );
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  disabled,
  ...props
}: ContextMenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      disabled={disabled}
      className={cn('cursor-default', className)}
      render={<ListItem disabled={disabled} />}
      {...props}
    >
      {toListItemSlots(children, {
        inset,
        trailing: (
          <ChevronRightIcon data-slot="context-menu-sub-trigger-chevron" />
        ),
      })}
    </ContextMenuPrimitive.SubmenuTrigger>
  );
}

function ContextMenuSubContent({
  align = 'start',
  alignOffset = -3,
  side = 'right',
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuContent>) {
  return (
    <ContextMenuContent
      data-slot="context-menu-sub-content"
      className={cn('w-auto min-w-36', className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  disabled,
  ...props
}: ContextMenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      data-inset={inset}
      checked={checked}
      disabled={disabled}
      className={cn('cursor-default', className)}
      render={
        /*
         * Checked is the leading indicator only — do not paint ListItem
         * selected / data-checked fill (multi-check menus would look
         * fully “hovered”).
         */
        <ListItem
          disabled={disabled}
          className="data-checked:bg-transparent data-checked:data-highlighted:bg-[var(--theme-alpha-black-switch-5)]"
        />
      }
      {...props}
    >
      <ListItemMedia data-slot="context-menu-checkbox-item-indicator">
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </ListItemMedia>
      {toListItemSlots(children, { inset: false })}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioGroup({
  ...props
}: ContextMenuPrimitive.RadioGroup.Props) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}

function ContextMenuRadioItem({
  className,
  children,
  inset,
  disabled,
  ...props
}: ContextMenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      data-inset={inset}
      disabled={disabled}
      className={cn('cursor-default', className)}
      render={<ListItem disabled={disabled} />}
      {...props}
    >
      <ListItemMedia data-slot="context-menu-radio-item-indicator">
        <ContextMenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.RadioItemIndicator>
      </ListItemMedia>
      {toListItemSlots(children, { inset: false })}
    </ContextMenuPrimitive.RadioItem>
  );
}

/**
 * Full-bleed separator — cancels Content horizontal padding so the rule
 * spans edge to edge. Line: `--stroke-thin` + `--border`. Vertical rhythm:
 * `--spacing-xs`. Matches Dropdown Menu (menu family).
 */
function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuPrimitive.Separator.Props) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn(
        '-mx-[var(--spacing-xs)] my-[var(--spacing-xs)]',
        'h-[length:var(--stroke-thin)] bg-[color:var(--border)]',
        className
      )}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuPortal,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
};
