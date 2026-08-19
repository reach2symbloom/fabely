# Library Nav

Vertical list of books — the active row is the currently open manuscript.
A left-edge rail (faint full-height track + gradient accent on the active
row) marks which one.

## Placement

NO — Library product chrome. Stays in `src/features/library/library-nav/`.

## Overlap

| Candidate | Verdict |
| --- | --- |
| **Library List Item** | Compose as each row, one per book. `active` on each row is JS-driven (`book.id === activeId`), not CSS-only — Library List Item's gradient wash / revealed link both depend on a real boolean prop. |

## Authoritative Figma

[Library nav organism](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16431-13709)
set (`16431:13709`). Three examples (Book=1/2/3), each a 3-book stack with a
different active row — selected-index states of the same list, not
structural variants. No other axes published.

## Colors (Foundations)

| Role | Figma | Token |
| --- | --- | --- |
| Rail track (full height) | `tw-raw/secondary/Ghost` at 12% | `color-mix(in srgb, var(--tw-raw-secondary-ghost) 12%, transparent)` — same recipe as Badge `secondary` |
| Rail accent (active row) | `tw-raw/primary-gradient/1` → `/2` (`#a6a09b` → `#645e59`) | `var(--gradient-primary-top-bottom)` (already in Foundations) |
| Category badge | Fiction → secondary/purple, Non-fiction → default/grey | [Library List Item's `categoryVariant`](../library-list-item) |

## Structure

- **List** — a plain `<nav aria-label="Library"><ul><li>` per book, rendered
  flush (no gap). Figma's own item order determines stack order; no
  sorting.
- **Each row** — a Library List Item wrapped in a `<div>` that owns
  selection: `onClick` calls `select(book.id)`; `onKeyDown` handles
  Enter/Space the same way when the row has no `href` (once it does, the
  row is a real link and native Enter-to-follow already works, so the
  synthetic handler steps aside). `linkLabel="Resume writing"` by default
  (this Figma set's own text), overriding Library List Item's
  variant-derived Continue/Start split.
- **Navigation** — `href` passed straight through to each Library List
  Item. When set, the row *is* a real link — clicking it (active or not)
  navigates. No separate "select vs. open" distinction; selecting a row
  and opening it are the same click.
- **Rail track** — a plain full-height `<span>`, always rendered.
- **Rail accent** — one persistent `<span>`, absolutely positioned at
  `top`/`height` measured off the active `<li>` (`el.offsetTop` /
  `el.offsetHeight`, `<nav>` as the positioned ancestor) and animated on
  `[top,height]` (`--duration-fast` / `ease-emphasized`) so it slides
  between rows instead of mounting/unmounting per row. A `ResizeObserver`
  on the active `<li>` re-measures continuously while that row's own height
  transitions (it grows to reveal its "Resume writing" button — see
  Library List Item), so the rail tracks the row's animation in real time
  rather than jumping to a stale end value.
- **Width** — defaults to `max-w-[350px]` (Figma's own item width); each
  Library List Item gets `className="max-w-none"` so it fills whatever
  width the list is given rather than capping at its own standalone
  `max-w-[325px]`.
- **Controlled / uncontrolled** — `activeId` + `onActiveChange`, or
  `defaultActiveId` (falls back to the first book).
- **Keyboard** — native Tab order through whatever's focusable inside each
  row (the link/button, not the row itself) — there's no roving tabindex
  or arrow-key nav between rows; each row isn't independently focusable
  unless its content is.

## Deviations from Figma

1. **A live list, not a static stack.** Figma's three examples are
   independent snapshots (Book=1 active / Book=2 active / Book=3 active);
   there's no Figma prototype wiring them together. Built as an actual
   controlled/uncontrolled list since "which book is active" is clearly
   meant to be click-driven state.
2. **No menu button wired by default.** `showMenuButton` / `onMenuClick`
   pass through per-book if needed, but no Library Nav Figma example shows
   the ellipsis.

## History

An earlier pass (`LibraryNavOrganism`, since removed) built this on Base UI
Tabs — `role="tablist"`/`"tab"`, roving-tabindex arrow-key navigation, and
an auto-animated sliding rail via `Tabs.Indicator`. Compared side by side
in Storybook against this simpler `<nav>`/`<ul>`/`<li>` + real-`href`
version; this one was chosen — but neither pass was ever committed as a
distinct revision, so there was no artifact to fall back to once the
sliding motion was missed later. The rail's smooth slide has since been
rebuilt directly on top of the `<nav>`/`<ul>`/`<li>` structure (DOM
measurement + `ResizeObserver`, see Structure above) rather than by
reintroducing Tabs — keyboard row-to-row navigation and the `tablist` role
are still deliberately not part of this component; that tradeoff, not the
animated rail, is what the side-by-side comparison was actually about.
