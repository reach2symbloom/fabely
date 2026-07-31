/**
 * Fabely Avatar atom — wraps the upstream shadcn Avatar primitive
 * (src/components/ui/avatar.tsx) with Fabely's size and shape variants,
 * sourced entirely from Foundations (spacing, radius, typography, color).
 *
 * This is the public API future Fabely components should import Avatar
 * from, not the vendor path directly, so any future Fabely-specific
 * behavior (presence, multiple images) can be layered in here without call
 * sites changing their import.
 *
 * Not yet implemented — deliberately deferred, see README.md:
 * notification counts.
 */
import * as React from 'react';
import {
  Avatar as AvatarPrimitive,
  AvatarImage,
  AvatarFallback as AvatarFallbackPrimitive,
} from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export type AvatarSize = 'extraTiny' | 'tiny' | 'small' | 'regular' | 'large' | 'extraLarge';
export type AvatarShape = 'round' | 'roundrect';

/** Shares `size`/`shape` from Avatar down to AvatarFallback so initials
 * typography scales and AvatarFallback's own radius stays in sync without
 * callers repeating either prop on both. AvatarFallback needs the radius
 * too, not just Avatar's root: it's an opaque size-full layer with its own
 * `rounded-full` in the vendor primitive, so the root's clip alone isn't
 * enough — left un-synced, the fallback's circular corners paint inside the
 * root's roundrect clip and the shape reads as fully round regardless of
 * the `shape` prop. `gradient` isn't part of this context — it never
 * changes AvatarFallback's own radius (see Avatar's `gradientClasses`
 * comment: Gradient only ever applies at `shape="round"`, where Fallback's
 * existing radius is already correct as-is). */
const AvatarVariantContext = React.createContext<{ size: AvatarSize; shape: AvatarShape }>({
  size: 'regular',
  shape: 'round',
});

const sizeClasses: Record<AvatarSize, string> = {
  extraTiny: 'size-[var(--spacing-lg)]',
  tiny: 'size-[var(--spacing-xl)]',
  small: 'size-[var(--spacing-2xl)]',
  regular: 'size-[var(--spacing-3xl)]',
  large: 'size-[var(--spacing-4xl)]',
  extraLarge: 'size-[var(--spacing-5xl)]',
};

const roundrectRadiusClasses: Record<AvatarSize, string> = {
  extraTiny: 'rounded-[var(--rounded-sm)]',
  tiny: 'rounded-[var(--rounded-md)]',
  small: 'rounded-[var(--radius)]',
  regular: 'rounded-[var(--radius)]',
  large: 'rounded-[var(--rounded-lg)]',
  extraLarge: 'rounded-[var(--radius)]',
};

function radiusClass(size: AvatarSize, shape: AvatarShape) {
  return shape === 'round' ? 'rounded-[var(--rounded-full)]' : roundrectRadiusClasses[size];
}

/* Keyed by size only — shape doesn't affect type scale. Every size maps to
 * a complete Paragraph/Bold style, including Extra Tiny -> Paragraph Micro
 * (foundations/typography.css) — see that style's header comment for its
 * provenance (Figma's Extra Tiny left this text unbound to any real
 * style). */
const initialsTypographyClasses: Record<AvatarSize, string> = {
  extraTiny:
    'text-[length:var(--text-paragraph-micro-bold-font-size)] leading-[var(--text-paragraph-micro-bold-line-height)] tracking-[var(--text-paragraph-micro-bold-letter-spacing)]',
  tiny: 'text-[length:var(--text-paragraph-mini-bold-font-size)] leading-[var(--text-paragraph-mini-bold-line-height)] tracking-[var(--text-paragraph-mini-bold-letter-spacing)]',
  small:
    'text-[length:var(--text-paragraph-small-bold-font-size)] leading-[var(--text-paragraph-small-bold-line-height)] tracking-[var(--text-paragraph-small-bold-letter-spacing)]',
  regular:
    'text-[length:var(--text-paragraph-small-bold-font-size)] leading-[var(--text-paragraph-small-bold-line-height)] tracking-[var(--text-paragraph-small-bold-letter-spacing)]',
  large:
    'text-[length:var(--text-paragraph-large-bold-font-size)] leading-[var(--text-paragraph-large-bold-line-height)] tracking-[var(--text-paragraph-large-bold-letter-spacing)]',
  extraLarge:
    'text-[length:var(--text-paragraph-xxl-bold-font-size)] leading-[var(--text-paragraph-xxl-bold-line-height)] tracking-[var(--text-paragraph-xxl-bold-letter-spacing)]',
};

