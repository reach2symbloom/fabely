/**
 * Highlight Color Menu — floating toolbar shown on a text selection /
 * existing highlight, letting the user act on it and (for user highlights)
 * pick a color.
 *
 * Figma: Highlight color menu (`16319:1082`) — `type=User highlight`
 * (281px, 4 actions + divider + color swatches + remove) / `type=System
 * highlight` (104px, the same 4 leading actions only — no color choice,
 * no remove). Composes `@/primitives/button/icon-button`,
 * `@/primitives/separator`, and `../highlight-color` (`HighlightColor`,
 * the swatch piece built alongside this one).
 *
 * User highlight's 4 leading actions, confirmed against a live render:
 * Copy, Ask Fia (the brand silcrow), Gather & Search Notes (exported
 * Figma asset — stacked pages + sparkle + magnifying glass, no Lucide
 * equivalent — see `./assets/gather-search-notes.tsx`), and Comment.
 * The trailing action (right of the color swatches) is "Remove
 * highlight" (`Icon / circle-x`). Figma's own source (`16317:987`) has
 * exactly one Separator, before the swatches — not a second one after
 * them. System highlight's own icon set is still unconfirmed
 * (Figma's source artwork differs from User's for at least the Ask
 * Fia / Gather & Search Notes slots) — it currently renders the same
 * 4 as User, which is likely wrong.
 *
 * Every action button is a Tooltip trigger (label = its `aria-label`).
 * Hover/press use Motion's `SPRING_BLOOM` (see `@/lib/motion`) for a
 * spring scale on top of Icon Button's own CSS hover fill — Motion
 * drives the transform, Foundation tokens still drive the fill color.
 * Rest is `--theme-alpha-black-switch-20` for every icon except Fia,
 * which is always its brand color (`--tw-raw-fia-200`) for
 * discoverability, not gated behind hover. Gather still only swaps to
 * its own brand color (`--tw-raw-secondary-200`) on hover.
 *
 * Figma names a reusable "Icon Button Semantic" component (`16315:1141`)
 * for exactly 4 commands: Fia, Gather, Comment, Highlight — glyph +
 * hover-color mapping lives in `../icon-semantics` (shared with Highlight
 * Action Menu, the other consumer); sizing/layout/tooltip copy here are
 * this menu's own (see `IconButtonSemantic` below). `highlight` is a
 * supported command not currently wired into the toolbar — Figma's
 * "Highlight" leading action (Icon / highlighter, "mark, text") doesn't
 * appear in the confirmed 4-button User highlight layout above; add it
 * if that turns out to be a 5th action rather than an unused command.
 */

'use client';

import * as React from 'react';
import { Copy, CircleX } from 'lucide-react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { SPRING_BLOOM } from '@/lib/motion';
import { IconButton } from '@/primitives/button/icon-button';
import { Separator } from '@/primitives/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/primitives/tooltip';
import { HighlightColor } from '../highlight-color';
import {
  SEMANTIC_ICON,
  SEMANTIC_ACCENT_CLASS,
  type SemanticCommand,
} from '../icon-semantics';

const MotionIconButton = motion.create(IconButton);

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
  onAskFia?: () => void;
  onSearch?: () => void;
  onComment?: () => void;
  /** Trailing action, right of the color swatches. */
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
 * Rest = alpha-20 (quiet, per spec) — overrides Icon Button ghost's own
 * rest color (--muted-foreground, alpha-60, too strong here). Hover is
 * untouched: ghost's own `hover:text-foreground` already goes to full
 * strength, which is the "lighter on hover" step in dark mode.
 */
const ICON_BUTTON_CHROME = 'text-[color:var(--theme-alpha-black-switch-20)]';
/* Figma icon size is 16px (`--icon-sm`); Icon Button's `mini` size
 * auto-sizes unlabeled glyphs to `--icon-xs` (12px) via
 * `[&_svg:not([class*='size-'])]:...` — the `size-` class name here opts
 * back out of that, same fix as Control Rich Divider's ornament. */
const ICON_GLYPH_CHROME = 'size-[length:var(--icon-sm)]';

const DIVIDER_CHROME =
  'flex h-full items-center self-stretch pr-[var(--spacing-xs)] pl-[var(--spacing-2xs)]';
