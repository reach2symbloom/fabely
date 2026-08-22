/**
 * Lateral Toggles — Prev/Next chapter-navigation atom. Quiet at rest
 * (`opacity-60`), full strength on hover/focus, with a `⌘←`/`⌘→` shortcut
 * hint and the target chapter's title truncated to one line.
 *
 * Figma's `alignment` prop enumerates four values (`Left`, `Right`, plus two
 * mis-named duplicates, `Alignment3`/`Alignment4`, that are really "Right
 * hover" and "Left hover") crossed with a separate `hover` boolean — an
 * artifact of how the Figma variant was authored, not two independent axes.
 * Collapsed here into one real axis, `direction` ('prev' | 'next'), which
 * alone determines the label, shortcut glyph, kbd position, and side the
 * block hugs; `hover` still exists but only ever changes opacity.
 *
 * The `⌘←`/`⌘→` hint is wired, not decorative: while mounted (and
 * `shortcutEnabled`), each instance listens for its own direction's
 * Cmd/Ctrl+Arrow and calls `onClick`, same as a real press. Suppressed
 * while focus sits in an editable element, so it doesn't steal
 * cursor-to-line-start/end from the manuscript editor.
 *
 * Visual source: Figma **Lateral Toggles**
 * ([node](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16091-10251)
 * `16091:10251`).
 */
'use client';

import { useEffect } from 'react';

import { cn } from '@/lib/utils';
import { Kbd } from '@/primitives/kbd';

type LateralTogglesDirection = 'prev' | 'next';

const DIRECTION_LABEL: Record<LateralTogglesDirection, string> = {
  prev: 'Prev:',
  next: 'Next:',
};

/** Figma kbd combo — one pill per direction, not two separate keys. */
const DIRECTION_SHORTCUT: Record<LateralTogglesDirection, string> = {
  prev: '⌘←',
  next: '⌘→',
};

const DIRECTION_KEY: Record<LateralTogglesDirection, string> = {
  prev: 'ArrowLeft',
  next: 'ArrowRight',
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

type LateralTogglesProps = {
  /** Which chapter this jumps to. Also picks the label, shortcut glyph, and which side the block hugs. */
  direction?: LateralTogglesDirection;
  /** Target chapter's title — truncated to one line. */
  title: string;
  /** Override the default "Prev:"/"Next:" copy. */
  label?: string;
  onClick?: () => void;
  className?: string;
  /** Storybook / playground — lock the hover paint without a pointer. */
  forceHover?: boolean;
  /**
   * Bind the `⌘←`/`⌘→` hint to a real `window` keydown listener that calls
   * `onClick`. Default `true`; set `false` if a host screen wants to own
   * the shortcut itself (e.g. a single listener driving a pair of these).
   */
  shortcutEnabled?: boolean;
};

function LateralToggles({
  direction = 'prev',
  title,
  label,
  onClick,
  className,
  forceHover = false,
  shortcutEnabled = true,
}: LateralTogglesProps) {
  const isPrev = direction === 'prev';
  const resolvedLabel = label ?? DIRECTION_LABEL[direction];

  useEffect(() => {
    if (!shortcutEnabled || !onClick) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.altKey || event.shiftKey) return;
      if (event.key !== DIRECTION_KEY[direction]) return;
      if (isEditableTarget(event.target)) return;

      event.preventDefault();
      onClick();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, onClick, shortcutEnabled]);

  const kbd = <Kbd className="shrink-0">{DIRECTION_SHORTCUT[direction]}</Kbd>;
  const labelEl = (
    <span
      className={cn(
        'shrink-0 whitespace-nowrap',
        'font-[family-name:var(--font-family-body)]',
        '[font-weight:var(--font-weight-paragraph-medium)]',
        'text-[length:var(--text-paragraph-mini-medium-font-size)]',
        'leading-[var(--text-paragraph-mini-medium-line-height)]',
        'tracking-[var(--text-paragraph-mini-medium-letter-spacing)]',
        'text-[color:var(--theme-alpha-black-switch-85)]'
      )}
    >
      {resolvedLabel}
    </span>
  );

  return (
    <button
      type="button"
      onClick={onClick}
      data-slot="lateral-toggles"
      data-direction={direction}
      data-force-hover={forceHover || undefined}
      aria-label={`${isPrev ? 'Previous' : 'Next'} chapter: ${title}`}
      className={cn(
        'flex max-w-[160px] flex-col gap-[var(--spacing-2xs)]',
        'rounded-[length:var(--rounded-md)]',
        isPrev ? 'items-start' : 'items-end',
        'opacity-60 transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
        'hover:opacity-100 focus-visible:opacity-100 data-[force-hover=true]:opacity-100',
        className
      )}
    >
      <span className="flex items-center gap-[var(--spacing-xs)]">
        {isPrev ? kbd : labelEl}
        {isPrev ? labelEl : kbd}
      </span>
      <span
        /* Figma's own title box is a fixed 152px, independent of the row's
         * hug width above — the truncation point is a deliberate design
         * value, not derived from the row's content. */
        className={cn(
          'w-[152px] overflow-hidden text-ellipsis whitespace-nowrap text-start',
          'font-[family-name:var(--font-family-body)]',
          '[font-weight:var(--font-weight-paragraph-regular)]',
          'text-[length:var(--text-paragraph-mini-regular-font-size)]',
          'leading-[var(--text-paragraph-mini-regular-line-height)]',
          'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
          'text-[color:var(--theme-alpha-black-switch-85)]'
        )}
      >
        {title}
      </span>
    </button>
  );
}

export { LateralToggles, type LateralTogglesProps, type LateralTogglesDirection };
