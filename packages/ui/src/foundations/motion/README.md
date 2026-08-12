# Motion

Duration and easing tokens live in [`tokens.css`](./tokens.css). Figma has no
motion collection — values are promoted when a curve or duration is reused
(seeded from shadcn Base Drawer).

| Token | Value | Tailwind |
| --- | --- | --- |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | `ease-drawer` |
| `--ease-emphasized` | `cubic-bezier(0.22, 1, 0.36, 1)` | `ease-emphasized` |
| `--ease-emphasized-in` | `cubic-bezier(0.45, 1.005, 0, 1.005)` | `ease-emphasized-in` |
| `--duration-fast` | `200ms` | `duration-fast` |
| `--duration-normal` | `300ms` | `duration-normal` |
| `--duration-drawer` | `450ms` | `duration-drawer` |

[`accordion.css`](./accordion.css) only retargets `tw-animate-css` accordion
keyframes at Base UI’s `--accordion-panel-height` — it does not define a
separate duration/easing scale.

**Rule:** do not invent one-off `cubic-bezier(...)` or ms literals in
primitives. Prefer Foundations tokens; add here when a second use appears.

See Storybook → Foundations → Motion.
