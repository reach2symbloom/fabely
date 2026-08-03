import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { Plus, Pencil, Camera } from 'lucide-react';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarStatusBadge,
  AvatarIconBadge,
  AvatarGroup,
  AvatarGroupCount,
} from './avatar';
import type { AvatarSize, AvatarShape, AvatarStatus } from './avatar';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import { PrimitiveGalleryItem, PrimitivePage } from '../../../stories/PrimitivePage';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview is always the first page — description, a gallery composing the
 * canonical examples below (not duplicating them), usage guidance, a11y
 * notes, then an Args playground at the very bottom. Each example below
 * stays its own focused page. This is the reference implementation for the
 * pattern every future primitive/atom/molecule/organism should follow.
 */

const meta = {
  title: 'Design System/Primitives/Avatar',
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

/** AvatarImage with a src that fails to load — Base UI falls back to
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

const SIZE_OPTIONS: { value: AvatarSize; label: string }[] = SIZES.map(({ size, label }) => ({
  value: size,
  label,
}));

const SHAPE_OPTIONS: { value: AvatarShape; label: string }[] = [
  { value: 'round', label: 'Round' },
  { value: 'roundrect', label: 'Roundrect' },
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

/* ---------- Interactive playgrounds ----------
 * Rendered inline at the top of the Overview page (not as separate story
 * pages) so visitors can experiment with the full option set directly
 * alongside the live examples. State is plain component-local `useState`,
 * not Storybook args — these aren't independent stories, just interactive
 * UI within the Overview page itself. Split into two playgrounds (Single
 * Avatar, Avatar Group) rather than one combined one: the two are largely
 * independent composition modes, and combining them would bury the
 * controls that matter for a given task under ones that don't apply.
 * Ordered scales (Size, Shape, on/off) use the shared InlineSegmentedControl
 * story helper; unordered option sets stay as selects. */

const playgroundLabelClass = 'font-sans text-xs text-muted-foreground';
const playgroundControlClass =
  'mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm';

function PlaygroundField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={playgroundLabelClass}>{label}</span>
      {children}
    </label>
  );
}

const ICON_OPTIONS = {
  plus: { label: 'Plus', Icon: Plus, ariaLabel: 'Add' },
  pencil: { label: 'Pencil', Icon: Pencil, ariaLabel: 'Edit' },
  camera: { label: 'Camera', Icon: Camera, ariaLabel: 'Change photo' },
} as const;

type IconOption = keyof typeof ICON_OPTIONS;

/** Every option a single Avatar supports, in one place: Size, Shape,
 * Content (Image/Initials), Gradient, and Badge (None/Status/Icon).
 * Badge-specific controls (Status, Icon) only render once the matching
 * Badge is selected — an unrelated Status control while Badge=Icon (or
 * vice versa) would just be a dead control describing nothing on screen.
 * Gradient only applies to Round avatars (see the Gradient example page
 * for why); selecting Roundrect swaps the Gradient checkbox for a
 * LimitationNotice explaining the constraint, rather than leaving a
 * control visible that silently no-ops. */
