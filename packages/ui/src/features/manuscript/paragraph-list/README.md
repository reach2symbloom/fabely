# Paragraph List

Composes [Paragraph Block](../../../molecules/paragraph-block/README.md)
(molecule) and [Drop Target](../../../atoms/drop-target/README.md) (atom)
into an actual drag-reorderable manuscript. This is the only layer that
owns ordering — an individual Paragraph Block never decides where it sits
relative to its neighbors, it only reports "I was clicked" / "I started
being dragged" via `onSelect`/`onDragStart`; this list decides what those
mean for the array.

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
| Row gap | `--spacing-md` (16px) |
| Drag activation distance | `4px` (matches Paragraph Block's own click/drag threshold) |