export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

/* Badge diameter is calc()-derived as a fixed 28% of the parent avatar's
 * own size token, rather than a discrete lookup — it scales exactly and
 * continuously with whatever the Avatar's size renders at, satisfying
 * "scales proportionally" by construction instead of approximation. There's
 * no Figma spec for badges (this feature doesn't exist in the Figma
 * selection this atom was built from), so the 28% ratio itself is an
 * engineering decision — chosen, after visual review, to read as a
 * balanced accent rather than dominating the avatar (an earlier ~40%
 * version read as too large). */
const badgeSizeClasses: Record<AvatarSize, string> = {
  extraTiny: 'size-[calc(var(--spacing-lg)*0.28)]',
  tiny: 'size-[calc(var(--spacing-xl)*0.28)]',
  small: 'size-[calc(var(--spacing-2xl)*0.28)]',
  regular: 'size-[calc(var(--spacing-3xl)*0.28)]',
  large: 'size-[calc(var(--spacing-4xl)*0.28)]',
  extraLarge: 'size-[calc(var(--spacing-5xl)*0.28)]',
};

/* Icon fills ~65% of the badge's own diameter, chained onto the same
 * avatar-size token + badge ratio (rather than a separate flattened
 * number) so the derivation stays traceable end-to-end. */
const badgeIconSizeClasses: Record<AvatarSize, string> = {
  extraTiny: '[&>svg]:size-[calc(var(--spacing-lg)*0.28*0.65)]',
  tiny: '[&>svg]:size-[calc(var(--spacing-xl)*0.28*0.65)]',
  small: '[&>svg]:size-[calc(var(--spacing-2xl)*0.28*0.65)]',
  regular: '[&>svg]:size-[calc(var(--spacing-3xl)*0.28*0.65)]',
  large: '[&>svg]:size-[calc(var(--spacing-4xl)*0.28*0.65)]',
  extraLarge: '[&>svg]:size-[calc(var(--spacing-5xl)*0.28*0.65)]',
};

/* Shared by both badge variants: bottom-right placement, always fully
 * round regardless of the parent Avatar's `shape` (matches the vendor
 * primitive's own unconditional rounded-full), and a ring in the page
 * background color to separate the badge from the avatar/fallback beneath
 * it — this is a static separation ring, not a focus ring, so it doesn't
 * use foundations/effects/focus-rings (that layer is for :focus-visible
 * feedback on interactive elements, a different purpose). */
const badgePositionClasses =
  'absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-[var(--rounded-full)] ring-[length:var(--stroke-regular)] ring-[color:var(--background)] select-none';

/* Colors audited against Foundations (colors.css) before adding anything
 * new. Busy consumes --destructive — the one status with an existing
 * general-purpose semantic token, and consequently the only one of the
 * four that's theme-aware. Online/Away have no promoted semantic
 * equivalent yet: colors.css's --ring-success/--ring-alert exist, but
 * they're calibrated for pale focus-ring glows (ring-success is a 12%-
 * opacity "ghost" value in Light), not solid fills — using them here would
 * render a barely-visible dot. So Online/Away consume the raw "main"
 * swatch directly, per docs/DESIGN.md's "Foundations may be consumed
 * directly during exploration"; promoting --success/--warning to general
 * semantic tokens belongs to a future Foundations pass once a second real
 * usage justifies it, not to this component inventing them unilaterally.
 * Offline has no success/alert/error equivalent at all —
 * --tw-raw-neutral-400 is an engineering choice for "no status," not a
 * Foundation status color. */
const statusColorClasses: Record<AvatarStatus, string> = {
  online: 'bg-[var(--tw-raw-success-500)]',
  away: 'bg-[var(--tw-raw-alert-600)]',
  busy: 'bg-[var(--destructive)]',
  offline: 'bg-[var(--tw-raw-neutral-400)]',
};

type AvatarProps = Omit<React.ComponentProps<typeof AvatarPrimitive>, 'size'> & {
  size?: AvatarSize;
  shape?: AvatarShape;
  /**
   * Applies the Primary gradient border + Focus Ring Glow treatment.
   *
   * Currently supported for Round avatars only, matching the authored
   * Figma design. When used with Roundrect, the avatar renders without
   * the gradient treatment — this is a deliberate scope limit, not a bug.
   * See this component's `gradientClasses` comment (or README.md) for why.
   */
  gradient?: boolean;
};

