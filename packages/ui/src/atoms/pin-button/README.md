# Pin Button

Icon toggle in a `--rounded-md` 32px chip. Unselected is a tailed outline
glyph (`alpha-20`); selected swaps to a headless solid glyph (`alpha-50`).
The chip background only ever responds to hover, independent of selection.

## Purpose

Fabely pin / unpin affordance for lists and cards. Composes Base UI's
headless [`Toggle`](https://base-ui.com/react/components/toggle) primitive
directly — no ghost/outline skin, no roundness prop; the chip shape is fixed
by Figma.

## Sources

| Source | Role |
| --- | --- |
| Figma [Pin Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16233-7891) (`16233:7891`) | Visual — Hover × Active, chip + glyph |
| [Base UI Toggle](https://base-ui.com/react/components/toggle) | Headless pressed API — `aria-pressed` / `data-pressed` |

## Composition

```text
PinButton → Base UI Toggle (headless, unstyled) + inline Pin glyph (two Figma paths) + Superscript badge
```

Fetching the raw Figma SVG assets showed unselected and selected are two
different paths, not one path recolored: unselected is the full pin outline
(head loop + diagonal tail); selected is only the head-loop segment of that
same path, so the tail visually disappears. Both are embedded verbatim as
inline `<path>` data in `pin-button.tsx` rather than approximated with a
Lucide icon, since no bundled icon matches this exact geometry.

Also verified by decoding the outer variant tree (`PinButton1` in the raw
Figma export): the inner glyph never actually receives a `hover` prop from
any of the four Hover×Active combinations shown — hover only ever toggles
the chip's own background. So, unlike Bookmark Button, hover here has zero
effect on the glyph; it only lightens the chip.

| State | Chip background | Glyph color | Glyph shape |
| --- | --- | --- | --- |
| Unselected, rest | `--theme-alpha-black-switch-0` (transparent) | `--theme-alpha-black-switch-20` | tailed outline |
| Unselected, hover | `--theme-alpha-black-switch-5` | `--theme-alpha-black-switch-20` | tailed outline |
| Selected, rest | `--theme-alpha-black-switch-0` (transparent) | `--theme-alpha-black-switch-50` | headless solid |
| Selected, hover | `--theme-alpha-black-switch-5` | `--theme-alpha-black-switch-50` | headless solid |

Note this control never reaches `--primary` — both glyph colors are neutral
`alpha-black-switch` tones, confirmed against Figma's resolved variables for
this node (no primary variable bound anywhere in the source).

The optional count badge (Figma `Show superscript`, `16233:7848`/`7849`) sits
absolute at `-top-2 left-4` of the Icon box, `paragraph-mini-medium`
typography at a `10px` override, `--muted-foreground` text, `--spacing-2xs` /
`--spacing-3xs` padding. Visibility is `showSuperscript && pressed`, decided
by the shared [`useSuperscript`](../../hooks/use-superscript.ts) hook — the
same one Bookmark Button uses.

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `pressed` / `defaultPressed` / `onPressedChange` | — | From Base UI Toggle |
| `showSuperscript` | `false` | Figma `Show superscript`; badge only renders while `pressed` |
| `superscriptValue` | `2` | Badge content; Figma default is the literal "2" |
| `forceHover` | `false` | Storybook-only — locks the hover paint via `data-force-hover` without a real pointer |
| `aria-label` | auto | `"Pin"` off · `"Unpin"` on |

There is no `size`, `variant`, or `roundness` prop — Figma defines this
control at one fixed chip size (`--spacing-2xl`, 32px) with one fixed shape.

## Tokens

| Concern | Foundations |
| --- | --- |
| Chip size | `--spacing-2xl` (32px) |
| Chip radius | `--rounded-md` (8px) |
| Glyph size | `--icon-sm` (Figma ~16.67, rounded to the token ladder) |
| Color | `currentColor` ← `--theme-alpha-black-switch-20` / `-50` |
| Chip hover | `--theme-alpha-black-switch-5` |
| Motion | `--duration-fast` / `--ease-emphasized` |
| Focus | `--effect-focus-ring-secondary` |

## Deferred

- **Press ripple / global push effect** — deferred with Toggle; shared
  Foundations recipe later. See
  [post-primitives docket](../../../.migration/post-primitives-docket.md).
