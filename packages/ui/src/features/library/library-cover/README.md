# Library Cover

Hero-scale manuscript cover — empty-state "Untitled" placeholder with a
click/drag-to-upload card, or the uploaded cover art with an edit-on-hover
scrim.

## Placement

NO — Library product chrome. Stays in
`src/features/library/library-cover/`.

## Overlap

Searched atoms / primitives / features:

| Candidate | Verdict |
| --- | --- |
| **Book Cover** (atom) | Skip as component. Book Cover is small chrome (160–240px, generic pencil edit affordance, no text content) for menus/list rows. This is the Library hero (Figma 553×830) with its own empty-state copy (sigil / title / tagline / byline / button) — different job, not a size variant. `BOOK_COVER_ACCEPT` reused for the file input filter. Aspect is **not** Book Cover's 1023/1537 crop; Figma Cover is a fixed 553×830 frame. |
| **Image Button** | Compose pattern — card-is-the-hit-target shape (`<button>`, hidden file input, `onImageSelect(file)`) mirrors this. Not composed directly (different chrome), but the interaction model is the same lineage. |
| **Icon Button `glow`** | Nest the primitive — Art×Hover edit control is `<IconButton variant="glow" size="lg" roundness="round">`, face override to 56px (`--tw-raw-spacing-14`), same override [Resume Writing Button](../resume-writing-button) uses for its go-control. |
| **Library List Item hover glow** | Compose the same pointer-follow layers (ambient radial + edge highlight, `--glow-x`/`--glow-y` via `pointermove`) rather than a new motion. Ambient radius scaled to 640px so it still sits past this 553px face (list item used 260px past its ~325px row). |
| **Fia Silcrow** (Foundations icon) | Skip — Figma's empty-state mark is the Fabely sigil raster (`16463:670`, 91×114), not the vector silcrow. Ported as `assets/fabely-sigil.png` (4× export). |
| **Section Divider Ornament** (Controls) | Skip — different exported asset. Figma's Cover ornament (`16463:685`) has a taller viewBox (250×66 vs 250×42) and isn't the same geometry; ported as its own `assets/cover-divider-ornament.tsx` rather than reusing Controls' copy. |
| **Button** (primitives) | Size tokens only — the empty-state "Upload cover art" pill reuses `extraLarge`'s height/padding/gap (`--spacing-13`/`--spacing-xl`/`--spacing-xs`), but its chrome (transparent rest, alpha-5 hover, border always-on) doesn't match any published variant, so it's composed directly rather than forced into `outline`/`ghost`. |

## Authoritative Figma

[Cover](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16463-702)
set (`16463:702`). Axes:

| Axis | Values |
| --- | --- |
| Hover | False / True |
| Art | False / True |

Empty rest ([`16463:700`](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16463-700)): 553×830, 8px inside stroke **on the left only**, monotone noise (size 1.5, black 25%), two drop shadows, Fabely sigil 91×114, padding 72/48/88/48, item spacing 64, space-between.

Empty hover ([`16463:701`](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16463-701)): same layout; fill `#0F1517`; 2px inside dashed stroke (dash 8/8, `--tw-raw-secondary-200`); shader fill at 20%.

## Colors (Foundations)