/** True for AvatarStatusBadge/AvatarIconBadge elements, used by Avatar to
 * pull badges out of its clipped root — see Avatar's own comment for why. */
function isAvatarBadge(child: React.ReactNode): boolean {
  return (
    React.isValidElement(child) && (child.type === AvatarStatusBadge || child.type === AvatarIconBadge)
  );
}

/* Figma's "Gradient" variant only exists on the avatar-with-image
 * component, and only for Roundness Type=Round — there is no
 * Roundrect+Gradient combination in Figma at all. An earlier version tried
 * to extend Gradient to roundrect anyway (reusing radiusClass() for
 * whatever `shape` was set); the geometry was fixed correctly (verified:
 * single element, one radius application, computed styles matched), but a
 * second, independent problem surfaced that geometry couldn't fix: the
 * glow's solid ring layer (--ring-primary, a fixed color) only visually
 * matches the gradient border's own color at the gradient's light pole —
 * pixel-sampling the rendered result showed an abrupt, unblended color
 * jump between the two right where the gradient reaches its dark pole,
 * which reads as a second concentric outline on Roundrect's straight
 * edges. On Round the exact same color jump exists at the same position,
 * but a continuous curve reads it as an ambient rim-light rather than a
 * second boundary, which is almost certainly why Figma never authored
 * that combination. Given the glow token must stay exactly as defined
 * (foundations/effects/focus-rings/focus-rings.css) and the border must
 * stay the true Primary gradient (not a solid color chosen to blend with
 * the glow), the two constraints conflict specifically on Roundrect — so
 * `gradient` only ever applies when `shape==="round"`; combined with
 * `shape="roundrect"` it's a no-op (renders as if `gradient` were false)
 * rather than ship a compromised result. See README.md.
 *
 * Implemented as a single prop on Avatar itself — not a separate prop on
 * AvatarImage/AvatarFallback — because the ring + glow treatment lives on
 * the avatar's own outer frame in Figma, not on the content inside it, so
 * one prop already produces the correct result for both AvatarImage and
 * AvatarFallback content without duplicating it.
 *
 * Applied directly on the vendor primitive's own root (the element that
 * already carries radiusClass() and overflow-hidden), NOT on the outer
 * `avatar-root` wrapper — those are two different-sized boxes (the wrapper
 * is the full declared size; the vendor root sits inside whatever border
 * this adds), so giving each its own copy of the same radius independently
 * nests two visually different curves. For Round this is invisible
 * (--rounded-full minus a few px is still a full circle either way), which
 * is exactly why this only matters for the roundrect case being excluded
 * above — but keeping the border/glow on the one element that already owns
 * the correct radius, rather than the wrapper, remains the right call
 * regardless.
 *
 * The border itself can't be a plain Tailwind border-color (CSS
 * border-color only accepts solid colors, not a gradient) or CSS
 * border-image (which ignores border-radius) — the standard technique for
 * a gradient border that respects border-radius is a transparent border
 * plus two layered backgrounds: an opaque inner layer clipped to
 * padding-box (never actually visible — Avatar's own content always fully
 * covers it) and the gradient clipped to border-box, visible only in the
 * border's own thickness. Direction defaults to top-bottom (the visual
 * match for the Figma reference); no direction prop is exposed since one
 * wasn't requested. The glow reuses the existing Primary Focus Ring Glow
 * effect token verbatim, unchanged — Figma's own effect on this variant,
 * by name and value, is that exact token — only moved to the same element
 * as the border so it hugs that exact same edge with zero offset, rather
 * than the outer wrapper's larger, unrelated box. */
const gradientClasses = cn(
  'rounded-[var(--rounded-full)]',
  'border-[length:var(--stroke-regular)] border-solid border-transparent',
  '[background:linear-gradient(var(--background),var(--background))_padding-box,var(--gradient-primary-top-bottom)_border-box]',
  'shadow-[var(--effect-focus-ring-primary-glow)]'
);

