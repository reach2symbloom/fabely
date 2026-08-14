/**
 * Add Section Button — Figma Add section inline button / Type=Default
 * (`16373:4622`). Compact icon + label pill used inside insert rows with
 * dividers; not a standalone surface.
 *
 * Placement: YES — reused as Chapter / Act / Scene / Add chapter pills with
 * different icons and labels. Lives in `src/atoms/add-section-button/`.
 *
 * Renders `<a>` when `href` is set (navigation / empty link / webhook URL);
 * otherwise `<button>` (onClick, formAction submit, etc.).
 */

'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

const pillType = [
  'font-[family-name:var(--text-paragraph-mini-medium-font-family)]',
  '[font-weight:var(--text-paragraph-mini-medium-font-weight)]',
  'text-[length:var(--text-paragraph-mini-medium-font-size)]',
  'leading-[var(--text-paragraph-mini-medium-line-height)]',
  'tracking-[var(--text-paragraph-mini-medium-letter-spacing)]',
].join(' ');

function pillClassName(active: boolean, className?: string) {
  return cn(
    'inline-flex h-[length:var(--spacing-xl)] shrink-0 items-center justify-center',
    'gap-[var(--spacing-1-5)]',
    'rounded-[length:var(--rounded-sm)]',
    'px-[var(--spacing-xs)] py-[var(--spacing-2xs)]',
    'border border-transparent bg-transparent',
    'outline-none select-none no-underline',
    pillType,
    'transition-[color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    '[&_svg]:size-[length:var(--icon-xs)]',
    active
      ? 'bg-[color:var(--theme-alpha-black-switch-333)] text-[color:var(--tw-raw-secondary-200)]'
      : [
          'text-[color:var(--text)]',
          'hover:bg-[color:var(--theme-alpha-black-switch-333)]',
          'hover:text-[color:var(--tw-raw-secondary-200)]',
        ],
    className,
  );
}

type AddSectionButtonShared = {
  /**
   * Force the hover face (Figma Hover=True). Default uses CSS `:hover`.
   */
  active?: boolean;
  /** Required — pill label may be short (“Act”) without context. */
  'aria-label': string;
  /**
   * Icon then label. Icon sizes from `--icon-xs` via the atom chrome.
   */
  children: React.ReactNode;
};

export type AddSectionButtonProps = AddSectionButtonShared &
  (
    | (Omit<React.ComponentProps<'button'>, 'children' | 'aria-label'> & {
        href?: undefined;
      })
    | (Omit<React.ComponentProps<'a'>, 'children' | 'aria-label'> & {
        href: string;
      })
  );

function AddSectionButton({
  active = false,
  className,
  children,
  ...props
}: AddSectionButtonProps) {
  const classes = pillClassName(active, className);

  if ('href' in props && props.href != null) {
    const { href, ...anchorProps } = props;
    return (
      <a
        href={href}
        data-slot="add-section-button"
        data-active={active ? '' : undefined}
        className={classes}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  const {
    type = 'button',
    ...buttonProps
  } = props as Omit<React.ComponentProps<'button'>, 'children' | 'aria-label'> &
    AddSectionButtonShared;

  return (
    <button
      type={type}
      data-slot="add-section-button"
      data-active={active ? '' : undefined}
      className={classes}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

export { AddSectionButton };
