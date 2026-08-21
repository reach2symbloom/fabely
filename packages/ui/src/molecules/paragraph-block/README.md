# Paragraph Block

A single manuscript paragraph rendered as a draggable list row. Three
visual states: `default` (no chrome, handle hidden), `drag` (lifted —
border, card fill, inner shadow), `selected` (same lifted treatment in the
secondary/lavender border color).

Owns the four Figma visual states (Figma's `Hover` collapses into
`default`'s real `:hover`/`:focus-within`, same as
[Split & Parse](../../features/split-parse/split-parse/README.md)) and telling the
caller which state to move to next, but not the `state` value itself — see
"Press vs. drag on the grip handle" below. Not a drag engine beyond that:
it doesn't move itself, decide where it sits relative to other blocks, or
reorder anything — that's
[Paragraph List](../../features/manuscript/paragraph-list/README.md)'s job
entirely. It forwards `ref`/`style` and exposes `handleProps` (composed
with, not overwritten by, the internal press handler) so a caller can wire
in whatever drag adapter it uses without this component knowing dnd-kit
exists. Paragraph List uses `@dnd-kit/core`'s `useDraggable`/`useDroppable`,
not `@dnd-kit/sortable`'s `useSortable` — see that component's README for
why.

## Sources

| Source | Role |
| --- | --- |
| Figma [Paragraph block](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16129-377) (`16129:377`) | Visual — 4 states: Default, Hover, Drag, Selected |

## Figma's `Hover` is `default`'s real hover, not a fourth prop value

Same reasoning as Split & Parse's own removed `surface` prop (see its
README): Figma exports `Hover` as a static swatch, but nothing about it is
state that needs to persist or be driven externally — it is exactly what
the row looks like while a pointer is over it or it holds keyboard focus.
Modeling it as a `state="hover"` value would let a caller show the hover
look with no pointer over the row and let a real hover go unrepresented if
the caller forgot to flip the prop. `default`'s handle reveals itself via
`group-hover`/`group-focus-within` instead — always in sync with the
actual pointer/focus, never a prop to remember to set.

`drag` and `selected` stay as explicit `state` values because both are
genuinely driven by something other than this row's own pointer state — a
drag library's `isDragging` flag, or a selection model elsewhere in the
editor — so they can't be recovered from CSS pseudo-classes alone.

## Press vs. drag on the grip handle

Both a click and a drag start the same way — `pointerdown` on the handle —
so which one it turns out to be can only be known after the fact, once the
pointer has (or hasn't) moved. `useHandlePressDetection` (component file)
watches `pointermove` after a press and fires `onDragStart` the moment
movement exceeds `DRAG_THRESHOLD_PX` (4px); `onSelect` fires on
`pointerup` regardless of whether that happened — a plain click never
crosses the threshold, so `onSelect` is the only callback it gets, while a
drag gets `onDragStart` first and `onSelect` on release. Both end at
`selected`: a release always leaves this block as the active one, whether
the pointer moved on the way there or not.

The move/up/cancel listeners live on `window`, not the button — attached
imperatively inside the `pointerdown` handler and torn down on release —
so letting go after the pointer has left the handle (or the block
entirely) mid-drag still resolves to `onSelect`. A `pointercancel` (e.g. a
touch gesture the browser reinterprets as a scroll) tears the listeners
down without firing `onSelect`, since that's neither a completed click nor
a deliberate release.

Neither callback touches `state` — the caller decides what `drag`/
`selected` actually mean (e.g. writing into a dnd-kit sort or a selection
model) and passes the result back down, same as Split & Parse's
`onParse`/`onUndo`.

Release used to blur the handle (avoiding a stray native focus-visible
ring on the next unrelated keydown), back when a keypress genuinely had
nothing to do with this button. It doesn't blur anymore — Paragraph List
reorders the *selected* row with `ArrowUp`/`ArrowDown`, which needs the
handle to still hold focus for its `onKeyDown` to fire at all, and a ring
appearing while an arrow key is actively doing something to this element
is correct feedback now, not noise. `focus-visible:shadow-[var(--effect-focus-ring-secondary)]`
replaces the raw default outline so it still reads as intentional.

## Clicking the text fires `onTextClick`, not gated on `state`

This component doesn't track whether it's "the selected one" — `onTextClick`
fires on every text click regardless, same as `onDragStart`/`onSelect`
firing regardless of the current `state` prop. Paragraph List uses it to
drop selection specifically when the clicked block was already selected
(clicking into text to edit it shouldn't leave block-level `selected`
chrome showing) and ignores it otherwise.

## Card fill is the container's own `background`, not a separate layer

Figma's export puts the `drag`/`selected` fill (`shadcn/general/background
(white)`) on an absolute `inset-0` div behind the text, existing only
because Figma's own layer model can't put a solid fill and a border on the
same object cleanly. Nothing sits between the border and that fill here,
so it's applied directly as the bordered container's own
`background-color` — same result, one fewer layer, and lets the inset
shadow live on that same element too.

## Radius changes with state, not just border/fill

`default` uses `--rounded-lg` (12px), `drag`/`selected` use `--radius`
(16px) — both Foundations tokens share Figma's own local variable names
for these exact values, so no re-derivation was needed; the row's corners
visibly grow when it lifts off the page.

## Inner shadow has no Foundations token yet

`foundations/shadows/raw` and `/semantic` are still empty scaffolding (see
their READMEs) — the `drag`/`selected` inset shadow
(`0 0 7px rgba(148, 140, 134, 0.3)`) is reproduced as Figma's literal
value, the same way Split & Parse's own not-in-Figma additions used raw
values ahead of a token existing. Revisit once the shadows foundation is
built out.

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `state` | `'default'` | `'default'` \| `'drag'` \| `'selected'` |
| `handleProps` | — | Spread onto the grip `<button>` — dnd-kit `listeners` + `attributes` go here |
| `onDragStart` | — | Fires once a press on the grip handle crosses the drag threshold |
| `onSelect` | — | Fires on releasing the grip handle — plain click or letting go mid-drag |
| `onTextClick` | — | Fires on clicking the paragraph text — not gated on `state` |
| `children` | — | The paragraph's text content |
| `className` | — | Merged onto the root |
| `ref` | — | Forwarded to the root `<div>` — dnd-kit `setNodeRef` |

Standard `HTMLAttributes<HTMLDivElement>` (e.g. `style`, for dnd-kit's
`transform`/`transition`) pass through to the root as well.

## Tokens

| Concern | Foundations |
| --- | --- |
| Row padding / gap | `--spacing-sm` (12px) |
| Handle icon-to-top offset | `--spacing-xs` (8px) |
| Handle icon size | `--icon-lg` (24px) |
| Radius, `default` | `--rounded-lg` (12px) |
| Radius, `drag` / `selected` | `--radius` (16px) |
| Border, `drag` | `--border` |
| Border, `selected` | `--tw-raw-secondary-200` |
| Fill, `drag` / `selected` | `--card` |
| Text | `--text-paragraph-serif-regular-*` |
| Text color | `--theme-alpha-black-switch-75` |
| Handle color (rest) | `--muted-foreground` |
| Handle focus ring | `--effect-focus-ring-secondary` |
