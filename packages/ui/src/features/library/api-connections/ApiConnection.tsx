/**
 * API Connection — connected-service row (logo, status, unlink, select files).
 *
 * Figma set: API Connections (`16456:17857`), axis Hover × False/True —
 * only `Google drive` is an actual Figma instance of this row, but its
 * `Brand logos` sub-component models the full catalog in
 * `@/foundations/images/brand-logos` (13 marks), so every brand there is
 * exposed as a connection option. OpenAI ships one `brand` value (not
 * two) — Library's rows sit on a dark surface, so this always resolves
 * to the white `openai-dark` mark; `openai-light` stays available in
 * Foundations for a future light-surface consumer, just not selectable
 * here.
 *
 * Placement: NO — Library product chrome. Stays in
 * `src/features/library/api-connections/`.
 */
'use client';

import * as React from 'react';
import { ChevronRightIcon, UnlinkIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { BRAND_LOGOS, type BrandLogoKey } from '@/foundations/images/brand-logos';
import { BrandLink } from '@/atoms/brand-link';
import { Status } from '@/atoms/status';
import { Button, IconButton } from '@/primitives/button';

export type ApiConnectionBrand = Exclude<BrandLogoKey, 'openai-light' | 'openai-dark' | 'apple' | 'play-store'> | 'openai';

export type ApiConnectionProps = {
  /** Defaults to `'google-drive'`. */
  brand?: ApiConnectionBrand;
  /** Storybook / playground — lock hover paint without a pointer. */
  forceHover?: boolean;
  label?: string;
  logoSrc?: string;
  statusLabel?: string;
  /** Omit to hide the "N notes added" line entirely. */
  noteCount?: number;
  onUnlink?: React.MouseEventHandler<HTMLButtonElement>;
  unlinkLabel?: string;
  /** Fires on any click on the row (the row itself is the select-files hit target). */
  onSelectFiles?: React.MouseEventHandler<HTMLElement>;
  selectFilesLabel?: string;
  className?: string;
};

const DEFAULTS_BY_BRAND: Record<ApiConnectionBrand, { label: string; logoSrc: string }> = {
  claude: { label: 'Claude', logoSrc: BRAND_LOGOS.claude },
  dropbox: { label: 'Dropbox', logoSrc: BRAND_LOGOS.dropbox },
  evernote: { label: 'Evernote', logoSrc: BRAND_LOGOS.evernote },
  'google-drive': { label: 'Google Drive', logoSrc: BRAND_LOGOS['google-drive'] },
  icloud: { label: 'iCloud', logoSrc: BRAND_LOGOS.icloud },
  keep: { label: 'Keep', logoSrc: BRAND_LOGOS.keep },
  notion: { label: 'Notion', logoSrc: BRAND_LOGOS.notion },
  obsidian: { label: 'Obsidian', logoSrc: BRAND_LOGOS.obsidian },
  onedrive: { label: 'OneDrive', logoSrc: BRAND_LOGOS.onedrive },
  openai: { label: 'OpenAI', logoSrc: BRAND_LOGOS['openai-dark'] },
};

const paragraphMiniRegular = [
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-regular)]',
  'text-[length:var(--text-paragraph-mini-regular-font-size)]',
  'leading-[var(--text-paragraph-mini-regular-line-height)]',
  'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
].join(' ');

function ApiConnection({
  brand = 'google-drive',
  forceHover = false,
  label,
  logoSrc,
  statusLabel = 'Connected',
  noteCount,
  onUnlink,
  unlinkLabel,
  onSelectFiles,
  selectFilesLabel = 'Select files',
  className,
}: ApiConnectionProps) {
  const defaults = DEFAULTS_BY_BRAND[brand];
  const resolvedLabel = label ?? defaults.label;
  const resolvedLogoSrc = logoSrc ?? defaults.logoSrc;
  const resolvedUnlinkLabel = unlinkLabel ?? `Disconnect ${resolvedLabel}`;

  /* Unlink is a distinct, opposite-intent action nested inside the row —
   * stop it from also bubbling into the row's own select-files click. */
  function handleUnlinkClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onUnlink?.(event);
  }

  /* The row itself is the select-files hit target; this nested Button
   * exists for visible/keyboard affordance — stop its click from also
   * bubbling into the row's onClick and firing onSelectFiles twice. */
  function handleSelectFilesClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onSelectFiles?.(event);
  }

  return (
    <div
      data-slot="api-connection"
      data-brand={brand}
      data-force-hover={forceHover || undefined}
      onClick={onSelectFiles}
      className={cn(
        'group/api-connection flex h-[48px] w-full max-w-[513px] cursor-pointer items-center justify-between',
        'gap-[length:var(--spacing-xs)] rounded-[length:var(--rounded-lg)] px-[length:var(--spacing-xs)]',
        'border-[length:var(--stroke-hairline)] border-solid',
        'border-[color:var(--theme-alpha-black-switch-10)]',
        'hover:bg-[color:var(--theme-alpha-black-switch-333)]',
        'data-[force-hover=true]:bg-[color:var(--theme-alpha-black-switch-333)]',
        'transition-colors duration-[var(--duration-fast)] ease-emphasized',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-[length:var(--spacing-xs)]">
        <BrandLink logoSrc={resolvedLogoSrc} label={resolvedLabel} />

        <Status label={statusLabel} />

        <IconButton
          type="button"
          variant="fade"
          size="mini"
          aria-label={resolvedUnlinkLabel}
          onClick={handleUnlinkClick}
          className="size-[length:var(--tw-raw-spacing-4)] shrink-0 p-[length:var(--spacing-3xs)]"
        >
          <UnlinkIcon />
        </IconButton>
      </div>

      <div className="flex shrink-0 items-center gap-[length:var(--spacing-xs)]">
        {noteCount != null ? (
          <p
            className={cn(
              paragraphMiniRegular,
              /* --theme-alpha-black-switch-60 directly, not --muted-foreground
               * — see Image Button's identical comment: the latter doesn't
               * re-resolve correctly on a locally-.dark-wrapped canvas. */
              'whitespace-nowrap text-[color:var(--theme-alpha-black-switch-60)]',
            )}
          >
            {noteCount} {noteCount === 1 ? 'note' : 'notes'} added
          </p>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="mini"
          onClick={handleSelectFilesClick}
        >
          {selectFilesLabel}
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}

export { ApiConnection };
