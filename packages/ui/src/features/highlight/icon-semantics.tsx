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

import { FiaSilcrow, GatherSearchNotesIcon } from '@/foundations/icons';

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
 * into the neutral row until a user happens to hover it. Gather,
 * Comment, and Highlight only swap to their own color on hover — same
 * pantones Highlight Color Menu's own swatches use (`blue-messaging`,
 * `saffron`) so each action's hover state doubles as a preview of its
 * matching highlight color.
 */
export const SEMANTIC_ACCENT_CLASS: Partial<Record<SemanticCommand, string>> = {
  /* A plain (unmodified) color class loses to Ghost's own `hover:`/
   * `active:`/etc. state classes on hover — a `:hover` pseudo-class
   * selector is more specific than a bare class selector regardless of
   * source order, so fia would flash back to Ghost's white/foreground
   * the moment you hovered it. Repeating the color under every state
   * Ghost itself uses (same fix as the `fiaGhost` button variant in
   * `primitives/button/shared.ts`) keeps fia green through hover/
   * active/press/focus, not just at rest.
   */
  fia: [
    'text-[color:var(--tw-raw-fia-200)]',
    'hover:text-[color:var(--tw-raw-fia-200)]',
    'active:text-[color:var(--tw-raw-fia-200)]',
    'data-[pressed]:text-[color:var(--tw-raw-fia-200)]',
    'focus-visible:text-[color:var(--tw-raw-fia-200)]',
  ].join(' '),
  gather: 'hover:text-[color:var(--tw-raw-secondary-200)]',
  /* blue-messaging's "Main" step is 500, not 200 (200 is a near-white
   * pale tint) — unlike fia/secondary, where 200 is their Main. */
  comment: 'hover:text-[color:var(--tw-raw-blue-messaging-500)]',
  highlight: 'hover:text-[color:var(--tw-raw-pantones-saffron)]',
};
