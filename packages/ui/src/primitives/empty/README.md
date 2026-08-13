# Empty

Empty-state layout for when a view has no data yet.

## Purpose

Import from this primitive rather than `src/components/ui/empty`. Public API
matches [shadcn Empty](https://ui.shadcn.com/docs/components/base/empty):
Header / Media / Title / Description / Content. Surface chrome follows Figma
Empty variants.

## Figma source

[Fabely Design System → Empty](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry?node-id=842-44451)
— component set **Empty** (`989:27679`): **Variant** Default / Outline /
Background / Outline dashed. Slots: Media, Content, button group; optional
Link Button.

## Composition

```text
Empty
├── EmptyHeader
│   ├── EmptyMedia
│   ├── EmptyTitle
│   └── EmptyDescription
└── EmptyContent
```

## Token substitutions

| Source | Foundations | Notes |
| --- | --- | --- |
| Surface radius | `--rounded-xl` (20) | All variants |
| Pad / stack gap | `--spacing-2xl` / `--spacing-md` | 32 / 16 |
| Title ↔ description gap | `--spacing-2xs` | Header |
| Outline stroke | `--border` | Solid or dashed |
| Background fill | `--muted` | Background variant |
| Title | Paragraph Regular Medium | `--foreground` |
| Description | Paragraph Small Regular | `--muted-foreground` |
| Icon media well | `--icon-3xl` + `--rounded-xl` + `--muted` | Glyph `--icon-lg` |
| Image media | `--rounded-xl` + `--muted` | `max-w-xs` / `aspect-[4/3]`; cover crop |

## API

| Export | Notes |
| --- | --- |
| `Empty` | `variant`: `default` \| `outline` \| `background` \| `outline-dashed` |
| `EmptyHeader` / `EmptyTitle` / `EmptyDescription` | Layout + type |
| `EmptyMedia` | `variant`: `default` \| `icon` \| `image` |
| `EmptyContent` | Actions, inputs, links |

## Deferred

- Re-verify Input Group demo once Input Group is Foundations-matched
- Figma Decorative icon component as a dedicated media preset (stories use
  Lucide in the icon well)

## Related

- Docket: [post-primitives-docket.md](../../../.migration/post-primitives-docket.md)
