# Textarea

Owned multi-line field from Figma [Textarea](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16-1745)
(`16:1745`) with the [shadcn Textarea](https://ui.shadcn.com/docs/components/base/textarea) API.

Vendor `src/components/ui/textarea.tsx` stays untouched.

## Anatomy

```
Textarea
├── <textarea>
└── character count?   (when showCharacterCount + maxLength)
```

Labels, helpers, and errors compose via Field. Addon strips compose via
Input Group (`InputGroupTextarea`).

## Props

| Prop | Values | Notes |
| --- | --- | --- |
| `roundness` | `default` \| `round` | Figma Roundness; Round → `--radius` (16; Figma is 18) |
| `resizable` | `boolean` (default `true`) | CSS `resize-y` / `resize-none`; insets grip from the border |
| `showCharacterCount` | `boolean` (default `false`) | Needs `maxLength`; Figma “Show character count” |
| native | `disabled`, `aria-invalid`, `maxLength`, … | HTML textarea |

## Tokens

| Role | Token |
| --- | --- |
| Default fill | `--theme-alpha-black-switch-333` |
| Value | `--foreground` |
| Placeholder / count | `--muted-foreground` |
| Focus ring | `--effect-focus-ring-secondary` |
| Focus border | `--gradient-primary-top-bottom` via mask-composite ring on shell `::before` (Button `primaryOutline` recipe — stroke only, not a fill) |
| Invalid border / focus ring | `--destructive` / `--effect-focus-ring-error` |
| Invalid / disabled fill | `--background` |
| Disabled border / shadow | `--input` / `--shadow-xs-black`; opacity `30` |
| Type | Paragraph Small Regular; count → Mini Regular |
| Radius | `--rounded-lg` (Default), `--radius` (Round) |
| Pad | `--spacing-xs` (Default), `--spacing-sm` (Round) |
| Resize grip inset | `--spacing-1-25` (Default), `--spacing-1-75` (Round) — shell `pr`/`pb` when `resizable` |

## Deferred

- **Round 18px** — Figma uses 18; Foundations has no 18 step → `--radius` (16).
- **Custom resize grip** — Figma vector; we use the browser resize handle.
- **Input Group demos** — re-verify once partners settle (shell already bare-hosts
  this control). See Input Group README / docket.

## Related

- [Field](../field/README.md) · [Input](../input/README.md) ·
  [Input Group](../input-group/README.md)
- Docs: [shadcn Textarea](https://ui.shadcn.com/docs/components/base/textarea)
