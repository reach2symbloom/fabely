/**
 * Avatar with Label — Avatar + name, optional second-line action.
 *
 * Figma: Avatar with label (`12044:25610`). Style × Size × 2 lines × Hover.
 *
 * Placement: YES — reusable identity chrome (nav, menus, headers). Lives in
 * `src/molecules/avatar-with-label/`.
 *
 * Overlap: Avatar is the face only; Item is a generic list row. Compose
 * Avatar + Link Button (or other action) here — do not fork Avatar.
 *
 * Interactive: pass `href` (author profile) — root is `<a>`, cursor pointer,
 * hover fill. Static: omit `href` — root is `<div>`, no pointer cursor.
 * When interactive, keep `action` non-interactive (no nested links).
 */

'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarSize,
} from '@/primitives/avatar';

export type AvatarWithLabelSize = 'xs' | 'sm' | 'md';

const avatarSizeByLabel: Record<AvatarWithLabelSize, AvatarSize> = {
  xs: 'extraTiny',
  sm: 'tiny',
  md: 'regular',
};

const nameTypeBySize: Record<AvatarWithLabelSize, string> = {
  xs: [
    'font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
    '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
    'text-[length:var(--text-paragraph-mini-regular-font-size)]',
    'leading-[var(--text-paragraph-mini-regular-line-height)]',
    'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
  ].join(' '),
  sm: [
    'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
    '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
    'text-[length:var(--text-paragraph-small-regular-font-size)]',
    'leading-[var(--text-paragraph-small-regular-line-height)]',
    'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
  ].join(' '),
  md: [
    'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
    '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
    'text-[length:var(--text-paragraph-small-regular-font-size)]',
    'leading-[var(--text-paragraph-small-regular-line-height)]',
    'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
  ].join(' '),
};

type AvatarWithLabelShared = {
  /** Figma Size — XS 20 · SM 24 · MD 40. Drives name type + default Avatar size. */
  size?: AvatarWithLabelSize;
  /**
   * Override Avatar primitive size when a host (e.g. Chapter Menu Header)
   * uses a face size outside XS/SM/MD — e.g. `small` (32).
   */
  avatarSize?: AvatarSize;
  /** Display name (first line). */
  name: React.ReactNode;
  /** Initials for AvatarFallback. */
  initials: string;
  /** Image URL — Figma Style=Avatar when set; Style=Initials when omitted. */
  src?: string;
  /** Alt for the image; defaults to string `name` when available. */
  alt?: string;
  /**
   * Second line (Figma 2 lines=True).
   * When the root is interactive (`href`), pass non-interactive nodes only
   * (no nested links) — e.g. a styled span for “Upgrade plan” / “Author”.
   */
  action?: React.ReactNode;
  /**
   * Padded chrome (Figma MD + 2 lines). Defaults on for `size="md"` +
   * `action`; pass `false` for flush stacks (Chapter Menu Header author).
   */
  padded?: boolean;
  /**
   * Force Hover=True face (padded fill). Default uses CSS `:hover` when
   * interactive.
   */
  active?: boolean;
  /**
   * Primary gradient ring on Avatar. Figma shows it on MD + Style=Avatar;
   * defaults to that combination when unset.
   */
  gradient?: boolean;
  /** Passed to AvatarFallback (e.g. host-specific fill). */
  fallbackClassName?: string;
};

export type AvatarWithLabelProps = AvatarWithLabelShared &
  (
    | (Omit<React.ComponentProps<'a'>, 'children'> & {
        /** Author profile URL — root becomes a link (`cursor-pointer` + hover). */
        href: string;
      })
    | (Omit<React.ComponentProps<'div'>, 'children'> & {
        /** Omit for a static, non-interactive row. */
        href?: undefined;
      })
  );

