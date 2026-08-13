# Context Menu

The Fabely Context Menu primitive — shadcn composition API with every leaf
row rendered through **ListItem**. Mirrors [Dropdown Menu](../dropdown-menu/README.md).

## Purpose

Import from this primitive rather than `src/components/ui/context-menu`.
Menus must not hand-roll row chrome — see `docs/DESIGN.md` (ListItem).

## Base UI — Label must be inside Group

`ContextMenuLabel` must render inside `ContextMenuGroup` or
`ContextMenuRadioGroup`. Base UI’s `GroupLabel` reads group context and
throws if used as a direct child of Content.

This differs from Radix, where Label could sit loosely in Content. Wrap
every label (and prefer wrapping items) in a Group.

```tsx
<ContextMenuContent>
  <ContextMenuGroup>
    <ContextMenuLabel>Account</ContextMenuLabel>
    <ContextMenuItem>Profile</ContextMenuItem>
  </ContextMenuGroup>
</ContextMenuContent>
```

## Composition

```text
ContextMenu
├── ContextMenuTrigger
└── ContextMenuContent
    ├── ContextMenuGroup
    │   ├── ContextMenuLabel
    │   ├── ContextMenuItem          → ListItem
    │   ├── ContextMenuCheckboxItem  → ListItem + indicator in Media
    │   └── …
    ├── ContextMenuRadioGroup        ← also provides group context for Label
    │   ├── ContextMenuLabel
    │   └── ContextMenuRadioItem     → ListItem + indicator in Media
    ├── ContextMenuSeparator
    └── ContextMenuSub
        ├── ContextMenuSubTrigger    → ListItem + chevron in Trailing
        └── ContextMenuSubContent
```

`ContextMenuShortcut` nests inside an Item and lands in **ListItemTrailing**.

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
(Checkbox / Radio). Library over vendor. Same as Dropdown Menu.

## Surface tokens (Content / SubContent)

| Role | Foundations |
| --- | --- |
| Radius | `--radius` (16) |
| Fill / text | `--card` / `--card-foreground` |
| Border | `--stroke-thin` + `--border` |
| Shadow | `--shadow-lg-black` / `dark: --shadow-lg-white` |
| Padding | `--spacing-xs` |
| Min width | `min-w-72` (18rem) — room for icon + copy + shortcut |
| Overflow | `scroll-fade` · `no-scrollbar` |

Default Content position (vendor): `align="start"`, `alignOffset={4}`,
`side="right"`, `sideOffset={0}`. Trigger keeps `select-none`.

Unlike Dropdown Menu, Content does **not** set `w-(--anchor-width)` —
context triggers are often large hit areas; the menu should not stretch
to match them.

## Label

Caption Mini Medium, uppercase, `--text-caption-mini-letter-spacing`,
`--muted-foreground`.

## Separator

Full-bleed edge to edge: `-mx-[var(--spacing-xs)]` cancels Content padding.
Matches Dropdown Menu (`--border`, not Command’s alpha-5).

| Role | Token |
| --- | --- |
| Line thickness | `--stroke-thin` (1px) |
| Line color | `--border` |
| Vertical margin | `--spacing-xs` (8px) |

## API

Matches shadcn / vendor prop names (`inset`, Item `variant`, Content
positioning). No additional Fabely-only props.
