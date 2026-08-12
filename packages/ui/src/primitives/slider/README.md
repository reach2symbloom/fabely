# Slider

Owned range input from Figma [Slider Horizontal](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=65-4902)
(`65:4902`) / [Slider Vertical](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=162-17939)
(`162:17939`) with the [shadcn Slider](https://ui.shadcn.com/docs/components/base/slider) API.

Vendor `src/components/ui/slider.tsx` stays untouched.

## Anatomy

```
Slider
├── Track (Overall)
│   └── Indicator / Value (Primary gradient)
└── Thumb(s) (.Marker) — one per value array entry
```

## Props

Public API matches Base UI / shadcn Slider (`value` / `defaultValue` /
`onValueChange`, `min` / `max` / `step`, `orientation`, `disabled`,
`thumbAlignment`), plus Fabely `interaction`. `value` / `defaultValue` may be
a `number` or `number[]`; thumb count follows array length (a bare number →
one thumb).

| Figma | Code |
| --- | --- |
| Type=Default | `defaultValue={[n]}` (one thumb) |
| Type=Range narrow / wide | `defaultValue={[a, b]}` (two thumbs) |
| Horizontal / Vertical | `orientation` |

| Prop | Default | Notes |
| --- | --- | --- |
| `interaction` | `"smooth"` | `"smooth"` — no track notches. `"discrete"` — dots at each `step` stop (capped at 21); drag and keys snap stop-to-stop. |

## Tokens

| Role | Token |
| --- | --- |
| Track fill | `--theme-alpha-black-switch-333` (H/V; Vertical Figma muted reconciled) |
| Track cross-axis | `--stroke-bold` (6 — Figma track) |
| Track / thumb radius | `--rounded-full` |
| Value (horizontal) | `--gradient-primary-left-right` |
| Value (vertical) | `--gradient-primary-top-bottom` |
| Thumb size | Oblong pill — `--spacing-md` × `--spacing-xl` (swapped when vertical) |
| Thumb fill | `--theme-neutrals-700` |
| Thumb elevation | `--shadow-md-black` |
| Thumb focus | `--effect-focus-ring-secondary` |
| Discrete dots | `interaction="discrete"` only — `--theme-alpha-white-no-switch-25`, `--stroke-regular` (2px). Placed on the edge-aligned thumb path (`--spacing-xl` inset) so marks line up with the thumb. Hidden when stop count > 21. |

## Deferred

- **Field Slider** — Field host demos + Figma Type=Slider when Field revisit
  runs ([Field README](../field/README.md) · [docket](../../../.migration/post-primitives-docket.md)).

## Related

- [Field](../field/README.md) · [Label](../label/README.md) ·
  [Direction](../direction/README.md)
- Docs: [shadcn Slider](https://ui.shadcn.com/docs/components/base/slider)
