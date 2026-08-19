/**
 * Image Button — thumbnail + copy + trailing icon action card.
 *
 * Figma set: Image buttons (`16455:16979`). The set's only variant axes
 * are Type=Import notes × Hover — `Import your manuscript`
 * (`16455:17561`) is not a second Figma variant, just an instance of the
 * same component with its text and thumbnail overridden. Modeled here as
 * a second `type` anyway (rather than requiring callers to pass three
 * literal props every time), since both are real recurring Library
 * entry points sharing one chrome.
 *
 * Placement: NO — Library product chrome. Stays in
 * `src/features/library/image-button/`.
 */
'use client';

import * as React from 'react';
import { CloudUploadIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { PressRippleLayer, usePressRipple } from '@/foundations/motion';
import { SPOT_IMAGES } from '@/foundations/images/spot-images';
import { Separator } from '@/primitives/separator';

export type ImageButtonType = 'import-notes' | 'import-manuscript';

export type ImageButtonProps = {
  /** Defaults to `'import-notes'`. */
  type?: ImageButtonType;
  /** Storybook / playground — lock hover paint without a pointer. */
  forceHover?: boolean;
  thumbnailSrc?: string;
  /** Purely decorative — the title already names the action. */
  thumbnailAlt?: string;
  title?: string;
  subtitle?: string;
  /** Renders as a link when set, otherwise a button. */
  href?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
};

const DEFAULTS_BY_TYPE: Record<
  ImageButtonType,
  { title: string; subtitle: string; thumbnailSrc: string }
> = {
  'import-notes': {
    title: 'Bring in your notes',
    subtitle: '.txt, .docx, .pdf',
    thumbnailSrc: SPOT_IMAGES['import-notes'],
  },
  'import-manuscript': {
    title: 'Import your manuscript',
    subtitle: '.txt, .docx, .pdf',
    thumbnailSrc: SPOT_IMAGES['import-manuscript'],
  },
};

/**
 * Figma bakes this as an exported SVG radial gradient
 * (`gradientTransform` scaling `r=10` to 36 in a 72×72 box, i.e. a plain
 * circle reaching the box's closest side) — reproduced as a literal CSS
 * radial-gradient with the same stops rather than shipping the SVG.
 */
const THUMBNAIL_VIGNETTE =
  'radial-gradient(circle closest-side at 50% 50%, rgba(8,11,11,0) 0%, rgba(8,11,11,0.171) 44.5%, rgba(8,11,11,0.8) 87.6%, rgba(8,11,11,1) 100%)';

const paragraphSmallRegular = [
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-regular)]',
  'text-[length:var(--text-paragraph-small-regular-font-size)]',
  'leading-[var(--text-paragraph-small-regular-line-height)]',
  'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
].join(' ');

const paragraphRegular = [
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-regular)]',
  'text-[length:var(--text-paragraph-regular-regular-font-size)]',
  'leading-[var(--text-paragraph-regular-regular-line-height)]',
  'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
].join(' ');

function ImageButton({
  type = 'import-notes',
  forceHover = false,
  thumbnailSrc,
  thumbnailAlt = '',
  title,
  subtitle,
  href,
  className,
  onClick,
}: ImageButtonProps) {
  const defaults = DEFAULTS_BY_TYPE[type];
  const resolvedTitle = title ?? defaults.title;
  const resolvedSubtitle = subtitle ?? defaults.subtitle;
  const resolvedThumbnailSrc = thumbnailSrc ?? defaults.thumbnailSrc;

  const { ripples, spawnRipple, dismissRipple } = usePressRipple();

  function handleClick(
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) {
    spawnRipple(event);
    onClick?.(event);
  }

  const rootClassName = cn(
    'group/image-button relative flex w-full max-w-[292.5px] items-center',
    'gap-[length:var(--spacing-xs)] overflow-hidden rounded-[length:var(--rounded-lg)]',
    'pr-[length:var(--spacing-md)]',
    'border-[length:var(--stroke-hairline)] border-solid',
    'border-[color:var(--theme-alpha-black-switch-10)]',
    'hover:border-[color:var(--theme-alpha-black-switch-15)]',
    'hover:bg-[color:var(--theme-alpha-black-switch-333)]',
    'data-[force-hover=true]:border-[color:var(--theme-alpha-black-switch-15)]',
    'data-[force-hover=true]:bg-[color:var(--theme-alpha-black-switch-333)]',
    'transition-[border-color,background-color] duration-[var(--duration-fast)] ease-emphasized',
    'text-left outline-none cursor-pointer',
    'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
    className,
  );

  const body = (
    <>
      <PressRippleLayer
        ripples={ripples}
        onDismiss={dismissRipple}
        dataSlot="image-button-ripple-layer"
      />

      <div className="relative z-10 flex h-full items-center self-stretch">
        {/* 72px — falls between --tw-raw-spacing-14 (56) and -16 (64); not a spacing token. */}
        <div className="relative size-[72px] shrink-0">
          <img
            src={resolvedThumbnailSrc}
            alt={thumbnailAlt}
            className="absolute inset-0 size-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: THUMBNAIL_VIGNETTE }}
          />
        </div>
        <div className="flex h-full items-center px-[length:var(--spacing-3xs)]">
          <Separator orientation="vertical" size="thin" spacing="none" className="h-full" />
        </div>
      </div>

      <div className="relative z-10 flex min-w-0 flex-1 items-center justify-between gap-[length:var(--spacing-xs)]">
        <div className="flex min-w-0 flex-col items-start gap-[length:var(--spacing-2xs)]">
          <p
            className={cn(
              paragraphSmallRegular,
              'whitespace-nowrap text-[color:var(--theme-alpha-black-switch-75)]',
            )}
          >
            {resolvedTitle}
          </p>
          <p
            className={cn(
              paragraphRegular,
              /* --theme-alpha-black-switch-60 directly, not --muted-foreground:
               * the latter is declared once at :root as var(--theme-alpha-black-switch-60)
               * with no redeclaration inside .dark, so a locally-.dark-wrapped
               * canvas (Storybook's LibraryCanvas) inherits the resolved
               * :root (light/black-based) value instead of re-resolving
               * against its own .dark scope — renders near-invisible on
               * this black surface. Referencing the switch token directly
               * re-resolves fresh at the point of use, matching Library
               * List Item's meta-text precedent. */
              'whitespace-nowrap text-[color:var(--theme-alpha-black-switch-60)]',
            )}
          >
            {resolvedSubtitle}
          </p>
        </div>
        <CloudUploadIcon
          aria-hidden
          className={cn(
            'size-[length:var(--icon-lg)] shrink-0 text-[color:var(--tw-raw-white)]',
            'opacity-50 transition-opacity duration-[var(--duration-fast)] ease-emphasized',
            'group-hover/image-button:opacity-100',
            'group-data-[force-hover=true]/image-button:opacity-100',
          )}
        />
      </div>
    </>
  );

  if (href != null) {
    return (
      <a
        href={href}
        data-slot="image-button"
        data-type={type}
        data-force-hover={forceHover || undefined}
        className={rootClassName}
        aria-label={resolvedTitle}
        onClick={handleClick}
      >
        {body}
      </a>
    );
  }

  return (
    <button
      type="button"
      data-slot="image-button"
      data-type={type}
      data-force-hover={forceHover || undefined}
      className={rootClassName}
      aria-label={resolvedTitle}
      onClick={handleClick}
    >
      {body}
    </button>
  );
}

export { ImageButton };
