/**
 * Chapter Menu List Item — outline row for chapters, scenes, and sub-scenes.
 *
 * Figma set: Chapter menu list item (`16371:635`). Leaf types are Chapter /
 * Scene / Sub-scene; Expanded composites are the same leaf plus nested
 * children under a vertical rail.
 *
 * Names are a field-sizing Textarea (Quiet Mini) inside Input Group, so long
 * titles wrap to a 2nd line instead of overflowing the row (clipped beyond
 * that). Chapter rows add a Prepend text addon (`Ch. N` — no colon; Figma
 * list item); Scene / sub-scene wrap the Textarea alone, no addon.
 *
 * Rename is double-click, not single-click: hover only shifts ink color
 * (no bounding box / field chrome), so a plain pointerdown is unambiguously
 * free for drag — no drag-handle icon, the whole row is the drag source.
 * Double-click focuses the field and selects all text; the actions menu's
 * "Rename" item does the same. This deliberately differs from Chapter Nav
 * Button's single-click-to-edit — that control has no drag competing for
 * the click, this one does (see README).
 *
 * Chapter chevron is a scenes dropdown: it mounts only when the chapter has
 * scene `children`, and toggles the nested tree (Figma Chapter + scenes).
 * The trailing ellipsis opens a Delete / Archive / Rename menu (chapter
 * rows only).
 */

'use client';

import * as React from 'react';
import {
  ArchiveIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CircleIcon,
  DotIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { IconButton } from '@/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/primitives/dropdown-menu';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from '@/primitives/input-group';
import { Separator } from '@/primitives/separator';
import { Textarea } from '@/primitives/textarea';

export type ChapterMenuListItemType = 'chapter' | 'scene' | 'subscene';

export type ChapterMenuListItemProps = {
  type?: ChapterMenuListItemType;
  /** Chapter / scene / sub-scene name. Empty → Untitled placeholder when chapter. */
  label?: string;
  chapterNumber?: number;
  /** Scene index shown beside the circle marker. */
  sceneNumber?: number;
  /** Chapter with muted “Untitled” placeholder (empty value). */
  untitled?: boolean;
  /**
   * Chapter scenes dropdown open. When omitted, starts closed and toggles
   * from the chevron (uncontrolled). Pass with `onExpandToggle` to control.
   */
  expanded?: boolean;
  /**
   * Figma Show dropdown arrow. Default on when this chapter has scene
   * `children`. Chapters with no individual scenes omit the chevron.
   * Pass `false` to hide even when scenes exist.
   */
  showChevron?: boolean;
  /** Trailing ellipsis (Figma Show dot menu). Visible on hover / forceHover. */
  showActions?: boolean;
  /** Figma Drag axis — paints the same secondary ink as hover. */
  drag?: boolean;
  /** Playground / Storybook — lock the hover paint without a pointer. */
  forceHover?: boolean;
  /**
   * Manuscript section URL. Prefer a real route; Storybook uses `#` (or
   * `#chapter-1` / `#scene-2`) as a placeholder. Renders a stretched link
   * behind the row — input / chevron / actions stay above it.
   */
  href?: string;
  placeholder?: string;
  className?: string;
  /** Scene / sub-scene rows. Presence enables the chapter chevron dropdown. */
  children?: React.ReactNode;
  onLabelChange?: (label: string) => void;
  /** Fires when the chapter scenes chevron is toggled. */
  onExpandToggle?: () => void;
  /** Chapter actions menu — Delete. */
  onDeleteChapter?: () => void;
  /** Chapter actions menu — Archive. */
  onArchiveChapter?: () => void;
  /** Chapter actions menu — Rename (also fires from double-click, its primary trigger). */
  onRenameChapter?: () => void;
};

const DEFAULT_PLACEHOLDER = 'Untitled';

const paragraphRegular = [
  'font-[family-name:var(--text-paragraph-regular-regular-font-family)]',
  '[font-weight:var(--text-paragraph-regular-regular-font-weight)]',
  'text-[length:var(--text-paragraph-regular-regular-font-size)]',
  'leading-[var(--text-paragraph-regular-regular-line-height)]',
  'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
].join(' ');

const hoverInk =
  'group-data-[force-hover=true]/chapter-menu-item:text-[color:var(--tw-raw-secondary-200)] group-data-[drag=true]/chapter-menu-item:text-[color:var(--tw-raw-secondary-200)] group-hover/chapter-menu-item:text-[color:var(--tw-raw-secondary-200)]';

/**
 * Fixed-width, left-aligned slot for the chapter number — `--spacing-lg`
 * (20px). At the 16px `text-paragraph-regular-regular` size this fits two
 * digits (up to 99) with a little breathing room; three digits (100+) will
 * overflow (see README — treated as an acceptable edge case, not sized
 * for). Left-aligned so "9" sits right after "Ch." like natural type, and
 * `tabular-nums` + the fixed slot width still put the title on a fixed x
 * regardless of 1 vs 2 digits — the variable gap moves to sit between the
 * number and the title instead of between "Ch." and the number.
 */
const chapterNumberSlot =
  'inline-block w-[length:var(--spacing-lg)] shrink-0 text-left tabular-nums';

/**
 * Name field wraps to a 2nd line instead of overflowing the row; anything
 * past that is clipped rather than growing the row indefinitely.
 */
const inputHug = [
  'field-sizing-content w-auto min-w-0',
  'max-h-[calc(var(--text-paragraph-regular-regular-line-height)*2)] overflow-hidden',
  paragraphRegular,
].join(' ');

/** Textarea-in-InputGroup reset — mirrors input-group's own CONTROL_BARE. */
const textareaBareInGroup = [
  'min-h-0 rounded-none border-0 bg-transparent px-0 py-0 shadow-none',
  'hover:bg-transparent focus:bg-transparent focus-visible:bg-transparent',
  'focus-visible:border-transparent focus-visible:shadow-none',
].join(' ');

function stopNameKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
  event.stopPropagation();
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'a') {
    event.preventDefault();
    event.currentTarget.select();
    return;
  }
  /* Title text wraps automatically — Enter commits instead of inserting a line break. */
  if (event.key === 'Enter') {
    event.preventDefault();
    event.currentTarget.blur();
  }
}

