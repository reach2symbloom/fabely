# Image Button

Thumbnail + copy + trailing icon action card.

## Placement

NO — Library product chrome. Stays in
`src/features/library/image-button/`.

## Overlap

Searched primitives / atoms / molecules / organisms / features:

| Candidate | Verdict |
| --- | --- |
| **Book Cover** | Skip — portrait cover art (`1023/1537`) with an edit scrim; different aspect ratio and job than this square decorative thumbnail. |
| **Resume Writing Button** | Compose pattern — whole card is the single hit target (`<a>` when `href` is set, otherwise `<button>`), inner chrome unstyled for interaction. Its go-control ripple is a *different* WAAPI/lavender pattern, not reused here. |
| **Separator** | Compose — vertical divider between thumbnail and copy. |
| **Foundations Press Ripple** | Compose — `usePressRipple` / `PressRippleLayer` from `@/foundations/motion` (promoted from Library List Item's inline ripple; see [foundations/motion/README.md](../../../foundations/motion/README.md#press-ripple)). |

## Authoritative Figma

[Image buttons](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16455-16979)
set (`16455:16979`). Axes:

| Axis | Values |
| --- | --- |
| Type | Import notes |
| Hover | False / True |

Only `Import notes` is published; `type` is a one-value literal union so a
second card type is additive, not a breaking change.

## Colors (Foundations)

| Role | Figma | Token |
| --- | --- | --- |
| Card rest border | alpha/black/switch/alpha-10 | `--theme-alpha-black-switch-10` |
| Card hover border | alpha/black/switch/alpha-15 | `--theme-alpha-black-switch-15` |
| Card hover fill | alpha/black/switch/alpha-333 | `--theme-alpha-black-switch-333` |
| Title | alpha/black/switch/alpha-75 | `--theme-alpha-black-switch-75` |
| Subtitle | muted-foreground | `--muted-foreground` |
| Divider | alpha/black/switch/alpha-5 | `Separator` default |
| Icon rest / hover | white 50% / 100% | `opacity-50` / `opacity-100` on the same Lucide glyph |

Figma swaps two exported SVGs between rest and hover, but diffing them
shows an identical path — only fill opacity changes (50% → 100%). Ported
as one `lucide-react` `CloudUpload` icon with an opacity transition
instead of two raster assets.

## Structure

- **Thumbnail** — 72×72 (falls between the 56/64 spacing tokens; not a
  spacing-token size, kept literal). Figma bakes a radial vignette as an
  exported SVG gradient (`r=10` scaled 3.6× in a 72×72 box — a plain
  circle reaching the box's closest side); reproduced as a literal CSS
  `radial-gradient` with the same stops rather than shipping the SVG.
- **Divider** — `Separator` `vertical` `thin`, height-matched via
  `self-stretch` on the row so it always spans the card's content height.
- **Copy** — title (`paragraph/small`) + subtitle (`paragraph/regular`),
  ink constant across hover (only the card fill/border and icon move).
- **Icon** — `CloudUpload`, right-aligned, `--icon-lg` (24px).
- **Hit target** — the card itself is the only interactive element
  (`<a>` when `href` is set, otherwise `<button>`). Plain `onClick`
  callback — wiring an actual file picker is left to the call site.
- **Press feedback** — no Figma-defined Pressed variant, so this borrows
  Library List Item's neutral white click-origin ripple via Foundations'
  `usePressRipple` / `PressRippleLayer` rather than a static `active:`
  darken.

## API

| Prop | Notes |
| --- | --- |
| `type` | `'import-notes'` (default, only value today) |
| `href` | Renders as a link; omit for a `<button>` |
| `onClick` | Fires on click — no built-in file input |
| `forceHover` | Storybook — lock hover paint |
| `title` / `subtitle` | Copy overrides — default to the Import notes copy |
| `thumbnailSrc` / `thumbnailAlt` | Override the bundled illustration |
