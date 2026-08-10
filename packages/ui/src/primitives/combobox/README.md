# Combobox

Autocomplete input with a list of suggestions.

## Purpose

Import from this primitive rather than `src/components/ui/combobox`. Public API
matches [shadcn Combobox](https://ui.shadcn.com/docs/components/base/combobox)
(Base UI Combobox): input + popup list, chips multi-select, groups, clear, etc.

## Figma source

[Fabely Design System → Select & Combobox](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry?node-id=842-49185)
— shared field set **Select & Combobox** (`16:1732`). Combobox decoration uses
**Chevrons up-down** (Select uses chevron-down). Popup rows share the Menu Item
set via [ListItem](../list-item/README.md).

## Composition

```text
Combobox
├── ComboboxInput          (or ComboboxChips + ComboboxChipsInput)
└── ComboboxContent
    ├── ComboboxEmpty
    └── ComboboxList
        └── ComboboxItem   (+ Group / Label / Collection / Separator)
```

## Token substitutions

| Role | Foundations | Notes |
| --- | --- | --- |
| Field height (Default) | `--spacing-9` (36) | Input fixed; Chips `min-height` then grows on wrap |
| Field radius | `--rounded-lg` (12) | |
| Field stroke | `--theme-alpha-black-switch-10` | Focus → `--input` + secondary ring |
| Error stroke | `--destructive` | Focus → error ring |
| Trigger glyph | `--icon-sm` ChevronsUpDown | Figma Combobox decoration |
| Popup surface | `--card` / `--radius` / `--shadow-lg-*` | Same family as Dropdown |
| List rows | ListItem | Check in Trailing via ItemIndicator |
| Chips | `--rounded-sm` · alpha `@5` fill | Remove via IconButton mini ghost |

## Deferred

- **Input Group** — ComboboxInput still hosts vendor InputGroup internals;
  re-verify once Input Group is Foundations-matched. Input Group addon demo
  deferred similarly.
- **Size ladder** — Figma Large / Small / Mini field heights not yet exposed as
  Combobox props (Default only for this pass).
- **Style Ghost** — Figma Style=Ghost field (no stroke) not yet a prop.
- **Deletable Chip primitive** — `ComboboxChip` + remove control is inline
  Foundations chrome today. No shared deletable Chip exists under
  `src/primitives/` yet. Refactor Multiple chips to compose that primitive
  once it lands (keep ComboboxChip as a thin host).

## Related

- [ListItem](../list-item/README.md) — popup rows
- [Dropdown Menu](../dropdown-menu/README.md) — shared popup chrome patterns
- shadcn: https://ui.shadcn.com/docs/components/base/combobox
- Base UI: https://base-ui.com/react/components/combobox
