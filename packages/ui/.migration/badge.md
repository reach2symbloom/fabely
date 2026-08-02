# badge

2026-08-02, golden pair via CLI (three-way merge of customized radix-luma user file onto base-luma), migrated — Slot/`asChild` replaced with Base UI `useRender`/`render`; project custom classes retained.

## Changed

- `packages/ui/src/components/ui/badge.tsx` — progressive write to `badge-base.tsx` then finalize rename. Replaced `Slot` from `radix-ui` + `asChild` with `@base-ui/react/merge-props` + `@base-ui/react/use-render` and a `render` prop, matching `https://ui.shadcn.com/r/styles/base-luma/badge.json`. Kept the project's pre-existing class/variant customization (not stock luma classes: `rounded-full`, `[a&]:hover:*`, solid destructive, etc.). Leftover scan clean: `grep -n "radix-ui\|@radix-ui" src/components/ui/badge.tsx` → no matches.
- `packages/ui/src/atoms/badge/badge.tsx` — docs comments updated for `render`; still imports `@/components/ui/badge` (public atom API unchanged aside from inherited prop rename).
- `packages/ui/src/atoms/badge/badge.stories.tsx` — call sites `asChild` → `render={<a ... />}` with label children; gallery copy updated.
- `packages/ui/src/atoms/badge/README.md` — polymorphism docs updated to Base UI `render`.

## Left alone

- `packages/ui/src/components/ui/button.tsx` — already on `@base-ui/react/button` (not part of this run).
- `packages/ui/src/components/ui/accordion.tsx`, `avatar.tsx` — still on Radix; out of scope for progressive badge-only migration.
- `packages/ui/src/components/ui/alert.tsx` — no Radix import; untouched.
- `radix-ui` package dependency — retained until the last Radix wrapper is migrated (skill rule).
- `packages/ui/components.json` — already `base-luma`; not flipped in this run.

## Behavior changes

None flagged for Badge. Polymorphism call-site shape changes (`asChild` child element → `render` prop + children) is an API migration, not a runtime behavior delta of the primitive family.

## Verify by hand

1. Storybook Badge → Link: three link badges navigate / focus with visible focus rings.
2. Storybook Badge → Playground: toggle "as link" and confirm the badge renders as `<a>`, keyboard-focusable, with correct variant/size/roundness.
3. Default / secondary / destructive / outline / ghost / success / alert chips still show soft Fabely fills (atom overrides), not solid vendor primary.
4. Icon start/end (`data-icon`) still sizes and colors with the label.
5. Confirm no console errors when mounting Badge without `render` (plain `<span>`).
