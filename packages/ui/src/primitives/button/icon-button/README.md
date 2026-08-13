# Icon Button

Icon-only control unified with Button — same interaction model and shared
variant styles, with Icon Button’s own size values.

## Purpose

Use `IconButton` for square/circular icon-only actions. Prefer this over
forcing Text Button into an icon-only layout. Import from
`@/primitives/button/icon-button` (also re-exported from `@/primitives/button`).

`aria-label` is **required**. Sibling: [Text Button](../text-button/). Family:
[Button](../README.md).

## Figma source

Visual reference: Figma component set **Icon Button** in
[Fabely Design System](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-44443)
(`fileKey` `gV94L0qCmvwQkddNbEktry`, page `Icon Button`, set `9:775`).

`outline` chrome also follows Figma [Button Group](../button-group/README.md)
Variant=Outline (shared family recipe).

### Library is master

Figma’s published Icon Button set is a **5-variant subset** (Primary, Tertiary,
Outline, Ghost, Destructive) with Figma-specific hover/destructive recipes. The
library supersedes that:

- **Variants:** full shared axis including `outline` (Button Group Figma recipe)
- **Interaction:** Button’s quiet `@5` / `@10`, Tertiary alpha-fill-only,
  Destructive soft error recipe, Primary always-on rest ring
- **Sizes / radius / icons:** values below (not a 1:1 Figma dump)

## API mapping

| Axis | Values | Primitive API |
| --- | --- | --- |
| Variant | Shared nine | `variant`: `primary` \| `primaryOutline` \| `secondary` \| `tertiary` \| `outline` \| `ghost` \| `destructive` \| `fiaFilled` \| `fiaOutline` |
| Size | Mini · Small · Default · Large | `size`: `mini` \| `sm` \| `default` \| `lg` |
| Roundness | Default · Round | `roundness`: `default` \| `round` |
| Label | — | `aria-label` (required) |
| Icon | instance swap | `children` (typically one Lucide SVG) |

Size slot names are shared vocabulary with Button; **values are Icon
Button’s own** (see `docs/DESIGN.md` “Size slots”).

### Size tokens

| `size` | Box | Padding | Icon | Default radius |
| --- | --- | --- | --- | --- |
| `mini` | `--spacing-xl` (24) | `--spacing-2xs` (4) | `--icon-xs` (12) | `--rounded-sm` (5) |
| `sm` | `--spacing-2xl` (32) | `--spacing-xs` (8) | `--icon-sm` (16) | `--rounded-lg` (12) |
| `default` | `--spacing-9` (36) | `--spacing-xs` (8) | `--icon-sm` (16) | `--rounded-lg` (12) |
| `lg` | `--spacing-3xl` (40) | `--spacing-xs` (8) | `--icon-md` (20) | `--rounded-lg` (12) |

**Round** roundness is `--rounded-full` at every size. Mini Default uses
`--rounded-sm` so Default vs Round stays distinguishable at 24px (flat 12px
would read nearly circular).

### Variant `outline` (shared)

| State | Fill | Border | Icon / label |
| --- | --- | --- | --- |
| Default | `--theme-alpha-black-switch-333` | `--stroke-thin` + `--border` | `--muted-foreground` |
| Hover / pressed | quiet `@5` / `@10` | unchanged | `--foreground` |
| Focus | — | — | `--foreground` + secondary ring |
| Disabled | layer opacity 0.5 | — | — |

All variants use `buttonVariantClasses` from
[`../shared.ts`](../shared.ts).

### Foundations

| Token | Role |
| --- | --- |
| `--spacing-9` | Icon Button default box (36px) — promoted this milestone |
| `--icon-xs` / `--icon-sm` / `--icon-md` | Per-size icon ladder |
| `--rounded-sm` / `--rounded-lg` / `--rounded-full` | Roundness |

## Decisions / deviations from Figma

1. Full shared variant set including `outline`; Icon Button’s five-variant subset superseded.
2. Quiet hover/pressed → Button `@5` / `@10` (not Figma cell `@333` as hover).
3. Tertiary → alpha fill only (no layer opacity on hover).
4. Destructive → Button soft error (`error-ghost` @ 12% + `error-600`), not Figma’s white@85 composite.
5. Primary focus → always-on rest ring, matching Button.
6. Icon ladder per size (not Figma’s flat 16 / `md`).
7. Radius Option B: Mini Default `--rounded-sm`; other Default sizes `--rounded-lg`.
8. `outline` fill is Button Group Figma (`alpha-333`), not opaque `--background`.
