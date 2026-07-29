import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState, type CSSProperties } from 'react';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Typography/Typography Styles',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type TextStyle = {
  /** Display name, e.g. "Heading 1" */
  name: string;
  /** Slug used in the --text-{slug}-* CSS variable names, e.g. "heading-1" */
  slug: string;
  /** Semantic weight label as documented in Layer 1, e.g. "Serif / Light" */
  weightLabel: string;
  /** Free-form note, e.g. an inference flagged for confirmation */
  note?: string;
};

const headings: TextStyle[] = [
  { name: 'Heading 1', slug: 'heading-1', weightLabel: 'Headings / Light' },
  { name: 'Heading 2', slug: 'heading-2', weightLabel: 'Headings / Light' },
  { name: 'Heading 3', slug: 'heading-3', weightLabel: 'Headings / Light' },
  { name: 'Heading 4', slug: 'heading-4', weightLabel: 'Headings / Light' },
];

const monospaced: TextStyle[] = [
  {
    name: 'Monospaced',
    slug: 'monospaced',
    weightLabel: 'Mono / Regular',
    note: 'font-family inferred: Figma shows no explicit reference — assumed --font-family-mono (the only monospace family)',
  },
];

const captions: TextStyle[] = [
  {
    name: 'Caption Mini',
    slug: 'caption-mini',
    weightLabel: 'Body / Medium',
    note: 'font-family inferred: Figma shows no explicit reference — assumed --font-family-body',
  },
  {
    name: 'Caption Sm',
    slug: 'caption-sm',
    weightLabel: 'Body / Medium',
    note: 'font-family inferred: Figma shows no explicit reference — assumed --font-family-body',
  },
  {
    name: 'Caption Md',
    slug: 'caption-md',
    weightLabel: 'Body / Medium',
    note: 'font-family inferred: Figma shows no explicit reference — assumed --font-family-body',
  },
  {
    name: 'Caption Lg',
    slug: 'caption-lg',
    weightLabel: 'Body / Medium',
    note: 'font-family inferred: Figma shows no explicit reference — assumed --font-family-body',
  },
];

const paragraphs: TextStyle[] = [
  { name: 'Paragraph XXL', slug: 'paragraph-xxl', weightLabel: 'Body / Regular' },
  { name: 'Paragraph XL', slug: 'paragraph-xl', weightLabel: 'Body / Regular' },
  { name: 'Paragraph Large', slug: 'paragraph-large', weightLabel: 'Body / Regular' },
  { name: 'Paragraph Regular', slug: 'paragraph-regular', weightLabel: 'Body / Regular' },
  { name: 'Paragraph Small', slug: 'paragraph-small', weightLabel: 'Body / Regular' },
  { name: 'Paragraph Mini', slug: 'paragraph-mini', weightLabel: 'Body / Regular' },
];

function useResolvedValue(cssVar: string) {
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim());
  }, [cssVar]);
  return value;
}

function useStyleValues(slug: string) {
  return {
    fontFamily: useResolvedValue(`--text-${slug}-font-family`),
    fontWeight: useResolvedValue(`--text-${slug}-font-weight`),
    fontSize: useResolvedValue(`--text-${slug}-font-size`),
    lineHeight: useResolvedValue(`--text-${slug}-line-height`),
    paragraphSpacing: useResolvedValue(`--text-${slug}-paragraph-spacing`),
    letterSpacing: useResolvedValue(`--text-${slug}-letter-spacing`),
  };
}

const cellStyle: CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid var(--border)',
  verticalAlign: 'middle',
};
const monoCell: CSSProperties = { ...cellStyle, fontFamily: 'ui-monospace, monospace', fontSize: 12 };

function Row({ style }: { style: TextStyle }) {
  const v = useStyleValues(style.slug);
  return (
    <tr>
      <td
        style={{
          ...cellStyle,
          fontFamily: `var(--text-${style.slug}-font-family)`,
          fontWeight: `var(--text-${style.slug}-font-weight)`,
          fontSize: `var(--text-${style.slug}-font-size)`,
          lineHeight: `var(--text-${style.slug}-line-height)`,
          letterSpacing: `var(--text-${style.slug}-letter-spacing)`,
        }}
      >
        The quick brown fox jumps
      </td>
      <td style={monoCell}>{style.name}</td>
      <td style={monoCell}>{v.fontFamily || '…'}</td>
      <td style={monoCell}>
        {style.weightLabel}
        <br />({v.fontWeight || '…'})
      </td>
      <td style={monoCell}>{v.fontSize || '…'}</td>
      <td style={monoCell}>{v.lineHeight || '…'}</td>
      <td style={monoCell}>{v.paragraphSpacing || '…'}</td>
      <td style={monoCell}>{v.letterSpacing || '…'}</td>
      <td style={{ ...cellStyle, opacity: 0.75, fontSize: 12, maxWidth: 200 }}>{style.note ?? ''}</td>
    </tr>
  );
}

function StyleTable({ rows }: { rows: TextStyle[] }) {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
      <thead>
        <tr>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Specimen</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Style</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Font Family</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Weight</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Size</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Line Height</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Para. Spacing</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Letter Spacing</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Note</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <Row key={r.slug} style={r} />
        ))}
      </tbody>
    </table>
  );
}

export const AllStyles: Story = {
  render: () => (
    <div>
      <PendingNotice>
        <strong>Layer 2 — Typography Styles.</strong> Complete, Figma-sourced text styles — each
        one owns its full definition (font family, weight, size, line-height, paragraph-spacing,
        letter-spacing) as a single <code>--text-{'{style}'}-*</code> namespace. There are no
        reusable raw font-size/line-height/paragraph-spacing/letter-spacing tokens: those values
        only have meaning as part of a complete style, so nothing here is shared/reused across
        styles the way <code>--font-family-*</code> / <code>--font-weight-*</code> are in Layer 1.
        <br />
        <br />
        Values are preserved exactly as Figma specifies, including ones that may look unusual:{' '}
        <code>caption-md</code>/<code>caption-lg</code>'s 5px letter-spacing, and{' '}
        <code>heading-3</code>'s 28.8px line-height.
        <br />
        <br />
        <strong>Flagged for confirmation:</strong> Figma's "font definitions" group also defines{' '}
        <code>paragraph-bold-weight</code> (Semibold) and <code>paragraph-medium-weight</code>{' '}
        (Medium) alongside the base <code>paragraph-weight</code> (Regular) used below. It's not
        clear whether these should produce additional bold/medium style variants per paragraph
        size, or are just base-weight references for inline emphasis — not implemented as
        separate styles pending that answer. Two font-family inferences are also flagged
        per-row below (<code>monospaced</code>, <code>caption/*</code>).
      </PendingNotice>

      <SectionHeading>Typography Styles / Headings</SectionHeading>
      <StyleTable rows={headings} />

      <SectionHeading>Typography Styles / Paragraph</SectionHeading>
      <StyleTable rows={paragraphs} />

      <SectionHeading>Typography Styles / Caption</SectionHeading>
      <StyleTable rows={captions} />

      <SectionHeading>Typography Styles / Monospaced</SectionHeading>
      <StyleTable rows={monospaced} />
    </div>
  ),
};
