/**
 * Pure outline drag-and-drop reducer — no DOM, no dnd-kit types. Takes the
 * flat outline array + a drop event, returns the new array (or a rejection,
 * or a request for confirmation). Colocated with the Chapter Menu story for
 * now (Storybook-demo-only scope — see ChapterMenu.stories.tsx), but written
 * as an isolated, dependency-free module so Chapter Menu can import it
 * wholesale later.
 *
 * ## Data model
 *
 * The outline is a FLAT array, not a nested tree. Each item carries its own
 * `parentId`: `ROOT_CONTAINER` for top-level chapters/acts, a chapter's id
 * for its scenes, a scene's id for its subscenes. Sibling order is just the
 * items' relative order in the array, filtered by `parentId`.
 *
 * ## Placement — `before` vs `nest`, decided outside this module
 *
 * Chapters only ever live at the root — two chapters always share the same
 * `parentId`. That means "same parent → reorder, different parent → nest"
 * (this module's earlier heuristic) can never fire nesting for a chapter
 * dropped on a chapter, since there's no "different parent" case to hit.
 * Whimsical-style outline editors resolve this with pointer position: the
 * top half of a target row means "insert before it, as a sibling"; the
 * bottom half means "nest into it, as its first child" (only meaningful
 * when the target can own children — chapter or scene).
 *
 * This module doesn't compute that split — it has no pointer, on purpose.
 * `OutlineDropEvent.placement` carries the already-resolved decision, and
 * the dnd-kit adapter (`use-outline-dnd-kit.ts`) is the one reading
 * geometry to produce it. `'nest'` on a target that can't own children
 * (subscene/act) falls back to `'before'` here rather than erroring — the
 * adapter is expected not to offer a nest zone for those, but this module
 * stays defensive about it regardless.
 *
 * ## Type coercion — resulting kind always matches its new container
 *
 * Whatever container a (non-act) item lands in, its kind becomes that
 * container's native kind: `ROOT_CONTAINER` → chapter, a chapter container →
 * scene, a scene container → subscene.
 *
 * ## Cascading moves — the dragged item's subtree moves with it
 *
 * Depth in this outline is fixed by kind: chapter/act = 0, scene = 1,
 * subscene = 2 (the max — nothing nests under a subscene). Moving an item
 * to a different depth shifts its entire subtree by the same amount:
 *
 * - **Promotion** (moving to a shallower depth — a scene becoming a
 *   chapter, a subscene becoming a chapter or scene) is always safe: the
 *   subtree shifts up, and shifting up can never exceed the max depth. A
 *   scene with subscenes dragged to become a chapter has its subscenes
 *   promoted to scenes.
 * - **Demotion** (moving to a deeper depth) shifts the subtree down. Safe
 *   as long as no descendant would end up deeper than subscene. A chapter
 *   with only scenes (max relative depth 1) nested into another chapter (a
 *   +1 shift) cascades cleanly: its scenes become subscenes, landing
 *   exactly at depth 2.
 * - **Overflow**: if a descendant would end up past depth 2 — e.g. a
 *   chapter whose scenes themselves have subscenes (relative depth 2)
 *   nested into another chapter (+1 shift lands those at depth 3) — the
 *   move returns `{ type: 'needs-confirmation' }` instead of silently doing
 *   something lossy or silently refusing. The caller decides: re-invoke
 *   with `{ ...event, resolution: 'flatten' }` to proceed (every
 *   descendant that would overflow is pulled out of the nested subtree and
 *   placed as a sibling of the dragged item in its new container instead
 *   of nesting it), or drop the request to leave the outline unchanged.
 *
 * `act` never changes kind or cascades — acts are structural dividers with
 * no children by construction (⚠️ ASSUMPTION: no basis in a source spec,
 * just no obvious product meaning for coercing one).
 */

export type OutlineItemKind = 'chapter' | 'scene' | 'subscene' | 'act';

/** Container id for top-level chapters/acts — not a real item. */
export const ROOT_CONTAINER = 'root';

/** Deepest a subtree may go — subscene. Nothing nests under a subscene. */
const MAX_DEPTH = 2;

export type OutlineItem = {
  id: string;
  kind: OutlineItemKind;
  label: string;
  /** `ROOT_CONTAINER`, a chapter id, or a scene id. */
  parentId: string;
  /**
   * Chapter-only rendering flag — true hides this chapter's scenes (and
   * transitively their subscenes) from render without removing them from
   * the array. Omitted/false = expanded. Meaningless for scene/subscene/act
   * kinds; nothing currently collapses a scene individually. Pure UI state
   * living on the item itself so the flat array stays the only source of
   * truth — no separate expanded-ids map to keep in sync.
   */
  isCollapsed?: boolean;
};

export type OutlineDropPlacement = 'before' | 'nest';

