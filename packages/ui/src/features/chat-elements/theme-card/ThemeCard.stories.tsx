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
      />
      <ThemeCard
        index={1}
        title="The grove's rules, memory, and agency"
        description="The Eldergrove is not just a magical forest. It behaves like an ancient system with its own laws: it listens, judges readiness, withholds access, and reacts when something violates its order."
        chipLabel="Grove rules and behavior"
        noteCount={14}
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
            The whole card is one hoverable surface — pass <code>href</code>{' '}
            to make it a link (stretched over the card), not just the footer
            chip.
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
            The stretched link's accessible name comes from{' '}
            <code>chipLabel</code>; the card's own text is still readable by
            assistive tech as regular content ahead of the link.
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
