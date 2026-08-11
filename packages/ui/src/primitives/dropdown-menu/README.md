# Dropdown Menu

The Fabely Dropdown Menu primitive — shadcn composition API with every leaf
row rendered through **ListItem**.

## Purpose

Import from this primitive rather than `src/components/ui/dropdown-menu`.
Menus must not hand-roll row chrome — see `docs/DESIGN.md` (ListItem).

## Base UI — Label must be inside Group

`DropdownMenuLabel` must render inside `DropdownMenuGroup` or
`DropdownMenuRadioGroup`. Base UI’s `Menu.GroupLabel` reads
`MenuGroupContext` and throws if used as a direct child of Content.

This differs from Radix, where Label could sit loosely in Content. The
same rule applies to Context Menu (and will apply when Menubar gets its
Foundations pass) — wrap every label (and prefer wrapping items) in a Group.

```tsx
<DropdownMenuContent>
  <DropdownMenuGroup>
    <DropdownMenuLabel>Account</DropdownMenuLabel>
    <DropdownMenuItem>Profile</DropdownMenuItem>
  </DropdownMenuGroup>
</DropdownMenuContent>
```

## Composition

```text
DropdownMenu
├── DropdownMenuTrigger
└── DropdownMenuContent
    ├── DropdownMenuGroup
    │   ├── DropdownMenuLabel
    │   ├── DropdownMenuItem          → ListItem
    │   ├── DropdownMenuCheckboxItem  → ListItem + indicator in Media
    │   └── …
    ├── DropdownMenuRadioGroup        ← also provides group context for Label
    │   ├── DropdownMenuLabel
    │   └── DropdownMenuRadioItem     → ListItem + indicator in Media
    ├── DropdownMenuSeparator
    └── DropdownMenuSub
        ├── DropdownMenuSubTrigger    → ListItem + chevron in Trailing
        └── DropdownMenuSubContent
```

`DropdownMenuShortcut` nests inside an Item and lands in **ListItemTrailing**.

Two-line rows: nest `ListItemTitle` + `ListItemDescription` in
`ListItemContent` (or pass those slots as Item children — the mapper wraps
them).

## Row → ListItem

| Part | ListItem mapping |
| --- | --- |
| `Item` | `variant` default \| destructive |
| Leading icons (Lucide, etc.) | `ListItemMedia` |
| Label text | `ListItemContent` / `ListItemTitle` |
| `Shortcut` | `ListItemTrailing` |
| Checkbox / radio indicator | `ListItemMedia` |
| SubTrigger chevron | `ListItemTrailing` |

### Deviation — checkbox / radio indicator side

Vendor / shadcn place the check on the **right**. We put indicators in
**ListItemMedia (leading)** so Trailing stays reserved for shortcuts and
submenu chevrons — matching Figma Menu Item left-decoration types
(Checkbox / Radio). Library over vendor.

## Surface tokens (Content / SubContent)

| Role | Foundations |
| --- | --- |
| Radius | `--radius` (16) |
| Fill / text | `--card` / `--card-foreground` |
| Border | `--stroke-thin` + `--border` |
| Shadow | `--shadow-lg-black` / `dark: --shadow-lg-white` |
| Padding | `--spacing-xs` |
| Min width | `min-w-72` (18rem) — room for icon + copy + shortcut |

## Label

Caption Mini Medium, uppercase, `--text-caption-mini-letter-spacing`,
`--muted-foreground`.

## Separator

Full-bleed edge to edge: `-mx-[var(--spacing-xs)]` cancels Content padding.

| Role | Token |
| --- | --- |
| Line thickness | `--stroke-thin` (1px) |
| Line color | `--border` |
| Vertical margin | `--spacing-xs` (8px) |

## API

Matches shadcn / vendor prop names (`inset`, Item `variant`, Content
positioning). No additional Fabely-only props.
