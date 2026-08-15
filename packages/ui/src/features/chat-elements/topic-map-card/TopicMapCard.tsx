/**
 * Topic Map Card — compact chat/assistant row summarizing one topic-map item.
 *
 * Figma set: Topic map card (`16338:2709`). Axis: Hover False / True.
 */

import { cn } from '@/lib/utils';

export type TopicMapCardProps = {
  /** Numbered prefix — e.g. `1` renders "1. {title}". Omit to hide numbering. */
  index?: number;
  title: string;
  description: string;
  /** Optional destination. When present, the whole card is an anchor. */
  href?: string;
  /** Storybook / demo — lock the hover paint without a pointer. */
  forceHover?: boolean;
  className?: string;
};

const paragraphStyle = [
  'font-[family-name:var(--text-paragraph-regular-regular-font-family)]',
  'text-[length:var(--text-paragraph-regular-regular-font-size)]',
  'leading-[var(--text-paragraph-regular-regular-line-height)]',
  'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
].join(' ');

function TopicMapCard({
  index,
  title,
  description,
  href,
  forceHover = false,
  className,
}: TopicMapCardProps) {
  const heading = index != null ? `${index}. ${title}: ` : `${title}: `;
  const Root = href != null ? 'a' : 'div';

  return (
    <Root
      {...(href != null ? { href } : {})}
      data-slot="topic-map-card"
      data-force-hover={forceHover || undefined}
      className={cn(
        'relative flex w-full max-w-[479px] items-start',
        'rounded-[var(--rounded-md)] p-[var(--spacing-xs)]',
        'border-[length:var(--stroke-thin)] border-solid border-transparent',
        'text-left no-underline',
        'hover:border-[color:var(--border)] hover:bg-[var(--primary-hover)]',
        'data-[force-hover=true]:border-[color:var(--border)] data-[force-hover=true]:bg-[var(--primary-hover)]',
        href != null &&
          'cursor-pointer outline-none focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
        className,
      )}
    >
      <p className={cn(paragraphStyle, 'w-full')}>
        <span className="[font-weight:var(--text-paragraph-regular-bold-font-weight)] text-[color:var(--theme-alpha-black-switch-75)]">
          {heading}
        </span>
        <span className="[font-weight:var(--text-paragraph-regular-regular-font-weight)] text-[color:var(--theme-alpha-black-switch-50)]">
          {description}
        </span>
      </p>
    </Root>
  );
}

export { TopicMapCard };
