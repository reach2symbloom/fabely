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
| Figma [Button Group](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=784-82792) (`784:82792`) | Join radii / Position axis |

## Composition

```text
ButtonGroup                 orientation="horizontal" | "vertical"
├── Button / IconButton / Input / SelectTrigger / …
├── ButtonGroupSeparator    optional divider (filled / secondary pairs)
└── ButtonGroupText         optional label chrome (supports `render`)
```

Nest `ButtonGroup` inside `ButtonGroup` when you need a gap between clusters
(`--spacing-xs`).

## Figma → API

Figma models **cells** (Variant · Size · Position · State). The primitive is a
**container** — Position (Left / Middle / Right / Single) is derived from
sibling CSS, not a prop.

| Figma | Code |
| --- | --- |
| Variant=Outline | Child `variant="primaryOutline"` (or `secondary` / `fiaOutline` / Icon `outline`) |
| Variant=Ghost | Child `variant="ghost"` |
| Size=Small / Default / Large | Child Button `size` (`small` / `default` / `large`) |
| Position=* | Automatic via join selectors |
| State=* | Child hover / focus / disabled |

**Size note:** Figma Default cell is 36 tall; Text Button `default` is 40.
Library Button sizes win — do not invent a 36px Text Button for groups.

## Tokens

| Concern | Foundations |
| --- | --- |
| End-cap radius | `--rounded-lg` (12) — matches Figma + Text Button Default roundness |
| Nested group gap | `--spacing-xs` |
| Text chrome pad / type | `--spacing-2-5`, Paragraph Small Medium |
| Text chrome fill / border | `--muted`, `--border` |
| Separator | `--input`; inset `--stroke-thin` |
| Icons in text chrome | `--icon-sm` |

## API

| Export | Notes |
| --- | --- |
| `ButtonGroup` | `role="group"`; `orientation` horizontal (default) \| vertical |
| `ButtonGroupSeparator` | Wraps Separator; default orientation `vertical` (for horizontal groups) |
| `ButtonGroupText` | Label / addon surface; `render` for custom host (e.g. Label) |
| `buttonGroupVariants` | CVA for advanced composition |

Always pass `aria-label` or `aria-labelledby` on the group.

## Related

- [Button family](../button/README.md)
- [Separator](../separator/README.md)
- shadcn docs: https://ui.shadcn.com/docs/components/base/button-group
