/**
 * Brand Link — Figma Brand link (16456:17763), part of API Connections (16456:17857).
 */

import type { Meta, StoryObj } from '@storybook/react-vite';

import { cn } from '@/lib/utils';
import { BRAND_LOGOS } from '@/foundations/images/brand-logos';
import { PrimitiveGalleryItem, PrimitivePage } from '../../../stories/PrimitivePage';

import { BrandLink } from './brand-link';

const meta = {
  title: 'Design System/Atoms/Brand Link',
  component: BrandLink,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: { logoSrc: BRAND_LOGOS['google-drive'], label: 'Google Drive' },
} satisfies Meta<typeof BrandLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Library canvas — Foundations tw-raw/black (#080B0C); dark so switch alphas resolve for Library. */
function LibraryCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn('dark bg-[color:var(--tw-raw-black)] p-[length:var(--spacing-md)]')}>
      {children}
    </div>
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Brand Link"
      description="Service logo + name lockup. Figma Brand link (16456:17763), part of the API Connections set. Presentation-only — pass a resolved logoSrc, e.g. from @/foundations/images/brand-logos."
      playground={
        <LibraryCanvas>
          <BrandLink logoSrc={BRAND_LOGOS['google-drive']} label="Google Drive" />
        </LibraryCanvas>
      }
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Google Drive">
            <LibraryCanvas>
              <BrandLink logoSrc={BRAND_LOGOS['google-drive']} label="Google Drive" />
            </LibraryCanvas>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Apple (inverted)">
            <LibraryCanvas>
              <BrandLink logoSrc={BRAND_LOGOS.apple} label="Apple" logoClassName="invert" />
            </LibraryCanvas>
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            This atom doesn't resolve brands itself — pass{' '}
            <code>logoSrc</code> from{' '}
            <code>@/foundations/images/brand-logos</code>.
          </li>
          <li>
            Use <code>logoClassName</code> for one-off ink treatments (see
            the Apple example — inverted to white since Figma ships only
            one black ink).
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            The logo image is decorative (<code>alt=&quot;&quot;</code>);
            the label text carries the accessible name.
          </li>
        </ul>
      }
    />
  ),
};

export const GoogleDrive: Story = {
  name: 'Google Drive',
  render: () => (
    <LibraryCanvas>
      <BrandLink logoSrc={BRAND_LOGOS['google-drive']} label="Google Drive" />
    </LibraryCanvas>
  ),
};
