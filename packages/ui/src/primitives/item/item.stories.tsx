import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  HomeIcon,
  InboxIcon,
  PlusIcon,
} from 'lucide-react';
import { CheckCircle, ShieldWarning } from '@solar-icons/react';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { Avatar, AvatarFallback, AvatarGroup } from '../avatar';
import { Button, IconButton } from '../button';
import { DirectionProvider } from '../direction';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from './item';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. Figma Item + shadcn Item guide.
 */

type ItemVariant = 'default' | 'outline' | 'muted';
type ItemSize = 'default' | 'sm' | 'xs';
type ItemMediaKind = 'icon' | 'avatar' | 'avatars' | 'image' | 'none';
/** Right-slot suggestions — open content in `ItemActions`. */
type ItemActionsKind =
  | 'button'
  | 'icon-plus'
  | 'chevron'
  | 'two'
  | 'none';

const meta = {
  title: 'Design System/Primitives/Item',
  component: Item,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function playgroundOutcome({
  variant,
  size,
  media,
  actions,
}: {
  variant: ItemVariant;
  size: ItemSize;
  media: ItemMediaKind;
  actions: ItemActionsKind;
}): string {
  const variantBit =
    variant === 'default'
      ? 'transparent'
      : variant === 'outline'
        ? 'outlined'
        : size === 'default'
          ? 'muted'
          : 'secondary-fill';
  const sizeBit =
    size === 'default' ? '' : size === 'sm' ? ' compact' : ' extra-compact';
  const mediaBit =
    media === 'none'
      ? ''
      : media === 'icon'
        ? ' with a decorative icon'
        : media === 'avatar'
          ? ' with an avatar'
          : media === 'avatars'
            ? ' with an avatar stack'
            : ' with a cover image';
  const actionsBit =
    actions === 'none'
      ? ' and no trailing action'
      : actions === 'icon-plus'
        ? ' and a tertiary plus Icon Button'
        : actions === 'chevron'
          ? ' and a chevron affordance'
          : actions === 'two'
            ? ' and two action buttons'
            : ' and a text action';
  return `A ${variantBit}${sizeBit} content row${mediaBit}${actionsBit}.`;
}

function ItemActionsSlot({ kind }: { kind: ItemActionsKind }) {
  if (kind === 'none') return null;
  if (kind === 'icon-plus') {
    return (
      <ItemActions>
        <IconButton variant="tertiary" size="sm" aria-label="Add">
          <PlusIcon />
        </IconButton>
      </ItemActions>
    );
  }
  if (kind === 'chevron') {
    return (
      <ItemActions>
        <ChevronRightIcon
          aria-hidden
          className="size-[length:var(--icon-sm)] text-[color:var(--muted-foreground)]"
        />
      </ItemActions>
    );
  }
  if (kind === 'two') {
    return (
      <ItemActions>
        <Button size="small" variant="ghost">
          Cancel
        </Button>
        <Button size="small" variant="outline">
          Confirm
        </Button>
      </ItemActions>
    );
  }
  return (
    <ItemActions>
      <Button size="small" variant="outline">
        Action
      </Button>
    </ItemActions>
  );
}

function TeamAvatars() {
  return (
    <AvatarGroup size="regular">
      <Avatar>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>LR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  );
}

function DemoItem({
  variant = 'default',
  size = 'default',
  media = 'icon',
  actions = 'button',
  title = 'Your profile has been verified.',
  description = 'You can now access all features.',
}: {
  variant?: ItemVariant;
  size?: ItemSize;
  media?: ItemMediaKind;
  actions?: ItemActionsKind;
  title?: string;
  description?: string;
}) {
  return (
    <Item variant={variant} size={size} className="max-w-md">
      {media === 'icon' ? (
        <ItemMedia variant="icon">
          <CheckCircle weight="BoldDuotone" color="currentColor" />
        </ItemMedia>
      ) : null}
      {media === 'avatar' ? (
        <ItemMedia>
          <Avatar size="regular">
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </ItemMedia>
      ) : null}
      {media === 'avatars' ? (
        <ItemMedia>
          <TeamAvatars />
        </ItemMedia>
      ) : null}
      {media === 'image' ? (
        <ItemMedia variant="image">
          <img
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=160&h=160&fit=crop"
            alt=""
          />
        </ItemMedia>
      ) : null}
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
      <ItemActionsSlot kind={actions} />
    </Item>
  );
}

function ItemPlayground() {
  const [variant, setVariant] = useState<ItemVariant>('outline');
  const [size, setSize] = useState<ItemSize>('default');
  const [media, setMedia] = useState<ItemMediaKind>('icon');
  const [actions, setActions] = useState<ItemActionsKind>('button');

  const outcome = playgroundOutcome({ variant, size, media, actions });

  return (
    <PlaygroundPanel
      preview={
        <div className="flex w-full max-w-md flex-col items-stretch gap-[var(--spacing-sm)]">
          <DemoItem
            variant={variant}
            size={size}
            media={media}
            actions={actions}
          />
          <p className="text-start font-[family-name:var(--font-family-body)] text-[length:var(--text-paragraph-mini-regular-font-size)] leading-[var(--text-paragraph-mini-regular-line-height)] text-[color:var(--muted-foreground)]">
            {outcome}
          </p>
        </div>
      }
      previewAlign="stretch"
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Variant"
            value={variant}
            onChange={(v) => setVariant(v as ItemVariant)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'outline', label: 'Outline' },
              { value: 'muted', label: 'Muted' },
            ]}
          />
          <InlineSegmentedControl
            label="Size"
            value={size}
            onChange={(v) => setSize(v as ItemSize)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'sm', label: 'Small' },
              { value: 'xs', label: 'XS' },
            ]}
          />
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Media"
              value={media}
              onChange={(v) => setMedia(v as ItemMediaKind)}
              options={[
                { value: 'icon', label: 'Icon' },
                { value: 'avatar', label: 'Avatar' },
                { value: 'avatars', label: 'Avatars' },
                { value: 'image', label: 'Image' },
                { value: 'none', label: 'None' },
              ]}
            />
          </div>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Actions"
              value={actions}
              onChange={(v) => setActions(v as ItemActionsKind)}
              options={[
                { value: 'button', label: 'Button' },
                { value: 'icon-plus', label: 'Plus' },
                { value: 'chevron', label: 'Chevron' },
                { value: 'two', label: 'Two' },
                { value: 'none', label: 'None' },
              ]}
            />
          </div>
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Item"
      description="Content row with media, title, description, and actions — Foundations chrome from Figma Item; shadcn composition API."
      playground={<ItemPlayground />}
      variants={
        <div className="flex w-full max-w-lg flex-col gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Basic" fill>
            <DemoItem
              variant="outline"
              title="Your profile has been verified."
              description="You can now access all features."
            />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Muted · plus" fill>
            <DemoItem
              variant="muted"
              actions="icon-plus"
              title="Inbox zero"
              description="You’re all caught up for today."
            />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Two actions" fill>
            <DemoItem
              variant="outline"
              actions="two"
              title="Apply changes?"
              description="Confirm or dismiss this update."
            />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="No action" fill>
            <DemoItem
              variant="outline"
              actions="none"
              title="Read-only detail"
              description="Content only — omit ItemActions."
            />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Small" fill>
            <DemoItem size="sm" variant="outline" actions="chevron" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Avatar stack" fill>
            <Item variant="outline" className="max-w-md">
              <ItemMedia>
                <TeamAvatars />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>No Team Members</ItemTitle>
                <ItemDescription>
                  Invite your team to collaborate on this project.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button size="small" variant="outline">
                  Invite
                </Button>
              </ItemActions>
            </Item>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Link · chevron" fill>
            <Item
              variant="outline"
              render={<a href="#dashboard" />}
              className="max-w-md"
            >
              <ItemMedia variant="icon">
                <HomeIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Dashboard</ItemTitle>
                <ItemDescription>
                  Overview of your account and activity.
                </ItemDescription>
              </ItemContent>
              <ItemActionsSlot kind="chevron" />
            </Item>
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Use <code>Item</code> for display rows (title, description, actions).
            Prefer <code>Field</code> when the row hosts a form control.
          </li>
          <li>
            Distinct from <code>ListItem</code> (menu leaf). Item is the
            bordered / muted card-style row from Figma Item.
          </li>
          <li>
            Left slot (<code>ItemMedia</code>): icon, image, <code>Avatar</code>,
            or <code>AvatarGroup</code>.
          </li>
          <li>
            Right slot (<code>ItemActions</code>): omit for no action; or put a
            text button, tertiary plus <code>IconButton</code>, chevron
            affordance, or two buttons.
          </li>
          <li>
            Link rows with <code>{'render={<a href=… />}'}</code> — hover fill
            uses <code>--secondary</code>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>ItemGroup</code> sets <code>role=&quot;list&quot;</code>. Put
            interactive controls in <code>ItemActions</code>, not on the whole
            row, unless the Item is itself a link via <code>render</code>.
          </li>
          <li>
            Decorative icons should be aria-hidden (Lucide defaults). Images need
            meaningful <code>alt</code> when they convey content.
          </li>
          <li>
            Focus-visible ring uses Foundations{' '}
            <code>--effect-focus-ring-secondary</code>.
          </li>
        </ul>
      }
    />
  ),
};

