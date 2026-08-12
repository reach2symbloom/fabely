# Bookmark Button

Icon-only bookmark toggle — outline when off, filled glyph when on.

## Purpose

Fabely composition around [Toggle](../../primitives/toggle/README.md) for a
save / bookmark affordance. Prefer this atom when the control is specifically
a bookmark; use bare Toggle for generic on/off chrome.

## Sources

| Source | Role |
| --- | --- |
| Figma [Bookmark Icon Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16066-5970) (`16066:5970`) | Visual — Hover × Active, fill in/out |
| [Toggle](../../primitives/toggle/README.md) | Pressed API, size, roundness, skins |

## Composition

```text
BookmarkButton → Toggle (Ghost · round by default) + Lucide Bookmark
```

Off uses `--foreground` outline; on uses `--primary` fill (`16066:5970`
variable map). Fill in/out is a CSS `fill-opacity` + color transition on the
Lucide glyph
(`0` → `1` when `data-pressed` / `aria-pressed`), using Foundations
`--duration-fast` / `--ease-emphasized`.

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `pressed` / `defaultPressed` / `onPressedChange` | — | From Toggle |
| `variant` | `ghost` | Ghost quiet face / Outline |
| `size` | `default` | `sm` / `default` / `lg` — Toggle hit target |
| `roundness` | `round` | Figma Bookmark Icon Button is full-round |
| `aria-label` | auto | `"Bookmark"` off · `"Remove bookmark"` on |

## Tokens

| Concern | Foundations |
| --- | --- |
| Glyph (default size) | Lucide · `--icon-md` (Figma 20) |
| Glyph (`sm`) | `--icon-sm` |
| Color | `currentColor` ← Toggle `--foreground` |
| Motion | `--duration-fast` / `--ease-emphasized` |
| Radius | `--rounded-full` via Toggle `roundness="round"` |

## Deferred

- **Superscript count** — Figma optional “2” badge on active. Revisit when
  product needs multi-bookmark counts.
- **Press ripple / global push effect** — deferred with Toggle; shared
  Foundations recipe later. See
  [post-primitives docket](../../../.migration/post-primitives-docket.md).
