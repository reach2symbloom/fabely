import { describe, expect, it } from 'vitest';

import {
  ROOT_CONTAINER,
  childrenOf,
  computeOutlineNumbers,
  isOutlineDropIntoOwnSubtree,
  isOutlineDropNoOp,
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
 * dropping something onto it — landing at root — has a subsequent chapter
 * (ch2) whose number should shift.
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

describe('isOutlineDropNoOp', () => {
  it('hides the boundaries directly before and after the dragged item', () => {
    const items = baseOutline();
    expect(
      isOutlineDropNoOp(items, {
        activeId: 'act1',
        overId: 'act1',
        placement: 'before',
      }),
    ).toBe(true);
    expect(
      isOutlineDropNoOp(items, {
        activeId: 'act1',
        overId: 'ch2',
        placement: 'before',
      }),
    ).toBe(true);
  });

  it('keeps the first boundary beyond a neighbouring sibling available', () => {
    const items = baseOutline();
    expect(
      isOutlineDropNoOp(items, {
        activeId: 'ch1',
        overId: 'ch2',
        placement: 'before',
      }),
    ).toBe(false);
  });
});

describe('isOutlineDropIntoOwnSubtree', () => {
  it('blocks the dragged item and every lower-order structure it owns', () => {
    const items = baseOutline();

    expect(isOutlineDropIntoOwnSubtree(items, 'ch1', 'ch1')).toBe(true);
    expect(isOutlineDropIntoOwnSubtree(items, 'ch1', 'sc1')).toBe(true);
    expect(isOutlineDropIntoOwnSubtree(items, 'ch1', 'sub1')).toBe(true);
    expect(isOutlineDropIntoOwnSubtree(items, 'sc1', 'sub1')).toBe(true);
  });

  it('keeps targets outside the dragged subtree available', () => {
    const items = baseOutline();

    expect(isOutlineDropIntoOwnSubtree(items, 'ch1', 'ch2')).toBe(false);
    expect(isOutlineDropIntoOwnSubtree(items, 'sc1', 'sc2')).toBe(false);
    expect(isOutlineDropIntoOwnSubtree(items, 'ch1', ROOT_CONTAINER)).toBe(
      false,
    );
  });
});

describe('reorderOutline — baseline behavior', () => {
  it('no-ops when dropped on itself', () => {
    const items = baseOutline();
    const result = reorderOutline(items, {
      activeId: 'sc1',
      overId: 'sc1',
      placement: 'before',
    });
    expect(result).toEqual({ type: 'moved', items });
  });

  it('placement "before" reorders as a sibling ahead of the target, same container', () => {
    const items = baseOutline();
    const result = reorderOutline(items, {
      activeId: 'sc2',
      overId: 'sc1',
      placement: 'before',
    });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;
    const sc2 = result.items.find((i) => i.id === 'sc2')!;
    expect(sc2.kind).toBe('scene');
    expect(sc2.parentId).toBe('ch1');
    expect(childrenOf(result.items, 'ch1').map((i) => i.id)).toEqual([
      'sc2',
      'sc1',
    ]);
  });

  it('rejects when the dragged item no longer exists', () => {
    const items = baseOutline();
    const result = reorderOutline(items, {
      activeId: 'ghost',
      overId: 'sc1',
      placement: 'before',
    });
    expect(result.type).toBe('rejected');
  });

  it('rejects when the drop target no longer exists', () => {
    const items = baseOutline();
    const result = reorderOutline(items, {
      activeId: 'sc1',
      overId: 'ghost',
      placement: 'before',
    });
    expect(result.type).toBe('rejected');
  });

  it('rejects placing a parent before one of its own descendants', () => {
    const result = reorderOutline(baseOutline(), {
      activeId: 'ch1',
      overId: 'sc1',
      placement: 'before',
    });
    expect(result).toEqual({
      type: 'rejected',
      reason: 'An outline item cannot be moved into its own contents.',
    });
  });

  it('rejects nesting a parent into one of its own descendants', () => {
    const result = reorderOutline(baseOutline(), {
      activeId: 'ch1',
      overId: 'sc1',
      placement: 'nest',
    });
    expect(result).toEqual({
      type: 'rejected',
      reason: 'An outline item cannot be moved into its own contents.',
    });
  });

  it('acts never change kind, wherever they land', () => {
    const items = baseOutline();
    // Drop the act directly onto a subscene — deepest possible target.
    const result = reorderOutline(items, {
      activeId: 'act1',
      overId: 'sub1',
      placement: 'nest',
    });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;
    const act1 = result.items.find((i) => i.id === 'act1')!;
    expect(act1.kind).toBe('act');
  });

  it('"nest" on a target that can\'t own children (subscene/act) falls back to a sibling placement', () => {
    const items = baseOutline();
    // sub1 can't own children — nest is requested but should degrade to "before".
    const result = reorderOutline(items, {
      activeId: 'sc2',
      overId: 'sub1',
      placement: 'nest',
    });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;
    const sc2 = result.items.find((i) => i.id === 'sc2')!;
    // Falls back to sub1's own container (sc1's subscene area) — not nested INTO sub1.
    expect(sc2.parentId).toBe('sc1');
    expect(sc2.kind).toBe('subscene');
  });
});

describe('reorderOutline — rule 1: scene → subscene', () => {
  it('scene nested onto another scene becomes that scene\'s subscene', () => {
    const items = baseOutline();
    const result = reorderOutline(items, {
      activeId: 'sc3',
      overId: 'sc1',
      placement: 'nest',
    });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;
    const sc3 = result.items.find((i) => i.id === 'sc3')!;
    expect(sc3.kind).toBe('subscene');
    expect(sc3.parentId).toBe('sc1');
  });

  it('scene dropped into a subscene area (before an existing subscene) becomes a subscene there', () => {
    const items = baseOutline();
    const result = reorderOutline(items, {
      activeId: 'sc2',
      overId: 'sub1',
      placement: 'before',
    });
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
    const result = reorderOutline(items, {
      activeId: 'sub1',
      overId: 'act1',
      placement: 'before',
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
      placement: 'before',
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

    const result = reorderOutline(items, {
      activeId: 'sub1',
      overId: 'act1',
      placement: 'before',
    });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;

    const after = computeOutlineNumbers(result.items);
    expect(after.get('ch1')).toBe(1);
    expect(after.get('sub1')).toBe(2);
    expect(after.get('ch2')).toBe(3);
  });
});

describe('reorderOutline — rule 3: chapter → subscene', () => {
  it('a chapter with no scenes dropped into a subscene area becomes a subscene', () => {
    const items = baseOutline();
    const noScenes = items.filter((i) => i.id !== 'sc3');
    const result = reorderOutline(noScenes, {
      activeId: 'ch2',
      overId: 'sub1',
      placement: 'before',
    });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;
    const ch2 = result.items.find((i) => i.id === 'ch2')!;
    expect(ch2.kind).toBe('subscene');
    expect(ch2.parentId).toBe('sc1');
  });
});

describe('reorderOutline — rule 4: scene → chapter (symmetry assumption)', () => {
  it('a scene with no subscenes dropped into the chapter-level hierarchy becomes a chapter', () => {
    const items = baseOutline();
    const result = reorderOutline(items, {
      activeId: 'sc3',
      overId: 'act1',
      placement: 'before',
    });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;
    const sc3 = result.items.find((i) => i.id === 'sc3')!;
    expect(sc3.kind).toBe('chapter');
    expect(sc3.parentId).toBe(ROOT_CONTAINER);
  });
});

describe('reorderOutline — chapter nested onto chapter (placement: "nest" — the case position-based placement exists for)', () => {
  it('dropping chapter A on the TOP HALF (placement "before") of chapter B just reorders them as siblings', () => {
    const items = baseOutline();
    const result = reorderOutline(items, {
      activeId: 'ch2',
      overId: 'ch1',
      placement: 'before',
    });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;
    const ch2 = result.items.find((i) => i.id === 'ch2')!;
    expect(ch2.kind).toBe('chapter');
    expect(ch2.parentId).toBe(ROOT_CONTAINER);
  });

  it('dropping chapter A on the BOTTOM HALF (placement "nest") of chapter B nests it as B\'s scene, cascading A\'s own scenes to subscenes', () => {
    const items = baseOutline();
    // ch2 owns only sc3 (a childless scene) — nesting it into ch1 makes it
    // ch1's scene; sc3 cascades down to become ch2's subscene.
    // depth check: scene(1) + sc3's relative depth(1) = 2 — fits exactly.
    const result = reorderOutline(items, {
      activeId: 'ch2',
      overId: 'ch1',
      placement: 'nest',
    });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;

    const ch2 = result.items.find((i) => i.id === 'ch2')!;
    expect(ch2.kind).toBe('scene');
    expect(ch2.parentId).toBe('ch1');

    const sc3 = result.items.find((i) => i.id === 'sc3')!;
    expect(sc3.kind).toBe('subscene');
    expect(sc3.parentId).toBe('ch2'); // still nested under ch2 — id references don't change
  });
});

describe('reorderOutline — cascading promotion (always clean, per the inverse rule)', () => {
  it('a scene with subscenes dragged to become a chapter has its subscenes promoted to scenes', () => {
    const items = baseOutline();
    const result = reorderOutline(items, {
      activeId: 'sc1',
      overId: 'act1',
      placement: 'before',
    });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;

    const sc1 = result.items.find((i) => i.id === 'sc1')!;
    expect(sc1.kind).toBe('chapter');
    expect(sc1.parentId).toBe(ROOT_CONTAINER);

    const sub1 = result.items.find((i) => i.id === 'sub1')!;
    expect(sub1.kind).toBe('scene'); // promoted, not left as a subscene
    expect(sub1.parentId).toBe('sc1');
  });

  it('promotion never needs confirmation, no matter how deep the subtree', () => {
    const items = [...baseOutline(), item('sub1b', 'subscene', 'sc1')];
    const result = reorderOutline(items, {
      activeId: 'sc1',
      overId: 'act1',
      placement: 'before',
    });
    expect(result.type).toBe('moved');
  });
});

describe('reorderOutline — overflow needs confirmation', () => {
  it('a chapter whose scenes have subscenes overflows when nested into another chapter', () => {
    const items = baseOutline();
    // ch1 owns sc1 (which owns sub1) + sc2. Nesting ch1 into ch2 would need
    // sc1/sc2 at depth 2 (fine) but sub1 at depth 3 (past subscene, the max).
    const result = reorderOutline(items, {
      activeId: 'ch1',
      overId: 'ch2',
      placement: 'nest',
    });
    expect(result.type).toBe('needs-confirmation');
    if (result.type !== 'needs-confirmation') return;
    expect(result.reason).toMatch(/chapter/i);
    expect(result.event).toEqual({
      activeId: 'ch1',
      overId: 'ch2',
      placement: 'nest',
    });
  });

  it('the same drop into a subscene area (an even deeper target) also needs confirmation', () => {
    const items = [
      ...baseOutline(),
      item('sub-external', 'subscene', 'sc3'),
    ];
    const result = reorderOutline(items, {
      activeId: 'ch1',
      overId: 'sub-external',
      placement: 'before',
    });
    expect(result.type).toBe('needs-confirmation');
  });

  it('declining (replaying without resolution) leaves the outline unchanged — same result again', () => {
    const items = baseOutline();
    const event = {
      activeId: 'ch1',
      overId: 'ch2',
      placement: 'nest' as const,
    };
    const first = reorderOutline(items, event);
    expect(first.type).toBe('needs-confirmation');
    // Original array untouched — reorderOutline never mutates its input.
    expect(items).toEqual(baseOutline());
    // Replaying the plain event (as if the user declined) reproduces the
    // identical needs-confirmation result — no hidden state, no partial
    // application.
    const second = reorderOutline(items, event);
    expect(second).toEqual(first);
  });

  it('confirming with resolution: "flatten" nests what fits and flattens what would overflow', () => {
    const items = baseOutline();
    const declined = reorderOutline(items, {
      activeId: 'ch1',
      overId: 'ch2',
      placement: 'nest',
    });
    expect(declined.type).toBe('needs-confirmation');
    if (declined.type !== 'needs-confirmation') return;

    const result = reorderOutline(items, {
      ...declined.event,
      resolution: 'flatten',
    });
    expect(result.type).toBe('moved');
    if (result.type !== 'moved') return;

    // ch1 becomes ch2's scene.
    const ch1 = result.items.find((i) => i.id === 'ch1')!;
    expect(ch1.kind).toBe('scene');
    expect(ch1.parentId).toBe('ch2');

    // sc1 + sc2 fit at the new depth (2 = subscene) — stay nested under ch1.
    const sc1 = result.items.find((i) => i.id === 'sc1')!;
    expect(sc1.kind).toBe('subscene');
    expect(sc1.parentId).toBe('ch1');
    const sc2 = result.items.find((i) => i.id === 'sc2')!;
    expect(sc2.kind).toBe('subscene');
    expect(sc2.parentId).toBe('ch1');

    // sub1 would overflow past subscene — flattened out to sit alongside
    // ch1 in ch1's new container (ch2), taking ch2's native child kind (scene).
    const sub1 = result.items.find((i) => i.id === 'sub1')!;
    expect(sub1.kind).toBe('scene');
    expect(sub1.parentId).toBe('ch2');
  });

  it('a chapter with scenes but no deeper subscenes never needs confirmation (the clean cascade case)', () => {
    const items = baseOutline();
    const shallow = items.filter((i) => i.id !== 'sub1'); // strip the one 3rd-level item
    const result = reorderOutline(shallow, {
      activeId: 'ch1',
      overId: 'ch2',
      placement: 'nest',
    });
    expect(result.type).toBe('moved');
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
