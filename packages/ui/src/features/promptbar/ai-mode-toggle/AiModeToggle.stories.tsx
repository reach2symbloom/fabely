/**
 * AI Mode Toggle — Fabely feature composite. Overview + focused demos.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import { AIModeToggle, type AIMode } from './AiModeToggle';

const meta = {
  title: 'Design System/Features/Promptbar/AI Mode Toggle',
  component: AIModeToggle,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  /*
   * Figma's source frame is "AI Mode Toggle Dark" — dark-only chrome, same
   * as Library (see BookshelfTemplate.stories.tsx). Forces the toolbar's
   * real `.dark` toggle on `document.documentElement` (`.storybook/
   * preview.tsx`), not a local wrapper: `--neutrals-new-*` (which the
   * "with ring" alternative's color depends on) only picks up its `.dark`
   * override at the document root — confirmed empirically without this,
   * the ring rendered in its light-mode color (#E7E5E4) against this
   * dark-looking track, which is itself dark only because its own
   * background token (`--theme-alpha-black-switch-333`) doesn't switch
   * with theme — nothing here was actually toggled to dark before this.
   */
  globals: { theme: 'dark' },
} satisfies Meta<typeof AIModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const MODE_OPTIONS: { value: AIMode; label: string }[] = [
  { value: 'gather', label: 'Gather' },
  { value: 'scene-desk', label: 'Scene Desk' },
  { value: 'fia', label: 'Fia' },
];

function GatherActiveExample() {
  return <AIModeToggle defaultValue="gather" />;
}

function SceneDeskActiveExample() {
  return <AIModeToggle defaultValue="scene-desk" />;
}

function FiaActiveExample() {
  return <AIModeToggle defaultValue="fia" />;
}

function ControlledExample() {
  const [mode, setMode] = useState<AIMode>('gather');
  return <AIModeToggle value={mode} onValueChange={setMode} />;
}

type FocusRingVariant = 'none' | 'with-ring';

const FOCUS_RING_OPTIONS: { value: FocusRingVariant; label: string }[] = [
  { value: 'none', label: 'No ring (primary)' },
  { value: 'with-ring', label: 'With ring (alternative)' },
];

function AiModeTogglePlayground() {
  const [mode, setMode] = useState<AIMode>('gather');
  const [focusRing, setFocusRing] = useState<FocusRingVariant>('none');

  return (
    <PlaygroundPanel
      preview={
        <div
          className="flex min-h-16 items-center justify-center"
          style={
            focusRing === 'with-ring'
              ? ({ '--ai-mode-toggle-ring-force': 'var(--effect-focus-ring-neutral)' } as CSSProperties)
              : undefined
          }
        >
          <AIModeToggle value={mode} onValueChange={setMode} />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Mode"
            value={mode}
            onChange={(v) => setMode(v as AIMode)}
            options={MODE_OPTIONS}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Focus ring (Figma reference state — shown persistently, not gated on real focus)"
            value={focusRing}
            onChange={(v) => setFocusRing(v as FocusRingVariant)}
            options={FOCUS_RING_OPTIONS}
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
      title="AI Mode Toggle"
      description="Switches the Promptbar between AI operating modes — Gather, Scene Desk, Fia. Active mode shows icon + label in its own semantic color; inactive modes show icon-only at 50% opacity. Built on the Tabs primitive (variant=&quot;default&quot;), not a hand-rolled segmented control. Figma AI Mode Toggle Dark (16133:4559)."
      playground={<AiModeTogglePlayground />}
      variants={
        <div className="flex flex-wrap items-center gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Gather active">
            <GatherActiveExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Scene Desk active">
            <SceneDeskActiveExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Fia active">
            <FiaActiveExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Controlled">
            <ControlledExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Uncontrolled by default (<code>defaultValue</code>, starts at{' '}
            <code>&quot;gather&quot;</code>) — pass <code>value</code> +{' '}
            <code>onValueChange</code> to control it, as the Playground and{' '}
            <code>Controlled</code> variant do.
          </li>
          <li>
            Only the active trigger shows its text label; inactive triggers
            are icon-only. The active pill&apos;s background/text color is
            mode-specific (Gather → <code>secondary/200</code>, Scene Desk →{' '}
            <code>scene-desk/500</code>, Fia → <code>Fia/200</code>) — everything
            else (track chrome, inactive opacity, spacing, radius) comes
            straight from the Tabs primitive, unmodified.
          </li>
          <li>
            The active highlight, trigger width, and label are one
            coordinated Motion transition (shared <code>layout</code> +
            crossfade) — switching modes never snaps. Respects{' '}
            <code>prefers-reduced-motion</code>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Real Tabs semantics from the primitive — <kbd>Tab</kbd> to focus
            the group, <kbd>←</kbd>/<kbd>→</kbd> to move between modes.
          </li>
          <li>
            Every trigger carries an explicit <code>aria-label</code>{' '}
            (the mode name), so icon-only inactive tabs still have an
            accessible name — not relying on visible text alone.
          </li>
          <li>
            Active state is never color-only: the active trigger also gets a
            distinct background, border, and shadow, plus an extra focus
            ring on keyboard focus.
          </li>
        </ul>
      }
    />
  ),
};

export const GatherActive: Story = {
  render: () => <GatherActiveExample />,
};

export const SceneDeskActive: Story = {
  render: () => <SceneDeskActiveExample />,
};

export const FiaActive: Story = {
  render: () => <FiaActiveExample />,
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};
