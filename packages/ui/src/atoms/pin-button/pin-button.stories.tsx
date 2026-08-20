/**
 * Pin Button — Fabely atom. Overview + focused demos.
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

import { PinButton } from './pin-button';

const meta = {
  title: 'Design System/Atoms/Pin Button',
  component: PinButton,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof PinButton>;

export default meta;
type Story = StoryObj<typeof meta>;

type FigmaState = 'unselected-rest' | 'unselected-hover' | 'selected-rest' | 'selected-hover';

const FIGMA_STATES: { value: FigmaState; label: string }[] = [
  { value: 'unselected-rest', label: 'Unselected / Rest' },
  { value: 'unselected-hover', label: 'Unselected / Hover' },
  { value: 'selected-rest', label: 'Selected / Rest' },
  { value: 'selected-hover', label: 'Selected / Hover' },
];

function parseFigmaState(value: FigmaState): { pressed: boolean; forceHover: boolean } {
  return {
    pressed: value.startsWith('selected'),
    forceHover: value.endsWith('hover'),
  };
}

function DemoExample() {
  return <PinButton defaultPressed />;
}

function OffOnExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-md)]">
      <PinButton aria-label="Pin" />
      <PinButton defaultPressed aria-label="Unpin" />
    </div>
  );
}

function ControlledExample() {
  const [pressed, setPressed] = useState(false);

  return <PinButton pressed={pressed} onPressedChange={setPressed} />;
}

function SuperscriptExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-md)]">
      <PinButton defaultPressed={false} showSuperscript aria-label="Pin" />
      <PinButton defaultPressed showSuperscript aria-label="Unpin" />
    </div>
  );
}

function PinPlayground() {
  const [showSuperscript, setShowSuperscript] = useState(false);
  const [figmaState, setFigmaState] = useState<FigmaState>('unselected-rest');
  const { pressed, forceHover } = parseFigmaState(figmaState);

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 items-center justify-center">
          <PinButton
            key={figmaState}
            showSuperscript={showSuperscript}
            defaultPressed={pressed}
            forceHover={forceHover}
          />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="State"
            value={figmaState}
            onChange={(v) => setFigmaState(v as FigmaState)}
            options={FIGMA_STATES}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Superscript"
            value={showSuperscript ? 'on' : 'off'}
            onChange={(v) => setShowSuperscript(v === 'on')}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
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
      title="Pin Button"
      description="Icon toggle in a 32px rounded-md chip. Unselected tailed outline (alpha-20), selected headless solid glyph (alpha-50); chip background is hover-only, independent of selection. Figma Pin Button (16233:7891)."
      playground={<PinPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Off / On">
            <OffOnExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Controlled">
            <ControlledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Superscript">
            <SuperscriptExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Use <code>PinButton</code> for a pin / unpin affordance in lists
            and cards.
          </li>
          <li>
            The glyph swaps shape on select (tailed outline → headless solid)
            — not a recolor trick, it&apos;s two different paths straight
            from Figma&apos;s raw SVG export.
          </li>
          <li>
            Chip background only ever responds to <code>:hover</code>,
            regardless of selection — selection is carried entirely by the
            glyph.
          </li>
          <li>
            Use <code>forceHover</code> in Storybook to lock the hover paint
            without a pointer — see the Playground&apos;s State selector.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Built on Base UI Toggle — <code>aria-pressed</code> /{' '}
            <code>data-pressed</code>, Space / Enter to flip.
          </li>
          <li>Icon-only; always exposes an accessible name.</li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const OffOn: Story = {
  render: () => <OffOnExample />,
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

export const Superscript: Story = {
  render: () => <SuperscriptExample />,
};
