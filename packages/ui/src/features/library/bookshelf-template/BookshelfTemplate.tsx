/**
 * Bookshelf Template — Library page shell (Header + Library Nav + Footer).
 *
 * Figma set: Bookshelf template (`16431:14662`). Composes existing Library
 * pieces (Library Nav, itself built on Library List Item) with a header
 * (wordmark + "New manuscript" CTA) and a footer (user identity + Upgrade
 * plan link + notifications). No new visual primitives — this is a
 * page-level arrangement of already-published Library / Molecule /
 * Primitive components.
 *
 * Placement: NO — Library product chrome. Stays in
 * `src/features/library/bookshelf-template/`.
 */
'use client';

import * as React from 'react';
import { BellIcon, PlusIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { AvatarWithLabel, getUserInitials, type UserIdentity } from '@/molecules/avatar-with-label';
import { Avatar, AvatarFallback, AvatarImage } from '@/primitives/avatar';
import { Badge } from '@/primitives/badge';
import { Button, IconButton, buttonVariants, iconButtonVariants } from '@/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/primitives/dropdown-menu';
import { Separator } from '@/primitives/separator';
import { LibraryNav, type LibraryNavBook, type LibraryNavProps } from '../library-nav';

export type BookshelfTemplateProps = {
  /** Forwarded to Library Nav. */
  books: LibraryNavBook[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: LibraryNavProps['onActiveChange'];
  /** Active-row link label, forwarded to Library Nav. */
  linkLabel?: string;

  /** Brand mark / wordmark. Prefer `logo` slot; `logoSrc` is a convenience. */
  logoSrc?: string;
  logoAlt?: string;
  logo?: React.ReactNode;
  /** Logo link — home. Default `/`. Pass `false` to render without an anchor. */
  homeHref?: string | false;

  newManuscriptLabel?: string;
  /** New manuscript route. Renders the CTA as a link when set. */
  newManuscriptHref?: string;
  onNewManuscriptClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;

  /** Signed-in user, normally mapped directly from the project database. */
  user?: UserIdentity;
  /** Display-name override; falls back to `user.name`. */
  userName?: string;
  userInitials?: string;
  userAvatarSrc?: string;
  /**
   * Account/profile route — falls back to `user.profileHref`. Feeds the
   * account menu's "Account settings" item; also the fallback link target
   * when `avatarPopoverDisabled` is set.
   */
  userProfileHref?: string;
  /**
   * Primary way this footer's avatar works: click opens an account-menu
   * popover (name header + Account settings + Sign out) instead of
   * navigating. Set `true` to disable it and fall back to a plain
   * `userProfileHref` link (or a static row without one) — pre-popover
   * behavior.
   */
  avatarPopoverDisabled?: boolean;
  /** Account-menu trigger's accessible name. Default "Account menu". */
  accountMenuLabel?: string;
  accountSettingsLabel?: string;
  signOutLabel?: string;
  onSignOutClick?: () => void;
  planLabel?: string;
  /** Upgrade link — pricing. Default `/pricing`. */
  upgradeHref?: string;
  onUpgradeClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;

  /** Unread notification count. Badge hides when 0 or unset. */
  notificationCount?: number;
  notificationsLabel?: string;
  /** Notifications route — destination TBD. Renders a real `<a>` when set; falls back to a plain button otherwise. */
  notificationsHref?: string;
  onNotificationsClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;

  className?: string;
};

const DEFAULT_HOME_HREF = '/';
const DEFAULT_UPGRADE_HREF = '/pricing';

/**
 * Figma's footer identity swatch — lavender, not Avatar's generic
 * `--tw-raw-pantones-blush` default. AvatarFallback's own text color
 * (`--primary-foreground`) already matches Figma as-is.
 */
const AVATAR_FALLBACK_CLASSNAME = 'bg-[var(--tw-raw-pantones-lavendar)]';

/**
 * Account-menu trigger — the hover/padding/focus chrome AvatarWithLabel's
 * own `interactive` mode would normally supply, moved here because the
 * trigger wraps the *whole* AvatarWithLabel (avatar + name + "Upgrade
 * plan"). Rendered as `<div role="button">`, not a native `<button>`:
 * "Upgrade plan" lives inside as a real `<a>` (via `actionLabel`), and a
 * `<button>` element cannot validly contain interactive content (its
 * content model excludes `<a>`) — a plain `role="button"` div has no such
 * restriction. `stopIfInsideAnchor` (below) keeps a click on "Upgrade
 * plan" from also toggling the menu. "Upgrade plan"'s hover stays
 * independent regardless of this ambient fill because `buttonLinkVariants`
 * already gives it its own `hover:underline` on the anchor itself — a
 * second, self-owned cue layered on top, not merged into one.
 */
const ACCOUNT_TRIGGER_CLASSNAME = cn(
  'inline-flex items-start rounded-[length:var(--rounded-lg)]',
  'ps-[var(--spacing-xs)] pe-[var(--spacing-sm)] py-[var(--spacing-xs)]',
  'cursor-pointer outline-none select-none text-left',
  'transition-[background-color] duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
  'hover:bg-[color:var(--theme-alpha-black-switch-333)]',
  'data-popup-open:bg-[color:var(--theme-alpha-black-switch-333)]',
  'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
);

/**
 * Base UI's Menu.Trigger opens on `mousedown` (via floating-ui's
 * `useClick`), not `click` — a plain `event.stopPropagation()` from the
 * nested "Upgrade plan" anchor's own `onClick` fires too late; the popup
 * already opened on the preceding mousedown. `pointerdown` doesn't cover
 * it either — `pointerdown` and `mousedown` are separate event types the
 * browser dispatches independently, so stopping one doesn't stop the
 * other. Attached to the trigger div in the *capture* phase (fires
 * top-down, before the event reaches the anchor and before Base UI's own
 * bubble-phase listener on this same div), so `onMouseDownCapture` reaches
 * Base UI's handler before it does, in time to stop it.
 */
function stopIfInsideAnchor(event: React.SyntheticEvent) {
  if (event.target instanceof HTMLElement && event.target.closest('a')) {
    event.stopPropagation();
  }
}

const paragraphSmallRegular = [
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-regular)]',
  'text-[length:var(--text-paragraph-small-regular-font-size)]',
  'leading-[var(--text-paragraph-small-regular-line-height)]',
  'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
].join(' ');

