# Split & Parse

Inline manuscript-editor row: click to mark a split point ("Parse here"),
which flips to a confirmation row ("Note parsed") with an undo trigger.
Icon fused to a dashed rule on the left; a second dashed rule fills the
right, so the label reads centered in whatever width the row hugs.

## Sources

| Source | Role |
| --- | --- |
| Figma [Split & parse](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16095-208) (`16095:208`) | Visual — State × Mode |
| [Icon Button](../../../primitives/button/icon-button/README.md) `fade` variant | The undo trigger — Figma's own "Fade button" (`12042:25189`), reused as-is |

## `surface` replaces Figma's `mode`

Figma's two `mode` variants ("Light"/"Dark") aren't app theme — they bind to
two different *semantic* tokens: `foreground` (Light) and
`primary-foreground` (Dark), the same pairing shadcn buttons use for "text
on the default background" vs "text on a `--primary`-filled background."
Both already flip with the app's own light/dark theme independently (see
colors.css) — the axis Figma is actually varying is *which surface this row
sits on*, not which app theme is active. Renamed `surface: 'default' |
'primary'` to say that directly: `primary` is for a split marker placed
inside a `--primary`-colored highlight span (or similar filled surface),
not "dark mode."

## Undo trigger reuses Icon Button's `fade` variant verbatim

Figma's own "Fade button" (`12042:25189`) — near-invisible face
(`--theme-alpha-white-switch-001`), dimmed glyph at rest, full opacity on
hover — is already wrapped as `IconButton`'s `fade` variant (see
[Icon Button](../../../primitives/button/icon-button/README.md)). Reused
directly here, with `size`/`rounded`/padding overridden via `className` to
match this row's `16px` footprint (Icon Button's smallest built-in slot,
`mini`, is `28px`) — the same override pattern
[Gather Bookmark Button](../../../features/note-retrieved/gather-bookmark-button/README.md)
used for its non-square chevron column.

## No invented hover treatment

Figma exports a single `Default & hover` variant for the clickable
state — no distinct hover swatch. Nothing added beyond the native
`cursor-pointer` already on the row; inventing a hover fade would be
guessing at a visual Figma doesn't specify.

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `state` | `'default'` | `'default'` ("Parse here", clickable) or `'split-created'` ("Note parsed", with undo) |
| `surface` | `'default'` | `'default'` (`--foreground`) or `'primary'` (`--primary-foreground`) — see above |
| `onParse` | — | Fires when the `default`-state row is clicked |
| `onUndo` | — | Fires when the `split-created`-state undo trigger is clicked |

## Tokens

| Concern | Foundations |
| --- | --- |
| Icon size | `--icon-md` (20px) |
| Undo glyph / footprint | `--icon-sm` (16px) |
| Row padding | `--spacing-2xs` top (4px) / `--spacing-3xs` bottom (2px) |
| Row gap | `--spacing-xs` (8px) |
| Icon-to-line gap | `--spacing-3xs` (2px) |
| Label typography | `--text-paragraph-mini-medium-*` |
| Text color (default state) | `--foreground` / `--primary-foreground` |
| Text color ("Note parsed") | `--tw-raw-pantones-ginseng` / `--tw-raw-pantones-ginseng-light` |
| Dashed line | `--theme-alpha-black-switch-10` / `color-mix(--primary-foreground 15%)` |
