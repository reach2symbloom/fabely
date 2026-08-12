# Command

Command menu for search and quick actions ([cmdk](https://github.com/dip/cmdk)).

## Purpose

Import from this primitive rather than `src/components/ui/command`. Public API
matches [shadcn Command](https://ui.shadcn.com/docs/components/base/command):
`Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`,
`CommandGroup`, `CommandItem`, `CommandShortcut`, `CommandSeparator`.

## Figma source

[Fabely Design System → Command](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry?node-id=842-52048)
— **Command** (`66:5046`), **Command Item** (`66:5600`), **Command group**.

## Composition

```text
Command
├── CommandInput
└── CommandList
    ├── CommandEmpty
    ├── CommandGroup
    │   └── CommandItem (+ CommandShortcut)
    └── CommandSeparator
```

`CommandDialog` wraps the tree in Dialog for palette / modal use.

## Token substitutions

| Role | Foundations | Notes |
| --- | --- | --- |
| Root surface | `--background` · `--border` · `--radius` (16) · `--spacing-xs` (8) pad | Single inset for search, results, divider |
| Elevation | `--shadow-sm-*` | |
| Input | `--spacing-9` · `--rounded-lg` · stroke `@10` | Wrapper `pb` `--spacing-xs` (top = root pad only) |
| Group heading | Caption Mini · uppercase · muted | Same family as menu labels |
| Item | `ListItem` via cmdk `asChild` | Radius `--rounded-lg` (12); cmdk active → `data-highlighted` only |
| Shortcut | Paragraph Mini Regular · muted | |
| Separator | `--theme-alpha-black-switch-5` · `--stroke-thin` | Full content width (root pad only) |
| List scroll | `scroll-fade` · `no-scrollbar` | Top + bottom edge fades when content overflows |

## Deferred

- **Dialog** — `CommandDialog` should pick up Foundations Dialog chrome;
  re-verify overlay / radius / close against [Dialog](../dialog/README.md).
- **Input Group** — search field still uses vendor InputGroup internals.
- **Command Item Square icon** — Figma Style=Square icon (36 Icon Button) not
  exposed as a prop this pass; Small icon / Lucide child composition covers
  the default demos.

## Related

- [ListItem](../list-item/README.md) — shared row interaction tokens
- [Combobox](../combobox/README.md) — related searchable list
- shadcn: https://ui.shadcn.com/docs/components/base/command
- cmdk: https://github.com/dip/cmdk
