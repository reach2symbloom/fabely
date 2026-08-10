# Button family

Labeled and icon-only controls that share one variant/interaction model.

```
src/primitives/button/
├── shared.ts          # buttonVariantClasses, QUIET_INTERACTION, types
├── text-button/       # exported as `Button`
└── icon-button/       # exported as `IconButton`
```

Import from the family barrel — consumers stay stable:

```tsx
import { Button, IconButton, buttonVariants } from '@/primitives/button';
```

## When to use which

| Need | Use |
| --- | --- |
| Label (optional leading/trailing icon) | **`Button`** (Text Button) |
| Icon only (square / circular) | **`IconButton`** — requires `aria-label` |
| Text that navigates like a link | `buttonVariants` on `<a>` for now; Button Link later |

Do not stretch Text Button into an icon-only size — that is Icon Button’s job.

## Shared variants

Both siblings consume **`buttonVariantClasses`** from [`shared.ts`](./shared.ts):

`primary` · `primaryOutline` · `secondary` · `tertiary` · `ghost` · `destructive` · `fiaFilled` · `fiaOutline`

Hover / pressed / focus / disabled follow the same library-authored model
(quiet `@5` / `@10`, filled opacity ladder, Primary always-on rest ring).
Icon Button adds one extra variant: **`outline`**.

## Size slots

Size prop names are **shared vocabulary**; each sibling owns its values
(see `docs/DESIGN.md` “Size slots”).

| Slot idea | Text Button | Icon Button |
| --- | --- | --- |
| Smallest | `mini` → 24 tall | `mini` → 24×24 |
| Small | `small` → 32 | `sm` → 32×32 |
| Default | `default` → 40 | `default` → 36×36 |
| Large | `large` → 44 | `lg` → 40×40 |
| Extra large | `extraLarge` → 52 | — |

Same name ≠ same pixels. Do not “fix” one scale to the other.

## Roundness

Both expose `default` | `round`. Text Button Default is flat
`--rounded-lg` (12) at every size. Icon Button Default uses `--rounded-sm`
(5) on `mini` so Default vs Round stays distinguishable at 24px; other
sizes use `--rounded-lg`.

## Docs per sibling

- [Text Button](./text-button/README.md)
- [Icon Button](./icon-button/README.md)
