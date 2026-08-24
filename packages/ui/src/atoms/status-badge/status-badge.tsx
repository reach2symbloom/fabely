/**
 * StatusBadge — composable icon/text/status pill built on the Badge
 * primitive. Figma's own component ("Promptbar status badges", `16199:2312`)
 * exposes 17 Mode × Type × Subtype combinations, but the underlying anatomy
 * is one structure reused with different slot contents — this expresses
 * that anatomy directly (leading icon, primary text, middle icon/divider,
 * secondary text, trailing status/dismiss) rather than the Mode/Type/
 * Subtype matrix itself. Every one of Figma's 17 examples is reproducible
 * as a Storybook configuration of this one component — see
 * `status-badge.stories.tsx`'s "Figma Reference Variants" section.
 *
 * Do not add per-variant flags (`showX`, `showGlobe`, …) — new call sites
 * compose the existing slots.
 */
'use client';

import * as React from 'react';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge, type BadgeProps } from '@/primitives/badge';
import { IconButton } from '@/primitives/button';

export type StatusBadgeTone = 'neutral' | 'secondary' | 'fia';
export type StatusBadgeSize = 'compact' | 'default';

/**
 * `tone` is a narrowed, renamed alias over Badge's own `variant` — not a
 * parallel color system. Badge ships 8 variants (`destructive`/`outline`/
 * `ghost`/`alert`/`success` included) that don't correspond to anything in
 * Figma's status-badge set; exposing all of them here would reintroduce
 * the "large cross-product of invalid combinations" this atom exists to
 * avoid. `success` specifically isn't a `StatusBadge` tone — the
 * "connected" semantic already has its own dedicated place, the
 * `Status` (glyph variant) in the trailing slot, not the badge's own fill. Actual
 * color/background values stay entirely Badge's — this never duplicates
 * a CVA class.
 */
const TONE_TO_BADGE_VARIANT: Record<StatusBadgeTone, BadgeProps['variant']> = {
  neutral: 'default',
  secondary: 'secondary',
  fia: 'fia',
};

export type StatusBadgeProps = Omit<BadgeProps, 'variant' | 'size' | 'roundness' | 'children'> & {
  /** `'compact'` (~18px, Figma's plain informational badges) or `'default'`
   * (~24px, Figma's dismissible/Fia badges). Not derived from content —
   * Figma uses both heights for equally simple content, so this is an
   * explicit per-instance choice, matching the reference set. */
  size?: StatusBadgeSize;
  /** `'fia'` is reserved for workflow chips specifically (Topic map /
   * Related themes / Develop scene) — Figma does not use the Fia identity
   * color for the workflow *count* summary ("3 workflows") or any other
   * badge kind, so don't reach for it outside that one case. */
  tone?: StatusBadgeTone;
  leadingIcon?: React.ReactNode;
  /** Primary text — required, every Figma example has one. */
  children: React.ReactNode;
  /** Icon or divider between primary and secondary text — a bare "·"
   * glyph, the `Separator` primitive (vertical), or a real icon (Figma
   * uses all three across different examples). Only meaningful paired
   * with `secondaryText`. */
  middleIcon?: React.ReactNode;
  /** Truncates at Figma's own literal 100px (unbound to any variable in
   * Figma's own source either — not a Foundations gap on this atom's
   * part, there's genuinely no token for it). That 100px cap is sized for
   * scene-title/context content specifically (Figma's own examples are
   * all scene titles or excerpts) — a fixed system message (e.g. "Not
   * connected to scene") isn't that kind of content and shouldn't inherit
   * the same truncation; override via `secondaryTextClassName` for those. */
  secondaryText?: React.ReactNode;
  /** Escape hatch onto `secondaryText`'s own wrapper — e.g. clearing the
   * default `max-w-[100px] truncate` for a short fixed system message
   * that should always read in full rather than the scene-title/context
   * truncation this slot defaults to. */
  secondaryTextClassName?: string;
  /** Generic trailing slot — `Status` in its glyph variant, another Fabely icon, or
   * nothing. Ignored when `onDismiss` is set (Figma never shows both at
   * once). This *is* the "trailing/status slot" — not a separate prop per
   * trailing content type. */
  trailing?: React.ReactNode;
  /** Renders a real, accessible dismiss control (an `IconButton`, not a
   * decorative SVG with an `onClick`) in the trailing slot instead of
   * `trailing`. */
  onDismiss?: () => void;
  /** Accessible name for the dismiss control. Defaults to `"Remove"` —
   * pass something specific (`"Remove Highlight"`) once multiple similar
   * badges could coexist in the same list, matching this repo's existing
   * dismiss-label convention (see `combobox`'s chip-remove vs.
   * `bookmark-icon-button`'s object-specific labels). */
  dismissLabel?: string;
};

function StatusBadge({
  size = 'compact',
  tone = 'neutral',
  leadingIcon,
  children,
  middleIcon,
  secondaryText,
  secondaryTextClassName,
  trailing,
  onDismiss,
  dismissLabel = 'Remove',
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <Badge
      variant={TONE_TO_BADGE_VARIANT[tone]}
      roundness="default"
      className={cn(
        // Badge's own `size`/`roundness` compound variants only pair a
        // 24px height with `roundness="round"` (a pill) — Figma's 24px
        // badges keep the same 5px `rounded-sm` corners as its 18px ones.
        // Overriding just the height (to an existing token) rather than
        // using `roundness="round"` keeps the corners Figma-correct.
        size === 'default' && 'h-[length:var(--spacing-xl)]',
        className
      )}
      {...props}
    >
      {leadingIcon}
      <span className="shrink-0">{children}</span>
      {middleIcon}
      {secondaryText ? (
        <span
          className={cn(
            'max-w-[100px] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap',
            secondaryTextClassName
          )}
        >
          {secondaryText}
        </span>
      ) : null}
      {onDismiss ? (
        <IconButton
          type="button"
          variant="ghost"
          size="mini"
          roundness="round"
          className="size-[length:var(--spacing-md)] opacity-50 hover:opacity-100"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <XIcon className="pointer-events-none size-[length:var(--icon-xs)]" />
        </IconButton>
      ) : (
        trailing
      )}
    </Badge>
  );
}

export { StatusBadge };
