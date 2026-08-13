# Select

Displays a list of options for the user to pick from — triggered by a button.

## Purpose

Import from this primitive rather than `src/components/ui/select`. Public API
matches [shadcn Select](https://ui.shadcn.com/docs/components/base/select)
(Base UI [Select](https://base-ui.com/react/components/select)). Prefer this
for designed popups; use [Native Select](../native-select) for OS pickers.

## Figma source

[Fabely Design System → Select & Combobox](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry?node-id=16-1732)
— shared field set **Select & Combobox** (`16:1732`). Select decoration uses
**chevron-down** (Combobox uses chevrons-up-down). Popup rows share the Menu
Item set via [ListItem](../list-item/README.md).

## Composition

```text
Select
├── SelectTrigger
│   └── SelectValue
└── SelectContent
    ├── SelectGroup
    │   ├── SelectLabel
    │   └── SelectItem   (+ optional SelectSeparator)
    └── SelectScrollUpButton / SelectScrollDownButton
```

## Token substitutions

| Role | Foundations | Notes |
| --- | --- | --- |
| Trigger height (Default) | `--spacing-9` (36) | Figma Size=Default |
| Trigger height (Sm) | `--spacing-2xl` (32) | Figma Size=Small; shadcn `size="sm"` |
| Trigger radius | `--rounded-lg` (12) | |
| Trigger stroke | `--theme-alpha-black-switch-10` | Focus → `--input` + secondary ring |
| Error stroke | `--destructive` | Focus → error ring |
| Trigger glyph | `--icon-sm` ChevronDown | Figma Select decoration |
| Popup surface | `--card` / `--radius` / `--shadow-lg-*` | Same family as Dropdown |
| Popup fade | `scroll-fade-y` | Top + bottom when list overflows |
| List rows | ListItem | Check in Trailing via ItemIndicator |

## Deferred

- **Size ladder** — Figma Large (40) / Mini (20) not exposed; shadcn API is
  `sm` \| `default` only for this pass.
- **Style Ghost / Round** — Figma Style=Ghost and Round axes not yet props.
- **Lines=2 (stacked label)** — Figma 2-line field chrome not composed here;
  use Field label outside the trigger.

## Related

- [Combobox](../combobox/README.md) — shared Select & Combobox field set
- [Native Select](../native-select/README.md) — native `<select>` chrome
- [ListItem](../list-item/README.md) — popup rows
- [Dropdown Menu](../dropdown-menu/README.md) — shared popup chrome patterns
- shadcn: https://ui.shadcn.com/docs/components/base/select
- Base UI: https://base-ui.com/react/components/select
