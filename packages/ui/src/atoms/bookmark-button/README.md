# Bookmark Button

Bare icon toggle — no button chrome at all. Three states: unselected
(stroked outline, `alpha-20` rest → `alpha-50` hover), selected (solid
filled glyph, `primary`).

## Purpose

Fabely bookmark / save affordance. Composes Base UI's headless
[`Toggle`](https://base-ui.com/react/components/toggle) primitive directly —
not the styled [Toggle](../../primitives/toggle/README.md) atom, which
carries pill/ghost/outline chrome this control deliberately has none of.

## Sources

| Source | Role |
| --- | --- |
| Figma [Bookmark Icon Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16066-5970) (`16066:5970`) | Visual — Hover × Active |
| [Base UI Toggle](https://base-ui.com/react/components/toggle) | Headless pressed API — `aria-pressed` / `data-pressed` |

## Composition

```text
BookmarkButton → Base UI Toggle (headless, unstyled) + Lucide Bookmark + Superscript badge
```

Fetching the raw Figma SVG assets (not just the screenshot) showed unselected
and selected are genuinely different shapes, not the same path recolored:
unselected/hover share one path drawn as a stroked outline; selected is a
separate, solid-filled path. `BookmarkButton` reproduces that with the same
Lucide glyph rendered two ways — stroke-only when unselected, filled when
selected — rather than a single shape with a fill-opacity trick.

| State | Color | Rendering |
| --- | --- | --- |
| Unselected, rest | `--theme-alpha-black-switch-20` | stroke, `fill="none"` |
| Unselected, hover | `--theme-alpha-black-switch-50` | stroke, `fill="none"` |
| Selected (pressed), rest or hover | `--primary` | filled, `stroke-width={0}` |

Color transition uses Foundations `--duration-fast` / `--ease-emphasized`.
Hover-only color step is scoped with `not-data-pressed:not-aria-pressed:hover:`
so it never fights the selected-state color rule.

The optional count badge (Figma `Show superscript`, `16231:7082`/`7091`) sits
absolute at `-top-2 left-4` of the Icon box, `paragraph-mini-medium`
typography at a `10px` override, `--muted-foreground` text, `--spacing-2xs` /
`--spacing-3xs` padding. Visibility is `showSuperscript && pressed`, decided
by the shared [`useSuperscript`](../../hooks/use-superscript.ts) hook — the
same rule Icon Button and Chapter Nav Button will reuse for their own
deferred superscript axis.

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `pressed` / `defaultPressed` / `onPressedChange` | — | From Base UI Toggle |
| `size` | `default` | `sm` / `default` / `lg` — glyph size only, no hit-target chrome |
| `showSuperscript` | `false` | Figma `Show superscript`; badge only renders while `pressed` |
| `superscriptValue` | `2` | Badge content; Figma default is the literal "2" |
| `forceHover` | `false` | Storybook-only — locks the hover paint via `data-force-hover` without a real pointer |
| `trailingContent` | — | Extra content inside this same button, after the glyph — e.g. [Gather Bookmark Button](../../features/note-retrieved/gather-bookmark-button/README.md)'s revealed label, sharing this button's click target/cursor instead of sitting as an inert sibling |
| `aria-label` | auto | `"Bookmark"` off · `"Remove bookmark"` on |

There is no `variant` or `roundness` prop — this control has no container
chrome for either to style.

## Tokens

| Concern | Foundations |
| --- | --- |
| Glyph (default size) | Lucide · `--icon-md` (Figma 20) |
| Glyph (`sm` / `lg`) | `--icon-sm` / `--icon-lg` |
| Color | `currentColor` ← `--theme-alpha-black-switch-20` / `-50` / `--primary` |
| Motion | `--duration-fast` / `--ease-emphasized` |
| Focus | `--effect-focus-ring-secondary` |

## Deferred

- **Press ripple / global push effect** — deferred with Toggle; shared
  Foundations recipe later. See
  [post-primitives docket](../../../.migration/post-primitives-docket.md).
