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
`thumbAlignment`). `value` / `defaultValue` may be a `number` or `number[]`;
thumb count follows array length (a bare number → one thumb).

| Figma | Code |
| --- | --- |
| Type=Default | `defaultValue={[n]}` (one thumb) |
| Type=Range narrow / wide | `defaultValue={[a, b]}` (two thumbs) |
| Horizontal / Vertical | `orientation` |

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
| Discrete dots | Auto when stop count ≤ 21 — `--theme-neutrals-500`, `--spacing-2xs`. Pointer scrubs smoothly; snaps on release. Keys move stop-to-stop. |

## Deferred

- **Field Slider** — Field host demos + Figma Type=Slider when Field revisit
  runs ([Field README](../field/README.md) · [docket](../../../.migration/post-primitives-docket.md)).

## Related

- [Field](../field/README.md) · [Label](../label/README.md) ·
  [Direction](../direction/README.md)
- Docs: [shadcn Slider](https://ui.shadcn.com/docs/components/base/slider)