function AvatarWithLabel({
  size = 'xs',
  avatarSize,
  name,
  initials,
  src,
  alt,
  action,
  padded: paddedProp,
  active = false,
  gradient: gradientProp,
  fallbackClassName,
  className,
  href,
  ...props
}: AvatarWithLabelProps) {
  const interactive = href != null && href !== '';
  const twoLines = action != null && action !== false && action !== '';
  const padded = paddedProp ?? (size === 'md' && twoLines);
  const gradient =
    gradientProp ?? (size === 'md' && Boolean(src) && twoLines);
  const imageAlt =
    alt ?? (typeof name === 'string' ? name : undefined) ?? '';

  const {
    'aria-label': ariaLabelProp,
    ...restProps
  } = props as { 'aria-label'?: string } & Record<string, unknown>;

  const ariaLabel =
    ariaLabelProp ??
    (interactive && typeof name === 'string' ? name : undefined);

  const rootClassName = cn(
    'inline-flex items-center',
    padded && [
      'rounded-[length:var(--rounded-lg)]',
      'ps-[var(--spacing-xs)] pe-[var(--spacing-sm)] py-[var(--spacing-xs)]',
      'bg-[color:var(--theme-alpha-black-switch-0)]',
    ],
    interactive && [
      'cursor-pointer no-underline text-inherit',
      'outline-none select-none',
      'rounded-[length:var(--rounded-lg)]',
      'transition-[background-color] duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
      'hover:bg-[color:var(--theme-alpha-black-switch-333)]',
      'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
      /*
        Flush hosts (e.g. Chapter Menu Header) pass padded={false}. Still apply
        Figma hover padding so the fill isn’t tight to the glyph — pull it back
        with negative margin so resting layout stays flush.
      */
      !padded && [
        'ps-[var(--spacing-xs)] pe-[var(--spacing-sm)] py-[var(--spacing-xs)]',
        '-ms-[var(--spacing-xs)] -me-[var(--spacing-sm)] -my-[var(--spacing-xs)]',
      ],
    ],
    active && 'bg-[color:var(--theme-alpha-black-switch-333)]',
    className,
  );

  const content = (
    <>
      <Avatar
        size={avatarSize ?? avatarSizeByLabel[size]}
        shape="round"
        gradient={gradient}
      >
        {src ? <AvatarImage src={src} alt={imageAlt} /> : null}
        <AvatarFallback className={fallbackClassName}>{initials}</AvatarFallback>
      </Avatar>
      {/* Label frame — always 8px (`--spacing-xs`) from the avatar. */}
      <div
        data-slot="avatar-with-label-text"
        className="ms-[length:var(--spacing-xs)] flex min-w-0 flex-col items-start justify-center gap-0"
      >
        <span
          data-slot="avatar-with-label-name"
          className={cn(
            nameTypeBySize[size],
            'whitespace-nowrap',
            twoLines
              ? 'text-[color:var(--text)]'
              : 'text-[color:var(--theme-alpha-black-switch-50)]',
          )}
        >
          {name}
        </span>
        {twoLines ? (
          <div
            data-slot="avatar-with-label-action"
            className={cn('min-w-0', interactive && 'pointer-events-none')}
          >
            {action}
          </div>
        ) : null}
      </div>
    </>
  );

  if (interactive) {
    return (
      <a
        href={href}
        data-slot="avatar-with-label"
        data-interactive=""
        data-size={size}
        data-lines={twoLines ? '2' : '1'}
        data-padded={padded || undefined}
        data-active={active || undefined}
        aria-label={ariaLabel}
        className={rootClassName}
        {...(restProps as Omit<React.ComponentProps<'a'>, 'children' | 'href'>)}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      data-slot="avatar-with-label"
      data-size={size}
      data-lines={twoLines ? '2' : '1'}
      data-padded={padded || undefined}
      data-active={active || undefined}
      className={rootClassName}
      {...(restProps as Omit<React.ComponentProps<'div'>, 'children'>)}
    >
      {content}
    </div>
  );
}

export { AvatarWithLabel };
