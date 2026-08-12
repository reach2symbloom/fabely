# Marker

Inline conversation markers — status notes, bordered rows, and labeled
separators.

## Purpose

Import from this primitive rather than `src/components/ui/marker`. Public API
matches [shadcn Marker](https://ui.shadcn.com/docs/components/base/marker)
(`Marker`, `MarkerIcon`, `MarkerContent`, `markerVariants`), plus Foundations
`textStyle` × `size`. Compose with [Message](../message/README.md) in a thread
when Message is matched.

## Figma source

No dedicated conversation Marker set in Fabely Design System. (Todo marker
OC / Slider `.Marker` are unrelated.) Type, color, gaps, and icon size map to
Foundations — same approach as [Hover Card](../hover-card/README.md).

## Composition

```text
Marker
├── MarkerIcon      (decorative; aria-hidden)
└── MarkerContent
```

## Token substitutions

| Role | Foundations |
| --- | --- |
| `textStyle="paragraph"` × `size="sm"` | Paragraph Small Regular |
| `textStyle="paragraph"` × `size="mini"` | Paragraph Mini Regular |
| `textStyle="caption"` × `size="sm"` | Caption Sm · uppercase |
| `textStyle="caption"` × `size="mini"` | Caption Mini · uppercase |
| `textStyle="heading"` × `size="mini"` | Heading 4 |
| `textStyle="heading"` × `size="sm"` | Heading 3 |
| Color | `--muted-foreground` (hover links → `--foreground`) |
| Icon `iconSize="auto"` | Follows text `size` — mini → `--icon-xs`, sm → `--icon-sm` |
| Icon `iconSize` explicit | `--icon-xs` / `--icon-sm` / `--icon-md` / `--icon-lg` |
| Icon ↔ content gap | `--spacing-xs` (8) |
| Separator line gap | `--spacing-2xs` (4) |
| Separator / border stroke | `--border` |
| Border variant pad bottom | `--spacing-xs` (8) |
| Link underline offset | `underline-offset-4` (matches Field / Empty) |

## API

| Export | Notes |
| --- | --- |
| `Marker` | `variant`: `default` \| `border` \| `separator`; `textStyle`: `paragraph` \| `caption` \| `heading`; `size`: `mini` \| `sm`; `iconSize`: `auto` \| `xs` \| `sm` \| `md` \| `lg`; `render` for link/button |
| `MarkerIcon` | Optional decorative icon slot — omit for text-only |
| `MarkerContent` | Text; add `className="shimmer"` for streaming status |
| `markerVariants` | CVA helper |
| `MarkerTextStyle` | `'paragraph' \| 'caption' \| 'heading'` |
| `MarkerSize` | `'mini' \| 'sm'` |
| `MarkerIconSize` | `'auto' \| 'xs' \| 'sm' \| 'md' \| 'lg'` |

Defaults: `textStyle="paragraph"`, `size="sm"`, `iconSize="auto"`.

Shimmer utility: `packages/ui/src/styles/shimmer.css` (imported via
`globals.css`) — same recipe as [shadcn shimmer](https://ui.shadcn.com/docs/utils/shimmer).

## Deferred

- [ ] **Message** — re-verify thread composition once Message is
  Foundations-matched
- [ ] **Spinner** — Status demos use thin-pass Spinner until matched

Docket: post-primitives when Message / Spinner land.
