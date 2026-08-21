# Paragraph List

Composes [Paragraph Block](../../../molecules/paragraph-block/README.md)
(molecule) and [Drop Target](../../../atoms/drop-target/README.md) (atom)
into an actual drag-reorderable manuscript. This is the only layer that
owns ordering — an individual Paragraph Block never decides where it sits
relative to its neighbors, it only reports "I was clicked" / "I started
being dragged" / "my text was clicked" via
`onSelect`/`onDragStart`/`onTextClick`; this list decides what those mean
for the array and for selection.

## Sources

Composition of Figma [Paragraph block](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16129-377)
(`16129:377`) and [Paragraph drop line](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16372-4438)
(`16372:4438`) — no Figma frame of its own for the composed list.

## `@dnd-kit/core`, not `@dnd-kit/sortable`

Same choice as Chapter Menu's outline drag-and-drop (`use-outline-dnd-kit.ts`),
and for the same reason: `useSortable()` auto-reflows every sibling to make
room as you drag, which would fight the explicit `DropTarget` this list
renders at the prospective insertion gap — the whole point of that atom is
*it's* the thing that visibly opens, not the surrounding rows sliding
apart. Built on `useDraggable`/`useDroppable` instead, with the actual
reorder computed by a small pure reducer (`paragraph-list-dnd.ts`) that
never imports dnd-kit — same split as `outline-dnd.ts`.

## Which gap is active: live pointer position, live row rects — not dnd-kit's cache, not the dragged item's own geometry

`onDragMove` resolves a gap index by walking the *current* rows in order
(`nearestGapIndex`, `use-paragraph-list-dnd-kit.ts`) and finding the one
whose freshly-measured `getBoundingClientRect()` actually contains the
pointer, splitting at *that row's own* vertical midpoint — top half → the
gap ahead of it, bottom half → the gap after. Two things this deliberately
isn't:

