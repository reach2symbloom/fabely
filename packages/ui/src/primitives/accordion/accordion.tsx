/**
 * Fabely Accordion primitive — wraps the upstream shadcn Accordion primitive
 * (src/components/ui/accordion.tsx, built on Base UI's Accordion via
 * `@base-ui/react/accordion`) with Fabely's Foundations-sourced styling.
 *
 * Unlike Avatar, this primitive introduces no new props, variants, or
 * sub-components. No Figma design exists yet for Accordion — there was no
 * selection to reverse-engineer a Fabely-specific variant surface from, so
 * per docs/DESIGN.md's "match Figma faithfully first, identify recurring
 * patterns before introducing abstractions" workflow, there is nothing yet
 * to abstract beyond a faithful restyle. shadcn/Base UI's own Accordion
 * documentation (component + prop names: `multiple`, `value`/`defaultValue`
 * as arrays, `onValueChange`, `disabled`) is the source of truth for API
 * and behavior in place of Figma for this milestone — see README.md.
 *
 * The four exports below are a straight pass-through of the vendor
 * component set (Accordion, AccordionItem, AccordionTrigger,
 * AccordionContent) with only their default Tailwind classes swapped for
 * the equivalent Foundations token, exactly where one already exists —
 * this is the same "override vendor classes via className, don't fork the
 * vendor file" approach avatar.tsx established. `Accordion` itself carries
 * no default classes in the vendor file to begin with (nothing to
 * restyle), so it's re-exported completely unchanged — mirroring how
 * avatar.tsx re-exports `AvatarImage` as-is for the same reason.
 */
import * as React from 'react';
import {
  Accordion,
  AccordionItem as AccordionItemPrimitive,
  AccordionTrigger as AccordionTriggerPrimitive,
  AccordionContent as AccordionContentPrimitive,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

/* The vendor's own `border-b` (dividing each item from the next) already
 * inherits `--border` at a 1px width through globals.css's global
 * `* { @apply border-border }` base rule — so this isn't a visual change.
 * It's restated explicitly here, sourcing the width from
 * `--stroke-thin` (foundations/stroke.css — Tailwind's implicit
 * border-width default happens to already equal exactly 1px) and the
 * color from `--border` (foundations/colors.css) directly, so this file's
 * own styling is traceable to Foundations on its own rather than depending
 * on a global side effect defined elsewhere for its correctness. */
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionItemPrimitive>) {
  return (
    <AccordionItemPrimitive
      className={cn(
        'border-b-[length:var(--stroke-thin)] border-[color:var(--border)] last:border-b-0',
        className
      )}
      {...props}
    />
  );
}

/* Trigger row spacing/typography/focus-ring, each substituted for the
 * numerically-closest (or exact) Foundations token in place of the
 * vendor's raw Tailwind defaults:
 *
 * - `gap-4`/`py-4` are Tailwind's literal 16px, which is exactly
 *   Foundations' `--spacing-md` (spacing.css) — substituting the token
 *   changes nothing visually, it just gives the value a traceable name.
 * - `text-sm font-medium` (14px / 20px line-height / weight 500) is
 *   exactly Paragraph Small Medium (foundations/typography.css) — one of
 *   the rare cases where the vendor default and the Foundations scale
 *   already agree numerically.
 * - `rounded-md` is swapped for Foundations' own smallest published
 *   radius, `--rounded-sm` (5px, radius.css), rather than this project's
 *   *derived* `--radius-md` (`calc(var(--radius) - 2px)` = 14px, set in
 *   globals.css's `@theme inline` block) that the plain `rounded-md`
 *   utility actually resolves to. That derived scale is computed FROM a
 *   Foundations token but isn't itself one — reusing it here would be the
 *   same category of scale-mismatch avatar.tsx's `roundrectRadiusClasses`
 *   comment already flagged and avoided for shape/radius. `--rounded-sm`
 *   is the closest analog to the vendor's "just barely rounded" intent for
 *   this mostly-rectangular full-width row.
 * - The focus ring swaps the vendor's ad hoc `focus-visible:border-ring
 *   focus-visible:ring-[3px] focus-visible:ring-ring/50` (the
 *   `border-ring` half of which is inert here — Trigger has no border of
 *   its own for it to recolor) for `--effect-focus-ring-secondary`
 *   (foundations/effects/focus-rings/focus-rings.css) — the same
 *   box-shadow-ring pattern already established for interactive atoms
 *   (see avatar.tsx's AvatarIconBadge). Secondary, not Primary, is the
 *   correct one of the two to reuse: the vendor's own default ring color
 *   is plain `--ring` (not `--ring-primary`), and
 *   `--effect-focus-ring-secondary` is defined as exactly that color at
 *   the Foundations-standard 3px width — the vendor's own ring color
 *   choice, now sourced from a named Effect instead of a bare Tailwind
 *   utility. */
function AccordionTrigger({
  className,
  ...props
}: React.ComponentProps<typeof AccordionTriggerPrimitive>) {
  return (
    <AccordionTriggerPrimitive
      className={cn(
        'gap-[var(--spacing-md)] rounded-[var(--rounded-sm)] py-[var(--spacing-md)]',
        'text-[length:var(--text-paragraph-small-medium-font-size)] leading-[var(--text-paragraph-small-medium-line-height)] tracking-[var(--text-paragraph-small-medium-letter-spacing)]',
        'font-[family-name:var(--font-family-body)] [font-weight:var(--font-weight-paragraph-medium)]',
        'focus-visible:outline-none focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
        className
      )}
      {...props}
    />
  );
}

/* Body copy maps onto Paragraph Small Regular (14px / 20px line-height /
 * weight 400) — the vendor's own `text-sm` with no explicit weight
 * utility, which resolves to the browser default (400/regular) already.
 * `pb-4` substitutes `--spacing-md` for the same "already numerically
 * identical, name the value" reasoning as the Trigger above; `pt-0` is
 * left as a literal 0 — there's no Foundations token to source zero from,
 * and zero needs no provenance.
 *
 * These utilities land on AccordionContent's *inner* wrapper div, not the
 * outer Base UI `Panel` element — the vendor file hardcodes the outer
 * element's own class list as a literal string rather than merging it
 * through `cn()`, so `className` (and everything passed here) can only
 * ever reach that inner div, never the outer element. This still produces
 * the correct visible result without needing to touch the vendor file:
 * the outer element's own `text-sm` is inherited by the inner div by
 * default, but CSS gives an element's own font-size priority over an
 * inherited one, so setting typography here on the actual innermost div
 * that renders the text overrides the outer default for exactly the
 * content that's visible — no separate override of the outer element is
 * needed for this to look correct. */
function AccordionContent({
  className,
  ...props
}: React.ComponentProps<typeof AccordionContentPrimitive>) {
  return (
    <AccordionContentPrimitive
      className={cn(
        'text-[length:var(--text-paragraph-small-regular-font-size)] leading-[var(--text-paragraph-small-regular-line-height)] tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        'font-[family-name:var(--font-family-body)] [font-weight:var(--font-weight-paragraph-regular)]',
        className
      )}
      {...props}
    />
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
