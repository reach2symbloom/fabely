/**
 * Gather Bookmark Button — Fabely feature composite. Overview + focused demos.
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

import { GatherBookmarkButton, type GatherBookmarkButtonMode } from './GatherBookmarkButton';

const meta = {
  title: 'Design System/Features/Gather/Bookmark Button',
  component: GatherBookmarkButton,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof GatherBookmarkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

type FigmaState = 'rest' | 'hover' | 'active' | 'active-hover';

const FIGMA_STATES: { value: FigmaState; label: string }[] = [
  { value: 'rest', label: 'Rest' },
  { value: 'hover', label: 'Hover' },
  { value: 'active', label: 'Active' },
  { value: 'active-hover', label: 'Active / Hover' },
];

function parseFigmaState(value: FigmaState): { active: boolean; forceHover: boolean } {
  return {
    active: value.startsWith('active'),
    forceHover: value.endsWith('hover'),
  };
}

function DemoExample() {
  return <GatherBookmarkButton />;
}

function ModeExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-lg)]">
      <div className="flex flex-col items-center gap-[var(--spacing-xs)]">
        <GatherBookmarkButton mode="gather" />
        <span className="text-xs text-muted-foreground">Gather</span>
      </div>
      <div className="flex flex-col items-center gap-[var(--spacing-xs)]">
        <GatherBookmarkButton mode="roam" />
        <span className="text-xs text-muted-foreground">Roam</span>
      </div>
    </div>
  );
}

function ActiveExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-md)]">
      <GatherBookmarkButton active={false} />
      <GatherBookmarkButton active />
    </div>
  );
}

function ControlledExample() {
  const [active, setActive] = useState(false);

  return <GatherBookmarkButton active={active} onActiveChange={setActive} />;
}

function SuperscriptExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-md)]">
      <GatherBookmarkButton active showSuperscript />
      <GatherBookmarkButton mode="roam" active showSuperscript />
    </div>
  );
}

function GatherBookmarkPlayground() {
  const [mode, setMode] = useState<GatherBookmarkButtonMode>('gather');
  const [showSuperscript, setShowSuperscript] = useState(false);
  const [figmaState, setFigmaState] = useState<FigmaState>('rest');
  const { active, forceHover } = parseFigmaState(figmaState);

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 items-center justify-center">
          <GatherBookmarkButton
            key={`${figmaState}-${mode}`}
            mode={mode}
            defaultActive={active}
            forceHover={forceHover}
            showSuperscript={showSuperscript}
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
            label="Mode"
            value={mode}
            onChange={(v) => setMode(v as GatherBookmarkButtonMode)}
            options={[
              { value: 'gather', label: 'Gather' },
              { value: 'roam', label: 'Roam' },
            ]}
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
      title="Gather Bookmark Button"
      description="Split control — bookmark toggle + menu chevron — for pinning notes/answers into a scene from the Gather panel. Gather and Roam share one fill/divider/color model; the only difference is Gather always shows an Add/Remove-from-scene label. Figma Bookmark Button (16228:3535)."
      playground={<GatherBookmarkPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Mode">
            <ModeExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Active">
            <ActiveExample />
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
            Use <code>GatherBookmarkButton</code> for a pin-to-scene action
            with a menu chevron, inside the Gather panel. For a bare
            bookmark toggle elsewhere, use the{' '}
            <code>BookmarkButton</code> atom directly — this composite wraps
            it, it doesn&apos;t replace it.
          </li>
          <li>
            <code>mode=&quot;gather&quot;</code> (default) always shows an
            &quot;Add to scene&quot; / &quot;Remove from scene&quot; label —
            not hover-gated. <code>mode=&quot;roam&quot;</code> never shows
            it. That&apos;s the only difference between the two modes.
          </li>
          <li>
            Fill, divider, and icon color are identical in both modes: the
            chip is always housed (<code>alpha-333</code>), and each segment
            independently deepens to <code>alpha-5</code> on its own hover —
            regardless of <code>active</code> or <code>mode</code>.
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
            The bookmark toggle exposes &quot;Add to scene&quot; /
            &quot;Remove from scene&quot; as its accessible name — the
            visible label is decorative and mirrors it on hover.
          </li>
          <li>
            The chevron is a separate button (&quot;More options&quot;), not
            nested inside the toggle — both are independently focusable.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Mode: Story = {
  render: () => <ModeExample />,
};

export const Active: Story = {
  render: () => <ActiveExample />,
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

export const Superscript: Story = {
  render: () => <SuperscriptExample />,
};
