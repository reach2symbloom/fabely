# Pin Icon Button

Icon toggle in a `--rounded-md` 32px chip. Unselected is a tailed outline
glyph (`alpha-20`); selected swaps to a headless solid glyph (`alpha-50`).
The chip background only ever responds to hover, independent of selection.
Entering selected plays the shared "captured" celebration — see Motion
below.

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
PinIconButton → Base UI Toggle (headless, unstyled) + inline Pin glyph (two Figma paths) + Superscript badge + useSelectionCelebration (pop + star burst)
```

Fetching the raw Figma SVG assets showed unselected and selected are two
different paths, not one path recolored: unselected is the full pin outline
(head loop + diagonal tail); selected is only the head-loop segment of that
same path, so the tail visually disappears. Both are embedded verbatim as
inline `<path>` data in `pin-icon-button.tsx` rather than approximated with a
Lucide icon, since no bundled icon matches this exact geometry.

Also verified by decoding the outer variant tree (`PinIconButton1` in the raw
Figma export): the inner glyph never actually receives a `hover` prop from
any of the four Hover×Active combinations shown — hover only ever toggles
the chip's own background. So, unlike Bookmark Button, hover here has zero
effect on the glyph; it only lightens the chip.

| State | Chip background | Glyph color | Glyph shape |
| --- | --- | --- | --- |
| Unselected, rest | `--theme-alpha-black-switch-0` (transparent) | `--theme-alpha-black-switch-20` | tailed outline |
| Unselected, hover | `--theme-alpha-black-switch-333` | `--theme-alpha-black-switch-50` | tailed outline |
| Selected, rest | `--theme-alpha-black-switch-0` (transparent) | `--theme-alpha-black-switch-50` | headless solid |
| Selected, hover | `--theme-alpha-black-switch-333` | `--theme-alpha-black-switch-50` | headless solid |

Chip hover background was later changed from Figma's own `alpha-5` to
`alpha-333` to match the row's own hover wash where this control is
composed (e.g. Note Card). The glyph itself now also steps `alpha-20` →
`alpha-50` on hover — matching Bookmark Icon Button's own rest/hover model
exactly, unlike the original Figma source, which never sends the glyph a
`hover` prop (only the chip lightens there). Pin's own pressed state
happens to land on that same `alpha-50`, so hover and pressed read
identically once selected.

Note this control never reaches `--primary` for its glyph *color* — both
glyph colors are neutral `alpha-black-switch` tones — but the celebration
burst (see Motion below) does use `--primary` for its stars, same as
Bookmark Icon Button's.

The optional count badge (Figma `Show superscript`, `16233:7848`/`7849`) sits
absolute at `-top-2 left-4` of the Icon box, `paragraph-mini-medium`
typography at a `10px` override, `--muted-foreground` text, `--spacing-2xs` /
`--spacing-3xs` padding. Visibility is `showSuperscript && pressed`, decided
by the shared [`useSuperscript`](../../hooks/use-superscript.ts) hook — the
same one Bookmark Button uses.

## Motion

**Entering selected plays the same one-shot "captured" celebration as
[Bookmark Icon Button](../bookmark-icon-button/README.md) — literally the
same code, not a separately-tuned copy.** Both consume the shared
[`useSelectionCelebration`](../../hooks/use-selection-celebration.tsx)
hook: an icon scale pop (`[1, 1.2, 0.96, 1]` over `0.4`s) plus 5 small
Lucide `Sparkle` stars radiating from behind the glyph (`z-0`, stacked
under the glyph's own `z-10`), fired only on the unselected→selected edge.
Deselecting (unpinning) is a plain color/shape transition — no
celebration, celebrating a removal would read backwards. See that atom's
own README for the full breakdown (timing, easing, why it's an imperative
`useAnimate()` call, layout-safety). Respects `prefers-reduced-motion`.

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
| Chip hover | `--theme-alpha-black-switch-333` |
| Color motion | `--duration-fast` / `--ease-emphasized` |
| Celebration | Shared with Bookmark Icon Button — see its own Tokens table |
| Focus | `--effect-focus-ring-secondary` |

## Deferred

- **Press ripple / global push effect** — deferred with Toggle; shared
  Foundations recipe later. See
  [post-primitives docket](../../../.migration/post-primitives-docket.md).
