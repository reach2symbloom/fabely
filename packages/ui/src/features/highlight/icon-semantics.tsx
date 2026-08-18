/**
 * Highlight icon semantics — shared between Highlight Color Menu and
 * Highlight Action Menu, the two consumers of Figma's "Icon Button
 * Semantic" component (`16315:1141`): Fia, Gather, Comment, Highlight,
 * each pairing one glyph with one brand hover color. Sizing/layout/copy
 * differ per consumer, so only the glyph + hover-color mapping lives
 * here — not a full button component.
 *
 * `SEMANTIC_ACCENT_CLASS` values are literal Tailwind classes (not built
 * from a template string) so the JIT scanner can actually find them.
 */

import * as React from 'react';
import { MessageSquare, Highlighter } from 'lucide-react';

import { FiaSilcrow } from '@/foundations/icons';
import { GatherSearchNotesIcon } from './assets/gather-search-notes';

export type SemanticCommand = 'fia' | 'gather' | 'comment' | 'highlight';

/**
 * Lucide's default strokeWidth (2) makes Highlighter's crossing strokes
 * (marker body + ink mark) read as messy/overlapping at icon sizes —
 * thinner strokes let the shape read as one unified glyph instead.
 */
function HighlighterIcon({ className }: { className?: string }) {
  return <Highlighter className={className} strokeWidth={1.5} />;
}

export const SEMANTIC_ICON: Record<
  SemanticCommand,
  React.ComponentType<{ className?: string }>
> = {
  fia: FiaSilcrow,
  gather: GatherSearchNotesIcon,
  comment: MessageSquare,
  highlight: HighlighterIcon,
};

/**
 * Rest stays the shared neutral tone for most commands. Fia is the
 * exception — it's always its brand color, not just on hover, so the
 * Fia action reads as discoverable at a glance rather than blending
 * into the neutral row until a user happens to hover it. Gather still
 * only swaps to its brand color on hover.
 */
export const SEMANTIC_ACCENT_CLASS: Partial<Record<SemanticCommand, string>> = {
  fia: 'text-[color:var(--tw-raw-fia-200)]',
  gather: 'hover:text-[color:var(--tw-raw-secondary-200)]',
};
