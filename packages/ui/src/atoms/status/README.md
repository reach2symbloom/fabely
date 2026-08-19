# Status

Colored dot + label — connection/state readout.

## Placement

YES — reusable status indicator, not tied to API Connection. Lives in
`src/atoms/status/`.

## Overlap

| Candidate | Verdict |
| --- | --- |
| **Badge** | Skip — filled pill for categorical tags (Library List Item's genre/series lockup), a different job from a dot + label state readout. |

## Authoritative Figma

[Status](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16456-17778)
(`16456:17778`), part of the [API Connections](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16456-17857)
set. Only one tone is published ("Connected", green) — `tone` is a
one-value literal union left open for a disconnected/error/syncing
state, not a boolean.

## Colors (Foundations)

| Role | Figma | Token |
| --- | --- | --- |
| Dot (`success` tone) | raw green | `--tw-raw-success-500` |
| Label | muted-foreground | `--theme-alpha-black-switch-60` (direct — not `--muted-foreground`, which doesn't re-resolve on a locally-`.dark`-wrapped canvas; see API Connection's README for the full explanation) |

## Structure

- Dot uses Figma's "Icon / dot large" (`16456:17766`) construction — a
  24×24 (`--icon-lg`) frame with a *solid filled* 8×8 (`--icon-2xs`)
  circle centered inside (`inset: 33.33%`), reproduced as a plain
  `bg-current` circle in a flex-centered box, not an icon glyph. Lucide's
  `Dot` was tried first and is visually wrong for this: it draws a thin
  `r=1` stroke-outlined mark meant to read as a small `·` character, not
  a solid dot — scaling its 24×24 viewBox down to 8×8 shrank the actual
  visible mark to a sub-pixel sliver.
- No gap between the dot and the `paragraph/mini/regular` label — the
  dot's own 24×24 box already reads as spacing, matching Figma exactly.

## API

| Prop | Notes |
| --- | --- |
| `label` | Required — the status text (e.g. "Connected") |
| `tone` | `'success'` (default, only value today) |