function SingleAvatarPlayground() {
  const [size, setSize] = useState<AvatarSize>('regular');
  const [shape, setShape] = useState<AvatarShape>('round');
  const [content, setContent] = useState<'image' | 'initials'>('image');
  const [gradient, setGradient] = useState(false);
  const [badge, setBadge] = useState<'none' | 'status' | 'icon'>('none');
  const [status, setStatus] = useState<AvatarStatus>('online');
  const [icon, setIcon] = useState<IconOption>('plus');
  const { Icon, ariaLabel } = ICON_OPTIONS[icon];

  return (
    <PlaygroundPanel
      preview={
        <Avatar size={size} shape={shape} gradient={gradient}>
          {content === 'image' ? (
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          ) : null}
          <AvatarFallback>CN</AvatarFallback>
          {badge === 'status' ? <AvatarStatusBadge status={status} /> : null}
          {badge === 'icon' ? (
            <AvatarIconBadge aria-label={ariaLabel}>
              <Icon />
            </AvatarIconBadge>
          ) : null}
        </Avatar>
      }
      controls={
        <div className="grid w-full max-w-sm grid-cols-2 gap-4">
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Size"
              value={size}
              options={SIZE_OPTIONS}
              onChange={setSize}
              fullWidth
            />
          </div>

          <div className="col-span-2">
            <InlineSegmentedControl
              label="Shape"
              value={shape}
              options={SHAPE_OPTIONS}
              onChange={setShape}
              fullWidth
            />
          </div>

          <PlaygroundField label="Content">
            <select
              value={content}
              onChange={(e) => setContent(e.target.value as 'image' | 'initials')}
              className={playgroundControlClass}
            >
              <option value="image">Image</option>
              <option value="initials">Initials</option>
            </select>
          </PlaygroundField>

          <PlaygroundField label="Badge">
            <select
              value={badge}
              onChange={(e) => setBadge(e.target.value as 'none' | 'status' | 'icon')}
              className={playgroundControlClass}
            >
              <option value="none">None</option>
              <option value="status">Status</option>
              <option value="icon">Icon</option>
            </select>
          </PlaygroundField>

          {badge === 'status' ? (
            <PlaygroundField label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AvatarStatus)}
                className={playgroundControlClass}
              >
                {STATUSES.map(({ status: s, label }) => (
                  <option key={s} value={s}>
                    {label}
                  </option>
                ))}
              </select>
            </PlaygroundField>
          ) : null}

          {badge === 'icon' ? (
            <PlaygroundField label="Icon">
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value as IconOption)}
                className={playgroundControlClass}
              >
                {(Object.keys(ICON_OPTIONS) as IconOption[]).map((value) => (
                  <option key={value} value={value}>
                    {ICON_OPTIONS[value].label}
                  </option>
                ))}
              </select>
            </PlaygroundField>
          ) : null}

          {shape === 'round' ? (
            <div className="col-span-2">
              <InlineSegmentedControl
                label="Gradient"
                value={gradient ? 'on' : 'off'}
                options={[
                  { value: 'off', label: 'Off' },
                  { value: 'on', label: 'On' },
                ]}
                onChange={(v) => setGradient(v === 'on')}
                fullWidth
              />
            </div>
          ) : (
            <div className="col-span-2">
              <LimitationNotice>Gradient only applies to Round avatars.</LimitationNotice>
            </div>
          )}
        </div>
      }
    />
  );
}

const GROUP_PLAYGROUND_MEMBERS: { src?: string; alt: string; fallback: string }[] = [
  { src: 'https://github.com/shadcn.png', alt: '@shadcn', fallback: 'CN' },
  { src: 'https://github.com/maxleiter.png', alt: '@maxleiter', fallback: 'LR' },
  { src: 'https://github.com/evilrabbit.png', alt: '@evilrabbit', fallback: 'ER' },
  { alt: 'Jamie Diaz', fallback: 'JD' },
  { alt: 'Aiko Kimura', fallback: 'AK' },
  { alt: 'Theo Brandt', fallback: 'TB' },
];

/** AvatarGroup's own options only — Size, Number of Avatars, and
 * AvatarGroupCount (None/Text/Icon). Deliberately excludes shape, gradient,
 * and badges: groups are always Round, Gradient is a single-Avatar variant
 * (see the Single Avatar playground above and the Gradient example page),
 * and badges compose onto individual Avatars directly rather than through
 * AvatarGroup itself — see the Group With Badges example. */
const GROUP_COUNT_OPTIONS = ['1', '2', '3', '4', '5', '6'] as const;
type GroupCountOption = (typeof GROUP_COUNT_OPTIONS)[number];

function AvatarGroupPlayground() {
  const [size, setSize] = useState<AvatarSize>('regular');
  const [count, setCount] = useState<GroupCountOption>('3');
  const [groupCount, setGroupCount] = useState<'none' | 'text' | 'icon'>('text');
  const members = GROUP_PLAYGROUND_MEMBERS.slice(0, Number(count));

  return (
    <PlaygroundPanel
      preview={
        <AvatarGroup size={size}>
          {members.map((member) => (
            <Avatar key={member.alt} size={size}>
              {member.src ? <AvatarImage src={member.src} alt={member.alt} /> : null}
              <AvatarFallback>{member.fallback}</AvatarFallback>
            </Avatar>
          ))}
          {groupCount === 'text' ? <AvatarGroupCount>+3</AvatarGroupCount> : null}
          {groupCount === 'icon' ? (
            <AvatarGroupCount aria-label="Add">
              <Plus />
            </AvatarGroupCount>
          ) : null}
        </AvatarGroup>
      }
      controls={
        <div className="grid w-full max-w-sm grid-cols-2 gap-4">
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Size"
              value={size}
              options={SIZE_OPTIONS}
              onChange={setSize}
              fullWidth
            />
          </div>

          <div className="col-span-2">
            <InlineSegmentedControl
              label="Number of Avatars"
              value={count}
              options={GROUP_COUNT_OPTIONS}
              onChange={setCount}
              fullWidth
            />
          </div>

          <div className="col-span-2">
            <PlaygroundField label="AvatarGroupCount">
              <select
                value={groupCount}
                onChange={(e) => setGroupCount(e.target.value as 'none' | 'text' | 'icon')}
                className={playgroundControlClass}
              >
                <option value="none">None</option>
                <option value="text">Text</option>
                <option value="icon">Icon</option>
              </select>
            </PlaygroundField>
          </div>
        </div>
      }
    />
  );
}

