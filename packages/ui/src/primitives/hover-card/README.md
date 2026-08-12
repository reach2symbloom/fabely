# Hover Card

Preview content available behind a link or control on hover.

## Purpose

Import from this primitive rather than `src/components/ui/hover-card`. Public
API matches [shadcn Hover Card](https://ui.shadcn.com/docs/components/base/hover-card)
(Base UI [Preview Card](https://base-ui.com/react/components/preview-card)).

## Figma source

No dedicated Hover Card component set in Fabely Design System. Content chrome
uses the same Foundations floating-panel tokens as Dialog / Dropdown
(`--radius`, border, lg shadow), with fill `--background` / `--foreground`
(not `--popover`).

## Composition

```text
HoverCard
├── HoverCardTrigger   (delay / closeDelay live here)
└── HoverCardContent   (side / align / sideOffset / alignOffset)
```

## Token substitutions

| Role | Foundations |
| --- | --- |
| Fill / text | `--background` / `--foreground` |
| Radius | `--radius` |
| Border | `--border` |
| Padding | `--spacing-xs` (8) |
| Shadow | `--shadow-lg-black` / `--shadow-lg-white` | Optional via `shadow` |
| Body type | Paragraph Small Regular |
| Width default | `w-72` (override via `className`) |

## API

| Export | Notes |
| --- | --- |
| `HoverCard` | Root (`PreviewCard.Root`) |
| `HoverCardTrigger` | `delay` / `closeDelay`; `render` for custom triggers |
| `HoverCardContent` | Portal + Positioner + Popup; `side` / `align` defaults `bottom` / `center`; `alignOffset` defaults `0`; `shadow` defaults `true` (`false` removes elevation) |

## Deferred

- Re-verify surface once **Tooltip** is Foundations-matched — share one
  floating-panel recipe with [Popover](../popover/README.md) if they converge
  (Popover uses `--popover`; this uses `--background`)
- Optional Figma Hover Card set if design adds one later

## Related

- Docket: [post-primitives-docket.md](../../../.migration/post-primitives-docket.md)
- Docs: [shadcn Hover Card](https://ui.shadcn.com/docs/components/base/hover-card)
