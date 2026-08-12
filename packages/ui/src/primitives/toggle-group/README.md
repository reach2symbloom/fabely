# Toggle Group

A set of two-state buttons that toggle exclusive or multi selection as one
cluster (connected or spaced).

## Purpose

Import from this primitive rather than `src/components/ui/toggle-group`. Prefer
**Toggle Group** when options toggle state; use
[Button Group](../button-group/README.md) for related actions.

## Sources

| Source | Role |
| --- | --- |
| [shadcn Toggle Group](https://ui.shadcn.com/docs/components/base/toggle-group) | API, composition, spacing changelog |
| Figma [Toggle Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=816-112827) (`816:112827`) | Item chrome (Skin · Size · Position · Active) |
| Figma [Examples](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=274-53727) (`274:53727`) | Connected vs spaced groups |

There is no separate Figma “Toggle Group” component set — groups are Toggle
Button cells with **Position** (Left / Middle / Right / Single).

## Composition

```text
ToggleGroup                 variant · size · spacing · orientation · multiple
├── ToggleGroupItem         value · optional icons / label
└── ToggleGroupItem
```

Base UI uses `multiple` (boolean). Single selection is the default
(`multiple={false}`) — equivalent to shadcn docs `type="single"`.

## Figma → API

| Figma | Code |
| --- | --- |
| Skin=Ghost | `variant="default"` |
| Skin=Outline | `variant="outline"` |
| Size=Small (32) | `size="sm"` |
| Size=Default (36) | `size="default"` |
| Size=Large (40) | `size="lg"` |
| Size=Mini (24) | Deferred (not on shadcn size ladder) |
| Position=* | Automatic when `spacing={0}` |
| Active?=Yes | `data-pressed` / `aria-pressed` → quiet `@5` |
| Roundness=Default | `--rounded-lg` end caps / singles |
| Roundness=Round | Deferred until Toggle lands |

### Spacing (2026-05-17)

| Need | Prop |
| --- | --- |
| Spaced pills (default) | `spacing={2}` (default) |
| Connected strip | `spacing={0}` |

## Tokens

| Concern | Foundations |
| --- | --- |
| Ghost face | `--theme-alpha-white-switch-001` |
| Active / hover fill | `--theme-alpha-black-switch-5` |
| Outline stroke | `--stroke-thin` + `--border` |
| Radius | `--rounded-lg` |
| Heights | sm `--spacing-2xl` · default `--spacing-9` · lg `--spacing-3xl` |
| Gap (spacing=2) | `2 × --spacing-2xs` (8px) |
| Focus | `--effect-focus-ring-secondary` |
| Icons | Lucide · `--icon-sm` |
| Motion | `--duration-fast` / `--ease-emphasized` |

## API

| Export | Notes |
| --- | --- |
| `ToggleGroup` | Base UI root; `spacing` default `2`; cascades `variant` / `size` |
| `ToggleGroupItem` | Base UI Toggle; inherits group context |
| `toggleGroupItemVariants` | CVA for advanced composition |

Always pass `aria-label` (or `aria-labelledby`) on the group. Icon-only items
need their own accessible name.

## Scope (this pass)

Ghost / Outline · `sm` / `default` / `lg` · Position via `spacing={0}` —
matching [Toggle Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=816-112827).

## Deferred

- **Toggle partner** — item chrome lives here because
  [Toggle](../toggle/README.md) is still thin-pass. Once Toggle lands, share
  `toggleVariants` (or compose Toggle) and drop the duplicated item styles.
  See [post-primitives docket](../../../.migration/post-primitives-docket.md).
- **Mini (24)** and **Round** — deferred; revisit when Toggle is built.
- **[Toggle Icon Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=164-20378)**
  (`164:20378`) — separate primitive (same relationship as Text Button /
  Icon Button). Revisit when Toggle is built.

## Related

- [Toggle](../toggle/README.md) — single toggle (thin-pass)
- [Button Group](../button-group/README.md) — actions, not selection state
- Docs: https://ui.shadcn.com/docs/components/base/toggle-group
