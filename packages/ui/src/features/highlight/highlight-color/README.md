# Highlight Color

Selectable color swatch — one option in a text-highlight color picker.

Figma: [Highlight color atom](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16317-950)
— Default / Hover / Selected states, 16px circle.

`color` is caller-supplied; Selected's glow is built from that same
color via `color-mix`, so it always matches whatever swatch color is
passed rather than one fixed hue.
