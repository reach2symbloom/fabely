import type { Meta, StoryObj } from '@storybook/react-vite';
import { useDeferredValue, useMemo, useState, type ReactNode } from 'react';
import {
  IconographyNotice,
  IconographyPageTitle,
  IconographySubHeading,
} from './IconographyDocChrome';
import { lucideAll, lucideUsageNotes, solarAll } from './iconography.library';

const meta = {
  title: 'Design System/Foundations/Iconography/Icon Library',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function IconGalleryCard({
  name,
  usage,
  children,
}: {
  name: string;
  usage?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
      title={usage}
    >
      <div
        style={{
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          background: 'var(--secondary)',
          color: 'var(--secondary-foreground)',
        }}
      >
        {children}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-family-sans)',
          fontSize: 12,
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </div>
      {usage ? (
        <div style={{ fontFamily: 'var(--font-family-sans)', fontSize: 12, lineHeight: 1.45, opacity: 0.75 }}>
          {usage}
        </div>
      ) : null}
    </div>
  );
}

function IconGalleryGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 12,
        marginBottom: 24,
      }}
    >
      {children}
    </div>
  );
}

function CatalogSearch({
  label,
  query,
  onQueryChange,
  shown,
  total,
}: {
  label: string;
  query: string;
  onQueryChange: (q: string) => void;
  shown: number;
  total: number;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
      }}
    >
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={`Search ${label} icons…`}
        aria-label={`Search ${label} icons`}
        style={{
          flex: '1 1 220px',
          maxWidth: 360,
          fontFamily: 'var(--font-family-sans)',
          fontSize: 13,
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: 'var(--background)',
          color: 'inherit',
        }}
      />
      <div style={{ fontFamily: 'var(--font-family-sans)', fontSize: 12, opacity: 0.7 }}>
        Showing {shown.toLocaleString()} of {total.toLocaleString()}
      </div>
    </div>
  );
}

export const Lucide: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query.trim().toLowerCase());
    const filtered = useMemo(() => {
      if (!deferredQuery) return lucideAll;
      return lucideAll.filter(({ name }) => name.toLowerCase().includes(deferredQuery));
    }, [deferredQuery]);

    return (
      <div>
        <IconographyPageTitle>Lucide</IconographyPageTitle>
        <IconographyNotice>
          Primary system icon set — complete catalog ({lucideAll.length.toLocaleString()} icons from{' '}
          <code>lucide-react</code>). Stroke language for UI chrome. Icons Fabely already uses in
          components show a usage note. Do not mix with Solar in the same interface.
        </IconographyNotice>
        <IconographySubHeading>Full catalog · stroke language</IconographySubHeading>
        <CatalogSearch
          label="Lucide"
          query={query}
          onQueryChange={setQuery}
          shown={filtered.length}
          total={lucideAll.length}
        />
        <IconGalleryGrid>
          {filtered.map(({ name, Icon }) => (
            <IconGalleryCard key={name} name={name} usage={lucideUsageNotes[name]}>
              <Icon aria-hidden width="var(--icon-lg)" height="var(--icon-lg)" strokeWidth={2} />
            </IconGalleryCard>
          ))}
        </IconGalleryGrid>
      </div>
    );
  },
};

export const Solar: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query.trim().toLowerCase());
    const filtered = useMemo(() => {
      if (!deferredQuery) return solarAll;
      return solarAll.filter(({ name }) => name.toLowerCase().includes(deferredQuery));
    }, [deferredQuery]);

    return (
      <div>
        <IconographyPageTitle>Solar</IconographyPageTitle>
        <IconographyNotice>
          Illustration icon set — complete catalog ({solarAll.length.toLocaleString()} icons from{' '}
          <code>@solar-icons/react</code>) in <strong>Bold Duotone</strong>. Secondary
          (lighter) layers use Foundations <code>--icon-solar-secondary-opacity</code>{' '}
          (0.2 / 20%); full fills stay 100%. Use for illustrative
          accents and glyphs Lucide lacks. Do not mix with Lucide in the same interface.
        </IconographyNotice>
        <IconographySubHeading>Full catalog · Bold Duotone</IconographySubHeading>
        <CatalogSearch
          label="Solar"
          query={query}
          onQueryChange={setQuery}
          shown={filtered.length}
          total={solarAll.length}
        />
        <IconGalleryGrid>
          {filtered.map(({ name, Icon }) => (
            <IconGalleryCard key={name} name={name}>
              <Icon size="var(--icon-lg)" weight="BoldDuotone" color="currentColor" />
            </IconGalleryCard>
          ))}
        </IconGalleryGrid>
      </div>
    );
  },
};

export const FabelyIcons: Story = {
  name: 'Fabely Icons',
  render: () => (
    <div>
      <IconographyPageTitle>Fabely Icons</IconographyPageTitle>
      <IconographyNotice>
        Custom Fabely icon set. Reserved for brand-specific glyphs that Lucide and Solar do not
        cover. Catalog is empty for now — icons will be added here as they are designed and
        approved.
      </IconographyNotice>
      <IconographySubHeading>No icons yet</IconographySubHeading>
      <div
        style={{
          fontFamily: 'var(--font-family-sans)',
          fontSize: 13,
          opacity: 0.7,
          padding: '24px 0',
        }}
      >
        This library has no entries yet.
      </div>
    </div>
  ),
};
