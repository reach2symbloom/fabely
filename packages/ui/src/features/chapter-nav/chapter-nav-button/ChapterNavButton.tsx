/**
 * Chapter Nav Button — manuscript location chrome.
 *
 * Authoritative Figma variant: Chapter nav button / State=Empty, Hover=False
 * (`16038:15485`). Layers: Input instance (Prepend on) + sibling Fade button.
 *
 * Placement: feature. Chevron opens the Chapter Menu (stubbed). Chapter name
 * is a real Input Group (Figma Prepend text) for inline rename — not a second
 * button nested in a trigger.
 */

'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { IconButton } from '@/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/primitives/dropdown-menu';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/primitives/input-group';

const DEFAULT_PLACEHOLDER = 'Untitled';

export type ChapterNavButtonProps = {
  bookTitle?: string;
  chapterNumber?: number;
  chapterName?: string;
  placeholder?: string;
  className?: string;
  onChapterNameChange?: (name: string) => void;
};

const heading4Type = [
  'font-[family-name:var(--text-heading-4-font-family)]',
  '[font-weight:var(--text-heading-4-font-weight)]',
  'text-[length:var(--text-heading-4-font-size)]',
  'leading-[var(--text-heading-4-line-height)]',
  'tracking-[var(--text-heading-4-letter-spacing)]',
].join(' ');

function ChapterNavButton({
  bookTitle = 'Untitled book',
  chapterNumber = 1,
  chapterName = '',
  placeholder = DEFAULT_PLACEHOLDER,
  className,
  onChapterNameChange,
}: ChapterNavButtonProps) {
  const [name, setName] = React.useState(chapterName);
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [nameMinWidth, setNameMinWidth] = React.useState<number>();

  React.useEffect(() => {
    setName(chapterName);
  }, [chapterName]);

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
  }, [placeholder]);

  const isEmpty = name.trim() === '';
  const chapterContrast = isEmpty
    ? 'text-[color:var(--theme-alpha-black-switch-25)]'
    : 'text-[color:var(--theme-alpha-black-switch-50)]';

  function commitName(next: string) {
    setName(next);
    onChapterNameChange?.(next);
  }

  function handleShellClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (
      target.closest(
        '[data-slot=input-group], [data-slot=icon-button], input',
      )
    ) {
      return;
    }
    setOpen(true);
  }

  function handleNameKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    // Keep key events off chapter-nav chrome / menu typeahead.
    event.stopPropagation();
  }

  function handleNameBlur() {
    const trimmed = name.trim();
    if (trimmed !== name) {
      commitName(trimmed);
    }
  }

  return (
    <div
      data-slot="chapter-nav"
      className={cn(
        'group/chapter-nav inline-flex w-fit max-w-full min-w-0 flex-col',
        'rounded-[length:var(--rounded-lg)]',
        'p-[var(--spacing-2xs)]',
        'gap-[var(--spacing-3xs)]',
        'bg-transparent',
        'transition-[background-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
        'hover:bg-[color:var(--theme-alpha-black-switch-333)]',
        'data-open:bg-[color:var(--theme-alpha-black-switch-333)]',
        className,
      )}
      data-open={open ? '' : undefined}
      onClick={handleShellClick}
    >
      <span
        data-slot="chapter-nav-title"
        className={cn(
          'ps-[var(--spacing-1-5)]',
          'font-[family-name:var(--text-paragraph-regular-regular-font-family)]',
          '[font-weight:var(--text-paragraph-regular-regular-font-weight)]',
          'text-[length:var(--text-paragraph-regular-regular-font-size)]',
          'leading-[var(--text-paragraph-regular-regular-line-height)]',
          'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
          'text-[color:var(--theme-neutrals-400)]',
          'truncate',
        )}
      >
        {bookTitle}
      </span>
      <div
        data-slot="chapter-nav-row"
        className="inline-flex min-w-0 max-w-full items-center gap-[var(--spacing-3xs)]"
      >
        <InputGroup
          variant="quiet"
          size="mini"
          className={cn(
            'w-fit max-w-full min-w-0 overflow-visible',
            /* Figma Mini instance is 32px; Input mini slot is 24px. */
            'h-[length:var(--spacing-2xl)] min-h-[length:var(--spacing-2xl)]',
          )}
        >
          <InputGroupInput
            ref={inputRef}
            aria-label="Chapter name"
            placeholder={placeholder}
            value={name}
            onChange={(event) => commitName(event.currentTarget.value)}
            onKeyDown={handleNameKeyDown}
            onBlur={handleNameBlur}
            style={nameMinWidth != null ? { minWidth: nameMinWidth } : undefined}
            className={cn(
              heading4Type,
              'field-sizing-content w-auto flex-none',
              'text-[color:var(--theme-alpha-black-switch-50)]',
              'placeholder:text-[color:var(--theme-alpha-black-switch-25)]',
            )}
          />
          <InputGroupAddon>
            <InputGroupText className={cn(heading4Type, chapterContrast)}>
              {`Ch. ${chapterNumber}:`}
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger
            render={
              <IconButton
                variant="fadeGold"
                size="sm"
                aria-label="Open chapter menu"
                className={cn(
                  'shrink-0 size-[length:var(--icon-sm)] p-0',
                  'group-hover/chapter-nav:[&_svg]:opacity-100',
                  'group-hover/chapter-nav:text-[color:var(--primary)]',
                  'group-data-open/chapter-nav:[&_svg]:opacity-100',
                  'group-data-open/chapter-nav:text-[color:var(--primary)]',
                )}
              />
            }
          >
            <ChevronDownIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <p
              className={cn(
                'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
                'text-[length:var(--text-paragraph-small-regular-font-size)]',
                'leading-[var(--text-paragraph-small-regular-line-height)]',
                'text-muted-foreground',
              )}
            >
              Chapter menu
            </p>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export { ChapterNavButton };
