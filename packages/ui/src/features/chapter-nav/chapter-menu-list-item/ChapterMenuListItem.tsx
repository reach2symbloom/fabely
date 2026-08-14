/**
 * Chapter Menu List Item — outline row for chapters, scenes, and sub-scenes.
 *
 * Figma set: Chapter menu list item (`16371:635`). Leaf types are Chapter /
 * Scene / Sub-scene; Expanded composites are the same leaf plus nested
 * children under a vertical rail.
 *
 * Names are Input (Quiet Mini). Chapter rows use Input Group with Prepend
 * text (`Ch. N` — no colon; Figma list item). Scene / sub-scene are bare
 * Input. Quiet shows the field on hover / focus; row hover also reveals
 * the shell.
 *
 * Chapter chevron is a scenes dropdown: it mounts only when the chapter has
 * scene `children`, and toggles the nested tree (Figma Chapter + scenes).
 */

'use client';

import * as React from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CircleIcon,
  DotIcon,
  EllipsisVerticalIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { IconButton } from '@/primitives/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/primitives/input-group';
import { Input } from '@/primitives/input';
import { Separator } from '@/primitives/separator';

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
  onActionsClick?: () => void;
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

const inputHug = [
  'field-sizing-content w-auto min-w-0 flex-none',
  paragraphRegular,
].join(' ');

function stopNameKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
  event.stopPropagation();
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'a') {
    event.preventDefault();
    event.currentTarget.select();
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
  onActionsClick,
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
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [nameMinWidth, setNameMinWidth] = React.useState<number>();

  React.useEffect(() => {
    setName(untitled || label.trim() === '' ? '' : label);
  }, [label, untitled]);

  React.useLayoutEffect(() => {
    let cancelled = false;

    function measure(el: HTMLInputElement) {
      if (cancelled || !el.isConnected) return;
      const probe = el.cloneNode(false) as HTMLInputElement;
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

  const nameInputClassName = cn(
    inputHug,
    valueColor,
    placeholderColor,
    hoverInk,
  );
  const nameInputStyle =
    nameMinWidth != null ? { minWidth: nameMinWidth } : undefined;

  /** Quiet chrome also appears when the row is hovered / force-hovered. */
  const inputShellVisibleOnRowHover = [
    'group-hover/chapter-menu-item:bg-[color:var(--theme-alpha-black-switch-333)]',
    'group-data-[force-hover=true]/chapter-menu-item:bg-[color:var(--theme-alpha-black-switch-333)]',
    'group-data-[drag=true]/chapter-menu-item:bg-[color:var(--theme-alpha-black-switch-333)]',
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
        'group/chapter-menu-item relative flex h-[length:var(--spacing-xl)] w-full min-w-0 items-center',
        isChapter && 'justify-between pl-[length:var(--spacing-lg)]',
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
                'absolute top-1/2 left-0 z-10 flex size-[length:var(--icon-xs)] -translate-y-1/2 items-center justify-center',
                'outline-none [&_svg]:size-[length:var(--icon-xs)]',
                mutedRestColor,
                hoverInk,
              )}
              onClick={handleExpandToggle}
            >
              {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
          ) : null}
          <InputGroup
            variant="quiet"
            size="mini"
            data-slot="chapter-menu-name"
            className={cn(
              'relative z-10 w-fit max-w-full min-w-0 overflow-visible',
              'h-[length:var(--spacing-xl)] min-h-[length:var(--spacing-xl)]',
              inputShellVisibleOnRowHover,
            )}
          >
            <InputGroupInput
              ref={inputRef}
              aria-label="Chapter name"
              placeholder={placeholder}
              value={name}
              onChange={(event) => commitName(event.currentTarget.value)}
              onKeyDown={stopNameKeyDown}
              onBlur={handleNameBlur}
              style={nameInputStyle}
              className={nameInputClassName}
            />
            <InputGroupAddon>
              <InputGroupText
                className={cn(paragraphRegular, mutedRestColor, hoverInk)}
              >
                {`Ch. ${chapterNumber}`}
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
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
          <Input
            ref={inputRef}
            variant="quiet"
            size="mini"
            aria-label="Scene name"
            data-slot="chapter-menu-name"
            placeholder={placeholder}
            value={name}
            onChange={(event) => commitName(event.currentTarget.value)}
            onKeyDown={stopNameKeyDown}
            onBlur={handleNameBlur}
            style={nameInputStyle}
            className={cn(
              nameInputClassName,
              'relative z-10',
              inputShellVisibleOnRowHover,
            )}
          />
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
          <Input
            ref={inputRef}
            variant="quiet"
            size="mini"
            aria-label="Sub-scene name"
            data-slot="chapter-menu-name"
            placeholder={placeholder}
            value={name}
            onChange={(event) => commitName(event.currentTarget.value)}
            onKeyDown={stopNameKeyDown}
            onBlur={handleNameBlur}
            style={nameInputStyle}
            className={cn(
              nameInputClassName,
              'relative z-10',
              inputShellVisibleOnRowHover,
            )}
          />
        </>
      ) : null}

      {isChapter && showActions ? (
        <IconButton
          type="button"
          variant="ghost"
          size="mini"
          aria-label="Chapter actions"
          data-slot="chapter-menu-actions"
          className={cn(
            'relative z-10 shrink-0',
            'opacity-0 group-hover/chapter-menu-item:opacity-100',
            'group-data-[force-hover=true]/chapter-menu-item:opacity-100',
            'group-data-[drag=true]/chapter-menu-item:opacity-100',
            'focus-visible:opacity-100',
          )}
          onClick={onActionsClick}
        >
          <EllipsisVerticalIcon />
        </IconButton>
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
          <div className="flex w-[length:var(--spacing-3xs)] shrink-0 self-stretch pb-[length:var(--spacing-sm)]">
            <Separator
              orientation="vertical"
              size="thin"
              spacing="none"
              className="w-[length:var(--spacing-3xs)]"
            />
          </div>
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
        className="flex w-full flex-col gap-[length:var(--spacing-2xs)]"
      >
        {row}
        <div
          data-slot="chapter-menu-subscenes"
          className="flex flex-col gap-[length:var(--spacing-xs)] pl-[length:var(--spacing-xl)]"
        >
          {children}
        </div>
      </div>
    );
  }

  return row;
}

export { ChapterMenuListItem };
