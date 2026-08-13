# Button Group

Container that joins related buttons (and optional inputs) into one segmented
control with consistent edge treatment.

## Purpose

Import from this primitive rather than `src/components/ui/button-group`.
Compose with Fabely [Text Button](../button/text-button/README.md) /
[Icon Button](../button/icon-button/README.md). Prefer **Button Group** for
actions; use **Toggle Group** when options toggle exclusive state.

## Sources

| Source | Role |
| --- | --- |
| [shadcn Button Group](https://ui.shadcn.com/docs/components/base/button-group) | API, composition, a11y |
| Figma [Button Group](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=784-82792) (`784:82792`) | Join radii, Outline / Ghost chrome |

## Hierarchy

Two levels — do not invent a `separate` prop.

```text
1. Fused cluster (default)
   ButtonGroup  roundness="default" | "round"
   ├── Button / IconButton   ← shared edge, square inner corners
   └── Button / IconButton

2. Spaced toolbar (nested)
   ButtonGroup                          ← parent: gap --spacing-xs between kids
   ├── ButtonGroup                      ← column 1 (e.g. icon)
   │   └── IconButton
   ├── ButtonGroup                      ← column 2 (fused text)
   │   ├── Button
   │   └── Button
   └── ButtonGroup                      ← column 3 (text + menu)
       ├── Button
       └── DropdownMenu ▸ IconButton
```

| Need | Pattern |
| --- | --- |
| One joined strip | Single `ButtonGroup` with Button / IconButton children |
| Gaps between strips (reference image) | Nest `ButtonGroup`s inside a parent `ButtonGroup` |
| Roundrect vs round caps | `roundness` on group **and** matching children |
| Divider inside a fused strip | `ButtonGroupSeparator` |
| Gaps between Outline clusters | Prefer nested groups — Separator is for in-strip divides |

### Height parity (text + icon)

| Text `size` | Height | Icon `size` | Notes |
| --- | --- | --- | --- |
| `small` | 32 | `sm` | Exact |
| `default` | 40 | `lg` | Exact — **not** Icon `default` (36) |
| `large` | 44 | `lg` | Group stretches icon to 44 |

When a group tree mixes a Text Button with an Icon Button — or a
`DropdownMenu` / `Popover` trigger rendered as one — icon boxes are forced to
the Text `data-size` height (including nested spaced-toolbar columns).

### Height parity (fused Input)

Standalone Icon Button Default is 36 and SelectTrigger Default is 36; Input
Default is 40. Inside a fused `ButtonGroup` that has a direct `Input` child,
those shorter partners stretch to `--spacing-3xl` (40) so the join has no
step. Standalone Icon Button / Select defaults are unchanged.

## Composition

```text
ButtonGroup                 orientation · roundness
├── Button / IconButton / Input / SelectTrigger / …
├── ButtonGroup             nested → spaced toolbar
├── ButtonGroupSeparator    optional in-strip divider
└── ButtonGroupText         optional label chrome (supports `render`)
```

## Figma → API

Figma models **cells** (Variant · Size · Position · State). The primitive is a
**container** — Position (Left / Middle / Right / Single) is derived from
sibling CSS, not a prop.

| Figma | Code |
| --- | --- |
| Variant=Outline | Child `variant="outline"` |
| Variant=Ghost | Child `variant="ghost"` |
| Size=Small (32) | Text `size="small"` / Icon `sm` |
| Size=Default (36) | Icon `default` (36); Text has no 36 — use `small` (32) or `default` (40) |
| Size=Large (40) | Text `default` (40) / Icon `lg` (40) |
| Position=* | Automatic via join selectors |
| State=* | Child hover / focus / disabled |
| Corner radius | `--rounded-lg` (12) roundrect · `--rounded-full` when `roundness="round"` |

### Outline / Ghost tokens (on the child Button)

| Figma Variant | Fill | Border | Hover |
| --- | --- | --- | --- |
| Outline | `--theme-alpha-black-switch-333` | `--stroke-thin` + `--border` | quiet `@5` / `@10` |
| Ghost | `--theme-alpha-white-switch-001` | transparent | quiet `@5` / `@10` |

Focus uses `--effect-focus-ring-secondary`. Disabled → opacity 0.5.

## Tokens (container)

| Concern | Foundations |
| --- | --- |
| End-cap radius | `--rounded-lg` (12) or `--rounded-full` via `roundness` |
| Nested group gap | `--spacing-xs` |
| Text chrome pad / type | `--spacing-2-5`, Paragraph Small Medium |
| Text chrome fill / border | `--muted`, `--border` |
| Separator | `--input`; inset `--stroke-thin` |
| Icons in text chrome | `--icon-sm` |

## API

| Export | Notes |
| --- | --- |
| `ButtonGroup` | `role="group"`; `orientation` horizontal \| vertical; `roundness` default \| round |
| `ButtonGroupSeparator` | Wraps Separator; default orientation `vertical` (for horizontal groups) |
| `ButtonGroupText` | Label / addon surface; `render` for custom host (e.g. Label) |
| `buttonGroupVariants` | CVA for advanced composition |

Always pass `aria-label` or `aria-labelledby` on the group.

## Deferred

Input, Input Group, Select, and Popover are Foundations-matched. Re-verify
fused stories (join, height parity) and trim join selectors that only existed
for vendor stubs. Tracked in
[post-primitives docket](../../../.migration/post-primitives-docket.md).

## Related

- [Button family](../button/README.md) — shared `outline` / `ghost`
- [Separator](../separator/README.md)
- [Post-primitives docket](../../../.migration/post-primitives-docket.md)
- shadcn docs: https://ui.shadcn.com/docs/components/base/button-group
