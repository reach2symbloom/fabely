import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CopyIcon,
  DownloadIcon,
  RefreshCcwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from 'lucide-react';
import { DocumentText } from '@solar-icons/react';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentRightIcon,
  AttachmentRightIcons,
  AttachmentTitle,
} from '../attachment';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { Bubble, BubbleContent } from '../bubble';
import { IconButton } from '../button';
import { Marker, MarkerContent, MarkerIcon } from '../marker';
import { Spinner } from '../spinner';

import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from './message';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Message owns row layout; Bubble is the surface.
 * shadcn Message guide.
 */

const meta = {
  title: 'Design System/Primitives/Message',
  component: Message,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const THREAD_WIDTH = 'w-full max-w-md';

/* ---------- Canonical examples ---------- */

function DemoExample() {
  return (
    <div className={`${THREAD_WIDTH} flex flex-col gap-[var(--spacing-md)]`}>
      <Message align="end">
        <MessageAvatar>
          <Avatar size="small">
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble from="user">
            <BubbleContent>Deploying to prod real quick.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="start">
        <MessageAvatar>
          <Avatar size="small">
            <AvatarFallback>R</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble from="other">
            <BubbleContent>It&apos;s 4:55 PM. On a Friday.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageAvatar>
          <Avatar size="small">
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble from="user">
            <BubbleContent>It&apos;s a one-line change.</BubbleContent>
          </Bubble>
          <MessageFooter>Delivered</MessageFooter>
        </MessageContent>
      </Message>
      <MessageGroup>
        <Message align="start">
          <MessageAvatar />
          <MessageContent>
            <Bubble from="other">
              <BubbleContent>It&apos;s always a one-line change 😭.</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message align="start">
          <MessageAvatar>
            <Avatar size="small">
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <Bubble from="other">
              <BubbleContent>Alright, let me take a look.</BubbleContent>
            </Bubble>
            <MessageFooter>
              <span aria-hidden="true">👍</span>
            </MessageFooter>
          </MessageContent>
        </Message>
      </MessageGroup>
      <Message>
        <Marker role="status">
          <MarkerIcon>
            <Spinner className="size-full" />
          </MarkerIcon>
          <MarkerContent className="shimmer">Oliver is typing...</MarkerContent>
        </Marker>
      </Message>
    </div>
  );
}

function AvatarExample() {
  return (
    <div className={`${THREAD_WIDTH} flex flex-col gap-[var(--spacing-md)]`}>
      <MessageGroup>
        <Message align="start">
          <MessageAvatar />
          <MessageContent>
            <Bubble from="other">
              <BubbleContent>
                The build failed during dependency installation.
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message align="start">
          <MessageAvatar />
          <MessageContent>
            <Bubble from="other">
              <BubbleContent>Can you share the exact error?</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message align="start">
          <MessageAvatar>
            <Avatar size="small">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <Bubble from="other">
              <BubbleContent>Here&apos;s the error from the logs</BubbleContent>
            </Bubble>
            <Bubble from="other" variant="destructive">
              <BubbleContent>
                Something went wrong with the build. The libraries are not
                installed correctly. Try running the build again.
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </MessageGroup>
    </div>
  );
}

function GroupExample() {
  return (
    <div className={THREAD_WIDTH}>
      <MessageGroup>
        <Message align="start">
          <MessageAvatar />
          <MessageContent>
            <Bubble from="other">
              <BubbleContent>I checked the registry addresses.</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message align="start">
          <MessageAvatar>
            <Avatar size="small">
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <Bubble from="other">
              <BubbleContent>
                The component and example JSON now live under the UI registry.
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </MessageGroup>
    </div>
  );
}

function HeaderFooterExample() {
  return (
    <div className={THREAD_WIDTH}>
      <Message align="start">
        <MessageAvatar>
          <Avatar size="small">
            <AvatarFallback>OL</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Olivia</MessageHeader>
          <Bubble from="other">
            <BubbleContent>I already checked the logs.</BubbleContent>
          </Bubble>
          <Bubble from="other">
            <BubbleContent>
              Send the report to the team. Ping @shadcn if you need help.
            </BubbleContent>
          </Bubble>
          <MessageFooter>Read Yesterday</MessageFooter>
        </MessageContent>
      </Message>
    </div>
  );
}

function ActionsExample() {
  return (
    <div className={`${THREAD_WIDTH} flex flex-col gap-[var(--spacing-md)]`}>
      <Message align="start">
        <MessageAvatar>
          <Avatar size="small">
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble from="other">
            <BubbleContent>
              The install failure is coming from the workspace package.
            </BubbleContent>
          </Bubble>
          <MessageFooter className="gap-[var(--spacing-2xs)]">
            <IconButton
              variant="ghost"
              size="mini"
              aria-label="Copy"
            >
              <CopyIcon />
            </IconButton>
            <IconButton
              variant="ghost"
              size="mini"
              aria-label="Retry"
            >
              <RefreshCcwIcon />
            </IconButton>
            <IconButton
              variant="ghost"
              size="mini"
              aria-label="Thumbs up"
            >
              <ThumbsUpIcon />
            </IconButton>
            <IconButton
              variant="ghost"
              size="mini"
              aria-label="Thumbs down"
            >
              <ThumbsDownIcon />
            </IconButton>
          </MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble from="user">
            <BubbleContent>Okay drop me a link. Taking a look...</BubbleContent>
          </Bubble>
          <MessageFooter>Failed to send</MessageFooter>
        </MessageContent>
      </Message>
    </div>
  );
}

function AttachmentExample() {
  return (
    <div className={`${THREAD_WIDTH} flex flex-col gap-[var(--spacing-md)]`}>
      <Message align="end">
        <MessageAvatar>
          <Avatar size="small">
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble from="user">
            <BubbleContent>
              Here&apos;s the image. Can you add it to the PDF? Use it for the
              cover page.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="start">
        <MessageAvatar>
          <Avatar size="small">
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble from="other">
            <BubbleContent>
              Done. Here&apos;s the PDF with the image added as the cover page.
            </BubbleContent>
          </Bubble>
          <Attachment>
            <AttachmentMedia>
              <DocumentText weight="BoldDuotone" color="currentColor" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
              <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentRightIcons>
              <AttachmentRightIcon
                size="sm"
                roundness="default"
                aria-label="Download sales-dashboard.pdf"
              >
                <DownloadIcon />
              </AttachmentRightIcon>
            </AttachmentRightIcons>
          </Attachment>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageAvatar>
          <Avatar size="small">
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble from="user">
            <BubbleContent>Thanks. Looks good.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  );
}

/* ---------- Playground ---------- */

function MessagePlayground() {
  const [align, setAlign] = useState<'start' | 'end'>('start');
  const [showAvatar, setShowAvatar] = useState(true);
  const [showHeader, setShowHeader] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [surface, setSurface] = useState<'text' | 'attachment'>('attachment');

  const from = align === 'end' ? 'user' : 'other';

  return (
    <PlaygroundPanel
      preview={
        <div className={THREAD_WIDTH}>
          <Message align={align}>
            {showAvatar ? (
              <MessageAvatar>
                <Avatar size="small">
                  <AvatarFallback>{align === 'end' ? 'ME' : 'AI'}</AvatarFallback>
                </Avatar>
              </MessageAvatar>
            ) : null}
            <MessageContent>
              {showHeader ? (
                <MessageHeader>
                  {align === 'end' ? 'You' : 'Assistant'}
                </MessageHeader>
              ) : null}
              {surface === 'text' ? (
                <Bubble from={from}>
                  <BubbleContent>How can I help you today?</BubbleContent>
                </Bubble>
              ) : (
                <Attachment>
                  <AttachmentMedia>
                    <DocumentText weight="BoldDuotone" color="currentColor" />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
                    <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentRightIcons>
                    <AttachmentRightIcon
                      size="sm"
                      roundness="default"
                      aria-label="Download sales-dashboard.pdf"
                    >
                      <DownloadIcon />
                    </AttachmentRightIcon>
                  </AttachmentRightIcons>
                </Attachment>
              )}
              {showFooter ? <MessageFooter>Delivered</MessageFooter> : null}
            </MessageContent>
          </Message>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Align"
            value={align}
            options={[
              { value: 'start', label: 'Start' },
              { value: 'end', label: 'End' },
            ]}
            onChange={(v) => setAlign(v as 'start' | 'end')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Surface"
            value={surface}
            options={[
              { value: 'text', label: 'Text' },
              { value: 'attachment', label: 'File' },
            ]}
            onChange={(v) => setSurface(v as 'text' | 'attachment')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Avatar"
            value={showAvatar ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setShowAvatar(v === 'on')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Header"
            value={showHeader ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setShowHeader(v === 'on')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Footer"
            value={showFooter ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setShowFooter(v === 'on')}
            fullWidth
            className="col-span-2"
          />
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
      title="Message"
      description={
        <>
          Row layout for a conversation turn — avatar, alignment, header, and
          footer around a <code>Bubble</code> surface. No dedicated Figma Message
          set; gaps and meta type use Foundations.
        </>
      }
      playground={<MessagePlayground />}
      variants={
        <div className="flex flex-col gap-8">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Avatar">
            <AvatarExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Group">
            <GroupExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Header and Footer">
            <HeaderFooterExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Actions">
            <ActionsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Attachment">
            <AttachmentExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            <code>Message</code> owns the row; put the visible surface in{' '}
            <code>Bubble</code> (map <code>align=&quot;end&quot;</code> ↔{' '}
            <code>from=&quot;user&quot;</code>).
          </li>
          <li>
            Prefer <code>Avatar size=&quot;small&quot;</code> (32) with the
            avatar slot&apos;s <code>--spacing-2xl</code> min width.
          </li>
          <li>
            In a <code>MessageGroup</code>, leave empty{' '}
            <code>MessageAvatar</code> on earlier rows so the last avatar
            aligns the stack.
          </li>
          <li>
            Status / typing: compose <code>Marker</code> with{' '}
            <code>role=&quot;status&quot;</code> (optional shimmer).
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Presentational layout — a11y comes from content inside (Bubble
            text, Attachment labels, Marker status).
          </li>
          <li>
            Icon-only footer actions need <code>aria-label</code> on each{' '}
            <code>IconButton</code>.
          </li>
          <li>
            In-progress updates: <code>Marker role=&quot;status&quot;</code> so
            AT announces as the note appears.
          </li>
        </ul>
      }
    />
  ),
};

/* ---------- Individual example pages ---------- */

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const AvatarStory: Story = {
  name: 'Avatar',
  render: () => <AvatarExample />,
};

export const Group: Story = {
  render: () => <GroupExample />,
};

export const HeaderAndFooter: Story = {
  name: 'Header and Footer',
  render: () => <HeaderFooterExample />,
};

export const Actions: Story = {
  render: () => <ActionsExample />,
};

export const AttachmentStory: Story = {
  name: 'Attachment',
  render: () => <AttachmentExample />,
};
