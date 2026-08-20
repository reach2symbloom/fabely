/**
 * Fia Answer — a single retrieved answer row in Fia's search results.
 *
 * Figma: "Fia answer" (`16064:4860`).
 */

import { FiaSilcrow } from '@/foundations/icons';
import { Badge } from '@/primitives/badge';
import { cn } from '@/lib/utils';

export type FiaAnswerProps = {
  /** The quoted answer body Fia surfaced from the manuscript. */
  answer: string;
  /** Source label, rendered as "Source: {source}". */
  source: string;
  /** Number of supporting results found. */
  resultCount: number;
  className?: string;
};

const paragraphStyle = [
  'font-[family-name:var(--text-paragraph-regular-regular-font-family)]',
  '[font-weight:var(--text-paragraph-regular-regular-font-weight)]',
  'text-[length:var(--text-paragraph-regular-regular-font-size)]',
  'leading-[var(--text-paragraph-regular-regular-line-height)]',
  'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
].join(' ');

const resultCountStyle = [
  'font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
  '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
  'text-[length:var(--text-paragraph-mini-regular-font-size)]',
  'leading-[var(--text-paragraph-mini-regular-line-height)]',
  'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
].join(' ');

function FiaAnswer({ answer, source, resultCount, className }: FiaAnswerProps) {
  return (
    <div
      data-slot="fia-answer"
      className={cn(
        'flex w-full max-w-[479px] flex-col items-start gap-[var(--spacing-sm)]',
        'border-b-[length:var(--stroke-thin)] border-solid border-[color:var(--theme-alpha-black-switch-5)]',
        'px-[var(--spacing-md)] pb-[var(--spacing-md)]',
        className,
      )}
    >
      <div className="flex w-full items-start gap-[var(--spacing-2xs)]">
        <FiaSilcrow className="mt-[4px] text-[color:var(--tw-raw-fia-200)]" />
        <p className={cn(paragraphStyle, 'min-w-0 flex-1 break-words text-[color:var(--theme-alpha-black-switch-70)]')}>
          {answer}
        </p>
      </div>
      <div className="flex w-full items-center justify-between">
        <Badge>Source: {source}</Badge>
        <span className={cn(resultCountStyle, 'text-[color:var(--theme-alpha-black-switch-50)]')}>
          {resultCount} results
        </span>
      </div>
    </div>
  );
}

export { FiaAnswer };
