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
 *
 * Figma names a reusable "Icon Button Semantic" component (`16315:1141`)
 * for exactly 4 color-coordinated commands: Fia, Gather, Comment,
 * Highlight — each pairs one glyph with one variant (Fia → `fiaGhost`
 * green; the rest → plain `ghost`). It's only consumed here, so it lives
 * here rather than as a shared primitive (see `IconButtonSemantic`
 * below) instead of being duplicated inline per button. `highlight` is
 * a supported command not currently wired into the toolbar — Figma's
 * "Highlight" leading action (Icon / highlighter, "mark, text") doesn't
 * appear in the confirmed 4-button User highlight layout above; add it
 * if that turns out to be a 5th action rather than an unused command.
 */

'use client';

import * as React from 'react';
import { Copy, MessageSquare, Highlighter, CircleX } from 'lucide-react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { SPRING_BLOOM } from '@/lib/motion';
import { FiaSilcrow } from '@/foundations/icons';
import { IconButton, type IconButtonVariant } from '@/primitives/button/icon-button';
import { Separator } from '@/primitives/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/primitives/tooltip';
import { HighlightColor } from '../highlight-color';
import { GatherSearchNotesIcon } from './assets/gather-search-notes';

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

const ICON_BUTTON_CHROME = 'text-[color:var(--muted-foreground)]';
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
  variant = 'ghost',
  children,
}: {
  label: string;
  onClick?: () => void;
  /** `fiaGhost` for Ask Fia — stays Fia-green at rest instead of muted. */
  variant?: IconButtonVariant;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <MotionIconButton
            aria-label={label}
            variant={variant}
            size="mini"
            roundness="round"
            className={variant === 'ghost' ? ICON_BUTTON_CHROME : undefined}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.94 }}
            transition={SPRING_BLOOM}
            onClick={onClick}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/** Figma "Icon Button Semantic" (`16315:1141`) — command → glyph + variant. */
type SemanticCommand = 'fia' | 'gather' | 'comment' | 'highlight';

const SEMANTIC_ICON_BUTTON: Record<
  SemanticCommand,
  {
    label: string;
    variant: IconButtonVariant;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  fia: { label: 'Ask Fia', variant: 'fiaGhost', Icon: FiaSilcrow },
  gather: {
    label: 'Gather & search notes',
    variant: 'ghost',
    Icon: GatherSearchNotesIcon,
  },
  comment: { label: 'Comment', variant: 'ghost', Icon: MessageSquare },
  highlight: { label: 'Highlight', variant: 'ghost', Icon: Highlighter },
};

function IconButtonSemantic({
  command,
  onClick,
}: {
  command: SemanticCommand;
  onClick?: () => void;
}) {
  const { label, variant, Icon } = SEMANTIC_ICON_BUTTON[command];
  return (
    <ToolbarIconButton label={label} variant={variant} onClick={onClick}>
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
        'shadow-[var(--shadow-lg-black)] dark:shadow-[var(--shadow-lg-white)]',
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
          {/* pl-2xs only, no divider — Figma's own source (16317:987)
              has exactly one Separator, before the swatches. */}
          <div className="pl-[var(--spacing-2xs)]">
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
