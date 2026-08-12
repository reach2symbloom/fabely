# Tooltip

Short label shown on hover or focus.

## Purpose

Import from this primitive rather than `src/components/ui/tooltip`. Public API
matches [shadcn Tooltip](https://ui.shadcn.com/docs/components/base/tooltip)
(Base UI [Tooltip](https://base-ui.com/react/components/tooltip)).

Wrap the application once with `TooltipProvider` (Storybook stories under this
primitive decorate with a provider; other stories that compose Tooltip should
wrap locally or share a root provider).

## Figma source

[Tooltip](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=133-14788)
(`133:14788`) — page
[Tooltip](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-44449).

| Figma | Code |
| --- | --- |
| Side Top / Bottom / Left / Right | `side` on `TooltipContent` |
| Tooltip text | children |

## Composition

```text
TooltipProvider          (app root)
└── Tooltip
    ├── TooltipTrigger   (render for custom hosts)
    └── TooltipContent   (side / align / sideOffset / alignOffset)
```

## Token substitutions (Figma variable → Foundations)

| Figma binding | Foundations |
| --- | --- |
| Neutrals (New)/150 | `--neutrals-new-150` |
| shadcn colors/general/foreground (black) | `--foreground` |
| shadcn colors/general/border | `--border` |
| stroke 1 | `--stroke-thin` |
| rounded-md | `--rounded-md` |
| xs (pad x / gap) | `--spacing-xs` |
| odd/1,5 (pad y) | `--spacing-1-5` |
| paragraph mini/* | `--text-paragraph-mini-regular-*` |
| Arrow fill | `--neutrals-new-150` (matches surface) |
| Open / close motion | `--duration-fast` / `--ease-emphasized` |

Fill is **not** the inverted shadcn vendor recipe (`bg-foreground` /
`text-background`). Light mode is cream (`--tw-raw-neutral-150`); dark mode
flips via Neutrals (New) to `--tw-raw-neutral-850`.

## API

| Export | Notes |
| --- | --- |
| `TooltipProvider` | Required once at app root; `delay` defaults `0` |
| `Tooltip` | Root |
| `TooltipTrigger` | `render` for custom triggers |
| `TooltipContent` | Portal + Positioner + Popup + Arrow; `side` defaults `top`; `align` defaults `center` |

## Deferred

- Re-check **Kbd** pairing in light/dark (Default vs Glow) now that Tooltip is
  cream / charcoal rather than inverted foreground — see
  [post-primitives-docket](../../../.migration/post-primitives-docket.md)
  (**Kbd × Tooltip Glow**).
- Hover Card floating-panel recipe may converge with Popover once Popover lands;
  Tooltip stays the compact Neutrals/150 surface (not popover fill).

## Related

- Docket: [post-primitives-docket.md](../../../.migration/post-primitives-docket.md)
- Docs: [shadcn Tooltip](https://ui.shadcn.com/docs/components/base/tooltip)
- Partner: [Kbd](../kbd/README.md)
