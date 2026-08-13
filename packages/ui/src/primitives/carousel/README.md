# Carousel

Embla-powered slide track with Previous / Next chrome.

## Purpose

Import from this primitive rather than `src/components/ui/carousel`. Public API
matches [shadcn Carousel](https://ui.shadcn.com/docs/components/base/carousel)
(`opts`, `plugins`, `orientation`, `setApi`, composition parts) with Foundations
spacing and Fabely Icon Button nav.

## Figma source

[Fabely Design System → Carousel](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry?node-id=164-18293)
— Slides 1 / 2 / 3; gap `md` (16); nav = Icon Button Outline · Round · Default.

## Composition

```text
Carousel                 orientation · opts · plugins · setApi · --carousel-spacing
├── CarouselContent
│   ├── CarouselItem     basis-* for size
│   └── CarouselItem
├── CarouselPrevious     Icon Button Outline Round
└── CarouselNext
```

## Token substitutions

| Source | Foundations / Fabely | Notes |
| --- | --- | --- |
| Gap `pl-4` / `-ml-4` | `--carousel-spacing` → `--spacing-md` (16) | Logical `ps` / `ms` for RTL |
| Vendor `Button` outline icon-sm | `IconButton` `outline` · `round` · `default` (36) | Figma nav |
| Nav offset `-left-12` | `calc(var(--spacing-9) + var(--carousel-spacing))` | Button size + gap |
| Embla `duration` 25 | `18` (Fabely default) | Snappier settle; override with `opts.duration` |
| Demo cards | Fabely [Card](../card/README.md) | Stories only |

### Left on Embla / vendor behavior

- `useEmblaCarousel` options + plugins surface
- Keyboard ArrowLeft / ArrowRight → previous / next
- Region / slide ARIA roles

## API

| Export | Notes |
| --- | --- |
| `Carousel` | Root; `--carousel-spacing` hook |
| `CarouselContent` / `CarouselItem` | Track + slides |
| `CarouselPrevious` / `CarouselNext` | Icon Button props (+ default `aria-label`) |
| `useCarousel` / `CarouselApi` | Embla instance helpers |

## Deferred

- **Autoplay / plugins** — add `embla-carousel-autoplay` (or other Embla
  plugins) and a Plugin story once we take that dependency. See
  [post-primitives docket](../../.migration/post-primitives-docket.md).
- **Carousel with Image** Figma set — compose now that Aspect Ratio is
  matched; still waiting on Autoplay / plugins. See
  [post-primitives docket](../../../.migration/post-primitives-docket.md).

## Related

- [Icon Button](../button/icon-button/README.md) — Previous / Next
- [Card](../card/README.md) — common slide surface in demos
- Embla: https://www.embla-carousel.com/
- shadcn: https://ui.shadcn.com/docs/components/base/carousel