/* Badges are rendered as siblings of the vendor primitive's root, not as
 * its children: that root carries `overflow-hidden` together with its
 * rounded shape (needed to clip AvatarImage/AvatarFallback to the circle/
 * roundrect), and overflow-hidden + border-radius clips ANY descendant
 * painted outside that rounded boundary — including an absolutely
 * positioned badge sitting at the corner, which rendered as a "bitten"
 * half-circle instead of a complete dot before this fix. Splitting badge
 * children into an unclipped outer wrapper (same size, position: relative,
 * no overflow rule of its own) is what lets the badge render as a full,
 * unclipped circle on top of the avatar's edge. This wrapper stays
 * unstyled otherwise — no radius, no gradient — see gradientClasses's own
 * comment for why those apply to the vendor root inside it instead. */
function Avatar({
  className,
  size = 'regular',
  shape = 'round',
  gradient = false,
  children,
  ...props
}: AvatarProps) {
  const childArray = React.Children.toArray(children);
  const badges = childArray.filter(isAvatarBadge);
  const content = childArray.filter((child) => !isAvatarBadge(child));
  const appliedGradient = gradient && shape === 'round';

  return (
    <AvatarVariantContext.Provider value={{ size, shape }}>
      <div data-slot="avatar-root" className={cn('relative', sizeClasses[size])}>
        <AvatarPrimitive
          className={cn(
            'size-full',
            appliedGradient ? gradientClasses : radiusClass(size, shape),
            className
          )}
          {...props}
        >
          {content}
        </AvatarPrimitive>
        {badges}
      </div>
    </AvatarVariantContext.Provider>
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarFallbackPrimitive>) {
  const { size, shape } = React.useContext(AvatarVariantContext);
  return (
    <AvatarFallbackPrimitive
      className={cn(
        'bg-[var(--tw-raw-pantones-blush)] text-[color:var(--primary-foreground)]',
        'font-[family-name:var(--font-family-body)] [font-weight:var(--font-weight-paragraph-bold)]',
        radiusClass(size, shape),
        initialsTypographyClasses[size],
        className
      )}
      {...props}
    />
  );
}

type AvatarStatusBadgeProps = React.ComponentProps<'span'> & {
  status: AvatarStatus;
};

/** A plain, non-interactive presence dot — online/away/busy/offline. Builds
 * its own <span> rather than reusing the vendor AvatarBadge component: that
 * vendor component bakes in group-data-[size=X]/avatar sizing tied to its
 * own 3-value size scale ("default"/"sm"/"lg"), and since our Avatar never
 * sets that vendor `size` prop, its data-size stays "default" — meaning
 * vendor's own group-data-[size=default]/avatar:size-2.5 rule was
 * unconditionally winning over this component's size override by CSS
 * specificity (a compound ancestor-attribute selector beats a plain
 * class), the same category of bug already hit and fixed for
 * AvatarFallback's radius. Building the span directly sidesteps it. */
function AvatarStatusBadge({ className, status, ...props }: AvatarStatusBadgeProps) {
  const { size } = React.useContext(AvatarVariantContext);
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        badgePositionClasses,
        badgeSizeClasses[size],
        statusColorClasses[status],
        className
      )}
      {...props}
    />
  );
}

type AvatarIconBadgeProps = React.ComponentProps<'button'>;

/** Renders an icon (pass a Lucide icon as children, matching the shadcn
 * reference). A real <button>, not a <span> — this badge is meant to
 * eventually open a menu or similar UI, so the element type is
 * future-proofed now rather than swapped out later; no click behavior is
 * wired up yet, this milestone only covers the visual/structural badge. */
function AvatarIconBadge({ className, type = 'button', ...props }: AvatarIconBadgeProps) {
  const { size } = React.useContext(AvatarVariantContext);
  return (
    <button
      type={type}
      data-slot="avatar-badge"
      className={cn(
        badgePositionClasses,
        badgeSizeClasses[size],
        badgeIconSizeClasses[size],
        'cursor-pointer bg-[var(--primary)] text-[color:var(--primary-foreground)]',
        'focus-visible:outline-none focus-visible:shadow-[var(--effect-focus-ring-primary)]',
        className
      )}
      {...props}
    />
  );
}

/* Overlap: each Avatar after the first shifts left by 25% of the group's
 * own `size` token, calc()-derived like badge sizing so it scales exactly
 * with whichever size the group's children are set to (there's no Figma
 * spec for groups either — 25% is an engineering decision, chosen to read
 * as "subtle," not heavily stacked). Targets `[data-slot=avatar-root]`
 * (Avatar's own outer wrapper, not the vendor `[data-slot=avatar]` root
 * nested inside it) — the wrapper is what actually needs to move as a flex
 * item, since it's what contains both the avatar circle and its badge; the
 * vendor root can't be targeted here since flex-item margin has to apply to
 * the actual direct child of the group. AvatarGroup's `size` isn't linked
 * to its children's own `size` automatically — keep them in sync. */
