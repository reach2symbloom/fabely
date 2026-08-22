/**
 * Highlight Action Menu — Figma Highlight menu (16315:1196). Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';

import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import { HighlightActionMenu } from './highlight-action-menu';

const meta = {
  title: 'Design System/Features/Highlight/Highlight Action Menu',
  component: HighlightActionMenu,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof HighlightActionMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function HighlightActionMenuPlayground() {
  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-64 items-center justify-center">
          <HighlightActionMenu
            onAskFia={() => {}}
            onSearch={() => {}}
            onComment={() => {}}
            onHighlight={() => {}}
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
      title="Highlight Action Menu"
      description="Vertical pill of the Fia/Gather/Comment/Highlight actions, each with a right-side tooltip carrying a full sentence of copy — hover any icon to see it."
      playground={<HighlightActionMenuPlayground />}
      variants={
        <div className="flex flex-wrap items-start gap-8 pe-12">
          <PrimitiveGalleryItem label="Default">
            <HighlightActionMenu />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Shares glyph + hover-color mapping with Highlight Color Menu via `../icon-semantics` — not duplicated.</li>
          <li>Tooltip copy is a full sentence per action ("Ask Fia about this selection"), unlike the toolbar's short labels.</li>
          <li>The pill's border, focus-style ring, and shadow are always on — not gated behind hover or focus.</li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Every action is a real, labeled button (`aria-label`) with its own Tooltip.</li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {};
