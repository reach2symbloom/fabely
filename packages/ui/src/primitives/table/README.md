# Table

Owned responsive table from Figma [Table](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-49176)
(Header [`164:18430`](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=164-18430),
Cell [`288:172242`](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=288-172242),
organism [`5846:25478`](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=5846-25478))
with the [shadcn Table](https://ui.shadcn.com/docs/components/base/table) API.

Vendor `src/components/ui/table.tsx` stays untouched.

## Anatomy

```
Table
├── TableCaption?
├── TableHeader
│   └── TableRow → TableHead…
├── TableBody
│   └── TableRow → TableCell…
└── TableFooter?
    └── TableRow → TableCell…
```

Sorting, filtering, and pagination compose via [Data Table](../data-table/README.md).

## Props

| Export | Notes |
| --- | --- |
| `Table` | Scroll container + `<table>`; no variant props |
| `TableHeader` / `TableBody` / `TableFooter` | Section hosts |
| `TableRow` | Body zebra (Even parity) + hover; selected via `data-state` |
| `TableHead` / `TableCell` | Pad / type; align with `text-end` when needed |
| `TableCaption` | Muted caption below the table |
| native | Standard table element props |

## Tokens

| Role | Token |
| --- | --- |
| Header type | Paragraph Small Medium · `--foreground` |
| Header rule | `--stroke-regular` · `--border` (thickness, not brightness) |
| Cell type | Paragraph Small Regular · `--neutrals-new-800` |
| Cell / body rule | `--stroke-thin` · `--border` |
| Even row (Parity) | `--theme-alpha-black-switch-333` |
| Row hover / expanded | `--theme-alpha-black-switch-5` |
| Selected row | `--muted` |
| Footer fill | `--muted` |
| Caption | `--muted-foreground` |
| Pad / row height | `--spacing-xs` / `--spacing-3xl` |

## Deferred

- **Data Table re-skin** — drop the temporary bordered shell once this chrome
  settles in product grids. See [Data Table README → Deferred](../data-table/README.md#deferred).
- **Figma Data Table page** (`842:49179`) — richer organism demos stay on the
  Data Table primitive.

## Related

- [Data Table](../data-table/README.md) · [Checkbox](../checkbox/README.md) ·
  [Dropdown Menu](../dropdown-menu/README.md)
- Docs: [shadcn Table](https://ui.shadcn.com/docs/components/base/table)
