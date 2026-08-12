# Sidebar

Composable application sidebar (provider, rail, menu items, mobile Sheet).

## Purpose

Import from this primitive rather than `src/components/ui/sidebar`. Public API
matches [shadcn Sidebar](https://ui.shadcn.com/docs/components/base/sidebar):
Provider, Sidebar (`side`, `variant`, `collapsible`), Trigger / Rail / Inset,
Header / Footer / Content, Group (+ Label / Action / Content), Menu (+ Button /
Action / Badge / Sub), Separator, Input, Skeleton.

## Figma source

[Fabely Design System → Sidebar](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry?node-id=842-51929)
(`842:51929`) — component sets:

| Set | Maps to |
| --- | --- |
| Sidebar Item / Expanded / 1st Level | `SidebarMenuButton` (h-36, `--rounded-md`) |
| Sidebar Item / Expanded / 2nd Level | `SidebarMenuSubButton` (h-32) |
| Sidebar Item / Collapsed | Icon-collapsible rail |
| Sidebar Group Label | `SidebarGroupLabel` (caption mini, uppercase) |
| Sidebar Badge | `SidebarMenuBadge` |

Example shells in Figma are ~240px; code keeps the shadcn default **`16rem`**
(`SIDEBAR_WIDTH`). Override via `--sidebar-width` on `SidebarProvider` when
product needs the tighter Figma width.

## Composition

```text
SidebarProvider
├── Sidebar
│   ├── SidebarHeader
│   ├── SidebarContent
│   │   └── SidebarGroup
│   │       ├── SidebarGroupLabel
│   │       ├── SidebarGroupAction
│   │       ├── SidebarGroupContent
│   │       └── SidebarMenu
│   │           └── SidebarMenuItem
│   │               ├── SidebarMenuButton
│   │               ├── SidebarMenuAction
│   │               ├── SidebarMenuBadge
│   │               └── SidebarMenuSub
│   ├── SidebarFooter
│   └── SidebarRail
├── SidebarInset
└── SidebarTrigger
```

## Token substitutions

| Role | Foundations | Notes |
| --- | --- | --- |
| Surface / text / accent / border / ring | `--sidebar*` | From Foundations colors |
| Expanded width | `16rem` | shadcn default; override `--sidebar-width` |
| Icon width | `3rem` | Collapsed rail |
| Item radius | `--rounded-md` (8) | Figma 1st-level items |
| Item height | `--spacing-9` (36) | |
| Icons | `--icon-sm` | Lucide |
| Group label | Caption mini + uppercase | `--muted-foreground` |
| Header / footer / group pad | `--spacing-xs` (8) | Keeps icon rail (3rem) centered |
| Focus | `--effect-focus-ring-sidebar` | With `ring-sidebar-ring` |
| Mobile host | [Sheet](../sheet/README.md) | Edge panel |

## Deferred

- Full shadcn **sidebar-demo** (teams / nested collapsibles / user footer) as a
  single mega-story — Menu / Header / Footer / Controlled / RTL cover the docs
  surface; compose the rest in product.
- Sticky footer fade / scrollable presets from Figma Scrollable* variants on
  related panels.
- Tooltip uses `variant="inverse"` for collapsed icon labels (delay 0).
  Skeleton is Foundations-matched (`--theme-alpha-black-switch-333`).

## Related

- [Sheet](../sheet/README.md) — mobile sidebar host
- [Button](../button/README.md) — Icon Button trigger
- [Separator](../separator/README.md) — `SidebarSeparator`
- shadcn: https://ui.shadcn.com/docs/components/base/sidebar