export type OutlineDropEvent = {
  /** Id of the item being dragged. */
  activeId: string;
  /** Id of the item under the pointer/keyboard focus, or `ROOT_CONTAINER`. */
  overId: string;
  /**
   * `'before'` — insert as a sibling ahead of the target, in the target's
   * own container. `'nest'` — nest into the target as its first child;
   * only takes effect when the target can own children (chapter/scene),
   * falls back to `'before'` otherwise. Ignored entirely when `overId` is
   * `ROOT_CONTAINER` (nothing to be "before" or "nested into" — always
   * appends at the top level).
   */
  placement: OutlineDropPlacement;
  /**
   * Only meaningful when replaying an event that previously came back as
   * `needs-confirmation`. `'flatten'` proceeds, pulling every
   * over-max-depth descendant out to sit as a sibling of the dragged item
   * instead of nesting it. Omit (or replay without it) to leave the
   * outline unchanged — the confirmation was declined.
   */
  resolution?: 'flatten';
};

export type OutlineDropResult =
  | { type: 'moved'; items: OutlineItem[] }
  | { type: 'rejected'; reason: string }
  | {
      type: 'needs-confirmation';
      reason: string;
      /** Pass back as `reorderOutline(items, { ...event, resolution: 'flatten' })` to proceed. */
      event: OutlineDropEvent;
    };

/** True when a divider represents the item's unchanged current position. */
export function isOutlineDropNoOp(
  items: OutlineItem[],
  event: Pick<OutlineDropEvent, 'activeId' | 'overId' | 'placement'>,
): boolean {
  if (event.activeId === event.overId) return true;
  if (event.placement !== 'before') return false;

  const active = items.find((item) => item.id === event.activeId);
  const over = items.find((item) => item.id === event.overId);
  if (!active || !over || active.parentId !== over.parentId) return false;

  const siblings = items.filter((item) => item.parentId === active.parentId);
  return siblings.indexOf(over) === siblings.indexOf(active) + 1;
}

/** Items whose `parentId` is `parentId`, in their existing relative order. */
export function childrenOf(
  items: OutlineItem[],
  parentId: string,
): OutlineItem[] {
  return items.filter((item) => item.parentId === parentId);
}

/** Can this kind own children at all? (Only chapter and scene can.) */
export function canOwnChildren(kind: OutlineItemKind): boolean {
  return kind === 'chapter' || kind === 'scene';
}

/** The kind a NEW item takes on by virtue of landing in this container. */
function nativeKindForContainer(
  items: OutlineItem[],
  containerId: string,
): OutlineItemKind {
  if (containerId === ROOT_CONTAINER) return 'chapter';
  const owner = items.find((item) => item.id === containerId);
  return owner?.kind === 'scene' ? 'subscene' : 'scene';
}

/**
 * Shared by `reorderOutline` and `previewResultKind` so the live drop
 * indicator's label can never drift from what actually happens on drop.
 */
function resolveTargetContainer(
  items: OutlineItem[],
  overId: string,
  placement: OutlineDropPlacement,
): string {
  const overItem =
    overId === ROOT_CONTAINER
      ? undefined
      : items.find((item) => item.id === overId);
  if (!overItem) return ROOT_CONTAINER;
  const nesting = placement === 'nest' && canOwnChildren(overItem.kind);
  return nesting ? overItem.id : overItem.parentId;
}

/**
 * What kind the dragged item WOULD become if dropped right now — for the
 * live indicator's label. Read-only; does not touch `items`. Returns `null`
 * if either id doesn't currently exist (drag started, then the item was
 * removed from under it — shouldn't normally happen, but the UI shouldn't
 * crash if it does).
 */
export function previewResultKind(
  items: OutlineItem[],
  event: Pick<OutlineDropEvent, 'activeId' | 'overId' | 'placement'>,
): OutlineItemKind | null {
  const dragged = items.find((item) => item.id === event.activeId);
  if (!dragged) return null;
  if (event.overId !== ROOT_CONTAINER && !items.some((item) => item.id === event.overId)) {
    return null;
  }
  if (dragged.kind === 'act') return 'act';
  const targetContainer = resolveTargetContainer(items, event.overId, event.placement);
  return nativeKindForContainer(items, targetContainer);
}

function depthOf(kind: OutlineItemKind): number {
  if (kind === 'scene') return 1;
  if (kind === 'subscene') return 2;
  return 0; // chapter, act
}

function kindAtDepth(depth: number): OutlineItemKind {
  if (depth <= 0) return 'chapter';
  if (depth === 1) return 'scene';
  return 'subscene';
}

type SubtreeEntry = { item: OutlineItem; relativeDepth: number };

/** Every descendant of `rootId`, DFS pre-order, with depth relative to it (1 = direct child). */
function collectSubtree(items: OutlineItem[], rootId: string): SubtreeEntry[] {
  const result: SubtreeEntry[] = [];
  function walk(parentId: string, depth: number) {
    for (const child of childrenOf(items, parentId)) {
      result.push({ item: child, relativeDepth: depth });
      walk(child.id, depth + 1);
    }
  }
  walk(rootId, 1);
  return result;
}

