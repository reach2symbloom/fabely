# Gradients

Fade gradient tokens — semantic "content fades into the surface" treatments,
in all four edge directions. Two-stop, transparent → the theme's own
surface color (`--theme-alpha-white-switch-*`, white in light theme,
near-black in dark), so they need no light/dark variants of their own.

Figma only defines `fade up` (Note Footer's scrim); `fade-down`/`fade-left`/
`fade-right` are the same two-stop gradient rotated to the other three
edges, added alongside it so all four are available together.

See the Storybook documentation under `Foundations → Effects → Gradients`
for the full token reference.
