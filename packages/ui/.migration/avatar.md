# avatar

2026-08-02, golden pair via CLI (three-way merge of customized radix-luma user file onto base-luma), migrated — `radix-ui` Avatar swapped for `@base-ui/react/avatar`; project custom classes retained.

## Changed

- `packages/ui/src/components/ui/avatar.tsx` — progressive write to `avatar-base.tsx` then finalize rename. Three-way merge (`git merge-file` with radix-luma golden as ancestor) of the user's customized file onto `https://ui.shadcn.com/r/styles/base-luma/avatar.json`. Import/`AvatarPrimitive.*.Props` types now match Base UI; kept project customizations vs stock luma (`overflow-hidden` instead of the after-border ring treatment, Image without `rounded-full object-cover`, Badge without `bg-blend-color`, export order). Leftover scan clean: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder" src/components/ui/avatar.tsx` → no matches.
- `packages/ui/src/primitives/avatar/avatar.tsx` — still imports `@/components/ui/avatar` (public atom API unchanged; no `delayMs`/`asChild` call sites).
- `packages/ui/src/primitives/avatar/avatar.stories.tsx` — docs copy Radix → Base UI (fallback behavior / Overview a11y notes).
- `packages/ui/src/primitives/avatar/README.md` — upstream primitive described as Base UI instead of Radix UI.

## Left alone

- `packages/ui/src/components/ui/accordion.tsx` — still on Radix; out of scope for progressive avatar-only migration.
- `packages/ui/src/components/ui/badge.tsx`, `button.tsx` — already on Base UI (not part of this run).
- `packages/ui/src/components/ui/alert.tsx` — no Radix import; untouched.
- `apps/web/components/ui/avatar.tsx` — separate app-local shadcn copy; not the `@fabely/ui` vendor wrapper.
- `radix-ui` package dependency — retained until the last Radix wrapper is migrated (skill rule).
- `packages/ui/components.json` — already `base-luma`; not flipped in this run.

## Behavior changes

None flagged for Avatar. Anatomy is the same (`Root` / `Image` / `Fallback`). Consumer prop rename `delayMs` → `delay` (Avatar.Fallback) has no call sites in this package. `asChild` → `render` likewise unused on Avatar parts here.

## Verify by hand

1. Storybook Avatar → With Image: image loads; initials not visible.
2. Storybook Avatar → Fallback: broken `src` shows initials (CN), no broken-image icon.
3. Storybook Avatar → Sizes / Shapes: Extra Tiny → Extra Large and Round / Roundrect still use Foundation tokens (not vendor sm/default/lg).
4. Status Badge / Icon Badge: dots and icon buttons sit unclipped at the bottom-right across sizes.
5. Group / Group With Count: overlap, hover-scale, and `+3` / icon count still render; no console errors.
6. Gradient (Round only): primary gradient border + glow; Roundrect + `gradient` remains a no-op.
