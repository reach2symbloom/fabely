# Resume Writing Button

Library continue/start CTA card — bookmark ribbon, Resume/Start writing
link chrome, scene title, and a round go-button.

## Placement

NO — Library product chrome. Stays in
`src/features/library/resume-writing-button/`.
Would not make sense reused outside Library with unrelated content.

## Overlap

Searched primitives / atoms / molecules / organisms / features:

| Candidate | Verdict |
| --- | --- |
| **Link Button `secondary` `default`** | Compose chrome (classes only) — Figma nests Link Button Size=Small → API `default`. Label + Lucide `MoveRight`. Not a nested `<button>`. |
| **Icon Button `glow`** | Compose chrome (approach 2) — new Icon-only variant for the lavender halo + hairline secondary ring. Call-site **size override** to 56 (`--tw-raw-spacing-14`); that face is this card, not a reusable size slot. |
| **Separator** | Compose — Jump-back-in divider; line fill overridden to white-no-switch fade (Figma gradient, not the primitive's solid alpha-5). |
| **Card** | Skip as shell — Card is header/content/footer + `--card-spacing`. This is a single padded row with an absolute bookmark, not Card slots. |
| **Bookmark Button** | Skip — toggle that fills a Lucide bookmark. This ribbon is a decorative Figma bitmap, not a toggle. |
| **Fia Silcrow** | Skip as a separate glyph — it already lives inside the exported ribbon PNG. Drawing it again would double the mark. |
| **Theme Card / Comment Card** | Skip — different jobs (theme notes / comments). |

## Authoritative Figma

[Resume writing button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16454-16821)
set (`16454:16821`). Axes:

| Axis | Values |
| --- | --- |
| Type | Jump back in · Start writing |
| Hover | False / True |

Jump back in shows the separator + last-opened line. Start writing omits
them. Hover brightens the title/location, underlines the link label,
widens the go-button glow.

## Colors (Foundations)

| Role | Figma | Token |
| --- | --- | --- |
| Card rest fill | alpha/black/switch/alpha-5 | `--theme-alpha-black-switch-5` (white 5% in `.dark` / Library) |
| Card hover fill | white 6% | `color-mix` of `--tw-raw-white` at 6% (no 6% switch token) |
| Card rest/hover border | black switch 10 / 20 | `--theme-alpha-black-switch-10` / `-20` |
| Card press ripple | lavender ink from tap | 80 (`--tw-raw-spacing-20`); WAAPI `scale(0.2→1)` + fade; skipped under reduced motion |
| Bookmark wash | pantone lavender radial @ 20% | Localized behind ribbon only — not a full-card fill |
| Link label | secondary/200 | Link Button `secondary` |
| Title rest / hover | text default / foreground | `--text` / `--foreground` |
| Location rest / hover | muted / text default | `--muted-foreground` / `--text` |
| Timestamp | muted italic mini | `--muted-foreground` |
| Go-button | Icon Button `glow` | `--background` face; secondary-200 @ 42% hairline (`--stroke-hairline`); icon `--tw-raw-secondary-200`; drop-shadow 0/0/4 lavender @ 50% (hover 0/0/12 @ 40%) |

## Structure

- **Bookmark ribbon** — 44×98 Fia silcrow leaf (`--tw-raw-spacing-11` × 98)
  at Figma's 23.5 / -2.5 offset. A localized lavender radial (Figma 20%
  layer, `--tw-raw-pantones-lavendar` → transparent) sits behind the ribbon
  only — the card fill itself is strictly alpha 5% / 6%.
- **Copy column** — Link Button chrome (label + MoveRight always visible —
  this is the action, not a pretitle), Heading 3 title, Paragraph Small
  location; Jump-back-in adds Separator + italic mini timestamp.
- **Go control** — Icon Button `glow` `lg` `round`. Face overridden to 56
  (`--tw-raw-spacing-14`). Figma swaps the glyph on hover (not just a scale):
  Lucide `ArrowRight` at rest crossfades to `MoveRight` on card hover, both
  scaling to `125%`, staying inside the round fill.
- **Hit target** — the card is the only interactive (`<a>` when `href`
  is set, otherwise `<button>`). Inner link/go chrome is `pointer-events-none`
  so we do not nest buttons. Pointer-down spawns a click-origin lavender
  **ripple** (transform + opacity only); keyboard activation does not.

## API

| Prop | Notes |
| --- | --- |
| `variant` | `'jump-back-in'` (default) or `'start-writing'` |
| `href` | Manuscript route. Prefer a real route; Storybook uses `#`. |
| `forceHover` | Storybook — lock hover paint |
| `title` / `locationLabel` / `timestampLabel` / `linkLabel` | Copy overrides |
