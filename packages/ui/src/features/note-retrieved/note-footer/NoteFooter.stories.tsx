/**
 * Note Footer — Fabely feature composite. Overview + focused demos.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import { NoteFooter } from './NoteFooter';

const meta = {
  title: 'Design System/Features/Gather/Note Footer',
  component: NoteFooter,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof NoteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

const FIGMA_PREV = 'The dragon of the Eldergrove';
const FIGMA_NEXT = 'The Wand that Would Not Fall';

/** Matches Figma's own 495px specimen frame. */
const DEMO_FRAME = 'w-[495px]';

function CardBehind({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${DEMO_FRAME} relative overflow-hidden rounded-[length:var(--rounded-lg)] bg-[color:var(--card)]`}
    >
      <div className="h-32 overflow-hidden p-[var(--spacing-md)] text-[length:var(--text-paragraph-small-regular-font-size)] text-[color:var(--muted-foreground)]">
        Scrollable note content sits behind the footer&apos;s scrim — this
        block just stands in for it.
      </div>
      <div className="absolute inset-x-0 bottom-0">{children}</div>
    </div>
  );
}

function DemoExample() {
  return (
    <CardBehind>
      <NoteFooter prevTitle={FIGMA_PREV} nextTitle={FIGMA_NEXT} />
    </CardBehind>
  );
}

function FirstChapterExample() {
  return (
    <CardBehind>
      <NoteFooter nextTitle={FIGMA_NEXT} />
    </CardBehind>
  );
}

function LastChapterExample() {
  return (
    <CardBehind>
      <NoteFooter prevTitle={FIGMA_PREV} />
    </CardBehind>
  );
}

function ShortcutExample() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center gap-[var(--spacing-sm)]">
      <CardBehind>
        <NoteFooter
          prevTitle={FIGMA_PREV}
          nextTitle={FIGMA_NEXT}
          onPrevClick={() => setCount((n) => n - 1)}
          onNextClick={() => setCount((n) => n + 1)}
        />
      </CardBehind>
      <span className="text-xs text-muted-foreground">
        Press ⌘←/⌘→ (or Ctrl+←/→) — count: {count}
      </span>
    </div>
  );
}

function NoteFooterPlayground() {
  const [hasPrev, setHasPrev] = useState(true);
  const [hasNext, setHasNext] = useState(true);

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 items-center justify-center">
          <CardBehind>
            <NoteFooter
              prevTitle={hasPrev ? FIGMA_PREV : undefined}
              nextTitle={hasNext ? FIGMA_NEXT : undefined}
            />
          </CardBehind>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <label className="col-span-2 flex items-center gap-[var(--spacing-2xs)] text-sm">
            <input
              type="checkbox"
              checked={hasPrev}
              onChange={(e) => setHasPrev(e.target.checked)}
            />
            Prev chapter available
          </label>
          <label className="col-span-2 flex items-center gap-[var(--spacing-2xs)] text-sm">
            <input
              type="checkbox"
              checked={hasNext}
              onChange={(e) => setHasNext(e.target.checked)}
            />
            Next chapter available
          </label>
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Note Footer"
      description="Bottom-edge scrim over scrollable note content, with a prev/next Lateral Toggles pair docked at its edges. Figma Note Footer (16091:10278)."
      playground={<NoteFooterPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="First chapter (no Prev)">
            <FirstChapterExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Last chapter (no Next)">
            <LastChapterExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Shortcut">
            <ShortcutExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            No <code>mode</code> prop — the scrim and{' '}
            <a
              href="../?path=/docs/design-system-atoms-lateral-toggles--overview"
              className="underline"
            >
              Lateral Toggles
            </a>{' '}
            both consume switch tokens, so light/dark rendering is automatic.
            See the component README for why Figma&apos;s two &quot;Mode&quot;
            variants aren&apos;t reproduced as a prop.
          </li>
          <li>
            Omit <code>prevTitle</code>/<code>nextTitle</code> to hide that
            side — first/last chapter has nowhere to navigate to.
          </li>
          <li>
            The <code>⌘←</code>/<code>⌘→</code> shortcut is live on whichever
            side is rendered — see Shortcut.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Each toggle is a real, independently focusable{' '}
            <code>&lt;button&gt;</code> — see Lateral Toggles&apos; own
            accessibility notes for its accessible name.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const FirstChapter: Story = {
  name: 'First chapter (no Prev)',
  render: () => <FirstChapterExample />,
};

export const LastChapter: Story = {
  name: 'Last chapter (no Next)',
  render: () => <LastChapterExample />,
};

export const Shortcut: Story = {
  render: () => <ShortcutExample />,
};
