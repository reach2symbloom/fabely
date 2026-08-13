# Data Table

TanStack Table v9 composition helpers on top of [Table](../table/README.md) —
not a vendor re-export. shadcn documents Data Table as a
[guide](https://ui.shadcn.com/docs/components/base/data-table), not a registry
component.

## Purpose

Import from this primitive when you need a reusable payments-style grid shell
(filter, column visibility, pagination) plus shared column-header / view /
pagination pieces. Compose your own `columns` and `data`; do not treat
`DataTable` as a one-size-fits-all datagrid.

## Composition

```text
DataTable
├── toolbar (optional Input filter · DataTableViewOptions)
├── Table (Foundations-matched) · bordered shell · --rounded-md
└── DataTablePagination (optional)
```

Column defs typically use `DataTableColumnHeader`, `Checkbox` (row select),
`Badge` (status), and `DropdownMenu` (row actions).

## API

| Export | Notes |
| --- | --- |
| `dataTableFeatures` / `DataTableFeatures` | TanStack v9 feature bag — pass as first generic on column helpers |
| `DataTable` | Shell: sorting / filter / visibility / selection state + table chrome. Row click toggles selection; interactive controls (checkbox, menus) are excluded. |
| `DataTableColumnHeader` | Sort + hide menu on a header |
| `DataTableViewOptions` | Column visibility dropdown |
| `DataTablePagination` | Page size, selection count, page controls |

## Deferred

- [x] Table row / cell chrome — [Table](../table/README.md) is Foundations-matched;
      optional: drop the temporary bordered shell if product grids want bare Table
- Re-verify filter field once [Input](../input/README.md) lands (Input is matched —
  spot-check when convenient)
- Re-verify page-size control once [Select](../select/README.md) lands

## Related

- [Table](../table/README.md) — markup primitives
- [Checkbox](../checkbox/README.md) — row selection
- [Dropdown Menu](../dropdown-menu/README.md) — actions / view options
- TanStack Table: https://tanstack.com/table
- shadcn: https://ui.shadcn.com/docs/components/base/data-table
