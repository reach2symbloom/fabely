# Atoms

The smallest UI building blocks we design ourselves — compositions built on Foundations and, when useful, Primitives.

Per `docs/DESIGN.md`'s Component Layer workflow: match Figma faithfully first, then identify recurring patterns before introducing semantic component tokens. Atoms should consume semantic tokens from `foundations/` wherever a stable semantic role exists, and foundation tokens directly during exploration.

Vendor-derived wrappers live under [`../primitives/`](../primitives/) — not here. A Primitive may later be composed into an Atom once we design a Fabely composition around it.

## Components

| Atom | Notes |
| --- | --- |
| [Bookmark Button](./bookmark-button/README.md) | Toggle + Lucide Bookmark — fill in/out when pressed |
| [Add Section Button](./add-section-button/README.md) | Icon + label pill; always paired with dividers in product |
| [Cycle Switch](./cycle-switch/README.md) | One-way cycle through options; not a binary Switch |
| [Book Cover](./book-cover/README.md) | Portrait cover + hover/focus edit scrim |
| [Status](./status/README.md) | Colored dot + label state readout |
| [Brand Link](./brand-link/README.md) | Service logo + name lockup |
| [Lateral Toggles](./lateral-toggles/README.md) | Prev/Next chapter nav — shortcut hint, label, truncated title |
