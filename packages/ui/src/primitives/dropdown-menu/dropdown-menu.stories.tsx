import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Button } from '../button';

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
  title: 'Design System/Primitives/Dropdown Menu',
  component: DropdownMenu,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Dropdown Menu"
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
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button />}>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>Item one</DropdownMenuItem>
          <DropdownMenuItem>Item two</DropdownMenuItem>
          <DropdownMenuItem>Item three</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
