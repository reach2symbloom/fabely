/**
 * Fabely Dropdown Menu primitive — shadcn composition API, rows via ListItem.
 *
 * Vendor chrome lives in `src/components/ui/dropdown-menu.tsx`. This primitive
 * owns the public surface: Content/SubContent Foundations tokens, and every
 * leaf row (Item, CheckboxItem, RadioItem, SubTrigger) rendered through
 * ListItem rather than hand-rolled row styles — see docs/DESIGN.md.
 *
 * Checkbox / radio indicators → ListItemMedia (leading). Vendor places the
 * check on the right; we deviate so Trailing stays free for shortcuts /
 * submenu chevrons (documented in README).
 */
import * as React from 'react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
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

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

/** Content surface — Foundations radius, border, shadow, card colors. */
const CONTENT_SURFACE = [
  'z-50 max-h-(--available-height) w-(--anchor-width) min-w-72',
  'origin-(--transform-origin) overflow-x-hidden overflow-y-auto',
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

function DropdownMenuContent({
  align = 'start',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(CONTENT_SURFACE, className)}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
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

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
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
  if (!React.isValidElement(child)) return false;
  if (child.type === DropdownMenuShortcut) return true;
  const slot = (child.props as { 'data-slot'?: string })['data-slot'];
  /* Menubar composes this shortcut with its own data-slot. */
  return slot === 'dropdown-menu-shortcut' || slot === 'menubar-shortcut';
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

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  children,
  disabled,
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
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
    </MenuPrimitive.Item>
  );
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  disabled,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      disabled={disabled}
      className={cn('cursor-default', className)}
      render={<ListItem disabled={disabled} />}
      {...props}
    >
      {toListItemSlots(children, {
        inset,
        trailing: <ChevronRightIcon data-slot="dropdown-menu-sub-trigger-chevron" />,
      })}
    </MenuPrimitive.SubmenuTrigger>
  );
}

function DropdownMenuSubContent({
  align = 'start',
  alignOffset = -3,
  side = 'right',
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn('w-auto min-w-36', className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  disabled,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      checked={checked}
      disabled={disabled}
      className={cn('cursor-default', className)}
      render={
        /*
         * Checked is the leading indicator only — do not paint ListItem
         * selected / data-checked fill (multi-check menus like column
         * visibility would look fully “hovered”).
         */
        <ListItem
          disabled={disabled}
          className="data-checked:bg-transparent data-checked:data-highlighted:bg-[var(--theme-alpha-black-switch-5)]"
        />
      }
      {...props}
    >
      <ListItemMedia data-slot="dropdown-menu-checkbox-item-indicator">
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </ListItemMedia>
      {toListItemSlots(children, { inset: false })}
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  disabled,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      disabled={disabled}
      className={cn('cursor-default', className)}
      render={<ListItem disabled={disabled} />}
      {...props}
    >
      <ListItemMedia data-slot="dropdown-menu-radio-item-indicator">
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </ListItemMedia>
      {toListItemSlots(children, { inset: false })}
    </MenuPrimitive.RadioItem>
  );
}

/**
 * Full-bleed separator — cancels Content horizontal padding so the rule
 * spans edge to edge. Line: `--stroke-thin` + `--border`. Vertical rhythm:
 * `--spacing-xs`.
 */
function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
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
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
