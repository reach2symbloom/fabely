import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadiusSwatchTable, type RadiusToken } from './RadiusSwatchTable';
import { PendingNotice } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Radius/Raw',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function token(name: string, varSuffix: string): RadiusToken {
  return { name, cssVar: `--tw-raw-radius-${varSuffix}` };
}

// Layer 1 — Raw (Primitive). Source: Figma "border radii (absolute,
// unpublished)" variable collection, 10 entries. These are the source of
// truth — no references, no aliases. Names match Figma's own variable names
// exactly.
const tokens: RadiusToken[] = [
  token('radius-2', '2'),
  token('radius-5', '5'),
  token('radius-8', '8'),
  token('radius-12', '12'),
  token('radius-16', '16'),
  token('radius-20', '20'),
  token('radius-28', '28'),
  token('radius-32', '32'),
  token('radius-48', '48'),
  token('radius-round', 'round'),
];

export const AllTokens: Story = {
  render: () => (
    <div>
      <PendingNotice>
        Layer 1 — Raw (Primitive). Source: Figma "border radii (absolute, unpublished)" variable
        collection, 10 entries. These are the canonical source-of-truth pixel values — no
        references, no aliases. Variable names match Figma's own names exactly.
      </PendingNotice>

      <RadiusSwatchTable tokens={tokens} />
    </div>
  ),
};
