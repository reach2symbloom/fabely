/**
 * Fabely Hover Card primitive — Base UI Preview Card with the shadcn Hover Card
 * API (`HoverCard` / `HoverCardTrigger` / `HoverCardContent`).
 *
 * Vendor file (`src/components/ui/hover-card.tsx`) stays untouched. No dedicated
 * Figma Hover Card set — content surface follows Foundations floating panels
 * (Dialog / Dropdown family). Fill is `--popover` (same raised plate as
 * Popover); padding stays `--spacing-xs` so Hover Card reads lighter-weight.
 */

'use client';

import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react/preview-card';

import { cn } from '@/lib/utils';

function HoverCard({ ...props }: PreviewCardPrimitive.Root.Props) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({ ...props }: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

/** Floating content surface — `--popover` fill; lighter pad than Popover. */
const CONTENT_SURFACE = [
  'z-50 w-72 origin-(--transform-origin)',
  'rounded-[length:var(--radius)]',
  'border border-[color:var(--border)]',
  'bg-[color:var(--popover)] text-[color:var(--popover-foreground)]',
  'p-[var(--spacing-xs)]',
  'outline-hidden duration-100',
  'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
  '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
  'text-[length:var(--text-paragraph-small-regular-font-size)]',
  'leading-[var(--text-paragraph-small-regular-line-height)]',
  'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
  'data-[side=bottom]:slide-in-from-top-2',
  'data-[side=inline-end]:slide-in-from-left-2',
  'data-[side=inline-start]:slide-in-from-right-2',
  'data-[side=left]:slide-in-from-right-2',
  'data-[side=right]:slide-in-from-left-2',
  'data-[side=top]:slide-in-from-bottom-2',
  'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
  'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
].join(' ');

const CONTENT_SHADOW =
  'shadow-[var(--shadow-lg-black)] dark:shadow-[var(--shadow-lg-white)]';

function HoverCardContent({
  className,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  /* 0 — vendor shadcn uses 4, which skews left/right (and start/end) off the trigger. */
  alignOffset = 0,
  shadow = true,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  > & {
    /** Elevation under the panel. Default `true`; set `false` for a flat bordered card. */
    shadow?: boolean;
  }) {
  return (
    <PreviewCardPrimitive.Portal data-slot="hover-card-portal">
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          data-shadow={shadow ? undefined : 'false'}
          className={cn(CONTENT_SURFACE, shadow && CONTENT_SHADOW, className)}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
