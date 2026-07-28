import type { Meta, StoryObj } from '@storybook/react-vite';
import { PendingNotice } from './ColorSwatchTable';
import { RadiusSwatchTable, type RadiusToken } from './RadiusSwatchTable';

const meta = {
  title: 'Design System/Foundations/Radius/Semantic',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Layer 2 — Semantic (published scale). Source: Figma "border radii" variable
// collection, 10 entries. Every token aliases a Raw-layer primitive by name,
// except `rounded-none`, which Figma defines as a literal 0 — there is no
// raw primitive equal to 0px to alias.
const tokens: RadiusToken[] = [
  { name: 'rounded-none', cssVar: '--rounded-none' },
  { name: 'rounded-xs', cssVar: '--rounded-xs', reference: '--tw-raw-radius-2' },
  { name: 'rounded-sm', cssVar: '--rounded-sm', reference: '--tw-raw-radius-5' },
  { name: 'rounded-md', cssVar: '--rounded-md', reference: '--tw-raw-radius-8' },
  { name: 'rounded-lg', cssVar: '--rounded-lg', reference: '--tw-raw-radius-12' },
  { name: 'radius', cssVar: '--radius', reference: '--tw-raw-radius-16' },
  { name: 'rounded-xl', cssVar: '--rounded-xl', reference: '--tw-raw-radius-20' },
  { name: 'rounded-2xl', cssVar: '--rounded-2xl', reference: '--tw-raw-radius-28' },
  { name: 'rounded-3xl', cssVar: '--rounded-3xl', reference: '--tw-raw-radius-32' },
  { name: 'rounded-full', cssVar: '--rounded-full', reference: '--tw-raw-radius-round' },
];

export const AllTokens: Story = {
  render: () => (
    <div>
      <PendingNotice>
        Layer 2 — Semantic (published scale). Source: Figma "border radii" variable collection
        (10 entries) — the scale designers/components consume. Every token aliases a Raw-layer
        primitive via <code>var()</code> — no literal values duplicated here, except{' '}
        <code>rounded-none</code>, which Figma defines directly as <code>0</code> (there is no
        raw primitive to alias). Radius is theme-independent — these values do not change between
        Light and Dark.
      </PendingNotice>

      <RadiusSwatchTable tokens={tokens} referenceLabel="Aliases (tw-raw)" />
    </div>
  ),
};
