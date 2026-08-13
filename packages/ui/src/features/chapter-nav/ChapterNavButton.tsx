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

  React.useEffect(() => {
    setName(chapterName);
  }, [chapterName]);

  const isEmpty = name.trim() === '';
  const chapterContrast = isEmpty
    ? 'text-[color:var(--theme-alpha-black-switch-25)]'
    : 'text-[color:var(--theme-alpha-black-switch-100)]';

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
    event.stopPropagation();
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      event.currentTarget.select();
    }
  }

  function handleNameBlur() {
    const trimmed = name.trim();
    if (trimmed !== name) {
      commitName(trimmed);
    }
  }

  return (
    <div
      className={cn(
        'group/chapter-nav inline-flex w-full min-w-0 items-center',
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
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-[var(--spacing-3xs)]">
        <span
          className={cn(
            'ps-[var(--spacing-1-5)]',
            'font-[family-name:var(--text-paragraph-regular-regular-font-family)]',
            '[font-weight:var(--text-paragraph-regular-regular-font-weight)]',
            'text-[length:var(--text-paragraph-regular-regular-font-size)]',
            'leading-[var(--text-paragraph-regular-regular-line-height)]',
            'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
            'text-muted-foreground',
            'truncate',
          )}
        >
          {bookTitle}
        </span>
        <InputGroup
          variant="ghost"
          size="mini"
          className={cn(
            'w-full min-w-0 pe-0',
            /* Figma Mini instance is 32px; Input mini slot is 24px. */
            'h-[length:var(--spacing-2xl)] min-h-[length:var(--spacing-2xl)]',
          )}
        >
          <InputGroupInput
            aria-label="Chapter name"
            placeholder={placeholder}
            value={name}
            onChange={(event) => commitName(event.currentTarget.value)}
            onKeyDown={handleNameKeyDown}
            onBlur={handleNameBlur}
            className={cn(
              heading4Type,
              'text-[color:var(--theme-alpha-black-switch-100)]',
              'placeholder:text-[color:var(--theme-alpha-black-switch-25)]',
              'min-w-0',
            )}
          />
          <InputGroupAddon>
            <InputGroupText className={cn(heading4Type, chapterContrast)}>
              {`Ch. ${chapterNumber}:`}
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="inline-flex shrink-0">
        <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          render={
            <IconButton
              variant="fade"
              size="sm"
              aria-label="Open chapter menu"
              className={cn(
                'shrink-0 size-[length:var(--icon-sm)] p-0',
                'group-hover/chapter-nav:[&_svg]:opacity-100',
                'group-data-open/chapter-nav:[&_svg]:opacity-100',
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
