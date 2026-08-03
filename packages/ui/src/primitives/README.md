# Primitives

Wrapped shadcn / Base UI components, restyled with Foundations tokens. Flat and alphabetical — no atomic classification.

Primitives are vendor-derived: we style them with Foundations but do not compose them here. A component may start as a Primitive and later be composed into an Atom (or higher) once we design a Fabely composition around it.

Per `docs/DESIGN.md`: match Figma faithfully first, consume Foundations semantic tokens wherever a stable role exists, and foundation tokens directly during exploration.

Currently implemented: [Accordion](./accordion/README.md), [Alert](./alert/README.md), [Avatar](./avatar/README.md), [Badge](./badge/README.md).

## Thin-pass Storybook instructions

When adding or documenting a new Primitive:

1. Colocate `*.stories.tsx` next to the wrapper under `src/primitives/<name>/`.
2. Title stories `Design System/Primitives/<Name>` (flat, alphabetical — no atomic subfolder in the sidebar).
3. Overview **must** use [`PrimitivePage`](../../stories/PrimitivePage.tsx) with all six props: `title`, `description`, `playground`, `examples`, `usageGuidance`, `accessibility`.
4. Do not invent alternate Overview sections or reorder them. Incomplete sections take placeholder copy (`PRIMITIVE_PAGE_SECTION_PLACEHOLDER`), not omissions.
5. Reference implementation: [Badge Overview](./badge/badge.stories.tsx).
6. Canonical examples remain their own focused story pages; Overview’s `examples` gallery reuses those same implementations.
