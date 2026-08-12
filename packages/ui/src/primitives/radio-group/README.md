# Radio Group

A set of checkable buttons where only one can be selected at a time.

## Purpose

Import from this primitive rather than `src/components/ui/radio-group`. Public
API matches [shadcn Radio Group](https://ui.shadcn.com/docs/components/base/radio-group)
(Base UI [Radio Group](https://base-ui.com/react/components/radio-group) +
[Radio](https://base-ui.com/react/components/radio)): `value` /
`defaultValue` / `onValueChange`, `disabled`, per-item `aria-invalid`.

## Figma source

[Fabely Design System → Radio](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System)
— component sets **Radio** and **Radio Group** (`Checked?` × `State`). Twin to
[Checkbox](../checkbox/README.md) so Field hosts can swap control types.

## Token substitutions

| Source | Foundations | Notes |
| --- | --- | --- |
| Control 16×16 · circle | `--spacing-md` · `rounded-full` | Same box as Checkbox |
| Unchecked fill / stroke | `--background` / `--input` | |
| Checked fill | `--primary` | Dot `--primary-foreground` |
| Indicator dot | `--spacing-xs` (8) | |
| Error stroke / fill | `--destructive` | |
| Focus ring | `--effect-focus-ring-primary` | Error → `--effect-focus-ring-error` |
| Group gap | `--spacing-sm` (12) | Matches Field radio rows |
| Indicator enter/exit | `scale-50` · `--duration-fast` | Base UI starting/ending style |
| Disabled checked dot | `opacity-60` | Same mute as Checkbox glyph |

## Composition

```text
RadioGroup
├── RadioGroupItem
└── RadioGroupItem
```

Pair with [Field](../field/README.md) (`FieldLabel`, `FieldDescription`,
`FieldSet` / `FieldLegend`) for labeled layouts, descriptions, choice cards,
and fieldsets — see shadcn docs.

## API

| Export | Notes |
| --- | --- |
| `RadioGroup` | Root; grid + `--spacing-sm` gap |
| `RadioGroupItem` | Single radio; Lucide-free primary-fill dot |

## Deferred

- Pixel-QA against Figma Radio matrix if product needs exact State specimen
  parity beyond Checkbox twin tokens.
- [Field README → Deferred](../field/README.md#deferred) Radio demos — re-check
  once this lands in Storybook consumers.

## Related

- [Checkbox](../checkbox/README.md) · [Field](../field/README.md) · [Label](../label/README.md)
- Docs: [shadcn Radio Group](https://ui.shadcn.com/docs/components/base/radio-group)
