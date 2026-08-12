# Item

Content row with optional media, title, description, and actions.

## Purpose

Import from this primitive rather than `src/components/ui/item`. Public API
matches [shadcn Item](https://ui.shadcn.com/docs/components/base/item).

**Not** [ListItem](../list-item/README.md) (Figma Menu Item) — Item is the
bordered / muted card-style row.

Use [Field](../field/README.md) when the row hosts a form control.

## Figma source

[Item](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=920-4754)
(`920:4754`) — page [Item / Callout](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=885-3081).

Axes:

| Figma | Code |
| --- | --- |
| Variant Default · Outline · Muted | `variant` |
| Size Default · Small | `size`: `default` \| `sm` (+ shadcn `xs`) |
| asChild | `render={<a href=… />}` (Base UI) |
| State Default · Hover | CSS `[a]:hover` → `--secondary` |

## Composition

```text
ItemGroup
└── Item
    ├── ItemHeader
    ├── ItemMedia
    ├── ItemContent
    │   ├── ItemTitle
    │   └── ItemDescription
    ├── ItemActions
    └── ItemFooter
```

## Token substitutions

| Role | Foundations | Notes |
| --- | --- | --- |
| Radius | `--rounded-lg` | 12 |
| Border | `--border` + `--stroke-thin` | Outline only |
| Default fill | transparent | |
| Muted fill (default size) | `--muted` | Dark: neutrals-800 (lighter than bg 900) |
| Muted fill (sm / xs) | `--secondary` | Figma Small Muted; light ≠ default muted |
| Link hover | `--secondary` | asChild Hover |
| Focus | `--effect-focus-ring-secondary` | |
| Pad / gap default | `--spacing-md` | 16 |
| Pad / gap small | pad x `--spacing-md` / y `--spacing-sm`; gap `--spacing-xs` | |
| Title ↔ description | `--spacing-2xs` (default); `0` (sm / xs) | |
| Title / description type | Paragraph Small Medium | description → `--muted-foreground` |
| Decorative icon media | 32 box (`--spacing-2xl`), `--rounded-md`, alpha `@333` / `@10` border, glyph `--icon-md` (Solar Bold Duotone ok for illustrative left slot) | |
| Image media | 40 / 32 / 24 by size | `--rounded-lg` (xs → `--rounded-md`) |
| Motion | `--duration-fast` | |

## API

| Export | Notes |
| --- | --- |
| `Item` | `variant`, `size`, `render` |
| `ItemMedia` | `variant`: `default` \| `icon` \| `image` — default holds `Avatar` or `AvatarGroup` (Figma left-slot stack) |
| `ItemContent` / `ItemTitle` / `ItemDescription` | Text stack |
| `ItemActions` / `ItemHeader` / `ItemFooter` | Right slot is open — text button(s), tertiary plus `IconButton`, chevron, or omit |
| `ItemGroup` / `ItemSeparator` | List + separator (`../separator`) |

`size="xs"` is shadcn-only (not in Figma Item).

## Deferred

- [ ] Revisit Avatar / image compositions after Avatar polish passes if media
  alignment drifts from Figma left-slot examples.
