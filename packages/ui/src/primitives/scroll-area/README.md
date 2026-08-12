# Scroll Area

Augments native scroll functionality for custom, cross-browser styling.

## Purpose

Import from this primitive rather than `src/components/ui/scroll-area`. Public
API matches [shadcn Scroll Area](https://ui.shadcn.com/docs/components/base/scroll-area)
(Base UI [Scroll Area](https://base-ui.com/react/components/scroll-area)).

## Figma source

[Scrollbar](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=164-18669)
(`164:18669`): `Type` × Vertical / Horizontal — 4×48 / 48×4 thumb.

## Composition

```text
ScrollArea
└── ScrollBar   (vertical by default; add horizontal as needed)
```

## Token substitutions

| Source | Foundations | Notes |
| --- | --- | --- |
| Thumb fill | `--theme-neutrals-200` | Figma thumb (both axes) |
| Thumb radius | `--rounded-sm` (5) | |
| Thumb / track size | `--stroke-thick` (4) | Matches Figma 4px bar |
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
