/**
 * Highlight Color — Figma Highlight color atom (16317:950). Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import { HighlightColor } from './highlight-color';

/** Figma's own example swatch — `--tw-raw-secondary-200` (#bdb7ea). */
const DEMO_COLOR = 'var(--tw-raw-secondary-200)';

const PALETTE = [
  { value: 'lavender', color: 'var(--tw-raw-secondary-200)', label: 'Lavender' },
  { value: 'yellow', color: '#f5e6a8', label: 'Yellow' },
  { value: 'mint', color: '#a8e6cf', label: 'Mint' },
  { value: 'blush', color: '#f5b8c4', label: 'Blush' },
];

const meta = {
  title: 'Design System/Atoms/Highlight Color Atom',
  component: HighlightColor,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: {
    color: DEMO_COLOR,
    'aria-label': 'Lavender',
  },
} satisfies Meta<typeof HighlightColor>;

export default meta;
type Story = StoryObj<typeof meta>;

function HighlightColorPlayground() {
  const [selected, setSelected] = useState('lavender');

  return (
    <PlaygroundPanel
      preview={
        <div className="flex items-center gap-[var(--spacing-sm)]">
          {PALETTE.map((swatch) => (
            <HighlightColor
              key={swatch.value}
              color={swatch.color}
              selected={selected === swatch.value}
              aria-label={swatch.label}
              onClick={() => setSelected(swatch.value)}
            />
          ))}
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
      title="Highlight Color"
      description="Selectable color swatch for a text-highlight color picker. Color is caller-supplied; Selected's glow is built from that same color."
      playground={<HighlightColorPlayground />}
      variants={
        <div className="flex flex-wrap items-center gap-8 pe-12">
          <PrimitiveGalleryItem label="Default">
            <HighlightColor color={DEMO_COLOR} aria-label="Lavender" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Selected">
            <HighlightColor color={DEMO_COLOR} selected aria-label="Lavender" />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Palette">
            <div className="flex items-center gap-[var(--spacing-sm)]">
              {PALETTE.map((swatch, i) => (
                <HighlightColor
                  key={swatch.value}
                  color={swatch.color}
                  selected={i === 0}
                  aria-label={swatch.label}
                />
              ))}
            </div>
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>`color` accepts any CSS color value or token — pass the actual highlight color, not a name.</li>
          <li>Hover shows a plain `--ring` ring; Selected replaces it with a glow matching `color`, which persists on hover too (Figma's Active state has no separate active+hover look).</li>
          <li>Group several as a single-select picker — this atom renders one swatch; selection state lives with the caller.</li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Renders a real `button` with `aria-pressed` reflecting `selected` — always pass `aria-label` naming the color.</li>
          <li>Focus shows the standard secondary focus ring, independent of the selected glow.</li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
