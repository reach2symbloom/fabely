/**
 * Fabely Attachment primitive — wraps the upstream shadcn Attachment
 * (`src/components/ui/attachment.tsx`) with Foundations-sourced color,
 * radius, focus-ring, and icon-size substitutions. No Figma source exists;
 * shadcn docs are the API ground truth for documented props; Fabely renames
 * the actions slot to RightIcon (see README).
 *
 * Accordion precedent: override via `className` on wrapped vendor parts;
 * do not fork the vendor file. `AttachmentRightIcon` composes our IconButton.
 */
import * as React from 'react';
import {
  Attachment as AttachmentPrimitive,
  AttachmentMedia as AttachmentMediaPrimitive,
  AttachmentContent as AttachmentContentPrimitive,
  AttachmentDescription as AttachmentDescriptionPrimitive,
  AttachmentActions as AttachmentActionsPrimitive,
  AttachmentTitle,
  AttachmentTrigger,
  AttachmentGroup,
} from '@/components/ui/attachment';
import { cn } from '@/lib/utils';
import { IconButton } from '../button';
import type { IconButtonProps } from '../button';

/**
 * Non-error icon plate — `--theme-alpha-black-switch-333` steps away from
 * the card in both themes (black @ 3.33% in light, white @ 3.33% in dark).
 * `--muted` collides with `--card` in dark (`#27272A`), so the fill vanished.
 */
const MEDIA_NEUTRAL_FILL = 'bg-[var(--theme-alpha-black-switch-333)]';

/** Error icon plate — vendor `bg-destructive/10` → Foundations `--destructive` @ 10%. */
const MEDIA_ERROR_FILL =
  'group-data-[state=error]/attachment:bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)]';

/**
 * Root — Foundations radius `--radius` (16px) for default/sm; xs stays
 * `--rounded-md` (8px). Color + focus ring from Foundations.
 */
function Attachment({
  className,
  ...props
}: React.ComponentProps<typeof AttachmentPrimitive>) {
  return (
    <AttachmentPrimitive
      className={cn(
        'rounded-[var(--radius)]',
        'data-[size=xs]:rounded-[var(--rounded-md)]',
        'border-[length:var(--stroke-thin)] border-[color:var(--border)]',
        'bg-[var(--card)] text-[color:var(--card-foreground)]',
        'focus-within:ring-0 focus-within:shadow-[var(--effect-focus-ring-secondary)]',
        className
      )}
      {...props}
    />
  );
}

/**
 * Media — nested surface whose radius scales with size, independently of
 * the container (not a proportional inset): default `--rounded-lg` (12px),
 * sm `--rounded-md` (8px), xs `--rounded-sm` (5px — closest published step
 * to 4px; Foundations has no 4px radius). Icon fill:
 * `--theme-alpha-black-switch-333` for non-error; error keeps `--destructive`
 * @ 10%. Icon sizes from Foundations.
 */
function AttachmentMedia({
  className,
  variant = 'icon',
  ...props
}: React.ComponentProps<typeof AttachmentMediaPrimitive>) {
  return (
    <AttachmentMediaPrimitive
      variant={variant}
      className={cn(
        variant === 'icon' && MEDIA_NEUTRAL_FILL,
        variant === 'icon' && MEDIA_ERROR_FILL,
        variant === 'icon' && 'text-[color:var(--foreground)]',
        'rounded-[var(--rounded-lg)]',
        'group-data-[size=sm]/attachment:rounded-[var(--rounded-md)]',
        'group-data-[size=xs]/attachment:rounded-[var(--rounded-sm)]',
        'group-data-[state=error]/attachment:text-[color:var(--destructive)]',
        "[&_svg:not([class*='size-'])]:size-[length:var(--icon-sm)]",
        "group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-[length:var(--icon-lg)]",
        className
      )}
      {...props}
    />
  );
}

/**
 * Content — trailing padding so the filename never sits flush against the
 * container edge, with or without right icons. Matches vendor size padding
 * steps via Foundations spacing.
 */
function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<typeof AttachmentContentPrimitive>) {
  return (
    <AttachmentContentPrimitive
      className={cn(
        'pe-[var(--spacing-2-5)]',
        'group-data-[size=sm]/attachment:pe-[var(--spacing-xs)]',
        'group-data-[size=xs]/attachment:pe-[var(--spacing-1-5)]',
        className
      )}
      {...props}
    />
  );
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<typeof AttachmentDescriptionPrimitive>) {
  return (
    <AttachmentDescriptionPrimitive
      className={cn('text-[color:var(--muted-foreground)]', className)}
      {...props}
    />
  );
}

/**
 * Right-icon group (shadcn `AttachmentActions`). Gap tightened to
 * `--spacing-3xs` (2px) so adjacent circular icons read closer.
 */
function AttachmentRightIcons({
  className,
  ...props
}: React.ComponentProps<typeof AttachmentActionsPrimitive>) {
  return (
    <AttachmentActionsPrimitive
      data-slot="attachment-right-icons"
      className={cn(
        'gap-[var(--spacing-3xs)]',
        'group-data-[orientation=vertical]/attachment:gap-[var(--spacing-3xs)]',
        className
      )}
      {...props}
    />
  );
}

/**
 * Right icon button (shadcn `AttachmentAction`). Our IconButton ghost with
 * circular hover (`roundness="round"`). Default `mini` stands in for shadcn
 * `icon-xs`.
 */
function AttachmentRightIcon({
  className,
  variant = 'ghost',
  size = 'mini',
  roundness = 'round',
  ...props
}: IconButtonProps) {
  return (
    <IconButton
      data-slot="attachment-right-icon"
      variant={variant}
      size={size}
      roundness={roundness}
      className={cn(className)}
      {...props}
    />
  );
}

export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentRightIcons,
  AttachmentRightIcon,
  AttachmentTrigger,
};
