/**
 * Fabely Combobox — Base UI autocomplete restyled with Foundations tokens.
 *
 * Figma: Select & Combobox (`16:1732`) — field chrome (radius 12, sizes,
 * focus/error). Popup rows use ListItem (same Menu Item set as Dropdown).
 * Public API matches [shadcn Combobox](https://ui.shadcn.com/docs/components/base/combobox).
 * Import from this primitive, not `src/components/ui/combobox`.
 */

'use client';

import * as React from 'react';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { IconButton } from '../button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemMedia,
  ListItemTitle,
  ListItemTrailing,
} from '../list-item';

const Combobox = ComboboxPrimitive.Root;

/**
 * Figma Select & Combobox field chrome — radius 12 / stroke @10.
 * Height is applied per host: single-line Input uses fixed `--spacing-9` (36);
 * Chips uses that as `min-height` and grows when chips wrap (Figma 2 Lines).
 */
const FIELD_CHROME = [
  'relative flex w-full min-w-0 items-center',
  'rounded-[length:var(--rounded-lg)]',
  'border-[length:var(--stroke-thin)] border-[color:var(--theme-alpha-black-switch-10)]',
  'bg-transparent',
  'transition-[color,box-shadow,background-color,border-color]',
  'outline-none',
  'has-[[data-slot=input-group-control]:focus-visible]:border-[color:var(--input)]',
  'has-[[data-slot=input-group-control]:focus-visible]:shadow-[var(--effect-focus-ring-secondary)]',
  'has-[[data-slot][aria-invalid=true]]:border-[color:var(--destructive)]',
  'has-[[data-slot][aria-invalid=true]]:has-[[data-slot=input-group-control]:focus-visible]:shadow-[var(--effect-focus-ring-error)]',
  'data-disabled:pointer-events-none data-disabled:opacity-50',
].join(' ');

const FIELD_SHELL = cn(FIELD_CHROME, 'h-[length:var(--spacing-9)]');

/** Popup surface — aligned with Dropdown Menu Content. */
const CONTENT_SURFACE = [
  'group/combobox-content relative isolate z-50',
  'max-h-(--available-height) w-(--anchor-width) max-w-(--available-width)',
  'min-w-(--anchor-width)',
  'origin-(--transform-origin) overflow-hidden',
  'rounded-[var(--radius)]',
  'bg-[var(--card)] text-[color:var(--foreground)]',
  'border-[length:var(--stroke-thin)] border-[color:var(--border)]',
  'shadow-[var(--shadow-lg-black)] dark:shadow-[var(--shadow-lg-white)]',
  'duration-100 outline-none',
  /* Chips field as anchor — lock popup width to the field so it does not
   * resize as chips wrap or selection length changes. */
  'data-[chips=true]:w-(--anchor-width)',
  'data-[chips=true]:min-w-(--anchor-width)',
  'data-[chips=true]:max-w-(--anchor-width)',
  'data-[side=bottom]:slide-in-from-top-2',
  'data-[side=inline-end]:slide-in-from-left-2',
  'data-[side=inline-start]:slide-in-from-right-2',
  'data-[side=left]:slide-in-from-right-2',
  'data-[side=right]:slide-in-from-left-2',
  'data-[side=top]:slide-in-from-bottom-2',
  'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
  'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
  '*:data-[slot=input-group]:m-[var(--spacing-xs)]',
  '*:data-[slot=input-group]:mb-0',
].join(' ');

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn(
        "[&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronsUpDownIcon className="pointer-events-none size-[length:var(--icon-sm)] shrink-0 text-muted-foreground" />
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      render={
        <InputGroupButton variant="ghost" size="icon-xs" aria-label="Clear" />
      }
      className={cn(className)}
      {...props}
    >
      <XIcon className="pointer-events-none size-[length:var(--icon-xs)]" />
    </ComboboxPrimitive.Clear>
  );
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean;
  showClear?: boolean;
}) {
  return (
    <InputGroup className={cn(FIELD_SHELL, 'w-auto', className)}>
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        disabled={disabled}
        {...props}
      />
      <InputGroupAddon
        align="inline-end"
        className="gap-[var(--spacing-2xs)] pe-[var(--spacing-xs)] ps-0"
      >
        {showTrigger ? (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            render={<ComboboxTrigger />}
            data-slot="input-group-button"
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            disabled={disabled}
          />
        ) : null}
        {showClear ? <ComboboxClear disabled={disabled} /> : null}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
}

function ComboboxContent({
  className,
  side = 'bottom',
  sideOffset = 8,
  align = 'start',
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    'side' | 'align' | 'sideOffset' | 'alignOffset' | 'anchor'
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn(CONTENT_SURFACE, className)}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        'no-scrollbar max-h-[calc(var(--available-height)-var(--spacing-9))] scroll-py-[var(--spacing-xs)] overflow-y-auto overscroll-contain p-[var(--spacing-xs)] data-empty:p-0',
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

/** Map free-form children onto ListItem slots (same idea as Dropdown Menu). */
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
        {titles.length > 0 ? titles : <ListItemTitle>{rest}</ListItemTitle>}
        {descriptions}
        {titles.length > 0 && rest.length > 0 ? (
          <ListItemTitle key="title-rest">{rest}</ListItemTitle>
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
        key="combobox-indicator"
        className="size-auto w-auto shrink-0 p-0"
      >
        <ComboboxPrimitive.ItemIndicator>
          <CheckIcon className="size-[length:var(--icon-xs)]" aria-hidden="true" />
        </ComboboxPrimitive.ItemIndicator>
      </ListItemTrailing>
    </>
  );
}

function ComboboxItem({
  className,
  children,
  disabled,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      disabled={disabled}
      className={cn('cursor-default', className)}
      render={<ListItem disabled={disabled} />}
      {...props}
    >
      {toListItemSlots(children)}
    </ComboboxPrimitive.Item>
  );
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn(className)}
      {...props}
    />
  );
}

