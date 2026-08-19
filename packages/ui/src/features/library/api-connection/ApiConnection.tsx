/**
 * API Connection — third-party integration row (brand mark, name,
 * connection status, unlink control, and a "Select files" action).
 *
 * Figma set: API Connections (`16456:17880` Google Drive, `16456:17949`
 * OpenAI) — nested inside Sources & notes card's "Linked" state
 * (`16456:17608`). Figma only ever shows the connected state; `connected`
 * still branches the status copy/dot color since a real integration can
 * disconnect.
 *
 * Placement: NO — Library product chrome. Stays in
 * `src/features/library/api-connection/`.
 */
'use client';

import * as React from 'react';
import { ChevronRightIcon, UnlinkIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button, IconButton } from '@/primitives/button';
import { OpenAiMark } from './assets/openai-mark';

export type ApiConnectionBrand = 'google-drive' | 'openai';

export type ApiConnectionProps = {
  /** Defaults to `'google-drive'`. */
  brand?: ApiConnectionBrand;
  /** Defaults by brand — "Google Drive" / "OpenAI". */
  name?: string;
  /** Defaults `true` — Figma only shows the connected state. */
  connected?: boolean;
  /** Overrides the connected-derived status copy. */
  statusLabel?: string;
  unlinkLabel?: string;
  onUnlink?: React.MouseEventHandler<HTMLButtonElement>;
  selectFilesLabel?: string;
  /** Renders "Select files" as a link when set, otherwise a button. */
  selectFilesHref?: string;
  onSelectFiles?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  /** Storybook / playground — lock the row's hover fill without a pointer. */
  forceHover?: boolean;
  className?: string;
};

const GOOGLE_DRIVE_LOGO = new URL(
  './assets/google-drive-logo.png',
  import.meta.url,
).href;

const BRAND_NAMES: Record<ApiConnectionBrand, string> = {
  'google-drive': 'Google Drive',
  openai: 'OpenAI',
};

const paragraphSmallMedium = [
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-medium)]',
  'text-[length:var(--text-paragraph-small-medium-font-size)]',
  'leading-[var(--text-paragraph-small-medium-line-height)]',
  'tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
].join(' ');

const paragraphMiniRegular = [
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-regular)]',
  'text-[length:var(--text-paragraph-mini-regular-font-size)]',
  'leading-[var(--text-paragraph-mini-regular-line-height)]',
  'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
].join(' ');

function BrandMark({ brand }: { brand: ApiConnectionBrand }) {
  return (
    <div
      aria-hidden
      className="flex size-[length:var(--spacing-3xl)] shrink-0 items-center justify-center p-[length:var(--spacing-2xs)]"
    >
      {brand === 'google-drive' ? (
        <img src={GOOGLE_DRIVE_LOGO} alt="" className="size-full object-contain" />
      ) : (
        <OpenAiMark className="size-full text-[color:var(--tw-raw-white)]" />
      )}
    </div>
  );
}

function ApiConnection({
  brand = 'google-drive',
  name,
  connected = true,
  statusLabel,
  unlinkLabel,
  onUnlink,
  selectFilesLabel = 'Select files',
  selectFilesHref,
  onSelectFiles,
  forceHover = false,
  className,
}: ApiConnectionProps) {
  const resolvedName = name ?? BRAND_NAMES[brand];
  const resolvedStatusLabel = statusLabel ?? (connected ? 'Connected' : 'Not connected');
  const resolvedUnlinkLabel = unlinkLabel ?? `Disconnect ${resolvedName}`;

  const selectFilesContent = (
    <>
      {selectFilesLabel}
      <ChevronRightIcon />
    </>
  );

  return (
    <div
      data-slot="api-connection"
      data-brand={brand}
      data-connected={connected || undefined}
      data-force-hover={forceHover || undefined}
      className={cn(
        'flex h-[length:var(--spacing-3xl)] w-full items-center justify-between gap-[length:var(--spacing-xs)]',
        'rounded-[length:var(--rounded-lg)] px-[length:var(--spacing-2xs)]',
        'border-[length:var(--stroke-hairline)] border-solid border-[color:var(--theme-alpha-black-switch-10)]',
        'transition-[background-color] duration-[var(--duration-fast)] ease-emphasized',
        'hover:bg-[color:var(--theme-alpha-black-switch-333)]',
        'data-[force-hover=true]:bg-[color:var(--theme-alpha-black-switch-333)]',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-[length:var(--spacing-xs)]">
        <div className="flex min-w-0 items-center gap-[length:var(--spacing-2xs)]">
          <BrandMark brand={brand} />
          <p className={cn(paragraphSmallMedium, 'whitespace-nowrap text-[color:var(--text)]')}>
            {resolvedName}
          </p>
        </div>

        <div className="flex items-center">
          <span
            aria-hidden
            className={cn(
              'size-[length:var(--spacing-xs)] rounded-[length:var(--rounded-full)]',
              connected ? 'bg-[color:var(--tw-raw-success-500)]' : 'bg-[color:var(--theme-alpha-black-switch-30)]',
            )}
          />
          <span className={cn(paragraphMiniRegular, 'ml-[length:var(--spacing-2xs)] whitespace-nowrap text-[color:var(--muted-foreground)]')}>
            {resolvedStatusLabel}
          </span>
        </div>

        <IconButton
          type="button"
          variant="fade"
          aria-label={resolvedUnlinkLabel}
          onClick={onUnlink}
          className="size-[length:var(--spacing-md)] rounded-[length:var(--rounded-lg)] p-0 [&_svg:not([class*='size-'])]:size-[length:var(--icon-xs)]"
        >
          <UnlinkIcon />
        </IconButton>
      </div>

      {selectFilesHref != null ? (
        <a
          href={selectFilesHref}
          onClick={onSelectFiles}
          data-slot="api-connection-select-files"
          className={cn(
            'inline-flex shrink-0 items-center gap-[var(--spacing-1-5)] rounded-[length:var(--rounded-lg)]',
            'h-[length:var(--spacing-xl)] px-[length:var(--spacing-2-5)] py-[length:var(--spacing-2xs)]',
            'font-[family-name:var(--font-family-body)] [font-weight:var(--font-weight-paragraph-medium)]',
            'text-[length:var(--text-paragraph-mini-medium-font-size)] leading-[var(--text-paragraph-mini-medium-line-height)]',
            'tracking-[var(--text-paragraph-mini-medium-letter-spacing)] whitespace-nowrap',
            'text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] ease-emphasized',
            'hover:text-foreground focus-visible:text-foreground',
            'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
            '[&_svg]:pointer-events-none [&_svg]:size-[length:var(--icon-xs)] [&_svg]:shrink-0 [&_svg]:text-current',
          )}
        >
          {selectFilesContent}
        </a>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="mini"
          onClick={onSelectFiles}
          data-slot="api-connection-select-files"
          className="[&>svg]:size-[length:var(--icon-xs)]"
        >
          {selectFilesContent}
        </Button>
      )}
    </div>
  );
}

export { ApiConnection };