function ChapterMenuListItem({
  type = 'chapter',
  label = 'The Eldergrove',
  chapterNumber = 1,
  sceneNumber = 1,
  untitled = false,
  expanded = false,
  showChevron,
  showActions = true,
  drag = false,
  forceHover = false,
  href,
  placeholder = DEFAULT_PLACEHOLDER,
  className,
  children,
  onLabelChange,
  onExpandToggle,
  onDeleteChapter,
  onArchiveChapter,
  onRenameChapter,
}: ChapterMenuListItemProps) {
  const isChapter = type === 'chapter';
  const isScene = type === 'scene';
  const isSubscene = type === 'subscene';
  const hasScenes = React.Children.count(children) > 0;
  /** Chevron dropdown — only when the chapter has scenes to open. */
  const showExpandControl = isChapter && hasScenes && showChevron !== false;
  const isExpandControlled = onExpandToggle != null;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(expanded);
  const open = isExpandControlled ? expanded : uncontrolledOpen;
  const isExpanded = isChapter && open && hasScenes;
  const hasChapterBranch = isExpanded;
  const hasSceneBranch = isScene && children != null;

  React.useEffect(() => {
    if (!isExpandControlled) {
      setUncontrolledOpen(expanded);
    }
  }, [expanded, isExpandControlled]);

  function handleExpandToggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (isExpandControlled) {
      onExpandToggle();
      return;
    }
    setUncontrolledOpen((current) => !current);
  }

  const initialName = untitled || label.trim() === '' ? '' : label;
  const [name, setName] = React.useState(initialName);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [nameMinWidth, setNameMinWidth] = React.useState<number>();
  /** Keeps the actions trigger visible (no opacity fade) while its menu is open. */
  const [actionsOpen, setActionsOpen] = React.useState(false);

  React.useEffect(() => {
    setName(untitled || label.trim() === '' ? '' : label);
  }, [label, untitled]);

  React.useLayoutEffect(() => {
    let cancelled = false;

    function measure(el: HTMLTextAreaElement) {
      if (cancelled || !el.isConnected) return;
      const probe = el.cloneNode(false) as HTMLTextAreaElement;
      probe.value = '';
      probe.placeholder = placeholder;
      probe.tabIndex = -1;
      probe.setAttribute('aria-hidden', 'true');
      probe.style.minWidth = '0';
      probe.style.width = 'auto';
      probe.style.position = 'absolute';
      probe.style.visibility = 'hidden';
      probe.style.pointerEvents = 'none';
      el.after(probe);
      const width = probe.getBoundingClientRect().width;
      probe.remove();
      if (width > 0) setNameMinWidth(width);
    }

    const node = inputRef.current;
    if (node) measure(node);
    void document.fonts.ready.then(() => {
      const el = inputRef.current;
      if (el) measure(el);
    });
    return () => {
      cancelled = true;
    };
  }, [placeholder, type]);

  const markerRestColor =
    'text-[color:var(--theme-alpha-black-switch-30)]';
  const mutedRestColor = 'text-[color:var(--muted-foreground)]';
  const subsceneMarkerRestColor =
    'text-[color:var(--theme-alpha-black-switch-40)]';

  const valueColor = isSubscene
    ? 'text-[color:var(--theme-alpha-black-switch-40)]'
    : 'text-[color:var(--text)]';
  const placeholderColor = isChapter
    ? 'placeholder:text-[color:var(--muted-foreground)]'
    : 'placeholder:text-[color:var(--theme-alpha-black-switch-40)]';

  function commitName(next: string) {
    setName(next);
    onLabelChange?.(next);
  }

  function handleNameBlur() {
    const trimmed = name.trim();
    if (trimmed !== name) {
      commitName(trimmed);
    }
  }

  /**
   * Rename trigger — double-click (see file header). Only needed for
   * double-clicking the Prepend addon (the textarea's own double-click
   * already focused it natively via the 2nd, un-prevented mousedown);
   * `onFocus` below selects the text regardless of how focus arrived.
   */
  function focusForRename() {
    inputRef.current?.focus();
  }

  /**
   * Single click/pointerdown is reserved for drag — block the browser's
   * default focus-on-mousedown so a plain click never starts editing. The
   * 2nd mousedown of a dblclick sequence has `detail === 2`; let that one
   * through so the field still ends up focused when `onDoubleClick` fires.
   */
  function handleNameMouseDown(event: React.MouseEvent) {
    if (event.detail < 2) {
      event.preventDefault();
    }
  }

  /** Selects on any focus arrival — double-click, Tab, or the actions menu's Rename. */
  function handleNameFocus(event: React.FocusEvent<HTMLTextAreaElement>) {
    event.currentTarget.select();
  }

  /**
   * The actions menu's Rename item can't just call `.focus()` inline — Base
   * UI's Menu returns focus to its trigger by default when the popup
   * closes, which would steal it back a tick later. `finalFocus` on
   * DropdownMenuContent is Base UI's own hook for redirecting that default;
   * this flag tells it to send focus to the name field instead, once.
   */
  const pendingRenameFocusRef = React.useRef(false);

  const nameInputClassName = cn(
    textareaBareInGroup,
    inputHug,
    valueColor,
    placeholderColor,
    hoverInk,
  );
  const nameInputStyle =
    nameMinWidth != null ? { minWidth: nameMinWidth } : undefined;

  /**
   * Input Group's `roundness=default` bumps to `--rounded-lg` whenever the
   * control is a `<textarea>` (its multi-line-composer case) — too round for
   * this compact mini field. Force back to the mini `--rounded-md`.
   */
  const groupRoundnessFix = 'has-[textarea]:rounded-[length:var(--rounded-md)]';

  /**
   * Hover is ink-only now (see file header) — no bounding box / chrome.
   * Input Group's own `variant="quiet"` still fills on its native `:hover`
   * and shows a border on focus; kill the hover fill so double-click-to-edit
   * is the only thing that reveals field chrome (focus-within is untouched).
   */
  const noHoverFill = 'hover:bg-transparent';

  const sectionLinkLabel = isChapter
    ? `Go to chapter ${chapterNumber}${name ? `: ${name}` : ''}`
    : isScene
      ? `Go to scene ${sceneNumber}${name ? `: ${name}` : ''}`
      : `Go to sub-scene${name ? `: ${name}` : ''}`;

  const row = (
    <div
      data-slot="chapter-menu-list-item"
      data-type={type}
      data-expanded={isChapter ? isExpanded || undefined : undefined}
      data-untitled={untitled || undefined}
      className={cn(
        'group/chapter-menu-item relative flex min-h-[length:var(--spacing-xl)] w-full min-w-0 items-center',
        /* Chapter: no pl — chevron is absolute at -lg+2xs (4px closer to title).
         * Parent outline list supplies pl-xs so “Ch.” sits body xl + list xs. */
        isChapter && 'justify-between',
        isScene && 'gap-[length:var(--spacing-xs)] pl-[length:var(--spacing-md)]',
        isSubscene &&
          'gap-[length:var(--spacing-3-5)] pl-[calc(var(--spacing-lg)+var(--spacing-3-5))]',
        className,
      )}
      data-force-hover={forceHover || undefined}
      data-drag={drag || undefined}
    >
      {href != null ? (
        <a
          href={href}
          aria-label={sectionLinkLabel}
          data-slot="chapter-menu-section-link"
          className="absolute inset-0 z-0"
        />
      ) : null}
      {isChapter ? (
        <>
          {showExpandControl ? (
            <button
              type="button"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse scenes' : 'Expand scenes'}
              data-slot="chapter-menu-chevron"
              className={cn(
                'absolute top-1/2 left-[calc(-1*var(--spacing-lg)+var(--spacing-2xs))] z-10 flex size-[length:var(--icon-xs)] -translate-y-1/2 items-center justify-center',
                'outline-none [&_svg]:size-[length:var(--icon-xs)]',
                mutedRestColor,
                hoverInk,
              )}
              onClick={handleExpandToggle}
            >
              {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
          ) : null}
          <div data-slot="chapter-menu-name" className="contents">
            <InputGroup
              variant="quiet"
              size="mini"
              onDoubleClick={focusForRename}
              className={cn(
                'relative z-10 w-fit max-w-full min-w-0 overflow-visible',
                'min-h-[length:var(--spacing-xl)] gap-[length:var(--spacing-xs)]',
                groupRoundnessFix,
                noHoverFill,
              )}
            >
              <Textarea
                ref={inputRef}
                data-slot="input-group-control"
                aria-label="Chapter name"
                variant="quiet"
                textStyle="body"
                resizable={false}
                rows={1}
                placeholder={placeholder}
                value={name}
                onChange={(event) => commitName(event.currentTarget.value)}
                onMouseDown={handleNameMouseDown}
                onKeyDown={stopNameKeyDown}
                onFocus={handleNameFocus}
                onBlur={handleNameBlur}
                style={nameInputStyle}
                className={nameInputClassName}
              />
              {/*
                self-start — prepend anchors top-left instead of centering
                against a wrapped 2-line title. Input Group Addon defaults
                to `cursor-text` + click-to-focus-the-field (built for the
                old single-click-to-edit model); override both — under
                double-click-to-rename, a single click here should be a
                no-op like the rest of the row, not a text-cursor invite
                that jumps straight into editing.
              */}
              <InputGroupAddon
                className="self-start cursor-default"
                onClick={(event) => event.stopPropagation()}
              >
                <InputGroupText
                  className={cn(
                    paragraphRegular,
                    mutedRestColor,
                    hoverInk,
                    /* Tight, space-like gap — the default Input Group Text
                       gap (--spacing-xs, 8px) reads too open between "Ch."
                       and a right-aligned number slot. */
                    'gap-[length:var(--spacing-2xs)]',
                  )}
                >
                  <span>Ch.</span>
                  <span className={chapterNumberSlot}>{chapterNumber}</span>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </>
      ) : null}

      {isScene ? (
        <>
          <div
            data-slot="chapter-menu-scene-marker"
            className="relative z-10 flex shrink-0 items-center gap-[length:var(--spacing-xs)] pointer-events-none"
          >
            <CircleIcon
              aria-hidden
              className={cn(
                'size-[length:var(--icon-2xs)]',
                markerRestColor,
                hoverInk,
              )}
            />
            <span
              className={cn(
                paragraphRegular,
                'w-[calc(var(--spacing-md)+var(--spacing-3xs))] shrink-0 text-center',
                markerRestColor,
                hoverInk,
              )}
            >
              {sceneNumber}
            </span>
          </div>
          <div data-slot="chapter-menu-name" className="contents">
            <InputGroup
              variant="quiet"
              size="mini"
              onDoubleClick={focusForRename}
              className={cn(
                'relative z-10 w-fit max-w-full min-w-0 overflow-visible',
                'min-h-[length:var(--spacing-xl)]',
                groupRoundnessFix,
                noHoverFill,
              )}
            >
              <Textarea
                ref={inputRef}
                data-slot="input-group-control"
                aria-label="Scene name"
                variant="quiet"
                textStyle="body"
                resizable={false}
                rows={1}
                placeholder={placeholder}
                value={name}
                onChange={(event) => commitName(event.currentTarget.value)}
                onMouseDown={handleNameMouseDown}
                onKeyDown={stopNameKeyDown}
                onFocus={handleNameFocus}
                onBlur={handleNameBlur}
                style={nameInputStyle}
                className={nameInputClassName}
              />
            </InputGroup>
          </div>
        </>
      ) : null}

      {isSubscene ? (
        <>
          <DotIcon
            aria-hidden
            className={cn(
              'relative z-10 size-[length:var(--icon-2xs)] shrink-0 pointer-events-none',
              subsceneMarkerRestColor,
              hoverInk,
            )}
          />
          <div data-slot="chapter-menu-name" className="contents">
            <InputGroup
              variant="quiet"
              size="mini"
              onDoubleClick={focusForRename}
              className={cn(
                'relative z-10 w-fit max-w-full min-w-0 overflow-visible',
                'min-h-[length:var(--spacing-xl)]',
                groupRoundnessFix,
                noHoverFill,
              )}
            >
              <Textarea
                ref={inputRef}
                data-slot="input-group-control"
                aria-label="Sub-scene name"
                variant="quiet"
                textStyle="body"
                resizable={false}
                rows={1}
                placeholder={placeholder}
                value={name}
                onChange={(event) => commitName(event.currentTarget.value)}
                onMouseDown={handleNameMouseDown}
                onKeyDown={stopNameKeyDown}
                onFocus={handleNameFocus}
                onBlur={handleNameBlur}
                style={nameInputStyle}
                className={nameInputClassName}
              />
            </InputGroup>
          </div>
        </>
      ) : null}

      {isChapter && showActions ? (
        <DropdownMenu open={actionsOpen} onOpenChange={setActionsOpen}>
          <DropdownMenuTrigger
            render={
              <IconButton
                type="button"
                variant="ghost"
                size="mini"
                aria-label="Chapter actions"
                data-slot="chapter-menu-actions"
                className={cn(
                  /* ms-2xs — clears the name field so their hover/pressed
                     chrome never overlaps it. */
                  'relative z-10 ms-[length:var(--spacing-2xs)] shrink-0',
                  !actionsOpen && 'opacity-0',
                  'group-hover/chapter-menu-item:opacity-100',
                  'group-data-[force-hover=true]/chapter-menu-item:opacity-100',
                  'group-data-[drag=true]/chapter-menu-item:opacity-100',
                  'focus-visible:opacity-100',
                )}
              />
            }
          >
            <EllipsisVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="bottom"
            className="w-auto min-w-48"
            finalFocus={() => {
              if (!pendingRenameFocusRef.current) return undefined;
              pendingRenameFocusRef.current = false;
              return inputRef.current ?? undefined;
            }}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDeleteChapter?.()}
              >
                <Trash2Icon />
                Delete chapter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchiveChapter?.()}>
                <ArchiveIcon />
                Archive chapter
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  onRenameChapter?.();
                  pendingRenameFocusRef.current = true;
                }}
              >
                <PencilIcon />
                Rename
                <DropdownMenuShortcut>Double-click</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );

  if (hasChapterBranch) {
    return (
      <div
        data-slot="chapter-menu-branch"
        className="flex w-full flex-col gap-[length:var(--spacing-1-5)]"
      >
        {row}
        <div
          data-slot="chapter-menu-scenes"
          className="flex items-start gap-[length:var(--spacing-2xs)] pl-[length:var(--spacing-lg)]"
        >
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse scenes' : 'Expand scenes'}
            data-slot="chapter-menu-branch-rail"
            className="group/branch-rail flex w-[length:var(--spacing-3xs)] shrink-0 cursor-pointer justify-center self-stretch pb-[length:var(--spacing-sm)] outline-none"
            onClick={handleExpandToggle}
          >
            <Separator
              orientation="vertical"
              size="thin"
              spacing="none"
              className={cn(
                'transition-[background-color] duration-fast ease-emphasized',
                'group-hover/branch-rail:bg-[color:var(--theme-alpha-black-switch-15)]',
              )}
            />
          </button>
          <div className="flex min-w-0 flex-1 flex-col gap-[length:var(--spacing-2xs)]">
            {children}
          </div>
        </div>
      </div>
    );
  }

  if (hasSceneBranch) {
    return (
      <div
        data-slot="chapter-menu-scene-branch"
        className="flex w-full flex-col gap-[length:var(--spacing-1-5)]"
      >
        {row}
        <div
          data-slot="chapter-menu-subscenes"
          className="flex flex-col gap-[length:var(--spacing-2xs)] pl-[length:var(--spacing-xl)]"
        >
          {children}
        </div>
      </div>
    );
  }

  return row;
}

export { ChapterMenuListItem };