function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
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

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  );
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        'hidden w-full justify-center py-[var(--spacing-sm)] text-center',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'text-muted-foreground group-data-empty/combobox-content:flex',
        className,
      )}
      {...props}
    />
  );
}

function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn(
        'my-[var(--spacing-xs)] h-px bg-[color:var(--border)]',
        className,
      )}
      {...props}
    />
  );
}

function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        FIELD_CHROME,
        /* One line = Figma Default 36; grow only when chips wrap to a 2nd line. */
        'h-auto min-h-[length:var(--spacing-9)] flex-wrap items-center',
        'gap-[var(--spacing-xs)]',
        'px-[var(--spacing-sm)] py-[var(--spacing-xs)]',
        'focus-within:border-[color:var(--input)]',
        'focus-within:shadow-[var(--effect-focus-ring-secondary)]',
        'has-aria-invalid:border-[color:var(--destructive)]',
        'has-data-[slot=combobox-chip]:ps-[var(--spacing-xs)]',
        className,
      )}
      {...props}
    />
  );
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean;
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        /* 20px chip + field py xs (8) = min-h 36 one-line rhythm. */
        'flex h-[length:var(--spacing-lg)] w-fit items-center justify-center gap-[var(--spacing-2xs)]',
        'rounded-[length:var(--rounded-sm)]',
        'bg-[var(--theme-alpha-black-switch-5)]',
        'px-[var(--spacing-xs)]',
        'text-[length:var(--text-paragraph-mini-medium-font-size)]',
        'leading-[var(--text-paragraph-mini-medium-line-height)]',
        '[font-weight:var(--font-weight-paragraph-medium)]',
        'whitespace-nowrap text-foreground',
        'has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50',
        'has-data-[slot=combobox-chip-remove]:pe-0',
        className,
      )}
      {...props}
    >
      {children}
      {showRemove ? (
        <ComboboxPrimitive.ChipRemove
          render={
            <IconButton
              variant="ghost"
              size="mini"
              aria-label="Remove"
              /* Fit inside 20px chip — IconButton mini is 24 by default. */
              className="size-[length:var(--spacing-lg)] opacity-50 hover:opacity-100"
            />
          }
          data-slot="combobox-chip-remove"
        >
          <XIcon className="pointer-events-none size-[length:var(--icon-xs)]" />
        </ComboboxPrimitive.ChipRemove>
      ) : null}
    </ComboboxPrimitive.Chip>
  );
}

function ComboboxChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn(
        'min-h-[length:var(--spacing-lg)] min-w-16 flex-1 bg-transparent outline-none',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        className,
      )}
      {...props}
    />
  );
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};
