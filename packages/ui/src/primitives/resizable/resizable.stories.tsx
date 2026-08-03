import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './resizable';

import {
  PrimitivePage,
  PRIMITIVE_PAGE_SECTION_PLACEHOLDER,
} from '../../../stories/PrimitivePage';

/**
 * Thin-pass Storybook stub (see docs/DESIGN.md "Component Story Structure"
 * and src/primitives/README.md). Overview uses PrimitivePage; sections not
 * yet written use PRIMITIVE_PAGE_SECTION_PLACEHOLDER.
 */

const meta = {
  title: 'Design System/Primitives/Resizable',
  component: ResizablePanelGroup,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Resizable"
      description="Unstyled placeholder — not yet matched to Figma."
      playground={PRIMITIVE_PAGE_SECTION_PLACEHOLDER}
      variants={PRIMITIVE_PAGE_SECTION_PLACEHOLDER}
      usageGuidance={PRIMITIVE_PAGE_SECTION_PLACEHOLDER}
      accessibility={PRIMITIVE_PAGE_SECTION_PLACEHOLDER}
    />
  ),
};

export const Default: Story = {
  render: () => (
    <ResizablePanelGroup orientation="horizontal" className="h-40 w-80 rounded-lg border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center text-sm">Item one</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center text-sm">Item two</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
