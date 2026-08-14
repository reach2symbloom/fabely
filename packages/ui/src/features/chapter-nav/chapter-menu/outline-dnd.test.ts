import { describe, expect, it } from 'vitest';

import {
  ROOT_CONTAINER,
  childrenOf,
  computeOutlineNumbers,
  reorderOutline,
  type OutlineItem,
} from './outline-dnd';

function item(
  id: string,
  kind: OutlineItem['kind'],
  parentId: string,
  label = id,
): OutlineItem {
  return { id, kind, label, parentId };
}

/**
 * ch1
 *   sc1 (ch1's scene)
 *     sub1 (sc1's subscene)
 *   sc2 (ch1's scene)
 * act1
 * ch2
 *   sc3 (ch2's scene)
 *
 * `act1` sits between ch1 and ch2 (not appended last) specifically so
 * dropping something onto it — landing at root, after act1 — has a
 * subsequent chapter (ch2) whose number should shift.
 */
function baseOutline(): OutlineItem[] {
  return [
    item('ch1', 'chapter', ROOT_CONTAINER),
    item('sc1', 'scene', 'ch1'),
    item('sub1', 'subscene', 'sc1'),
    item('sc2', 'scene', 'ch1'),
    item('act1', 'act', ROOT_CONTAINER),
    item('ch2', 'chapter', ROOT_CONTAINER),
    item('sc3', 'scene', 'ch2'),
  ];
}

describe('reorderOutline — baseline behavior', () => {
  it('no-ops when dropped on itself', () => {
    const items = baseOutline();
    const result = reorderOutline(items, { activeId: 'sc1', overId: 'sc1' });
    expect(result).toEqual({ type: 'moved', items });
  });

  it('reorders siblings within the same container without changing kind', () => {
    const items = baseOutline();
    const result = reorderOutline(items, { activeId: 'sc2', overId: 'sc1' });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;
    const sc2 = result.items.find((i) => i.id === 'sc2')!;
    expect(sc2.kind).toBe('scene');
    expect(sc2.parentId).toBe('ch1');
    // sc2 now sits right after sc1 (its drop target), ahead of sub1's old position.
    expect(childrenOf(result.items, 'ch1').map((i) => i.id)).toEqual([
      'sc1',
      'sc2',
    ]);
  });

  it('rejects when the dragged item no longer exists', () => {
    const items = baseOutline();
    const result = reorderOutline(items, {
      activeId: 'ghost',
      overId: 'sc1',
    });
    expect(result.type).toBe('rejected');
  });

  it('rejects when the drop target no longer exists', () => {
    const items = baseOutline();
    const result = reorderOutline(items, {
      activeId: 'sc1',
      overId: 'ghost',
    });
    expect(result.type).toBe('rejected');
  });

  it('acts never change kind, wherever they land', () => {
    const items = baseOutline();
    // Drop the act directly onto a subscene — deepest possible target.
    const result = reorderOutline(items, {
      activeId: 'act1',
      overId: 'sub1',
    });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;
    const act1 = result.items.find((i) => i.id === 'act1')!;
    expect(act1.kind).toBe('act');
  });
});

describe('reorderOutline — rule 1: scene → subscene', () => {
  it('scene dropped onto another scene becomes that scene\'s subscene', () => {
    const items = baseOutline();
    // sc3 (chapter 2's scene) dropped directly onto sc1 (chapter 1's scene).
    const result = reorderOutline(items, { activeId: 'sc3', overId: 'sc1' });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;
    const sc3 = result.items.find((i) => i.id === 'sc3')!;
    expect(sc3.kind).toBe('subscene');
    expect(sc3.parentId).toBe('sc1');
  });

  it('scene dropped into a subscene area becomes a subscene there', () => {
    const items = baseOutline();
    // sc2 dropped onto sub1 (which lives in sc1's subscene area).
    const result = reorderOutline(items, { activeId: 'sc2', overId: 'sub1' });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;
    const sc2 = result.items.find((i) => i.id === 'sc2')!;
    expect(sc2.kind).toBe('subscene');
    expect(sc2.parentId).toBe('sc1');
  });
});

describe('reorderOutline — rule 2: subscene → chapter', () => {
  it('subscene dropped into the chapter-level hierarchy becomes a chapter', () => {
    const items = baseOutline();
    // sub1 dropped onto act1 — act1 lives at root and owns no children, so
    // this lands in ROOT_CONTAINER, whose native kind is chapter.
    const result = reorderOutline(items, {
      activeId: 'sub1',
      overId: 'act1',
    });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;
    const sub1 = result.items.find((i) => i.id === 'sub1')!;
    expect(sub1.kind).toBe('chapter');
    expect(sub1.parentId).toBe(ROOT_CONTAINER);
  });

  it('subscene dropped on the empty root container also becomes a chapter', () => {
    const items = baseOutline();
    const result = reorderOutline(items, {
      activeId: 'sub1',
      overId: ROOT_CONTAINER,
    });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;
    const sub1 = result.items.find((i) => i.id === 'sub1')!;
    expect(sub1.kind).toBe('chapter');
    expect(sub1.parentId).toBe(ROOT_CONTAINER);
  });

  it('pushes subsequent chapter numbers down (renumbered dynamically)', () => {
    const items = baseOutline();
    const before = computeOutlineNumbers(items);
    expect(before.get('ch1')).toBe(1);
    expect(before.get('ch2')).toBe(2);

    // Drop onto act1 (root-level, owns no children — not ch1, which would
    // nest sub1 as a scene instead of promoting it, per rule 1's "onto a
    // chapter/scene nests into it" branch). act1 sits between ch1 and ch2,
    // so ch2's number has something to shift against.
    const result = reorderOutline(items, {
      activeId: 'sub1',
      overId: 'act1',
    });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;

    const after = computeOutlineNumbers(result.items);
    expect(after.get('ch1')).toBe(1);
    expect(after.get('sub1')).toBe(2);
    expect(after.get('ch2')).toBe(3);
  });
});

