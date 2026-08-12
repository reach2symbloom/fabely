# Drawer

A swipeable panel that slides in from an edge of the viewport.

## Purpose

Import from this primitive rather than `src/components/ui/drawer`. Public API
matches [shadcn Drawer](https://ui.shadcn.com/docs/components/base/drawer)
(Base UI Drawer — not Vaul): Trigger, Content (portal / overlay / viewport /
popup), Header / Title / Description, Footer, Close, optional Swipe Handle,
Portal / Overlay for lower-level control.

## Figma source

[Fabely Design System → Drawer](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry?node-id=842-52050)
— component set **Drawer (Slots)** (bottom sheet: top radius, lg shadow, muted
swipe handle).

## Composition

```text
Drawer
├── DrawerTrigger
└── DrawerContent
    ├── DrawerHeader
    │   ├── DrawerTitle
    │   └── DrawerDescription
    ├── (body)
    └── DrawerFooter
```

`DrawerContent` composes portal, overlay, viewport, and popup. Also exported:
`DrawerPortal`, `DrawerOverlay`, `DrawerSwipeHandle`.

## Token substitutions

| Source | Foundations | Notes |
| --- | --- | --- |
| Surface radius | `--radius` | All corners (all swipe directions) |
| Surface fill / border | `--popover` / `--border` | |
| Shadow lg | `--shadow-lg-black` / `-white` | Theme pair |
| Stacked shadow | `--shadow-xl-black` / `-white` | Nested only |
| Bleed fill | transparent | Avoids edge hairline past radius; overshoot stays clear |
| Overlay scrim | `--overlay` | Shared with Dialog / Alert Dialog |
| Handle | `--muted` + `--rounded-xs` | ~50×3 vertical axis |
| Content pad / gap | `--spacing-md` / `--spacing-xs` | Header / footer |
| Title | Heading 4 | Serif light |
| Description | Paragraph Small Regular | `--muted-foreground` |
| Overlay motion | `--duration-drawer` + `--ease-drawer` | shadcn Base Drawer |
| Panel motion | `--duration-drawer` + `--ease-emphasized` | snappy ease-out |
| Content / handle | `--duration-normal` / `--duration-fast` | + `--ease-emphasized-in` |

Global: `body { position: relative }` in `src/styles/globals.css` for iOS Safari
overlay coverage after scroll (Base UI / shadcn note).

## API

| Export | Notes |
| --- | --- |
| `Drawer` | `swipeDirection`, `showSwipeHandle`, `snapPoints` / `snapPoint`, `modal`, … |
| `DrawerTrigger` / `DrawerClose` | Base UI `render` prop (not `asChild`) |
| `DrawerContent` | Owns portal + overlay when `modal` |
| `DrawerOverlay` / `DrawerPortal` / `DrawerSwipeHandle` | Lower-level |
| `DrawerHeader` / `DrawerFooter` / `DrawerTitle` / `DrawerDescription` | Layout + type |

## Deferred

- Re-verify Field / Input / Label / Radio Group hosts once those are
  Foundations-matched (Delivery Method + Responsive demos)
- Figma only defines the bottom-sheet slot — side / snap / nested chrome stays
  behavior-driven from Base UI until design expands the set

## Related

- [Dialog](../dialog/README.md) — responsive Dialog-on-desktop / Drawer-on-mobile
- [Sheet](../sheet/README.md) — separate edge panel (Dialog-based; no swipe)
- Docket: [post-primitives-docket.md](../../../.migration/post-primitives-docket.md)
