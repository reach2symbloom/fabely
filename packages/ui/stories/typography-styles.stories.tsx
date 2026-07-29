import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState, type CSSProperties } from 'react';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';

type Weight = 'Regular' | 'Medium' | 'Bold';
type WeightArgs = { weight: Weight };

const meta = {
  title: 'Design System/Foundations/Typography/Typography Styles',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;
type WeightStory = StoryObj<Meta<WeightArgs>>;

const weightArgType = {
  control: { type: 'radio' },
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

const cellStyle: CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid var(--border)',
  verticalAlign: 'middle',
};
const monoCell: CSSProperties = { ...cellStyle, fontFamily: 'ui-monospace, monospace', fontSize: 12 };

function specimenStyle(slug: string): CSSProperties {
  return {
    ...cellStyle,
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
        <th style={{ ...cellStyle, textAlign: 'left' }}>Specimen</th>
        <th style={{ ...cellStyle, textAlign: 'left' }}>Style</th>
        <th style={{ ...cellStyle, textAlign: 'left' }}>Font Family</th>
        <th style={{ ...cellStyle, textAlign: 'left' }}>Weight</th>
        <th style={{ ...cellStyle, textAlign: 'left' }}>Size</th>
        <th style={{ ...cellStyle, textAlign: 'left' }}>Line Height</th>
        <th style={{ ...cellStyle, textAlign: 'left' }}>Para. Spacing</th>
        <th style={{ ...cellStyle, textAlign: 'left' }}>Letter Spacing</th>
        {extraCols.map((c) => (
          <th key={c} style={{ ...cellStyle, textAlign: 'left' }}>
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

/* ---------- Fixed styles (no weight variants): Headings, Caption, Monospaced ---------- */

type FixedStyle = { name: string; slug: string; weightLabel: string; note?: string };

function FixedRow({ style }: { style: FixedStyle }) {
  const v = useStyleValues(style.slug);
  return (
    <tr>
      <td style={specimenStyle(style.slug)}>The quick brown fox jumps</td>
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

/* ---------- Variant styles (Weight is a Storybook Arg, mirroring the Figma
   variant property): Paragraph, Paragraph Serif ---------- */

function weightSlug(weight: Weight) {
  return weight.toLowerCase();
}

function VariantRow({ name, baseSlug, weight }: { name: string; baseSlug: string; weight: Weight }) {
  const slug = `${baseSlug}-${weightSlug(weight)}`;
  const v = useStyleValues(slug);
  return (
    <tr>
      <td style={specimenStyle(slug)}>The quick brown fox jumps</td>
      <td style={monoCell}>{name}</td>
      <td style={monoCell}>{v.fontFamily || '…'}</td>
      <td style={monoCell}>
        {weight}
        <br />({v.fontWeight || '…'})
      </td>
      <td style={monoCell}>{v.fontSize || '…'}</td>
      <td style={monoCell}>{v.lineHeight || '…'}</td>
      <td style={monoCell}>{v.paragraphSpacing || '…'}</td>
      <td style={monoCell}>{v.letterSpacing || '…'}</td>
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

const paragraphSerifSizes: { name: string; slug: string }[] = [{ name: 'Paragraph Serif', slug: 'paragraph-serif' }];

/* ---------- Stories ---------- */

export const Headings: Story = {
  render: () => (
    <div>
      <PendingNotice>
        <strong>Layer 2 — Typography Styles.</strong> Complete, Figma-sourced text styles — each
        one owns its full definition (font family, weight, size, line-height, paragraph-spacing,
        letter-spacing) as a single <code>--text-{'{style}'}-*</code> namespace. There are no
        reusable raw font-size/line-height/paragraph-spacing/letter-spacing tokens: those values
        only have meaning as part of a complete style.
        <br />
        <br />
        Headings, Caption, and Monospaced have no weight variants — each is a single fixed style.
        Paragraph and Paragraph Serif do have weight variants (Regular/Medium/Bold); see those
        pages for a live <strong>Weight</strong> control mirroring Figma's variant model, where
        weight is a property of the style rather than a separate top-level style.
      </PendingNotice>

      <SectionHeading>Typography Styles / Headings</SectionHeading>
      <FixedTable rows={headings} />
    </div>
  ),
};

export const Paragraph: WeightStory = {
  argTypes: { weight: weightArgType },
  args: { weight: 'Regular' },
  render: (args) => {
    const weight = args.weight;
    return (
      <div>
        <PendingNotice>
          <strong>Paragraph</strong> (Gellix). 6 sizes (XXL/XL/Large/Regular/Small/Mini), each
          available in 3 weights per Figma's Styles panel — Regular, Medium, and Bold (the Bold
          variant is implemented with the Gellix <em>Semibold</em> face, 600, not the file
          literally named Bold). Use the <strong>Weight</strong> control below to switch all six
          specimens at once, mirroring Figma's variant property (weight is a property of the
          style, not a separate style). Font-size, line-height, paragraph-spacing, and
          letter-spacing are identical across a size's three weight siblings — only font-weight
          changes.
        </PendingNotice>

        <SectionHeading>Typography Styles / Paragraph</SectionHeading>
        <VariantTable rows={paragraphSizes} weight={weight} />
      </div>
    );
  },
};

export const ParagraphSerif: WeightStory = {
  argTypes: { weight: weightArgType },
  args: { weight: 'Regular' },
  render: (args) => {
    const weight = args.weight;
    return (
      <div>
        <PendingNotice>
          <strong>Paragraph Serif</strong> (Sharp Serif). A single size — 22px / 31px line-height,
          matching Paragraph XL's metric exactly — available in 3 weights per Figma's Styles
          panel: Regular, Medium, and Bold (Sharp Serif's real Bold face, 700 — no substitution
          needed, unlike Paragraph's Gellix Bold). Use the <strong>Weight</strong> control below
          to switch the specimen, mirroring Figma's variant property.
          <br />
          <br />
          <strong>Inference flagged:</strong> paragraph-spacing (20px) and letter-spacing (0px)
          aren't independently visible for this style in Figma's Styles panel (which only shows
          size/line-height) — carried over from Paragraph XL's already-confirmed values, since the
          font-size/line-height match exactly.
        </PendingNotice>

        <SectionHeading>Typography Styles / Paragraph Serif</SectionHeading>
        <VariantTable rows={paragraphSerifSizes} weight={weight} />
      </div>
    );
  },
};

export const Caption: Story = {
  render: () => (
    <div>
      <SectionHeading>Typography Styles / Caption</SectionHeading>
      <FixedTable rows={captions} />
    </div>
  ),
};

export const Monospaced: Story = {
  render: () => (
    <div>
      <SectionHeading>Typography Styles / Monospaced</SectionHeading>
      <FixedTable rows={monospaced} />
    </div>
  ),
};
