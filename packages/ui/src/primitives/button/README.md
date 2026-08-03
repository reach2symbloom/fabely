# Button

The Fabely Button primitive — phase 1 exposes the full shadcn Button API surface (`variant`, `size`, `buttonVariants`). Most styling remains the vendor's (`src/components/ui/button.tsx`); radius is Foundations-sourced (below).

## Purpose

`Button` and `buttonVariants` are the public API future Fabely components should depend on. Import from this primitive rather than the vendor path.

## Phase 1 status

- **Full shadcn API** — all 6 variants and 8 sizes documented in Storybook.
- **Radius (Foundations)** — Roundrect is 12px for every button size; Round is fully rounded. See Radius below.
- **Otherwise vendor styling** — no further Fabely/Figma remapping yet.
- **Composition patterns** from the shadcn docs: icon-only, with icon (`data-icon`), spinner, shape (Roundrect / Round), disabled, as-link via `buttonVariants` + plain `<a>`, RTL. `shape` is Storybook vocabulary (Avatar-aligned); not a Button prop yet — Round is `className="rounded-full"`.

## Radius

| Shape | Value | Token |
| --- | --- | --- |
| Roundrect (default) | **12px** | `--rounded-lg` → `--tw-raw-radius-12` |
| Round | fully rounded | `rounded-full` / `--rounded-full` |

**Figma specifies 12px for every button size** — this is a flat value, not a size-proportional ratio like Avatar's per-size roundrect radii. The primitive overrides the vendor's `rounded-4xl` (Tailwind `--radius-4xl` / 32px, which read as a pill at default `h-9`).

## API (shadcn docs)

| Prop      | Type                                                                                 | Default     |
| --------- | ------------------------------------------------------------------------------------ | ----------- |
| `variant` | `"default" \| "outline" \| "ghost" \| "destructive" \| "secondary" \| "link"`        | `"default"` |
| `size`    | `"default" \| "xs" \| "sm" \| "lg" \| "icon" \| "icon-xs" \| "icon-sm" \| "icon-lg"` | `"default"` |

## As link

**Do not use `<Button render={<a />} nativeButton={false} />` for links.** Base UI's Button always applies `role="button"`, which overrides the semantic link role on `<a>`. Use `buttonVariants` with a plain `<a>` instead:

```tsx
import { buttonVariants } from '@fabely/ui/primitives/button';

<a className={buttonVariants({ variant: 'outline' })} href="…">
  Link
</a>
```

## Future

Further Figma-sourced Foundations restyle and any Fabely-specific axes (including a real `shape` prop) land in a later phase.
