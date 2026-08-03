# Atoms

The smallest UI building blocks we design ourselves — compositions built on Foundations and, when useful, Primitives.

Per `docs/DESIGN.md`'s Component Layer workflow: match Figma faithfully first, then identify recurring patterns before introducing semantic component tokens. Atoms should consume semantic tokens from `foundations/` wherever a stable semantic role exists, and foundation tokens directly during exploration.

Vendor-derived wrappers live under [`../primitives/`](../primitives/) — not here. A Primitive may later be composed into an Atom once we design a Fabely composition around it.

No components exist yet — this directory is scaffolding for future atom-level composition.
