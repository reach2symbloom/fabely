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
| [Controls](./controls/README.md) | Label, Dropdown, Slider, Icon Button Group, Rich Divider (Figma `16301:20374`) |
| [Highlight Color Menu](./highlight-color-menu/README.md) | Floating text-highlight toolbar — actions + color picker (Figma `16319:1082`) |