const groupOverlapClasses: Record<AvatarSize, string> = {
  extraTiny: '[&>[data-slot=avatar-root]:not(:first-child)]:ml-[calc(var(--spacing-lg)*-0.25)]',
  tiny: '[&>[data-slot=avatar-root]:not(:first-child)]:ml-[calc(var(--spacing-xl)*-0.25)]',
  small: '[&>[data-slot=avatar-root]:not(:first-child)]:ml-[calc(var(--spacing-2xl)*-0.25)]',
  regular: '[&>[data-slot=avatar-root]:not(:first-child)]:ml-[calc(var(--spacing-3xl)*-0.25)]',
  large: '[&>[data-slot=avatar-root]:not(:first-child)]:ml-[calc(var(--spacing-4xl)*-0.25)]',
  extraLarge: '[&>[data-slot=avatar-root]:not(:first-child)]:ml-[calc(var(--spacing-5xl)*-0.25)]',
};

type AvatarGroupProps = React.ComponentProps<'div'> & {
  size?: AvatarSize;
  shape?: AvatarShape;
};

/** Lets AvatarGroupCount automatically match its parent AvatarGroup's
 * `size`/`shape` with no props of its own for the common case — mirrors
 * AvatarVariantContext's role for Avatar/AvatarFallback, but scoped to the
 * group level since AvatarGroupCount isn't a child of any single Avatar.
 * Neither `size` nor `shape` here are linked to the group's actual Avatar
 * children automatically (same as `size` already wasn't) — keep them in
 * sync at the call site. */
const AvatarGroupContext = React.createContext<{ size: AvatarSize; shape: AvatarShape }>({
  size: 'regular',
  shape: 'round',
});

/** Groups Avatars into a subtly overlapping stack (per the shadcn
 * reference), adapted to this atom's own structure rather than reused
 * verbatim — vendor's `AvatarGroup` targets `[data-slot=avatar]` directly
 * and uses a fixed `-space-x-2`/`ring-2`, neither of which accounts for
 * Avatar's own outer wrapper (added for badges, see Avatar's comment) or
 * Foundation-token sizing, so it isn't reused here (same reasoning as
 * AvatarStatusBadge/AvatarIconBadge not reusing vendor's AvatarBadge).
 *
 * Hovering any single avatar gently scales it (a CSS transform — doesn't
 * disturb neighboring avatars' layout) and raises it to the front via
 * z-index, so it's never clipped by avatars stacked on top of it in normal
 * paint order. Scoped to direct `[data-slot=avatar-root]` children of the
 * group specifically, not baked into Avatar itself, so standalone
 * (non-grouped) avatars don't gain unsolicited hover behavior. */
function AvatarGroup({ className, size = 'regular', shape = 'round', ...props }: AvatarGroupProps) {
  return (
    <AvatarGroupContext.Provider value={{ size, shape }}>
      <div
        data-slot="avatar-group"
        className={cn(
          'flex items-center',
          groupOverlapClasses[size],
          '[&>[data-slot=avatar-root]]:transition-transform [&>[data-slot=avatar-root]]:duration-150 [&>[data-slot=avatar-root]]:ease-out',
          '[&>[data-slot=avatar-root]:hover]:z-10 [&>[data-slot=avatar-root]:hover]:scale-110',
          '[&_[data-slot=avatar]]:ring-[length:var(--stroke-regular)] [&_[data-slot=avatar]]:ring-[color:var(--background)]',
          className
        )}
        {...props}
      />
    </AvatarGroupContext.Provider>
  );
}

type AvatarGroupCountProps = React.ComponentProps<'a'>;

