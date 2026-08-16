/**
 * Highlight Action Menu — vertical pill of the same 4 semantic actions
 * as Highlight Color Menu's leading icons (Fia, Gather, Comment,
 * Highlight), each with a right-side tooltip carrying its own sentence
 * of copy rather than a short label.
 *
 * Figma: Highlight menu (`16315:1196`) — `hover` axis (None/Fia/Gather/
 * Comment/Highlight) demonstrates each action's hover fill + tooltip
 * one at a time; this component renders all 4 live instead, same as
 * Highlight Color Menu does for its own row. 36px buttons / 24px icons
 * (Icon Button's `default` size forces `--icon-md` at 20px; the `size-`
 * class here opts back out of that, same fix used throughout Highlight).
 * No gap between buttons — Figma's own stack has none.
 *
 * The pill's border + persistent focus-style ring
 * (`0 0 0 4px var(--ring-primary)`) plus the same two-layer dark shadow
 * Highlight Color Menu uses are both literal in Figma, not conditional
 * on any interaction state — always on.
 *
 * Glyph + hover-color mapping is shared with Highlight Color Menu via
 * `../icon-semantics`; this piece owns its own sizing, layout, and
 * (unlike the toolbar's short labels) full-sentence tooltip copy.
 */

'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';

import { cn } from '@/lib/utils';
import { SPRING_BLOOM } from '@/lib/motion';
import { IconButton } from '@/primitives/button/icon-button';
import { Tooltip, TooltipTrigger } from '@/primitives/tooltip';
import {
  SEMANTIC_ICON,
  SEMANTIC_HOVER_CLASS,
  type SemanticCommand,
} from '../icon-semantics';

const MotionIconButton = motion.create(IconButton);

/**
 * Custom tooltip content — NOT the shared `TooltipContent` (which renders
 * a separately-positioned rotated-square Arrow that read as two
 * overlapping boxes here rather than one continuous speech bubble, and
 * couldn't be debugged further without live DOM inspection). Composes
 * the same underlying Base UI parts (`Portal`/`Positioner`/`Popup`)
 * directly instead, with the pointer built as a genuine part of the
 * shape: two stacked CSS border-triangles (an outline-colored one behind,
 * a fill-colored one on top, 1px smaller) sitting flush against the
 * popup's own left edge, which has no left border of its own — so the
 * fill color is continuous from pointer to body with no seam, and the
 * outline reads as one unbroken silhouette. Colors/type are the same
 * Fabely tokens the shared Tooltip uses (`--neutrals-new-150`,
 * `--border`, `--foreground`, Paragraph Mini) — only the geometry
 * differs.
 */
function ActionTooltipContent({ children }: { children: React.ReactNode }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        side="right"
        sideOffset={8}
        align="center"
        className="z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="action-tooltip-content"
          className={cn(
            'relative inline-flex w-max min-w-[180px] max-w-xs items-center',
            'ml-[6px]',
            'rounded-[length:var(--rounded-md)]',
            'border-y border-r border-[color:var(--border)] border-solid',
            'bg-[color:var(--neutrals-new-150)] text-[color:var(--foreground)]',
            'px-[var(--spacing-sm)] py-[var(--spacing-1-5)]',
            'font-[family-name:var(--font-family-body)]',
            '[font-weight:var(--font-weight-paragraph-regular)]',
            'text-[length:var(--text-paragraph-mini-regular-font-size)]',
            'leading-[var(--text-paragraph-mini-regular-line-height)]',
            'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
            'text-balance',
          )}
        >
          {/* Outline triangle — sits behind, 1px larger, gives the
              pointer's outward edges a border matching the body. */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute top-1/2 left-0 -translate-x-full -translate-y-1/2',
              'border-y-[7px] border-r-[7px] border-y-transparent',
              'border-r-[color:var(--border)]',
            )}
          />
          {/* Fill triangle — 1px inset, same color as the body, on top;
              the two together read as one continuous outlined shape. */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute top-1/2 left-0 -translate-x-full -translate-y-1/2',
              'translate-x-[1px]',
              'border-y-[6px] border-r-[6px] border-y-transparent',
              'border-r-[color:var(--neutrals-new-150)]',
            )}
          />
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export type HighlightActionMenuProps = {
  className?: string;
  onAskFia?: () => void;
  onSearch?: () => void;
  onComment?: () => void;
  onHighlight?: () => void;
};

/** Figma's own tooltip copy per action — full sentences, not labels. */
const ACTION_COPY: Record<SemanticCommand, { label: string; tooltip: string }> = {
  fia: { label: 'Ask Fia', tooltip: 'Ask Fia about this selection' },
  gather: { label: 'Gather & search notes', tooltip: 'Gather related material' },
  comment: { label: 'Comment', tooltip: 'Add comment' },
  highlight: { label: 'Highlight', tooltip: 'Highlight passage' },
};

const ICON_BUTTON_CHROME = 'text-[color:var(--theme-alpha-black-switch-20)]';
const ICON_GLYPH_CHROME = 'size-[length:var(--icon-lg)]';

function ActionButton({
  command,
  onClick,
}: {
  command: SemanticCommand;
  onClick?: () => void;
}) {
  const Icon = SEMANTIC_ICON[command];
  const { label, tooltip } = ACTION_COPY[command];

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <MotionIconButton
            aria-label={label}
            variant="ghost"
            size="default"
            roundness="round"
            className={cn(ICON_BUTTON_CHROME, SEMANTIC_HOVER_CLASS[command])}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.94 }}
            transition={SPRING_BLOOM}
            onClick={onClick}
          />
        }
      >
        <Icon className={ICON_GLYPH_CHROME} />
      </TooltipTrigger>
      <ActionTooltipContent>{tooltip}</ActionTooltipContent>
    </Tooltip>
  );
}

function HighlightActionMenu({
  className,
  onAskFia,
  onSearch,
  onComment,
  onHighlight,
}: HighlightActionMenuProps) {
  return (
    <div
      data-slot="highlight-action-menu"
      className={cn(
        'inline-flex flex-col items-center',
        'rounded-[length:var(--rounded-full)] border border-[color:var(--primary)]',
        'bg-[color:var(--background)] p-[var(--spacing-2xs)]',
        /* Persistent — not gated behind any interaction state, per Figma. */
        'shadow-[0px_0px_0px_4px_var(--ring-primary),0px_4px_22px_-1px_rgba(7,19,23,0.4),0px_2px_13px_0px_rgba(7,19,23,0.3)]',
        className,
      )}
    >
      <ActionButton command="fia" onClick={onAskFia} />
      <ActionButton command="gather" onClick={onSearch} />
      <ActionButton command="comment" onClick={onComment} />
      <ActionButton command="highlight" onClick={onHighlight} />
    </div>
  );
}

export { HighlightActionMenu };
