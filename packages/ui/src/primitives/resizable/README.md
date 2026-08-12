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

Size the **parent** of `ResizablePanelGroup`. The underlying `Group` sets
inline `height/width: 100%`, so Tailwind height on the group itself is ignored.

## Token substitutions

| Source | Foundations | Notes |
| --- | --- | --- |
| Divider rail | `--border` · `w-px` / `h-px` | Group `aria-orientation` flips axis |
| Hit target | `--spacing-sm` (12) after-inset | ~Figma 11px track |
| Grip chip | `--border` fill · `--rounded-lg` · `h` `--spacing-xl` (24) · `w` `--spacing-2xs` (4) | `withHandle` — shadcn pill |
| Focus / drag | `--muted-foreground` (not `--foreground`) | Subtle lift; no white flash |

## API

| Export | Notes |
| --- | --- |
| `ResizablePanelGroup` | `Group`; `orientation` `horizontal` \| `vertical` |
| `ResizablePanel` | `Panel`; sizes as percentage strings in v4 |
| `ResizableHandle` | `Separator`; `withHandle` shows grip |

## Related

- Docs: [shadcn Resizable](https://ui.shadcn.com/docs/components/base/resizable)
- Library: [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels/tree/main/packages/react-resizable-panels)
