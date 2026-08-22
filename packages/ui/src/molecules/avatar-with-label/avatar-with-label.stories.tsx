/**
 * Avatar with Label — Figma Avatar with label (12044:25610).
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type MouseEvent } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import {
  AvatarWithLabel,
  type AvatarWithLabelSize,
} from './avatar-with-label';

const DEMO_AVATAR =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces';

const DEMO_PROFILE_HREF = '/author/christian-davis';
const DEMO_UPGRADE_HREF = '/pricing';

/** Bookshelf Template's footer swatch — lavender, not Avatar's generic blush default. */
const LAVENDER_FALLBACK = 'bg-[var(--tw-raw-pantones-lavendar)]';

const meta = {
  title: 'Design System/Molecules/Avatar with Label',
  component: AvatarWithLabel,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: {
    size: 'xs',
    name: 'Christian Davis',
    initials: 'CD',
    src: DEMO_AVATAR,
  },
} satisfies Meta<typeof AvatarWithLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

function AvatarWithLabelPlayground() {
  const [size, setSize] = useState<AvatarWithLabelSize>('md');
  const [style, setStyle] = useState<'avatar' | 'initials'>('avatar');
  const [lines, setLines] = useState<'1' | '2'>('2');
  const [interactive, setInteractive] = useState(true);
  const [active, setActive] = useState(false);

  return (
    <PlaygroundPanel
      className="w-[494px] max-w-full"
      preview={
        <div className="flex min-h-40 w-full items-center justify-center">
          {interactive ? (
            <AvatarWithLabel
              size={size}
              name="Christian Davis"
              initials="CD"
              src={style === 'avatar' ? DEMO_AVATAR : undefined}
              actionLabel={lines === '2' ? 'Upgrade plan' : undefined}
              actionHref={DEMO_UPGRADE_HREF}
              active={active}
              href={DEMO_PROFILE_HREF}
              onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                event.preventDefault();
              }}
            />
          ) : (
            <AvatarWithLabel
              size={size}
              name="Christian Davis"
              initials="CD"
              src={style === 'avatar' ? DEMO_AVATAR : undefined}
              actionLabel={lines === '2' ? 'Upgrade plan' : undefined}
              actionHref={DEMO_UPGRADE_HREF}
              active={active}
            />
          )}
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Size"
            value={size}
            onChange={(v) => setSize(v as AvatarWithLabelSize)}
            options={[
              { value: 'xs', label: 'XS' },
              { value: 'sm', label: 'SM' },
              { value: 'md', label: 'MD' },
            ]}
            fullWidth
          />
          <InlineSegmentedControl
            label="Style"
            value={style}
            onChange={(v) => setStyle(v as 'avatar' | 'initials')}
            options={[
              { value: 'avatar', label: 'Avatar' },
              { value: 'initials', label: 'Initials' },
            ]}
            fullWidth
          />
          <InlineSegmentedControl
            label="2 lines"
            value={lines}
            onChange={(v) => setLines(v as '1' | '2')}
            options={[
              { value: '1', label: 'False' },
              { value: '2', label: 'True' },
            ]}
            fullWidth
          />
          <InlineSegmentedControl
            label="Interactive"
            value={interactive ? 'on' : 'off'}
            onChange={(v) => setInteractive(v === 'on')}
            options={[
              { value: 'on', label: 'Link' },
              { value: 'off', label: 'Static' },
            ]}
            fullWidth
          />
          <InlineSegmentedControl
            label="Hover"
            value={active ? 'true' : 'false'}
            onChange={(v) => setActive(v === 'true')}
            options={[
              { value: 'false', label: 'False' },
              { value: 'true', label: 'True' },
            ]}
            fullWidth
          />
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Avatar with Label"
      description="Avatar + name with optional second-line action. Pass href for a profile link (cursor + hover); omit for a static row. Figma Avatar with label (12044:25610)."
      playground={<AvatarWithLabelPlayground />}
      variants={
        <div className="flex flex-wrap items-start gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Interactive · MD">
            <AvatarWithLabel
              size="md"
              name="Christian Davis"
              initials="CD"
              src={DEMO_AVATAR}
              actionLabel="Upgrade plan"
              actionHref={DEMO_UPGRADE_HREF}
              href={DEMO_PROFILE_HREF}
              onClick={(event) => event.preventDefault()}
            />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Interactive · SM">
            <AvatarWithLabel
              size="sm"
              name="Christian Davis"
              initials="CD"
              src={DEMO_AVATAR}
              href={DEMO_PROFILE_HREF}
              onClick={(event) => event.preventDefault()}
            />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Static · MD">
            <AvatarWithLabel
              size="md"
              name="Christian Davis"
              initials="CD"
              actionLabel="Upgrade plan"
              actionHref={DEMO_UPGRADE_HREF}
            />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Static · XS">
            <AvatarWithLabel size="xs" name="Christian Davis" initials="CD" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Interactive · Hover face">
            <AvatarWithLabel
              size="md"
              name="Christian Davis"
              initials="CD"
              actionLabel="Upgrade plan"
              actionHref={DEMO_UPGRADE_HREF}
              href={DEMO_PROFILE_HREF}
              active
              onClick={(event) => event.preventDefault()}
            />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Avatar · SM">
            <AvatarWithLabel
              size="sm"
              name="Christian Davis"
              initials="CD"
              src={DEMO_AVATAR}
            />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Initials · SM">
            <AvatarWithLabel size="sm" name="Christian Davis" initials="CD" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Fia action · Initials · MD (lavender fallback)">
            <AvatarWithLabel
              size="md"
              name="Christian Davis"
              initials="CD"
              actionLabel="Upgrade plan"
              actionHref={DEMO_UPGRADE_HREF}
              fallbackClassName={LAVENDER_FALLBACK}
            />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Pass <code>href</code> for an author-profile link — root is an{' '}
            <code>&lt;a&gt;</code> with <code>cursor-pointer</code> and hover
            fill. Omit <code>href</code> for a static row.
          </li>
          <li>
            When interactive, keep <code>action</code> non-interactive (no nested
            links) — e.g. a styled span for “Upgrade plan”.
          </li>
          <li>
            For the "Upgrade plan" pattern itself, prefer{' '}
            <code>actionLabel</code> + <code>actionHref</code> over hand-rolling{' '}
            <code>action</code> — it renders Figma's <code>fia</code> Link
            Button chrome and already downgrades to a non-interactive span
            when this root is itself a link.
          </li>
          <li>
            MD + image + action defaults <code>gradient</code> on; override with
            the prop when needed.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Interactive roots default <code>aria-label</code> to the string{' '}
            <code>name</code>. Image <code>alt</code> defaults the same way.
          </li>
          <li>
            Static roots are non-interactive <code>div</code>s — no keyboard
            target unless a host wraps them.
          </li>
        </ul>
      }
    />
  ),
};
