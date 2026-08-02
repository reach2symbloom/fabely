# Atoms

The smallest indivisible UI building blocks — Button, Input, Label, Badge, and similar shadcn primitives wrapped with Fabely's design layer on top.

Per `docs/DESIGN.md`'s Component Layer workflow: match Figma faithfully first, then identify recurring patterns before introducing semantic component tokens. Atoms should consume semantic tokens from `foundations/` wherever a stable semantic role exists, and foundation tokens directly during exploration.

Currently implemented: [Avatar](./avatar/README.md), [Accordion](./accordion/README.md), [Badge](./badge/README.md).
