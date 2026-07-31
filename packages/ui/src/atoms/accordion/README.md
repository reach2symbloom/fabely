# Accordion

The Fabely Accordion atom — wraps the upstream shadcn Accordion primitive (`src/components/ui/accordion.tsx`, built on Radix UI's Accordion, via the shared `radix-ui` package Avatar already depends on) with Fabely's Foundations-sourced styling.

## Purpose

`Accordion` / `AccordionItem` / `AccordionTrigger` / `AccordionContent` establish the public API future Fabely components should depend on. Importing from this atom rather than the vendor path directly means any future Fabely-specific behavior can be layered in here without call sites needing to change their import — same purpose Avatar's own README documents.

## No Figma source — shadcn documentation used instead

**No Figma design exists yet for Accordion.** Unlike Avatar (built from an authored Figma selection, with Fabely-specific size/shape/gradient/badge variants derived from it), there was no Figma component to reverse-engineer a variant surface from here. Per `docs/DESIGN.md`'s Component Layer workflow ("match Figma faithfully first, identify recurring patterns before introducing semantic component tokens/abstractions"), the equivalent faithful source for this milestone is shadcn's own Accordion documentation (component composition, prop names, and canonical examples) rather than a Figma frame.

**This is a deliberate scope limit, by explicit instruction, not an oversight:** this atom introduces **no new props, variants, or sub-components** beyond the vendored primitive's own API. It is a thin, faithful *restyle* — the vendor's default Tailwind classes are swapped for the equivalent Foundations token wherever one already exists (spacing, radius, typography, color, focus ring), and the component set is otherwise re-exported as-is. If/when a Figma Accordion design is authored later, that's the point at which Fabely-specific variants (matching Avatar's own precedent) should be considered — not before.

## Wraps upstream

This atom does not modify the upstream primitive's file — `src/components/ui/accordion.tsx` stays vendor code, installed unmodified via `npx shadcn@latest add accordion` (the "new-york" style, Radix-based variant; the shadcn docs page for this component references a Base UI variant, but the actual CLI output for this project's `components.json` config uses Radix via the `radix-ui` package, so the *vendored file* — not the docs' code sample — is the API ground truth this atom wraps). `AccordionItem`, `AccordionTrigger`, and `AccordionContent` override the vendor's default classes via `className`; `Accordion` itself carries no default classes in the vendor file to begin with, so it's re-exported completely unchanged — mirroring how `avatar.tsx` re-exports `AvatarImage` as-is for the same reason (nothing to restyle).

**API surface is unchanged from the vendor primitive** — no new props were added to any of the four components:

- `Accordion` — `type: "single" | "multiple"` (required), `value`/`defaultValue` (string for `type="single"`, string array for `type="multiple"`), `onValueChange`, `collapsible` (boolean, `type="single"` only — whether the open item can be collapsed back to none), `disabled`, `orientation`, `dir` (`"ltr" | "rtl"`).
- `AccordionItem` — `value` (required, unique per item), `disabled`.
- `AccordionTrigger` — standard button props; renders inside an `AccordionHeader`/`h3` internally (vendor structure, unchanged).
- `AccordionContent` — standard div props; the vendor's own internal structure (an outer Radix `Content` element wrapping an inner padded `div`) is unchanged — see `accordion.tsx`'s own comment on `AccordionContent` for why this atom's `className` still visibly and correctly restyles the rendered text despite landing on that inner div rather than the outer element.

## Implemented (this milestone)

