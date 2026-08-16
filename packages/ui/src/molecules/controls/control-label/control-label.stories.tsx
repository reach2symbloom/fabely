import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import { ControlLabel } from './control-label';

const meta = {
  title: 'Design System/Molecules/Controls/Control Label',
  component: ControlLabel,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: { children: 'Typography' },
} satisfies Meta<typeof ControlLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Control Label"
      description="Uppercase caption sitting above a Controls piece — Dropdown, Slider, Icon Button Group, Rich Divider."
      playground={
        <div className="flex min-h-24 w-full items-center justify-center">
          <ControlLabel>Typography</ControlLabel>
        </div>
      }
      variants={
        <div className="flex flex-wrap gap-8 pe-12">
          <PrimitiveGalleryItem label="Typography">
            <ControlLabel>Typography</ControlLabel>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Label">
            <ControlLabel>Label</ControlLabel>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Line width">
            <ControlLabel>Line width</ControlLabel>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Section divider">
            <ControlLabel>Section divider</ControlLabel>
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Pairs with a single Controls piece — one label per field.</li>
          <li>Renders a native `label`; pass `htmlFor` when the control below has a matching id.</li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Uppercase is presentational only — underlying text is normal case for screen readers.</li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {};
