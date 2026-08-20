/**
 * Note Card — Fabely feature composite. Overview + focused demos.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import { NoteCard } from './NoteCard';

const SAMPLE = {
  title: 'Eldergrove Wand Selection',
  annotation: 'Author note explaining the sequence before Sophia receives her wand.',
  body: "Zeera leads Sophia through the root-woven entrance of the Eldergrove and explains that no wand may be taken by force. The trees must first recognize the apprentice's inner magic, and Sophia must wait for the grove to answer her. Just as the branches begin to stir, a deep rumbling rises from the dark woods, warning them that something ancient is approaching…",
  date: '3/20/2025',
  wordCount: 1230,
};

const meta = {
  title: 'Design System/Features/Gather/Note Card',
  component: NoteCard,
  tags: ['ai-generated'],
  parameters: { layout: 'fullscreen' },
  args: { body: SAMPLE.body },
} satisfies Meta<typeof NoteCard>;

export default meta;
type Story = StoryObj<typeof meta>;

function CardShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-[560px]">{children}</div>;
}

function DemoExample() {
  return (
    <CardShell>
      <NoteCard {...SAMPLE} index={1} />
    </CardShell>
  );
}

function EmptyExample() {
  return (
    <CardShell>
      <NoteCard body={SAMPLE.body} date={SAMPLE.date} wordCount={SAMPLE.wordCount} index={2} />
    </CardShell>
  );
}

function PinnedExample() {
  return (
    <CardShell>
      <NoteCard {...SAMPLE} pinned defaultBookmarked index={1} />
    </CardShell>
  );
}

function HoverExample() {
  return (
    <CardShell>
      <NoteCard {...SAMPLE} index={1} forceHover />
    </CardShell>
  );
}

function ControlledExample() {
  const [pinned, setPinned] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <CardShell>
      <NoteCard
        {...SAMPLE}
        index={1}
        pinned={pinned}
        onPinnedChange={setPinned}
        bookmarked={bookmarked}
        onBookmarkedChange={setBookmarked}
      />
    </CardShell>
  );
}

function NoteCardPlayground() {
  const [hasTitle, setHasTitle] = useState(true);
  const [pinned, setPinned] = useState(false);
  const [forceHover, setForceHover] = useState(false);

  return (
    <PlaygroundPanel
      preview={
        <CardShell>
          <NoteCard
            key={`${hasTitle}-${pinned}`}
            title={hasTitle ? SAMPLE.title : undefined}
            annotation={hasTitle ? SAMPLE.annotation : undefined}
            body={SAMPLE.body}
            date={SAMPLE.date}
            wordCount={SAMPLE.wordCount}
            index={1}
            pinned={pinned}
            forceHover={forceHover}
          />
        </CardShell>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Title"
            value={hasTitle ? 'on' : 'off'}
            onChange={(v) => setHasTitle(v === 'on')}
            options={[
              { value: 'off', label: 'Empty' },
              { value: 'on', label: 'Has title' },
            ]}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Pinned"
            value={pinned ? 'on' : 'off'}
            onChange={(v) => setPinned(v === 'on')}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Hover"
            value={forceHover ? 'on' : 'off'}
            onChange={(v) => setForceHover(v === 'on')}
            options={[
              { value: 'off', label: 'Rest' },
              { value: 'on', label: 'Hover' },
            ]}
            fullWidth
            className="col-span-2"
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
      title="Note Card"
      description="A single note/answer row in the Gather panel's list. Empty title shows placeholder copy; pinning surfaces a persistent Pin + Bookmark pair; hovering reveals reorder/more actions. Figma Note card (16064:4975)."
      playground={<NoteCardPlayground />}
      variants={
        <div className="flex w-full flex-col gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Empty (no title)">
            <EmptyExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Pinned">
            <PinnedExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Hover">
            <HoverExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Controlled">
            <ControlledExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Use <code>NoteCard</code> for rows in the Gather panel's note
            list. Composes the <code>GatherBookmarkButton</code> feature and
            the <code>PinButton</code> atom directly — don&apos;t rebuild
            either.
          </li>
          <li>
            The bookmark control&apos;s Figma <code>mode</code> tracks
            whether the note has a title: <code>gather</code> (hover-reveals
            &quot;Add to scene&quot;) when it does, <code>roam</code>
            (icon-only) when it doesn&apos;t yet.
          </li>
          <li>
            Per Figma, the Pin Button only renders once the card is already{' '}
            <code>pinned</code> — there&apos;s no separate always-visible pin
            trigger in the source.
          </li>
          <li>
            Reorder / more actions in the footer are hover-revealed only;
            pass <code>onReorder</code> / <code>onMoreOptions</code> to wire
            them up.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Bookmark, pin, reorder, and more are all independently focusable
            controls with their own accessible names.
          </li>
          <li>
            The small ordinal (<code>index</code>) is decorative
            (<code>aria-hidden</code>) — it&apos;s a list-position hint, not
            content.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Empty: Story = {
  render: () => <EmptyExample />,
};

export const Pinned: Story = {
  render: () => <PinnedExample />,
};

export const Hover: Story = {
  render: () => <HoverExample />,
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};
