/**
 * Fabely Bookmark Button — bare icon toggle, no button chrome (no fill
 * container, no roundness, no ghost/outline skin). Three states only:
 * unselected `alpha-20` (stroke) → unselected hover `alpha-50` (stroke) →
 * selected `primary` (a genuinely filled glyph, not just recolored).
 *
 * Composes the headless Base UI Toggle primitive directly (not the styled
 * [Toggle](../../primitives/toggle/README.md) atom — that one carries pill
 * chrome this control deliberately has none of).
 * Visual source: Figma **Bookmark Icon Button**
 * ([Bookmark Icon Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16066-5970)
 * `16066:5970`).
 */
'use client';

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { BookmarkIcon } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { useSuperscript } from '@/hooks/use-superscript';
import { cn } from '@/lib/utils';

type BookmarkButtonSize = 'sm' | 'default' | 'lg';

const ICON_SIZE: Record<BookmarkButtonSize, string> = {
  sm: 'size-[length:var(--icon-sm)]',
  default: 'size-[length:var(--icon-md)]',
  lg: 'size-[length:var(--icon-lg)]',
};

type BookmarkButtonProps = Omit<TogglePrimitive.Props, 'children'> & {
  /** Glyph size — `--icon-sm` / `--icon-md` / `--icon-lg`. */
  size?: BookmarkButtonSize;
  /** Figma `Show superscript` — badge only renders while pressed. */
  showSuperscript?: boolean;
  /** Badge content when `showSuperscript` is active. Figma default is "2". */
  superscriptValue?: ReactNode;
  /** Storybook / playground — lock hover paint without a pointer. */
  forceHover?: boolean;
  /**
   * Extra content rendered inside this same button, after the glyph — e.g. a
   * composite wrapping this atom with a revealed label that should share its
   * click target and cursor, not sit as an inert sibling next to it.
   */
  trailingContent?: ReactNode;
};

function BookmarkButton({
  className,
  size = 'default',
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  showSuperscript = false,
  superscriptValue = 2,
  forceHover = false,
  trailingContent,
  'aria-label': ariaLabelProp,
  ...props
}: BookmarkButtonProps) {
  const isControlled = pressedProp !== undefined;
  const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed);
  const pressed = isControlled ? Boolean(pressedProp) : uncontrolledPressed;

  const handlePressedChange: NonNullable<TogglePrimitive.Props['onPressedChange']> = (
    next,
    eventDetails
  ) => {
    if (!isControlled) {
      setUncontrolledPressed(next);
    }
    onPressedChange?.(next, eventDetails);
  };

  const ariaLabel =
    ariaLabelProp ?? (pressed ? 'Remove bookmark' : 'Bookmark');

  const superscriptVisible = useSuperscript({ show: showSuperscript, active: pressed });

  return (
    <TogglePrimitive
      data-slot="bookmark-button"
      data-force-hover={forceHover || undefined}
      {...props}
      pressed={isControlled ? pressedProp : undefined}
      defaultPressed={isControlled ? undefined : defaultPressed}
      onPressedChange={handlePressedChange}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center',
        'bg-transparent border-0 p-0 outline-none select-none',
        'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
        'disabled:pointer-events-none disabled:opacity-50',
        /* Figma 16066:5970 — unselected alpha-20 → alpha-50 hover; selected primary. */
        'text-[color:var(--theme-alpha-black-switch-20)]',
        'not-data-pressed:not-aria-pressed:hover:text-[color:var(--theme-alpha-black-switch-50)]',
        'not-data-pressed:not-aria-pressed:data-[force-hover=true]:text-[color:var(--theme-alpha-black-switch-50)]',
        'data-pressed:text-[color:var(--primary)]',
        'aria-pressed:text-[color:var(--primary)]',
        '[&_svg]:transition-colors',
        '[&_svg]:duration-[var(--duration-fast)]',
        '[&_svg]:ease-[var(--ease-emphasized)]',
        className
      )}
    >
      <span className="relative inline-flex">
        <BookmarkIcon
          aria-hidden
          className={ICON_SIZE[size]}
          fill={pressed ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={pressed ? 0 : 2}
        />
        {superscriptVisible && (
          <span
            aria-hidden
            className={cn(
              /* Figma 16231:7082/7091 — Superscript, offset from the Icon box. */
              'absolute -top-2 left-4',
              'flex items-center justify-center',
              'px-[length:var(--spacing-2xs)] py-[length:var(--spacing-3xs)]',
              'font-[family-name:var(--text-paragraph-mini-medium-font-family)]',
              '[font-weight:var(--text-paragraph-mini-medium-font-weight)]',
              'text-[10px] leading-[var(--text-paragraph-mini-medium-line-height)]',
              'tracking-[var(--text-paragraph-mini-medium-letter-spacing)]',
              'text-[color:var(--muted-foreground)]',
              'whitespace-nowrap'
            )}
          >
            {superscriptValue}
          </span>
        )}
      </span>
      {trailingContent}
    </TogglePrimitive>
  );
}

export { BookmarkButton, type BookmarkButtonProps };
