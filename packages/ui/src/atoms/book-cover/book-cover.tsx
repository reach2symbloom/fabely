/**
 * Book Cover — portrait cover art with an optional hover/focus edit affordance.
 *
 * Placement: YES — reusable manuscript chrome (menus, library cards, shelves).
 * Lives in `src/atoms/book-cover/`.
 *
 * Overlap: Aspect Ratio is a ratio lock only; Empty Media is a slot frame.
 * Edit control composes Icon Button. Default edit opens the OS image picker;
 * pass `editHref` to navigate instead.
 */

'use client';

import * as React from 'react';
import { SquarePenIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  IconButton,
  iconButtonVariants,
  type IconButtonSize,
} from '@/primitives/button';

/** Figma Chapter Menu Header cover crop (1023×1537). */
export const BOOK_COVER_ASPECT = 1023 / 1537;

/** Default OS file-picker filter for cover uploads. */
export const BOOK_COVER_ACCEPT = 'image/*,.png,.jpg,.jpeg,.webp,.gif';

export type BookCoverSize = 'sm' | 'md' | 'lg';

export type BookCoverProps = {
  /** Cover image URL. Omit for empty placeholder. */
  src?: string;
  /** Required when `src` is set. */
  alt?: string;
  /**
   * Size axis — height-driven so width follows `BOOK_COVER_ASPECT`.
   * `sm` is `--tw-raw-spacing-40` (160) — Chapter Menu Header chrome,
   * one step under `md` (192).
   */
  size?: BookCoverSize;
  /**
   * When true (default), hover and focus reveal an edit scrim.
   * Pass `false` for a static display cover.
   */
  editable?: boolean;
  /**
   * Opt into navigation instead of the OS file picker.
   * When unset, edit opens the system image chooser.
   */
  editHref?: string;
  /**
   * Called when the user picks an image via the OS file picker.
   * Ignored when `editHref` is set.
   */
  onImageSelect?: (file: File) => void;
  /** `accept` for the hidden file input. */
  accept?: string;
  /** Accessible name for the Icon Button. */
  editLabel?: string;
  className?: string;
};

/**
 * Height-driven sizes. Width follows `BOOK_COVER_ASPECT`.
 * `sm` is one step under `md` (160 vs 192) — Chapter Menu Header cover.
 */
const SIZE_HEIGHT: Record<BookCoverSize, string> = {
  sm: 'h-[length:var(--tw-raw-spacing-40)]',
  md: 'h-[length:var(--tw-raw-spacing-48)]',
  lg: 'h-[length:var(--tw-raw-spacing-60)]',
};

const ICON_SIZE: Record<BookCoverSize, IconButtonSize> = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
};

const frameChrome = [
  'group/book-cover relative box-border inline-block shrink-0 overflow-hidden',
  'aspect-[1023/1537] w-auto',
  'rounded-[length:var(--rounded-sm)]',
  'border-[length:var(--stroke-regular)] border-solid',
  'border-[color:var(--theme-alpha-black-switch-10)]',
  'transition-[border-color] duration-fast ease-emphasized',
  'hover:border-[color:var(--theme-alpha-black-switch-25)]',
  'focus-within:border-[color:var(--theme-alpha-black-switch-25)]',
  'shadow-[var(--shadow-md-black)]',
].join(' ');

const scrimReveal = [
  'opacity-0 transition-opacity',
  'duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
  'group-hover/book-cover:opacity-100',
  'group-focus-within/book-cover:opacity-100',
].join(' ');

function CoverMedia({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          'absolute inset-0 size-full object-cover',
          'transition-transform duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
          'group-hover/book-cover:scale-[1.03]',
          'group-focus-within/book-cover:scale-[1.03]',
          'motion-reduce:transition-none',
          'motion-reduce:group-hover/book-cover:scale-100',
          'motion-reduce:group-focus-within/book-cover:scale-100',
        )}
      />
    );
  }

  return (
    <div
      aria-hidden
      className="absolute inset-0 size-full bg-[color:var(--theme-alpha-black-switch-10)]"
    />
  );
}

function BookCover({
  src,
  alt = '',
  size = 'sm',
  editable = true,
  editHref,
  onImageSelect,
  accept = BOOK_COVER_ACCEPT,
  editLabel = 'Change cover',
  className,
}: BookCoverProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const useFilePicker = editHref == null;

  const openFilePicker = () => {
    const input = inputRef.current;
    if (!input) return;
    /* Allow re-selecting the same file. */
    input.value = '';
    input.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onImageSelect?.(file);
  };

  return (
    <div
      data-slot="book-cover"
      data-editable={editable ? '' : undefined}
      className={cn(frameChrome, SIZE_HEIGHT[size], className)}
    >
      <CoverMedia src={src} alt={src ? alt : ''} />

      {editable ? (
        <>
          {useFilePicker ? (
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={handleFileChange}
            />
          ) : null}

          <div
            aria-hidden
            data-slot="book-cover-edit-scrim"
            className={cn(
              'pointer-events-none absolute inset-0 z-10',
              'bg-[color:var(--theme-alpha-black-no-switch-50)]',
              scrimReveal,
            )}
          />
          <div
            className={cn(
              'pointer-events-none absolute inset-0 z-20 flex items-center justify-center',
              scrimReveal,
            )}
          >
            <span className="pointer-events-auto">
              {editHref != null ? (
                <a
                  href={editHref}
                  aria-label={editLabel}
                  className={iconButtonVariants({
                    variant: 'ghost',
                    size: ICON_SIZE[size],
                  })}
                >
                  <SquarePenIcon aria-hidden />
                </a>
              ) : (
                <IconButton
                  variant="ghost"
                  size={ICON_SIZE[size]}
                  aria-label={editLabel}
                  onClick={openFilePicker}
                >
                  <SquarePenIcon aria-hidden />
                </IconButton>
              )}
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
}

export { BookCover };
