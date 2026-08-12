# Primitives

Wrapped shadcn / Base UI components, restyled with Foundations tokens. Flat and alphabetical — no atomic classification.

Primitives are mostly vendor-derived: we style them with Foundations but do not compose them here. A component may start as a Primitive and later be composed into an Atom (or higher) once we design a Fabely composition around it.

**Exception:** [ListItem](./list-item/README.md) is Fabely-authored (Figma Menu Item). It lives under Primitives because other Primitives consume it and must not depend on Atoms — see `docs/DESIGN.md`.

Per `docs/DESIGN.md`: match Figma faithfully first, consume Foundations semantic tokens wherever a stable role exists, and foundation tokens directly during exploration.

Figma-matched: [Accordion](./accordion/README.md), [Alert](./alert/README.md), [Avatar](./avatar/README.md), [Badge](./badge/README.md), [Breadcrumb](./breadcrumb/README.md), [Bubble](./bubble/README.md), [Button](./button/README.md), [Button Group](./button-group/README.md), [Calendar](./calendar/README.md), [Card](./card/README.md), [Carousel](./carousel/README.md), [Chart](./chart/README.md), [Checkbox](./checkbox/README.md), [Collapsible](./collapsible/README.md), [Combobox](./combobox/README.md), [Command](./command/README.md), [Context Menu](./context-menu/README.md), [Dropdown Menu](./dropdown-menu/README.md), [ListItem](./list-item/README.md).

Guide compositions (not vendor re-exports): [Data Table](./data-table/README.md) — TanStack Table v9 on Table; [Date Picker](./date-picker/README.md) — Popover + Calendar.

Thin-pass stubs (unstyled re-exports, not yet matched to Figma): every other file under `src/components/ui` except `direction` (skipped).

**After this pass:** compositions deferred because a partner was missing or
thin-pass live in [`.migration/post-primitives-docket.md`](../../.migration/post-primitives-docket.md).
Revisit that docket when thin-pass stubs are gone.

## Thin-pass Storybook instructions

When adding or documenting a new Primitive:

1. Colocate `*.stories.tsx` next to the wrapper under `src/primitives/<name>/`.
2. Title stories `Design System/Primitives/<Name>` (flat, alphabetical — no atomic subfolder in the sidebar).
3. Overview **must** use [`PrimitivePage`](../../stories/PrimitivePage.tsx) with all six props: `title`, `description`, `playground`, `variants`, `usageGuidance`, `accessibility`.
4. Overview stories set `parameters: { layout: 'fullscreen' }` so `PrimitivePage` owns page inset. Do not add per-story panel max-widths — Playground and Variants span the full page width.
5. Playground controls use `PRIMITIVE_PLAYGROUND_CONTROL_GRID` (2 columns). Prefer `InlineSegmentedControl` over `<select>` unless the option set is too long to fit; use `col-span-2` only for long option sets or text inputs.
6. Do not invent alternate Overview sections or reorder them. Incomplete sections take placeholder copy (`PRIMITIVE_PAGE_SECTION_PLACEHOLDER`), not omissions. The Variants section name matches Figma’s vocabulary.
7. Reference implementation: [Badge Overview](./badge/badge.stories.tsx).
8. Canonical variants remain their own focused story pages; Overview’s `variants` gallery reuses those same implementations.
