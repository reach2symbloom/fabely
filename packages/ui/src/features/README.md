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
| [Chat Elements](./chat-elements/README.md) | Manuscript chat/assistant chrome — pieces land on sub-branches |
| [Chapter Nav](./chapter-nav/README.md) | Manuscript location chrome — button, add-section, list item, header, menu |
| [Highlight](./highlight/README.md) | Manuscript text-highlight chrome — pieces land on sub-branches |
| [Library](./library/README.md) | Pieces land on sub-branches |
| [Note Retrieved](./note-retrieved/README.md) | Fia search-result rows — pieces land on sub-branches |
| [Promptbar](./promptbar/README.md) | Manuscript prompt/composer chrome — pieces land on sub-branches |
| [Split & Parse](./split-parse/README.md) | Manuscript-editor split/parse row — pieces land on sub-branches |
