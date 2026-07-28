import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorSwatchTable, PendingNotice, type ColorToken } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Colors/Themes/Neutrals (Migration Layer)',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const cssVar = (step: string) => `--neutrals-new-${step}`;

// Every step is aliased to a different tw-raw/neutral step per mode — the
// "Resolved Value" column reflects whichever mode is active in the toolbar.
const tokens: ColorToken[] = [
  { name: '50', cssVar: cssVar('50'), reference: 'Light: --tw-raw-neutral-50 / Dark: --tw-raw-neutral-950' },
  { name: '100', cssVar: cssVar('100'), reference: 'Light: --tw-raw-neutral-100 / Dark: --tw-raw-neutral-900' },
  { name: '150', cssVar: cssVar('150'), reference: 'Light: --tw-raw-neutral-150 / Dark: --tw-raw-neutral-850' },
  { name: '200', cssVar: cssVar('200'), reference: 'Light: --tw-raw-neutral-200 / Dark: --tw-raw-neutral-800' },
  { name: '300', cssVar: cssVar('300'), reference: 'Light: --tw-raw-neutral-300 / Dark: --tw-raw-neutral-700' },
  { name: '400', cssVar: cssVar('400'), reference: 'Light: --tw-raw-neutral-400 / Dark: --tw-raw-neutral-600' },
  { name: '500', cssVar: cssVar('500'), reference: 'Light: --tw-raw-neutral-500 / Dark: --tw-raw-neutral-500' },
  {
    name: '600 (main)',
    cssVar: cssVar('600'),
    reference: 'Light: --tw-raw-neutral-600 / Dark: --tw-raw-neutral-400',
  },
  { name: '700', cssVar: cssVar('700'), reference: 'Light: --tw-raw-neutral-700 / Dark: --tw-raw-neutral-300' },
  { name: '800', cssVar: cssVar('800'), reference: 'Light: --tw-raw-neutral-800 / Dark: --tw-raw-neutral-200' },
  { name: '900', cssVar: cssVar('900'), reference: 'Light: --tw-raw-neutral-900 / Dark: --tw-raw-neutral-100' },
  { name: '950', cssVar: cssVar('950'), reference: 'Light: --tw-raw-neutral-950 / Dark: --tw-raw-neutral-50' },
];

export const AllTokens: Story = {
  render: () => (
    <div>
      <PendingNotice>
        <strong>Temporary migration layer.</strong> This is a parallel, accidental duplicate of
        the <strong>Neutrals</strong> theme (technical debt — see project notes; the CSS variable
        prefix is still <code>--neutrals-new-*</code>). Every step below aliases the Raw layer's
        neutral scale directly, flipping which step it aliases between Light and Dark. This
        collection will be removed once components migrate back to a single canonical palette.
        <br />
        <br />
        Use the <strong>Theme</strong> toolbar toggle above to switch Light/Dark and see the
        Resolved Value column update.
      </PendingNotice>

      <ColorSwatchTable tokens={tokens} referenceLabel="Aliases (tw-raw)" />
    </div>
  ),
};
