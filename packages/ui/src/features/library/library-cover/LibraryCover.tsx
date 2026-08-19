/**
 * Library Cover — hero-scale manuscript cover with an empty-state "Untitled"
 * placeholder and a click/drag-to-upload interaction.
 *
 * Figma set: Cover (`16463:702`). Axes are Hover × Art (Art = whether cover
 * art has been uploaded yet). `art` here is derived from `src` — no separate
 * boolean prop — same rule Book Cover already uses for its own placeholder.
 *
 * Placement: NO — Library product chrome. Stays in
 * `src/features/library/library-cover/`.
 */
'use client';

import * as React from 'react';
import { BookImageIcon, ImageIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { BOOK_COVER_ACCEPT } from '@/atoms/book-cover';
import { IconButton } from '@/primitives/button';

import { CoverDividerOrnament } from './assets/cover-divider-ornament';

export type LibraryCoverProps = {
  /** Cover image URL. Omit for the empty "Untitled" placeholder state. */
  src?: string;
  /** Required when `src` is set. */
  alt?: string;
  /** Storybook / playground — lock hover paint without a pointer. */
  forceHover?: boolean;
  /** Empty-state heading. Defaults to Figma's placeholder copy. */
  title?: string;
  /** Empty-state tagline under the title. */
  tagline?: string;
  /** Empty-state byline — rendered as "by {authorLabel}". */
  authorLabel?: string;
  /** Empty-state upload button label. */
  uploadLabel?: string;
  /** Filled-state hover heading. */
  editLabel?: string;
  /** Filled-state hover subtext. */
  dragLabel?: string;
  /** Called with the chosen file — from the OS picker or a drop. */
  onImageSelect?: (file: File) => void;
  /** `accept` for the hidden file input. */
  accept?: string;
  className?: string;
};

/** Figma Cover frame (`16463:700`) — 553×830, not Book Cover's 1023/1537 crop. */
export const LIBRARY_COVER_WIDTH = 553;
export const LIBRARY_COVER_HEIGHT = 830;

const FABELY_SIGIL = new URL('./assets/fabely-sigil.png', import.meta.url).href;

const heading1 = [
  'font-[family-name:var(--text-heading-1-font-family)]',
  '[font-weight:var(--text-heading-1-font-weight)]',
  'text-[length:var(--text-heading-1-font-size)]',
  'leading-[var(--text-heading-1-line-height)]',
  'tracking-[var(--text-heading-1-letter-spacing)]',
].join(' ');

const paragraphSerifRegular = [
  'font-[family-name:var(--text-paragraph-serif-regular-font-family)]',
  '[font-weight:var(--text-paragraph-serif-regular-font-weight)]',
  'text-[length:var(--text-paragraph-serif-regular-font-size)]',
  'leading-[var(--text-paragraph-serif-regular-line-height)]',
  'tracking-[var(--text-paragraph-serif-regular-letter-spacing)]',
].join(' ');

const heading3 = [
  'font-[family-name:var(--text-heading-3-font-family)]',
  '[font-weight:var(--text-heading-3-font-weight)]',
  'text-[length:var(--text-heading-3-font-size)]',
  'leading-[var(--text-heading-3-line-height)]',
  'tracking-[var(--text-heading-3-letter-spacing)]',
].join(' ');

const paragraphXxlRegular = [
  'font-[family-name:var(--text-paragraph-xxl-regular-font-family)]',
  '[font-weight:var(--text-paragraph-xxl-regular-font-weight)]',
  'text-[length:var(--text-paragraph-xxl-regular-font-size)]',
  'leading-[var(--text-paragraph-xxl-regular-line-height)]',
  'tracking-[var(--text-paragraph-xxl-regular-letter-spacing)]',
].join(' ');

const paragraphRegularMedium = [
  'font-[family-name:var(--text-paragraph-regular-medium-font-family)]',
  '[font-weight:var(--text-paragraph-regular-medium-font-weight)]',
  'text-[length:var(--text-paragraph-regular-medium-font-size)]',
  'leading-[var(--text-paragraph-regular-medium-line-height)]',
  'tracking-[var(--text-paragraph-regular-medium-letter-spacing)]',
].join(' ');

/**
 * Figma unbound fills (`#0C1012` rest / `#0F1517` hover) mixed from
 * tw-raw black + white so the token guard stays clean.
 */
const EMPTY_FILL =
  'bg-[color:color-mix(in_srgb,var(--tw-raw-white)_2%,var(--tw-raw-black))]';
const EMPTY_FILL_HOVER = [
  'group-hover/library-cover:bg-[color:color-mix(in_srgb,var(--tw-raw-white)_4%,var(--tw-raw-black))]',
  'group-data-[force-hover=true]/library-cover:bg-[color:color-mix(in_srgb,var(--tw-raw-white)_4%,var(--tw-raw-black))]',
].join(' ');

/**
 * Empty rest (`16463:700`) / hover (`16463:701`) — two drop shadows.
 * Geometry matches the inspector (`0 20 59 / -17` + `0 13 32 / -8`); both
 * layers are black. The inspector lists the outer layer as white 20%, but
 * on the Library page (`16428:12467`) the shadow reads fully dark with no
 * light bloom — same polarity as the inner black 80% layer.
 */
const EMPTY_SHADOW = [
  '0px 20px 59px -17px var(--theme-alpha-black-no-switch-20)',
  '0px 13px 32px -8px var(--theme-alpha-black-no-switch-80)',
].join(', ');

const ART_HOVER_SHADOW = [
  '0px 0px 36px 0px color-mix(in srgb, var(--tw-raw-black) 32%, transparent)',
  '0px 20px 59px -16px color-mix(in srgb, var(--tw-raw-neutral-600) 30%, transparent)',
].join(', ');

/**
 * Empty rest (`16463:700`) and empty hover (`16463:701`) share the same
 * Noise effect: Mono, size 1.5×1.5, density 100%, `#000000` @ 25%.
 * `userSpaceOnUse` + `baseFrequency = 1 / 1.5` so the grain is 1.5px.
 */
function CoverGrain() {
  const reactId = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const filterId = `library-cover-grain-${reactId}`;
  const frequency = 1 / 1.5;

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 size-full"
    >
      <filter
        id={filterId}
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        filterUnits="userSpaceOnUse"
        primitiveUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency={`${frequency} ${frequency}`}
          numOctaves="1"
          seed="1"
          stitchTiles="stitch"
          result="noise"
        />
        {/* R → alpha, RGB black, alpha scaled to Figma's 25%. */}
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.25 0 0 0 0"
          in="noise"
        />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}

/** Empty rest — 8px inside stroke on the left only (`#242829`). */
function CoverLeftSpine() {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-y-0 left-0 z-20 w-[8px]',
        'rounded-l-[length:var(--rounded-md)]',
        'bg-[color:color-mix(in_srgb,var(--tw-raw-white)_12%,var(--tw-raw-black))]',
        'group-hover/library-cover:hidden',
        'group-data-[force-hover=true]/library-cover:hidden',
      )}
    />
  );
}