/** Sits at the end of an AvatarGroup as either an overflow count (text
 * children, e.g. "+3") or an "action avatar" (arbitrary children, e.g. an
 * icon) — per the shadcn reference, the same component covers both; only
 * the children differ. No `size`/`shape` props of its own: it reads both
 * from AvatarGroupContext, so `<AvatarGroupCount>+3</AvatarGroupCount>`
 * alone already matches the surrounding group with no extra wiring.
 *
 * A real `<a>`, not a `<div>` — both the count and icon variants are
 * interactive placeholders (e.g. "+3" opening the full member list, an icon
 * adding a member), so the element type is future-proofed now rather than
 * swapped out later, matching AvatarIconBadge's own reasoning. Defaults to
 * `href="#"` since no destination exists yet; callers can override it once
 * one does. Picks up the same focus-visible ring AvatarIconBadge uses, for
 * the same reason: no interactive Avatar primitive should be keyboard-
 * focusable without one.
 *
 * Composes naturally with the *existing* AvatarGroup rather than
 * duplicating its behavior: carries the identical `data-slot="avatar-root"`
 * marker every Avatar's own wrapper uses, so it's picked up for free by
 * AvatarGroup's own overlap margin, hover-scale, and hover-z-index
 * selectors — no separate CSS needed here for any of those. Size and
 * radius reuse Avatar's own `sizeClasses`/`radiusClass()` so its diameter
 * and corner curve are pixel-identical to its sibling Avatars, and it
 * applies the same background-colored separation ring AvatarGroup applies
 * to real avatars (that selector only targets nested vendor
 * `[data-slot=avatar]` elements, which this isn't, so the ring is added
 * directly here instead). That outer ring is what creates the group's
 * overlap "cutout": it's a `ring` (box-shadow) tinted to match the page
 * background, not a `border` — later avatars paint over earlier ones in
 * normal DOM order, so the ring punches a background-colored gap into
 * whatever's underneath at each overlap point. It owns the group's
 * silhouette and must stay exactly as-is.
 *
 * Against that silhouette, `bg-muted` alone reads low-contrast — muted and
 * the page background sit one step apart on the same neutral scale, so the
 * circle doesn't visually separate itself from its surroundings the way a
 * photo or a saturated Fallback color does. Adding a second *outer* ring
 * for definition would compete with the cutout ring above (the same
 * "double frame" problem already hit and fixed for Gradient), so
 * definition comes from an *inset* ring instead — drawn just inside the
 * circle's own edge via Tailwind's `inset-ring-*` utilities, which
 * compose independently of `ring-*` rather than overriding it. Reuses the
 * same `--stroke-regular` width as every other ring in this file, and
 * `--border` for color — the semantic token that exists for exactly this
 * purpose, not a new color. Doesn't affect layout (a box-shadow, not a
 * real `border`), so it needs no per-size adjustment the way an actual
 * border would.
 *
 * Color otherwise uses `bg-muted`/`text-muted-foreground` (registered in
 * globals.css's `@theme inline`, so the plain Tailwind utilities resolve
 * correctly) — the existing neutral semantic pair, not a new color,
 * matching vendor's own choice for this exact "more avatars" indicator.
 * Text reuses `initialsTypographyClasses` for size/line-height/letter-
 * spacing only — a "+3" sits at the same type scale as AvatarFallback's own
 * initials — but overrides the weight to Regular rather than reusing
 * AvatarFallback's Bold: unlike AvatarFallback's initials (a name
 * abbreviation, read as text), "+3" reads as a count/label next to avatars
 * that are themselves the visual weight, so Regular keeps it from competing
 * with them. Safe to source the "-bold" variant's own font-size/line-height/
 * letter-spacing regardless (Foundations defines these identically across
 * weights at every size — only the weight token itself differs), rather
 * than needing a parallel "-regular" lookup table. An icon child is sized
 * via `[&>svg]:size-[1em]` rather than a second lookup table: at 1em it
 * automatically matches whatever font-size that same typography class
 * already set for the current `size`. */
function AvatarGroupCount({ className, href = '#', ...props }: AvatarGroupCountProps) {
  const { size, shape } = React.useContext(AvatarGroupContext);
  return (
    <a
      href={href}
      data-slot="avatar-root"
      className={cn(
        'relative flex shrink-0 items-center justify-center',
        sizeClasses[size],
        radiusClass(size, shape),
        'bg-muted text-muted-foreground',
        'ring-[length:var(--stroke-regular)] ring-[color:var(--background)]',
        'inset-ring-[length:var(--stroke-regular)] inset-ring-[color:var(--border)]',
        'font-[family-name:var(--font-family-body)] [font-weight:var(--font-weight-paragraph-regular)]',
        initialsTypographyClasses[size],
        'cursor-pointer focus-visible:outline-none focus-visible:shadow-[var(--effect-focus-ring-primary)]',
        '[&>svg]:size-[1em]',
        className
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarStatusBadge,
  AvatarIconBadge,
  AvatarGroup,
  AvatarGroupCount,
};