export const Variant: Story = {
  name: 'Variant',
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-[var(--spacing-md)]">
      <DemoItem
        variant="default"
        title="Default"
        description="Transparent background with no border."
      />
      <DemoItem
        variant="outline"
        title="Outline"
        description="Outlined style with a visible border."
      />
      <DemoItem
        variant="muted"
        title="Muted"
        description="Muted background for secondary content."
      />
    </div>
  ),
};

export const Size: Story = {
  name: 'Size',
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-[var(--spacing-md)]">
      <DemoItem
        size="default"
        variant="outline"
        title="Default size"
        description="The standard size for most use cases."
      />
      <DemoItem
        size="sm"
        variant="outline"
        title="Small size"
        description="A compact size for dense layouts."
      />
      <DemoItem
        size="xs"
        variant="outline"
        title="Extra small"
        description="shadcn-only denser size (not in Figma)."
      />
    </div>
  ),
};

export const Icon: Story = {
  render: () => (
    <Item variant="outline" className="max-w-md">
      <ItemMedia variant="icon">
        <ShieldWarning weight="BoldDuotone" color="currentColor" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Security Alert</ItemTitle>
        <ItemDescription>
          New login detected from unknown device.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="small" variant="outline">
          Review
        </Button>
      </ItemActions>
    </Item>
  ),
};

