import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { ChevronDownIcon, GitCompareIcon, XIcon } from 'lucide-react';
import {
  Bubble,
  BubbleContent,
  BubbleFooter,
  BubbleGroup,
  BubbleReactions,
  type BubbleFrom,
  type BubbleVariant,
} from './bubble';
import { Collapsible, CollapsibleTrigger } from '../collapsible';
import { ButtonLink } from '../button';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { cn } from '@/lib/utils';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first. Figma Chat bubbles 16340:807 — speakers via `from`,
 * Foundations radius/spacing, optional BubbleFooter slot.
 */

const meta = {
  title: 'Design System/Primitives/Bubble',
  component: Bubble,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function Thread({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex w-full max-w-md flex-col gap-6 ${className ?? ''}`}>
      {children}
    </div>
  );
}

/** Placeholder until the Figma workflow chip atom exists. */
function WorkflowChipPlaceholder() {
  return (
    <span
      className={[
        'inline-flex h-[length:var(--spacing-xl)] items-center',
        'gap-[var(--spacing-2xs)]',
        'rounded-[var(--rounded-sm)]',
        'bg-[var(--theme-alpha-black-switch-333)]',
        'px-[var(--spacing-1-5)] py-[var(--spacing-3xs)]',
        'text-[length:var(--text-paragraph-mini-medium-font-size)]',
        'leading-[var(--text-paragraph-mini-medium-line-height)]',
        'tracking-[var(--text-paragraph-mini-medium-letter-spacing)]',
        '[font-weight:var(--font-weight-paragraph-medium)]',
        'text-[color:var(--tw-raw-fia-200)]',
      ].join(' ')}
    >
      <GitCompareIcon className="size-[length:var(--icon-xs)] shrink-0" />
      Workflow: Related themes
      <XIcon className="size-[length:var(--icon-xs)] shrink-0 opacity-70" />
    </span>
  );
}

/* ---------- Canonical examples ---------- */

function ConversationExample() {
  return (
    <Thread>
      <Bubble from="other">
        <BubbleContent>
          Want me to find related themes across your notes for this chapter?
        </BubbleContent>
      </Bubble>
      <Bubble from="user">
        <BubbleContent>
          Find what else goes with this chapter. Look across my notes for
          material that resonates with the Eldergrove wand-selection scene,
          then group the strongest matches into thematic bundles I can review
          and pull into the chapter.
        </BubbleContent>
        <BubbleFooter>
          <WorkflowChipPlaceholder />
        </BubbleFooter>
      </Bubble>
      <Bubble from="other">
        <BubbleContent>
          Got it — I&apos;ll scan for Eldergrove motifs and cluster the
          strongest matches.
        </BubbleContent>
        <BubbleReactions role="img" aria-label="Reactions: thumbs up">
          <span>👍</span>
        </BubbleReactions>
      </Bubble>
    </Thread>
  );
}

function SpeakersExample() {
  return (
    <Thread>
      <Bubble from="other">
        <BubbleContent>
          Other speaker — faded alpha fill, start-aligned, sharp bottom-start.
        </BubbleContent>
      </Bubble>
      <Bubble from="user">
        <BubbleContent>
          Current user — secondary fill, end-aligned, sharp bottom-end.
        </BubbleContent>
      </Bubble>
    </Thread>
  );
}

function FooterExample() {
  return (
    <Thread>
      <Bubble from="user">
        <BubbleContent>
          Find what else goes with this chapter. Look across my notes for
          material that resonates with the Eldergrove wand-selection scene,
          then group the strongest matches into thematic bundles I can review
          and pull into the chapter.
        </BubbleContent>
        <BubbleFooter>
          <WorkflowChipPlaceholder />
        </BubbleFooter>
      </Bubble>
    </Thread>
  );
}

function GroupExample() {
  return (
    <Thread>
      <BubbleGroup>
        <Bubble from="other">
          <BubbleContent>Can you tell me what&apos;s the issue?</BubbleContent>
        </Bubble>
        <Bubble from="other">
          <BubbleContent>It worked yesterday.</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <Bubble from="user">
        <BubbleContent>Find the bug and fix it.</BubbleContent>
        <BubbleReactions role="img" aria-label="Reactions: eyes">
          <span>👀</span>
        </BubbleReactions>
      </Bubble>
    </Thread>
  );
}

function ReactionsExample() {
  return (
    <Thread className="gap-10 py-4">
      <Bubble from="other">
        <BubbleContent>
          I don&apos;t need tests, I know my code works.
        </BubbleContent>
        <BubbleReactions role="img" aria-label="Reactions: thumbs up, surprised">
          <span>👍</span>
          <span>😮</span>
        </BubbleReactions>
      </Bubble>
      <Bubble from="user">
        <BubbleContent>
          Bold. Fine I&apos;ll add some tests.
        </BubbleContent>
        <BubbleReactions
          role="img"
          aria-label="Reactions: eyes, rocket, and 2 more"
        >
          <span>👀</span>
          <span>🚀</span>
          <span>+2</span>
        </BubbleReactions>
      </Bubble>
    </Thread>
  );
}

function DestructiveExample() {
  return (
    <Thread>
      <Bubble from="user">
        <BubbleContent>Run the build script.</BubbleContent>
      </Bubble>
      <Bubble from="other" variant="destructive">
        <BubbleContent>
          Failed to run the command. TypeScript reported 3 errors — see the
          full log for details.
        </BubbleContent>
      </Bubble>
    </Thread>
  );
}

function LinksExample() {
  return (
    <Thread>
      <Bubble from="other">
        <BubbleContent>How can I help you today?</BubbleContent>
      </Bubble>
      <BubbleGroup>
        <Bubble from="user">
          <BubbleContent render={<button type="button" />}>
            I forgot my password
          </BubbleContent>
        </Bubble>
        <Bubble from="user">
          <BubbleContent render={<button type="button" />}>
            Something else. Talk to a human.
          </BubbleContent>
        </Bubble>
      </BubbleGroup>
    </Thread>
  );
}

const COLLAPSIBLE_TEXT = `The accessibility review found two focus states that were visually too subtle in dark mode.

I checked the dialog, menu, and drawer paths because each one renders focusable controls inside a layered surface.

The dialog and drawer are fine. The menu needs the hover and focus tokens split so keyboard focus stays visible when the pointer is not involved.

I also recommend keeping the change in the style file instead of the primitive so the other themes can choose their own focus treatment later.`;

const COLLAPSIBLE_PREVIEW_LENGTH = 180;

/** Long copy + ButtonLink show more / show less (Collapsible compose). */
function BubbleCollapsibleCopy({ text = COLLAPSIBLE_TEXT }: { text?: string }) {
  const [open, setOpen] = useState(false);
  const isLong = text.length > COLLAPSIBLE_PREVIEW_LENGTH;
  const preview = `${text.slice(0, COLLAPSIBLE_PREVIEW_LENGTH)}…`;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div>{open || !isLong ? text : preview}</div>
      {isLong ? (
        <CollapsibleTrigger
          render={
            <ButtonLink
              variant="primary"
              size="default"
              className="mt-[length:var(--spacing-xs)]"
            />
          }
        >
          {open ? 'Show less' : 'Show more'}
          <ChevronDownIcon
            className={cn(
              'size-[length:var(--icon-xs)] shrink-0 transition-transform',
              open && 'rotate-180'
            )}
          />
        </CollapsibleTrigger>
      ) : null}
    </Collapsible>
  );
}

function CollapsibleExample() {
  return (
    <Thread>
      <Bubble from="other">
        <BubbleContent>How can I help you today?</BubbleContent>
      </Bubble>
      <Bubble from="user">
        <BubbleContent className="whitespace-pre-line">
          <BubbleCollapsibleCopy />
        </BubbleContent>
      </Bubble>
    </Thread>
  );
}

/* ---------- Playground ---------- */

function BubblePlayground() {
  const [from, setFrom] = useState<BubbleFrom>('user');
  const [variant, setVariant] = useState<BubbleVariant>('default');
  const [footer, setFooter] = useState(true);
  const [reactions, setReactions] = useState(false);
  const [collapsible, setCollapsible] = useState(false);

  const defaultCopy =
    variant === 'destructive'
      ? 'Failed to run the command. TypeScript reported 3 errors — see the full log for details.'
      : 'Find what else goes with this chapter. Look across my notes for material that resonates with the Eldergrove scene.';

  return (
    <PlaygroundPanel
      preview={
        <Thread>
          <Bubble from={from} variant={variant}>
            <BubbleContent
              className={collapsible ? 'whitespace-pre-line' : undefined}
            >
              {collapsible ? <BubbleCollapsibleCopy /> : defaultCopy}
            </BubbleContent>
            {footer && variant !== 'destructive' ? (
              <BubbleFooter>
                <WorkflowChipPlaceholder />
              </BubbleFooter>
            ) : null}
            {reactions ? (
              <BubbleReactions
                role="img"
                aria-label="Reactions: thumbs up, fire"
              >
                <span>👍</span>
                <span>🔥</span>
              </BubbleReactions>
            ) : null}
          </Bubble>
        </Thread>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="From"
            value={from}
            options={[
              { value: 'other', label: 'Other' },
              { value: 'user', label: 'User' },
            ]}
            onChange={(v) => setFrom(v as BubbleFrom)}
            fullWidth
          />
          <InlineSegmentedControl
            label="Variant"
            value={variant}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'destructive', label: 'Destructive' },
            ]}
            onChange={(v) => setVariant(v as BubbleVariant)}
            fullWidth
          />
          <InlineSegmentedControl
            label="Footer"
            value={footer ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setFooter(v === 'on')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Reactions"
            value={reactions ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setReactions(v === 'on')}
            fullWidth
          />
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Show more / less"
              value={collapsible ? 'on' : 'off'}
              options={[
                { value: 'off', label: 'Off' },
                { value: 'on', label: 'On' },
              ]}
              onChange={(v) => setCollapsible(v === 'on')}
              fullWidth
            />
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
      title="Bubble"
      description={
        <>
          Conversational surface from Figma <strong>Chat bubbles</strong>.{' '}
          <code>from=&quot;user&quot; | &quot;other&quot;</code> sets alignment
          and the sharp near-speaker corner. Optional{' '}
          <code>variant=&quot;destructive&quot;</code> for errors.{' '}
          <code>BubbleFooter</code> hosts a badge / chip slot.
        </>
      }
      playground={<BubblePlayground />}
      variants={
        <div className="flex flex-col gap-8">
          <PrimitiveGalleryItem label="Conversation">
            <ConversationExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Speakers">
            <SpeakersExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Footer slot">
            <FooterExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Destructive">
            <DestructiveExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Group">
            <GroupExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Reactions">
            <ReactionsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Links and Buttons">
            <LinksExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Collapsible">
            <CollapsibleExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Use <code>from</code> for who is speaking. Keep{' '}
            <code>variant=&quot;destructive&quot;</code> for error / failed
            action copy — do not invent other color variants.
          </li>
          <li>
            Put avatars, names, and timestamps on Message when composing a full
            chat row; Bubble is the surface only.
          </li>
          <li>
            <code>BubbleFooter</code> is the bottom slot for Badge or a custom
            chip (Figma workflow chip not shipped yet).
          </li>
          <li>
            Reactions overlap the bubble edge — leave vertical gap between
            rows when stacking bubbles with reactions.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Label emoji reaction rows with <code>role=&quot;img&quot;</code> and
            a descriptive <code>aria-label</code>.
          </li>
          <li>
            Interactive bubbles: pass a real <code>&lt;button&gt;</code> or{' '}
            <code>&lt;a&gt;</code> via <code>BubbleContent</code>{' '}
            <code>render</code>.
          </li>
          <li>
            Do not rely on color alone — pair{' '}
            <code>variant=&quot;destructive&quot;</code> with error context in
            the message text.
          </li>
        </ul>
      }
    />
  ),
};

/* ---------- Individual example pages ---------- */

export const Conversation: Story = {
  render: () => <ConversationExample />,
};

export const Speakers: Story = {
  render: () => <SpeakersExample />,
};

export const FooterSlot: Story = {
  name: 'Footer slot',
  render: () => <FooterExample />,
};

export const Destructive: Story = {
  render: () => <DestructiveExample />,
};

export const Group: Story = {
  render: () => <GroupExample />,
};

export const Reactions: Story = {
  render: () => <ReactionsExample />,
};

export const LinksAndButtons: Story = {
  name: 'Links and Buttons',
  render: () => <LinksExample />,
};

export const CollapsibleStory: Story = {
  name: 'Collapsible',
  render: () => <CollapsibleExample />,
};
