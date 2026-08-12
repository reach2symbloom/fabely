# Skeleton

Placeholder shape while content is loading.

## Purpose

Import from this primitive rather than `src/components/ui/skeleton`. Public
API matches [shadcn Skeleton](https://ui.shadcn.com/docs/components/base/skeleton)
— a single `div` sized/shaped via `className`. Storybook demos follow the
base-nova docs previews (`skeleton-demo`, `skeleton-avatar`,
`skeleton-card`, `skeleton-text`, `skeleton-form`, `skeleton-table`,
`skeleton-rtl`) plus Figma placeholder recipes.

## Figma source

[Skeleton](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-52052)
page (`842:52052`).

| Figma | Code recipe |
| --- | --- |
| Skeleton / Placeholder Avatar (`222:27480`) | `size-[length:var(--spacing-4xl)] rounded-full` |
| Skeleton / Placeholder Line (`222:27481`) | `h-[length:var(--spacing-md)] w-*` (default radius) |
| Skeleton / Placeholder Object (`222:27487`) | block height/width via `className` (default radius) |
| Composed Skeleton (`303:246698`) | Avatar + stacked Line / Object (story Demo) |

## Token substitutions

| Role | Foundations |
| --- | --- |
| Fill | `--theme-alpha-black-switch-333` |
| Default radius (Line / Object) | `--rounded-md` |
| Avatar radius | `--rounded-full` via `className` |
| Avatar size (Figma 48) | `--spacing-4xl` |
| Line height (Figma 16) | `--spacing-md` |
| Motion | Tailwind `animate-pulse` (Figma Pulse) |

## API

| Export | Notes |
| --- | --- |
| `Skeleton` | `div`; compose size/shape with `className` |

## Deferred

- [ ] **Skeleton loader / atoms** (`5846:22761`) — Wave vs Pulse, Position
      Start/End, Theme Light/Dark. Pulse is covered by `animate-pulse`; Wave
      wash needs a dedicated keyframe / alpha gradient. See post-primitives
      docket.
- [ ] **Skeleton loader Device** examples (`5846:23361`) — Mobile / Desktop
      composed loaders; optional story once Wave lands.

## Related

- [Sidebar](../sidebar/README.md) (`SidebarMenuSkeleton`) · [Spinner](../spinner/README.md)
- Docs: [shadcn Skeleton](https://ui.shadcn.com/docs/components/base/skeleton)
