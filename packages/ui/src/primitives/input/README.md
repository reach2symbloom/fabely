# Input

Owned text field from Figma [Input](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16-1738)
(`16:1738`) with the [shadcn Input](https://ui.shadcn.com/docs/components/base/input) API.

Vendor `src/components/ui/input.tsx` stays untouched.

## Anatomy

```
Input
├── decorationLeft?   (open slot — icon / Fade Button / …)
├── <input>
└── decorationRight?  (open slot — icon / Fade Button / …)
```

Labels, helpers, and errors compose via Field. Prepend / append **text** and
richer addon strips compose via Input Group. Decorations are open slots (not
icon-only): pass a Lucide glyph today, or an interactive control (e.g. Fade
Button) when that lands.

## Props

| Prop | Values | Notes |
| --- | --- | --- |
| `variant` | `default` \| `ghost` | Figma Style |
| `size` | `mini` \| `small` \| `default` \| `large` | Figma Mini / Small / Regular / Large |
| `roundness` | `default` \| `round` | Figma Roundness; Mini Default uses `--rounded-md` |
| `decorationLeft` / `decorationRight` | `ReactNode` | Open slots; bare SVG scales with `size` |
| native | `type`, `disabled`, `aria-invalid`, … | Base UI / HTML input |

## Tokens

| Role | Token |
| --- | --- |
| Default fill | `--theme-alpha-black-switch-333` |
| Value / file label | `--foreground` |
| Placeholder | `--muted-foreground` |
| Decorations | Open slot; bare SVG → `--icon-xs` / `sm` / `sm` / `md` (20 max); Figma is 16 flat |
| Decorations ↔ field gap | `--spacing-2xs` / `1-5` / `xs` / `sm` by size |
| Focus ring | `--effect-focus-ring-secondary` |
| Focus border (Default roundness) | `--neutrals-new-400` |
| Focus border (Round) | `--theme-alpha-black-switch-15` |
| Invalid border / focus ring | `--destructive` / `--effect-focus-ring-error` |
| Invalid fill | `--background` |
| Type | Paragraph Mini / Small / Regular Regular by size |
| Radius | `--rounded-lg` (Default), `--rounded-md` (Mini Default), `--rounded-full` (Round) |
| Heights | `--spacing-xl` / `2xl` / `3xl` / `4xl` |

## Deferred

- **Fade Button / interactive decorations** — slots accept them; re-verify sizing
  once Fade Button (or Icon Button-in-field) lands.
- **Ghost Mini display type** — Figma Ghost Mini placeholder uses Heading 4
  Light; we keep Paragraph Mini Regular for a consistent field control.
- **Input Group hosts** — re-check Field / Combobox / Empty demos that compose
  Input Group after those partners settle (Input Group shell is Foundations).
