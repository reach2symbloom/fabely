import type { Meta, StoryObj } from '@storybook/react-vite';
import { SquareDashed } from 'lucide-react';
import { useState } from 'react';

import { SelectItem } from '@/primitives/select';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import { ControlDropdown } from './control-dropdown';
import { ControlIconButtonGroup, type ControlIconButtonOption } from './control-icon-button-group';
import { ControlLabel } from './control-label';
import { ControlRichDivider, type ControlRichDividerOption } from './control-rich-divider';
import { ControlSlider } from './control-slider';

const meta = {
  title: 'Design System/Molecules/Controls',
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const FONT_OPTIONS = ['Sharp Serif / Gellix', 'Gellix / Gellix', 'Sharp Serif / Sharp Serif'];

/** Figma uses `Icon / square-dashed` as its generic slot placeholder — swap for a real glyph per usage. */
const ICON_BUTTON_OPTIONS: ControlIconButtonOption[] = [
  { value: 'a', label: 'Option A', icon: <SquareDashed /> },
  { value: 'b', label: 'Option B', icon: <SquareDashed /> },
  { value: 'c', label: 'Option C', icon: <SquareDashed /> },
  { value: 'd', label: 'Option D', icon: <SquareDashed /> },
];

const RICH_DIVIDER_OPTIONS: ControlRichDividerOption[] = [
  { value: 'ornament', label: 'Ornament' },
];

function ControlsPlayground() {
  const [font, setFont] = useState(FONT_OPTIONS[0]);
  const [lineWidth, setLineWidth] = useState([50]);
  const [iconOption, setIconOption] = useState('b');
  const [divider, setDivider] = useState('ornament');

  return (
    <PlaygroundPanel
      className="w-[272px] max-w-full"
      preview={
        <div className="flex w-full flex-col gap-[var(--spacing-md)]">
          <ControlDropdown
            label="Typography"
            value={font}
            onValueChange={(next) => setFont(next as string)}
          >
            {FONT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </ControlDropdown>
          <ControlIconButtonGroup
            label="Label"
            options={ICON_BUTTON_OPTIONS}
            value={iconOption}
            onValueChange={setIconOption}
          />
          <ControlSlider
            label="Line width"
            value={lineWidth}
            onValueChange={(next) => setLineWidth(Array.isArray(next) ? next : [next])}
          />
          <ControlRichDivider
            label="Section divider"
            options={RICH_DIVIDER_OPTIONS}
            value={divider}
            onValueChange={setDivider}
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
      title="Controls"
      description="Interactive control molecules from Figma's Controls frame (16301:20374) — Label, Dropdown, Slider, Icon Button Group, and Rich Divider, each composed from an existing primitive."
      playground={<ControlsPlayground />}
      variants={
        <div className="grid gap-8 pe-12 sm:grid-cols-2">
          <PrimitiveGalleryItem label="Control Label">
            <ControlLabel>Typography</ControlLabel>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Control Dropdown">
            <ControlDropdown label="Typography" placeholder={FONT_OPTIONS[0]} className="w-60">
              {FONT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </ControlDropdown>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Control Slider">
            <ControlSlider label="Line width" defaultValue={[50]} className="w-60" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Control Icon Button Group">
            <ControlIconButtonGroup label="Label" options={ICON_BUTTON_OPTIONS} defaultValue="b" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Control Rich Divider">
            <ControlRichDivider
              label="Section divider"
              options={RICH_DIVIDER_OPTIONS}
              defaultValue="ornament"
              className="w-60"
            />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Each piece composes an existing primitive (Select, Slider, Icon Button, Separator) — none restyle the primitive itself.</li>
          <li>Control Label pairs with a single Controls piece — one label per field.</li>
          <li>Control Icon Button Group's `icon` is caller-supplied; the demo's dashed-square glyph is Figma's own placeholder icon.</li>
          <li>Control Rich Divider's ornament is the exported Figma asset (`assets/section-divider-ornament.tsx`), recolored to `currentColor`; pass `ornament` per option to offer other divider styles.</li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Dropdown and Rich Divider inherit Select's keyboard and screen-reader behavior unchanged.</li>
          <li>Slider inherits its primitive's keyboard and screen-reader behavior unchanged.</li>
          <li>Icon Button Group exposes selection via `aria-pressed` on each button and `role="group"` with the label as its accessible name.</li>
        </ul>
      }
    />
  ),
};
