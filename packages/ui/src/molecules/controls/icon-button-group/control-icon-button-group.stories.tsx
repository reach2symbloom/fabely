import type { Meta, StoryObj } from '@storybook/react-vite';
import { SquareDashed } from 'lucide-react';
import { useState } from 'react';

import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import {
  ControlIconButtonGroup,
  type ControlIconButtonOption,
} from './control-icon-button-group';

/** Figma uses `Icon / square-dashed` as its generic slot placeholder — swap for a real glyph per usage. */
const DEMO_OPTIONS: ControlIconButtonOption[] = [
  { value: 'a', label: 'Option A', icon: <SquareDashed /> },
  { value: 'b', label: 'Option B', icon: <SquareDashed /> },
  { value: 'c', label: 'Option C', icon: <SquareDashed /> },
  { value: 'd', label: 'Option D', icon: <SquareDashed /> },
];

const meta = {
  title: 'Design System/Molecules/Controls/Control Icon Button Group',
  component: ControlIconButtonGroup,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: { label: 'Label', options: DEMO_OPTIONS, defaultValue: 'b' },
} satisfies Meta<typeof ControlIconButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlIconButtonGroupPlayground() {
  const [value, setValue] = useState('b');

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-24 w-64 items-center justify-center">
          <ControlIconButtonGroup
            label="Label"
            options={DEMO_OPTIONS}
            value={value}
            onValueChange={setValue}
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
      title="Control Icon Button Group"
      description="Labeled row of single-select Icon Buttons — the Controls 'Label' icon field."
      playground={<ControlIconButtonGroupPlayground />}
      variants={
        <div className="grid gap-8 pe-12 sm:grid-cols-2">
          <PrimitiveGalleryItem label="Second selected">
            <ControlIconButtonGroup label="Label" options={DEMO_OPTIONS} defaultValue="b" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="No label">
            <ControlIconButtonGroup options={DEMO_OPTIONS} defaultValue="a" />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Composes `@/primitives/button/icon-button` — selection is `data-selected`, not a primitive change.</li>
          <li>`icon` is caller-supplied; the demo's dashed-square glyph is Figma's own placeholder icon.</li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Selected state is exposed via `aria-pressed` on each button.</li>
          <li>The group carries `role="group"` with the label as its accessible name.</li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {
  args: { label: 'Label', options: DEMO_OPTIONS, defaultValue: 'b' },
};
