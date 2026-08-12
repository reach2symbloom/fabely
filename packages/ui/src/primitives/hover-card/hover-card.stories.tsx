import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { Button, buttonLinkVariants } from '../button';
import { cn } from '@/lib/utils';

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. shadcn Hover Card guide (Base UI Preview Card).
 */

type Side = 'top' | 'bottom' | 'left' | 'right';
type Align = 'start' | 'center' | 'end';

const meta = {
  title: 'Design System/Primitives/Hover Card',
  component: HoverCard,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function ProfilePreview() {
  return (
    <div className="flex gap-[var(--spacing-md)]">
      <Avatar size="large">
        <AvatarImage src="https://github.com/vercel.png" alt="@nextjs" />
        <AvatarFallback>VC</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-[var(--spacing-2xs)]">
        <p
          className={[
            'font-[family-name:var(--text-paragraph-small-medium-font-family)]',
            '[font-weight:var(--text-paragraph-small-medium-font-weight)]',
            'text-[length:var(--text-paragraph-small-medium-font-size)]',
            'leading-[var(--text-paragraph-small-medium-line-height)]',
          ].join(' ')}
        >
          @nextjs
        </p>
        <p className="text-[color:var(--muted-foreground)]">
          The React Framework – created and maintained by @vercel.
        </p>
        <div className="mt-[var(--spacing-xs)] flex items-center gap-[var(--spacing-xs)] text-[color:var(--muted-foreground)]">
          <CalendarIcon
            aria-hidden="true"
            className="size-[length:var(--icon-sm)] shrink-0"
          />
          <span
            className={[
              'font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
              'text-[length:var(--text-paragraph-mini-regular-font-size)]',
              'leading-[var(--text-paragraph-mini-regular-line-height)]',
            ].join(' ')}
          >
            Joined December 2021
          </span>
        </div>
      </div>
    </div>
  );
}

function BasicExample() {
  return (
    <HoverCard>
      <HoverCardTrigger
        delay={200}
        closeDelay={100}
        render={
          <a
            href="https://nextjs.org"
            className={cn(buttonLinkVariants())}
          />
        }
      >
        @nextjs
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <ProfilePreview />
      </HoverCardContent>
    </HoverCard>
  );
}

const SIDES: Side[] = ['left', 'top', 'bottom', 'right'];

function SidesExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-[var(--spacing-md)]">
      {SIDES.map((side) => (
        <HoverCard key={side}>
          <HoverCardTrigger
            delay={100}
            closeDelay={100}
            render={<Button variant="secondary" />}
          >
            {side}
          </HoverCardTrigger>
          <HoverCardContent side={side}>
            <p>
              Hover Card on the <strong>{side}</strong> side of the trigger.
            </p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}

function RtlExample() {
  return (
    <div dir="rtl" className="flex flex-col items-center gap-[var(--spacing-md)]">
      <p className="text-[color:var(--muted-foreground)]">العربية (RTL)</p>
      <HoverCard>
        <HoverCardTrigger
          delay={100}
          closeDelay={100}
          render={<Button variant="secondary" />}
        >
          مرّر هنا
        </HoverCardTrigger>
        <HoverCardContent side="bottom" align="start">
          <p>بطاقة معاينة تظهر بمحاذاة البداية في تخطيط من اليمين لليسار.</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

function HoverCardPlayground() {
  const [side, setSide] = useState<Side>('bottom');
  const [align, setAlign] = useState<Align>('center');
  const [shadow, setShadow] = useState(true);

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 items-center justify-center">
          <HoverCard>
            <HoverCardTrigger
              delay={100}
              closeDelay={100}
              render={<Button variant="secondary" />}
            >
              Hover
            </HoverCardTrigger>
            <HoverCardContent side={side} align={align} shadow={shadow}>
              The React Framework – created and maintained by @vercel.
            </HoverCardContent>
          </HoverCard>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Side"
            value={side}
            onChange={(v) => setSide(v as Side)}
            options={SIDES.map((value) => ({ value, label: value }))}
          />
          <InlineSegmentedControl
            label="Align"
            value={align}
            onChange={(v) => setAlign(v as Align)}
            options={[
              { value: 'start', label: 'Start' },
              { value: 'center', label: 'Center' },
              { value: 'end', label: 'End' },
            ]}
          />
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Shadow"
              value={shadow ? 'on' : 'off'}
              onChange={(v) => setShadow(v === 'on')}
              options={[
                { value: 'on', label: 'On' },
                { value: 'off', label: 'Off' },
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
      title="Hover Card"
      description="Preview content on hover via Base UI Preview Card. Foundations floating surface (`--background`) — no dedicated Figma Hover Card set."
      playground={<HoverCardPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Basic">
            <BasicExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Sides">
            <SidesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Compose <code>HoverCard</code> → <code>HoverCardTrigger</code> +{' '}
            <code>HoverCardContent</code>.
          </li>
          <li>
            Put <code>delay</code> / <code>closeDelay</code> on the{' '}
            <strong>trigger</strong> (Base UI), not the root.
          </li>
          <li>
            Position with <code>side</code> / <code>align</code> on Content.
            Custom triggers use <code>render</code>. Set{' '}
            <code>shadow=&#123;false&#125;</code> for a flat bordered panel.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Hover Card is for sighted hover previews — do not put critical
            actions only inside the card.
          </li>
          <li>
            Prefer a focusable trigger (link / button). Keyboard users may not
            open hover-only content.
          </li>
        </ul>
      }
    />
  ),
};

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const Sides: Story = {
  parameters: { layout: 'padded' },
  render: () => <SidesExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
