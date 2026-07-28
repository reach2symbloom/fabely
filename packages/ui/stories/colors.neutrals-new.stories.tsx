import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorSwatchTable, SectionHeading, PendingNotice, type ColorToken } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Colors/Neutrals (New)',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const cssVar = (step: string) => `--neutrals-new-${step}`;

const lightTokens: ColorToken[] = [
  { name: '50', cssVar: cssVar('50'), reference: '--tw-raw-neutral-50' },
  { name: '100', cssVar: cssVar('100'), reference: '--tw-raw-neutral-100' },
  { name: '150', cssVar: cssVar('150'), reference: '--tw-raw-neutral-150' },
  { name: '200', cssVar: cssVar('200'), reference: '--tw-raw-neutral-200' },
  { name: '300', cssVar: cssVar('300'), reference: '--tw-raw-neutral-300' },
  { name: '400', cssVar: cssVar('400'), reference: '--tw-raw-neutral-400' },
  { name: '500', cssVar: cssVar('500'), reference: '--tw-raw-neutral-500' },
  { name: '600 (main)', cssVar: cssVar('600'), reference: '--tw-raw-neutral-600' },
  { name: '700', cssVar: cssVar('700'), reference: '--tw-raw-neutral-700' },
  { name: '800', cssVar: cssVar('800'), reference: '--tw-raw-neutral-800' },
  { name: '900', cssVar: cssVar('900'), reference: '--tw-raw-neutral-900' },
  { name: '950', cssVar: cssVar('950'), reference: '--tw-raw-neutral-950' },
];

const darkTokens: ColorToken[] = [
  { name: '50', cssVar: cssVar('50'), reference: '--tw-raw-neutral-950' },
  { name: '100', cssVar: cssVar('100'), reference: '--tw-raw-neutral-900' },
  { name: '150', cssVar: cssVar('150'), reference: '--tw-raw-neutral-850' },
  { name: '200', cssVar: cssVar('200'), reference: '--tw-raw-neutral-800' },
  { name: '300', cssVar: cssVar('300'), reference: '--tw-raw-neutral-700' },
  { name: '400', cssVar: cssVar('400'), reference: '--tw-raw-neutral-600' },
  { name: '500', cssVar: cssVar('500'), reference: '--tw-raw-neutral-500' },
  { name: '600 (main)', cssVar: cssVar('600'), reference: '--tw-raw-neutral-400' },
  { name: '700', cssVar: cssVar('700'), reference: '--tw-raw-neutral-300' },
  { name: '800', cssVar: cssVar('800'), reference: '--tw-raw-neutral-200' },
  { name: '900', cssVar: cssVar('900'), reference: '--tw-raw-neutral-100' },
  { name: '950', cssVar: cssVar('950'), reference: '--tw-raw-neutral-50' },
];

export const AllTokens: Story = {
  render: () => (
    <div>
      <PendingNotice>
        <strong>Temporary compatibility layer.</strong> <code>Neutrals (New)</code> is a
        parallel, accidental duplicate of <code>theme-neutrals</code> (technical debt — see
        project notes). Every step below aliases <code>tw-raw/neutral</code> directly. This
        collection will be removed once components migrate back to a single canonical palette.
      </PendingNotice>

      <SectionHeading>Light</SectionHeading>
      <ColorSwatchTable tokens={lightTokens} referenceLabel="Aliases (tw-raw)" />

      <SectionHeading>Dark</SectionHeading>
      <ColorSwatchTable tokens={darkTokens} referenceLabel="Aliases (tw-raw)" dark />
    </div>
  ),
};
