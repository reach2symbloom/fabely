# Separator

Visually or semantically separates content.

## Purpose

Import from this primitive rather than `src/components/ui/separator`. Public
API matches [shadcn Separator](https://ui.shadcn.com/docs/components/base/separator)
(Base UI [Separator](https://base-ui.com/react/components/separator)), plus
Figma `size` and `spacing`.

## Figma source

[Fabely Design System → Separator (Divider)](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry)
— component set **Separator (Divider)** with axes:

| Axis | Values | Code |
| --- | --- | --- |
| Orientation | False / True | `orientation` `vertical` / `horizontal` |
| Size | Thin / Thick | `size` `thin` (1) / `thick` (4) |
| Spacing | None / Regular / Spacious | `spacing` `none` / `regular` / `spacious` |

Line fill: `alpha/black/switch/alpha-5` → `--theme-alpha-black-switch-5`.

## Composition

```text
Separator
```

When `spacing` is not `none`, an inner line span is centered in the track.

## Token substitutions

| Role | Foundations | Notes |
| --- | --- | --- |
| Line fill | `--theme-alpha-black-switch-5` | Figma Divider |
| Thin | `--stroke-thin` (1) | Default |
| Thick | `--stroke-thick` (4) | |
| Regular gutters | `--spacing-2xs` (H) / `--spacing-3xs` (V) | Around the line |
| Spacious track | `--spacing-md` (16) | Fixed cross-axis; line centered |

## Deferred

- **Text divider / Dot divider** — separate Figma sets; not this primitive.
- **FieldSeparator** — already composes this Separator; revisit Field docs once
  Field polish lands (see Field README Deferred).

## Related

- [Field](../field/README.md) — `FieldSeparator`
- shadcn: https://ui.shadcn.com/docs/components/base/separator
- Base UI: https://base-ui.com/react/components/separator
