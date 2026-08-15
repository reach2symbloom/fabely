/**
 * Chapter Menu Header — book chrome at the top of Chapter Menu.
 *
 * Figma variants (alternatives — both landed for comparison):
 * - Main `16373:11236`
 * - Alt `16373:11235`
 *
 * Placement: NO — chapter-nav menu chrome. Stays in
 * `src/features/chapter-nav/chapter-menu-header/`.
 */

'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { FiaSilcrow } from '@/foundations/icons';
import { BookCover } from '@/atoms/book-cover';
import { CycleSwitch, type CycleSwitchOption } from '@/atoms/cycle-switch';
import { AvatarWithLabel, getUserInitials, type UserIdentity } from '@/molecules/avatar-with-label';
import { buttonLinkVariants } from '@/primitives/button';
import { Separator } from '@/primitives/separator';
import { Textarea } from '@/primitives/textarea';
import type { ChapterNavMutationContext } from '../integration';

export type ChapterMenuHeaderVariant = 'main' | 'alt';

const DEFAULT_OUTLINE_OPTIONS: CycleSwitchOption[] = [
  { value: 'chapters', label: 'Chapters only' },
  { value: 'scenes', label: 'Scenes' },
  { value: 'full', label: 'Full outline' },
];

/** Placeholder routes until product wiring lands. */
const DEFAULT_HOME_HREF = '/';
const DEFAULT_UPGRADE_HREF = '/pricing';
const DEFAULT_AUTHOR_HREF = '/author';

export type ChapterMenuHeaderProps = {
  manuscriptId?: string;
  /** Figma Variant axis — Main vs Alt layout. */
  variant?: ChapterMenuHeaderVariant;
  /** Book / manuscript title (Heading 2). */
  bookTitle: string;
  /** When set, title is controlled. Otherwise `bookTitle` is the initial value. */
  onBookTitleChange?: (value: string, context: ChapterNavMutationContext) => void;
  /** Fires once editing finishes; use this for a persistence mutation. */
  onBookTitleCommit?: (value: string, context: ChapterNavMutationContext) => void;
  /** Accessible name for the title field. */
  bookTitleLabel?: string;
  /** Cover art. Prefer `cover` slot; `coverSrc` is a convenience. */
  coverSrc?: string;
  coverAlt?: string;
  cover?: React.ReactNode;
  /** Book Cover atom — edit opens OS image picker by default. */
  coverEditHref?: string;
  onCoverImageSelect?: (file: File, context: ChapterNavMutationContext) => void;
  coverEditLabel?: string;
  /** Force Book Cover editable on/off when using `coverSrc`. Default true. */
  coverEditable?: boolean;
  /** Brand mark / wordmark. Prefer `logo` slot; `logoSrc` is a convenience. */
  logoSrc?: string;
  logoAlt?: string;
  logo?: React.ReactNode;
  /** Logo link — home. Default `/`. Pass `false` to render without an anchor. */
  homeHref?: string | false;
  /** Author record, normally mapped directly from the project database. */
  author?: UserIdentity;
  /** Display-name override; falls back to `author.name`. */
  authorName?: string;
  /** Initials for AvatarFallback. */
  authorInitials?: string;
  authorImageSrc?: string;
  /** Main only — role under the name (Figma “Author”); display-only when linked. */
  authorRole?: string;
  /**
   * Author profile URL for AvatarWithLabel.
   * Falls back to `author.profileHref`. Pass `false` to force a static identity.
   */
  authorHref?: string | false;
  planLabel?: string;
  upgradeLabel?: string;
  /** Upgrade link — pricing. Default `/pricing`. */
  upgradeHref?: string;
  onUpgradeClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  outlineOptions?: CycleSwitchOption[];
  outlineValue?: string;
  defaultOutlineValue?: string;
  onOutlineValueChange?: (value: string, context: ChapterNavMutationContext) => void;
  className?: string;
};

function DotDivider() {
  return (
    <span
      aria-hidden
      data-slot="chapter-menu-header-dot"
      className="size-[length:var(--spacing-2xs)] shrink-0 rounded-[length:var(--rounded-full)] bg-[color:var(--theme-alpha-black-switch-15)]"
    />
  );
}

const authorRoleType = [
  'font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
  '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
  'text-[length:var(--text-paragraph-mini-regular-font-size)]',
  'leading-[var(--text-paragraph-mini-regular-line-height)]',
  'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
  'text-[color:var(--theme-alpha-black-switch-50)] underline whitespace-nowrap',
].join(' ');

function UpgradeControl({
  label,
  href,
  onClick,
}: {
  label: string;
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
}) {
  /* Link Button chrome on a real `<a>` — not `<ButtonLink render={<a />}>`
     (Base UI forces role="button"). See primitives/button/link-button README. */
  return (
    <a
      href={href}
      className={buttonLinkVariants({ variant: 'fia', size: 'lg' })}
      onClick={onClick}
    >
      <FiaSilcrow />
      {label}
    </a>
  );
}

