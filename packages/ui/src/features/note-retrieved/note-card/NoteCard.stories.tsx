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

import { NoteCard, type NoteCardProps } from './NoteCard';

const SAMPLE = {
  title: 'Eldergrove Wand Selection',
  annotation: 'Author note explaining the sequence before Sophia receives her wand.',
  body: "Zeera leads Sophia through the root-woven entrance of the Eldergrove and explains that no wand may be taken by force. The trees must first recognize the apprentice's inner magic, and Sophia must wait for the grove to answer her. Just as the branches begin to stir, a deep rumbling rises from the dark woods, warning them that something ancient is approaching…",
  date: '3/20/2025',
  wordCount: 1230,
} satisfies Pick<NoteCardProps, 'title' | 'annotation' | 'body' | 'date' | 'wordCount'>;

const SHORT_BODY = 'Sophia hesitates at the threshold, unsure the grove will answer her.';

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

/**
 * Every demo below uses `defaultTitle`/`defaultAnnotation`/`defaultPinned`/
 * `defaultBookmarked` (uncontrolled), not `title`/`pinned`/etc — a bare
 * value prop with no `onChange` locks the field, so typing or clicking
 * would silently do nothing. Uncontrolled keeps every demo genuinely
 * interactive.
 */
function DemoExample() {
  return (
    <CardShell>
      <NoteCard
        defaultTitle={SAMPLE.title}
        defaultAnnotation={SAMPLE.annotation}
        body={SAMPLE.body}
        date={SAMPLE.date}
        wordCount={SAMPLE.wordCount}
        index={1}
      />
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
      <NoteCard
        defaultTitle={SAMPLE.title}
        defaultAnnotation={SAMPLE.annotation}
        body={SAMPLE.body}
        date={SAMPLE.date}
        wordCount={SAMPLE.wordCount}
        defaultPinned
        defaultBookmarked
        index={1}
      />
    </CardShell>
  );
}

function RoamExample() {
  return (
    <CardShell>
      <NoteCard
        defaultTitle={SAMPLE.title}
        defaultAnnotation={SAMPLE.annotation}
        body={SAMPLE.body}
        date={SAMPLE.date}
        wordCount={SAMPLE.wordCount}
        mode="roam"
        index={1}
      />
    </CardShell>
  );
}

function NoPinExample() {
  return (
    <CardShell>
      <NoteCard
        defaultTitle={SAMPLE.title}
        defaultAnnotation={SAMPLE.annotation}
        body={SAMPLE.body}
        date={SAMPLE.date}
        wordCount={SAMPLE.wordCount}
        showPin={false}
        index={1}
      />
    </CardShell>
  );
}

function PinReadOnlyExample() {
  return (
    <CardShell>
      <NoteCard
        defaultTitle={SAMPLE.title}
        defaultAnnotation={SAMPLE.annotation}
        body={SAMPLE.body}
        date={SAMPLE.date}
        wordCount={SAMPLE.wordCount}
        defaultPinned
        pinInteractive={false}
        index={1}
      />
    </CardShell>
  );
}

function HoverExample() {
  return (
    <CardShell>
      <NoteCard
        defaultTitle={SAMPLE.title}
        defaultAnnotation={SAMPLE.annotation}
        body={SAMPLE.body}
        date={SAMPLE.date}
        wordCount={SAMPLE.wordCount}
        index={1}
        forceHover
      />
    </CardShell>
  );
}

function ShortBodyExample() {
  return (
    <CardShell>
      <NoteCard
        defaultTitle={SAMPLE.title}
        defaultAnnotation={SAMPLE.annotation}
        body={SHORT_BODY}
        date={SAMPLE.date}
        wordCount={42}
        index={1}
      />
    </CardShell>
  );
}