/**
 * Empty hover (`16463:701`) — 2px inside dashed stroke, dash 8/8,
 * `--tw-raw-secondary-200`. SVG so the dash array is exact (CSS
 * `border-style: dashed` is UA-defined).
 */
function CoverHoverRing() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 553 830"
      preserveAspectRatio="none"
      className={cn(
        'pointer-events-none absolute inset-0 z-30 size-full',
        'text-[color:var(--tw-raw-secondary-200)] opacity-0',
        'group-hover/library-cover:opacity-100',
        'group-data-[force-hover=true]/library-cover:opacity-100',
      )}
    >
      <rect
        x="1"
        y="1"
        width="551"
        height="828"
        rx="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="8 8"
      />
    </svg>
  );
}

/**
 * Empty hover (`16463:701`) second fill — Figma Nebula shader @ 20%
 * (starDensity 0.1, brightness 0.8, center 50/50, default colorA/B/C).
 * Not the Noise effect; that stays in `CoverGrain` and is identical to rest.
 */
function CoverHoverShader() {
  const reactId = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const starsFineId = `library-cover-stars-fine-${reactId}`;
  const starsCoarseId = `library-cover-stars-coarse-${reactId}`;

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 z-10 mix-blend-screen opacity-0',
        'transition-opacity duration-[var(--duration-fast)] ease-emphasized',
        'group-hover/library-cover:opacity-20',
        'group-data-[force-hover=true]/library-cover:opacity-20',
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'radial-gradient(ellipse 80% 55% at 50% 50%, color-mix(in srgb, var(--tw-raw-secondary-400) 45%, transparent), transparent 72%)',
            'radial-gradient(ellipse 55% 40% at 32% 58%, color-mix(in srgb, var(--tw-raw-blue-messaging-500) 35%, transparent), transparent 70%)',
            'radial-gradient(ellipse 50% 38% at 68% 42%, color-mix(in srgb, var(--tw-raw-pantones-blush) 30%, transparent), transparent 68%)',
          ].join(', '),
        }}
      />
      <svg className="absolute inset-0 size-full">
        <filter
          id={starsFineId}
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="1"
            seed="2"
            stitchTiles="stitch"
          />
          {/* Sparse white dots — Nebula starDensity 0.1 keeps ~1% of cells. */}
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 28 -27"
          />
        </filter>
        <filter
          id={starsCoarseId}
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.28"
            numOctaves="1"
            seed="7"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 32 -31"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${starsFineId})`} />
        <rect width="100%" height="100%" filter={`url(#${starsCoarseId})`} />
      </svg>
    </div>
  );
}

