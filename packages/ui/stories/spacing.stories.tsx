import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeading, PendingNotice } from './ColorSwatchTable';
import { SpacingSwatchTable, type SpacingToken } from './SpacingSwatchTable';

const meta = {
  title: 'Design System/Foundations/Spacing/Semantic',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Layer 2 — Semantic (published scale). Source: Figma "spacing" variable
// collection, 27 entries. Every token aliases a Raw-layer primitive by name —
// the Figma cell shown as e.g. "3xs -> 0.5" is a reference chip pointing at
// the Raw primitive named "0.5" (which itself resolves to 2px), not a
// literal value.
const scale: SpacingToken[] = [
  { name: '3xs', cssVar: '--spacing-3xs', reference: '--tw-raw-spacing-0-5' },
  { name: '2xs', cssVar: '--spacing-2xs', reference: '--tw-raw-spacing-1' },
  { name: 'xs', cssVar: '--spacing-xs', reference: '--tw-raw-spacing-2' },
  { name: 'sm', cssVar: '--spacing-sm', reference: '--tw-raw-spacing-3' },
  { name: 'md', cssVar: '--spacing-md', reference: '--tw-raw-spacing-4' },
  { name: 'lg', cssVar: '--spacing-lg', reference: '--tw-raw-spacing-5' },
  { name: 'xl', cssVar: '--spacing-xl', reference: '--tw-raw-spacing-6' },
  { name: '2xl', cssVar: '--spacing-2xl', reference: '--tw-raw-spacing-8' },
  { name: '3xl', cssVar: '--spacing-3xl', reference: '--tw-raw-spacing-10' },
  { name: '4xl', cssVar: '--spacing-4xl', reference: '--tw-raw-spacing-12' },
  { name: '5xl', cssVar: '--spacing-5xl', reference: '--tw-raw-spacing-16' },
  { name: '6xl', cssVar: '--spacing-6xl', reference: '--tw-raw-spacing-20' },
  { name: '7xl', cssVar: '--spacing-7xl', reference: '--tw-raw-spacing-24' },
  { name: '8xl', cssVar: '--spacing-8xl', reference: '--tw-raw-spacing-28' },
  { name: '9xl', cssVar: '--spacing-9xl', reference: '--tw-raw-spacing-32' },
  { name: '10xl', cssVar: '--spacing-10xl', reference: '--tw-raw-spacing-36' },
];

// "odd" — supplemental values; each token's Figma name is its own numeric
// value, and (per Figma) it aliases the identically-named tw-raw primitive.
// The decimal point isn't valid in a CSS custom-property name, so the CSS
// variable encodes it as a hyphen (e.g. "2.5" -> --spacing-2-5); the display
// name here preserves the exact Figma label.
const odd: SpacingToken[] = [
  { name: '0.75', cssVar: '--spacing-0-75', reference: '--tw-raw-spacing-0-75' },
  { name: '1.375', cssVar: '--spacing-1-375', reference: '--tw-raw-spacing-1-375' },
  { name: '1.5', cssVar: '--spacing-1-5', reference: '--tw-raw-spacing-1-5' },
  { name: '1.75', cssVar: '--spacing-1-75', reference: '--tw-raw-spacing-1-75' },
  { name: '1.875', cssVar: '--spacing-1-875', reference: '--tw-raw-spacing-1-875' },
  { name: '2.125', cssVar: '--spacing-2-125', reference: '--tw-raw-spacing-2-125' },
  { name: '2.25', cssVar: '--spacing-2-25', reference: '--tw-raw-spacing-2-25' },
  { name: '2.375', cssVar: '--spacing-2-375', reference: '--tw-raw-spacing-2-375' },
  { name: '2.5', cssVar: '--spacing-2-5', reference: '--tw-raw-spacing-2-5' },
  { name: '3.5', cssVar: '--spacing-3-5', reference: '--tw-raw-spacing-3-5' },
  { name: '3.875', cssVar: '--spacing-3-875', reference: '--tw-raw-spacing-3-875' },
];

export const AllTokens: Story = {
  render: () => (
    <div>
      <PendingNotice>
        Layer 2 — Semantic (published scale). Source: Figma "spacing" variable collection (27
        entries) — the scale designers/components consume. Every token aliases a Raw-layer
        primitive via <code>var()</code> — no literal values duplicated here. Pixel (px) values
        are the source of truth throughout — not converted to rem. Spacing is theme-independent —
        these values do not change between Light and Dark.
      </PendingNotice>

      <SectionHeading>spacing / scale</SectionHeading>
      <SpacingSwatchTable tokens={scale} referenceLabel="Aliases (tw-raw)" />

      <SectionHeading>spacing / odd</SectionHeading>
      <SpacingSwatchTable tokens={odd} referenceLabel="Aliases (tw-raw)" />
    </div>
  ),
};
