# Scroll Area

Augments native scroll functionality for custom, cross-browser styling.

## Purpose

Import from this primitive rather than `src/components/ui/scroll-area`. Public
API matches [shadcn Scroll Area](https://ui.shadcn.com/docs/components/base/scroll-area)
(Base UI [Scroll Area](https://base-ui.com/react/components/scroll-area)).

## Figma source

[Scrollbar](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=164-18669)
(`164:18669`): `Type` × Vertical / Horizontal. Code uses a 2px elegant thumb
(`--stroke-regular`) with `--rounded-sm`. Thumb fill is
`--theme-alpha-white-no-switch-25` (lighter overlay than the surface; Figma’s
solid neutrals-200 equals light `--background`).

## Composition

```text
ScrollArea
└── ScrollBar   (vertical by default; add horizontal as needed)
```

## Token substitutions

| Source | Foundations | Notes |
| --- | --- | --- |
| Thumb fill | `--theme-alpha-white-no-switch-25` | Lighter than surface both themes |
| Thumb radius | `--rounded-sm` (5) | |
| Thumb / track size | `--stroke-regular` (2) | Elegant thin bar |
| Vertical end inset | `--spacing-3xs` (2) | `pe` so thumb clears the edge; track `--spacing-2xs` |
| Corner clearance | `--spacing-xs` (8) | Block/inline padding so thumb clears `--rounded-md` arcs |
| Root clip | `overflow-hidden` | Clips scrollbar to consumer border-radius |
| Edge fade | `scroll-fade-y` | Top + bottom mask on the viewport |
| Focus (viewport) | `--effect-focus-ring-secondary` | |
| Motion | `--duration-fast` | Color / shadow transitions |

## API

| Export | Notes |
| --- | --- |
| `ScrollArea` | Root + viewport + default vertical `ScrollBar` + corner |
| `ScrollBar` | `orientation` `vertical` \| `horizontal` |

## Related

- Docs: [shadcn Scroll Area](https://ui.shadcn.com/docs/components/base/scroll-area)
- Base UI: [Scroll Area API](https://base-ui.com/react/components/scroll-area#api-reference)
