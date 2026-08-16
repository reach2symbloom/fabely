import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import { ControlSlider } from './control-slider';

const meta = {
  title: 'Design System/Molecules/Controls/Control Slider',
  component: ControlSlider,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: { label: 'Line width', defaultValue: [50], className: 'w-60' },
} satisfies Meta<typeof ControlSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlSliderPlayground() {
  const [value, setValue] = useState([50]);

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-24 w-64 items-center justify-center">
          <ControlSlider
            label="Line width"
            value={value}
            onValueChange={(next) => setValue(next as number[])}
          />
        </div>
      }
      controls={null}
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Control Slider"
      description="Labeled Slider field — the Controls 'Line width' field."
      playground={<ControlSliderPlayground />}
      variants={
        <div className="grid gap-8 pe-12 sm:grid-cols-2">
          <PrimitiveGalleryItem label="Default">
            <ControlSlider label="Line width" defaultValue={[50]} className="w-60" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="No label">
            <ControlSlider defaultValue={[50]} className="w-60" />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Composes `@/primitives/slider` unchanged — no local thumb/track restyling.</li>
          <li>Forwards all Slider props (`min`, `max`, `step`, `interaction`, …).</li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Inherits Slider's keyboard and screen-reader behavior unchanged.</li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {
  args: { label: 'Line width', defaultValue: [50], className: 'w-60' },
};
