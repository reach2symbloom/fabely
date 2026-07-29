import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState, type CSSProperties } from 'react';
import {
  TypographyNotice,
  TypographySectionHeading,
  TypographySubHeading,
  uiCellStyle,
  codeCellStyle,
} from './TypographyDocChrome';

type Weight = 'Regular' | 'Medium' | 'Bold';
type WeightArgs = { weight: Weight };

const meta = {
  title: 'Design System/Foundations/Typography/Typography Styles',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<Meta<WeightArgs>>;

// "Bold" is the public semantic name (Figma + Storybook); it resolves to the
// Gellix Semibold face via --font-weight-paragraph-bold, but "Semibold" is
// never surfaced in the control or the documentation UI.
const weightArgType = {
  control: { type: 'inline-radio' },
  options: ['Regular', 'Medium', 'Bold'],
} as const;

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

function specimenStyle(slug: string): CSSProperties {
  return {
    ...uiCellStyle,
    fontFamily: `var(--text-${slug}-font-family)`,
    fontWeight: `var(--text-${slug}-font-weight)`,
    fontSize: `var(--text-${slug}-font-size)`,
    lineHeight: `var(--text-${slug}-line-height)`,
    letterSpacing: `var(--text-${slug}-letter-spacing)`,
  };
}

function tableHead(extraCols: string[] = []) {
  return (
    <thead>
      <tr>
        <th style={{ ...uiCellStyle, textAlign: 'left' }}>Specimen</th>
        <th style={{ ...uiCellStyle, textAlign: 'left' }}>Style</th>
        <th style={{ ...uiCellStyle, textAlign: 'left' }}>Font Family</th>
        <th style={{ ...uiCellStyle, textAlign: 'left' }}>Weight</th>
        <th style={{ ...uiCellStyle, textAlign: 'left' }}>Size</th>
        <th style={{ ...uiCellStyle, textAlign: 'left' }}>Line Height</th>
        <th style={{ ...uiCellStyle, textAlign: 'left' }}>Para. Spacing</th>
        <th style={{ ...uiCellStyle, textAlign: 'left' }}>Letter Spacing</th>
        {extraCols.map((c) => (
          <th key={c} style={{ ...uiCellStyle, textAlign: 'left' }}>
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

/** Semantic weight label + resolved numeric value, e.g. "Light (300)" — label in Gellix, the resolved number in a small monospace span since it's quoting a literal computed value. */
function WeightCell({ label, resolved }: { label: string; resolved: string }) {
  return (
    <td style={uiCellStyle}>
      {label}
      <br />
      <span style={{ fontFamily: codeCellStyle.fontFamily, fontSize: 12, opacity: 0.75 }}>({resolved || '…'})</span>
    </td>
  );
}

/* ---------- Fixed styles (no weight variants): Headings, Caption, Monospaced ---------- */

type FixedStyle = { name: string; slug: string; weightLabel: string; note?: string };

function FixedRow({ style }: { style: FixedStyle }) {
  const v = useStyleValues(style.slug);
  return (
    <tr>
      <td style={specimenStyle(style.slug)}>The quick brown fox jumps</td>
      <td style={uiCellStyle}>{style.name}</td>
      <td style={codeCellStyle}>{v.fontFamily || '…'}</td>
      <WeightCell label={style.weightLabel} resolved={v.fontWeight} />
      <td style={codeCellStyle}>{v.fontSize || '…'}</td>
      <td style={codeCellStyle}>{v.lineHeight || '…'}</td>
      <td style={codeCellStyle}>{v.paragraphSpacing || '…'}</td>
      <td style={codeCellStyle}>{v.letterSpacing || '…'}</td>
      <td style={{ ...uiCellStyle, opacity: 0.75, fontSize: 13, maxWidth: 220 }}>{style.note ?? ''}</td>
    </tr>
  );
}

function FixedTable({ rows }: { rows: FixedStyle[] }) {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
      {tableHead(['Note'])}
      <tbody>
        {rows.map((r) => (
          <FixedRow key={r.slug} style={r} />
        ))}
      </tbody>
    </table>
  );
}

const headings: FixedStyle[] = [
  { name: 'Heading 1', slug: 'heading-1', weightLabel: 'Headings / Light' },
  { name: 'Heading 2', slug: 'heading-2', weightLabel: 'Headings / Light' },
  { name: 'Heading 3', slug: 'heading-3', weightLabel: 'Headings / Light' },
  { name: 'Heading 4', slug: 'heading-4', weightLabel: 'Headings / Light' },
];

const monospaced: FixedStyle[] = [
  {
    name: 'Monospaced',
    slug: 'monospaced',
    weightLabel: 'Mono / Regular',
    note: 'font-family inferred: Figma shows no explicit reference — assumed --font-family-mono (the only monospace family)',
  },
];

const captions: FixedStyle[] = [
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

/* ---------- Variant styles: Paragraph, Paragraph Serif — one shared "weight"
   Args control (Regular/Medium/Bold) drives every row; nothing here hardcodes
   a raw numeric weight — the slug just selects which --text-*-{weight}-*
   namespace to read, and CSS resolves the actual number. ---------- */

function weightSlug(weight: Weight) {
  return weight.toLowerCase();
}

function VariantRow({ name, baseSlug, weight }: { name: string; baseSlug: string; weight: Weight }) {
  const slug = `${baseSlug}-${weightSlug(weight)}`;
  const v = useStyleValues(slug);
  return (
    <tr>
      <td style={specimenStyle(slug)}>The quick brown fox jumps</td>
      <td style={uiCellStyle}>{name}</td>
      <td style={codeCellStyle}>{v.fontFamily || '…'}</td>
      <WeightCell label={weight} resolved={v.fontWeight} />
      <td style={codeCellStyle}>{v.fontSize || '…'}</td>
      <td style={codeCellStyle}>{v.lineHeight || '…'}</td>
      <td style={codeCellStyle}>{v.paragraphSpacing || '…'}</td>
      <td style={codeCellStyle}>{v.letterSpacing || '…'}</td>
    </tr>
  );
}

function VariantTable({ rows, weight }: { rows: { name: string; slug: string }[]; weight: Weight }) {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
      {tableHead()}
      <tbody>
        {rows.map((r) => (
          <VariantRow key={r.slug} name={r.name} baseSlug={r.slug} weight={weight} />
        ))}
      </tbody>
    </table>
  );
}

const paragraphSizes: { name: string; slug: string }[] = [
  { name: 'Paragraph XXL', slug: 'paragraph-xxl' },
  { name: 'Paragraph XL', slug: 'paragraph-xl' },
  { name: 'Paragraph Large', slug: 'paragraph-large' },
  { name: 'Paragraph Regular', slug: 'paragraph-regular' },
  { name: 'Paragraph Small', slug: 'paragraph-small' },
  { name: 'Paragraph Mini', slug: 'paragraph-mini' },
];

// Documentation label is "Sharp Serif" (the current concrete implementation),
// nested under the "Manuscript" semantic section below — the underlying slug
// (and its --text-paragraph-serif-* CSS variables) is unchanged, preserving
// Figma's naming; only how it's presented in Storybook changes.
const manuscriptSizes: { name: string; slug: string }[] = [{ name: 'Sharp Serif', slug: 'paragraph-serif' }];

export const AllStyles: Story = {
  argTypes: { weight: weightArgType },
  args: { weight: 'Regular' },
  render: (args) => {
    const weight = args.weight;
    return (
      <div>
        <TypographyNotice>
          <strong>Layer 2 — Typography Styles.</strong> Complete, Figma-sourced text styles — each
          one owns its full definition (font family, weight, size, line-height,
          paragraph-spacing, letter-spacing) as a single <code>--text-{'{style}'}-*</code>{' '}
          namespace. There are no reusable raw font-size/line-height/paragraph-spacing/
          letter-spacing tokens: those values only have meaning as part of a complete style.
          <br />
          <br />
          Headings, Caption, and Monospaced have no weight variants — each is a single fixed
          style. <strong>Paragraph</strong> and <strong>Manuscript</strong> do have weight
          variants (Regular/Medium/Bold) — use the <strong>Weight</strong> control below to switch
          every Paragraph/Manuscript specimen at once, mirroring Figma's variant property (weight
          is a property of the style, not a separate top-level style). Font-family, size,
          line-height, paragraph-spacing, and letter-spacing stay fixed per style — only
          font-weight changes with the control. "Bold" is implemented by the Gellix{' '}
          <em>Semibold</em> face (600) for Paragraph, and Sharp Serif's real Bold face (700, no
          substitution) for Manuscript — the control only ever shows the semantic name Bold.
        </TypographyNotice>

        <TypographySectionHeading>Typography Styles / Headings</TypographySectionHeading>
        <FixedTable rows={headings} />

        <TypographySectionHeading>Typography Styles / Paragraph</TypographySectionHeading>
        <VariantTable rows={paragraphSizes} weight={weight} />

        <TypographySectionHeading>Typography Styles / Manuscript</TypographySectionHeading>
        <TypographyNotice>
          Sharp Serif is the only manuscript font today, but this section is organized so more can
          be added later: <strong>Manuscript</strong> is the stable semantic layer, and individual
          fonts (currently just Sharp Serif) are interchangeable implementations nested beneath
          it. A single size — 22px / 31px line-height, matching Paragraph XL's metric exactly.
          paragraph-spacing (20px) and letter-spacing (0px) aren't independently visible for this
          style in Figma's Styles panel (which only shows size/line-height) — carried over from
          Paragraph XL's already-confirmed values, since the font-size/line-height match exactly.
          <br />
          <br />
          <strong>TODO:</strong> Expand the Manuscript section to support multiple
          user-selectable manuscript fonts (e.g. Sharp Serif, Garamond, Baskerville, etc.). The
          Manuscript semantic layer should remain stable while individual manuscript font families
          become interchangeable implementations beneath it.
        </TypographyNotice>
        <TypographySubHeading>Sharp Serif</TypographySubHeading>
        <VariantTable rows={manuscriptSizes} weight={weight} />

        <TypographySectionHeading>Typography Styles / Caption</TypographySectionHeading>
        <FixedTable rows={captions} />

        <TypographySectionHeading>Typography Styles / Monospaced</TypographySectionHeading>
        <FixedTable rows={monospaced} />
      </div>
    );
  },
};
