# Highlight Action Menu

Vertical pill of the same 4 semantic actions as Highlight Color Menu's
leading icons (Fia, Gather, Comment, Highlight), each with a right-side
tooltip carrying its own sentence of copy.

Figma: [Highlight menu](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16315-1196)
— `hover` axis demonstrates each action one at a time; this component
renders all 4 live.

Composes `@/primitives/button/icon-button`, `@/primitives/tooltip`, and
[icon-semantics](../icon-semantics.tsx) (shared glyph + hover-color
mapping with [Highlight Color Menu](../highlight-color-menu/README.md)).
