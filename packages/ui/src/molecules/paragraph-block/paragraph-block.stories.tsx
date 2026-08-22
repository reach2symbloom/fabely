/**
 * Paragraph Block — Fabely molecule. Overview + focused demos.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import { ParagraphBlock, type ParagraphBlockState } from './paragraph-block';

const meta = {
  title: 'Design System/Molecules/Paragraph Block',
  component: ParagraphBlock,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ParagraphBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Fills its container, unlike Split & Parse's fixed 443px specimen width —
 * a manuscript paragraph is a full-width row in whatever content column it
 * sits in, not a component with an intrinsic hug width. Figma's 881px frame
 * was just the specimen canvas, not a constraint.
 */
const DEMO_WIDTH = 'w-full';

const SAMPLE_TEXT =
  'Long before Zeera knew the true shape of magic, the Eldergrove was already waiting for her — breathing softly beneath its ancient leaves, with wands sleeping in the branches and something vast beginning to stir in the dark between the trees.';

function DemoExample() {
  return (
    <div className={DEMO_WIDTH}>
      <ParagraphBlock>{SAMPLE_TEXT}</ParagraphBlock>
    </div>
  );
}

function StateExample() {
  return (
    <div className={`${DEMO_WIDTH} flex flex-col gap-[var(--spacing-md)]`}>
      <ParagraphBlock state="default">{SAMPLE_TEXT}</ParagraphBlock>
      <ParagraphBlock state="drag">{SAMPLE_TEXT}</ParagraphBlock>
      <ParagraphBlock state="selected">{SAMPLE_TEXT}</ParagraphBlock>
    </div>
  );
}

function ParagraphBlockPlayground() {
  const [state, setState] = useState<ParagraphBlockState>('default');

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 w-full items-center justify-center p-[var(--spacing-lg)]">
          <div className={DEMO_WIDTH}>
            <ParagraphBlock
              state={state}
              onDragStart={() => setState('drag')}
              onSelect={() => setState('selected')}
            >
              {SAMPLE_TEXT}
            </ParagraphBlock>
          </div>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="State (or press/drag the grip handle above)"
            value={state}
            onChange={(v) => setState(v as ParagraphBlockState)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'drag', label: 'Drag' },
              { value: 'selected', label: 'Selected' },
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
      title="Paragraph Block"
      description="A single manuscript paragraph as a draggable list row — default, drag, and selected states. Figma Paragraph block (16129:377)."
      playground={<ParagraphBlockPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo" fill>
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="State" fill>
            <StateExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Hovering (or keyboard-focusing) a <code>default</code>-state row
            reveals its grip handle — real interactivity, not a separate
            Figma <code>Hover</code> prop value. <code>drag</code> and{' '}
            <code>selected</code> force the handle visible instead, since
            those states aren&apos;t necessarily under the pointer.
          </li>
          <li>
            Pressing the grip handle and moving it fires{' '}
            <code>onDragStart</code> (→ <code>drag</code>); releasing fires{' '}
            <code>onSelect</code> (→ <code>selected</code>) — whether that
            was a plain click or letting go mid-drag. Try both in the
            playground above. The component doesn&apos;t set{' '}
            <code>state</code> itself, only tells the caller which state to
            move to next — same pattern as Split & Parse&apos;s{' '}
            <code>onParse</code>/<code>onUndo</code>.
          </li>
          <li>
            Not a drag engine beyond that: it doesn&apos;t reorder anything
            or decide where it sits relative to other blocks — see{' '}
            <a href="/?path=/story/design-system-features-manuscript-paragraph-list--overview">
              Paragraph List
            </a>{' '}
            for the composed, actually-reorderable version. It forwards{' '}
            <code>ref</code>/<code>style</code> and exposes{' '}
            <code>handleProps</code> (composed with the internal press
            handler) so a caller can wire in whatever drag adapter it uses
            without this component knowing dnd-kit exists. See the component
            README.
          </li>
          <li>
            Radius genuinely changes with state, not just border/fill —{' '}
            <code>default</code> uses Figma&apos;s own 12px{' '}
            <code>rounded-lg</code>, <code>drag</code>/<code>selected</code>{' '}
            use Figma&apos;s own 16px <code>radius</code>.
          </li>
          <li>
            No <code>mode</code> prop — text and border colors are
            Foundations switch tokens that flip automatically with the
            app&apos;s theme. Use Storybook&apos;s theme toolbar toggle to
            see the dark-mode look.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            The grip handle is a real <code>&lt;button&gt;</code> with an{' '}
            <code>aria-label</code> ("Drag to reorder paragraph") — reachable
            by keyboard, which is also what reveals it at rest via{' '}
            <code>:focus-within</code>.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const State: Story = {
  render: () => <StateExample />,
};

export const Playground: Story = {
  render: () => (
    <div className="w-full max-w-[640px]">
      <ParagraphBlockPlayground />
    </div>
  ),
};