function PlanUpgradeRow({
  planLabel,
  upgradeLabel,
  upgradeHref,
  onUpgradeClick,
}: {
  planLabel: string;
  upgradeLabel: string;
  upgradeHref: string;
  onUpgradeClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
}) {
  return (
    <div className="flex shrink-0 items-center gap-[var(--spacing-xs)]">
      <span
        className={cn(
          'font-[family-name:var(--text-paragraph-regular-regular-font-family)]',
          '[font-weight:var(--text-paragraph-regular-regular-font-weight)]',
          'text-[length:var(--text-paragraph-regular-regular-font-size)]',
          'leading-[var(--text-paragraph-regular-regular-line-height)]',
          'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
          'text-[color:var(--text)] whitespace-nowrap',
        )}
      >
        {planLabel}
      </span>
      <UpgradeControl
        label={upgradeLabel}
        href={upgradeHref}
        onClick={onUpgradeClick}
      />
    </div>
  );
}

function AuthorBlock({
  variant,
  name,
  initials,
  imageSrc,
  role,
  href,
  userId,
}: {
  variant: ChapterMenuHeaderVariant;
  name: string;
  initials: string;
  imageSrc?: string;
  role?: string;
  href?: string;
  userId?: string;
}) {
  if (variant === 'main') {
    const roleAction =
      role == null || role === '' ? undefined : (
        <span className={authorRoleType}>{role}</span>
      );

    if (href != null) {
      return (
        <AvatarWithLabel
          data-slot="chapter-menu-header-author"
          data-user-id={userId}
          size="sm"
          avatarSize="small"
          name={name}
          initials={initials}
          src={imageSrc}
          action={roleAction}
          padded={false}
          gradient={false}
          href={href}
        />
      );
    }

    return (
      <AvatarWithLabel
        data-slot="chapter-menu-header-author"
        data-user-id={userId}
        size="sm"
        avatarSize="small"
        name={name}
        initials={initials}
        src={imageSrc}
        action={roleAction}
        padded={false}
        gradient={false}
      />
    );
  }

  if (href != null) {
    return (
      <AvatarWithLabel
        data-slot="chapter-menu-header-author"
        data-user-id={userId}
        size="sm"
        name={name}
        initials={initials}
        src={imageSrc}
        gradient={false}
        href={href}
      />
    );
  }

  return (
    <AvatarWithLabel
      data-slot="chapter-menu-header-author"
      data-user-id={userId}
      size="sm"
      name={name}
      initials={initials}
      src={imageSrc}
      gradient={false}
    />
  );
}

