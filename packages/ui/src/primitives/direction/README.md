# Direction

App-level text-direction context (`ltr` | `rtl`) for Base UI components.

## Purpose

Import `DirectionProvider` and `useDirection` from this primitive rather than
`src/components/ui/direction`. Public API matches
[shadcn Direction](https://ui.shadcn.com/docs/components/base/direction)
(Base UI `DirectionProvider`).

There is **no Figma component** — Direction is infrastructure, not a visual
primitive. Pair it with `dir` on `<html>` (or a subtree) so CSS logical
properties and Base UI positioning stay in sync.

## Usage

```tsx
import { DirectionProvider } from '@fabely/ui/…/direction';

<html dir="rtl">
  <body>
    <DirectionProvider direction="rtl">{/* app */}</DirectionProvider>
  </body>
</html>
```

```tsx
import { useDirection } from '@fabely/ui/…/direction';

const direction = useDirection(); // "ltr" | "rtl"
```

## API

| Export | Notes |
| --- | --- |
| `DirectionProvider` | `direction?: "ltr" \| "rtl"` context |
| `useDirection` | Reads current direction from the nearest provider |

## Related

- Per-component RTL stories still set `dir="rtl"` on local wrappers for demos
- Base UI: https://base-ui.com/react/utils/direction-provider
- shadcn: https://ui.shadcn.com/docs/components/base/direction
