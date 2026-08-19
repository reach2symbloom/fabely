/**
 * Sources & notes card — Library entry point for bringing in notes, an
 * existing draft, or a linked integration's files.
 *
 * Figma set: Sources & notes card (`16456:17608`). Axis is Linked
 * (`16455:17604` False / `16456:17609` True) — mapped to whether
 * `connections` is a non-empty array, not a separate boolean: the
 * Connections section's content *is* the connections list, so an empty
 * array and "hide the section" are the same state.
 *
 * The button row is not in the Figma axes (Figma only shows both Image
 * Buttons side by side) but is a real product need: `@container` query
 * (not a viewport breakpoint — this card can sit in a narrow sidebar
 * regardless of viewport width) stacks Import manuscript below Bring in
 * your notes once the card itself gets too narrow for both at their
 * natural width, and `showManuscriptButton` lets a caller that doesn't
 * offer manuscript import (e.g. a fresh project) suppress it entirely.
 *
 * Placement: NO — Library product chrome. Stays in
 * `src/features/library/sources-notes-card/`.
 */
'use client';

import * as React from 'react';
import { CloudUploadIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ApiConnection, type ApiConnectionProps } from '../api-connections';
import { ImageButton, type ImageButtonProps } from '../image-button';

export type SourcesNotesCardConnection = ApiConnectionProps & {
  /** React list key — falls back to `brand` when omitted. */
  key?: string;
};

export type SourcesNotesCardProps = {
  heading?: string;
  description?: string;

  /** Passed through to the "Bring in your notes" Image Button. */
  notesButtonProps?: Partial<ImageButtonProps>;
  /** Passed through to the "Import your manuscript" Image Button. */
  manuscriptButtonProps?: Partial<ImageButtonProps>;
  /** Default `true`. `false` hides "Import your manuscript" entirely. */
  showManuscriptButton?: boolean;

  /** Non-empty renders the Connections section — Figma's "Linked" state. */
  connections?: SourcesNotesCardConnection[];
  connectionsHeading?: string;

  className?: string;
};

const caption = [
  'font-[family-name:var(--text-caption-sm-font-family)]',
  '[font-weight:var(--text-caption-sm-font-weight)]',
  'text-[length:var(--text-caption-sm-font-size)]',
  'leading-[var(--text-caption-sm-line-height)]',
  'tracking-[length:var(--text-caption-sm-letter-spacing)]',
  'uppercase',
].join(' ');

const paragraphRegular = [
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-regular)]',
  'text-[length:var(--text-paragraph-regular-regular-font-size)]',
  'leading-[var(--text-paragraph-regular-regular-line-height)]',
  'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
].join(' ');

function SourcesNotesCard({
  heading = 'Sources & notes',
  description = 'Bring in notes, research, or an existing draft.',
  notesButtonProps,
  manuscriptButtonProps,
  showManuscriptButton = true,
  connections = [],
  connectionsHeading = 'Connections',
  className,
}: SourcesNotesCardProps) {
  const isLinked = connections.length > 0;

  return (
    <div
      data-slot="sources-notes-card"
      data-linked={isLinked || undefined}
      className={cn(
        '@container/sources-notes-card',
        'flex w-full max-w-[633px] flex-col items-start justify-center gap-[length:var(--spacing-md)]',
        'rounded-[length:var(--rounded-xl)] p-[length:var(--spacing-md)]',
        'border-[length:var(--stroke-hairline)] border-solid border-[color:var(--theme-alpha-black-switch-10)]',
        className,
      )}
    >
      <div
        data-slot="sources-notes-card-header"
        className="flex w-full flex-col items-start gap-[length:var(--spacing-xs)]"
      >
        <div className="flex items-center gap-[length:var(--spacing-xs)]">
          <CloudUploadIcon
            aria-hidden
            /* --theme-alpha-black-switch-60 directly, not --muted-foreground
             * — the latter doesn't re-resolve on a locally-.dark-wrapped
             * canvas (e.g. this component's own Storybook LibraryCanvas);
             * see Image Button / API Connection for the full explanation. */
            className="size-[length:var(--icon-sm)] text-[color:var(--theme-alpha-black-switch-60)]"
          />
          <p className={cn(caption, 'whitespace-nowrap text-[color:var(--theme-alpha-black-switch-60)]')}>
            {heading}
          </p>
        </div>
        <p className={cn(paragraphRegular, 'w-full text-[color:var(--text)]')}>{description}</p>
      </div>

      <div
        data-slot="sources-notes-card-buttons"
        className="flex w-full flex-col items-stretch gap-[length:var(--spacing-md)] @lg/sources-notes-card:flex-row @lg/sources-notes-card:items-center"
      >
        <ImageButton
          type="import-notes"
          className="max-w-none flex-1"
          {...notesButtonProps}
        />
        {showManuscriptButton ? (
          <ImageButton
            type="import-manuscript"
            className="max-w-none flex-1"
            {...manuscriptButtonProps}
          />
        ) : null}
      </div>

      {isLinked ? (
        <div
          data-slot="sources-notes-card-connections"
          className="flex w-full flex-col items-start gap-[length:var(--spacing-xs)] pt-[length:var(--spacing-xs)]"
        >
          <p className={cn(caption, 'whitespace-nowrap text-[color:var(--theme-alpha-black-switch-60)]')}>
            {connectionsHeading}
          </p>
          {connections.map(({ key, ...connection }, index) => (
            <ApiConnection key={key ?? connection.brand ?? index} {...connection} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { SourcesNotesCard };