function OpenNoteExample() {
  const [openCount, setOpenCount] = useState(0);

  return (
    <CardShell>
      <div className="flex flex-col gap-[var(--spacing-xs)]">
        <NoteCard
          defaultTitle={SAMPLE.title}
          defaultAnnotation={SAMPLE.annotation}
          body={SAMPLE.body}
          date={SAMPLE.date}
          wordCount={SAMPLE.wordCount}
          index={1}
          onOpenNote={() => setOpenCount((count) => count + 1)}
        />
        <p className="text-sm text-muted-foreground">
          onOpenNote fired {openCount} time{openCount === 1 ? '' : 's'} — click the truncated body above.
        </p>
      </div>
    </CardShell>
  );
}

function ControlledExample() {
  const [title, setTitle] = useState(SAMPLE.title);
  const [annotation, setAnnotation] = useState(SAMPLE.annotation);
  const [pinned, setPinned] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <CardShell>
      <NoteCard
        title={title}
        onTitleChange={setTitle}
        annotation={annotation}
        onAnnotationChange={setAnnotation}
        body={SAMPLE.body}
        date={SAMPLE.date}
        wordCount={SAMPLE.wordCount}
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
  const [mode, setMode] = useState<NonNullable<NoteCardProps['mode']>>('gather');
  const [pinned, setPinned] = useState(false);
  const [forceHover, setForceHover] = useState(false);

  return (
    <PlaygroundPanel
      preview={
        <CardShell>
          <NoteCard
            key={hasTitle ? 'title' : 'empty'}
            defaultTitle={hasTitle ? SAMPLE.title : undefined}
            defaultAnnotation={hasTitle ? SAMPLE.annotation : undefined}
            body={SAMPLE.body}
            date={SAMPLE.date}
            wordCount={SAMPLE.wordCount}
            index={1}
            mode={mode}
            pinned={pinned}
            onPinnedChange={setPinned}
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
            label="Mode"
            value={mode}
            onChange={(v) => setMode(v as NonNullable<NoteCardProps['mode']>)}
            options={[
              { value: 'gather', label: 'Gather' },
              { value: 'roam', label: 'Roam' },
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
          <PrimitiveGalleryItem label="Roam mode">
            <RoamExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="No pin control">
            <NoPinExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Pin read-only">
            <PinReadOnlyExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Hover">
            <HoverExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Short body (editable)">
            <ShortBodyExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Long body (open hook)">
            <OpenNoteExample />
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
            Title and annotation are real <code>Textarea</code> fields
            (<code>variant=&quot;ghost&quot;</code>) — invisible until
            hovered/focused, click straight into either to edit. Title is
            single-row (<code>textStyle=&quot;heading&quot;</code>);
            annotation can wrap 2–3 lines.
          </li>
          <li>
            Body is editable too, but only under{' '}
            <code>bodyTruncateThreshold</code> characters (default{' '}
            <code>240</code>). Longer bodies render truncated
            (<code>line-clamp</code>) and read-only; clicking calls{' '}
            <code>onOpenNote</code> — the hook for a future full-width note
            view, which doesn&apos;t exist yet.
          </li>
          <li>
            <code>mode</code> is the surrounding page context (Gather panel
            vs. Roam) and is forwarded straight to{' '}
            <code>GatherBookmarkButton</code> — it is not derived from
            whether the note has a title.
          </li>
          <li>
            <code>showPin</code> (renders at all) and{' '}
            <code>pinInteractive</code> (can be toggled) are independent —
            see the "No pin control" and "Pin read-only" variants.
          </li>
          <li>
            Footer Expand / more actions are hover-revealed only. Expand
            only renders when body is truncated, and reuses{' '}
            <code>onOpenNote</code> — the same hook the truncated body
            itself calls; pass <code>onMoreOptions</code> for the 3-dot
            menu.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Title, annotation, bookmark, pin, reorder, and more are all
            independently focusable controls with their own accessible
            names.
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

export const Roam: Story = {
  render: () => <RoamExample />,
};

export const NoPin: Story = {
  render: () => <NoPinExample />,
};

export const PinReadOnly: Story = {
  render: () => <PinReadOnlyExample />,
};

export const Hover: Story = {
  render: () => <HoverExample />,
};

export const ShortBody: Story = {
  render: () => <ShortBodyExample />,
};

export const OpenNote: Story = {
  render: () => <OpenNoteExample />,
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};