- **Not `active.rect.current.translated`** (the dragged item's own ghost
  rect, translated by dnd-kit's drag delta). That rect's *top* edge is the
  top of the whole dragged block — for anything taller than a few px, well
  above wherever the pointer actually is inside it, which put the resolved
  gap however far that edge sat above the cursor. The real pointer
  position (`activatorEvent.clientY + delta.y` — dnd-kit's `delta` is
  cumulative since drag start, not per-frame) has no such offset.
- **Not dnd-kit's own droppable `rect` cache** (`event.over.rect`).
  Droppable rects only re-measure on specific triggers, not every
  animation frame — comparing against them while a row is mid-`layout`
  reflow (e.g. right after the source row's own collapse moves its
  neighbors) can read a pre-reflow position. Each row's own live DOM node
  (`getRowNode`, refs Paragraph List already owns) is measured fresh on
  every move instead.

A row this list is currently dragging has already collapsed to ~0 height
(see below), so it never meaningfully "contains" the pointer — it's walked
past on the way, same as if its former geometry weren't part of this
calculation at all.

## `DropTarget` is absolutely positioned — a live-measuring feedback loop, not a design preference

A more literal reading of "surrounding blocks make room for the target"
would make `DropTarget` a normal flex sibling that physically grows and
pushes the next row down while active — genuinely tried. It doesn't work
together with the pointer-driven resolution above: activating a gap
push-opens real space above the next row, which moves that row, which
changes what the *very next* `getBoundingClientRect()` reads for it, which
can flip the resolved gap back, closing the space, moving the row back,
flipping the gap again — a feedback loop between the thing being measured
and the thing doing the measuring. An absolutely positioned `DropTarget`
(`bottom-full` inside each row's own `relative` wrapper) can render at any
height without moving anything it sits on top of, which is what actually
removes the loop — a smarter hysteresis value doesn't, since the geometry
itself is what's unstable. "Making room" instead comes entirely from the
*dragged* row's own collapse (below) plus the sibling `layout` reflow that
follows it — genuinely stable, since `isDragging` is a plain boolean, not
a value this same calculation reads back.

## Sibling reflow is `layout`, not a manual y-offset

Each row wrapper is `motion.div layout` (Motion's FLIP tracking, timed
with `LAYOUT_REFLOW` from `@/lib/motion` — `EASE_EMPHASIZED`, no spring,
180ms; front-loaded so most of the motion reads in the first beat rather
than decelerating evenly the whole way, which is what makes it read as
both faster and smoother than a generic ease-out). When the array
reorders — drag-drop or keyboard, same `onItemsChange` either way — every
displaced row's wrapper measures its
own old vs. new position across the render and glides between them
automatically; nothing here computes a translateY by hand. This depends
on rows keeping a stable `key={item.id}` (never index) through the
`.map()` — an index key would let React match the wrong component
instance to the wrong position after a reorder and silently break FLIP
tracking, not just misattribute state.

## Keyboard reordering reuses `reorderParagraphs` directly

`moveParagraphByOffset` (`paragraph-list-dnd.ts`) is the *same* reducer
pointer-drag calls, just computing the adjacent gap index directly
(`activeIndex - 1` / `activeIndex + 2`) instead of from pointer geometry —
one underlying order, two ways to change it. Wired as a plain `onKeyDown`
on the grip handle (via `handleProps`, composed with — not replacing —
dnd-kit's own `listeners.onKeyDown`, which still handles Space/Enter to
activate dnd-kit's separate keyboard-drag mode): `ArrowUp`/`ArrowDown`
move the *selected* row one position, `preventDefault`ed so the page
doesn't scroll, no-op past either boundary (`moveParagraphByOffset`
returns the same array reference). Only active when nothing is currently
mid pointer-drag (`isAnyDragging`), so a keyboard-drag in progress isn't
double-handled by both dnd-kit's own arrow-key movement and this. Moving
keeps the row `selected` and DOM focus stays on its handle (`key={item.id}`
again — same instance, new position), so repeated arrow presses keep
moving the same row. An `aria-live="polite"` region announces
`"Moved paragraph to position N of M."` on every real move (keyboard or
pointer).

## Selection clears on text click and on click-outside

Clicking the *selected* row's own paragraph text (`onTextClick` — see
Paragraph Block's README) drops `selected` — the same click that starts
editing that text shouldn't leave block-level selection chrome showing.
Clicking anywhere else while a row is selected — another row's text
(which has no click-to-select of its own), blank space, anything outside
the selected row's DOM subtree — also clears it, via one document-level
`pointerdown` listener checking `Node.contains()` against a ref map keyed
by paragraph id. Clicking a *different* row's grip handle still selects
that row normally (its own `onSelect` firing on release); the two
mechanisms don't conflict; they just briefly disagree between one row's
pointerdown and the new row's pointerup, imperceptibly.

## `DragOverlay` is translucent so the rail shows through it

The dragged block's floating `DragOverlay` copy uses a 50%-alpha `--card`
background (`color-mix`) plus `backdrop-blur-[3px]`, overriding — not
stacking onto — `drag` chrome's normal opaque fill (`cn`'s tailwind-merge
resolves same-group `bg-[...]` utilities to the later one). Border and
shadow are untouched, so the lifted-card edge reads exactly as readable as
any other `drag`-state block; only the surface is translucent, and the
text itself stays full-opacity — this is a background treatment, not a
block-opacity one. The `DropTarget` rail sits in normal page flow,
underneath the portal-rendered `DragOverlay`, so the insertion rail —
chevron included — stays visible through the floating block as it passes
over it.
Both `DropTarget`s here render with `chevron` — see that atom's README for
why it's off by default (Chapter Menu doesn't use it) but on here.

## The dragged row's own slot collapses; the `DragOverlay` copy carries `drag` chrome

The row actually being dragged doesn't stay in place as a dimmed
placeholder — its `ParagraphBlock` collapses to zero height the instant
`isDragging` flips true (a `grid-template-rows` `1fr` → `0fr` tween, same
technique `DropTarget` itself uses — chosen over animating `height`
directly, or trusting `layout`'s own size-interpolation, so the paragraph
text doesn't visibly squish mid-collapse), and its neighbors close that
space immediately via the same `layout` tracking everything else uses.
Nothing here waits for the pointer to travel the block's own height first
— `isDragging` becomes true right at dnd-kit's activation distance (`8px`,
below), so the "this block just got picked up" feedback is close to
instant, closer to how a block editor like Notion detaches a block from
its slot than to a placeholder that lingers until drop. A separate
`ParagraphBlock state="drag"` renders inside dnd-kit's `DragOverlay` and
follows the pointer instead — that's the only place `drag` chrome shows;
the collapsing original never switches to it. Canceling a drag (`Escape`,
or dropping somewhere invalid) flips `isDragging` back to `false` on its
own, so the collapse just reverses — no separate "restore" path to keep in
sync.

