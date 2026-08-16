# Molecules

Simple groups of atoms/primitives functioning together as a unit — a labeled
input, a search field, an avatar with a name.

Per `docs/DESIGN.md`: Foundations → Primitives → Atoms → Molecules → Organisms →
Templates. Molecules compose rather than duplicating implementation, and should
consume semantic tokens once a reusable role emerges.

## Components

| Molecule | Notes |
| --- | --- |
| [Avatar with Label](./avatar-with-label/README.md) | Avatar + name; optional second-line action (Figma `12044:25610`) |
| [Controls](./controls/README.md) | Shell folder — pieces land on `mc-controls-*` sub-branches |
