# Brand Logos

Third-party service marks — API connections, import sources (Google
Drive, Notion, Dropbox, etc.). Lives in
`src/foundations/images/brand-logos/`, imported via `@/foundations/images/brand-logos`.

## Source

[Brand logos](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16456-17973)
frame (`16456:17973`) on the Library page (`16428:12467`). 13 brands,
each a 104×104 instance with 8px inner padding.

| Brand | Figma node |
| --- | --- |
| OpenAI Light | `16456:17972` |
| OpenAI Dark | `16456:18005` |
| Evernote | `16456:18048` |
| Claude | `16456:18024` |
| Dropbox | `16456:18055` |
| Notion | `16456:18062` |
| Obsidian | `16456:18040` |
| Google Drive | `16456:17758` |
| OneDrive | `16459:18545` |
| Play Store | `16485:30188` |
| Apple | `16485:30191` |
| Keep | `16503:30589` |
| iCloud | `16504:30614` |

## Format

Each brand is a flattened, transparent 352×352 PNG (4× Figma's 88×88
content box — the 104×104 catalog cell minus its 8px padding — retina
headroom at any reasonable display size). Tight-cropped, no padding
baked in: Figma's own `BrandLogos` sub-component takes padding via
`className` at each call site (104×104/8px in the catalog, 40×40/8px
inside API Connection's row) rather than baking a fixed size into the
mark itself, so these assets follow the same convention — size and pad
at the consumer.

`openai-light` / `openai-dark` are the same mark in two inks — pick
whichever reads against your surface (light = dark glyph on light/clear,
dark = white glyph for dark surfaces).

## How these were produced

Most brands export from Figma as one flat SVG/PNG per mark and were
saved directly. Two did not:

- **Obsidian** — Figma's dev-mode export decomposes this into a
  "mask" SVG (used as a CSS `mask-image` over a solid black square in
  the generated React snippet) — but the "mask" file itself turned out
  to already contain the full gradient-filled artwork (multiple
  `radialGradient` fills, base `#6C31E3`), not a plain alpha shape. Used
  directly, no compositing needed.
- **Keep** — genuinely two layered, masked pieces (a bulb-glow raster
  cropped by a circular mask, plus a socket/base cropped by a
  rectangular mask), positioned per Figma's own transform math. No
  single flat export existed, so this was reconstructed as static HTML/CSS
  mirroring Figma's own generated layout (absolute-positioned,
  `mask-image`-cropped layers) and rasterized once via a headless
  browser (`page.screenshot({ omitBackground: true })` for a real
  transparent PNG) rather than reconstructed at runtime — CSS
  `mask-image` on `file://`-loaded SVGs is blocked by Chromium's CORS
  policy for the `null` origin, so this needs to run over `http://`,
  not opened as a local file directly.

No build step depends on this reconstruction — the two composited PNGs
are committed like any other asset. Only worth knowing if a brand mark
needs re-exporting from a Figma update.

## Usage

```tsx
import { BRAND_LOGOS } from '@/foundations/images/brand-logos';

<img src={BRAND_LOGOS['google-drive']} alt="" />
```

`api-connections/` composes this — see its `DEFAULTS_BY_BRAND` for the
per-brand label + logo pairing.
