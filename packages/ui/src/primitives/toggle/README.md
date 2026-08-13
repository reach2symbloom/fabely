# Toggle

A two-state button that can be on or off (standalone Toggle Button).

## Purpose

Import from this primitive rather than `src/components/ui/toggle`. Prefer
**Toggle** for a single on/off control; use
[Toggle Group](../toggle-group/README.md) when options toggle as a cluster.

## Sources

| Source | Role |
| --- | --- |
| [shadcn Toggle](https://ui.shadcn.com/docs/components/base/toggle) | API, composition |
| Figma [Toggle Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=816-112827) (`816:112827`) | Position=Single chrome (Skin · Size · Active · Roundness) |

## Composition

```text
Toggle    variant · size · roundness · pressed / defaultPressed
```

Base UI Toggle — controlled via `pressed` / `onPressedChange`, or
`defaultPressed` for uncontrolled.

## Figma → API

| Figma | Code |
| --- | --- |
| Skin=Ghost | `variant="ghost"` |
| Skin=Outline | `variant="outline"` |
| Size=Small (32) | `size="sm"` |
| Size=Default (36) | `size="default"` |
| Size=Large (40) | `size="lg"` |
| Size=Mini (24) | Deferred (not on shadcn size ladder) |
| Position=Single | Standalone Toggle (this primitive) |
| Active?=Yes | `data-pressed` / `aria-pressed` → quiet `@5` |
| Roundness=Default | `roundness="default"` — `--rounded-lg` |
| Roundness=Round | `roundness="round"` — `--rounded-full` |

## Tokens

| Concern | Foundations |
| --- | --- |
| Ghost face | `--theme-alpha-white-switch-001` |
| Active / hover fill | `--theme-alpha-black-switch-5` |
| Outline stroke | `--stroke-thin` + `--border` |
| Radius (default) | `--rounded-lg` |
| Radius (round) | `--rounded-full` |
| Heights | sm `--spacing-2xl` · default `--spacing-9` · lg `--spacing-3xl` |
| Focus | `--effect-focus-ring-secondary` |
| Icons | Lucide · `--icon-sm` |
| Motion | `--duration-fast` / `--ease-emphasized` (color / fill transitions) |

## API

| Export | Notes |
| --- | --- |
| `Toggle` | Base UI Toggle; `roundness` default `default` |
| `toggleVariants` | Shared CVA — also used by Toggle Group items |
| `ToggleRoundness` | `'default' \| 'round'` |

Icon-only toggles need an accessible name (`aria-label`).

## Scope (this pass)

Ghost / Outline · `sm` / `default` / `lg` · Roundness default / round —
matching [Toggle Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=816-112827)
Position=Single. Same chrome as Toggle Group items via shared
`toggleVariants`.

## Deferred

- **Mini (24)** — deferred; not on the shadcn size ladder. Revisit if product
  needs a compact control.
- **[Toggle Icon Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=164-20378)**
  (`164:20378`) — separate primitive (same relationship as Text Button /
  Icon Button). See
  [post-primitives docket](../../../.migration/post-primitives-docket.md).
- **Press ripple / global push effect** — click-origin ripple was prototyped
  on Toggle and pulled; ship as a shared Foundations motion / interaction
  recipe later (not Toggle-only). See
  [post-primitives docket](../../../.migration/post-primitives-docket.md).

## Related

- [Toggle Group](../toggle-group/README.md) — clustered toggles (shares
  `toggleVariants`)
- [Bookmark Button](../../atoms/bookmark-button/README.md) — atom demo of
  Toggle with Lucide Bookmark fill in/out (Storybook Demo)
- Docs: https://ui.shadcn.com/docs/components/base/toggle
