/**
 * Theme Card — chat/assistant chrome surfacing one manuscript theme, with a
 * footer chip linking out to its notes.
 *
 * Figma set: Theme card (`16338:2655`). Axis: Hover False / True.
 */

'use client';

import { ArrowRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export type ThemeCardProps = {
  /** Numbered prefix — e.g. `1` renders "1. {title}". Omit to hide numbering. */
  index?: number;
  title: string;
  description: string;
  /** Footer chip label — the linked note group (Figma "Grove rules and behavior"). */
  chipLabel: string;
  /** Note count shown beside the chip's arrow. Omit to hide the trailing meta. */
  noteCount?: number;
  /**
   * Notes URL. Renders a stretched link over the whole card (Figma's card is
   * a single hoverable/clickable surface, not just the footer chip).
   */
  href?: string;
  /** Storybook / demo — lock the hover paint without a pointer. */
  forceHover?: boolean;
  className?: string;
};

const titleStyle = [
  'font-[family-name:var(--text-paragraph-large-regular-font-family)]',
  '[font-weight:var(--text-paragraph-large-regular-font-weight)]',
  'text-[length:var(--text-paragraph-large-regular-font-size)]',
  'leading-[var(--text-paragraph-large-regular-line-height)]',
  'tracking-[var(--text-paragraph-large-regular-letter-spacing)]',
].join(' ');

const descriptionStyle = [
  'font-[family-name:var(--text-paragraph-regular-regular-font-family)]',
  '[font-weight:var(--text-paragraph-regular-regular-font-weight)]',
  'text-[length:var(--text-paragraph-regular-regular-font-size)]',
  'leading-[var(--text-paragraph-regular-regular-line-height)]',
  'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
].join(' ');

const chipLabelStyle = [
  'font-[family-name:var(--text-paragraph-regular-medium-font-family)]',
  '[font-weight:var(--text-paragraph-regular-medium-font-weight)]',
  'text-[length:var(--text-paragraph-regular-medium-font-size)]',
  'leading-[var(--text-paragraph-regular-medium-line-height)]',
  'tracking-[var(--text-paragraph-regular-medium-letter-spacing)]',
].join(' ');

const noteCountStyle = [
  'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
  '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
  'text-[length:var(--text-paragraph-small-regular-font-size)]',
  'leading-[var(--text-paragraph-small-regular-line-height)]',
  'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
].join(' ');

function ThemeCard({
  index,
  title,
  description,
  chipLabel,
  noteCount,
  href,
  forceHover = false,
  className,
}: ThemeCardProps) {
  const heading = index != null ? `${index}. ${title}` : title;

  return (
    <div
      data-slot="theme-card"
      data-force-hover={forceHover || undefined}
      className={cn(
        'group/theme-card relative flex w-full max-w-[479px] flex-col items-start',
        'gap-[var(--spacing-md)] rounded-[var(--rounded-lg)] p-[var(--spacing-md)]',
        'border-[length:var(--stroke-thin)] border-solid border-[color:var(--border)]',
        'hover:bg-[var(--primary-hover)] group-data-[force-hover=true]/theme-card:bg-[var(--primary-hover)]',
        className,
      )}
    >
      {href != null ? (
        <a
          href={href}
          aria-label={chipLabel}
          data-slot="theme-card-link"
          className="absolute inset-0 z-0"
        />
      ) : null}

      <div className="flex w-full flex-col items-start gap-[var(--spacing-xs)]">
        <p
          className={cn(
            titleStyle,
            'text-[color:var(--theme-alpha-black-switch-75)]',
          )}
        >
          {heading}
        </p>
        <p className={cn(descriptionStyle, 'w-full text-[color:var(--text)]')}>
          {description}
        </p>
      </div>

      <div
        data-slot="theme-card-chip"
        className={cn(
          'flex w-full items-center justify-between overflow-hidden',
          'rounded-[var(--rounded-lg)] p-[var(--spacing-sm)]',
          'border-[length:var(--stroke-thin)] border-solid border-[color:var(--theme-alpha-black-switch-10)]',
          'bg-[var(--theme-alpha-black-switch-333)]',
          'group-hover/theme-card:bg-[var(--theme-alpha-black-switch-5)]',
          'group-data-[force-hover=true]/theme-card:bg-[var(--theme-alpha-black-switch-5)]',
        )}
      >
        <span className={cn(chipLabelStyle, 'text-[color:var(--text)]')}>
          {chipLabel}
        </span>
        {noteCount != null ? (
          <span className="flex shrink-0 items-center gap-[var(--spacing-xs)]">
            <span
              className={cn(
                noteCountStyle,
                'text-[color:var(--muted-foreground)] whitespace-nowrap',
              )}
            >
              {noteCount} {noteCount === 1 ? 'note' : 'notes'}
            </span>
            <ArrowRightIcon
              aria-hidden
              className="size-[length:var(--icon-sm)] shrink-0 text-[color:var(--muted-foreground)]"
            />
          </span>
        ) : null}
      </div>
    </div>
  );
}

export { ThemeCard };
