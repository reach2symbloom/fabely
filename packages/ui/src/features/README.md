# Features

src/features/ holds product-specific compositions — components
assembled from primitives, atoms, molecules, and organisms that only
make sense in one part of the product, not general-purpose UI. Unlike
src/primitives (vendor-wrapped) or src/atoms/molecules/organisms
(generic and reusable), a feature component is allowed to be
single-purpose. Governed by `.cursor/rules/overlap-check.mdc`: before
building anything here, search the reusable tiers for overlap: reuse
or compose what exists, and only add here what is genuinely specific
to this feature. If a piece built here turns out to be reusable
elsewhere, promote it to atoms/molecules/organisms — don't duplicate
it in a second feature folder.

## Components

| Feature | Notes |
| --- | --- |
| [Chapter Nav](./chapter-nav/README.md) | Manuscript location chrome — button, add-section, list item, header, menu |
