import type { Meta, StoryObj } from '@storybook/react-vite';
import { PendingNotice } from './ColorSwatchTable';
import { StrokeSwatchTable, type StrokeToken } from './StrokeSwatchTable';

const meta = {
  title: 'Design System/Foundations/Stroke',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Source: Figma "stroke" variable collection, 6 entries. Unlike
// Colors/Spacing/Radius, Figma defines no separate unpublished primitive
// collection for Stroke — these are literal border-width values, not
// aliases, so there's no Raw layer or Reference column here.
const tokens: StrokeToken[] = [
  { name: 'hairline', cssVar: '--stroke-hairline' },
  { name: 'thin', cssVar: '--stroke-thin' },
  { name: 'regular', cssVar: '--stroke-regular' },
  { name: 'medium', cssVar: '--stroke-medium' },
  { name: 'thick', cssVar: '--stroke-thick' },
  { name: 'bold', cssVar: '--stroke-bold' },
];

export const AllTokens: Story = {
  render: () => (
    <div>
      <PendingNotice>
        Source: Figma "stroke" variable collection (6 entries) — the border-width scale
        designers/components consume. Unlike Colors, Spacing, and Radius, Figma defines no
        separate unpublished primitive collection for Stroke; these are the literal source-of-truth
        values themselves, not aliases. Stroke is theme-independent — these values do not change
        between Light and Dark.
      </PendingNotice>

      <StrokeSwatchTable tokens={tokens} />
    </div>
  ),
};
