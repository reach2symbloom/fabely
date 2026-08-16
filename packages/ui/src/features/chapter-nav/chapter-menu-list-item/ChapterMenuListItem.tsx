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
 * Title controls preserve native text behavior: a single click places the
 * caret, while double-click and the actions menu's Rename command select the
 * full title. A six-dot grip appears in the chapter's left control slot, and
 * non-text row areas remain available as drag surfaces.
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
  CircleIcon,
  DotIcon,
  EllipsisVerticalIcon,
  GripVerticalIcon,
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
import type { ChapterNavMutationContext } from '../integration';

export type ChapterMenuListItemType = 'chapter' | 'scene' | 'subscene';

export type ChapterMenuListItemProps = {
  manuscriptId?: string;
  itemId?: string;
  parentId?: string;
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
  /** Real nested rows, excluding a DnD-only placeholder child. */
  hasNestedItems?: boolean;
  /** Trailing ellipsis (Figma Show dot menu). Visible on hover / forceHover. */
  showActions?: boolean;
  /** Figma Drag axis — paints the same secondary ink as hover. */
  drag?: boolean;
  /**
   * Some other row in this outline is currently being dragged. Suppresses
   * this row's own hover-to-reveal grip — mid-drag, the pointer is already
   * committed elsewhere, so no row should be inviting a second drag start.
   */
  dragActive?: boolean;
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
  onLabelChange?: (label: string, context: ChapterNavMutationContext) => void;
  /** Fires after trimming on blur/Enter; use this for persistence. */
  onLabelCommit?: (label: string, context: ChapterNavMutationContext) => void;
  /** Actions menu — Delete this chapter, scene, or sub-scene. */
  onDelete?: (context: ChapterNavMutationContext) => void;
  /** Actions menu — Archive this item when supported. */
  onArchive?: (context: ChapterNavMutationContext) => void;
  /** Actions menu — Rename (also focuses the inline name field). */
  onRename?: (context: ChapterNavMutationContext) => void;
  /** Fires when the chapter scenes chevron is toggled. */
  onExpandToggle?: (context: ChapterNavMutationContext & { expanded: boolean }) => void;
  /** Chapter actions menu — Delete. */
  onDeleteChapter?: (context: ChapterNavMutationContext) => void;
  /** Chapter actions menu — Archive. */
  onArchiveChapter?: (context: ChapterNavMutationContext) => void;
  /** Chapter actions menu — Rename (also fires from double-click, its primary trigger). */
  onRenameChapter?: (context: ChapterNavMutationContext) => void;
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
  'group-data-[force-hover=true]/chapter-menu-item:!text-[color:var(--tw-raw-secondary-200)] group-data-[drag=true]/chapter-menu-item:!text-[color:var(--tw-raw-secondary-200)] group-hover/chapter-menu-item:!text-[color:var(--tw-raw-secondary-200)]';

/**
 * Forces the grip icon fully hidden regardless of hover/force-hover state —
 * applied when some other row in the outline is mid-drag (`dragActive`), so
 * no row invites starting a second drag while one is already in flight.
 */
const dragSuppressedGrip = '!scale-75 !opacity-0 !pointer-events-none';

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

/**
 * Hover chrome belongs to the editable title only—not its number/marker or
 * row whitespace. Inset border avoids changing field measurements while the
 * alpha-333 face echoes the canonical subtle bordered input treatment.
 */
const titleHoverChrome = [
  'box-content cursor-text',
  'transition-[margin,padding,background-color,box-shadow,border-radius] duration-fast ease-emphasized',
  'motion-reduce:transition-none',
  'hover:-ml-[var(--spacing-2xs)] hover:px-[var(--spacing-2xs)]',
  'hover:!rounded-[length:var(--rounded-md)]',
  'hover:!bg-[color:var(--theme-alpha-black-switch-333)]',
  'hover:!shadow-[inset_0_0_0_var(--stroke-thin)_var(--theme-alpha-black-switch-333)]',
  'focus:-ml-[var(--spacing-2xs)] focus:px-[var(--spacing-2xs)]',
  'focus:!w-full focus:!flex-1',
  'focus:!rounded-[length:var(--rounded-md)]',
  'focus:!bg-[color:var(--theme-alpha-black-switch-333)]',
  'focus:!shadow-[inset_0_0_0_var(--stroke-thin)_var(--border)]',
].join(' ');

/** Gentle top-to-bottom reveal for chapter and scene descendants. */
const branchCascade = [
  '[&>*]:transition-[opacity,translate] [&>*]:duration-[240ms] [&>*]:ease-out',
  '[&>*:nth-child(2)]:[transition-delay:24ms]',
  '[&>*:nth-child(3)]:[transition-delay:48ms]',
  '[&>*:nth-child(4)]:[transition-delay:72ms]',
  '[&>*:nth-child(5)]:[transition-delay:96ms]',
  '[&>*:nth-child(6)]:[transition-delay:120ms]',
  '[&>*:nth-child(7)]:[transition-delay:144ms]',
  '[&>*:nth-child(n+8)]:[transition-delay:168ms]',
  'motion-reduce:[&>*]:transition-none motion-reduce:[&>*]:[transition-delay:0ms]',
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
  manuscriptId,
  itemId,
  parentId,
  type = 'chapter',
  label = 'The Eldergrove',
  chapterNumber = 1,
  sceneNumber = 1,
  untitled = false,
  expanded = false,
  showChevron,
  hasNestedItems,
  showActions = true,
  drag = false,
  dragActive = false,
  forceHover = false,
  href,
  placeholder,
  className,
  children,
  onLabelChange,
  onLabelCommit,
  onDelete,
  onArchive,
  onRename,
  onExpandToggle,
  onDeleteChapter,
  onArchiveChapter,
  onRenameChapter,
}: ChapterMenuListItemProps) {
  const isChapter = type === 'chapter';
  const isScene = type === 'scene';
  const isSubscene = type === 'subscene';
  const resolvedPlaceholder =
    placeholder ??
    (isScene
      ? 'Untitled scene'
      : isSubscene
        ? 'Untitled subscene'
        : DEFAULT_PLACEHOLDER);
  const itemLabel = isChapter ? 'chapter' : isScene ? 'scene' : 'sub-scene';
  const deleteItem = onDelete ?? onDeleteChapter;
  const archiveItem = onArchive ?? onArchiveChapter;
  const renameItem = onRename ?? onRenameChapter;
  const hasScenes = React.Children.count(children) > 0;
  const hasVisibleNestedItems =
    hasNestedItems ?? React.Children.count(children) > 0;
  /** Chevron dropdown — only when the chapter has scenes to open. */
  const showExpandControl = isChapter && hasScenes && showChevron !== false;
  const isExpandControlled = onExpandToggle != null;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(expanded);
  const open = isExpandControlled ? expanded : uncontrolledOpen;
  const isExpanded = isChapter && open && hasScenes;
  const hasChapterBranch = isChapter && hasScenes;
  const hasSceneBranch = isScene && children != null;
  const itemContext: ChapterNavMutationContext = {
    manuscriptId,
    entityId: itemId,
    parentId,
    kind: type,
  };

  React.useEffect(() => {
    if (!isExpandControlled) {
      setUncontrolledOpen(expanded);
    }
  }, [expanded, isExpandControlled]);

  function handleExpandToggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (isExpandControlled) {
      onExpandToggle({ ...itemContext, expanded: !isExpanded });
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
      probe.placeholder = resolvedPlaceholder;
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
  }, [resolvedPlaceholder, type]);

  const markerRestColor =
    'text-[color:var(--theme-alpha-black-switch-30)]';
  const mutedRestColor =
    'text-[color-mix(in_srgb,var(--theme-alpha-black-switch-60)_75%,var(--theme-neutrals-600))] dark:text-[color-mix(in_srgb,var(--theme-alpha-black-switch-60)_75%,var(--theme-neutrals-400))]';
  const subsceneMarkerRestColor =
    'text-[color:var(--theme-alpha-black-switch-40)]';

  const valueColor = isSubscene
    ? 'text-[color:var(--theme-alpha-black-switch-40)]'
    : 'text-[color:var(--text)]';
  const focusValueColor = isSubscene
    ? 'focus:!text-[color:var(--theme-alpha-black-switch-40)]'
    : 'focus:!text-[color:var(--text)]';
  const directHoverValueColor = isSubscene
    ? 'hover:!text-[color:var(--theme-alpha-black-switch-40)]'
    : 'hover:!text-[color:var(--text)]';
  const placeholderColor =
    'placeholder:text-[color:var(--theme-alpha-black-switch-40)]';

  function commitName(next: string) {
    setName(next);
    onLabelChange?.(next, itemContext);
  }

  function handleNameBlur() {
    const trimmed = name.trim();
    if (trimmed !== name) {
      commitName(trimmed);
    }
    onLabelCommit?.(trimmed, itemContext);
  }

  /** Explicit rename shortcut; ordinary clicks retain native caret placement. */
  function focusForRename() {
    inputRef.current?.focus();
    inputRef.current?.select();
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
    directHoverValueColor,
    titleHoverChrome,
    focusValueColor,
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
   * This compound row is not itself an input surface. Keep the InputGroup as
   * layout/accessibility structure, but suppress its shared hover/focus shell;
   * the editable title control owns the only local hover treatment.
   */
  const noGroupChrome = [
    'hover:!bg-transparent',
    'focus-within:!border-transparent focus-within:!bg-transparent',
    'focus-within:!shadow-none',
  ].join(' ');

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
        'group/chapter-menu-item relative flex min-h-[length:var(--spacing-xl)] w-full min-w-0 cursor-grab items-center active:cursor-grabbing',
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
          className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
        />
      ) : null}
      {isChapter ? (
        <>
          {!showExpandControl ? (
            <span
              aria-hidden
              data-slot="chapter-menu-drag-indicator"
              className={cn(
                'absolute top-[calc(var(--spacing-xl)/2)] left-[calc(-1*var(--spacing-lg))] z-10 flex size-[length:var(--icon-md)] -translate-y-1/2 cursor-grab touch-none items-center justify-center rounded-[length:var(--rounded-sm)] active:cursor-grabbing',
                '[&_svg]:size-[length:var(--icon-sm)]',
                'scale-75 text-[color:var(--muted-foreground)] opacity-0',
                'transition-[opacity,transform,background-color] duration-fast ease-emphasized',
                'hover:scale-125 hover:bg-[color:var(--theme-alpha-black-switch-333)]',
                'active:bg-[color:var(--theme-alpha-black-switch-5)]',
                'group-hover/chapter-menu-item:scale-100 group-hover/chapter-menu-item:opacity-100',
                'group-data-[force-hover=true]/chapter-menu-item:scale-100 group-data-[force-hover=true]/chapter-menu-item:opacity-100',
                'group-data-[drag=true]/chapter-menu-item:scale-100 group-data-[drag=true]/chapter-menu-item:opacity-100',
                'group-has-[[data-slot=input-group-control]:hover]/chapter-menu-item:scale-75 group-has-[[data-slot=input-group-control]:hover]/chapter-menu-item:opacity-0',
                'group-has-[[data-slot=input-group-control]:focus]/chapter-menu-item:scale-75 group-has-[[data-slot=input-group-control]:focus]/chapter-menu-item:opacity-0',
                dragActive && dragSuppressedGrip,
              )}
            >
              <GripVerticalIcon className="translate-y-px" />
            </span>
          ) : null}
          {showExpandControl ? (
            <button
              type="button"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse scenes' : 'Expand scenes'}
              data-slot="chapter-menu-chevron"
              className={cn(
                'group/chevron absolute top-[calc(var(--spacing-xl)/2)] left-[calc(-1*var(--spacing-lg)+var(--spacing-2xs))] z-10 flex size-[length:var(--icon-xs)] -translate-y-1/2 items-center justify-center',
                'cursor-pointer outline-none [&_svg]:size-[length:var(--icon-xs)]',
                'transition-[opacity,transform] duration-fast ease-emphasized',
                mutedRestColor,
                hoverInk,
              )}
              onClick={handleExpandToggle}
            >
              <span className="flex transition-transform duration-fast ease-emphasized group-hover/chevron:scale-125 motion-reduce:transition-none">
                <ChevronDownIcon
                  className="transition-[transform] duration-fast ease-emphasized-in motion-reduce:transition-none"
                  style={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </span>
            </button>
          ) : null}
          <div data-slot="chapter-menu-name" className="contents">
            <InputGroup
              variant="quiet"
              size="mini"
              onDoubleClick={focusForRename}
              className={cn(
                'relative z-10 w-fit max-w-full min-w-0 overflow-visible',
                'min-h-[length:var(--spacing-xl)] gap-[length:var(--spacing-sm)]',
                groupRoundnessFix,
                noGroupChrome,
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
                placeholder={resolvedPlaceholder}
                value={name}
                onChange={(event) => commitName(event.currentTarget.value)}
                onKeyDown={stopNameKeyDown}
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
                className="self-start cursor-grab active:cursor-grabbing"
                onClick={(event) => event.stopPropagation()}
              >
                <InputGroupText
                  className={cn(
                    paragraphRegular,
                    mutedRestColor,
                    hoverInk,
                    'group-focus-within/input-group:!text-[color-mix(in_srgb,var(--theme-alpha-black-switch-60)_75%,var(--theme-neutrals-600))]',
                    'dark:group-focus-within/input-group:!text-[color-mix(in_srgb,var(--theme-alpha-black-switch-60)_75%,var(--theme-neutrals-400))]',
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
            <span className="relative flex size-[length:var(--icon-2xs)] shrink-0 items-center justify-center">
              <CircleIcon
                aria-hidden
                data-slot="chapter-menu-marker-icon"
                className={cn(
                  'size-[length:var(--icon-2xs)] transition-[opacity,transform] duration-fast ease-emphasized',
                  'group-hover/chapter-menu-item:scale-75 group-hover/chapter-menu-item:opacity-0',
                  'group-has-[[data-slot=input-group-control]:hover]/chapter-menu-item:scale-100 group-has-[[data-slot=input-group-control]:hover]/chapter-menu-item:opacity-100',
                  'group-has-[[data-slot=input-group-control]:focus]/chapter-menu-item:scale-100 group-has-[[data-slot=input-group-control]:focus]/chapter-menu-item:opacity-100',
                  markerRestColor,
                  hoverInk,
                )}
              />
              <GripVerticalIcon
                aria-hidden
                data-slot="chapter-menu-drag-indicator"
                className={cn(
                  'absolute size-[length:var(--icon-sm)] translate-y-px scale-75 text-[color:var(--muted-foreground)] opacity-0',
                  'transition-[opacity,transform] duration-fast ease-emphasized',
                  'group-hover/chapter-menu-item:scale-100 group-hover/chapter-menu-item:opacity-100',
                  'group-data-[force-hover=true]/chapter-menu-item:scale-100 group-data-[force-hover=true]/chapter-menu-item:opacity-100',
                  'group-data-[drag=true]/chapter-menu-item:scale-100 group-data-[drag=true]/chapter-menu-item:opacity-100',
                  'group-has-[[data-slot=input-group-control]:hover]/chapter-menu-item:scale-75 group-has-[[data-slot=input-group-control]:hover]/chapter-menu-item:opacity-0',
                  'group-has-[[data-slot=input-group-control]:focus]/chapter-menu-item:scale-75 group-has-[[data-slot=input-group-control]:focus]/chapter-menu-item:opacity-0',
                  dragActive && dragSuppressedGrip,
                )}
              />
            </span>
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
                noGroupChrome,
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
                placeholder={resolvedPlaceholder}
                value={name}
                onChange={(event) => commitName(event.currentTarget.value)}
                onKeyDown={stopNameKeyDown}
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
          <span className="relative z-10 flex size-[length:var(--icon-2xs)] shrink-0 items-center justify-center pointer-events-none">
            <DotIcon
              aria-hidden
              data-slot="chapter-menu-marker-icon"
              className={cn(
                'size-[length:var(--icon-2xs)] transition-[opacity,transform] duration-fast ease-emphasized',
                'group-hover/chapter-menu-item:scale-75 group-hover/chapter-menu-item:opacity-0',
                'group-has-[[data-slot=input-group-control]:hover]/chapter-menu-item:scale-100 group-has-[[data-slot=input-group-control]:hover]/chapter-menu-item:opacity-100',
                'group-has-[[data-slot=input-group-control]:focus]/chapter-menu-item:scale-100 group-has-[[data-slot=input-group-control]:focus]/chapter-menu-item:opacity-100',
                subsceneMarkerRestColor,
                hoverInk,
              )}
            />
            <GripVerticalIcon
              aria-hidden
              data-slot="chapter-menu-drag-indicator"
              className={cn(
                'absolute size-[length:var(--icon-sm)] translate-y-px scale-75 text-[color:var(--muted-foreground)] opacity-0',
                'transition-[opacity,transform] duration-fast ease-emphasized',
                'group-hover/chapter-menu-item:scale-100 group-hover/chapter-menu-item:opacity-100',
                'group-data-[force-hover=true]/chapter-menu-item:scale-100 group-data-[force-hover=true]/chapter-menu-item:opacity-100',
                'group-data-[drag=true]/chapter-menu-item:scale-100 group-data-[drag=true]/chapter-menu-item:opacity-100',
                'group-has-[[data-slot=input-group-control]:hover]/chapter-menu-item:scale-75 group-has-[[data-slot=input-group-control]:hover]/chapter-menu-item:opacity-0',
                'group-has-[[data-slot=input-group-control]:focus]/chapter-menu-item:scale-75 group-has-[[data-slot=input-group-control]:focus]/chapter-menu-item:opacity-0',
                dragActive && dragSuppressedGrip,
              )}
            />
          </span>
          <div data-slot="chapter-menu-name" className="contents">
            <InputGroup
              variant="quiet"
              size="mini"
              onDoubleClick={focusForRename}
              className={cn(
                'relative z-10 w-fit max-w-full min-w-0 overflow-visible',
                'min-h-[length:var(--spacing-xl)]',
                groupRoundnessFix,
                noGroupChrome,
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
                placeholder={resolvedPlaceholder}
                value={name}
                onChange={(event) => commitName(event.currentTarget.value)}
                onKeyDown={stopNameKeyDown}
                onBlur={handleNameBlur}
                style={nameInputStyle}
                className={nameInputClassName}
              />
            </InputGroup>
          </div>
        </>
      ) : null}

      {showActions ? (
        <DropdownMenu open={actionsOpen} onOpenChange={setActionsOpen}>
          <DropdownMenuTrigger
            render={
              <IconButton
                type="button"
                variant="ghost"
                size="mini"
                aria-label={`${itemLabel[0].toUpperCase()}${itemLabel.slice(1)} actions`}
                data-slot="chapter-menu-actions"
                className={cn(
                  /* Auto margin pins actions to the full row edge regardless
                     of title length. -me-xs compensates for the icon button's
                     centered internal space at the card boundary. */
                  'relative z-10 ms-auto me-[calc(-1*var(--spacing-xs))] shrink-0 cursor-pointer',
                  !actionsOpen && 'opacity-0',
                  'group-hover/chapter-menu-item:opacity-100',
                  'group-data-[force-hover=true]/chapter-menu-item:opacity-100',
                  'group-data-[drag=true]/chapter-menu-item:opacity-100',
                  'focus-visible:opacity-100',
                )}
              />
            }
          >
            <EllipsisVerticalIcon className="size-[length:var(--icon-sm)]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="bottom"
            className="w-auto min-w-48"
            finalFocus={() => {
              if (!pendingRenameFocusRef.current) return undefined;
              pendingRenameFocusRef.current = false;
              requestAnimationFrame(() => inputRef.current?.select());
              return inputRef.current ?? undefined;
            }}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => deleteItem?.(itemContext)}
              >
                <Trash2Icon />
                Delete {itemLabel}
              </DropdownMenuItem>
              {isChapter || archiveItem != null ? (
                <DropdownMenuItem onClick={() => archiveItem?.(itemContext)}>
                  <ArchiveIcon />
                  Archive {itemLabel}
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                onClick={() => {
                  renameItem?.(itemContext);
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

  if (isChapter) {
    return (
      <div
        data-slot="chapter-menu-branch"
        className={cn(
          'flex w-full flex-col',
          hasChapterBranch && isExpanded && 'gap-[length:var(--spacing-1-5)]',
        )}
      >
        {row}
        {hasChapterBranch ? (
          <div
            aria-hidden={!isExpanded}
            inert={!isExpanded}
            data-slot="chapter-menu-scenes-reveal"
            data-expanded={isExpanded || undefined}
            className={cn(
              'grid transition-[grid-template-rows,opacity] duration-[300ms] ease-emphasized',
              isExpanded
                ? 'grid-rows-[1fr] opacity-100'
                : 'pointer-events-none grid-rows-[0fr] opacity-0',
              'motion-reduce:transition-none',
            )}
          >
            <div
              className={cn(
                'min-h-0',
                isExpanded ? 'overflow-visible' : 'overflow-hidden',
              )}
            >
              <div
                data-slot="chapter-menu-scenes"
                className="flex items-start gap-[length:var(--spacing-2xs)] pl-[length:var(--spacing-lg)]"
              >
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Collapse scenes' : 'Expand scenes'}
                  data-slot="chapter-menu-branch-rail"
                  className="group/branch-rail flex w-[length:var(--spacing-3xs)] shrink-0 origin-top cursor-pointer justify-center self-stretch pb-[length:var(--spacing-sm)] outline-none transition-[scale] duration-[300ms] ease-emphasized motion-reduce:transition-none"
                  style={{ scale: isExpanded ? '1 1' : '1 0' }}
                  onClick={handleExpandToggle}
                >
                  <Separator
                    orientation="vertical"
                    size="thin"
                    spacing="none"
                    className={cn(
                      'w-[length:var(--stroke-regular)]!',
                      'transition-[background-color] duration-fast ease-emphasized',
                      'group-hover/branch-rail:bg-[color:var(--theme-alpha-black-switch-15)]',
                    )}
                  />
                </button>
                <div
                  data-expanded={isExpanded || undefined}
                  className={cn(
                    'flex min-w-0 flex-1 flex-col gap-[length:var(--spacing-3xs)] [--outline-row-gap:var(--spacing-3xs)] [&:has(>[data-slot=add-section-inline-gap])]:gap-0 [&:has(>[data-slot=add-section-inline-gap])]:[--outline-row-gap:0]',
                    'data-[expanded=true]:[&>*]:translate-y-0 data-[expanded=true]:[&>*]:opacity-100 [&>*]:-translate-y-[length:var(--spacing-2xs)] [&>*]:opacity-0',
                    branchCascade,
                  )}
                >
                  {children}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (hasSceneBranch) {
    return (
      <div
        data-slot="chapter-menu-scene-branch"
        className={cn(
          'flex w-full flex-col',
          hasVisibleNestedItems && 'gap-[length:var(--spacing-xs)]',
        )}
      >
        {row}
        <div
          aria-hidden={!hasVisibleNestedItems}
          inert={!hasVisibleNestedItems}
          data-slot="chapter-menu-subscenes-reveal"
          className={cn(
            'grid transition-[grid-template-rows,opacity] duration-[300ms] ease-emphasized',
            hasVisibleNestedItems
              ? 'grid-rows-[1fr] opacity-100'
              : 'pointer-events-none grid-rows-[0fr] opacity-0',
            'motion-reduce:transition-none',
          )}
        >
          <div
            className={cn(
              'min-h-0',
              hasVisibleNestedItems ? 'overflow-visible' : 'overflow-hidden',
            )}
          >
            <div
              data-slot="chapter-menu-subscenes"
              className={cn(
                'flex flex-col gap-[length:var(--spacing-1-5)] pl-[length:var(--spacing-xl)] [--outline-row-gap:var(--spacing-1-5)] [&:has(>[data-slot=add-section-inline-gap])]:gap-0 [&:has(>[data-slot=add-section-inline-gap])]:[--outline-row-gap:0]',
                hasVisibleNestedItems && 'pb-[length:var(--spacing-2xs)]',
                branchCascade,
                hasVisibleNestedItems
                  ? '[&>*]:translate-y-0 [&>*]:opacity-100'
                  : '[&>*]:-translate-y-[length:var(--spacing-2xs)] [&>*]:opacity-0',
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return row;
}

export { ChapterMenuListItem };
