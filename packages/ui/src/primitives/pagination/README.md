# Pagination

Page navigation with previous / next links and optional page digits.

## Purpose

Import from this primitive rather than `src/components/ui/pagination`. Public
API matches [shadcn Pagination](https://ui.shadcn.com/docs/components/base/pagination).

## No Figma source — shadcn documentation used instead

**No Figma design exists for Pagination.** Per `docs/DESIGN.md` and the
Accordion / Breadcrumb precedent, this milestone is a faithful Foundations
restyle of the shadcn API: composition, prop names, and canonical examples
come from the docs. Page and labeled controls use the Fabely Button family
(not vendor Button).

## Composition

```text
Pagination
└── PaginationContent
    ├── PaginationItem
    │   └── PaginationPrevious
    ├── PaginationItem
    │   └── PaginationLink
    ├── PaginationItem
    │   └── PaginationEllipsis
    └── PaginationItem
        └── PaginationNext
```

## Token substitutions

| Vendor | Foundations | Notes |
| --- | --- | --- |
| `gap-1` (Content) | `--spacing-2xs` (4px) | Exact |
| Page link `size-9` (Button `icon`) | Text Button `small` type + `size-[--spacing-9]` (36) | Digit needs type; square matches Icon Button default |
| Prev/next `h-9` (Button `default`) | Text Button `default` (`--spacing-3xl` / 40) | Nearest published labeled slot |
| Ellipsis box `size-9` | `--spacing-9` (36px) | Exact |
| Ellipsis / control icons `size-4` | `--icon-sm` (16px) | Exact |
| `outline` / `ghost` active vs idle | Button family variants | Library chrome |
| Chevron RTL flip (`cn-rtl-flip`) | `rtl:rotate-180` | Same pattern as Carousel |

## Left on vendor / layout defaults

| Value | Why |
| --- | --- |
| `mx-auto flex w-full justify-center` on root | Layout, not a Foundations scale |
| `hidden sm:block` on prev/next text | Responsive chrome from docs |
| Lucide chevrons / ellipsis | Project `iconLibrary` |

## API

| Export | Notes |
| --- | --- |
| `Pagination` | `<nav aria-label="pagination">` |
| `PaginationContent` / `Item` | List shell |
| `PaginationLink` | `<a>`; `isActive`; `size` `icon` \| `default` |
| `PaginationPrevious` / `Next` | Labeled; optional `text` for i18n |
| `PaginationEllipsis` | Presentational; sr-only “More pages” |

## Deferred

- Icons-only story uses [NativeSelect](../native-select/README.md) for the
  rows-per-page control. Swap to custom [Select](../select/README.md) once that
  primitive is Foundations-matched (same debt as
  [Data Table](../data-table/README.md) pagination).
- Optional Figma Pagination set → pixel pass if Library authors one.

## Related

- [Button](../button/text-button/README.md) — ghost / outline chrome
- [Data Table](../data-table/README.md) — table-local page controls
- Docs: [shadcn Pagination](https://ui.shadcn.com/docs/components/base/pagination)
