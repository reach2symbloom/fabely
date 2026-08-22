# Input Group

Add addons, buttons, and helper content around inputs.

## Purpose

Import from this primitive rather than `src/components/ui/input-group`. Public
API matches [shadcn Input Group](https://ui.shadcn.com/docs/components/base/input-group).

The **group shell** owns Figma [Input](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16-1738)
(`16:1738`) chrome (fill, focus, invalid, radius, height, pad) — same
`variant` / `size` / `roundness` axes as Input, including Quiet.
Use `InputGroupInput` / `InputGroupTextarea` so the control stays bare inside
the shell.

## Figma source

No separate Input Group component — Prepend / Append text live on the Input
set. Icon-only Decorations stay on [Input](../input/README.md)
`decorationLeft` / `decorationRight`; this primitive covers prepend/append
**text**, buttons, kbd, and richer addon strips.

Anatomy (inline):

```text
Shell (pad + Decorations gap by size)
├── Addon inline-start   → Figma Prepend / Decorations left
├── InputGroupInput      → value / placeholder
└── Addon inline-end     → Figma Append / Decorations right
```

## Composition

```text
InputGroup
├── InputGroupInput or InputGroupTextarea
├── InputGroupAddon   (align: inline-start | inline-end | block-start | block-end)
├── InputGroupButton
└── InputGroupText
```

Place Addon **after** the control in the DOM; use `align` for visual position.
`block-*` axes are shadcn-only (not in Figma Input).

## Props

| Export | Notes |
| --- | --- |
| `InputGroup` | `variant` / `size` / `roundness` — same axes as Input |
| `InputGroupAddon` | `align` default `inline-start`; inline addons share shell pad (no extra px) |
| `InputGroupButton` | `size`: `xs` \| `sm` \| `icon-xs` \| `icon-sm`; inline addons hug shell with even `--spacing-3xs` (2px) inset + nested radius; block addons keep normal Button size — Button/Input unchanged |
| `InputGroupInput` | Foundations Input + bare chrome; sets `data-slot="input-group-control"` |
| `InputGroupTextarea` | Foundations Textarea host; bare chrome inside the shell |
| `InputGroupText` | Figma Prepend/Append — muted Paragraph; scales with group `size` |

## Token substitutions

| Role | Foundations |
| --- | --- |
| Shell fill | `--theme-alpha-black-switch-333` (Default); Ghost / Quiet rest transparent |
| Quiet hover fill | `--theme-alpha-black-switch-333` |
| Focus | Default / Ghost: `--effect-focus-ring-secondary` + focus border; Quiet: `--border`, no ring, no fill |
| Invalid | `--destructive` / `--effect-focus-ring-error` / `--background`; addon icons → `--destructive` |
| Radius | `--rounded-lg` / `--rounded-full` / Mini `--rounded-md` |
| Heights | Input size ladder (`--spacing-xl` … `4xl`) |
| Shell pad | `--spacing-1-5` / `xs` / `sm` / `md` by size |
| Icon (Decorations) ↔ value gap | `--spacing-2xs` / `1-5` / `xs` / `sm` by size (same as Input shell) — **8px at default** |
| Prepend ↔ value (Figma AL alone) | `--spacing-2xs` — group keeps Decorations gap so icons stay correct |
| Prepend / Append type | Paragraph Mini / Small / Regular Regular by size; `--muted-foreground` |
| Addon icons | `--icon-xs` / `sm` / `md` by group size (Input decorations ladder) |

## Deferred

- Kbd and Spinner hosts are Foundations-matched — spot-check addon demos
  when convenient
- Optional Custom Input (`data-slot="input-group-control"` third-party) story
- Re-check Empty host that embeds Input Group (Command / Combobox now use this primitive)
- Optional: flat `--spacing-2xs` when only Prepend/Append text if product wants
  text addons tighter than icon addons

## Related

- Docket: [post-primitives-docket.md](../../../.migration/post-primitives-docket.md)
- [Input](../input/README.md) — decorations vs group addons
- Docs: [shadcn Input Group](https://ui.shadcn.com/docs/components/base/input-group)
