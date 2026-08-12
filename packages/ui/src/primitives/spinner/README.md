# Spinner

Owned loading indicator from Figma [Spinner](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=757-154511)
(`757:154511`) with the [shadcn Spinner](https://ui.shadcn.com/docs/components/base/spinner) API.

Vendor `src/components/ui/spinner.tsx` stays untouched.

## Anatomy

```
Spinner  →  Lucide Loader2 (system UI)
```

Compose into Button, Badge, Input Group, Empty, Item, etc.

## Props

| Prop | Values | Notes |
| --- | --- | --- |
| `mirrored` | `boolean` (default `false`) | Figma Type=Mirrored — reverse spin |
| native | `className`, SVG attrs | Override size with `--icon-*` |

## Tokens

| Role | Token |
| --- | --- |
| Default size | `--icon-sm` (16 — Figma frame) |
| Color | `--foreground` (currentColor via `text-*`) |
| Glyph | Lucide `Loader2` |

## Deferred

- **Spinner large / Loader Atoms** — Figma page-load frame sequences
  (`5846:22940`, `5846:22713`) are a separate motion composition, not this leaf.
  Tracked under [post-primitives-docket → Figma custom components vs shadcn](../../../.migration/post-primitives-docket.md).
- **Input Group / Marker demos** — spot-check hosts that embed Spinner (docket).

## Related

- [Button](../button/README.md) · [Badge](../badge/README.md) ·
  [Input Group](../input-group/README.md) · [Empty](../empty/README.md) ·
  [Item](../item/README.md) · [Toast](../toast/README.md)
- Docs: [shadcn Spinner](https://ui.shadcn.com/docs/components/base/spinner)
