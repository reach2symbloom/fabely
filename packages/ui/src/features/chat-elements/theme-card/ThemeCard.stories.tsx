/**
 * Theme Card — Overview via PrimitivePage.
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

import { ThemeCard } from './ThemeCard';

const meta = {
  title: 'Design System/Features/Theme Card',
  component: ThemeCard,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: {
    index: 1,
    title: "The grove's rules, memory, and agency",
    description:
      'The Eldergrove is not just a magical forest. It behaves like an ancient system with its own laws: it listens, judges readiness, withholds access, and reacts when something violates its order.',
    chipLabel: 'Grove rules and behavior',
    noteCount: 14,
  },
} satisfies Meta<typeof ThemeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoExample() {
  return (
    <ThemeCard
      index={1}
      title="The grove's rules, memory, and agency"
      description="The Eldergrove is not just a magical forest. It behaves like an ancient system with its own laws: it listens, judges readiness, withholds access, and reacts when something violates its order."
      chipLabel="Grove rules and behavior"
      noteCount={14}
      href="#grove-rules"
    />
  );
}

function HoverExample() {
  return (
    <div className="flex flex-col gap-[var(--spacing-md)]">
      <ThemeCard
        index={1}
        title="The grove's rules, memory, and agency"
        description="The Eldergrove is not just a magical forest. It behaves like an ancient system with its own laws: it listens, judges readiness, withholds access, and reacts when something violates its order."
        chipLabel="Grove rules and behavior"
        noteCount={14}
        href="#grove-rules"
      />
      <ThemeCard
        index={1}
        title="The grove's rules, memory, and agency"
        description="The Eldergrove is not just a magical forest. It behaves like an ancient system with its own laws: it listens, judges readiness, withholds access, and reacts when something violates its order."
        chipLabel="Grove rules and behavior"
        noteCount={14}
        href="#grove-rules"
        forceHover
      />
    </div>
  );
}

function NoCountExample() {
  return (
    <ThemeCard
      title="A theme with no note count"
      description="noteCount omitted hides both the count and the arrow, leaving just the chip label."
      chipLabel="Untitled theme notes"
    />
  );
}

function ThemeCardPlayground() {
  const [index, setIndex] = useState(1);
  const [noteCount, setNoteCount] = useState(14);
  const [forceHover, setForceHover] = useState(false);

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 w-full items-center justify-center">
          <ThemeCard
            index={index}
            title="The grove's rules, memory, and agency"
            description="The Eldergrove is not just a magical forest. It behaves like an ancient system with its own laws: it listens, judges readiness, withholds access, and reacts when something violates its order."
            chipLabel="Grove rules and behavior"
            noteCount={noteCount}
            forceHover={forceHover}
            href="#grove-rules"
          />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Index"
            value={String(index)}
            onChange={(v) => setIndex(Number(v))}
            options={['1', '2', '3'].map((value) => ({ value, label: value }))}
            fullWidth
          />
          <InlineSegmentedControl
            label="Note count"
            value={String(noteCount)}
            onChange={(v) => setNoteCount(Number(v))}
            options={['0', '1', '14'].map((value) => ({ value, label: value }))}
            fullWidth
          />
          <InlineSegmentedControl
            label="Hover"
            value={forceHover ? 'true' : 'false'}
            onChange={(v) => setForceHover(v === 'true')}
            options={[
              { value: 'false', label: 'Off' },
              { value: 'true', label: 'On' },
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
      title="Theme Card"
      description="Chat/assistant chrome surfacing one manuscript theme, with a footer chip linking out to its notes."
      playground={<ThemeCardPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Hover (Off / On)">
            <HoverExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="No note count">
            <NoCountExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Pass <code>href</code> to make the footer chip its own link, with
            its own hover / focus feedback scoped to the chip. The card's
            background tint still fires on hover anywhere over the card
            (including over the chip) — the two are independent, not
            derived from each other.
          </li>
          <li>
            <code>index</code> renders the "N. " numbering prefix; omit it
            for an unnumbered card.
          </li>
          <li>
            Omit <code>noteCount</code> to hide the trailing count and arrow
            when a theme has no notes yet.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            The chip link's accessible name is its own visible text (label +
            note count); it's a normal in-flow link, not a stretched overlay,
            so it doesn't need an <code>aria-label</code>.
          </li>
          <li>
            The chip exposes <code>focus-visible:shadow-[var(--effect-focus-ring-secondary)]</code>{' '}
            for keyboard focus, independent of the card's hover-only tint.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Hover: Story = {
  render: () => <HoverExample />,
};

export const NoCount: Story = {
  render: () => <NoCountExample />,
};
