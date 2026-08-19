import type { Meta, StoryObj } from '@storybook/react-vite';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';
import { ImageSwatchTable, type ImageAsset } from './ImageSwatchTable';
import { BRAND_LOGOS, type BrandLogoKey } from '../src/foundations/images/brand-logos';

const meta = {
  title: 'Design System/Foundations/Images/Brand Logos',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const NAME_BY_KEY: Record<BrandLogoKey, string> = {
  apple: 'Apple',
  claude: 'Claude',
  dropbox: 'Dropbox',
  evernote: 'Evernote',
  'google-drive': 'Google Drive',
  icloud: 'iCloud',
  keep: 'Keep',
  notion: 'Notion',
  obsidian: 'Obsidian',
  onedrive: 'OneDrive',
  'openai-dark': 'OpenAI Dark',
  'openai-light': 'OpenAI Light',
  'play-store': 'Play Store',
};

const assets: ImageAsset[] = (Object.keys(BRAND_LOGOS) as BrandLogoKey[])
  .sort((a, b) => NAME_BY_KEY[a].localeCompare(NAME_BY_KEY[b]))
  .map((key) => ({
    name: NAME_BY_KEY[key],
    key,
    src: BRAND_LOGOS[key],
    file: `${key}.png`,
  }));

export const BrandLogos: Story = {
  name: 'Brand Logos',
  render: () => (
    <div>
      <PendingNotice>
        Source: Figma <strong>Brand logos</strong> frame (<code>16456:17973</code>), Library page
        (<code>16428:12467</code>) — third-party service marks for API connections and import
        sources. Each is a tight-cropped, transparent PNG with no padding baked in; size and pad
        at the call site (see <code>ApiConnection</code>'s 40×40/8px logo box for the pattern).
        <br />
        <br />
        <strong>OpenAI Light / Dark</strong> are the same mark in two inks — pick whichever reads
        against your surface. All other brands ship one ink only.
      </PendingNotice>

      <SectionHeading>foundations / images / brand-logos ({assets.length})</SectionHeading>
      <ImageSwatchTable assets={assets} importPath="@/foundations/images/brand-logos" />
    </div>
  ),
};
