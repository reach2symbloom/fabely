/**
 * Cycle Switch — Figma Cycle switch (16399:23372). Overview via PrimitivePage.
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

import { CycleSwitch, type CycleSwitchOption } from './cycle-switch';

const OUTLINE_OPTIONS: CycleSwitchOption[] = [
  { value: 'chapters', label: 'Chapters only' },
  { value: 'scenes', label: 'Scenes' },
  { value: 'full', label: 'Full outline' },
];

const meta = {
  title: 'Design System/Atoms/Cycle Switch',
  component: CycleSwitch,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: {
    options: OUTLINE_OPTIONS,
    defaultValue: 'chapters',
  },
} satisfies Meta<typeof CycleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoExample() {
  return <CycleSwitch options={OUTLINE_OPTIONS} defaultValue="chapters" />;
}

function CycleSwitchPlayground() {
  const [value, setValue] = useState('chapters');
  const [tip, setTip] = useState(true);

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 items-center justify-center">
          <CycleSwitch
            options={OUTLINE_OPTIONS}
            value={value}
            onValueChange={setValue}
            tooltip={tip ? undefined : false}
          />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Value"
            value={value}
            onChange={setValue}
            options={OUTLINE_OPTIONS.map(({ value: v, label }) => ({
              value: v,
              label: String(label),
            }))}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Tooltip"
            value={tip ? 'on' : 'off'}
            onChange={(next) => setTip(next === 'on')}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
            fullWidth
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
      title="Cycle Switch"
      description="Pill that advances through options in one direction. Figma Cycle switch (16399:23372) — Filter mode × Hover. Not a binary Switch."
      playground={<CycleSwitchPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Chapters only">
            <CycleSwitch
              options={OUTLINE_OPTIONS}
              defaultValue="chapters"
              tooltip={false}
            />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Scenes">
            <CycleSwitch
              options={OUTLINE_OPTIONS}
              defaultValue="scenes"
              tooltip={false}
            />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Full outline">
            <CycleSwitch
              options={OUTLINE_OPTIONS}
              defaultValue="full"
              tooltip={false}
            />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="With tooltip">
            <DemoExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Pass ordered <code>options</code>; each click advances and wraps.
            Keep outline-specific labels at the call site (e.g. Chapter Menu
            Header).
          </li>
          <li>
            Do not put this under Switch — binary on/off is a different job.
          </li>
          <li>
            Default tooltip matches Figma (“Cycle between outline views”); pass{' '}
            <code>tooltip=&#123;false&#125;</code> to hide.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Control exposes <code>aria-label</code> (defaults to the current
            label) and <code>aria-valuetext</code> when the label is a string.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};
