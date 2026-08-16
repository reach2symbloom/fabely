/**
 * Highlight icon semantics — shared between Highlight Color Menu and
 * Highlight Action Menu, the two consumers of Figma's "Icon Button
 * Semantic" component (`16315:1141`): Fia, Gather, Comment, Highlight,
 * each pairing one glyph with one brand hover color. Sizing/layout/copy
 * differ per consumer, so only the glyph + hover-color mapping lives
 * here — not a full button component.
 *
 * `SEMANTIC_HOVER_CLASS` values are literal Tailwind classes (not built
 * from a template string) so the JIT scanner can actually find them.
 */

import { MessageSquare, Highlighter } from 'lucide-react';

import { FiaSilcrow } from '@/foundations/icons';
import { GatherSearchNotesIcon } from './assets/gather-search-notes';

export type SemanticCommand = 'fia' | 'gather' | 'comment' | 'highlight';

export const SEMANTIC_ICON: Record<
  SemanticCommand,
  React.ComponentType<{ className?: string }>
> = {
  fia: FiaSilcrow,
  gather: GatherSearchNotesIcon,
  comment: MessageSquare,
  highlight: Highlighter,
};

/** Rest stays the shared neutral tone; only these two swap on hover. */
export const SEMANTIC_HOVER_CLASS: Partial<Record<SemanticCommand, string>> = {
  fia: 'hover:text-[color:var(--tw-raw-fia-200)]',
  gather: 'hover:text-[color:var(--tw-raw-secondary-200)]',
};
