# Button family

Labeled and icon-only controls that share one variant/interaction model.

```
src/primitives/button/
├── shared.ts          # buttonVariantClasses, QUIET_INTERACTION, types
├── text-button/       # exported as `Button`
├── icon-button/       # exported as `IconButton`
└── link-button/       # exported as `ButtonLink`
```

Import from the family barrel — consumers stay stable:

```tsx
import {
  Button,
  IconButton,
  ButtonLink,
  buttonVariants,
  buttonLinkVariants,
} from '@/primitives/button';
```

## When to use which

| Need | Use |
| --- | --- |
| Label (optional leading/trailing icon) | **`Button`** (Text Button) |
| Icon only (square / circular) | **`IconButton`** — requires `aria-label` |
| Underlined text action (show more, inline CTA) | **`ButtonLink`** (Link Button) |
| Real document navigation (`<a href>`) | `buttonLinkVariants` or `buttonVariants` on `<a>` — not `render={<a />}` |

Do not stretch Text Button into an icon-only size — that is Icon Button’s job.
Link Button does **not** reuse `buttonVariantClasses` (different chrome model).

## Shared variants (Text + Icon)

Text and Icon Button consume **`buttonVariantClasses`** from [`shared.ts`](./shared.ts):

`primary` · `primaryOutline` · `secondary` · `tertiary` · `outline` · `ghost` · `destructive` · `fiaFilled` · `fiaOutline`

Icon Button also exposes **`fade`** / **`fadeGold`** (Figma Fade button) —
quieter rest icon, hover to full opacity (`fadeGold` paints `--primary`).
Not on Text Button.

Hover / pressed / focus / disabled follow the same library-authored model
(quiet `@5` / `@10`, filled opacity ladder, Primary always-on rest ring).
`outline` matches Figma Button Group Variant=Outline (quiet alpha fill + `--border`).

Link Button has its own Style axis: `tertiary` · `secondary` · `primary` · `fia`
(underline on hover/pressed only).

## Size slots

Size prop names are **shared vocabulary**; each sibling owns its values
(see `docs/DESIGN.md` “Size slots”).

| Slot idea | Text Button | Icon Button | Link Button |
| --- | --- | --- | --- |
| Smallest | `mini` → 24 tall | `mini` → 24×24 | `mini` → type hug |
| Small | `small` → 32 | `sm` → 32×32 | — (Figma Small → `default`; see [Link Button](./link-button/README.md)) |
| Default | `default` → 40 | `default` → 36×36 | `default` → type hug |
| Large | `large` → 44 | `lg` → 40×40 | `lg` → type hug |
| Extra large | `extraLarge` → 52 | — | — |

Same name ≠ same pixels. Do not “fix” one scale to the other.

## Roundness

Text and Icon expose `default` | `round`. Text Button Default is flat
`--rounded-lg` (12) at every size. Icon Button Default uses `--rounded-sm`
(5) on `mini` so Default vs Round stays distinguishable at 24px; other
sizes use `--rounded-lg`. Link Button has no roundness axis (text chrome only).

## Docs per sibling

- [Text Button](./text-button/README.md)
- [Icon Button](./icon-button/README.md)
- [Link Button](./link-button/README.md)
