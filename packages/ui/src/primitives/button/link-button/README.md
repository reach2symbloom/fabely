# Link Button

**Figma:** [Link Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=11-2014) (`11:2014`)

Text-styled action with **underline on hover and pressed**. Sibling of Text Button and Icon Button under `primitives/button/` — same family, different chrome model (no fill, border, or padding — height hugs the type line-box).

## API

| Prop | Values | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `tertiary` · `secondary` · `primary` · `fia` | `tertiary` | Figma Style axis |
| `size` | `mini` · `default` · `lg` | `default` | See Figma → API below |
| Base UI `Button` props | — | — | `disabled`, `nativeButton`, `render`, … |

Leading / trailing icons are composition (pass Lucide / Solar as children), not props — same pattern as Text Button.

### Exports

| Export | Use |
| --- | --- |
| `ButtonLink` | Interactive control with link chrome (Base UI `Button`) |
| `buttonLinkVariants` | Class string for a real `<a href>` (or other host) when you need navigation semantics |

## Figma → API (size)

| Figma Size | Type | API `size` |
| --- | --- | --- |
| Mini | Paragraph Mini Medium (12/16) | `mini` |
| **Small** | Paragraph Small Medium (14/20) + **2px** vertical pad | **`default`** |
| Default | Paragraph Small Medium (14/20), no pad | `default` |
| Large | Paragraph Regular Regular (16/24) | `lg` |

**Library deviation:** height always hugs the line-box — no top/bottom padding. Figma’s Small and Default share the same type; Small only added 2px pad. With hug height they are identical, so the API drops `sm`.

### Nested instances (higher-order Figma components)

When a parent component (Bubble, empty state, nav, …) nests a Link Button and the Figma instance is **Size=Small**, map it to **`size="default"`** (or omit `size` — same default). Do **not** invent a `sm` prop or reintroduce vertical padding to “match” Small.

```tsx
// Figma: Link Button Size=Small inside a higher-order component
<ButtonLink size="default">Show more</ButtonLink>
// or
<ButtonLink>Show more</ButtonLink>
```

## Tokens

| Concern | Token |
| --- | --- |
| Gap (label ↔ icon) | `--spacing-xs` |
| Icon size | `--icon-sm` |
| Tertiary | `--foreground` |
| Secondary | `--tw-raw-secondary-200` |
| Primary | `--neutrals-new-600` |
| Fia | `--tw-raw-fia-200` |
| Focus | `--effect-focus-ring-secondary` |
| Type Mini | Paragraph Mini Medium (`--text-paragraph-mini-medium-*`) |
| Type Default (← Figma Small + Default) | Paragraph Small Medium (`--text-paragraph-small-medium-*`) |
| Type Large | Paragraph Regular Regular (`--text-paragraph-regular-regular-*`) |

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
