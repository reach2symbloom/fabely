/**
 * Pure data-shaping helpers for `StatusBadge` call sites — typed input
 * shapes plus formatting functions that turn them into display strings.
 *
 * None of this is app-state wiring. There is no Promptbar yet — no hooks,
 * selectors, or context providers live here or anywhere in this atom. This
 * module exists so that whenever the Promptbar feature is built, it has a
 * ready, tested contract to consume (`import { formatChapterScene, ... }
 * from '@/atoms/status-badge'`) instead of re-deriving these rules from
 * scratch or copying them out of Storybook. See `status-badge.stories.tsx`
 * for these functions exercised against mocked Promptbar inputs, and the
 * README's "Future Promptbar Integration" section for the deferred
 * responsibility split.
 */
import type { StatusBadgeTone } from './status-badge';

export const STATUS_BADGE_SECONDARY_TEXT_MAX_LENGTH = 30;

export type BadgeGenre = 'fiction' | 'non-fiction';

/** Set once at book creation — not derived from anything the badge itself
 * knows. */
export type GenreBadgeInput = {
  genre: BadgeGenre;
  isSeries: boolean;
};

/** The user's current chapter/scene position. */
export type ChapterSceneReference = {
  chapter: number;
  scene: number;
};

/** Paragraph numbers follow the scene's own invisible numeric structure.
 * `isPartial` is true when only part of a paragraph is selected — false
 * for a full-paragraph (or full-range) selection. */
export type ParagraphSelectionReference = {
  paragraphNumbers: number[];
  isPartial: boolean;
};

/** "The Eldergrove"-style placeholder — the title of whichever scene has
 * the user's current scroll focus. */
export type SceneConnectionInput = {
  sceneTitle: string;
};

export type NotePreviewInput = {
  noteTitle: string;
};

export type HighlightPreviewInput = {
  highlightedText: string;
};

/** First line(s) of the manuscript paragraph currently selected. */
export type ParagraphPreviewInput = {
  excerpt: string;
};

/** Every Context/Connection secondary value (scene title, note title,
 * highlighted text, manuscript excerpt) is capped at 30 characters before
 * it reaches the atom — a data-shaping rule, not something `StatusBadge`'s
 * own CSS truncation (a pixel-width safety net) decides. */
export function truncateText(text: string, maxLength: number = STATUS_BADGE_SECONDARY_TEXT_MAX_LENGTH): string {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength).trimEnd()}…`;
}

/** Figma's own examples mix a comma-style ("Ch. 1, Sc. 1") and a
 * middot-style ("Ch. 1 · Sc. 1") chapter/scene readout across different
 * subtypes — both are the same two numbers, just two literal templates. */
export function formatChapterScene({ chapter, scene }: ChapterSceneReference, style: 'comma' | 'dot' = 'dot'): string {
  return style === 'comma' ? `Ch. ${chapter}, Sc. ${scene}` : `Ch. ${chapter} · Sc. ${scene}`;
}

/** The asterisk means "part of a paragraph," not "all of it" — omit it for
 * a full-paragraph (or full-range) selection, append it only when the
 * selection is partial. */
export function formatParagraphReference({ paragraphNumbers, isPartial }: ParagraphSelectionReference): string {
  return `¶ ${paragraphNumbers.join(', ')}${isPartial ? '*' : ''}`;
}

/** Fiction gets Figma's secondary color; Non-fiction stays neutral. */
export function genreBadgeTone(genre: BadgeGenre): StatusBadgeTone {
  return genre === 'fiction' ? 'secondary' : 'neutral';
}

export function genreBadgeLabel(genre: BadgeGenre): string {
  return genre === 'fiction' ? 'Fiction' : 'Non-fiction';
}
