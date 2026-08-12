# Switch

A control that toggles between checked and not checked.

## Purpose

Import from this primitive rather than `src/components/ui/switch`. Prefer
**Switch** for binary settings; use [Toggle](../toggle/README.md) /
[Toggle Group](../toggle-group/README.md) for toolbar-style presses. Prefer
**Switch Light** for soft / ambient chrome (theme toggles, Figma Toggle Light).

## Sources

| Source | Role |
| --- | --- |
| [shadcn Switch](https://ui.shadcn.com/docs/components/base/switch) | API, composition |
| Figma [Switch](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16-1801) (`16:1801`) | Checked? · State |
| Figma [Toggle Light](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=5846-24869) (`5846:24869`) | Soft track · Icon · Size |
| Figma [Switch](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-49184) page (`842:49184`) | Page |

## Composition

```text
Switch         size · checked / defaultChecked · disabled · aria-invalid
SwitchLight    size · icon? · same Switch root props
```

Base UI Switch — controlled via `checked` / `onCheckedChange`, or
`defaultChecked` for uncontrolled. Thumb is internal. Switch Light adds an
optional decorative `icon` opposite the thumb.

## Figma → API

| Figma | Code |
| --- | --- |
| Checked?=False | `data-unchecked` / `checked={false}` |
| Checked?=True | `data-checked` / `checked` |
| State=Default | rest |
| State=Focus | `:focus-visible` → secondary ring |
| State=Disabled | `disabled` · opacity 50 |
| (shadcn) size sm / default | `size="sm"` / `size="default"` |
| Toggle Light Size=Mini | `SwitchLight` `size="sm"` |
| Toggle Light Size=Regular | `SwitchLight` `size="default"` |
| Toggle Light Icon=True | `icon={<…/>}` |
| Toggle Light Icon=False | omit `icon` |

## Tokens

### Switch

| Concern | Foundations |
| --- | --- |
| Track off | `--theme-alpha-black-switch-10` |
| Track on | `--primary` |
| Track elevation | `--shadow-xs-black` |
| Thumb | `--background` · dark unchecked `--foreground` · dark checked `--primary-foreground` |
| Focus | `--effect-focus-ring-secondary` |
| Invalid (on) | `--destructive` · `--effect-focus-ring-error` |
| Radius | `--rounded-full` |
| Default size | ≈33×18 (`spacing-2xl+3xs` × `md+3xs`) · thumb `--spacing-md` |
| Sm size | ≈28×16 · thumb `--spacing-sm` |
| Motion | `--duration-fast` / `--ease-emphasized` |

### Switch Light (Toggle Light)

| Concern | Foundations |
| --- | --- |
| Track | `--theme-alpha-white-no-switch-5` · border `--theme-alpha-black-switch-333` (Figma `5846:24890`) |
| Track on hover | border / fill bump to `--theme-alpha-white-no-switch-10` (greyscale only) |
| Off | same chrome at `--opacity-focus-ring-rest` (greyed) |
| Thumb | hollow ring · `--stroke-regular` · `--theme-neutrals-600` off / `--theme-neutrals-500` on |
| Focus | soft white-alpha ring (no chromatic / messaging tint) |
| Icon | Solar Bold Duotone · `--icon-sm` / `--icon-lg` · `--theme-neutrals-500` |
| Mini | 40×24 / 42×24 · thumb `--spacing-md` · pad `--spacing-0-75` |
| Regular | 56×32 / 60×32 · thumb `--spacing-xl` |
| Motion | `--duration-normal` (300ms) · `--ease-out` (Figma Smart Animate EASE_OUT) |

## API

| Export | Notes |
| --- | --- |
| `Switch` | Root + Thumb; `size` default `default` |
| `SwitchSize` | `'sm' \| 'default'` |
| `SwitchLight` | Soft Toggle Light chrome; optional `icon` |
| `SwitchLightSize` | `'sm' \| 'default'` (Mini / Regular) |

## Scope (this pass)

Figma Switch Checked?/State · shadcn sm/default · Field demos (Description,
Choice Card, Disabled, Invalid) · RTL · **Switch Light** (Toggle Light
`5846:24869`).

## Deferred

- **Switch Group / Rich Switch Container** — labeled compositions on the Switch
  page; demos use Field for now. See
  [post-primitives docket](../../../.migration/post-primitives-docket.md).
- **Cycle switch** — product filter control (out of scope).
