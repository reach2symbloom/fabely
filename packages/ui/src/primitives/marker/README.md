# Marker

Inline conversation markers — status notes, bordered rows, and labeled
separators.

## Purpose

Import from this primitive rather than `src/components/ui/marker`. Public API
matches [shadcn Marker](https://ui.shadcn.com/docs/components/base/marker)
(`Marker`, `MarkerIcon`, `MarkerContent`, `markerVariants`). Compose with
[Message](../message/README.md) in a thread when Message is matched.

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
| Type | Paragraph Small Regular |
| Color | `--muted-foreground` (hover links → `--foreground`) |
| Icon | `--icon-sm` (16) |
| Icon ↔ content gap | `--spacing-xs` (8) |
| Separator line gap | `--spacing-2xs` (4) |
| Separator / border stroke | `--border` |
| Border variant pad bottom | `--spacing-xs` (8) |
| Link underline offset | `underline-offset-4` (matches Field / Empty) |

## API

| Export | Notes |
| --- | --- |
| `Marker` | `variant`: `default` \| `border` \| `separator`; `render` for link/button |
| `MarkerIcon` | Decorative icon slot |
| `MarkerContent` | Text; optional `shimmer` class when utility lands |
| `markerVariants` | CVA helper |

## Deferred

- [ ] **Message** — re-verify thread composition once Message is
  Foundations-matched
- [ ] **Spinner** — Status demos use thin-pass Spinner until matched
- [ ] **Shimmer utility** — add streaming-text story when `shimmer` ships in
  package styles (shadcn shimmer util)

Docket: post-primitives when Message / Spinner land.
