/**
 * Fabely Alert primitive — wraps the upstream shadcn Alert primitive
 * (src/components/ui/alert.tsx) to match this design system's own Figma
 * Alert component (node 58:5416, "Fabely Design System" file:
 * gV94L0qCmvwQkddNbEktry) inspected directly via the Figma MCP connection.
 *
 * Figma exposes 4 types (Neutral/Error/Alert/Success) × 2 line counts, a
 * `Flip Icon` boolean, and a `Show Button` slot. This primitive implements all
 * 4 types at both line counts, with the icon shown or hidden — `Flip Icon`
 * and `Show Button` remain out of scope (see git history/README for the
 * Neutral-only milestone this one extends).
 *
 * - **type** (`neutral` | `error` | `alert` | `success`) — a real prop
 *   (default `'neutral'`), unlike Lines/icon below: there's no
 *   composition signal that could stand in for "which color treatment"
 *   the way a child's presence stands in for line count, so Figma's
 *   `Type` variant maps directly to a prop here.
 * - **Lines** (1 vs. 2) — still not a prop. Derived from whether an
 *   `AlertDescription` child is present, matching every type in Figma
 *   identically (icon 16px→24px, icon/content gap `--spacing-sm`→
 *   `--spacing-md`, for all 4 types alike).
 * - **Icon** (shown vs. hidden) — not a prop for any of the 4 types,
 *   `success` included: pass an icon child, or don't. Figma's own Success
 *   schema has no `icon`/`showIcon` prop at all (its checkmark instance
 *   is unconditional there), but this primitive still derives visibility from
 *   composition for `success` too, matching the other 3 types, rather
 *   than forcing the icon permanently on — a deliberate, intentional
 *   divergence from Figma's own schema limit, not an oversight. Whatever
 *   icon element is passed for `type="success"` is ignored in favor of a
 *   fixed `CheckCheck` (matching Figma's own component description,
 *   "Icon / check-check") — only *presence* of a child is used as the
 *   show/hide signal, its identity is not.
 */
