# Navigation Menu

Collection of links for navigating websites / app sections (mega-menu style).

## Purpose

Import from this primitive rather than `src/components/ui/navigation-menu`.
Public API matches
[shadcn Navigation Menu](https://ui.shadcn.com/docs/components/base/navigation-menu)
(Base UI [Navigation Menu](https://base-ui.com/react/components/navigation-menu)).

**vs [Menubar](../menubar/README.md):** Menubar is a persistent desktop command
bar (menus compose Dropdown Menu / ListItem). Navigation Menu is for site or
section navigation with larger content panels (grids, title + description links).

## Figma source

[Navigation Menu](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=294-233298)
(`294:233298`) — page
[Navigation Menu](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-51938).

Triggers are Ghost Button (default size). Example panel uses
**Menu (Slots)** (`294:233301`) — popover surface with slotted link grid.

## Composition

```text
NavigationMenu
├── NavigationMenuList
│   ├── NavigationMenuItem
│   │   ├── NavigationMenuTrigger
│   │   └── NavigationMenuContent
│   │       ├── NavigationMenuLink
│   │       └── NavigationMenuLink
│   └── NavigationMenuItem
│       └── NavigationMenuLink   (+ navigationMenuTriggerStyle for top-level)
└── NavigationMenuIndicator
```

`NavigationMenuPositioner` is mounted inside `NavigationMenu` (viewport popup).
Use the `render` prop on `NavigationMenuLink` for Next.js `Link` (etc.).

## Token substitutions

| Role | Foundations |
| --- | --- |
| Trigger | Ghost Button default: `--spacing-3xl` height, `--rounded-lg`, `--spacing-2-5` / `--spacing-xs` pad |
| Trigger type | Paragraph Small Medium · `--muted-foreground` → `--foreground` on hover / open |
| Trigger hover / open | `--theme-alpha-black-switch-5` |
| Chevron | Lucide · `--icon-xs` · rotate with `--duration-normal` / `--ease-emphasized` |
| Popup | `--popover` / `--popover-foreground` · `--rounded-xl` · `--border` · `--shadow-lg-*` |
| Content pad | `--spacing-xs` |
| Link | `--rounded-md` · `--spacing-xs` pad · hover `@5` / active `@10` |
| Motion | Vendor `cubic-bezier(0.22,1,0.36,1)` / `0.35s` → `--ease-emphasized` / `--duration-normal` (exit `--duration-fast`) |

## API

| Export | Notes |
| --- | --- |
| `NavigationMenu` | Root; accepts `align` for positioner |
| `NavigationMenuList` / `Item` | List shell |
| `NavigationMenuTrigger` | Ghost Button chrome + chevron |
| `navigationMenuTriggerStyle` | CVA for top-level `NavigationMenuLink` |
| `NavigationMenuContent` | Panel body (grid / links) |
| `NavigationMenuLink` | Link surface; compose title + description in children |
| `NavigationMenuIndicator` | Optional caret under active trigger |
| `NavigationMenuPositioner` | Portal + popup (usually auto-mounted) |

## Deferred

- Optional featured / image link layouts if Library adds Navigation Menu content variants

## Related

- [Menubar](../menubar/README.md) — command menus, not site nav
- [Button](../button/text-button/README.md) — Ghost trigger chrome
- [ListItem](../list-item/README.md) — denser menu rows (Dropdown / Menubar)
- Docs: [shadcn Navigation Menu](https://ui.shadcn.com/docs/components/base/navigation-menu)
