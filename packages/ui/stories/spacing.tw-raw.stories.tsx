import type { Meta, StoryObj } from '@storybook/react-vite';
import { SpacingSwatchTable, type SpacingToken } from './SpacingSwatchTable';
import { PendingNotice } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Spacing/Raw',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function token(name: string, varSuffix: string): SpacingToken {
  return { name, cssVar: `--tw-raw-spacing-${varSuffix}` };
}

// Layer 1 — Raw (Primitive). Source: Figma "spacing (absolute, unpublished)"
// variable collection, 45 entries. These are the source of truth — no
// references, no aliases. Names match Figma's own variable names exactly.
const tokens: SpacingToken[] = [
  token('0', '0'),
  token('0.5', '0-5'),
  token('0.75', '0-75'),
  token('1', '1'),
  token('1.25', '1-25'),
  token('1.375', '1-375'),
  token('1.5', '1-5'),
  token('1.75', '1-75'),
  token('1.875', '1-875'),
  token('2', '2'),
  token('2.125', '2-125'),
  token('2.25', '2-25'),
  token('2.375', '2-375'),
  token('2.5', '2-5'),
  token('3', '3'),
  token('3.5', '3-5'),
  token('3.875', '3-875'),
  token('4', '4'),
  token('5', '5'),
  token('6', '6'),
  token('7', '7'),
  token('8', '8'),
  token('9', '9'),
  token('10', '10'),
  token('11', '11'),
  token('12', '12'),
  token('13', '13'),
  token('14', '14'),
  token('16', '16'),
  token('20', '20'),
  token('24', '24'),
  token('28', '28'),
  token('32', '32'),
  token('36', '36'),
  token('40', '40'),
  token('44', '44'),
  token('48', '48'),
  token('52', '52'),
  token('56', '56'),
  token('60', '60'),
  token('64', '64'),
  token('72', '72'),
  token('80', '80'),
  token('96', '96'),
  token('infinite', 'infinite'),
];

export const AllTokens: Story = {
  render: () => (
    <div>
      <PendingNotice>
        Layer 1 — Raw (Primitive). Source: Figma "spacing (absolute, unpublished)" variable
        collection, 45 entries. These are the canonical source-of-truth pixel values — no
        references, no aliases. Variable names match Figma's own names exactly; they happen to
        follow Tailwind's spacing-scale numbering, but these are Fabely's own Figma-authored
        primitives, not substituted from Tailwind.
      </PendingNotice>

      <SpacingSwatchTable tokens={tokens} />
    </div>
  ),
};