/**
 * Pointer-follow hover from Library List Item: ambient radial + glass
 * edge highlight. Same white/`--tw-raw-white` color-mix recipe; ambient
 * radius is 640px so it still sits past this 553px face (list item used
 * 260px past its ~325px row). Reveal is group-hover on the cover, never
 * on these layers (`pointer-events-none`).
 */
function CoverCursorGlow() {
  return (
    <>
      <div
        aria-hidden
        data-slot="library-cover-glow"
        className={cn(
          'pointer-events-none absolute inset-0 z-[15] overflow-hidden rounded-[inherit] opacity-0',
          'transition-opacity duration-[var(--duration-fast)] ease-emphasized motion-reduce:transition-none',
          'group-hover/library-cover:opacity-100',
          'group-data-[force-hover=true]/library-cover:opacity-100',
        )}
        style={{
          background:
            'radial-gradient(circle 640px at var(--glow-x, 50%) var(--glow-y, 50%), color-mix(in srgb, var(--tw-raw-white) 4.5%, transparent) 0%, color-mix(in srgb, var(--tw-raw-white) 2.5%, transparent) 30%, color-mix(in srgb, var(--tw-raw-white) 1%, transparent) 60%, transparent 100%)',
        }}
      />
      <div
        aria-hidden
        data-slot="library-cover-edge-highlight"
        className={cn(
          'pointer-events-none absolute inset-0 z-[15] rounded-[inherit] opacity-0',
          'border-[length:var(--stroke-thin)] border-solid border-transparent',
          '[mask:linear-gradient(black_0_0)_padding-box_exclude,linear-gradient(black_0_0)]',
          'transition-opacity duration-[var(--duration-fast)] ease-emphasized motion-reduce:transition-none',
          'group-hover/library-cover:opacity-100',
          'group-data-[force-hover=true]/library-cover:opacity-100',
        )}
        style={{
          background:
            'radial-gradient(circle 90px at var(--glow-x, 50%) var(--glow-y, 50%), color-mix(in srgb, var(--tw-raw-white) 45%, transparent) 0%, color-mix(in srgb, var(--tw-raw-white) 12%, transparent) 50%, transparent 85%) border-box',
        }}
      />
    </>
  );
}

