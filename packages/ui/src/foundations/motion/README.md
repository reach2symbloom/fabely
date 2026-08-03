# Motion

Motion has no tokens yet. Figma has no motion collection.

Duration and easing values currently come from `tw-animate-css` defaults (e.g. accordion open/close via `--animate-accordion-*`). This folder holds accordion keyframe overrides that retarget those utilities at Base UI's `--accordion-panel-height` — not a duration/easing scale.

**Rule:** when a second component needs the same duration or easing, promote it to a token here rather than duplicating the literal.

See Storybook under `Foundations → Motion` for what exists today.
