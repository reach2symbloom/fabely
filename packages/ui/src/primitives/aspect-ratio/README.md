# Aspect Ratio

Locked media frame from Figma [Aspect Ratio](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-52053)
(`842:52053`) with the [shadcn Aspect Ratio](https://ui.shadcn.com/docs/components/base/aspect-ratio) API.

Vendor `src/components/ui/aspect-ratio.tsx` stays untouched.

A ratio lock is **optional**. Use it when the layout needs a stable hole
(card covers, rails, thumbnails). Skip it when the media already looks right
at its intrinsic size — the frame should serve the composition, not the other
way around.

## Figma source

Component set **Aspect** `16:9` | `4:3` | `1:1` | `3:4` | `9:16`. Placeholder
shade `--theme-neutrals-300`; radius `--radius`; overflow clip.

No Fabely custom set on **Custom components** (template page only).

| Figma Aspect | `ratio` |
| --- | --- |
| 16:9 | `16 / 9` |
| 4:3 | `4 / 3` |
| 1:1 | `1` |
| 3:4 | `3 / 4` |
| 9:16 | `9 / 16` |

Any other number is valid — bend the ratio if the crop looks better.

## Anatomy

```
AspectRatio          ratio · className
└── children         img / video / any fill (absolute inset)
```

## Tokens

| Role | Token |
| --- | --- |
| Empty fill (Figma Shade) | `--theme-neutrals-300` |
| Radius | `--radius` (16) |
| Ratio | CSS `aspect-ratio` via `--ratio` |

Children are stretched to fill and `object-cover` for `img` / `video`. Override
radius with `className` (e.g. `rounded-none` inside a clipping Card).

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `ratio` | — (required) | Width ÷ height |
| `className` | — | Width comes from the parent; height follows `ratio` |

## Deferred

- **Image placeholder (OC)** (`3020:771`) — separate Obra placeholder set; not
  this primitive.
- **Carousel with Image** — Figma composition after this lands; see
  [Carousel README](../carousel/README.md) ·
  [docket](../../../.migration/post-primitives-docket.md).

## Related

- [Card](../card/README.md) · [Carousel](../carousel/README.md) ·
  [Skeleton](../skeleton/README.md)
- Docs: [shadcn Aspect Ratio](https://ui.shadcn.com/docs/components/base/aspect-ratio)
- Base UI: CSS `aspect-ratio` (no dedicated component)
