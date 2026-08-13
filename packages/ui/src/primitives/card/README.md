# Card

Surface for grouped content — header, body, and footer.

## Purpose

Import from this primitive rather than `src/components/ui/card`. Public API
matches [shadcn Card](https://ui.shadcn.com/docs/components/base/card)
(`size`, `--card-spacing`, composition parts) plus Figma **Style** as
`variant` and section dividers as `bordered`.

## Figma source

[Fabely Design System → Card](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry?node-id=5844-10842)
— component set Style **Outline** | **Shadow**.

## Composition

```text
Card                 size · variant · bordered · --card-spacing
├── CardHeader       bordered → full-width border-b
│   ├── CardTitle
│   ├── CardDescription
│   └── CardAction
├── CardContent
└── CardFooter       bordered → full-width border-t
```

Optional leading media as first child of `Card` (or a relative wrapper) for
image cards — vendor clips top radius via `has-[>img:first-child]:pt-0`.
Edge-to-edge muted bands: `bordered` + `bg-muted` on `CardContent`.

## Token substitutions

| Source | Foundations | Notes |
| --- | --- | --- |
| Figma `rounded-xl` / radius-20 | `--rounded-xl` (20) | Not semantic `--radius` (16) |
| Figma section pad `md` | `--spacing-md` (16) | Default `--card-spacing` |
| shadcn `data-[size=sm]` | `--spacing-sm` (12) | Small size (no Figma size) |
| Figma header/body gap `xs` | `--spacing-xs` (8) | Title ↔ description |
| Figma Style=Outline | `--stroke-thin` / `--border` | Outer stroke, no elevation |
| Figma Style=Shadow | outer stroke + `--shadow-2xl-*` | Elevation on top of stroke |
| `bordered` section rules | `--stroke-thin` / `--border` | Under header / above footer when those slots render |
| Vendor `text-sm` / title | Paragraph Small / Regular Medium | |
| `bg-card` / `text-card-foreground` | `--card` / `--card-foreground` | Restated |

### Left on vendor

- `@container/card-header` grid + `CardAction` placement
- `has-[>img:first-child]:pt-0` image flush behavior

## API

| Export | Notes |
| --- | --- |
| `Card` | `size`: `default` \| `sm`; `variant`: `outline` \| `shadow`; `bordered`: section dividers; override spacing with `[--card-spacing:…]` |
| `CardHeader` / `CardTitle` / `CardDescription` / `CardAction` | Header row |
| `CardContent` | Body inset |
| `CardFooter` | Actions row |
| `CardProps` / `CardVariant` / `CardSize` | Public types |

## Deferred

Story examples to revisit once partners are Foundations-matched (also tracked
on the [post-primitives docket](../../.migration/post-primitives-docket.md)):

- **Playground list** — already ListItem; re-check padding / density if ListItem
  chrome changes

## Related

- [Button](../button/README.md) — footer / header actions
- [Badge](../badge/README.md) — common `CardAction` child
- shadcn docs: https://ui.shadcn.com/docs/components/base/card
