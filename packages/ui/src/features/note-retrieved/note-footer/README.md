# Note Footer

Bottom-edge scrim over scrollable note content, with a `prev`/`next`
[Lateral Toggles](../../../atoms/lateral-toggles/README.md) pair docked at
its left/right edges. Fades from transparent to the theme's own surface
color, signalling more content beneath while keeping chapter navigation
reachable. No rounded corners — Figma's own root frame has none.

## Sources

| Source | Role |
| --- | --- |
| Figma [Note Footer](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16091-10278) (`16091:10278`) | Visual — Mode × two Lateral Toggles instances |
| [Lateral Toggles](../../../atoms/lateral-toggles/README.md) atom | Both `prev`/`next` controls, including the live `⌘←`/`⌘→` shortcut |
| [Gradients](../../../foundations/effects/gradients/README.md) foundation | `--effect-gradient-fade-up` — the scrim itself |

## The scrim is a Foundations token, not a one-off gradient

Figma names this exact background style `gradients/fade/fade up`. Rather
than inlining a one-off `bg-gradient-to-b`, it's lifted into
`--effect-gradient-fade-up` in the new
[Gradients](../../../foundations/effects/gradients/README.md) Effects
foundation — Foundations didn't have a gradients concept before this
component needed one, so `fade-down`/`fade-left`/`fade-right` were added
alongside it (the same two-stop fade rotated to the other three edges) so
future top-edge / horizontal-scroll use cases don't repeat the derivation.

## No `mode` prop

Figma authors this as two separate variants, `Mode=Dark` and `Mode=Light` —
but the Dark variant's own generated markup hardcodes white-on-charcoal
`rgba(...)` values instead of referencing a switch token; it's a manual
simulation of dark mode, not something structurally different.
`--effect-gradient-fade-up`'s two stops are both
`--theme-alpha-white-switch-*` (see Gradients), and Lateral Toggles' own
text already uses `--theme-alpha-black-switch-85` — both flip automatically
with the app's light/dark theme. Nothing left for a `mode` prop to control
— rendering this in a `.dark` tree reproduces Figma's `Mode=Dark` for free;
rendering it outside one reproduces `Mode=Light`.

## No outer `opacity-50`

Figma's frame wraps both toggles in an additional `opacity-50`, on top of
each Lateral Toggles' own internal `opacity-60` (rest) → `opacity-100`
(hover). Kept out: Lateral Toggles' whole design is "quiet at rest, full
strength on hover" — a permanent 50%-opacity ancestor would cap hover at
50%, defeating that. Read as Figma's frame-export artifact (the specific
rest-state screenshot this node happened to capture), not a value to
reproduce structurally.

## Missing chapter (first/last)

`prevTitle`/`nextTitle` are optional — omit one to hide that side (e.g. no
`prev` on the first chapter, no `next` on the last). An empty
`<span aria-hidden />` fills the slot instead of nothing, so
`justify-between` still pushes the remaining toggle to its own edge rather
than re-centering it.

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `prevTitle` | — | Omit to hide the `prev` toggle |
| `nextTitle` | — | Omit to hide the `next` toggle |
| `onPrevClick` / `onNextClick` | — | Navigate to the target chapter; also what `⌘←`/`⌘→` call |
| `shortcutEnabled` | `true` | Forwarded to both toggles — see Lateral Toggles' own prop |

## Tokens

| Concern | Foundations |
| --- | --- |
| Padding | `--spacing-md` (16px) |
| Scrim gradient | `--effect-gradient-fade-up` |