Every value below substitutes a Foundations token for a Tailwind default that was already numerically identical (or, for the Trigger's radius, the closest available published value) — none of these are visual changes from the vendor's own rendered output, only a change in *what the value is named and sourced from*:

- **Item divider** (`AccordionItem`) — the vendor's own `border-b` already inherits `--border` at a 1px width through `globals.css`'s global `* { @apply border-border }` base rule. Restated explicitly here: width from `--stroke-thin` (`foundations/stroke.css`), color from `--border` (`foundations/colors.css`) — so this file's styling is traceable to Foundations on its own, without depending on a global rule defined elsewhere for correctness.
- **Trigger spacing** — `gap-4`/`py-4` (Tailwind's literal 16px) → `--spacing-md` (`foundations/spacing.css`).
- **Trigger typography** — `text-sm font-medium` (14px / 20px line-height / weight 500) → Paragraph Small Medium (`foundations/typography.css`) — an exact numeric match.
- **Trigger radius** — `rounded-md` → Foundations' own `--rounded-sm` (5px, `foundations/radius.css`), **not** this project's *derived* `--radius-md` (`calc(var(--radius) - 2px)` = 14px, registered in `globals.css`'s `@theme inline` block) that the plain `rounded-md` utility actually resolves to. That derived scale is computed from a Foundations token but isn't itself one — reusing it here would repeat the same scale-mismatch `avatar.tsx`'s `roundrectRadiusClasses` comment already flagged and avoided. `--rounded-sm` is the closest analog to the vendor's "just barely rounded" intent for this mostly-rectangular full-width row.
- **Trigger focus ring** — the vendor's ad hoc `focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50` (the `border-ring` half of which is inert — `AccordionTrigger` has no border of its own for it to recolor) → `--effect-focus-ring-secondary` (`foundations/effects/focus-rings/focus-rings.css`), the same box-shadow-ring pattern already established for interactive atoms (see `avatar.tsx`'s `AvatarIconBadge`). **Secondary**, not Primary, is the correct one of the two to reuse here: the vendor's own default ring color is plain `--ring` (not `--ring-primary`), and `--effect-focus-ring-secondary` is defined as exactly that color at the Foundations-standard 3px width.
- **Content typography** — `text-sm` (no explicit weight, i.e. browser default 400) → Paragraph Small Regular (`foundations/typography.css`).
- **Content bottom spacing** — `pb-4` → `--spacing-md`. `pt-0` is left as a literal `0` — there's no Foundations token to source zero from.
- **Chevron rotation, hover underline, disabled opacity, open/close height animation** — left exactly as the vendor defines them. None of these are design-token-driven values (a rotation transform, a text-decoration toggle, an opacity multiplier, and a keyframe animation aren't things Foundations publishes tokens for), so there was nothing to substitute — see "Fixed during review" below for a package-level gap that initially kept the animation from actually running.

## Fixed during review

Three fidelity bugs were found and fixed after the initial build, each root-caused against upstream rather than patched locally:

- **Missing expand/collapse animation.** The vendor's `data-[state=open]:animate-accordion-down`/`data-[state=closed]:animate-accordion-up` classes (unmodified, present since the initial CLI install) depend on `animate-accordion-down`/`animate-accordion-up` Tailwind utilities and their backing `@keyframes`, which are registered by the `tw-animate-css` package — `apps/web` already imports it in its own `globals.css`, but `packages/ui` never had it as a dependency or import, so those utilities generated no CSS at all and the accordion snapped open/closed instantly. Fixed by adding `tw-animate-css` to `packages/ui/package.json` and `@import 'tw-animate-css';` to `packages/ui/src/styles/globals.css` (immediately after `@import 'tailwindcss';`, mirroring `apps/web`). No change to `accordion.tsx` was needed — the vendor classes were already correct.
- **Bordered example's divider wasn't full width.** The "Borders" Storybook example (`accordion.stories.tsx`) had added horizontal padding directly on the `Accordion` container for visual breathing room; padding a shared container narrows every item's own content box, including the width its `border-b` draws against, so the divider rendered inset from the outer `border`'s edges instead of flush with it. Fixed by moving that same padding one level down, onto `AccordionItem` itself (alongside its `border-b`) — padding is inside an element's own border (border-box sizing), so it insets the item's *content* without narrowing the item's own border-box, keeping the divider edge-to-edge exactly like upstream's literal `border` + `border-b last:border-b-0` recipe.
- **Card example's text was unreadable in Dark mode.** See "Known issues" below — root-caused to a pre-existing bug in Foundations' own `--card-foreground` token, not to this atom or story.

## Known issues

- **`foundations/colors.css`'s `--card-foreground` is miswired for Dark mode** (a pre-existing Foundations bug, not introduced by this atom): in Dark mode it resolves through `--theme-alpha-white-switch-100` — a token whose entire purpose is to *flip* its base color between White (Light mode) and Black (Dark mode) — down to 100% opaque black, rendered against `--card`'s own Dark value (`--theme-neutrals-900`, a dark charcoal). Black-on-charcoal is effectively unreadable. This is the same category of bug this file's own header comment already flags for `--sidebar-primary-foreground` (a broken Figma alias); it just hadn't been caught for `--card-foreground` yet, since nothing in this package consumed `--card`/`--card-foreground` before the Card Storybook example below. **Not fixed here** — `colors.css` is a shared Foundations file consumed far beyond this one atom, so changing its token value is out of this atom's scope; this atom's own Card example works around it by using `--foreground` instead (see `accordion.stories.tsx`'s `CardExample` comment), which is correctly theme-aware in both modes. Recommend fixing `--card-foreground`'s Dark-mode alias in `foundations/colors.css` directly (e.g. to `var(--tw-raw-white)`, matching how `--foreground`'s own Dark value is already defined) as a follow-up.

## Future enhancements

Not yet implemented — deliberately deferred until either a Figma Accordion design is authored, or a second real usage in the product surfaces a recurring pattern (per `docs/DESIGN.md`'s "begin with faithful implementation" principle):

- Any Fabely-specific variant surface (size, density, item icons, custom chevron treatment, card-wrapped presentation as a first-class variant rather than ad hoc composition, etc.) — none exist yet, matching this milestone's explicit "no new props/variants/abstractions" scope.
- A dedicated Fabely `Card` atom to formally pair with the shadcn docs' "Card" composition example — no `Card` component exists yet anywhere in this package; the Storybook `Card` example below uses a minimal inline-styled wrapper `div` instead (see `accordion.stories.tsx`) as the simplest faithful equivalent until a real `Card` atom exists.
