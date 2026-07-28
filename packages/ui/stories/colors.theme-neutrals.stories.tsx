import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorSwatchTable, type ColorToken } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Colors/theme-neutrals',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const tokens: ColorToken[] = [
  { name: '50', cssVar: '--theme-neutrals-50', reference: '--tw-raw-neutral-50' },
  { name: '100', cssVar: '--theme-neutrals-100', reference: '--tw-raw-neutral-100' },
  { name: '200', cssVar: '--theme-neutrals-200', reference: '--tw-raw-neutral-200' },
  { name: '300', cssVar: '--theme-neutrals-300', reference: '--tw-raw-neutral-300' },
  { name: '400', cssVar: '--theme-neutrals-400', reference: '--tw-raw-neutral-400' },
  { name: '500', cssVar: '--theme-neutrals-500', reference: '--tw-raw-neutral-500' },
  { name: '600 (main)', cssVar: '--theme-neutrals-600', reference: '--tw-raw-neutral-600' },
  { name: '700', cssVar: '--theme-neutrals-700', reference: '--tw-raw-neutral-700' },
  { name: '800', cssVar: '--theme-neutrals-800', reference: '--tw-raw-neutral-800' },
  {
    name: '900',
    cssVar: '--theme-neutrals-900',
    reference: '--tw-raw-neutral-900',
    note: 'dark mode background',
  },
  { name: '950', cssVar: '--theme-neutrals-950', reference: '--tw-raw-neutral-950' },
];

export const AllTokens: Story = {
  render: () => (
    <div>
      <p style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', opacity: 0.75 }}>
        Layer 2 — theme-neutrals, the canonical theme palette. Source: Figma "theme-neutrals"
        collection. Every step aliases tw-raw via var() — the "Resolved Value" column is read
        live from the browser, so it doubles as proof the alias chain actually resolves.
      </p>
      <ColorSwatchTable tokens={tokens} referenceLabel="Aliases (tw-raw)" />
    </div>
  ),
};
