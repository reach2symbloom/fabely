/**
 * Note Footer — Fabely feature composite. Overview + focused demos.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

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

/** Matches Figma's own 495px specimen frame. No rounded corners — Figma's
 * own root frame has none, and this wrapper is just a width constraint. */
const DEMO_FRAME = 'w-[495px] bg-[color:var(--card)]';

function DemoExample() {
  return (
    <div className={DEMO_FRAME}>
      <NoteFooter prevTitle={FIGMA_PREV} nextTitle={FIGMA_NEXT} />
    </div>
  );
}

function FirstChapterExample() {
  return (
    <div className={DEMO_FRAME}>
      <NoteFooter nextTitle={FIGMA_NEXT} />
    </div>
  );
}

function LastChapterExample() {
  return (
    <div className={DEMO_FRAME}>
      <NoteFooter prevTitle={FIGMA_PREV} />
    </div>
  );
}

function ShortcutExample() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center gap-[var(--spacing-sm)]">
      <div className={DEMO_FRAME}>
        <NoteFooter
          prevTitle={FIGMA_PREV}
          nextTitle={FIGMA_NEXT}
          onPrevClick={() => setCount((n) => n - 1)}
          onNextClick={() => setCount((n) => n + 1)}
        />
      </div>
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
          <div className={DEMO_FRAME}>
            <NoteFooter
              prevTitle={hasPrev ? FIGMA_PREV : undefined}
              nextTitle={hasNext ? FIGMA_NEXT : undefined}
            />
          </div>
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