| Role | Figma | Token |
| --- | --- | --- |
| Empty-state card fill | unbound `#0C1012` | `color-mix(white 2%, black)` from `--tw-raw-white` / `--tw-raw-black` |
| Empty-state hover fill | unbound `#0F1517` | `color-mix(white 4%, black)` |
| Empty-state inside stroke | unbound `#242829`, **left 8px only** (top/right/bottom 0, align Inside) | `color-mix(white 12%, black)` as an 8px left overlay |
| Empty-state hover stroke | 2px inside, dash 8/8, `tw-raw/secondary/200` | `--tw-raw-secondary-200` SVG rect |
| Empty rest / hover shadows | geometry `0 20 59 / -17` + `0 13 32 / -8`; **dark** (Library page `16428:12467`) | `--theme-alpha-black-no-switch-20` + `-80` |
| Empty rest / hover noise | Mono, size 1.5×1.5, density 100%, `#000000` 25% | Same `CoverGrain` layer on both states |
| Empty hover shader | Nebula fill @ 20% (starDensity 0.1, brightness 0.8, center 50/50) | Star field + faint colorA/B/C clouds; not Noise |
| Empty-state text (title/tagline/byline/button) | text default color (white 75%, no-switch) | `--text` (already resolves to `--theme-alpha-white-no-switch-75` in the Library's `.dark` context) |
| Uploaded-state hover heading | text default color | `--text` |
| Uploaded-state hover subtext | alpha/white/no-switch/alpha-75 | `--theme-alpha-white-no-switch-75` |
| Hover ring (both Art states) | secondary/200 dashed | `--tw-raw-secondary-200` |
| Uploaded-state scrim | rgba(0,0,0,0.79) | `--theme-alpha-black-no-switch-80` (nearest published step) |
| Upload button border | alpha/black/switch/alpha-10 | `--theme-alpha-black-switch-10` |
| Upload button hover fill | alpha/black/switch/alpha-5 | `--theme-alpha-black-switch-5` |
| Edit icon button | Icon Button `glow` | secondary-200 hairline ring + lavender drop-shadow, unmodified |

## Structure

- **Hit target** — empty state: the card is a drop zone; **Upload cover art**
  is a real `<button>` with its own hover/click. Uploaded state: the card
  is a drop zone; **Edit cover art** is a nested `IconButton` `glow`
  instance (not class-copied chrome). Clicking empty card area still
  opens the picker. Dragging a file onto either state previews hover
  chrome and hands the file to `onImageSelect(file)`.
- **Art axis** — driven by `src`, not a separate boolean (same rule as Book
  Cover's own placeholder fallback). `src` present → cover art fills the
  card; absent → the empty-state placeholder renders.
- **Empty state** — Fabely sigil (91×114 raster) → title (Heading 1) →
  tagline (Paragraph Serif Regular) → divider ornament → byline (Heading 3,
  "by" / author on two lines) → Upload cover art button. Laid out
  `justify-between` with a 64px gap (`--spacing-5xl`) in a column. Padding is
  Figma's 72/48/88/48, with 72 and 88 composed from spacing tokens
  (`5xl+xs` / `6xl+xs`) because they are not on the published scale.
- **Uploaded state** — cover image fills the card; hover reveals a dark
  scrim, a nested Icon Button `glow` (Lucide `BookImage`), "Edit cover
  art" heading, and "Drag or click to upload" subtext.
- **Chrome** — drop shadow lives on an outer wrapper so the inner face can
  `overflow-hidden` (radius clip, noise, art) without clipping the shadow.
  Empty rest paints an 8px **left-only** inside stroke as an overlay; hover
  hides it and draws a 2px dashed secondary/200 ring (dash 8/8) plus the
  20% shader fill.

## API

| Prop | Notes |
| --- | --- |
| `src` / `alt` | Cover image; omit `src` for the empty placeholder |
| `onImageSelect` | `(file: File) => void` — fires from the OS picker or a drop |
| `accept` | File input filter; default `BOOK_COVER_ACCEPT` |
| `forceHover` | Storybook — lock hover paint |
| `title` / `tagline` / `authorLabel` | Empty-state copy overrides |
| `uploadLabel` | Empty-state button label |
| `editLabel` / `dragLabel` | Uploaded-state hover heading / subtext |

Native size is Figma's 553×830 (`LIBRARY_COVER_WIDTH` / `LIBRARY_COVER_HEIGHT`).
This is not a fluid card — type, padding, and the sigil are authored at that
scale. Shrink via CSS `transform: scale(...)` rather than a smaller width.

## Deviations from Figma

1. **Empty-state fill / stroke / hover fill are unbound literals.** Figma
   does not bind `#0C1012`, `#0F1517`, or `#242829` to a variable. Mixed from
   `--tw-raw-black` / `--tw-raw-white` (2% / 4% / 12% white) rather than
   hex, so `check:tokens` stays clean while matching the inspector values.
2. **Noise is CSS `feTurbulence`, not a Figma effect export.** Rest and
   hover share the same Noise: **Mono / 1.5×1.5 / density 100% / `#000000`
   25%**. Mapped with `primitiveUnits="userSpaceOnUse"` and
   `baseFrequency = 1/1.5`. Hover does not get a second noise layer.
3. **8px inside stroke is a left-edge overlay, not `border`.** Figma
   stroke weights are `left: 8 / top-right-bottom: 0`, align Inside. CSS
   `border-left` would shrink the content box; an absolute 8px bar overlays
   the padding the way Inside does. 8px is also not on the Stroke scale
   (`--stroke-bold` is 6px).
4. **Empty hover dashed ring is an SVG rect** (`stroke-dasharray="8 8"`).
   CSS `border-style: dashed` doesn't honor Figma's 8/8 pattern.
5. **Empty hover shader is the Nebula fill @ 20%.** `16463:701` second
   fill matches [Nebula](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16463-701)
   defaults (starDensity 0.1, brightness 0.8, center 50/50, three nebula
   colors). WebGPU isn't available here; ported as sparse white stars
   (`mix-blend-screen`) plus faint secondary / blue-messaging / blush
   clouds. Grain stays the rest Noise layer.
6. **Drop shadows are Figma literals, not Shadows tokens.** Empty rest/hover
   share geometry `0 20 59 / -17` + `0 13 32 / -8`. The inspector lists the
   outer layer as white 20%, but on the Library page the shadow is dark
   with no light bloom — both layers use `--theme-alpha-black-no-switch`
   (20 / 80).
7. **"Edit cover art" / body text color.** Both the heading and body text's
   bound Figma variables resolve to dark-navy literals in the variable dump
   (`rgba(7,19,23,…)`), which contradicts the screenshot's clearly light
   text on a dark scrim. Trusted the screenshot; ported as `--text` /
   `--theme-alpha-white-no-switch-75`.
8. **Byline layout.** Figma hacks the "by" / author two-liner with a
   `line-height: 10px` override inside a fixed-height Heading 3 block — a
   Figma-side layout trick, not a meaningful value. Ported as a plain
   flex-col with a real gap instead.
9. **Cursor-follow hover glow is not in Figma.** Borrowed from
   [Library List Item](../library-list-item): ambient white radial +
   glass edge highlight, revealed on cover hover / `forceHover`. Position
   writes `--glow-x` / `--glow-y` on the wrapper (no re-render per move).
   Layers are `pointer-events-none` so `:hover` never has to live on them.
