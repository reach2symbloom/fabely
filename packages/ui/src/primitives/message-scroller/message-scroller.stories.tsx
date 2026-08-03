import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from './message-scroller';

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
  title: 'Design System/Primitives/Message Scroller',
  component: MessageScroller,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Message Scroller"
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
    <div className="h-64 w-80 rounded-lg border">
      <MessageScrollerProvider>
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent>
              <MessageScrollerItem messageId="1">Item one</MessageScrollerItem>
              <MessageScrollerItem messageId="2">Item two</MessageScrollerItem>
              <MessageScrollerItem messageId="3">Item three</MessageScrollerItem>
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  ),
};