export const AvatarStory: Story = {
  name: 'Avatar',
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-[var(--spacing-md)]">
      <Item variant="outline">
        <ItemMedia>
          <Avatar size="regular">
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Evil Rabbit</ItemTitle>
          <ItemDescription>Last seen 5 months ago</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia>
          <TeamAvatars />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>No Team Members</ItemTitle>
          <ItemDescription>
            Invite your team to collaborate on this project.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="small" variant="outline">
            Invite
          </Button>
        </ItemActions>
      </Item>
    </div>
  ),
};

export const Image: Story = {
  render: () => (
    <ItemGroup className="max-w-md">
      {[
        {
          title: 'Midnight City Lights',
          description: 'Electric Nights',
          meta: '3:45',
          src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=160&h=160&fit=crop',
        },
        {
          title: 'Coffee Shop Conversations',
          description: 'Urban Stories',
          meta: '4:05',
          src: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=160&h=160&fit=crop',
        },
        {
          title: 'Digital Rain',
          description: 'Binary Beats',
          meta: '3:30',
          src: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=160&h=160&fit=crop',
        },
      ].map((track) => (
        <Item key={track.title} variant="outline" size="sm">
          <ItemMedia variant="image">
            <img src={track.src} alt="" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{track.title}</ItemTitle>
            <ItemDescription>
              {track.description} · {track.meta}
            </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  ),
};

export const Group: Story = {
  render: () => (
    <ItemGroup className="max-w-md">
      {[
        { initials: 's', name: 'shadcn', email: 'shadcn@vercel.com' },
        { initials: 'm', name: 'maxleiter', email: 'maxleiter@vercel.com' },
        { initials: 'e', name: 'evilrabbit', email: 'evilrabbit@vercel.com' },
      ].map((person, i) => (
        <div key={person.email}>
          {i > 0 ? <ItemSeparator /> : null}
          <Item>
            <ItemMedia>
              <Avatar size="regular">
                <AvatarFallback>{person.initials}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{person.name}</ItemTitle>
              <ItemDescription>{person.email}</ItemDescription>
            </ItemContent>
          </Item>
        </div>
      ))}
    </ItemGroup>
  ),
};

export const Header: Story = {
  render: () => (
    <div className="grid w-full max-w-2xl gap-[var(--spacing-md)] sm:grid-cols-3">
      {[
        {
          title: 'v0-1.5-sm',
          description: 'Everyday tasks and UI generation.',
          src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=480&h=320&fit=crop',
        },
        {
          title: 'v0-1.5-lg',
          description: 'Advanced thinking or reasoning.',
          src: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=480&h=320&fit=crop',
        },
        {
          title: 'v0-2.0-mini',
          description: 'Open Source model for everyone.',
          src: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=480&h=320&fit=crop',
        },
      ].map((card) => (
        <Item key={card.title} variant="outline" className="flex-col items-stretch">
          <ItemHeader>
            <img
              src={card.src}
              alt=""
              className="aspect-video w-full rounded-[length:var(--rounded-md)] object-cover"
            />
          </ItemHeader>
          <ItemContent>
            <ItemTitle>{card.title}</ItemTitle>
            <ItemDescription>{card.description}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  ),
};

export const Link: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-[var(--spacing-md)]">
      <Item variant="outline" render={<a href="#docs" />}>
        <ItemMedia variant="icon">
          <InboxIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Visit our documentation</ItemTitle>
          <ItemDescription>
            Learn how to get started with our components.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="size-[length:var(--icon-sm)] text-[color:var(--muted-foreground)]" />
        </ItemActions>
      </Item>
      <Item
        variant="outline"
        render={
          <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer" />
        }
      >
        <ItemMedia variant="icon">
          <ExternalLinkIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>External resource</ItemTitle>
          <ItemDescription>
            Opens in a new tab with security attributes.
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
};

export const Dropdown: Story = {
  render: () => (
    <Item variant="outline" className="max-w-md">
      <ItemMedia variant="icon">
        <CheckCircle weight="BoldDuotone" color="currentColor" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Select</ItemTitle>
        <ItemDescription>Choose an option from the menu.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button size="small" variant="outline" data-icon="inline-end" />
            }
          >
            Options
            <ChevronDownIcon data-icon="inline-end" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  ),
};

export const RTL: Story = {
  name: 'RTL',
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="flex w-full max-w-md flex-col gap-[var(--spacing-md)]">
        <Item variant="outline">
          <ItemMedia variant="icon">
            <CheckCircle weight="BoldDuotone" color="currentColor" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>عنصر أساسي</ItemTitle>
            <ItemDescription>
              عنصر بسيط يحتوي على عنوان ووصف.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="small" variant="outline">
              إجراء
            </Button>
          </ItemActions>
        </Item>
        <Item variant="muted">
          <ItemMedia variant="icon">
            <CheckCircle weight="BoldDuotone" color="currentColor" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>تم التحقق من ملفك الشخصي.</ItemTitle>
            <ItemDescription>يمكنك الآن الوصول إلى جميع الميزات.</ItemDescription>
          </ItemContent>
        </Item>
      </div>
    </DirectionProvider>
  ),
};

export const Footer: Story = {
  render: () => (
    <Item variant="outline" className="max-w-md flex-col items-stretch">
      <ItemContent>
        <ItemTitle>Release notes</ItemTitle>
        <ItemDescription>
          Shipping polish for Item, Input OTP, and Input Group.
        </ItemDescription>
      </ItemContent>
      <ItemFooter>
        <ItemDescription>Updated today</ItemDescription>
        <Button size="small" variant="outline">
          Changelog
        </Button>
      </ItemFooter>
    </Item>
  ),
};
