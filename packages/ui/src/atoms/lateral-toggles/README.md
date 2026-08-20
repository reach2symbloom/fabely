# Lateral Toggles

Prev/Next chapter-navigation atom: a `⌘←`/`⌘→` shortcut hint, a
"Prev:"/"Next:" label, and the target chapter's title truncated to one
line. Quiet at rest, full strength on hover/focus. First use is the Gather
panel, but it's a plain atom — no Gather-specific state or styling.

## Sources

| Source | Role |
| --- | --- |
| Figma [Lateral Toggles](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16091-10251) (`16091:10251`) | Visual — alignment × hover |
| [Kbd](../../primitives/kbd/README.md) primitive | The shortcut pill |

## `direction` replaces Figma's `alignment` + `hover` pair

Figma's `alignment` prop enumerates four values — `Left`, `Right`, and two
mis-named duplicates, `Alignment3`/`Alignment4`, that turn out to be "Right,
hovered" and "Left, hovered" respectively — crossed with a separate `hover`
boolean. That's an artifact of how the Figma variant was authored (the
hover states got forked into their own alignment values instead of
composing with the boolean), not two genuinely independent axes: every
property that isn't opacity — label text, shortcut glyph, kbd position,
which side the block hugs — depends only on prev-vs-next, never on hover
alone.

Collapsed here into one real axis, `direction: 'prev' | 'next'`:

- `prev` → "Prev:" label, `⌘←`, kbd *before* the label, block hugs the
  start edge (`items-start`).
- `next` → "Next:" label, `⌘→`, kbd *after* the label, block hugs the end
  edge (`items-end`).

`hover` itself isn't exposed as a prop — it's real `:hover`/`:focus-visible`
CSS (`opacity-60` → `opacity-100`), same pattern as
[Gather Bookmark Button](../../features/note-retrieved/gather-bookmark-button/README.md)'s
hover-deepen. `forceHover` locks it for Storybook, via
`data-[force-hover=true]`.

## The `⌘←`/`⌘→` hint is wired, not decorative

`Kbd` itself is `pointer-events-none` — Foundations chrome, deliberately
inert, "put real interaction on the host control." This atom *is* that host
control: while mounted (and `shortcutEnabled`, default `true`), a `window`
keydown listener watches for `direction`'s own Cmd/Ctrl+Arrow and calls
`onClick`, exactly as a real press would. Same origin/Ctrl-fallback pattern
as the vendor Sidebar's `Cmd/Ctrl+B` shortcut
(`src/components/ui/sidebar.tsx`) and `selectAllOnModA`
(`src/lib/select-all-on-mod-a.ts`).

Suppressed while focus sits in an `<input>`/`<textarea>`/`<select>`/
`contenteditable` element — this is a manuscript editor; a global
`Cmd+ArrowLeft`/`Cmd+ArrowRight` listener would otherwise fight the
cursor-to-line-start/end shortcut while writing.

If a host screen wants one shared listener driving a `prev`/`next` pair
(or needs its own suppression rules) instead of two independent ones, pass
`shortcutEnabled={false}` on both instances and bind the keys elsewhere.

## Title truncation width

Figma's title text box is a fixed `152px`, independent of the row above
it — `w-[152px]` is kept as a literal pixel value (no Foundations spacing
token lands on 152) rather than derived from the row's own hug width.

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `direction` | `'prev'` | Drives label, shortcut glyph, kbd position, and hug side — see above |
| `title` | — | Target chapter's title, truncated to one line at 152px |
| `label` | `'Prev:'` / `'Next:'` | Override the default copy |
| `onClick` | — | Navigates to the target chapter; also what the keyboard shortcut calls |
| `shortcutEnabled` | `true` | Binds `direction`'s Cmd/Ctrl+Arrow to `onClick` via a `window` listener — see above |
| `forceHover` | `false` | Storybook-only — locks hover opacity without a pointer |

## Tokens

| Concern | Foundations |
| --- | --- |
| Rest / hover opacity | `opacity-60` / `opacity-100` (no Foundations token lands on 0.6) |
| Row gap | `--spacing-xs` (8px) |
| Column gap | `--spacing-2xs` (4px) |
| Label typography | `--text-paragraph-mini-medium-*`, `--theme-alpha-black-switch-85` |
| Title typography | `--text-paragraph-mini-regular-*`, `--theme-alpha-black-switch-85` |
| Motion | `--duration-fast` / `--ease-emphasized` |
