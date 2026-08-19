/**
 * Add Document List Item — file row with a Doc-types raster, title, and
 * an Add / Remove trailing control.
 *
 * Figma set: Add document list item (`16509:31009`). Axis is Property 1
 * (Frame 162 / Frame 163) — Add vs already-added. Mapped to `added`.
 *
 * Placement: NO — Library product chrome. Stays in
 * `src/features/library/add-document-list-item/`.
 */
'use client';

import * as React from 'react';
import { XIcon } from 'lucide-react';

import { DOC_TYPE_IMAGES, type DocTypeImage } from '@/foundations/images';
import { cn } from '@/lib/utils';
import { Button, IconButton } from '@/primitives/button';

export type AddDocumentFileType = DocTypeImage;

export type AddDocumentListItemProps = {
  /** Frame 163 — trailing control is Remove. Omit / false is Frame 162 (Add). */
  added?: boolean;
  /** Doc types set (`16509:30930`). Defaults to PDF, the Figma instance. */
  fileType?: AddDocumentFileType;
  title?: string;
  addLabel?: string;
  /** Accessible name for the Remove Icon Button. */
  removeLabel?: string;
  onAdd?: React.MouseEventHandler<HTMLButtonElement>;
  onRemove?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

const paragraphRegular = [
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-regular)]',
  'text-[length:var(--text-paragraph-regular-regular-font-size)]',
  'leading-[var(--text-paragraph-regular-regular-line-height)]',
  'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
].join(' ');

function AddDocumentListItem({
  added = false,
  fileType = 'pdf',
  title = 'The Discovery of the Eldergrove',
  addLabel = 'Add',
  removeLabel = 'Remove document',
  onAdd,
  onRemove,
  className,
}: AddDocumentListItemProps) {
  return (
    <div
      data-slot="add-document-list-item"
      data-added={added ? '' : undefined}
      data-file-type={fileType}
      className={cn(
        'flex w-full max-w-[361px] items-center justify-between',
        'gap-[length:var(--spacing-md)]',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-[length:var(--spacing-md)]">
        <img
          src={DOC_TYPE_IMAGES[fileType]}
          alt=""
          aria-hidden
          className="size-[length:var(--icon-lg)] shrink-0 object-contain"
        />
        <p
          className={cn(
            paragraphRegular,
            'min-w-0 truncate text-[color:var(--foreground)]',
          )}
        >
          {title}
        </p>
      </div>

      {added ? (
        <IconButton
          type="button"
          variant="ghost"
          size="sm"
          roundness="default"
          aria-label={removeLabel}
          onClick={onRemove}
        >
          <XIcon />
        </IconButton>
      ) : (
        <Button
          type="button"
          variant="tertiary"
          size="small"
          roundness="default"
          onClick={onAdd}
        >
          {addLabel}
        </Button>
      )}
    </div>
  );
}

export { AddDocumentListItem };
