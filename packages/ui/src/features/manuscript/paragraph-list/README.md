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

## Which gap is active comes from row geometry, not a droppable per gap

Every gap in the list mounts a `DropTarget`, but making each one its own
`useDroppable` zone doesn't work well at rest — an inactive `DropTarget` is
visually (and hit-box-wise) close to 0px tall, a near-impossible pointer
target. Instead, each *row* is both draggable and droppable (`useParagraphRow`),
and `onDragMove` resolves a gap index from geometry — the dragged ghost's
top edge vs. the vertical midpoint of whatever row it's currently over: top
half → the gap ahead of that row, bottom half → the gap after it. `N` rows
this way cover all `N + 1` gaps (the tail gap, after the last row, is just
that row's bottom half) without needing an `N + 1`th droppable.

## `DropTarget` is absolutely positioned, not a flex sibling

An earlier version put every `DropTarget` in normal flex flow between
rows, with a negative-margin trick to cancel out double-counting the row
gap. That math actually netted out correctly, but the *resting* list still
looked too spread out — each `DropTarget`, however compensated, still ate
its own share of the flex layout's gap budget just by being a flex item at
all. Now each row's own wrapper is `position: relative`, and the
`DropTarget` for the gap *before* that row lives inside it,
`position: absolute; bottom-full` — at rest it contributes zero height to
the row's own box; expanding it while `active` overlays the gap visually
without moving any row's actual layout position. The tail gap (after the
last row, no following row to attach to) is the one `DropTarget` still
rendered as a plain flex sibling, at the very end of the list.

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
block-opacity one. Since the anchored original (dimmed at its own
position) and the `DropTarget` overlay both render in normal page flow,
underneath the portal-rendered `DragOverlay`, the insertion rail — chevron
included — stays visible through the floating block as it passes over it.
Both `DropTarget`s here render with `chevron` — see that atom's README for
why it's off by default (Chapter Menu doesn't use it) but on here.

## The anchored row dims; the `DragOverlay` copy carries `drag` chrome

Also matching Chapter Menu: the dragged row's original stays in place
(`selected`/`default`, whichever it already was) and only dims
(`opacity-40`) while `isDragging` — it doesn't itself switch to `drag`
chrome. A separate `ParagraphBlock state="drag"` renders inside dnd-kit's
`DragOverlay` and follows the pointer instead. Showing `drag` chrome in
both places at once would read as two lifted cards for one gesture.

## `onDragStart`/`onSelect` (Paragraph Block) vs. dnd-kit's own drag

These answer different questions and both fire for the same gesture on
purpose. Paragraph Block's own press-vs-drag detector (composed with
dnd-kit's `listeners` via `handleProps`, see that component's README)
drives what the row should visually *look like* (`selected` after any
click or drop); dnd-kit's `PointerSensor` — activation distance `4`,
matching Paragraph Block's own threshold so the two never disagree about
whether a given press became a drag — separately drives whether an actual
reorder is in progress. A plain click never crosses either threshold, so
dnd-kit's own `onDragStart` never fires for one; Paragraph Block's
`onSelect` firing directly is the only signal this list gets for "the
handle was clicked" in that case.

## API

| Prop | Notes |
| --- | --- |
| `items` | `{ id, text }[]` |
| `onItemsChange` | Fires with the reordered array on a real drop; this list doesn't own array state itself |
| `className` | Merged onto the row container |

Selection (`selectedId`) is internal, not a prop — nothing outside this
list needs to know or set which row is selected today. Lift it if that
changes.

## Tokens

| Concern | Foundations |
| --- | --- |
| Row gap (resting) | `--spacing-xs` (8px) |
| Drag activation distance | `4px` (matches Paragraph Block's own click/drag threshold) |
| Sibling reflow | `LAYOUT_REFLOW` (`@/lib/motion`) — ease-out, ~220ms, no spring |
| Drag overlay background | `color-mix(in srgb, var(--card) 50%, transparent)` + `backdrop-blur-[3px]` |
