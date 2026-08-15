/**
 * Pure outline drag-and-drop reducer — no DOM, no dnd-kit types. Takes the
 * flat outline array + a drop event, returns the new array (or a rejection).
 * Colocated with the Chapter Menu story for now (Storybook-demo-only scope —
 * see ChapterMenu.stories.tsx), but written as an isolated, dependency-free
 * module so Chapter Menu can import it wholesale later.
 *
 * ## Data model
 *
 * The outline is a FLAT array, not a nested tree. Each item carries its own
 * `parentId`: `ROOT_CONTAINER` for top-level chapters/acts, a chapter's id
 * for its scenes, a scene's id for its subscenes. Sibling order is just the
 * items' relative order in the array, filtered by `parentId`. This makes
 * "which container is X in" an O(1) lookup instead of a positional-adjacency
 * inference, which is what makes the reducer below tractable to test.
 *
 * ## Placement — how a drop is resolved without pointer geometry
 *
 * `OutlineDropEvent` only carries `{ activeId, overId }` — the two raw ids
 * dnd-kit reports. The reducer derives everything else from data:
 *
 * - If the dragged item and the target item already share a `parentId`,
 *   the drop is a same-container reorder: no kind change, drop after the
 *   target within that container.
 * - Otherwise, if the target is a chapter or a scene (both can own
 *   children), the drop NESTS the dragged item as the target's first
 *   child — this is what "onto another scene" means for rule 1, and the
 *   generalization of it for a target chapter.
 * - Otherwise (target is a subscene or an act — neither owns children),
 *   the drop lands as a sibling within the target's own container.
 *
 * This needs no pointer-quadrant / hover-zone math in the dnd-kit adapter:
 * the adapter just forwards raw ids, and the container comparison above is
 * enough to tell "reorder among siblings" apart from "nest into this item"
 * for every case the four source rules describe.
 *
 * ## Type coercion — resulting kind always matches its new container
 *
 * Whatever container a (non-act) item lands in, its kind becomes that
 * container's native kind: `ROOT_CONTAINER` → chapter, a chapter container →
 * scene, a scene container → subscene. This one rule implements all four
 * source rules at once:
 *
 * 1. Scene dropped into a subscene area, or onto another scene → subscene.
 *    (Landing in a scene's own container, whose native kind is subscene.)
 * 2. Subscene dropped into the chapter-level hierarchy → chapter.
 *    (Landing in ROOT_CONTAINER, whose native kind is chapter.)
 * 3. Chapter dropped into a subscene area → subscene, UNLESS it currently
 *    has scenes, in which case the drop is rejected outright (see below).
 * 4. Scene dropped into the chapter-level hierarchy → chapter, mirroring
 *    rule 2 "for symmetry" — ⚠️ ASSUMPTION, not verbatim in the source
 *    rules (which only say this for subscenes). If this is wrong, it is a
 *    one-line change: drop the `dragged.kind === 'scene'` case from the
 *    generic promotion and give it its own branch.
 *
 * Two further generalizations beyond the four rules, made for a complete
 * state machine (also flagged, not silently decided):
 *
 * - ⚠️ ASSUMPTION: the chapter-with-scenes guard (rule 3) is generalized to
 *   ANY demotion of a chapter that currently has scenes — not just
 *   specifically to a subscene area. A chapter with scenes dropped so it
 *   would become a plain scene (landing in another chapter's container) is
 *   rejected the same way, for the same reason: it would silently orphan
 *   that chapter's scenes.
 * - ⚠️ ASSUMPTION: `act` never changes kind, regardless of where it lands.
 *   Acts are structural dividers with no children by construction, so the
 *   has-children guard can never fire for one anyway — coercing an act to
 *   chapter/scene/subscene has no basis in the source rules and no obvious
 *   product meaning, so it just moves.
 */

export type OutlineItemKind = 'chapter' | 'scene' | 'subscene' | 'act';

/** Container id for top-level chapters/acts — not a real item. */
export const ROOT_CONTAINER = 'root';

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

export type OutlineDropEvent = {
  /** Id of the item being dragged. */
  activeId: string;
  /** Id of the item under the pointer/keyboard focus, or `ROOT_CONTAINER`. */
  overId: string;
};

export type OutlineDropResult =
  | { type: 'moved'; items: OutlineItem[] }
  | { type: 'rejected'; reason: string };

/** Items whose `parentId` is `parentId`, in their existing relative order. */
export function childrenOf(
  items: OutlineItem[],
  parentId: string,
): OutlineItem[] {
  return items.filter((item) => item.parentId === parentId);
}

function hasChildren(items: OutlineItem[], parentId: string): boolean {
  return items.some((item) => item.parentId === parentId);
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

function removeItem(
  items: OutlineItem[],
  id: string,
): { removed: OutlineItem | undefined; rest: OutlineItem[] } {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return { removed: undefined, rest: items };
  return {
    removed: items[index],
    rest: [...items.slice(0, index), ...items.slice(index + 1)],
  };
}

function insertAfter(
  items: OutlineItem[],
  anchorId: string,
  item: OutlineItem,
): OutlineItem[] {
  const index = items.findIndex((existing) => existing.id === anchorId);
  if (index === -1) return [...items, item];
  return [...items.slice(0, index + 1), item, ...items.slice(index + 1)];
}

/**
 * Resolve one drop. Pure — same inputs always produce the same output, no
 * mutation of `items`. See the module doc comment for the full rule set.
 */
export function reorderOutline(
  items: OutlineItem[],
  event: OutlineDropEvent,
): OutlineDropResult {
  const { activeId, overId } = event;

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

  let targetContainer: string;
  if (!overItem) {
    targetContainer = ROOT_CONTAINER;
  } else if (dragged.parentId === overItem.parentId) {
    targetContainer = overItem.parentId;
  } else if (overItem.kind === 'chapter' || overItem.kind === 'scene') {
    targetContainer = overItem.id;
  } else {
    targetContainer = overItem.parentId;
  }

  const nativeKind = nativeKindForContainer(items, targetContainer);
  const resultKind: OutlineItemKind =
    dragged.kind === 'act' ? 'act' : nativeKind;

  if (
    dragged.kind === 'chapter' &&
    resultKind !== 'chapter' &&
    hasChildren(items, dragged.id)
  ) {
    return {
      type: 'rejected',
      reason:
        'This chapter has scenes under it and cannot be nested into another item.',
    };
  }

  const { rest } = removeItem(items, activeId);
  const movedItem: OutlineItem = {
    ...dragged,
    kind: resultKind,
    parentId: targetContainer,
  };

  const next = overItem
    ? insertAfter(rest, overId, movedItem)
    : [...rest, movedItem];

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
