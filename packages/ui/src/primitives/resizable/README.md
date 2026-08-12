# Resizable

Accessible resizable panel groups and layouts with keyboard support.

## Purpose

Import from this primitive rather than `src/components/ui/resizable`. Public
API matches [shadcn Resizable](https://ui.shadcn.com/docs/components/base/resizable)
([react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) v4).

## Figma source

[Resizable](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=222-27733)
(`222:27733`): `Orientation` × Vertical / Horizontal — border rail + optional
6-dot grip.

## Composition

```text
ResizablePanelGroup
├── ResizablePanel
├── ResizableHandle   (optional withHandle)
└── ResizablePanel
```

## Token substitutions

| Source | Foundations | Notes |
| --- | --- | --- |
| Divider rail | `--border` · `w-px` / `h-px` | Group `aria-orientation` flips axis |
| Hit target | `--spacing-sm` (12) after-inset | ~Figma 11px track |
| Grip chip | `--muted` fill · `--rounded-sm` · `--shadow-xs-black` · pad `--spacing-3xs` | `withHandle` |
| Grip glyph | Lucide `GripVertical` · `--icon-sm` · `--muted-foreground` | Figma 6-dot |
| Focus | `--effect-focus-ring-secondary` | |

## API

| Export | Notes |
| --- | --- |
| `ResizablePanelGroup` | `Group`; `orientation` `horizontal` \| `vertical` |
| `ResizablePanel` | `Panel`; sizes as percentage strings in v4 |
| `ResizableHandle` | `Separator`; `withHandle` shows grip |

## Related

- Docs: [shadcn Resizable](https://ui.shadcn.com/docs/components/base/resizable)
- Library: [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels/tree/main/packages/react-resizable-panels)
