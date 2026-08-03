# accordion

2026-08-03, golden pair via CLI (three-way merge of customized radix-era user file onto base-luma; hand-resolved conflicts to keep project classes), migrated — `radix-ui` Accordion swapped for `@base-ui/react/accordion`; Foundations atom restyle retained. Last Radix wrapper in `packages/ui`; `radix-ui` dependency removed.

## Changed

- `packages/ui/src/components/ui/accordion.tsx` — progressive write to `accordion-base.tsx` then finalize rename. Three-way merge (`git merge-file` with radix-luma golden as ancestor) of the user's file onto `https://ui.shadcn.com/r/styles/base-luma/accordion.json`. Kept project customizations vs stock luma (no root `rounded-2xl border`, `border-b last:border-b-0`, single rotating `ChevronDownIcon`, focus-ring utilities, no content `px-4` / link styles). Applied Base UI deltas: import/`*.Props` types, `Content` → `Panel`, `disabled:*` → `aria-disabled:*`, `[&[data-state=open]>svg]` → `[&[data-panel-open]>svg]`, `data-[state=*]:animate-accordion-*` → `data-open`/`data-closed` variants, inner `h-(--accordion-panel-height) data-starting-style:h-0 data-ending-style:h-0`. Leftover scan clean: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder" src/components/ui/accordion.tsx` → no matches.
- `packages/ui/src/atoms/accordion/accordion.tsx` — still imports `@/components/ui/accordion` (public atom API pass-through); header comments updated Radix → Base UI.
- `packages/ui/src/atoms/accordion/accordion.stories.tsx` — consumer pass: drop `type`/`collapsible`/`dir`; `defaultValue` always arrays; `multiple` for multi-open; Overview/a11y copy Base UI (no Arrow-key roving focus).
- `packages/ui/src/atoms/accordion/README.md` — upstream primitive + API described as Base UI (`multiple`, array values).
- `packages/ui/src/styles/globals.css` — comment updated for Base UI data attrs / `--accordion-panel-height`.
- `packages/ui/package.json` + `pnpm-lock.yaml` — removed `radix-ui` (last wrapper migrated; skill rule).

## Left alone

- `packages/ui/src/components/ui/avatar.tsx`, `badge.tsx`, `button.tsx` — already on Base UI.
- `packages/ui/src/components/ui/alert.tsx` — no Radix import; untouched.
- `apps/web/components/ui/*` — separate app-local Radix shadcn copies; not `@fabely/ui` vendor wrappers (intentionally out of scope).
- `packages/ui/components.json` — already `base-luma`; not flipped in this run.
- Unrelated WIP (Storybook playground helpers, avatar radius tokens, etc.) — stashed before migration; not included in this commit.

## Behavior changes

- Single mode is always collapsible (Radix `collapsible={false}` has no direct equivalent; control `value` / `eventDetails.cancel()` if needed).
- Root `dir` / `orientation` dropped (use DOM `dir` / DirectionProvider; orientation is a deprecated no-op).
- Arrow Up/Down / Home/End roving focus on triggers removed in Base UI (APG guidance) — Tab + Enter/Space only. Flagged, not patched.
- `onValueChange` always receives an array (+ event details).
- `tw-animate-css` keyframes still reference `--radix-accordion-content-height`; Base UI exposes `--accordion-panel-height`. Animation preserved via base-luma's inner height + starting/ending-style classes alongside `animate-accordion-*`.

## Verify by hand

1. Storybook Accordion → Basic: first item open; click to collapse (always collapsible); height animates open/close.
2. Multiple: two items start open; open/close independently.
3. Disabled: middle item not focusable/clickable; others work.
4. Borders / Card: dividers edge-to-edge; Card readable in Dark mode (`--foreground`).
5. RTL: chevron/row mirror under wrapper `dir="rtl"`; question text may stay physically left-aligned (known vendor `text-left` limit).
6. Keyboard: Tab between triggers, Enter/Space toggles; Arrow keys do not move focus (Base UI delta).
