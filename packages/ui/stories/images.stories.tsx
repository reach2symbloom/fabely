import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';

import {
  DOC_TYPE_IMAGES,
  type DocTypeImage,
} from '../src/foundations/images';

const meta = {
  title: 'Design System/Foundations/Images',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const uiFont: CSSProperties = {
  fontFamily: 'var(--font-family-sans)',
  fontWeight: 'var(--font-weight-sans-regular)',
};

const DOC_TYPES: { id: DocTypeImage; name: string; usage: string }[] = [
  { id: 'pdf', name: 'PDF', usage: 'Portable Document Format' },
  { id: 'docx', name: 'Docx', usage: 'Microsoft Word (.docx)' },
  { id: 'doc', name: 'Doc', usage: 'Document / Google Docs' },
];

function PageTitle({ children }: { children: ReactNode }) {
  return <h2 style={{ ...uiFont, fontSize: 20, marginBottom: 16 }}>{children}</h2>;
}

function Notice({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        ...uiFont,
        border: '1px dashed var(--border)',
        borderRadius: 8,
        padding: 16,
        fontSize: 14,
        lineHeight: 1.5,
        opacity: 0.85,
      }}
    >
      {children}
    </div>
  );
}

export const Overview: Story = {
  name: 'Overview',
  render: () => (
    <div>
      <PageTitle>Images</PageTitle>
      <Notice>
        Multi-color rasters live here — file-type marks, photos, illustrations.
        They are not iconography: Lucide, Solar, and Fabely Icons are{' '}
        <code>currentColor</code> glyphs. Import from{' '}
        <code>@/foundations/images</code>. When a raster sits at icon scale,
        size the frame with <code>--icon-*</code>.
      </Notice>

      <h3 style={{ ...uiFont, fontSize: 15, marginTop: 32 }}>Doc types</h3>
      <p
        style={{
          ...uiFont,
          fontSize: 13,
          opacity: 0.75,
          marginTop: 4,
          marginBottom: 8,
        }}
      >
        Figma set 16509:30930 — Type=PDF / Doc / Docx. Catalog ({DOC_TYPES.length})
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 12,
          padding: '8px 0 24px',
        }}
      >
        {DOC_TYPES.map(({ id, name, usage }) => (
          <div
            key={id}
            style={{
              ...uiFont,
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              className="flex size-[length:var(--icon-3xl)] items-center justify-center rounded-[length:var(--radius-md)] bg-[color:var(--tw-raw-black)]"
            >
              <img
                src={DOC_TYPE_IMAGES[id]}
                alt=""
                className="size-[length:var(--icon-lg)] object-contain"
              />
            </div>
            <span style={{ fontSize: 13 }}>{name}</span>
            <span style={{ fontSize: 11, opacity: 0.7, textAlign: 'center' }}>
              {usage}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};
