# Input

Owned text field from Figma [Input](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16-1738)
(`16:1738`) with the [shadcn Input](https://ui.shadcn.com/docs/components/base/input) API.

Vendor `src/components/ui/input.tsx` stays untouched.

## Anatomy

```
Input
```

Single control — labels, helpers, and errors compose via Field. Icons / prepend /
append text compose via Input Group.

## Props

| Prop | Values | Notes |
| --- | --- | --- |
| `variant` | `default` \| `ghost` | Figma Style |
| `size` | `mini` \| `small` \| `default` \| `large` | Figma Mini / Small / Regular / Large |
| `roundness` | `default` \| `round` | Figma Roundness; Mini Default uses `--rounded-md` |
| native | `type`, `disabled`, `aria-invalid`, … | Base UI / HTML input |

## Tokens

| Role | Token |
| --- | --- |
| Default fill | `--theme-alpha-black-switch-333` |
| Value / file label | `--foreground` |
| Placeholder | `--muted-foreground` |
| Focus ring | `--effect-focus-ring-secondary` |
| Focus border (Default roundness) | `--neutrals-new-400` |
| Focus border (Round) | `--theme-alpha-black-switch-15` |
| Invalid border / focus ring | `--destructive` / `--effect-focus-ring-error` |
| Invalid fill | `--background` |
| Type | Paragraph Mini / Small / Regular Regular by size |
| Radius | `--rounded-lg` (Default), `--rounded-md` (Mini Default), `--rounded-full` (Round) |
| Heights | `--spacing-xl` / `2xl` / `3xl` / `4xl` |

## Deferred

- **Input Group** — Figma prepend / append / decoration left-right; shadcn Input
  Group demos stay thin-pass until that primitive is Foundations-matched. Docket
  when composing.
- **Ghost Mini display type** — Figma Ghost Mini placeholder uses Heading 4
  Light; we keep Paragraph Mini Regular for a consistent field control.
