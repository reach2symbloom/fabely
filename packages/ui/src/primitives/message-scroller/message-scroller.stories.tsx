import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { Avatar, AvatarFallback } from '../avatar';
import { Bubble, BubbleContent } from '../bubble';
import { Marker, MarkerContent } from '../marker';
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from '../message';

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from './message-scroller';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Chat transcript scroller (product: Chat UI). Lean demos only — full shadcn
 * streaming Chat UI (AI SDK, Empty, Input Group shell) is deferred; product
 * apps own that composition.
 */

const meta = {
  title: 'Design System/Primitives/Message Scroller',
  component: MessageScroller,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const FRAME =
  'h-[28rem] w-full max-w-md overflow-hidden rounded-[length:var(--rounded-xl)] border border-[color:var(--border)] bg-[color:var(--background)]';

type DemoMessage = {
  id: string;
  role: 'user' | 'assistant' | 'marker';
  body: string;
};

const THREAD: DemoMessage[] = [
  { id: 'm1', role: 'user', body: 'Deploying to prod real quick.' },
  { id: 'm2', role: 'assistant', body: "It's 4:55 PM. On a Friday." },
  { id: 'm3', role: 'user', body: "It's a one-line change." },
  {
    id: 'm4',
    role: 'assistant',
    body: "It's always a one-line change. Alright, let me take a look.",
  },
  { id: 'm5', role: 'marker', body: 'Today' },
  {
    id: 'm6',
    role: 'user',
    body: 'Can you add the cover image to the PDF?',
  },
  {
    id: 'm7',
    role: 'assistant',
    body: "Done. Here's the PDF with the image on the cover page.",
  },
  { id: 'm8', role: 'user', body: 'Thanks — looks good.' },
  {
    id: 'm9',
    role: 'assistant',
    body: 'Anytime. Ping me if the deploy complains.',
  },
];

function ThreadRow({ message }: { message: DemoMessage }) {
  if (message.role === 'marker') {
    return (
      <Marker variant="separator">
        <MarkerContent>{message.body}</MarkerContent>
      </Marker>
    );
  }

  const align = message.role === 'user' ? 'end' : 'start';
  const from = message.role === 'user' ? 'user' : 'other';

  return (
    <Message align={align}>
      <MessageAvatar>
        <Avatar size="small">
          <AvatarFallback>{message.role === 'user' ? 'ME' : 'AI'}</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <Bubble from={from}>
          <BubbleContent>{message.body}</BubbleContent>
        </Bubble>
        {message.role === 'user' ? (
          <MessageFooter>Delivered</MessageFooter>
        ) : null}
      </MessageContent>
    </Message>
  );
}

function ScrollerShell({
  messages,
  autoScroll = true,
  defaultScrollPosition = 'end',
  scrollPreviousItemPeek,
  header,
}: {
  messages: DemoMessage[];
  autoScroll?: boolean;
  defaultScrollPosition?: 'start' | 'end' | 'last-anchor';
  scrollPreviousItemPeek?: number;
  header?: ReactNode;
}) {
  return (
    <div className={`${FRAME} flex flex-col`}>
      <MessageScrollerProvider
        autoScroll={autoScroll}
        defaultScrollPosition={defaultScrollPosition}
        scrollPreviousItemPeek={scrollPreviousItemPeek}
      >
        {header}
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent>
              {messages.map((message) => (
                <MessageScrollerItem
                  key={message.id}
                  messageId={message.id}
                  scrollAnchor={message.role === 'user'}
                >
                  <ThreadRow message={message} />
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  );
}

function DemoExample() {
  return <ScrollerShell messages={THREAD} />;
}

function LastAnchorExample() {
  return (
    <ScrollerShell
      messages={THREAD}
      autoScroll={false}
      defaultScrollPosition="last-anchor"
      scrollPreviousItemPeek={64}
    />
  );
}

function JumpToolbar() {
  const { scrollToMessage, scrollToEnd, scrollToStart } = useMessageScroller();
  const chip =
    'rounded-[length:var(--rounded-md)] border border-[color:var(--border)] px-[var(--spacing-xs)] py-[var(--spacing-2xs)] text-[length:var(--text-paragraph-mini-medium-font-size)] text-[color:var(--text)]';

  return (
    <div className="flex flex-wrap gap-[var(--spacing-xs)] p-[var(--spacing-sm)]">
      <button type="button" className={chip} onClick={() => scrollToStart()}>
        Start
      </button>
      <button
        type="button"
        className={chip}
        onClick={() => scrollToMessage('m6')}
      >
        Cover request
      </button>
      <button type="button" className={chip} onClick={() => scrollToEnd()}>
        Latest
      </button>
    </div>
  );
}

function JumpCommandsExample() {
  return (
    <ScrollerShell
      messages={THREAD}
      autoScroll
      defaultScrollPosition="end"
      header={<JumpToolbar />}
    />
  );
}

function MessageScrollerPlayground() {
  const [autoScroll, setAutoScroll] = useState(true);
  const [opening, setOpening] = useState<'end' | 'last-anchor' | 'start'>(
    'end'
  );
  const [key, setKey] = useState(0);

  return (
    <PlaygroundPanel
      preview={
        <ScrollerShell
          key={key}
          messages={THREAD}
          autoScroll={autoScroll}
          defaultScrollPosition={opening}
          scrollPreviousItemPeek={64}
        />
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Auto-scroll"
            value={autoScroll ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setAutoScroll(v === 'on')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Open at"
            value={opening}
            options={[
              { value: 'start', label: 'Start' },
              { value: 'end', label: 'End' },
              { value: 'last-anchor', label: 'Anchor' },
            ]}
            onChange={(v) => {
              setOpening(v as 'end' | 'last-anchor' | 'start');
              setKey((k) => k + 1);
            }}
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
      title="Message Scroller"
      description={
        <>
          Chat transcript scroller (product: <em>Chat UI</em>). Anchors turns,
          follows the live edge when asked, and jumps — without owning messages
          or AI state. Compose <code>Message</code> / <code>Bubble</code> /{' '}
          <code>Marker</code> rows.
        </>
      }
      playground={<MessageScrollerPlayground />}
      variants={
        <div className="flex flex-col gap-8">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Last anchor open">
            <LastAnchorExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Jump commands">
            <JumpCommandsExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Export name stays <code>MessageScroller</code> (shadcn parity);
            product language is Chat UI.
          </li>
          <li>
            Parent must constrain height — the root is <code>size-full</code>.
          </li>
          <li>
            Every row needs <code>MessageScrollerItem</code> + stable{' '}
            <code>messageId</code>; mark turn starts with{' '}
            <code>scrollAnchor</code>.
          </li>
          <li>
            Full streaming Chat UI shells (Empty + Input Group + transport) live
            in the product app — not this primitive&apos;s Storybook.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Viewport is a labelled, focusable region; content is a live{' '}
            <code>log</code> for additions.
          </li>
          <li>
            Pass <code>aria-busy</code> on Content while a turn streams if
            announcements should wait for the completed row.
          </li>
          <li>
            Jump button is inert when inactive — no extra focus stop.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const LastAnchorOpen: Story = {
  name: 'Last anchor open',
  render: () => <LastAnchorExample />,
};

export const JumpCommands: Story = {
  name: 'Jump commands',
  render: () => <JumpCommandsExample />,
};
