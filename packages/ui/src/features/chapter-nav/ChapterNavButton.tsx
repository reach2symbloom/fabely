/**
 * Chapter Nav Button — manuscript location trigger.
 *
 * Authoritative Figma variant: Chapter nav button / State=Empty, Hover=False
 * (`16038:15485`). Other variants on that set are superseded structural
 * explorations (inline rename in the collapsed trigger) — do not rebuild them.
 *
 * Placement: feature (not a generic atom). Whole control is one trigger;
 * Chapter Menu panel is stubbed. Chevron uses Icon Button `fade` chrome on a
 * non-interactive span so we do not nest buttons.
 */

'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { iconButtonVariants } from '@/primitives/button/icon-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/primitives/dropdown-menu';
import { Input } from '@/primitives/input';

export type ChapterNavButtonProps = {
  bookTitle?: string;
  chapterNumber?: number;
  chapterName?: string;
  /** Placeholder contrast (Untitled) vs named chapter. Rest has no fill either way. */
  empty?: boolean;
  className?: string;
  onChapterNameChange?: (name: string) => void;
};

function chapterLine(chapterNumber: number, chapterName: string) {
  return `Ch. ${chapterNumber}: ${chapterName}`;
}

function ChapterNavButton({
  bookTitle = 'Untitled book',
  chapterNumber = 1,
  chapterName = 'Untitled',
  empty = true,
  className,
  onChapterNameChange,
}: ChapterNavButtonProps) {
  const [name, setName] = React.useState(chapterName);

  React.useEffect(() => {
    setName(chapterName);
  }, [chapterName]);

  const line = chapterLine(chapterNumber, name);
  const label = `${bookTitle}, ${line}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={label}
        className={cn(
          'group/chapter-nav inline-flex items-center',
          'rounded-[length:var(--rounded-lg)]',
          'p-[var(--spacing-2xs)]',
          'gap-[var(--spacing-3xs)]',
          'bg-transparent',
          'text-start outline-none',
          'transition-[background-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
          'hover:bg-[color:var(--theme-alpha-black-switch-333)]',
          'data-open:bg-[color:var(--theme-alpha-black-switch-333)]',
          'data-popup-open:bg-[color:var(--theme-alpha-black-switch-333)]',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          className,
        )}
      >
        <span className="flex min-w-0 flex-col items-start justify-center gap-[var(--spacing-3xs)]">
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
          <span
            className={cn(
              'ps-[var(--spacing-1-5)]',
              'font-[family-name:var(--text-heading-4-font-family)]',
              '[font-weight:var(--text-heading-4-font-weight)]',
              'text-[length:var(--text-heading-4-font-size)]',
              'leading-[var(--text-heading-4-line-height)]',
              'tracking-[var(--text-heading-4-letter-spacing)]',
              empty
                ? 'text-[color:var(--theme-alpha-black-switch-25)]'
                : 'text-[color:var(--theme-alpha-black-switch-100)]',
              'truncate',
            )}
          >
            {line}
          </span>
        </span>
        <span
          aria-hidden
          className={cn(
            iconButtonVariants({ variant: 'fade', size: 'sm' }),
            'pointer-events-none size-[length:var(--icon-sm)] p-0',
            'group-hover/chapter-nav:[&_svg]:opacity-100',
            'group-data-open/chapter-nav:[&_svg]:opacity-100',
            'group-data-popup-open/chapter-nav:[&_svg]:opacity-100',
          )}
        >
          <ChevronDownIcon />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <div
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <Input
            variant="ghost"
            size="mini"
            aria-label="Chapter name"
            value={name}
            onChange={(event) => {
              const next = event.currentTarget.value;
              setName(next);
              onChapterNameChange?.(next);
            }}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ChapterNavButton };
