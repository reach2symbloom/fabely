This directory contains semantic shadow tokens that represent component intent rather than visual primitives.

Foundation shadow tokens define reusable shadow geometry and polarity (e.g. size, blur, color). Semantic shadow tokens compose those foundation tokens into reusable meanings that components consume.

Components should consume semantic shadow tokens whenever reusable intent exists, rather than referencing foundation shadow tokens directly.

Examples of future semantic shadow tokens include:

- `dialog.shadow.surface`
- `popover.shadow.surface`
- `dropdown.shadow.surface`
- `tooltip.shadow.surface`
- `menu.shadow.surface`

Do not create these tokens yet. This change is only establishing the architecture.
