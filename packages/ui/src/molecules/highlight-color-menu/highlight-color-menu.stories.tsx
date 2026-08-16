/**
 * Highlight Color Menu — Figma Highlight color menu (16319:1082). Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  InlineSegmentedControl,
} from '../../../stories/InlineSegmentedControl';
import {
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import {
  HighlightColorMenu,
  type HighlightColorMenuType,
} from './highlight-color-menu';

const meta = {
  title: 'Design System/Molecules/Highlight Color Menu',
  component: HighlightColorMenu,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof HighlightColorMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function HighlightColorMenuPlayground() {
  const [type, setType] = useState<HighlightColorMenuType>('user');
  const [color, setColor] = useState('lavender');

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-16 items-center justify-center">
          <HighlightColorMenu type={type} value={color} onValueChange={setColor} />
        </div>
      }
      controls={
        <InlineSegmentedControl
          label="Type"
          value={type}
          onChange={(next) => setType(next as HighlightColorMenuType)}
          options={[
            { value: 'user', label: 'User highlight' },
            { value: 'system', label: 'System highlight' },
          ]}
        />
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Highlight Color Menu"
      description="Floating toolbar shown on a text selection / existing highlight — actions plus, for user highlights, a color picker."
      playground={<HighlightColorMenuPlayground />}
      variants={
        <div className="flex flex-col gap-8 pe-12">
          <PrimitiveGalleryItem label="User highlight">
            <HighlightColorMenu type="user" defaultValue="lavender" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="System highlight">
            <HighlightColorMenu type="system" />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>`type="system"` drops the divider, color swatches, and remove action — system highlights aren't recolorable or removable by the user.</li>
          <li>Composes Icon Button (`ghost`, `mini`, `round`), Separator, and Highlight Color — no forked chrome.</li>
          <li>Pass `colors` to replace the default 7-swatch palette; selection is controlled via `value`/`onValueChange` like the other Highlight/Controls pieces.</li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Every action is a real, labeled button (`aria-label`); the color swatches expose selection via `aria-pressed` (inherited from Highlight Color).</li>
        </ul>
      }
    />
  ),
};

export const UserHighlight: Story = { args: { type: 'user', defaultValue: 'lavender' } };
export const SystemHighlight: Story = { args: { type: 'system' } };
