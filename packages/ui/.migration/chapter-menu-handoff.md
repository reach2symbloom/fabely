# Chapter Menu — playground/drag-and-drop unification handoff

Checkpoint commit: `wip: chapter menu alignment fix, pre-unification checkpoint`
on `ft-chapter-menu`. `tsc` and `pnpm check:tokens` both pass clean at this
commit (verified, not fixed — nothing was broken).

## Where this left off

Mid-rewrite of `InteractiveChapterMenu` in
`packages/ui/src/features/chapter-nav/chapter-menu/ChapterMenu.stories.tsx`,
stopped before any of the new render logic was written. The import line was
already updated (added `childrenOf`, `OutlineItemKind` to the `outline-dnd`
import) but the function body is still the OLD implementation. That import
change is harmless as-is (unused named imports don't fail `tsc`/build) and
doesn't need reverting.

## The decision that triggered this

Two parallel outline data models currently exist in the same story file:

1. **Nested tree model** (`type OutlineRow`, `OutlineScene` — chapters own
   a `scenes?: OutlineScene[]`, scenes own `subscenes?`). Used by
   `InteractiveChapterMenu`, which backs both the **Interactive** story and
   the Overview page's Playground (Acts=False slot). Has insert-chapter/act
   (gap popovers + footer buttons, focus-after-insert), the header cycle
   switch (Chapters only / Scenes / Full outline — bulk expand/collapse),
   and per-chapter chevron collapse. **Has no drag-and-drop.**

2. **Flat model** (`OutlineItem` in `outline-dnd.ts` — every row, at any
   depth, is a sibling in one array; hierarchy is `parentId`:
   `ROOT_CONTAINER` for top-level chapters/acts, a chapter's id for its
   scenes, a scene's id for its subscenes). Used only by the separate
   `DragAndDropOutline` component (**Drag to reorder** story). Has full
   pointer + keyboard drag via `useOutlineDragAndDrop`
   (`use-outline-dnd-kit.ts`) driving the pure reducer
   (`reorderOutline` in `outline-dnd.ts`). Does **not** have insert,
   cycle switch, or chevron collapse — every row is always rendered flat
   and fully expanded, seeded with a small 9-item outline.

**Decision (confirmed this session, not yet executed): retire the nested
tree model.** Migrate `InteractiveChapterMenu` onto the flat `OutlineItem[]`
model so the Interactive story / Playground gets drag-and-drop too, instead
of it only existing in an isolated demo. The reducer and its type-coercion
rules are written against the flat/`parentId` shape — that's the shape that
needs to reach the real interactive surface, not just a side demo.

**Why the nested branch-rail visual survives this**: dnd-kit's
`useSortable` reads actual rendered DOM rects for collision detection, not
tree structure — it does not require flat sibling DOM nesting. So the
existing `ChapterMenuListItem` nesting (scenes passed as React `children`
of a chapter, subscenes as `children` of a scene — this is what draws the
branch rail / chevron / indentation) can be **preserved as-is**. The only
change is *where the grouping data comes from*: instead of reading a
hand-nested `row.scenes[].subscenes[]`, group the flat array at render time
via `childrenOf(items, parentId)` (already exported from `outline-dnd.ts`).
Each row — chapter, scene, subscene, or act, regardless of nesting depth —
still needs its own `DraggableOutlineRow` wrapper (already defined lower in
the same file, reused as-is, not duplicated) around it for the drag to
work.

## Concrete plan for the rewrite

All in `ChapterMenu.stories.tsx`. No other file needs to change —
`outline-dnd.ts` and `use-outline-dnd-kit.ts` already export everything
needed (`OutlineItem`, `OutlineItemKind`, `ROOT_CONTAINER`, `childrenOf`,
`computeOutlineNumbers`, `reorderOutline`, `useOutlineDragAndDrop`), and
`ChapterMenuListItem.tsx` doesn't care whether its `children` came from a
tree or were reconstructed from a flat list at render time.

1. **Delete** `type OutlineRow` and `makeSeedRows()`. **Keep** `OutlineScene`
   (still useful as an authoring shape for seed data), `CHAPTER_SCENES`,
   and `CHAPTER_DEFAULT_EXPANDED` (Ch. 8 starts open / Ch. 12 starts closed
   — matches the Figma reference, still true).

2. **New seed function** `makeInteractiveSeed()` returning
   `{ items: OutlineItem[]; defaultExpandedIds: Set<string> }`: walk
   `DEMO_CHAPTER_TITLES`, push a chapter `OutlineItem` per title
   (`parentId: ROOT_CONTAINER`), and for any chapter with a
   `CHAPTER_SCENES[n]` entry, push its scene items (`parentId`: that
   chapter's generated id) and their subscene items (`parentId`: that
   scene's generated id), collecting the chapter's id into
   `defaultExpandedIds` when `CHAPTER_DEFAULT_EXPANDED[n]` is true. Reuse
   the existing `makeOutlineRowId()` id generator (unchanged).

3. **State**, replacing `rows`/`makeSeedRows`:
   - `items: OutlineItem[]` — seeded once via
     `useState(() => makeInteractiveSeed().items)`. The `defaultExpandedIds`
     half of the seed result needs to survive to initialize
     `chapterExpanded` below without being recomputed on every render —
     memoize the whole seed once (e.g. a `useRef` holding
     `makeInteractiveSeed()` computed lazily on first read, or a module
     level once-per-mount pattern) rather than calling
     `makeInteractiveSeed()` twice from two separate `useState` initializers
     (that would generate two different sets of ids for the "same" chapters
     and silently desync).
   - `chapterExpanded: Record<string, boolean>` — unchanged concept, now
     seeded from `defaultExpandedIds` instead of a `row.defaultExpanded`
     field.
   - `mode`, `focusRowId`, `rowNodes` — unchanged, same as today.
   - **New**: `rejectedReason: string | null` state, and wire
     `useOutlineDragAndDrop({ items, onItemsChange, onRejected })` exactly
     like `DragAndDropOutline` already does lower in the file — copy that
     pattern (including the `SHAKE_KEYFRAMES` `<style>` tag and the
     `role="alert"` message paragraph; both already exist in this file and
     should be reused, not redefined).

4. **`insertRow`**: currently splices into the flat `rows` array at a
   literal index. Under the flat model, scenes/subscenes are siblings in
   the *same* array as chapters/acts, so "insert as the Nth item" no longer
   means "insert as the Nth *top-level* item" — need a small helper that
   finds the Nth item whose `parentId === ROOT_CONTAINER` and splices
   immediately before its absolute index in the full array (or appends at
   the very end if the position is beyond the current top-level count).
   The footer's `onAddChapter`/`onAddAct` (currently
   `insertRow(rows.length, kind)`) need the equivalent "append after the
   last top-level item" call using this new helper, not raw `items.length`.

5. **`handleModeChange`** bulk-apply: replace the `row.scenes?.length`
   check with `childrenOf(items, chapterId).length > 0` for every chapter
   in `items`.

6. **Render**: iterate top-level items (`items.filter(i => i.parentId ===
   ROOT_CONTAINER)`, keeping their relative order), rendering chapter/act
   rows with `insertGap(...)` between them exactly as today. For each
   chapter, get `childrenOf(items, chapter.id)` for its scenes and render
   them as nested `ChapterMenuListItem` children (unchanged JSX shape),
   each wrapped in `DraggableOutlineRow`; for each scene, get
   `childrenOf(items, scene.id)` for subscenes, rendered as nested children
   gated by `mode === 'full'` (unchanged), each also wrapped in
   `DraggableOutlineRow`. The chapter/act row itself is wrapped in
   `DraggableOutlineRow` too. Use `computeOutlineNumbers(items)` instead of
   the manually-incremented `chapterNumber`/`actIndex` counters — it
   already numbers scenes-within-chapter correctly and resets per chapter.

7. Wrap the rendered list in `<DndContext>` + `<SortableContext items=
   {items.map(i => i.id)} strategy={verticalListSortingStrategy}>`, same
   as `DragAndDropOutline`. A `<DragOverlay>` is optional polish, not
   required for correctness (the flat demo has one; nice for parity but
   skippable if time-boxed).

8. Update the `Interactive` story export if its render signature changes,
   and leave `DragAndDrop` (**Drag to reorder** story) untouched — it's a
   smaller, focused demonstration of just the reducer's coercion rules and
   doesn't need to go away.

## The other open item from the same report

The user's report that triggered this was two things: "drag and drop not
working on playground" (→ the plan above) **and** "many stories lose
proportion of overall card." That second one was investigated this session
and not resolved:

- Checked the Card height-cap math (`max-h-[calc(100dvh-var(--spacing-7xl))]`
  on `ChapterMenu.tsx`'s root, added earlier this session) directly via
  Playwright on both the Overview page and the `DragAndDrop` story — card
  heights matched the expected cap exactly (e.g. 804px at a 900px-tall
  viewport, 96px inset), and screenshots of both looked visually correct,
  no obvious squishing or distortion found.
- Current best guess: the complaint may be about natural inconsistency
  between the two demos' content sizes (9-row flat demo vs. 15-chapter
  nested demo) rather than a rendering bug — which the unification above
  may resolve on its own by removing that mismatch from the primary
  Interactive/Playground surface.
- **Re-examine after the unification lands**, with fresh screenshots, before
  spending more time on it — don't assume it's fixed, but don't chase it
  further blind either.

## Story exports for reference (as of the checkpoint commit)

`Overview`, `ActsFalse`, `ActsSubscenes`, `ActsEmpty`, `Interactive` (the
one being migrated), `DragAndDrop` (standalone flat demo, staying as-is).
