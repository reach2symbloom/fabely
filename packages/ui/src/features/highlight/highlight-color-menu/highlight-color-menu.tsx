/**
 * Highlight Color Menu — floating toolbar shown on a text selection /
 * existing highlight, letting the user act on it and (for user highlights)
 * pick a color.
 *
 * Figma: Highlight color menu (`16319:1082`) — `type=User highlight`
 * (281px, 4 actions + divider + color swatches + remove) / `type=System
 * highlight` (104px, the same 4 leading actions only — no color choice,
 * no remove). Composes `@/primitives/button/icon-button`,
 * `@/primitives/separator`, and `./highlight-color` (`HighlightColor`,
 * the swatch atom-turned-feature-piece built alongside this menu).
 *
 * Icon choices: Figma names 5 glyphs across this component (copy,
 * message-square, highlighter, circle-x, check — check is the swatch's
 * own selected mark). The 4 leading actions and the trailing "remove"
 * action aren't individually labeled in Figma beyond that, so the
 * mapping below (Copy / Comment / Highlighter / Cancel, Remove) is a
 * best-effort read of the icon set, not a confirmed 1:1 spec.
 */

'use client';

import * as React from 'react';
import { Copy, MessageSquare, Highlighter, CircleX, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { IconButton } from '@/primitives/button/icon-button';
import { Separator } from '@/primitives/separator';
import { HighlightColor } from '../highlight-color';

export type HighlightColorMenuType = 'user' | 'system';

export type HighlightColorMenuOption = {
  value: string;
  color: string;
  label: string;
};

export type HighlightColorMenuProps = {
  className?: string;
  /** User highlights get color swatches + remove; System highlights don't. */
  type?: HighlightColorMenuType;
  /** Ignored when `type="system"`. */
  colors?: HighlightColorMenuOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onCopy?: () => void;
  onComment?: () => void;
  onHighlight?: () => void;
  onCancel?: () => void;
  onRemove?: () => void;
};

/** Figma's own example palette on this frame. */
const DEFAULT_HIGHLIGHT_COLOR_OPTIONS: HighlightColorMenuOption[] = [
  { value: 'rorange', color: 'var(--tw-raw-pantones-rorange)', label: 'Rorange' },
  { value: 'saffron', color: 'var(--tw-raw-pantones-saffron)', label: 'Saffron' },
  { value: 'blush', color: 'var(--tw-raw-pantones-blush)', label: 'Blush' },
  { value: 'salmon', color: 'var(--tw-raw-pantones-salmon)', label: 'Salmon' },
  { value: 'pumpkin', color: 'var(--tw-raw-pantones-pumpkin)', label: 'Pumpkin' },
  { value: 'blue-messaging', color: 'var(--tw-raw-blue-messaging-200)', label: 'Blue' },
  { value: 'lavender', color: 'var(--tw-raw-secondary-200)', label: 'Lavender' },
];

/*
 * Icon Button's `mini` size reserves `p-[var(--spacing-2xs)]` (4px) on
 * each side, sized for its own forced icon (`--icon-xs`, 12px):
 * 4+4+12+2(border) = 22, fits inside the 24px box. Figma's spec here is
 * a 16px icon in that same 24px frame — 4+4+16+2 = 26, past the box, so
 * the ~4px pad + 16px icon combination doesn't fit without `overflow-hidden`
 * quietly clipping the glyph and eating into the margin around it. `p-0`
 * removes that conflict; centering comes from `items-center
 * justify-center` (already on the root) instead of padding.
 */
const ICON_BUTTON_CHROME = 'p-0 text-[color:var(--muted-foreground)]';
/* Figma icon size is 16px (`--icon-sm`); Icon Button's `mini` size
 * auto-sizes unlabeled glyphs to `--icon-xs` (12px) via
 * `[&_svg:not([class*='size-'])]:...` — the `size-` class name here opts
 * back out of that, same fix as Control Rich Divider's ornament. */
const ICON_GLYPH_CHROME = 'size-[length:var(--icon-sm)]';

function HighlightColorMenu({
  className,
  type = 'user',
  colors = DEFAULT_HIGHLIGHT_COLOR_OPTIONS,
  value,
  defaultValue,
  onValueChange,
  onCopy,
  onComment,
  onHighlight,
  onCancel,
  onRemove,
}: HighlightColorMenuProps) {
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultValue ?? colors[colors.length - 1]?.value,
  );
  const selected = value ?? uncontrolled;
  const isUser = type === 'user';

  return (
    <div
      data-slot="highlight-color-menu"
      data-type={type}
      className={cn(
        'inline-flex items-center gap-[var(--spacing-2xs)]',
        'rounded-[length:var(--rounded-lg)] border border-[color:var(--border)]',
        'bg-[color:var(--neutrals-new-150)] p-[var(--spacing-2xs)]',
        'shadow-[var(--shadow-lg-black)] dark:shadow-[var(--shadow-lg-white)]',
        className,
      )}
    >
      <IconButton
        aria-label="Copy"
        variant="ghost"
        size="mini"
        roundness="round"
        className={ICON_BUTTON_CHROME}
        onClick={onCopy}
      >
        <Copy className={ICON_GLYPH_CHROME} />
      </IconButton>
      <IconButton
        aria-label="Comment"
        variant="ghost"
        size="mini"
        roundness="round"
        className={ICON_BUTTON_CHROME}
        onClick={onComment}
      >
        <MessageSquare className={ICON_GLYPH_CHROME} />
      </IconButton>
      <IconButton
        aria-label="Highlight"
        variant="ghost"
        size="mini"
        roundness="round"
        className={ICON_BUTTON_CHROME}
        onClick={onHighlight}
      >
        <Highlighter className={ICON_GLYPH_CHROME} />
      </IconButton>
      <IconButton
        aria-label="Cancel"
        variant="ghost"
        size="mini"
        roundness="round"
        className={ICON_BUTTON_CHROME}
        onClick={onCancel}
      >
        <CircleX className={ICON_GLYPH_CHROME} />
      </IconButton>

      {isUser ? (
        <>
          <Separator orientation="vertical" className="self-stretch" />
          <div className="flex items-center gap-[var(--spacing-2xs)]">
            {colors.map((option) => (
              <HighlightColor
                key={option.value}
                color={option.color}
                selected={option.value === selected}
                aria-label={option.label}
                onClick={() => {
                  setUncontrolled(option.value);
                  onValueChange?.(option.value);
                }}
              />
            ))}
          </div>
          <IconButton
            aria-label="Remove highlight"
            variant="ghost"
            size="mini"
            roundness="round"
            className={ICON_BUTTON_CHROME}
            onClick={onRemove}
          >
            <Trash2 className={ICON_GLYPH_CHROME} />
          </IconButton>
        </>
      ) : null}
    </div>
  );
}

export { HighlightColorMenu, DEFAULT_HIGHLIGHT_COLOR_OPTIONS };