function insertManyBefore(
  items: OutlineItem[],
  anchorId: string | undefined,
  newItems: OutlineItem[],
): OutlineItem[] {
  if (!anchorId) return [...items, ...newItems];
  const index = items.findIndex((existing) => existing.id === anchorId);
  if (index === -1) return [...items, ...newItems];
  return [...items.slice(0, index), ...newItems, ...items.slice(index)];
}

function insertManyAfter(
  items: OutlineItem[],
  anchorId: string | undefined,
  newItems: OutlineItem[],
): OutlineItem[] {
  if (!anchorId) return [...items, ...newItems];
  const index = items.findIndex((existing) => existing.id === anchorId);
  if (index === -1) return [...items, ...newItems];
  return [...items.slice(0, index + 1), ...newItems, ...items.slice(index + 1)];
}

function confirmationReason(
  dragged: OutlineItem,
  resultKind: OutlineItemKind,
  overflowCount: number,
): string {
  const plural = overflowCount === 1 ? 'item' : 'items';
  return (
    `This ${dragged.kind} has nested content ${overflowCount} level(s) too deep to become a ${resultKind} as-is. ` +
    `Flattening will move ${overflowCount} ${plural} up to sit alongside it instead of nesting further.`
  );
}

/**
 * Resolve one drop. Pure — same inputs always produce the same output, no
 * mutation of `items`. See the module doc comment for the full rule set.
 */
export function reorderOutline(
  items: OutlineItem[],
  event: OutlineDropEvent,
): OutlineDropResult {
  const { activeId, overId, placement, resolution } = event;

  if (activeId === overId) {
    return { type: 'moved', items };
  }

  const dragged = items.find((item) => item.id === activeId);
  if (!dragged) {
    return { type: 'rejected', reason: 'Dragged item no longer exists.' };
  }

  const overItem =
    overId === ROOT_CONTAINER
      ? undefined
      : items.find((item) => item.id === overId);
  if (overId !== ROOT_CONTAINER && !overItem) {
    return { type: 'rejected', reason: 'Drop target no longer exists.' };
  }

  const subtree = dragged.kind === 'act' ? [] : collectSubtree(items, dragged.id);
  const subtreeIds = new Set(subtree.map(({ item }) => item.id));
  if (overItem && subtreeIds.has(overItem.id)) {
    return {
      type: 'rejected',
      reason: 'An outline item cannot be moved into its own contents.',
    };
  }

  const targetContainer = resolveTargetContainer(items, overId, placement);
  const nesting = targetContainer !== ROOT_CONTAINER && targetContainer === overItem?.id;

  const nativeKind = nativeKindForContainer(items, targetContainer);
  const resultKind: OutlineItemKind =
    dragged.kind === 'act' ? 'act' : nativeKind;

  const overflowing = subtree.filter(
    ({ relativeDepth }) => depthOf(resultKind) + relativeDepth > MAX_DEPTH,
  );

  if (overflowing.length > 0 && resolution !== 'flatten') {
    return {
      type: 'needs-confirmation',
      reason: confirmationReason(dragged, resultKind, overflowing.length),
      event: { activeId, overId, placement },
    };
  }

  const overflowingIds = new Set(overflowing.map(({ item }) => item.id));
  const rest = items.filter(
    (item) => item.id !== activeId && !subtreeIds.has(item.id),
  );

  const movedDragged: OutlineItem = {
    ...dragged,
    kind: resultKind,
    parentId: targetContainer,
  };

  const movedSubtree: OutlineItem[] = subtree.map(({ item, relativeDepth }) =>
    overflowingIds.has(item.id)
      ? { ...item, kind: nativeKind, parentId: targetContainer }
      : { ...item, kind: kindAtDepth(depthOf(resultKind) + relativeDepth) },
  );

  const block = [movedDragged, ...movedSubtree];
  const next =
    overItem && !nesting
      ? insertManyBefore(rest, overItem.id, block)
      : insertManyAfter(rest, overItem?.id, block);

  return { type: 'moved', items: next };
}

/**
 * Chapter / act / scene numbers, recomputed from position — same approach
 * as the existing add-act logic (count preceding items of that type, don't
 * store/append a fixed number). Subscenes have no number in this UI.
 */
export function computeOutlineNumbers(
  items: OutlineItem[],
): Map<string, number> {
  const numbers = new Map<string, number>();
  let chapterCount = 0;
  let actCount = 0;
  const sceneCounts = new Map<string, number>();

  for (const item of items) {
    if (item.kind === 'chapter') {
      chapterCount += 1;
      numbers.set(item.id, chapterCount);
    } else if (item.kind === 'act') {
      actCount += 1;
      numbers.set(item.id, actCount);
    } else if (item.kind === 'scene') {
      const count = (sceneCounts.get(item.parentId) ?? 0) + 1;
      sceneCounts.set(item.parentId, count);
      numbers.set(item.id, count);
    }
  }

  return numbers;
}