/* Separator's own default (--theme-alpha-black-switch-5, matches Figma's
 * literal spec) is a 5% tint — too subtle to read against this menu's
 * dark surface. --border is the same token the menu's own outer border
 * already uses, so it reads at a consistent, actually-visible strength. */
const DIVIDER_LINE_CHROME = 'bg-[color:var(--border)]';

function ToolbarIconButton({
  label,
  onClick,
  accentClassName,
  children,
}: {
  label: string;
  onClick?: () => void;
  /** Literal `text-[color:var(--...)]` (rest or hover) — see `../icon-semantics`. */
  accentClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <MotionIconButton
            aria-label={label}
            variant="ghost"
            size="mini"
            roundness="round"
            className={cn(ICON_BUTTON_CHROME, accentClassName)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.94 }}
            transition={SPRING_BLOOM}
            onClick={onClick}
          />
        }
      >
        {children}
      </TooltipTrigger>
      {/* Default sideOffset is 4px — +8px per spec. */}
      <TooltipContent sideOffset={12}>{label}</TooltipContent>
    </Tooltip>
  );
}

/** This menu's own short labels for the shared semantic commands. */
const SEMANTIC_LABEL: Record<SemanticCommand, string> = {
  fia: 'Ask Fia',
  gather: 'Gather & search notes',
  comment: 'Comment',
  highlight: 'Highlight',
};

function IconButtonSemantic({
  command,
  onClick,
}: {
  command: SemanticCommand;
  onClick?: () => void;
}) {
  const Icon = SEMANTIC_ICON[command];
  return (
    <ToolbarIconButton
      label={SEMANTIC_LABEL[command]}
      accentClassName={SEMANTIC_ACCENT_CLASS[command]}
      onClick={onClick}
    >
      <Icon className={ICON_GLYPH_CHROME} />
    </ToolbarIconButton>
  );
}

function HighlightColorMenu({
  className,
  type = 'user',
  colors = DEFAULT_HIGHLIGHT_COLOR_OPTIONS,
  value,
  defaultValue,
  onValueChange,
  onCopy,
  onAskFia,
  onSearch,
  onComment,
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
        /* No gap — the leading icon buttons sit flush against each other
         * in Figma; spacing around the divider/swatches/remove group comes
         * from padding on those elements below, not a uniform row gap. */
        'inline-flex items-center',
        'rounded-[length:var(--rounded-lg)] border border-[color:var(--border)]',
        'bg-[color:var(--neutrals-new-150)] p-[var(--spacing-2xs)]',
        /* Figma's literal shadow (md/shadow-1 + md/shadow-2, rgba(7,19,23,…))
         * — always dark, same in both themes. Not --shadow-lg-black/white:
         * that pair flips to a light glow in dark mode, which doesn't
         * match Figma's spec here. */
        'shadow-[0px_4px_22px_-1px_rgba(7,19,23,0.4),0px_2px_13px_0px_rgba(7,19,23,0.3)]',
        className,
      )}
    >
      <ToolbarIconButton label="Copy" onClick={onCopy}>
        <Copy className={ICON_GLYPH_CHROME} />
      </ToolbarIconButton>
      <IconButtonSemantic command="fia" onClick={onAskFia} />
      <IconButtonSemantic command="gather" onClick={onSearch} />
      <IconButtonSemantic command="comment" onClick={onComment} />

      {isUser ? (
        <>
          <div className={DIVIDER_CHROME}>
            <Separator
              orientation="vertical"
              className={cn('h-full', DIVIDER_LINE_CHROME)}
            />
          </div>
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
          {/* No divider — Figma's own source (16317:987) has exactly one
              Separator, before the swatches. pl-xs (8px = Figma's 4px +
              4px more per spec), not pl-2xs. */}
          <div className="pl-[var(--spacing-xs)]">
            <ToolbarIconButton label="Remove highlight" onClick={onRemove}>
              <CircleX className={ICON_GLYPH_CHROME} />
            </ToolbarIconButton>
          </div>
        </>
      ) : null}
    </div>
  );
}

export { HighlightColorMenu, DEFAULT_HIGHLIGHT_COLOR_OPTIONS };