function BookshelfTemplate({
  books,
  activeId,
  defaultActiveId,
  onActiveChange,
  linkLabel,

  logoSrc,
  logoAlt = 'Fabely',
  logo,
  homeHref = DEFAULT_HOME_HREF,

  newManuscriptLabel = 'New manuscript',
  newManuscriptHref,
  onNewManuscriptClick,

  user,
  userName,
  userInitials,
  userAvatarSrc,
  userProfileHref,
  avatarPopoverDisabled = false,
  accountMenuLabel = 'Account menu',
  accountSettingsLabel = 'Account settings',
  signOutLabel = 'Sign out',
  onSignOutClick,
  planLabel = 'Upgrade plan',
  upgradeHref = DEFAULT_UPGRADE_HREF,
  onUpgradeClick,

  notificationCount,
  notificationsLabel = 'Notifications',
  notificationsHref,
  onNotificationsClick,

  className,
}: BookshelfTemplateProps) {
  const resolvedUserName = userName ?? user?.name ?? '';
  const resolvedInitials =
    userInitials ??
    (user ? getUserInitials(user) : getUserInitials({ name: resolvedUserName }));
  const resolvedAvatarSrc = userAvatarSrc ?? user?.avatarUrl ?? undefined;
  const resolvedProfileHref = userProfileHref ?? user?.profileHref ?? undefined;

  const logoImage =
    logo ??
    (logoSrc ? (
      <img
        src={logoSrc}
        alt={logoAlt}
        className="h-[length:var(--spacing-xl)] w-auto max-w-[152px] object-contain object-left"
      />
    ) : null);

  const logoNode =
    logoImage == null ? null : homeHref === false ? (
      logoImage
    ) : (
      <a
        href={homeHref}
        data-slot="bookshelf-template-home"
        aria-label={logoAlt}
        className="inline-flex shrink-0 self-start outline-none focus-visible:shadow-[var(--effect-focus-ring-secondary)] rounded-[length:var(--rounded-sm)]"
      >
        {logoImage}
      </a>
    );

  const newManuscriptContent = (
    <>
      <PlusIcon />
      {newManuscriptLabel}
    </>
  );

  const newManuscriptButton =
    newManuscriptHref != null ? (
      <a
        href={newManuscriptHref}
        data-slot="bookshelf-template-new-manuscript"
        onClick={onNewManuscriptClick}
        className={cn(buttonVariants({ variant: 'primaryOutline', size: 'default' }), 'w-full')}
      >
        {newManuscriptContent}
      </a>
    ) : (
      <Button
        type="button"
        variant="primaryOutline"
        size="default"
        onClick={onNewManuscriptClick}
        data-slot="bookshelf-template-new-manuscript"
        className="w-full"
      >
        {newManuscriptContent}
      </Button>
    );

  return (
    <div
      data-slot="bookshelf-template"
      className={cn(
        /* Library is dark-only chrome (no Figma light variant). Not forcing
         * `.dark` here: this codebase's switch tokens (`--muted-foreground`,
         * `--theme-alpha-black-switch-*`, …) are declared once at `:root`
         * as `var()` aliases and only re-declared for the *raw* switch
         * tokens under `.dark` — the alias's `var()` resolves using
         * whichever element the alias itself is declared on, which is
         * `:root`. That only picks up the dark value when `.dark` sits on
         * `document.documentElement` (the app's real toggle — see
         * `.storybook/preview.tsx`); a `.dark` class nested on some
         * descendant div, as this root once was, leaves aliases like
         * `--muted-foreground` silently stuck on their light value even
         * though `--theme-alpha-black-switch-*` itself flips correctly.
         * So: this component assumes a `.dark`-rooted host, same as every
         * other Library piece (Library Nav, Resume Writing Button, …). */
        'flex h-full w-full max-w-[357px] flex-col items-center justify-between overflow-hidden',
        'rounded-[inherit] bg-[color:var(--tw-raw-black)] backdrop-blur-[2.5px]',
        'shadow-[0px_4px_64px_-32px_black]',
        className,
      )}
    >
      <div
        data-slot="bookshelf-template-header"
        className="flex w-full shrink-0 flex-col items-start gap-[length:var(--spacing-xl)] p-[length:var(--spacing-md)]"
      >
        {logoNode}
        {newManuscriptButton}
      </div>

      <div
        data-slot="bookshelf-template-library"
        className="flex w-full min-h-0 flex-1 flex-col items-start p-[length:var(--spacing-md)]"
      >
        <LibraryNav
          books={books}
          activeId={activeId}
          defaultActiveId={defaultActiveId}
          onActiveChange={onActiveChange}
          linkLabel={linkLabel}
        />
      </div>

      <div
        data-slot="bookshelf-template-footer"
        className="flex w-full shrink-0 flex-col items-start gap-[length:var(--spacing-xs)] px-[length:var(--spacing-md)] py-[length:var(--spacing-xs)]"
      >
        <Separator orientation="horizontal" size="thin" spacing="none" className="w-full" />
        <div className="flex w-full items-center justify-between">
          {avatarPopoverDisabled ? (
            resolvedProfileHref != null ? (
              <AvatarWithLabel
                size="md"
                name={resolvedUserName}
                initials={resolvedInitials}
                src={resolvedAvatarSrc}
                href={resolvedProfileHref}
                actionLabel={planLabel}
                actionHref={upgradeHref}
                onActionClick={onUpgradeClick}
                fallbackClassName={AVATAR_FALLBACK_CLASSNAME}
              />
            ) : (
              <AvatarWithLabel
                size="md"
                name={resolvedUserName}
                initials={resolvedInitials}
                src={resolvedAvatarSrc}
                actionLabel={planLabel}
                actionHref={upgradeHref}
                onActionClick={onUpgradeClick}
                fallbackClassName={AVATAR_FALLBACK_CLASSNAME}
              />
            )
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                nativeButton={false}
                render={
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={accountMenuLabel}
                    data-slot="bookshelf-template-account-trigger"
                    className={ACCOUNT_TRIGGER_CLASSNAME}
                    onMouseDownCapture={stopIfInsideAnchor}
                    onClickCapture={stopIfInsideAnchor}
                  />
                }
              >
                <AvatarWithLabel
                  size="md"
                  name={resolvedUserName}
                  initials={resolvedInitials}
                  src={resolvedAvatarSrc}
                  padded={false}
                  actionLabel={planLabel}
                  actionHref={upgradeHref}
                  onActionClick={onUpgradeClick}
                  fallbackClassName={AVATAR_FALLBACK_CLASSNAME}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={8}>
                <div className="flex items-center gap-[length:var(--spacing-xs)] px-[var(--spacing-xs)] py-[var(--spacing-2xs)]">
                  <Avatar size="tiny" shape="round">
                    {resolvedAvatarSrc ? (
                      <AvatarImage src={resolvedAvatarSrc} alt={resolvedUserName} />
                    ) : null}
                    <AvatarFallback className={AVATAR_FALLBACK_CLASSNAME}>
                      {resolvedInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className={cn(paragraphSmallRegular, 'truncate text-[color:var(--text)]')}>
                    {resolvedUserName}
                  </span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  {...(resolvedProfileHref != null
                    ? { render: <a href={resolvedProfileHref} /> }
                    : {})}
                >
                  {accountSettingsLabel}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSignOutClick}>{signOutLabel}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <div className="relative flex shrink-0 items-center gap-[length:var(--spacing-xs)]">
            {notificationsHref != null ? (
              <a
                href={notificationsHref}
                aria-label={notificationsLabel}
                onClick={onNotificationsClick}
                data-slot="bookshelf-template-notifications"
                className={iconButtonVariants({ variant: 'ghost', size: 'sm' })}
              >
                <BellIcon />
              </a>
            ) : (
              <IconButton
                type="button"
                variant="ghost"
                size="sm"
                aria-label={notificationsLabel}
                onClick={onNotificationsClick}
                data-slot="bookshelf-template-notifications"
              >
                <BellIcon />
              </IconButton>
            )}
            {notificationCount ? (
              <Badge
                data-slot="bookshelf-template-notifications-count"
                className="pointer-events-none absolute top-0 left-[21px]"
              >
                {notificationCount}
              </Badge>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export { BookshelfTemplate };
