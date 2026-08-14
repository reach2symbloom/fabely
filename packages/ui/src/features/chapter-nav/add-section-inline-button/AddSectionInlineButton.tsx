/**
 * Add Section Inline Button — insert row between manuscript sections.
 *
 * Figma: Add section inline button (`16373:4624`) Chapter / Scene / Act
 * variants. Chapter / Scene: plus (Icon Button) left of a hover-only
 * 1px divider. Chapter plus or divider opens a Dropdown Menu (Chapter /
 * Act). Scene plus or divider inserts directly.
 *
 * Placement: feature. Stays in `src/features/chapter-nav/`.
 *
 * Chapter / Scene: list gap is always `--spacing-sm` (12) — rest and hover.
 * Chrome (plus + divider) fades in (opacity). No height change.
 */

'use client';

import * as React from 'react';
import { PlusIcon, SeparatorHorizontalIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { IconButton } from '@/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/primitives/dropdown-menu';
import { Input } from '@/primitives/input';
import { Separator } from '@/primitives/separator';

export type AddSectionInlineType =
  | 'chapter'
  | 'scene'
  | 'actUntitled'
  | 'actNoOnly'
  | 'actTitled';

/**
 * How a Chapter / Act / Scene control fires. Prefer `onClick` for app
 * handlers. `href` still runs via the item click (callers who need a real
 * `<a>` should handle navigation in `onClick`). `formAction` / `formMethod`
 * apply when the control is a submit button (Scene plus).
 */
export type AddSectionAction = {
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  formAction?: string;
  formMethod?: string;
  form?: string;
  type?: 'button' | 'submit' | 'reset';
};

export type AddSectionInlineButtonProps = {
  /** Figma Type axis (insert + Act split-parse). */
  type?: AddSectionInlineType;
  /**
   * 1-based position in the act sequence. Drives the roman numeral for all
   * Act variants (I, II, III, …). Not editable — sequence-owned.
   */
  actIndex?: number;
  /** Act title field value when type is untitled / titled. */
  actTitle?: string;
  placeholder?: string;
  className?: string;
  /**
   * Chapter / Scene: hide plus + divider until the gap is hovered (or
   * focused / menu-open). Default `true` for those types; Act rows stay visible.
   */
  revealOnHover?: boolean;
  /** Storybook / demos — lock Chapter / Scene chrome visible. */
  forceHover?: boolean;
  /** Storybook / demos — lock the Chapter / Act menu open. */
  forceOpen?: boolean;
  /** Wire the Chapter menu item (Chapter type row). */
  addChapter?: AddSectionAction;
  /** Wire the Act menu item (Chapter type row). */
  addAct?: AddSectionAction;
  /** Wire the Scene plus (Scene type row). */
  addScene?: AddSectionAction;
  /**
   * Shorthand click handlers — merged after `add*.onClick`. Prefer `addChapter`
   * / `addAct` / `addScene` when you also need `href` or form attributes.
   */
  onAddChapter?: () => void;
  onAddAct?: () => void;
  onAddScene?: () => void;
  onActTitleChange?: (value: string) => void;
};

const actSerifType = [
  'font-[family-name:var(--text-paragraph-serif-regular-font-family)]',
  '[font-weight:var(--text-paragraph-serif-regular-font-weight)]',
  'text-[length:var(--text-paragraph-serif-regular-font-size)]',
  'leading-[var(--text-paragraph-serif-regular-line-height)]',
  'tracking-[var(--text-paragraph-serif-regular-letter-spacing)]',
].join(' ');

const insertChromeReveal = [
  'opacity-0',
  'pointer-events-none',
  'transition-opacity duration-fast ease-emphasized',
  'group-hover/add-section-insert:opacity-100',
  'group-hover/add-section-insert:pointer-events-auto',
  'group-focus-within/add-section-insert:opacity-100',
  'group-focus-within/add-section-insert:pointer-events-auto',
  'group-data-[force-hover=true]/add-section-insert:opacity-100',
  'group-data-[force-hover=true]/add-section-insert:pointer-events-auto',
].join(' ');

function ActDiamondRail() {
  return (
    <div
      aria-hidden
      className="flex min-w-0 flex-1 items-center self-stretch text-[color:var(--theme-alpha-black-switch-5)]"
    >
      <span className="size-[length:var(--spacing-1-5)] shrink-0 rotate-45 bg-current" />
      <span className="h-[length:var(--stroke-thin)] min-w-0 flex-1 bg-current" />
      <span className="size-[length:var(--spacing-1-5)] shrink-0 rotate-45 bg-current" />
    </div>
  );
}

function InsertLine({
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      role="presentation"
      data-slot="add-section-insert-line"
      className={cn(
        'group/insert-line flex min-h-[length:var(--spacing-sm)] min-w-0 flex-1 cursor-pointer items-center',
      )}
      onClick={onClick}
    >
      <Separator
        aria-hidden
        orientation="horizontal"
        size="thin"
        spacing="none"
        className={cn(
          'min-w-0 w-auto flex-1',
          'h-[length:var(--stroke-thin)]',
          'bg-[color:var(--theme-alpha-black-switch-5)]',
          'transition-[background-color] duration-fast ease-emphasized',
          'group-hover/insert-line:bg-[color:var(--theme-alpha-black-switch-25)]',
        )}
      />
    </div>
  );
}

/** 1-based act sequence → uppercase roman (I … MMMCMXCIX). */
function toRomanNumeral(index: number): string {
  const n = Math.floor(index);
  if (!Number.isFinite(n) || n < 1) return 'I';
  const table: Array<[number, string]> = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let remaining = Math.min(n, 3999);
  let out = '';
  for (const [value, glyph] of table) {
    while (remaining >= value) {
      out += glyph;
      remaining -= value;
    }
  }
  return out;
}

function fireAction(
  event: React.MouseEvent<HTMLElement>,
  action?: AddSectionAction,
  onAdd?: () => void,
) {
  action?.onClick?.(
    event as React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  );
  if (!event.defaultPrevented) onAdd?.();
}

function InsertPlusButton({
  ariaLabel,
  onClick,
  formAction,
  formMethod,
  form,
  type = 'button',
}: {
  ariaLabel: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  formAction?: string;
  formMethod?: string;
  form?: string;
  type?: 'button' | 'submit' | 'reset';
}) {
  return (
    <IconButton
      variant="ghost"
      size="mini"
      roundness="round"
      aria-label={ariaLabel}
      type={type}
      onClick={onClick}
      formAction={formAction}
      formMethod={formMethod}
      form={form}
    >
      <PlusIcon />
    </IconButton>
  );
}

function InsertMenuItem({
  action,
  onAdd,
  children,
}: {
  action?: AddSectionAction;
  onAdd?: () => void;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenuItem onClick={(event) => fireAction(event, action, onAdd)}>
      {children}
    </DropdownMenuItem>
  );
}

function InsertChrome({
  type,
  reveal,
  menuOpen,
  onMenuOpenChange,
  addChapter,
  addAct,
  addScene,
  onAddChapter,
  onAddAct,
  onAddScene,
}: {
  type: 'chapter' | 'scene';
  reveal: boolean;
  menuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  addChapter?: AddSectionAction;
  addAct?: AddSectionAction;
  addScene?: AddSectionAction;
  onAddChapter?: () => void;
  onAddAct?: () => void;
  onAddScene?: () => void;
}) {
  const plusAndLine = (
    plus: React.ReactNode,
    onLineClick?: React.MouseEventHandler<HTMLDivElement>,
  ) => (
    <div
      className={cn(
        'flex w-full max-w-full items-center gap-[length:var(--spacing-2xs)]',
        reveal && insertChromeReveal,
      )}
    >
      <div
        className={cn(
          'shrink-0',
          /*
           * Same column as chapter chevron: list item uses
           * `left: -lg + 2xs` on a `--icon-xs` box. Mini Icon Button is
           * `--spacing-xl`; pull an extra `--spacing-1-5` so the plus
           * glyph shares that plane (half the 24 vs 12 size delta).
           */
          'ms-[calc(-1*var(--spacing-lg)+var(--spacing-2xs)-var(--spacing-1-5))]',
        )}
      >
        {plus}
      </div>
      <InsertLine onClick={onLineClick} />
    </div>
  );

  if (type === 'scene') {
    const addSceneNow: React.MouseEventHandler<HTMLElement> = (event) =>
      fireAction(event, addScene, onAddScene);

    return plusAndLine(
      <InsertPlusButton
        ariaLabel="Add scene"
        type={addScene?.type ?? 'button'}
        formAction={addScene?.formAction}
        formMethod={addScene?.formMethod}
        form={addScene?.form}
        onClick={addSceneNow}
      />,
      addSceneNow,
    );
  }

  return (
    <DropdownMenu open={menuOpen} onOpenChange={onMenuOpenChange}>
      {plusAndLine(
        <DropdownMenuTrigger
          render={
            <IconButton
              variant="ghost"
              size="mini"
              roundness="round"
              aria-label="Add chapter or act"
            />
          }
        >
          <PlusIcon />
        </DropdownMenuTrigger>,
        () => onMenuOpenChange?.(true),
      )}
      <DropdownMenuContent
        align="start"
        side="bottom"
        className="w-auto min-w-48"
      >
        <DropdownMenuGroup>
          <InsertMenuItem action={addChapter} onAdd={onAddChapter}>
            <PlusIcon />
            Chapter
          </InsertMenuItem>
          <InsertMenuItem action={addAct} onAdd={onAddAct}>
            <SeparatorHorizontalIcon />
            Act
          </InsertMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AddSectionInlineButton({
  type = 'chapter',
  actIndex = 1,
  actTitle,
  placeholder = 'Untitled',
  className,
  revealOnHover,
  forceHover = false,
  forceOpen = false,
  addChapter,
  addAct,
  addScene,
  onAddChapter,
  onAddAct,
  onAddScene,
  onActTitleChange,
}: AddSectionInlineButtonProps) {
  const [title, setTitle] = React.useState(actTitle ?? '');
  const [menuOpen, setMenuOpen] = React.useState(forceOpen);

  React.useEffect(() => {
    if (actTitle !== undefined) setTitle(actTitle);
  }, [actTitle]);

  React.useEffect(() => {
    if (forceOpen) setMenuOpen(true);
  }, [forceOpen]);

  const isAct =
    type === 'actUntitled' || type === 'actNoOnly' || type === 'actTitled';
  const hideUntilGapHover = revealOnHover ?? !isAct;
  const chromeVisible = forceHover || menuOpen;

  function commitTitle(next: string) {
    setTitle(next);
    onActTitleChange?.(next);
  }

  if (isAct) {
    const roman = toRomanNumeral(actIndex);

    if (type === 'actNoOnly') {
      return (
        <div
          data-slot="add-section-inline-button"
          data-type={type}
          className={cn(
            'flex w-full max-w-full items-center gap-[var(--spacing-sm)]',
            'pt-[var(--spacing-sm)] pb-[var(--spacing-xs)]',
            className,
          )}
        >
          <ActDiamondRail />
          <span
            aria-label={`Act ${roman}`}
            className={cn(
              actSerifType,
              'shrink-0 px-[var(--spacing-1-5)]',
              'text-[color:var(--neutrals-new-500)] whitespace-nowrap',
            )}
          >
            {roman}
          </span>
          <ActDiamondRail />
        </div>
      );
    }

    return (
      <div
        data-slot="add-section-inline-button"
        data-type={type}
        className={cn(
          'flex w-full max-w-full items-center gap-[var(--spacing-sm)]',
          'pt-[var(--spacing-sm)] pb-[var(--spacing-xs)]',
          className,
        )}
      >
        <ActDiamondRail />
        <div className="flex shrink-0 items-center gap-[var(--spacing-2xs)]">
          <span
            className={cn(
              actSerifType,
              'text-[color:var(--neutrals-new-500)] whitespace-nowrap',
            )}
          >
            {`${roman}.`}
          </span>
          <Input
            variant="quiet"
            size="mini"
            aria-label="Act title"
            value={title}
            placeholder={type === 'actUntitled' ? placeholder : undefined}
            onChange={(event) => commitTitle(event.currentTarget.value)}
            className={cn(
              actSerifType,
              'h-[length:var(--spacing-2xl)] w-auto field-sizing-content',
              'rounded-[length:var(--rounded-md)]',
              'px-[var(--spacing-1-5)]',
              'text-[color:var(--neutrals-new-500)]',
              'placeholder:text-[color:var(--theme-alpha-black-switch-25)]',
            )}
          />
        </div>
        <ActDiamondRail />
      </div>
    );
  }

  const chrome = (
    <InsertChrome
      type={type}
      reveal={hideUntilGapHover}
      menuOpen={type === 'chapter' ? (forceOpen || menuOpen) : undefined}
      onMenuOpenChange={
        type === 'chapter'
          ? (next) => {
              if (!forceOpen) setMenuOpen(next);
            }
          : undefined
      }
      addChapter={addChapter}
      addAct={addAct}
      addScene={addScene}
      onAddChapter={onAddChapter}
      onAddAct={onAddAct}
      onAddScene={onAddScene}
    />
  );

  if (!hideUntilGapHover) {
    return (
      <div
        data-slot="add-section-inline-button"
        data-type={type}
        className={cn(
          'w-full max-w-full py-[length:var(--spacing-2xs)]',
          className,
        )}
      >
        {chrome}
      </div>
    );
  }

  /*
   * Hit-zone is `--spacing-sm` (12) at rest and on hover. Plus is Icon Button
   * mini (24) and overlays; overflow visible so it is not clipped.
   * Opacity only — no height change.
   */
  return (
    <div
      data-slot="add-section-inline-button"
      data-type={type}
      data-force-hover={chromeVisible || undefined}
      className={cn(
        'group/add-section-insert relative z-10 isolate overflow-visible',
        'h-[length:var(--spacing-sm)] w-full max-w-full shrink-0',
        className,
      )}
    >
      <div className="absolute inset-x-0 top-1/2 z-20 -translate-y-1/2">
        {chrome}
      </div>
    </div>
  );
}

/** 12px rest-and-hover gap between outline rows. */
function AddSectionInlineGap({
  className,
  ...props
}: AddSectionInlineButtonProps) {
  return (
    <div
      data-slot="add-section-inline-gap"
      className={cn('w-full shrink-0', className)}
    >
      <AddSectionInlineButton {...props} />
    </div>
  );
}

export { AddSectionInlineButton, AddSectionInlineGap };
