import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { SelectItem } from '@/primitives/select';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import { ControlDropdown } from './control-dropdown';

const FONT_OPTIONS = ['Sharp Serif / Gellix', 'Gellix / Gellix', 'Sharp Serif / Sharp Serif'];

const meta = {
  title: 'Design System/Molecules/Controls/Control Dropdown',
  component: ControlDropdown,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: {
    label: 'Typography',
    placeholder: FONT_OPTIONS[0],
    children: FONT_OPTIONS.map((option) => (
      <SelectItem key={option} value={option}>
        {option}
      </SelectItem>
    )),
  },
} satisfies Meta<typeof ControlDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlDropdownPlayground() {
  const [value, setValue] = useState(FONT_OPTIONS[0]);

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-24 w-64 items-center justify-center">
          <ControlDropdown
            label="Typography"
            value={value}
            onValueChange={(next) => setValue(next as string)}
          >
            {FONT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </ControlDropdown>
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
      title="Control Dropdown"
      description="Labeled Select field with quiet Input chrome — the Controls 'Typography' field."
      playground={<ControlDropdownPlayground />}
      variants={
        <div className="grid gap-8 pe-12 sm:grid-cols-2">
          <PrimitiveGalleryItem label="Default">
            <ControlDropdown label="Typography" placeholder={FONT_OPTIONS[0]}>
              {FONT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </ControlDropdown>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="No label">
            <ControlDropdown placeholder={FONT_OPTIONS[0]}>
              {FONT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </ControlDropdown>
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Composes `@/primitives/select` — only the trigger face is restyled here.</li>
          <li>Popup/item behavior is unchanged; pass `SelectItem` children as usual.</li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Inherits Select's keyboard and screen-reader behavior unchanged.</li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {
  args: {
    label: 'Typography',
    placeholder: FONT_OPTIONS[0],
    children: FONT_OPTIONS.map((option) => (
      <SelectItem key={option} value={option}>
        {option}
      </SelectItem>
    )),
  },
};