function ChapterMenuHeader({
  manuscriptId,
  variant = 'main',
  bookTitle,
  onBookTitleChange,
  onBookTitleCommit,
  bookTitleLabel = 'Book title',
  coverSrc,
  coverAlt = '',
  cover,
  coverEditHref,
  onCoverImageSelect,
  coverEditLabel,
  coverEditable,
  logoSrc,
  logoAlt = 'Fabely',
  logo,
  homeHref = DEFAULT_HOME_HREF,
  author,
  authorName,
  authorInitials,
  authorImageSrc,
  authorRole = 'Author',
  authorHref,
  planLabel = 'Starter plan',
  upgradeLabel = 'Upgrade',
  upgradeHref = DEFAULT_UPGRADE_HREF,
  onUpgradeClick,
  outlineOptions = DEFAULT_OUTLINE_OPTIONS,
  outlineValue,
  defaultOutlineValue = 'full',
  onOutlineValueChange,
  className,
}: ChapterMenuHeaderProps) {
  const resolvedAuthorName = authorName ?? author?.name ?? 'Author';
  const initials = authorInitials ?? (author ? getUserInitials(author) : getUserInitials({ name: resolvedAuthorName }));
  const resolvedAuthorImageSrc = authorImageSrc ?? author?.avatarUrl ?? undefined;

  const authorProfileHref =
    authorHref === false ? undefined : authorHref ?? author?.profileHref ?? undefined;
  const logoImage =
    logo ??
    (logoSrc ? (
      <img
        src={logoSrc}
        alt={logoAlt}
        className={
          variant === 'main'
            ? 'h-[length:var(--spacing-2xl)] w-auto max-w-[length:var(--tw-raw-spacing-28)] object-contain object-left'
            : 'size-[length:var(--spacing-3xl)] object-contain'
        }
      />
    ) : null);

  const logoNode =
    logoImage == null ? null : homeHref === false ? (
      logoImage
    ) : (
      <a
        href={homeHref}
        data-slot="chapter-menu-header-home"
        aria-label={logoAlt}
        className="inline-flex shrink-0 outline-none focus-visible:shadow-[var(--effect-focus-ring-secondary)] rounded-[length:var(--rounded-sm)]"
      >
        {logoImage}
      </a>
    );

  const coverNode =
    cover ?? (
      <BookCover
        size="sm"
        src={coverSrc}
        alt={coverAlt}
        editable={coverEditable}
        editHref={coverEditHref}
        onImageSelect={(file) => onCoverImageSelect?.(file, { manuscriptId, entityId: manuscriptId, kind: 'manuscript' })}
        editLabel={coverEditLabel}
      />
    );

  const cycle = (
    <CycleSwitch
      options={outlineOptions}
      value={outlineValue}
      defaultValue={defaultOutlineValue}
      onValueChange={(value) => onOutlineValueChange?.(value, { manuscriptId, entityId: manuscriptId, kind: 'manuscript' })}
    />
  );

  return (
    <div
      data-slot="chapter-menu-header"
      data-variant={variant}
      className={cn(
        'flex w-full min-w-[494px] items-start',
        /* Figma root gap `--xl` (24) between left chrome and cover. */
        'gap-[var(--spacing-xl)]',
        className,
      )}
    >
      {/*
        min-w-0 + items-stretch: bottom chrome must stay inside this column.
        overflow-visible + shrink-to-fit rows let Cycle Switch paint under the cover.
      */}
      <div className="flex min-w-0 flex-1 flex-col items-stretch gap-[var(--spacing-sm)]">
        {variant === 'main' ? (
          <div className="flex shrink-0 items-center gap-[var(--spacing-md)]">
            {logoNode}
            <Separator
              orientation="vertical"
              size="thin"
              spacing="regular"
              className="h-[length:var(--spacing-3xl)]"
            />
            <AuthorBlock
              variant="main"
              name={resolvedAuthorName}
              initials={initials}
              imageSrc={resolvedAuthorImageSrc}
              role={authorRole}
              href={authorProfileHref}
              userId={author?.id}
            />
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-[var(--spacing-md)]">
            {logoNode}
            <PlanUpgradeRow
              planLabel={planLabel}
              upgradeLabel={upgradeLabel}
              upgradeHref={upgradeHref}
              onUpgradeClick={onUpgradeClick}
            />
          </div>
        )}

        {/* Quiet Heading Textarea — wraps; no resize grip. */}
        {/*
          Optical exception — not a spacing-token change. The column still
          uses `--spacing-sm` (12px) on both sides of this shell. Heading 2
          Sharp Serif is 30px / 34px line-height with font-bbox 32px ascent
          + 10px descent; cap of “T” sits ~8px into the first line box while
          the last line has ~0.3px descent, so measured optical gaps were
          ~21px above vs ~19px below. Pull the shell up 2px
          (`--tw-raw-spacing-0-5`) to even that, rather than swapping the
          stack gap.
        */}
        <div className="w-full min-w-0 -mt-[length:var(--tw-raw-spacing-0-5)]">
          <Textarea
            data-slot="chapter-menu-header-title"
            variant="quiet"
            textStyle="heading"
            resizable={false}
            className="!rounded-[length:var(--rounded-md)]"
            aria-label={bookTitleLabel}
            placeholder={bookTitleLabel}
            value={onBookTitleChange ? bookTitle : undefined}
            defaultValue={onBookTitleChange ? undefined : bookTitle}
            onChange={(event) => onBookTitleChange?.(event.target.value, { manuscriptId, entityId: manuscriptId, kind: 'manuscript' })}
            onBlur={(event) => onBookTitleCommit?.(event.currentTarget.value.trim(), { manuscriptId, entityId: manuscriptId, kind: 'manuscript' })}
          />
        </div>

        {variant === 'main' ? (
          <div className="flex w-full min-w-0 flex-wrap items-center gap-[var(--spacing-md)]">
            <PlanUpgradeRow
              planLabel={planLabel}
              upgradeLabel={upgradeLabel}
              upgradeHref={upgradeHref}
              onUpgradeClick={onUpgradeClick}
            />
            <div className="flex items-center gap-[var(--spacing-md)]">
              <DotDivider />
              {cycle}
            </div>
          </div>
        ) : (
          <div className="flex w-full min-w-0 flex-wrap items-center gap-[var(--spacing-md)]">
            <AuthorBlock
              variant="alt"
              name={resolvedAuthorName}
              initials={initials}
              imageSrc={resolvedAuthorImageSrc}
              href={authorProfileHref}
              userId={author?.id}
            />
            <div className="flex items-center gap-[var(--spacing-md)]">
              <DotDivider />
              {cycle}
            </div>
          </div>
        )}
      </div>

      {/* Book Cover atom — size sm matches Figma chrome (~164×109). */}
      {coverNode}
    </div>
  );
}

export {
  ChapterMenuHeader,
  DEFAULT_OUTLINE_OPTIONS,
  DEFAULT_HOME_HREF,
  DEFAULT_UPGRADE_HREF,
  DEFAULT_AUTHOR_HREF,
};
