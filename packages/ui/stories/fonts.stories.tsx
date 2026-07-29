import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState, type CSSProperties } from 'react';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Fonts (TEMP)',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Specimen = {
  family: string;
  weight: number;
  style: 'normal' | 'italic';
  label: string;
};

function specimens(family: string, entries: [number, string][], italic: boolean): Specimen[] {
  return entries.flatMap(([weight, label]) => [
    { family, weight, style: 'normal' as const, label },
    ...(italic ? [{ family, weight, style: 'italic' as const, label: `${label} Italic` }] : []),
  ]);
}

const gellix = specimens(
  'Gellix',
  [
    [100, 'Thin'],
    [300, 'Light'],
    [400, 'Regular'],
    [500, 'Medium'],
    [600, 'SemiBold'],
    [700, 'Bold'],
    [800, 'ExtraBold'],
    [900, 'Black'],
  ],
  true,
);

const sharpSerif = specimens(
  'Sharp Serif',
  [
    [250, 'Thin'],
    [300, 'Light'],
    [400, 'Regular'],
    [500, 'Medium'],
    [700, 'Bold'],
    [800, 'ExtraBold'],
  ],
  true,
);

const firaMono = specimens(
  'Fira Mono',
  [
    [400, 'Regular'],
    [500, 'Medium'],
    [700, 'Bold'],
  ],
  false,
);

/**
 * Uses the Font Loading API (document.fonts) to confirm each face actually
 * loaded from its @font-face src — not just that the CSS declares it. A
 * family/weight/style combo with no matching FontFace in document.fonts (or
 * one stuck un-loaded) means the browser fell back to a substitute font.
 */
function useFontLoadStatus(family: string, weight: number, style: string) {
  const [status, setStatus] = useState<'checking' | 'loaded' | 'missing'>('checking');
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const match = Array.from(document.fonts).find(
        (f) => f.family.replace(/^["']|["']$/g, '') === family && Number(f.weight) === weight && f.style === style,
      );
      setStatus(match && match.status === 'loaded' ? 'loaded' : 'missing');
    });
    return () => {
      cancelled = true;
    };
  }, [family, weight, style]);
  return status;
}

const cellStyle: CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid var(--border)',
  verticalAlign: 'middle',
};

function SpecimenRow({ s }: { s: Specimen }) {
  const status = useFontLoadStatus(s.family, s.weight, s.style);
  return (
    <tr>
      <td style={{ ...cellStyle, fontFamily: 'ui-monospace, monospace', fontSize: 12, whiteSpace: 'nowrap' }}>
        {s.label} {s.weight} {s.style === 'italic' ? 'Italic' : ''}
      </td>
      <td style={{ ...cellStyle, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>
        {status === 'checking' ? '…' : status === 'loaded' ? 'OK' : 'FALLBACK'}
      </td>
      <td
        style={{
          ...cellStyle,
          fontFamily: `'${s.family}', sans-serif`,
          fontWeight: s.weight,
          fontStyle: s.style,
          fontSize: 22,
        }}
      >
        The quick brown fox jumps — 0123456789
      </td>
    </tr>
  );
}

function SpecimenTable({ rows }: { rows: Specimen[] }) {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
      <thead>
        <tr>
          <th style={{ ...cellStyle, textAlign: 'left', width: 160 }}>Weight/Style</th>
          <th style={{ ...cellStyle, textAlign: 'left', width: 90 }}>Loaded</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Specimen</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((s) => (
          <SpecimenRow key={`${s.family}-${s.weight}-${s.style}`} s={s} />
        ))}
      </tbody>
    </table>
  );
}

export const AllFonts: Story = {
  render: () => (
    <div>
      <PendingNotice>
        <strong>Temporary verification page — not part of the Typography foundation.</strong> This
        exists only to confirm the font assets registered in <code>fonts.css</code> actually load
        (via the Font Loading API, <code>document.fonts</code>) rather than silently falling back
        to a substitute font. No typography tokens (font-size, line-height, semantic text styles)
        exist yet — this page will be removed once the Typography foundation supersedes it.
      </PendingNotice>

      <SectionHeading>Gellix (16 faces: 8 weights × normal/italic)</SectionHeading>
      <SpecimenTable rows={gellix} />

      <SectionHeading>Sharp Serif (12 faces: 6 weights × normal/italic)</SectionHeading>
      <SpecimenTable rows={sharpSerif} />

      <SectionHeading>Fira Mono (3 faces: 3 weights, normal only)</SectionHeading>
      <SpecimenTable rows={firaMono} />
    </div>
  ),
};
