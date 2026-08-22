/**
 * Control Header — Header / Description text pair sitting above a
 * Controls chip group.
 *
 * Figma: Controls (`16301:20374`) `type=Header variant` — "Header" /
 * "Description" (Paragraph Mini, `--foreground` / `--muted-foreground`).
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

const PARAGRAPH_MINI = [
  'font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
  '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
  'text-[length:var(--text-paragraph-mini-regular-font-size)]',
  'leading-[var(--text-paragraph-mini-regular-line-height)]',
  'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
].join(' ');

export type ControlHeaderProps = {
  className?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
};

function ControlHeader({ className, title, description }: ControlHeaderProps) {
  return (
    <div
      data-slot="control-header"
      className={cn('flex flex-col gap-[var(--spacing-2xs)]', className)}
    >
      <p className={cn(PARAGRAPH_MINI, 'text-[color:var(--foreground)]')}>
        {title}
      </p>
      {description != null ? (
        <p className={cn(PARAGRAPH_MINI, 'text-[color:var(--muted-foreground)]')}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { ControlHeader };
