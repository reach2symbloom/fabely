import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { useArgs } from 'storybook/preview-api';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarStatusBadge,
  AvatarIconBadge,
  AvatarGroup,
  AvatarGroupCount,
} from './avatar';
import type { AvatarSize, AvatarStatus } from './avatar';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview is always the first page — description, a gallery composing the
 * canonical examples below (not duplicating them), usage guidance, a11y
 * notes, then an Args playground at the very bottom. Each example below
 * stays its own focused page. This is the reference implementation for the
 * pattern every future atom/molecule/organism should follow.
 */

const meta = {
  title: 'Design System/Atoms/Avatar',
  component: Avatar,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------- Canonical examples ----------
 * Each is a plain component so the Overview gallery and the individual
 * story page render the exact same implementation — composed, not
 * duplicated. */

/** Canonical usage: Avatar always paired with a fallback so it renders
 * something even before an image is provided or if one is never set. A
 * bare `<Avatar />` with no children is a valid but degenerate primitive
 * state (nothing to display, so nothing renders) — not what consumers
 * should copy as the recommended pattern. */
function DefaultExample() {
  return (
    <Avatar>
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

/** The common case: an image that loads successfully. */
function WithImageExample() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

/** AvatarImage with a src that fails to load — Radix falls back to
 * AvatarFallback's children automatically. */
function FallbackExample() {
  return (
    <Avatar>
      <AvatarImage src="https://broken-image-url.invalid/nope.png" alt="" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

/** Several fallback initials side by side, demonstrating the fallback
 * pattern isn't tied to any one set of initials. */
function SeveralFallbackInitialsExample() {
  return (
    <div className="flex gap-3">
      <Avatar>
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>XY</AvatarFallback>
      </Avatar>
    </div>
  );
}

const SIZES: { size: AvatarSize; label: string }[] = [
  { size: 'extraTiny', label: 'Extra Tiny' },
  { size: 'tiny', label: 'Tiny' },
  { size: 'small', label: 'Small' },
  { size: 'regular', label: 'Regular' },
  { size: 'large', label: 'Large' },
  { size: 'extraLarge', label: 'Extra Large' },
];

/** The full size scale, Extra Tiny through Extra Large, each with its own
 * typography sourced from the matching Foundation Typography Style. */
function SizesExample() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {SIZES.map(({ size, label }) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar size={size}>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="font-sans text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

/** Round vs. Rounded Rectangle — border radius sourced entirely from
 * Foundation radius tokens (--rounded-full / --rounded-sm / --rounded-md /
 * --radius / --rounded-lg, depending on size). */
function ShapesExample() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Avatar size="large" shape="round">
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="font-sans text-xs text-muted-foreground">Round</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="large" shape="roundrect">
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="font-sans text-xs text-muted-foreground">Roundrect</span>
      </div>
    </div>
  );
}

const STATUSES: { status: AvatarStatus; label: string }[] = [
  { status: 'online', label: 'Online' },
  { status: 'away', label: 'Away' },
  { status: 'busy', label: 'Busy' },
  { status: 'offline', label: 'Offline' },
];

/** A non-interactive presence dot — online/away/busy/offline — colored
 * from Foundations (Busy uses --destructive; Online/Away use the raw
 * success/alert "main" swatch since no promoted semantic token exists yet
 * for them — see avatar.tsx's statusColorClasses for the full audit).
 * Generous gap/padding throughout: the badge now renders fully outside the
 * avatar's own clipped edge (see avatar.tsx's isAvatarBadge/Avatar comment),
 * so neighboring items need enough room that it never overlaps the next
 * avatar or its label. */
function StatusBadgeExample() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="mb-4 font-sans text-xs text-muted-foreground">By status</p>
        <div className="flex flex-wrap items-end gap-8">
          {STATUSES.map(({ status, label }) => (
            <div key={status} className="flex flex-col items-center gap-3">
              <Avatar size="regular">
                <AvatarFallback>CN</AvatarFallback>
                <AvatarStatusBadge status={status} />
              </Avatar>
              <span className="font-sans text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-4 font-sans text-xs text-muted-foreground">
          By size (Online) — badge diameter is a fixed 28% of the avatar's own size, so it scales
          proportionally at every size
        </p>
        <div className="flex flex-wrap items-end gap-8">
          {SIZES.map(({ size, label }) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <Avatar size={size}>
                <AvatarFallback>CN</AvatarFallback>
                <AvatarStatusBadge status="online" />
              </Avatar>
              <span className="font-sans text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** An icon rendered as badge children, matching the shadcn reference. The
 * badge is a real <button> (not a <span>) so the API is ready for a future
 * menu/click behavior without an element-type change later — no click
 * handler is wired up yet. Shown across every Avatar size to demonstrate
 * the badge (and its icon) scaling proportionally — no size prop on the
 * badge itself, it reads `size` from the parent Avatar automatically. */
function IconBadgeExample() {
  return (
    <div className="flex flex-wrap items-end gap-8">
      {SIZES.map(({ size, label }) => (
        <div key={size} className="flex flex-col items-center gap-3">
          <Avatar size={size}>
            <AvatarFallback>CN</AvatarFallback>
            <AvatarIconBadge aria-label="Add">
              <Plus />
            </AvatarIconBadge>
          </Avatar>
          <span className="font-sans text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

const GROUP_MEMBERS = [
  { src: 'https://github.com/shadcn.png', alt: '@shadcn', fallback: 'CN' },
  { src: 'https://github.com/maxleiter.png', alt: '@maxleiter', fallback: 'LR' },
  { src: 'https://github.com/evilrabbit.png', alt: '@evilrabbit', fallback: 'ER' },
];

/** A subtly overlapping stack, shown across every Avatar size. Overlap
 * scales with AvatarGroup's own `size` prop (kept in sync with the
 * children's `size` here, as the two aren't linked automatically — see
 * avatar.tsx's groupOverlapClasses). Hover any avatar to see it gently
 * scale and come to the front without disturbing its neighbors. */
function GroupExample() {
  return (
    <div className="flex flex-col gap-8">
      {SIZES.map(({ size, label }) => (
        <div key={size} className="flex flex-col items-start gap-3">
          <span className="font-sans text-xs text-muted-foreground">{label}</span>
          <AvatarGroup size={size}>
            {GROUP_MEMBERS.map((member) => (
              <Avatar key={member.alt} size={size}>
                <AvatarImage src={member.src} alt={member.alt} />
                <AvatarFallback>{member.fallback}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      ))}
    </div>
  );
}

/** Badges (both Status and Icon) continue to render correctly inside a
 * group — unclipped, correctly positioned, and scaling together with their
 * avatar on hover, since the badge lives inside the same outer wrapper
 * AvatarGroup targets for overlap/hover. */
function GroupWithBadgesExample() {
  return (
    <AvatarGroup size="large">
      <Avatar size="large">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarStatusBadge status="online" />
      </Avatar>
      <Avatar size="large">
        <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
        <AvatarFallback>LR</AvatarFallback>
        <AvatarStatusBadge status="away" />
      </Avatar>
      <Avatar size="large">
        <AvatarFallback>ER</AvatarFallback>
        <AvatarIconBadge aria-label="Add">
          <Plus />
        </AvatarIconBadge>
      </Avatar>
    </AvatarGroup>
  );
}

/** AvatarGroupCount as an overflow indicator — text children ("+3") —
 * shown across every Avatar size. No size/shape prop set on it directly:
 * it reads both from the surrounding AvatarGroup automatically, so its
 * diameter, radius, and rings (including the inset ring that gives it
 * definition against the page background) match its sibling Avatars at
 * every size. It also joins the same overlap/hover treatment as any other
 * avatar in the group, since it carries the same `data-slot="avatar-root"`
 * marker AvatarGroup already targets. */
function GroupWithCountExample() {
  return (
    <div className="flex flex-col gap-8">
      {SIZES.map(({ size, label }) => (
        <div key={size} className="flex flex-col items-start gap-3">
          <span className="font-sans text-xs text-muted-foreground">{label}</span>
          <AvatarGroup size={size}>
            {GROUP_MEMBERS.map((member) => (
              <Avatar key={member.alt} size={size}>
                <AvatarImage src={member.src} alt={member.alt} />
                <AvatarFallback>{member.fallback}</AvatarFallback>
              </Avatar>
            ))}
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
        </div>
      ))}
    </div>
  );
}

/** AvatarGroupCount as an "action avatar" — an icon passed as children
 * instead of text — shown across every Avatar size. The icon sizes itself
 * to 1em, so it automatically matches whatever type scale AvatarGroupCount
 * resolved for the current `size`, no separate icon-size lookup needed. */
function GroupWithCountIconExample() {
  return (
    <div className="flex flex-col gap-8">
      {SIZES.map(({ size, label }) => (
        <div key={size} className="flex flex-col items-start gap-3">
          <span className="font-sans text-xs text-muted-foreground">{label}</span>
          <AvatarGroup size={size}>
            {GROUP_MEMBERS.map((member) => (
              <Avatar key={member.alt} size={size}>
                <AvatarImage src={member.src} alt={member.alt} />
                <AvatarFallback>{member.fallback}</AvatarFallback>
              </Avatar>
            ))}
            <AvatarGroupCount>
              <Plus />
            </AvatarGroupCount>
          </AvatarGroup>
        </div>
      ))}
    </div>
  );
}

/** A visually distinct callout for documenting deliberate scope limits —
 * so a limitation reads as "known and intentional" rather than looking
 * like an unfinished implementation to someone browsing Storybook. */
function LimitationNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
      <span aria-hidden="true">⚠️</span>
      <span>{children}</span>
    </div>
  );
}

/** The Gradient variant — a single `gradient` prop on Avatar itself (not a
 * separate prop on AvatarImage/AvatarFallback), since the ring + glow
 * treatment lives on the avatar's own outer frame in Figma, not the
 * content inside it — so one prop already produces the correct result for
 * both content types. Figma only authored Gradient for the Round shape —
 * combined with `shape="roundrect"`, `gradient` is a no-op by design (see
 * avatar.tsx's gradientClasses comment for why: the glow's fixed-color
 * ring only visually matches the gradient border at one end, which reads
 * as a second outline on straight edges — Round's curve is what hides
 * this, which is almost certainly why Figma never authored that
 * combination). */
function GradientExample() {
  return (
    <div className="flex flex-col gap-8">
      <LimitationNotice>
        Gradient is currently supported for Round avatars only, matching the authored Figma
        design. When used with Roundrect, the avatar renders without the gradient treatment.
      </LimitationNotice>
      <div>
        <p className="mb-4 font-sans text-xs text-muted-foreground">With AvatarImage</p>
        <div className="flex flex-wrap items-end gap-8">
          {SIZES.map(({ size, label }) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <Avatar size={size} gradient>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="font-sans text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-4 font-sans text-xs text-muted-foreground">With AvatarFallback</p>
        <div className="flex flex-wrap items-end gap-8">
          {SIZES.map(({ size, label }) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <Avatar size={size} gradient>
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="font-sans text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-4 font-sans text-xs text-muted-foreground">
          Round and Roundrect, both with <code>gradient</code> set — Roundrect renders as a
          plain avatar (no border/glow) since Gradient is scoped to Round only
        </p>
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <Avatar size="large" shape="round" gradient>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="font-sans text-xs text-muted-foreground">Round</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Avatar size="large" shape="roundrect" gradient>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="font-sans text-xs text-muted-foreground">Roundrect (no-op)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Overview page chrome ---------- */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h3 className="font-sans text-sm font-medium text-foreground mb-3">{title}</h3>
      {children}
    </section>
  );
}

function GalleryItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-border p-6">
      {children}
      <span className="font-sans text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

type PlaygroundArgs = { imageSrc: string; fallbackText: string };

function AvatarPlayground({ imageSrc, fallbackText }: PlaygroundArgs) {
  return (
    <Avatar>
      {imageSrc ? <AvatarImage src={imageSrc} alt={fallbackText} /> : null}
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  );
}

/* ---------- Overview ---------- */

export const Overview: StoryObj<Meta<PlaygroundArgs>> = {
  argTypes: {
    imageSrc: { control: 'text' },
    fallbackText: { control: 'text' },
  },
  args: {
    imageSrc: 'https://github.com/shadcn.png',
    fallbackText: 'CN',
  },
  render: () => {
    const [args, updateArgs] = useArgs<PlaygroundArgs>();

    return (
      <div className="w-[640px] max-w-full font-sans">
        <p className="text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Avatar</strong> represents a user or entity with an
          image, falling back to initials (or any short content) when no image is set or the
          image fails to load. This atom wraps the upstream shadcn/Radix Avatar primitive with
          Fabely's size and shape variants, Status and Icon badges, and AvatarGroup — see the
          atom's <code>README.md</code> for what's intentionally not yet included (presence
          beyond a static status dot, image-specific variants, notification counts, overflow
          ("+N") indicators).
        </p>

        <Section title="Examples">
          <div className="flex flex-wrap gap-4">
            <GalleryItem label="Default">
              <DefaultExample />
            </GalleryItem>
            <GalleryItem label="With Image">
              <WithImageExample />
            </GalleryItem>
            <GalleryItem label="Fallback">
              <FallbackExample />
            </GalleryItem>
            <GalleryItem label="Several Fallback Initials">
              <SeveralFallbackInitialsExample />
            </GalleryItem>
            <GalleryItem label="Sizes">
              <SizesExample />
            </GalleryItem>
            <GalleryItem label="Shapes">
              <ShapesExample />
            </GalleryItem>
            <GalleryItem label="Status Badge">
              <StatusBadgeExample />
            </GalleryItem>
            <GalleryItem label="Icon Badge">
              <IconBadgeExample />
            </GalleryItem>
            <GalleryItem label="Group">
              <GroupExample />
            </GalleryItem>
            <GalleryItem label="Group With Badges">
              <GroupWithBadgesExample />
            </GalleryItem>
            <GalleryItem label="Group With Count">
              <GroupWithCountExample />
            </GalleryItem>
            <GalleryItem label="Group With Count Icon">
              <GroupWithCountIconExample />
            </GalleryItem>
            <GalleryItem label="Gradient">
              <GradientExample />
            </GalleryItem>
          </div>
        </Section>

        <Section title="Usage guidance">
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
            <li>Always pair Avatar with AvatarFallback, so there's something to render even before an image loads or if it never resolves.</li>
            <li>Provide a real src and meaningful alt text on AvatarImage — don't rely on the fallback as the default state.</li>
            <li>Use the <code>size</code> prop (Extra Tiny → Extra Large) and <code>shape</code> prop (Round / Roundrect) rather than overriding dimensions or radius via <code>className</code> — both are sourced from Foundation tokens.</li>
            <li>AvatarStatusBadge and AvatarIconBadge both size themselves off the parent Avatar's <code>size</code> automatically — no size prop needed on the badge itself.</li>
            <li>AvatarIconBadge renders a real button (not yet wired to any action); pass an accessible <code>aria-label</code> since its content is icon-only.</li>
            <li>AvatarGroup's own <code>size</code>/<code>shape</code> props control overlap amount and AvatarGroupCount's matching only — neither is linked to the group's actual Avatar children automatically, so set them consistently at the call site.</li>
            <li>AvatarGroupCount needs no <code>size</code>/<code>shape</code> of its own — it reads both from the surrounding AvatarGroup and already matches its sibling Avatars' diameter, radius, and separation ring. Give it text ("+3") for an overflow count, or an icon for an action avatar — same component either way.</li>
            <li>The <code>gradient</code> prop is a single boolean on Avatar itself — it works the same whether the content is AvatarImage or AvatarFallback, no separate prop needed on either.</li>
            <li><strong>Gradient is currently supported for Round avatars only, matching the authored Figma design. When used with Roundrect, the avatar renders without the gradient treatment.</strong> This is a deliberate scope limit (see the Gradient example page), not a bug.</li>
            <li>Keep call sites to composing Avatar/AvatarImage/AvatarFallback/badges/AvatarGroup as-is; propose extending the atom itself rather than reimplementing behavior at the call site.</li>
          </ul>
        </Section>

        <Section title="Accessibility">
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
            <li>AvatarImage's <code>alt</code> should identify who or what the avatar represents — screen readers announce it when the image is present.</li>
            <li>Radix automatically swaps to AvatarFallback when the image fails or has no src, so users are never left with a broken image icon.</li>
            <li>Initials alone (e.g. "CN") aren't a substitute for an accessible name where one is needed elsewhere in the surrounding UI (e.g. next to the user's full name).</li>
          </ul>
        </Section>

        <Section title="Playground">
          <div className="flex flex-col items-center gap-6 rounded-lg border border-border p-8">
            <AvatarPlayground imageSrc={args.imageSrc ?? ''} fallbackText={args.fallbackText ?? ''} />
            <div className="w-full max-w-sm space-y-3">
              <label className="block">
                <span className="font-sans text-xs text-muted-foreground">Image src (clear it, or break it, to see the fallback)</span>
                <input
                  type="text"
                  value={args.imageSrc ?? ''}
                  onChange={(e) => updateArgs({ imageSrc: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="font-sans text-xs text-muted-foreground">Fallback text</span>
                <input
                  type="text"
                  value={args.fallbackText ?? ''}
                  onChange={(e) => updateArgs({ fallbackText: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                />
              </label>
            </div>
          </div>
        </Section>
      </div>
    );
  },
};

/* ---------- Individual example pages ---------- */

export const Default: Story = {
  render: () => <DefaultExample />,
};

export const WithImage: Story = {
  render: () => <WithImageExample />,
};

export const Fallback: Story = {
  render: () => <FallbackExample />,
};

export const SeveralFallbackInitials: Story = {
  render: () => <SeveralFallbackInitialsExample />,
};

export const Sizes: Story = {
  render: () => <SizesExample />,
};

export const Shapes: Story = {
  render: () => <ShapesExample />,
};

export const StatusBadge: Story = {
  render: () => <StatusBadgeExample />,
};

export const IconBadge: Story = {
  render: () => <IconBadgeExample />,
};

export const Group: Story = {
  render: () => <GroupExample />,
};

export const GroupWithBadges: Story = {
  render: () => <GroupWithBadgesExample />,
};

export const GroupWithCount: Story = {
  render: () => <GroupWithCountExample />,
};

export const GroupWithCountIcon: Story = {
  render: () => <GroupWithCountIconExample />,
};

export const Gradient: Story = {
  render: () => <GradientExample />,
};
