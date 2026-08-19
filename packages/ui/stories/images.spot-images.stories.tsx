import type { Meta, StoryObj } from '@storybook/react-vite';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';
import { ImageSwatchTable, type ImageAsset } from './ImageSwatchTable';
import { SPOT_IMAGES, type SpotImageKey } from '../src/foundations/images/spot-images';

const meta = {
  title: 'Design System/Foundations/Images/Spot Images',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const NAME_BY_KEY: Record<SpotImageKey, string> = {
  'import-notes': 'Import Notes',
  'import-manuscript': 'Import Manuscript',
};

const assets: ImageAsset[] = (Object.keys(SPOT_IMAGES) as SpotImageKey[])
  .sort((a, b) => NAME_BY_KEY[a].localeCompare(NAME_BY_KEY[b]))
  .map((key) => ({
    name: NAME_BY_KEY[key],
    key,
    src: SPOT_IMAGES[key],
    file: `${key}.png`,
  }));

export const SpotImages: Story = {
  name: 'Spot Images',
  render: () => (
    <div>
      <PendingNotice>
        Source: Image Button's two Figma instances — Import notes
        (<code>16455:16977</code>) and Import your manuscript
        (<code>16455:17561</code>). Decorative illustration art, not
        third-party brand marks — see <strong>Brand Logos</strong> for
        those. Each is the 72×72 thumbnail the corresponding Image
        Button card shows.
      </PendingNotice>

      <SectionHeading>foundations / images / spot-images ({assets.length})</SectionHeading>
      <ImageSwatchTable
        assets={assets}
        importPath="@/foundations/images/spot-images"
        recordName="SPOT_IMAGES"
      />
    </div>
  ),
};