function LibraryCover({
  src,
  alt = '',
  forceHover = false,
  title = 'Untitled',
  tagline = 'Every story begins unwritten',
  authorLabel = 'Christian Davis',
  uploadLabel = 'Upload cover art',
  editLabel = 'Edit cover art',
  dragLabel = 'Drag or click to upload',
  onImageSelect,
  accept = BOOK_COVER_ACCEPT,
  className,
}: LibraryCoverProps) {
  const hasArt = src != null;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = React.useState(false);
  const showHoverChrome = forceHover || isDragActive;

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

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    setIsDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onImageSelect?.(file);
  };

  const dropShadow =
    hasArt && showHoverChrome ? ART_HOVER_SHADOW : EMPTY_SHADOW;

  /**
   * Cursor glow — position only, no re-render. Set on the wrapper so both
   * empty and uploaded faces inherit `--glow-x` / `--glow-y`. Same
   * pointermove pattern as Library List Item.
   */
  function updateGlowPosition(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--glow-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--glow-y', `${event.clientY - bounds.top}px`);
  }

  return (
    <div
      data-slot="library-cover"
      data-has-art={hasArt ? '' : undefined}
      data-force-hover={showHoverChrome || undefined}
      onPointerMove={updateGlowPosition}
      onPointerEnter={updateGlowPosition}
      className={cn(
        'group/library-cover relative isolate w-[553px] shrink-0',
        'rounded-[length:var(--rounded-md)]',
        'focus-within:[box-shadow:var(--effect-focus-ring-secondary),var(--library-cover-shadow)]',
        className,
      )}
      style={
        {
          '--library-cover-shadow': dropShadow,
          boxShadow: dropShadow,
        } as React.CSSProperties
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={handleFileChange}
      />

      {hasArt ? (
        <div
          className={cn(
            'relative isolate flex h-[830px] w-full cursor-pointer flex-col items-center justify-center',
            'overflow-hidden rounded-[length:var(--rounded-md)]',
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Card click / drop — not in tab order; Icon Button owns the name. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={openFilePicker}
            className="absolute inset-0 z-0 cursor-pointer"
          />
            <img
              src={src}
              alt={alt}
              className="pointer-events-none absolute inset-0 size-full object-cover"
            />
            <CoverHoverRing />
            <div
              aria-hidden
              className={cn(
                'pointer-events-none absolute inset-0 z-10 rounded-[inherit]',
                'border-[length:var(--stroke-thin)] border-solid',
                'border-[color:var(--theme-alpha-black-no-switch-10)]',
                'group-hover/library-cover:border-transparent',
                'group-data-[force-hover=true]/library-cover:border-transparent',
                'group-focus-within/library-cover:border-transparent',
              )}
            />
            <div
              aria-hidden
              className={cn(
                'pointer-events-none absolute inset-0 z-10 rounded-[inherit]',
                'bg-[color:var(--theme-alpha-black-no-switch-80)] opacity-0',
                'transition-opacity duration-[var(--duration-fast)] ease-emphasized',
                'group-hover/library-cover:opacity-100',
                'group-data-[force-hover=true]/library-cover:opacity-100',
                'group-focus-within/library-cover:opacity-100',
              )}
            />
            <CoverCursorGlow />
            <div
              className={cn(
                'pointer-events-none relative z-20 flex h-full flex-col items-center justify-center',
                'gap-[length:var(--spacing-2xs)] opacity-0',
                'transition-opacity duration-[var(--duration-fast)] ease-emphasized',
                'group-hover/library-cover:opacity-100',
                'group-data-[force-hover=true]/library-cover:opacity-100',
                'group-focus-within/library-cover:opacity-100',
              )}
            >
              <IconButton
                type="button"
                variant="glow"
                size="lg"
                roundness="round"
                aria-label={`${editLabel}: ${title}`}
                onClick={openFilePicker}
                className={cn(
                  /* Same 56px face override as Resume Writing Button's go-control. */
                  'relative z-20 mb-[length:var(--spacing-sm)] size-[length:var(--tw-raw-spacing-14)]',
                  'overflow-visible',
                  /*
                   * Glow's built-in `group-hover` is unnamed (Resume Writing's
                   * root is `group`). Cover chrome is `group/library-cover`,
                   * so re-bind the same 12px halo + 125% glyph here.
                   */
                  'group-hover/library-cover:drop-shadow-[0_0_12px_color-mix(in_srgb,var(--tw-raw-pantones-lavendar)_40%,transparent)]',
                  'group-data-[force-hover=true]/library-cover:drop-shadow-[0_0_12px_color-mix(in_srgb,var(--tw-raw-pantones-lavendar)_40%,transparent)]',
                  'group-focus-within/library-cover:drop-shadow-[0_0_12px_color-mix(in_srgb,var(--tw-raw-pantones-lavendar)_40%,transparent)]',
                  'group-hover/library-cover:[&_svg]:scale-125',
                  'group-data-[force-hover=true]/library-cover:[&_svg]:scale-125',
                  'group-focus-within/library-cover:[&_svg]:scale-125',
                  '[&_svg]:duration-[var(--duration-fast)]',
                  'pointer-events-none',
                  'group-hover/library-cover:pointer-events-auto',
                  'group-data-[force-hover=true]/library-cover:pointer-events-auto',
                  'group-focus-within/library-cover:pointer-events-auto',
                )}
              >
                <BookImageIcon />
              </IconButton>
              <p
                aria-hidden
                className={cn(paragraphXxlRegular, 'text-[color:var(--text)]')}
              >
                {editLabel}
              </p>
              <p
                aria-hidden
                className={cn(
                  paragraphRegularMedium,
                  'text-[color:var(--theme-alpha-white-no-switch-75)]',
                )}
              >
                {dragLabel}
              </p>
            </div>
        </div>
      ) : (
        <div
          className={cn(
            'relative isolate flex h-[830px] w-full cursor-pointer flex-col items-center',
            'overflow-hidden rounded-[length:var(--rounded-md)]',
            EMPTY_FILL,
            EMPTY_FILL_HOVER,
            'justify-between gap-[length:var(--spacing-5xl)] px-[length:var(--spacing-4xl)]',
            /* Figma pt-72 / pb-88 — not on the spacing scale; composed. */
            'pt-[length:calc(var(--spacing-5xl)+var(--spacing-xs))]',
            'pb-[length:calc(var(--spacing-6xl)+var(--spacing-xs))]',
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Card click / drop — not in tab order; the pill is the named control. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={openFilePicker}
            className="absolute inset-0 z-0 cursor-pointer"
          />

            <CoverGrain />
            <CoverHoverShader />
            <CoverCursorGlow />
            <CoverLeftSpine />
            <CoverHoverRing />

            <img
              src={FABELY_SIGIL}
              alt=""
              aria-hidden
              width={91}
              height={114}
              className="pointer-events-none relative h-[114px] w-[91px] shrink-0 object-contain"
            />

            <div className="pointer-events-none relative flex w-full flex-col items-center gap-[length:var(--spacing-xs)]">
              <p className={cn(heading1, 'text-center text-[color:var(--text)]')}>
                {title}
              </p>
              <p
                className={cn(
                  paragraphSerifRegular,
                  'text-center text-[color:var(--text)]',
                )}
              >
                {tagline}
              </p>
              <CoverDividerOrnament className="h-[66px] w-[250px] text-[color:var(--text)]" />
            </div>

            <div
              className={cn(
                heading3,
                'pointer-events-none relative flex flex-col items-center gap-[length:var(--spacing-2xs)] text-center text-[color:var(--text)]',
              )}
            >
              <p>by</p>
              <p>{authorLabel}</p>
            </div>

            <button
              type="button"
              onClick={openFilePicker}
              className={cn(
                'group/upload-cover relative z-40 flex h-[length:var(--spacing-13)] w-[249px]',
                'cursor-pointer items-center justify-center gap-[length:var(--spacing-xs)]',
                'rounded-[length:var(--rounded-lg)] px-[length:var(--spacing-xl)] outline-none',
                'border-[length:var(--stroke-thin)] border-solid border-[color:var(--theme-alpha-black-switch-10)]',
                /* Inherit the card fill so grain (z-10) doesn't show through
                   the transparent pill. Hover is the pill's own, not the card's. */
                'bg-inherit',
                'hover:[background-image:linear-gradient(var(--theme-alpha-black-switch-5),var(--theme-alpha-black-switch-5))]',
                'focus-visible:[background-image:linear-gradient(var(--theme-alpha-black-switch-5),var(--theme-alpha-black-switch-5))]',
                'transition-[background-color,color] duration-[var(--duration-fast)] ease-emphasized',
              )}
            >
              <ImageIcon
                aria-hidden
                className={cn(
                  'size-[length:var(--icon-sm)] text-[color:var(--text)] opacity-50',
                  'transition-opacity duration-[var(--duration-fast)] ease-emphasized',
                  'group-hover/upload-cover:opacity-100',
                  'group-focus-visible/upload-cover:opacity-100',
                )}
              />
              <span
                className={cn(
                  paragraphRegularMedium,
                  'whitespace-nowrap text-[color:var(--text)]',
                  'group-hover/upload-cover:text-[color:var(--secondary-foreground)]',
                  'group-focus-visible/upload-cover:text-[color:var(--secondary-foreground)]',
                )}
              >
                {uploadLabel}
              </span>
            </button>
        </div>
      )}
    </div>
  );
}

export { LibraryCover };
