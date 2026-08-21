/**
 * Pure reorder logic for Paragraph List — no dnd-kit import here, same
 * split as Chapter Menu's `outline-dnd.ts`/`use-outline-dnd-kit.ts` pair.
 * Simpler than that reducer, though: paragraphs are a flat list (no
 * nesting), so the only question a drop ever answers is "which of the
 * N+1 gaps around N rows does this land in" — a single integer, not an
 * `OutlineDropPlacement`.
 */

export type ParagraphListItem = {
  id: string;
  text: string;
};

/**
 * Gap index `i` sits before `items[i]` — `0` is ahead of the first row,
 * `items.length` is the tail gap after the last row.
 */
export type ParagraphGapIndex = number;

/** Would inserting `activeId` at `gapIndex` leave the array unchanged? True
 * for the two gaps immediately touching the dragged item's own current
 * position — no actual move, so no indicator should show there. */
export function isParagraphMoveNoOp(
  items: ParagraphListItem[],
  activeId: string,
  gapIndex: ParagraphGapIndex,
): boolean {
  const activeIndex = items.findIndex((item) => item.id === activeId);
  if (activeIndex === -1) return true;
  return gapIndex === activeIndex || gapIndex === activeIndex + 1;
}

/** Moves `activeId` to sit at `gapIndex` (evaluated against the array with
 * the dragged item still in place — matches how `gapIndex` is computed in
 * `use-paragraph-list-dnd-kit.ts`). No-op inputs (bad id, no real move)
 * return `items` unchanged, same reference. */
export function reorderParagraphs(
  items: ParagraphListItem[],
  activeId: string,
  gapIndex: ParagraphGapIndex,
): ParagraphListItem[] {
  const activeIndex = items.findIndex((item) => item.id === activeId);
  if (activeIndex === -1 || isParagraphMoveNoOp(items, activeId, gapIndex)) {
    return items;
  }

  const next = items.slice();
  const [moved] = next.splice(activeIndex, 1);
  // Removing the dragged item shifts every later index left by one, so a
  // gap that was counted against the original array needs the same
  // adjustment before it's used as a splice index into `next`.
  const insertAt = gapIndex > activeIndex ? gapIndex - 1 : gapIndex;
  next.splice(insertAt, 0, moved);
  return next;
}
