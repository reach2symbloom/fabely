# Link Button

**Figma:** [Link Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=11-2014) (`11:2014`)

Text-styled action with **underline on hover and pressed**. Sibling of Text Button and Icon Button under `primitives/button/` — same family, different chrome model (no fill, border, or horizontal padding).

## API

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `tertiary` · `secondary` · `primary` · `fia` | `tertiary` | Figma Style axis |
| `size` | `mini` · `sm` · `default` · `lg` | `default` | Figma Size axis |
| Base UI `Button` props | — | — | `disabled`, `nativeButton`, `render`, … |

Leading / trailing icons are composition (pass Lucide / Solar as children), not props — same pattern as Text Button.

### Exports

| Export | Use |
| --- | --- |
| `ButtonLink` | Interactive control with link chrome (Base UI `Button`) |
| `buttonLinkVariants` | Class string for a real `<a href>` (or other host) when you need navigation semantics |

## Tokens

| Concern | Token |
| --- | --- |
| Gap (label ↔ icon) | `--spacing-xs` |
| Small vertical pad | `--spacing-3xs` |
| Icon size | `--icon-sm` |
| Tertiary | `--foreground` |
| Secondary | `--tw-raw-secondary-200` |
| Primary | `--neutrals-new-600` |
| Fia | `--tw-raw-fia-200` |
| Focus | `--effect-focus-ring-secondary` |
| Type Mini | `--text-body-xs` + `--font-weight-medium` |
| Type Small / Default | `--text-body-sm` + `--font-weight-medium` |
| Type Large | `--text-body-base` + `--font-weight-regular` |

Hover / pressed do **not** change color — only `underline` (Figma State = Hover & Active).

## When to use which

| Need | Use |
| --- | --- |
| Filled / outlined / ghost chrome | Text Button |
| Icon-only control | Icon Button |
| Underlined text action (show more, inline CTA) | **Link Button** |
| Real document navigation (`<a href>`) | `buttonLinkVariants` on `<a>`, or app router `Link` + those classes — **not** `ButtonLink render={<a />}` (Base UI forces `role="button"`) |

## Related

- [Text Button](../text-button/README.md)
- [Icon Button](../icon-button/README.md)
- Family overview: [Button README](../README.md)