## `onDragStart`/`onSelect` (Paragraph Block) vs. dnd-kit's own drag

These answer different questions and both fire for the same gesture on
purpose. Paragraph Block's own press-vs-drag detector (composed with
dnd-kit's `listeners` via `handleProps`, see that component's README)
drives what the row should visually *look like* (`selected` after any
click or drop); dnd-kit's `PointerSensor` — activation distance `8`,
matching Paragraph Block's own threshold so the two never disagree about
whether a given press became a drag — separately drives whether an actual
reorder is in progress. A plain click never crosses either threshold, so
dnd-kit's own `onDragStart` never fires for one; Paragraph Block's
`onSelect` firing directly is the only signal this list gets for "the
handle was clicked" in that case.

## Enter splits a block; Backspace at offset 0 merges it into the previous one

Both go through Paragraph Block's own callbacks (`onEnter(caretOffset)`,
`onBackspaceAtStart`) — that component only ever reports *where* the
caret was, never touches the array itself; `handleEnter`/
`handleBackspaceAtStart` here own the actual mutation, same "report the
interaction, caller decides what it means" shape as everything else in
this list.

**Split**: the current block keeps its id and everything before the
caret; a new block (`crypto.randomUUID()`) gets everything from the caret
onward and is spliced in right after. Caret-at-offset-0 (nothing before
it) and caret-at-the-end (nothing after it) both fall out of the same
slice logic without special-casing — an "empty before" or "empty after"
half is just a valid, boring slice result.

**Merge**: the previous block keeps its id and gains the current block's
text appended (with exactly one space inserted if neither side of the
join already has whitespace there, so two words never run together and a
merge never lands straight after the previous block's own closing
punctuation); the current block's id is removed from the array entirely.
First block in the list: no previous block to merge into, so this is a
structural no-op — Paragraph Block already didn't touch the text either,
since it only calls `onBackspaceAtStart` for a *collapsed* caret genuinely
at `0` (a real selection starting at `0` deletes that selection instead,
the browser's own default).

**Refocusing an existing, already-mounted block**: the split's new block
is freshly created, so Paragraph Block's own mount-time focus effect
handles it for free — but the merge's target (the *previous* block) was
already mounted before the merge, same React instance throughout. Its
`autoFocus`/`autoFocusOffset` props are read by a `useEffect` keyed on
those two values, not `[]`, specifically so a caller can re-request focus
on a block that never unmounted (see Paragraph Block's own README). The
offset lands exactly at the join point — the previous block's own former
length — regardless of whether a joining space got inserted, so the caret
sits right at the seam either way.

## API

| Prop | Notes |
| --- | --- |
| `items` | `{ id, text }[]` |
| `onItemsChange` | Fires with the reordered array on a real drop, split, or merge; this list doesn't own array state itself |
| `className` | Merged onto the row container |

Selection (`selectedId`) and the pending focus request (`autoFocusId`/
`autoFocusOffset`) are internal, not props — nothing outside this list
needs to know or set them today. Lift them if that changes.

## Tokens

| Concern | Foundations |
| --- | --- |
| Row gap (resting) | `-4px` (`ROW_OVERLAP`) — a deliberate slight overlap into each block's own transparent border/padding, not visible content |
| Drag activation distance | `8px` (matches Paragraph Block's own click/drag threshold) |
| Sibling reflow | `LAYOUT_REFLOW` (`@/lib/motion`) — `EASE_EMPHASIZED`, 180ms, no spring |
| Drag overlay background | `color-mix(in srgb, var(--card) 50%, transparent)` + `backdrop-blur-[3px]` |
