# Paragraph Block

A single manuscript paragraph rendered as a draggable list row. Three
visual states: `default` (no chrome, handle hidden), `drag` (lifted —
border, card fill, inner shadow), `selected` (same lifted treatment in the
secondary/lavender border color).

Presentational only — this component owns the four Figma visual states
(Figma's `Hover` collapses into `default`'s real `:hover`/`:focus-within`,
same as [Split & Parse](../../split-parse/split-parse/README.md)), not a
drag engine. It forwards `ref`/`style` and exposes `handleProps` (spread
onto the grip button) so it drops straight into `@dnd-kit/sortable`'s
`useSortable()` — `setNodeRef` on the ref, `transform`/`transition` via
`style`, `listeners`/`attributes` via `handleProps` — without this
component knowing dnd-kit exists.

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
