# Menubar

Persistent menu bar for desktop-style command sets.

## Purpose

Import from this primitive rather than `src/components/ui/menubar`. Public API
matches [shadcn Menubar](https://ui.shadcn.com/docs/components/base/menubar)
(Base UI [Menubar](https://base-ui.com/react/components/menubar)). Menus
compose the owned [Dropdown Menu](../dropdown-menu) — ListItem rows, card
surface — so row chrome stays shared.

## Figma source

No dedicated Menubar component set in Fabely Design System. Bar + trigger use
Foundations; popup chrome and rows inherit Dropdown Menu.

## Composition

```text
Menubar
├── MenubarMenu
│   ├── MenubarTrigger
│   └── MenubarContent
│       ├── MenubarGroup
│       │   ├── MenubarLabel
│       │   ├── MenubarItem          → ListItem
│       │   └── …
│       ├── MenubarSeparator
│       ├── MenubarGroup
│       │   ├── MenubarCheckboxItem  → ListItem + indicator in Media
│       │   └── …
│       ├── MenubarRadioGroup
│       │   ├── MenubarLabel
│       │   └── MenubarRadioItem     → ListItem + indicator in Media
│       └── MenubarSub
│           ├── MenubarSubTrigger    → ListItem + chevron in Trailing
│           └── MenubarSubContent
└── MenubarMenu
    └── …
```

`MenubarShortcut` nests inside an Item and lands in **ListItemTrailing**
(rewritten to `DropdownMenuShortcut` for the ListItem mapper).

## Token substitutions

| Role | Foundations |
| --- | --- |
| Bar fill / border | `--background` / `--border` |
| Bar radius | `--rounded-lg` |
| Bar pad / gap | `--spacing-2xs` |
| Trigger radius | `--rounded-md` (concentric with bar) |
| Trigger type | Paragraph Small Medium |
| Trigger pad | `--spacing-xs` / `--spacing-2xs` |
| Trigger hover / open | `--muted` |
| Content / rows | Dropdown Menu (card surface + ListItem); pad overridden to `--spacing-2xs` (4) |

## API

| Export | Notes |
| --- | --- |
| `Menubar` | Base UI `Menubar` root |
| `MenubarMenu` | Dropdown Menu root (`data-slot="menubar-menu"`) |
| `MenubarTrigger` | Paragraph Small Medium; muted hover / `aria-expanded` |
| `MenubarContent` | Defaults `align="start"`, `alignOffset={-4}`, `sideOffset={8}`, `min-w-48` |
| `MenubarItem` / Checkbox / Radio / Sub* | Thin wrappers over Dropdown Menu leaves |
| `MenubarShortcut` | Maps into ListItemTrailing |

## Deferred

- Optional Figma Menubar set if design adds one later
- Re-verify bar chrome if a dedicated app-shell Menubar lands in Library

## Related

- [Dropdown Menu](../dropdown-menu/README.md) — shared popup + ListItem rows
- Docket: [post-primitives-docket.md](../../../.migration/post-primitives-docket.md)
- Docs: [shadcn Menubar](https://ui.shadcn.com/docs/components/base/menubar)
