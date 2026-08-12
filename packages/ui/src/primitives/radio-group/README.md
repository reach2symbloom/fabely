# Radio Group

A set of checkable buttons where only one can be selected at a time.

## Purpose

Import from this primitive rather than `src/components/ui/radio-group`. Public
API matches [shadcn Radio Group](https://ui.shadcn.com/docs/components/base/radio-group)
(Base UI [Radio Group](https://base-ui.com/react/components/radio-group) +
[Radio](https://base-ui.com/react/components/radio)).

## Figma source

- [Radio](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16-1796)
  — `Checked?` × `State` (Default / Focus / Error / Error Focus / Disabled)
- [Rich Radio Chip](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=19-5987)
  — choice-card host chrome lives on [Field](../field/README.md) `FieldLabel`

## Token substitutions

| Source | Foundations | Notes |
| --- | --- | --- |
| Control 16×16 · circle | `--spacing-md` · `rounded-full` | |
| Unchecked fill / stroke | `--background` / `--input` | + `--shadow-xs-black` |
| Checked Default fill | `--gradient-primary-left-right` | Stone gradient (not secondary purple) |
| Checked Default dot | `--theme-neutrals-900` (#27272A) | |
| Error checked fill / dot | `--destructive` / `--tw-raw-white` | |
| Focus ring | `--effect-focus-ring-secondary` | Checked → `--effect-focus-ring-primary` |
| Group gap | `--spacing-sm` (12) | |
| Choice-card checked (Card) | `--background` fill + `--gradient-primary-top-bottom` border + primary focus ring | `FieldLabel choice="card"` |
| Choice-card checked (Icon / Block) | same primary gradient border + ring (Block fill `--tw-raw-black`) | `choice="icon"` / `choice="block"` |

## Composition

```text
RadioGroup
├── RadioGroupItem
└── RadioGroupItem
```

Pair with Field (`FieldLabel`, `FieldDescription`, `FieldSet` / `FieldLegend`)
for labeled layouts and **Rich Radio Container** (Figma [19:5987](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=19-5987)):
Card (radio + Line 1/2, optional Flipped), Icon SM/LG chips, and vertical Block
tiles.

## API

| Export | Notes |
| --- | --- |
| `RadioGroup` | Root; grid + `--spacing-sm` gap |
| `RadioGroupItem` | Single radio |

## Related

- [Checkbox](../checkbox/README.md) · [Field](../field/README.md)
- Docs: [shadcn Radio Group](https://ui.shadcn.com/docs/components/base/radio-group)