import * as React from 'react';
import { CheckCheck } from 'lucide-react';
import {
  Alert as AlertPrimitive,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/alert';
import { cn } from '@/lib/utils';

function isAlertContent(child: React.ReactNode): boolean {
  return React.isValidElement(child) && (child.type === AlertTitle || child.type === AlertDescription);
}

export type AlertType = 'neutral' | 'error' | 'alert' | 'success';

type AlertProps = Omit<React.ComponentProps<typeof AlertPrimitive>, 'variant'> & {
  type?: AlertType;
};

/**
 * Structure/layout (flex row, `items-center`, radius, padding, the
 * title+description content wrapper) is identical across all 4 types in
 * Figma — only color and the success-only baked-in icon differ. See this
 * primitive's original (Neutral-only) revision for why the layout itself
 * departs from vendor's own CSS grid.
 *
 * Colors below are Figma's own values for each type, cross-checked
 * against foundations/colors.css:
 *
 * - `neutral` — unchanged from the approved milestone: existing switch
 *   tokens (`--theme-alpha-black-switch-333`/`-30`, `--effect-focus-ring-
 *   secondary`, `--foreground`) already cover it exactly, no hardcoded
 *   values needed.
 * - `error` — background/border are literal, unbound alpha values in
 *   Figma (8% of `--tw-raw-error-400`, 32% of `--tw-raw-error-300`) with
 *   no matching declared Foundation step (the existing `--tw-raw-error-
 *   ghost` is a *different*, already-declared 12% step, not reusable
 *   here) — reconstructed via `color-mix()` from the existing raw
 *   primitives rather than a bare hex, per this milestone's own
 *   instructions to preserve Figma's hardcoded values rather than invent
 *   a new named token for one specific alpha step.
 *   TODO(design-tokens): if a real "error surface"/"error border" alpha
 *   step gets published to Foundations, swap these two `color-mix()`
 *   calls for it.
 *   The ring is a literal, unbound 8% of `--tw-raw-error-ghost` (`#C43551`)
 *   — the *same* already-declared raw token as the background/border
 *   above, not the switching `--ring-error` semantic token (that token's
 *   own light/dark values don't match Figma's literal ring color here;
 *   this type keeps a fixed brand-color ring in both themes, same as its
 *   background/border, and same pattern as `alert`/`success` below,
 *   which also build their own rings from their own raw ghost token
 *   rather than `--ring-alert`/`--ring-success`).
 *   Title text binds to the raw, non-switching `--tw-raw-error-50` in
 *   Figma (not a semantic/switching token, unlike `neutral`'s `--
 *   foreground`) — preserved as literally specified.
 *   TODO(design-tokens/contrast): because this is a raw, theme-invariant
 *   value paired with an also-theme-invariant background, this specific
 *   type has not been verified for light-mode contrast the way `neutral`
 *   was in the previous milestone — flagging rather than silently
 *   inventing a switching equivalent Figma doesn't itself define.
 * - `alert` — background/border/ring are all literal, unbound values
 *   built from the *already-declared* `--tw-raw-alert-ghost` token
 *   (its own colors.css comment already says "8% opacity per Figma" —
 *   matches this type's background exactly; its border is the same base
 *   at 32%, no matching declared step, same `color-mix()` treatment as
 *   `error`).
 *   TODO(design-tokens): title text in Figma's own inspected value
 *   actually points at `--tw-raw-error-50` here too (pale pink) — almost
 *   certainly a copy/paste artifact from the Error variant this one was
 *   likely duplicated from in Figma (an amber-tinted surface with pink
 *   title text reads as a mistake, not a design choice); used the
 *   same-family `--tw-raw-alert-50` instead of reproducing that
 *   inconsistency. Worth confirming with design and fixing at the source
 *   in Figma.
 * - `success` — background/border are literal alpha steps of the
 *   already-declared `--tw-raw-success-ghost` token at 4%/32% (32% is
 *   this milestone's own cited example — no declared Foundation step
 *   matches it). Ring reuses the *same* token at the 12% its own comment
 *   documents (`--tw-raw-success-ghost` already *is* the correct base
 *   color for all three). Title text uses the switching `--foreground`
 *   (Figma's own value here, unlike `error`/`alert`).
 *   TODO(design-tokens): as with `error`/`alert`, none of these alpha
 *   steps are declared Foundation tokens in their own right yet — flagged
 *   rather than inventing new named tokens for single-use percentages.
 *
 * Figma's Error/Alert types at Lines=1 also wrap their icon in its own
 * small `pt-[2px]` "Icon-aligner" for a sub-pixel optical nudge — skipped
 * here as imperceptible at this size, rather than adding a fourth
 * conditional wrapper for a 2px difference.
 */
const typeClasses: Record<AlertType, string> = {
  neutral: cn(
    'bg-[var(--theme-alpha-black-switch-333)]',
    'border-[color:var(--theme-alpha-black-switch-30)]',
    'shadow-[var(--effect-focus-ring-secondary)]',
    'text-foreground'
  ),
  error: cn(
    'bg-[color-mix(in_srgb,var(--tw-raw-error-400)_8%,transparent)]',
    'border-[color-mix(in_srgb,var(--tw-raw-error-300)_32%,transparent)]',
    'shadow-[0px_0px_0px_3px_color-mix(in_srgb,var(--tw-raw-error-ghost)_8%,transparent)]',
    'text-[var(--tw-raw-error-50)]'
  ),
  alert: cn(
    'bg-[color-mix(in_srgb,var(--tw-raw-alert-ghost)_8%,transparent)]',
    'border-[color-mix(in_srgb,var(--tw-raw-alert-ghost)_28%,transparent)]',
    'shadow-[0px_0px_0px_3px_color-mix(in_srgb,var(--tw-raw-alert-ghost)_8%,transparent)]',
    'text-[var(--tw-raw-alert-50)]'
  ),
  success: cn(
    'bg-[color-mix(in_srgb,var(--tw-raw-success-ghost)_4%,transparent)]',
    'border-[color-mix(in_srgb,var(--tw-raw-success-ghost)_32%,transparent)]',
    'shadow-[0px_0px_0px_3px_color-mix(in_srgb,var(--tw-raw-success-ghost)_12%,transparent)]',
    'text-foreground'
  ),
};

/**
 * Icon color is a *separate* concern from the title-text color above: in
 * Figma every type's icon reads as a distinct semantic accent, not the
 * same (sometimes near-white/pale) shade as its own title. Vendor's own
 * base class already has a `[&>svg]:text-current` rule, which makes the
 * icon inherit whatever `text-*` color is on the Alert root — i.e. the
 * title's own color — which is exactly the bug this fixes: `error`/
 * `alert` titles are pale, near-white raw tones (see the TODOs above), so
 * their icons rendered that same washed-out near-white instead of a real
 * accent.
 *
 * This has to stay a root-level `[&>svg]:text-*` rule (not a class placed
 * directly on the icon element itself, e.g. via `cloneElement`): vendor's
 * `[&>svg]:text-current` compiles to a selector with an element part
 * (`> svg`), which beats a plain single-class selector on the svg itself
 * on specificity regardless of source order. Overriding it with another
 * `[&>svg]:text-*` rule of the same selector shape is the only way
 * `tailwind-merge` reliably drops vendor's default in favor of this one.
 *
 * - `neutral` — `--primary` (light: `--theme-neutrals-600`, dark:
 *   `--theme-neutrals-500`), the same switching "main" step the other
 *   types use from their own scale. Distinct from title (`--foreground`)
 *   and from `AlertDescription` (`--muted-foreground`).
 * - `error` — `--destructive`, this design system's own existing,
 *   already-switching semantic accent for error (light: `--tw-raw-error-
 *   500`, dark: `--tw-raw-error-300`) — the same token vendor's own
 *   `destructive` variant already uses for its text color. A real
 *   Foundation token, so no TODO.
 * - `alert`/`success` — neither has a declared semantic accent token
 *   (only the raw `tw-raw-alert-*`/`tw-raw-success-*` scales and their
 *   already-declared "ghost" alpha steps exist) — using each scale's own
 *   "main" step (`--tw-raw-alert-600`/`--tw-raw-success-600`) directly.
 *   TODO(design-tokens): promote these to real `--warning`/`--success`
 *   semantic accent tokens (mirroring `--destructive`) once Foundations
 *   defines them, rather than reaching into the raw scale here.
 */
const typeIconClasses: Record<AlertType, string> = {
  neutral: '[&>svg]:text-primary',
  error: '[&>svg]:text-destructive',
  alert: '[&>svg]:text-[var(--tw-raw-alert-600)]',
  success: '[&>svg]:text-[var(--tw-raw-success-600)]',
};

function Alert({ className, children, type = 'neutral', ...props }: AlertProps) {
  const childArray = React.Children.toArray(children);
  const content = childArray.filter(isAlertContent);
  const hasLine2 = content.some((child) => React.isValidElement(child) && child.type === AlertDescription);

  const iconChild = childArray.find((child) => !isAlertContent(child));
  const icon = iconChild ? (type === 'success' ? <CheckCheck /> : iconChild) : null;

  return (
    <AlertPrimitive
      className={cn(
        'flex items-center overflow-clip',
        hasLine2 ? 'gap-[var(--spacing-md)]' : 'gap-[var(--spacing-sm)]',
        'rounded-[var(--rounded-lg)]',
        typeClasses[type],
        '[&>svg]:shrink-0 [&>svg]:translate-y-0',
        hasLine2 ? '[&>svg]:size-6' : '[&>svg]:size-4',
        typeIconClasses[type],
        className
      )}
      {...props}
    >
      {icon}
      <div data-slot="alert-content" className="flex min-w-px flex-[1_0_0] flex-col gap-[var(--spacing-3xs)]">
        {content}
      </div>
    </AlertPrimitive>
  );
}

export { Alert, AlertTitle, AlertDescription };