/* ---------- Overview ---------- */

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Avatar"
      description={
        <>
          Represents a user or entity with an image, falling back to initials (or any short
          content) when no image is set or the image fails to load. This primitive wraps the
          upstream shadcn/Base UI Avatar primitive with Fabely&apos;s size and shape variants,
          Status and Icon badges, AvatarGroup, and AvatarGroupCount — see the primitive&apos;s{' '}
          <code>README.md</code> for what&apos;s intentionally not yet included (presence beyond a
          static status dot, image-specific variants, notification counts).
        </>
      }
      playground={
        <div className="space-y-8">
          <div>
            <p className="mb-3 font-sans text-sm font-medium text-foreground">Single Avatar</p>
            <SingleAvatarPlayground />
          </div>
          <div>
            <p className="mb-3 font-sans text-sm font-medium text-foreground">Avatar Group</p>
            <AvatarGroupPlayground />
          </div>
        </div>
      }
      examples={
        <div className="flex flex-wrap gap-4">
          <PrimitiveGalleryItem label="Default">
            <DefaultExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="With Image">
            <WithImageExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Fallback">
            <FallbackExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Several Fallback Initials">
            <SeveralFallbackInitialsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Sizes">
            <SizesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Shapes">
            <ShapesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Status Badge">
            <StatusBadgeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Icon Badge">
            <IconBadgeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Group">
            <GroupExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Group With Badges">
            <GroupWithBadgesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Group With Count">
            <GroupWithCountExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Group With Count Icon">
            <GroupWithCountIconExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Gradient">
            <GradientExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
          <li>
            Always pair Avatar with AvatarFallback, so there&apos;s something to render even before
            an image loads or if it never resolves.
          </li>
          <li>
            Provide a real src and meaningful alt text on AvatarImage — don&apos;t rely on the
            fallback as the default state.
          </li>
          <li>
            Use the <code>size</code> prop (Extra Tiny → Extra Large) and <code>shape</code> prop
            (Round / Roundrect) rather than overriding dimensions or radius via{' '}
            <code>className</code> — both are sourced from Foundation tokens.
          </li>
          <li>
            AvatarStatusBadge and AvatarIconBadge both size themselves off the parent Avatar&apos;s{' '}
            <code>size</code> automatically — no size prop needed on the badge itself.
          </li>
          <li>
            AvatarIconBadge renders a real button (not yet wired to any action); pass an accessible{' '}
            <code>aria-label</code> since its content is icon-only.
          </li>
          <li>
            AvatarGroup&apos;s own <code>size</code>/<code>shape</code> props control overlap
            amount and AvatarGroupCount&apos;s matching only — neither is linked to the group&apos;s
            actual Avatar children automatically, so set them consistently at the call site.
          </li>
          <li>
            AvatarGroupCount needs no <code>size</code>/<code>shape</code> of its own — it reads
            both from the surrounding AvatarGroup and already matches its sibling Avatars&apos;
            diameter, radius, and separation ring. Give it text (&quot;+3&quot;) for an overflow
            count, or an icon for an action avatar — same component either way.
          </li>
          <li>
            The <code>gradient</code> prop is a single boolean on Avatar itself — it works the same
            whether the content is AvatarImage or AvatarFallback, no separate prop needed on either.
          </li>
          <li>
            <strong>
              Gradient is currently supported for Round avatars only, matching the authored Figma
              design. When used with Roundrect, the avatar renders without the gradient treatment.
            </strong>{' '}
            This is a deliberate scope limit (see the Gradient example page), not a bug.
          </li>
          <li>
            Keep call sites to composing Avatar/AvatarImage/AvatarFallback/badges/AvatarGroup
            as-is; propose extending the primitive itself rather than reimplementing behavior at the
            call site.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
          <li>
            AvatarImage&apos;s <code>alt</code> should identify who or what the avatar represents —
            screen readers announce it when the image is present.
          </li>
          <li>
            Base UI automatically swaps to AvatarFallback when the image fails or has no src, so
            users are never left with a broken image icon.
          </li>
          <li>
            Initials alone (e.g. &quot;CN&quot;) aren&apos;t a substitute for an accessible name
            where one is needed elsewhere in the surrounding UI (e.g. next to the user&apos;s full
            name).
          </li>
        </ul>
      }
    />
  ),
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