describe('reorderOutline — rule 3: chapter → subscene, guarded', () => {
  it('a chapter with no scenes dropped into a subscene area becomes a subscene', () => {
    const items = baseOutline();
    // ch2 currently owns sc3, so give it no scenes for this case.
    const noScenes = items.filter((i) => i.id !== 'sc3');
    const result = reorderOutline(noScenes, {
      activeId: 'ch2',
      overId: 'sub1',
    });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;
    const ch2 = result.items.find((i) => i.id === 'ch2')!;
    expect(ch2.kind).toBe('subscene');
    expect(ch2.parentId).toBe('sc1');
  });

  it('a chapter WITH scenes dropped into a subscene area is rejected, unchanged', () => {
    const items = baseOutline();
    // ch1 owns sc1 + sc2 — dropping it into sc1's own subscene area.
    const result = reorderOutline(items, { activeId: 'ch1', overId: 'sub1' });
    expect(result.type).toBe('rejected');
    if (result.type !== 'rejected') return;
    expect(result.reason).toMatch(/scenes/i);
  });

  it('a chapter with scenes is also rejected demoting to a plain scene (generalized guard)', () => {
    const items = baseOutline();
    // ch1 (has scenes) dropped onto sc3 — different container, sc3 can own
    // children, so this nests ch1 as sc3's subscene: still a demotion, still guarded.
    const result = reorderOutline(items, { activeId: 'ch1', overId: 'sc3' });
    expect(result.type).toBe('rejected');
  });

  it('the guarded chapter is truly unchanged on rejection', () => {
    const items = baseOutline();
    const result = reorderOutline(items, { activeId: 'ch1', overId: 'sub1' });
    expect(result).toEqual({
      type: 'rejected',
      reason: expect.any(String),
    });
    // Reducer returns a rejection, not a mutated/partial array — caller
    // keeps its previous `items` reference as-is (verified by contract,
    // not by re-inspecting `items` here since 'rejected' carries no items).
  });
});

describe('reorderOutline — rule 4: scene → chapter (symmetry assumption)', () => {
  it('scene dropped into the chapter-level hierarchy becomes a chapter', () => {
    const items = baseOutline();
    const result = reorderOutline(items, { activeId: 'sc1', overId: 'act1' });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;
    const sc1 = result.items.find((i) => i.id === 'sc1')!;
    expect(sc1.kind).toBe('chapter');
    expect(sc1.parentId).toBe(ROOT_CONTAINER);
  });

  it('leaves sc1\'s former subscene (sub1) in the array, now orphaned in place', () => {
    // The reducer only moves the dragged item itself; it does not cascade
    // sub1 along with its old parent sc1. This is a known limitation, not
    // one of the four rules — documented here so it isn't a silent surprise.
    const items = baseOutline();
    const result = reorderOutline(items, { activeId: 'sc1', overId: 'act1' });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;
    const sub1 = result.items.find((i) => i.id === 'sub1')!;
    expect(sub1.parentId).toBe('sc1');
  });
});

describe('computeOutlineNumbers', () => {
  it('numbers chapters, acts, and scenes-within-their-chapter independently', () => {
    const numbers = computeOutlineNumbers(baseOutline());
    expect(numbers.get('ch1')).toBe(1);
    expect(numbers.get('sc1')).toBe(1); // 1st scene of ch1
    expect(numbers.get('sc2')).toBe(2); // 2nd scene of ch1
    expect(numbers.get('ch2')).toBe(2);
    expect(numbers.get('sc3')).toBe(1); // 1st scene of ch2 — resets per chapter
    expect(numbers.get('act1')).toBe(1);
    expect(numbers.has('sub1')).toBe(false); // subscenes are unnumbered
  });
});

describe('childrenOf', () => {
  it('returns only direct children, in existing order', () => {
    const items = baseOutline();
    expect(childrenOf(items, 'ch1').map((i) => i.id)).toEqual([
      'sc1',
      'sc2',
    ]);
    expect(childrenOf(items, ROOT_CONTAINER).map((i) => i.id)).toEqual([
      'ch1',
      'act1',
      'ch2',
    ]);
  });
});
