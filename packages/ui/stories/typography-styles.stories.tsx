import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState, type CSSProperties } from 'react';
import { useArgs } from 'storybook/preview-api';
import {
  TypographyNotice,
  TypographyPageTitle,
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
// Gellix Semibold face via --font-weight-paragraph-bold (Sharp Serif's real
// Bold face for Manuscript), but "Semibold" is never surfaced in the control
// or the documentation UI.
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

function weightSlug(weight: Weight) {
  return weight.toLowerCase();
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

/** Clickable inline control (not just the native Controls addon) so the
 * primary documentation experience exposes the weight choice directly on the
 * page. Syncs with Storybook's args store via useArgs, so it and the native
 * Controls panel radio always agree. */
function InteractiveWeightControl({ weight, onChange }: { weight: Weight; onChange: (w: Weight) => void }) {
  const options: Weight[] = ['Regular', 'Medium', 'Bold'];
  return (
    <div
      role="radiogroup"
      aria-label="Weight"
      style={{
        display: 'inline-flex',
        gap: 4,
        padding: 4,
        border: '1px solid var(--border)',
        borderRadius: 8,
        marginBottom: 16,
      }}
    >
      {options.map((w) => (
        <button
          key={w}
          type="button"
          role="radio"
          aria-checked={weight === w}
          onClick={() => onChange(w)}
          style={{
            fontFamily: 'var(--font-family-sans)',
            fontWeight: 'var(--font-weight-sans-regular)',
            fontSize: 13,
            padding: '6px 16px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            background: weight === w ? 'var(--primary)' : 'transparent',
            color: weight === w ? 'var(--primary-foreground)' : 'inherit',
          }}
        >
          {w}
        </button>
      ))}
    </div>
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

/** A live rendered visual block for groups with no weight variants — not a
 * table row, just each style stacked so it reads like a realistic mockup. */
function LiveSpecimenStack({ rows }: { rows: FixedStyle[] }) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '24px 20px',
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {rows.map((r) => (
        <div key={r.slug} style={specimenStyle(r.slug)}>
          The quick brown fox jumps
        </div>
      ))}
    </div>
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

/* ---------- Variant styles: Paragraph, Manuscript — a shared "weight" Args
   control (Regular/Medium/Bold) drives every row; nothing here hardcodes a
   raw numeric weight — the slug just selects which --text-*-{weight}-*
   namespace to read, and CSS resolves the actual number. ---------- */

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

/** Single representative specimen for a page's Interactive Example section — a
 * bigger, bordered "preview panel" rather than a table row. */
function LiveSpecimenPanel({ slug }: { slug: string }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '24px 20px', marginBottom: 24 }}>
      <div style={specimenStyle(slug)}>The quick brown fox jumps</div>
    </div>
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
// nested under the "Manuscript" semantic section — the underlying slug (and
// its --text-paragraph-serif-* CSS variables) is unchanged, preserving
// Figma's naming; only how it's presented in Storybook changes.
const manuscriptSizes: { name: string; slug: string }[] = [{ name: 'Sharp Serif', slug: 'paragraph-serif' }];

/* ---------- Catalog (All Styles): one row per named style at its default
   weight — Paragraph/Manuscript's Medium/Bold variants live on their own
   dedicated pages, not duplicated here. ---------- */

type CatalogStyle = FixedStyle & { group: string };

const catalog: CatalogStyle[] = [
  ...headings.map((h) => ({ ...h, group: 'Headings' })),
  ...paragraphSizes.map((s) => ({ name: s.name, slug: `${s.slug}-regular`, weightLabel: 'Body / Regular', group: 'Paragraph' })),
  ...manuscriptSizes.map((s) => ({
    name: s.name,
    slug: `${s.slug}-regular`,
    weightLabel: 'Manuscript / Regular',
    group: 'Manuscript',
  })),
  ...captions.map((c) => ({ ...c, group: 'Captions' })),
  ...monospaced.map((m) => ({ ...m, group: 'Monospaced' })),
];

function CatalogRow({ style }: { style: CatalogStyle }) {
  const v = useStyleValues(style.slug);
  return (
    <tr>
      <td style={specimenStyle(style.slug)}>The quick brown fox jumps</td>
      <td style={uiCellStyle}>{style.group}</td>
      <td style={uiCellStyle}>{style.name}</td>
      <td style={codeCellStyle}>{v.fontFamily || '…'}</td>
      <WeightCell label={style.weightLabel} resolved={v.fontWeight} />
      <td style={codeCellStyle}>{v.fontSize || '…'}</td>
      <td style={codeCellStyle}>{v.lineHeight || '…'}</td>
      <td style={codeCellStyle}>{v.paragraphSpacing || '…'}</td>
      <td style={codeCellStyle}>{v.letterSpacing || '…'}</td>
    </tr>
  );
}

function CatalogTable({ rows }: { rows: CatalogStyle[] }) {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
      <thead>
        <tr>
          <th style={{ ...uiCellStyle, textAlign: 'left' }}>Specimen</th>
          <th style={{ ...uiCellStyle, textAlign: 'left' }}>Group</th>
          <th style={{ ...uiCellStyle, textAlign: 'left' }}>Style</th>
          <th style={{ ...uiCellStyle, textAlign: 'left' }}>Font Family</th>
          <th style={{ ...uiCellStyle, textAlign: 'left' }}>Weight</th>
          <th style={{ ...uiCellStyle, textAlign: 'left' }}>Size</th>
          <th style={{ ...uiCellStyle, textAlign: 'left' }}>Line Height</th>
          <th style={{ ...uiCellStyle, textAlign: 'left' }}>Para. Spacing</th>
          <th style={{ ...uiCellStyle, textAlign: 'left' }}>Letter Spacing</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <CatalogRow key={r.slug} style={r} />
        ))}
      </tbody>
    </table>
  );
}

/* ---------- Pages ---------- */

export const AllStyles: Story = {
  render: () => (
    <div>
      <TypographyPageTitle>All Styles</TypographyPageTitle>
      <TypographyNotice>
        <strong>Catalog.</strong> Every Typography Style at a glance. Each style owns a complete
        definition (font family, weight, size, line-height, paragraph-spacing, letter-spacing) —
        there are no reusable raw size/line-height/spacing tokens independent of a style.{' '}
        <strong>Paragraph</strong> and <strong>Manuscript</strong> are shown here at their default
        Regular weight; visit their dedicated pages for the full Regular/Medium/Bold range and
        interactive controls.
      </TypographyNotice>
      <CatalogTable rows={catalog} />
    </div>
  ),
};

export const Headings: Story = {
  render: () => (
    <div>
      <TypographyPageTitle>Headings</TypographyPageTitle>
      <TypographyNotice>
        Fabely's display hierarchy — Heading 1 through Heading 4. All four use Sharp Serif at the
        semantic <strong>Light</strong> weight (aliased via <code>--font-family-headings</code> /{' '}
        <code>--font-weight-serif-light</code>), sized 56/30/24/20px. There are no weight
        variants — hierarchy comes from size and paragraph-spacing, not boldness.
      </TypographyNotice>

      <TypographySectionHeading>Interactive Example</TypographySectionHeading>
      <LiveSpecimenStack rows={headings} />

      <TypographySectionHeading>Reference Table</TypographySectionHeading>
      <FixedTable rows={headings} />

      <TypographySectionHeading>Architecture Notes</TypographySectionHeading>
      <TypographyNotice>
        All four headings share the same font-family and weight — only size, line-height, and
        paragraph-spacing change across the scale. paragraph-spacing (48/30/20/20px) is the space
        Figma specifies after each heading before the following content.
      </TypographyNotice>
    </div>
  ),
};

export const Paragraph: Story = {
  argTypes: { weight: weightArgType },
  args: { weight: 'Regular' },
  render: () => {
    const [args, updateArgs] = useArgs<WeightArgs>();
    const weight: Weight = args.weight ?? 'Regular';
    return (
      <div>
        <TypographyPageTitle>Paragraph</TypographyPageTitle>
        <TypographyNotice>
          Fabely's body-text scale — six sizes (XXL down to Mini), all Gellix. Each size is
          available in three semantic weights: <strong>Regular</strong>, <strong>Medium</strong>,
          and <strong>Bold</strong>.
        </TypographyNotice>

        <TypographySectionHeading>Interactive Example</TypographySectionHeading>
        <InteractiveWeightControl weight={weight} onChange={(w) => updateArgs({ weight: w })} />
        <LiveSpecimenPanel slug={`paragraph-regular-${weightSlug(weight)}`} />

        <TypographySectionHeading>Reference Table</TypographySectionHeading>
        <VariantTable rows={paragraphSizes} weight={weight} />

        <TypographySectionHeading>Semantic Weight Explanation</TypographySectionHeading>
        <TypographyNotice>
          <strong>Regular</strong> (400) is the default reading weight. <strong>Medium</strong>{' '}
          (500) suits UI labels or subtle in-paragraph emphasis. <strong>Bold</strong> is
          implemented by Gellix's <em>Semibold</em> face (600) — Figma's semantic name is Bold,
          but the underlying font file is Semibold, not the file literally named Bold (700).
        </TypographyNotice>
      </div>
    );
  },
};

export const Manuscript: Story = {
  argTypes: { weight: weightArgType },
  args: { weight: 'Regular' },
  render: () => {
    const [args, updateArgs] = useArgs<WeightArgs>();
    const weight: Weight = args.weight ?? 'Regular';
    return (
      <div>
        <TypographyPageTitle>Manuscript</TypographyPageTitle>
        <TypographyNotice>
          Manuscript is the semantic typography layer for long-form serif reading text. Sharp
          Serif is the current (and so far only) implementation — a single size, 22px / 31px
          line-height (matching Paragraph XL's metric exactly), in three semantic weights:{' '}
          <strong>Regular</strong>, <strong>Medium</strong>, and <strong>Bold</strong>.
        </TypographyNotice>

        <TypographySectionHeading>Interactive Example</TypographySectionHeading>
        <InteractiveWeightControl weight={weight} onChange={(w) => updateArgs({ weight: w })} />
        <LiveSpecimenPanel slug={`paragraph-serif-${weightSlug(weight)}`} />

        <TypographySectionHeading>Reference Table</TypographySectionHeading>
        <TypographySubHeading>Sharp Serif</TypographySubHeading>
        <VariantTable rows={manuscriptSizes} weight={weight} />

        <TypographySectionHeading>Architecture Notes</TypographySectionHeading>
        <TypographyNotice>
          <strong>Manuscript</strong> is the stable semantic layer; <strong>Sharp Serif</strong> is
          today's concrete implementation, nested beneath it. paragraph-spacing (20px) and
          letter-spacing (0px) aren't independently visible for this style in Figma's Styles panel
          (which only shows size/line-height) — carried over from Paragraph XL's already-confirmed
          values, since the font-size/line-height match exactly. Bold is Sharp Serif's real Bold
          face (700) — no substitution needed, unlike Paragraph's Gellix Semibold.
          <br />
          <br />
          <strong>TODO:</strong> Expand the Manuscript section to support multiple
          user-selectable manuscript fonts (e.g. Sharp Serif, Garamond, Baskerville, etc.). The
          Manuscript semantic layer should remain stable while individual manuscript font families
          become interchangeable implementations beneath it.
        </TypographyNotice>
      </div>
    );
  },
};

export const Captions: Story = {
  render: () => (
    <div>
      <TypographyPageTitle>Captions</TypographyPageTitle>
      <TypographyNotice>
        Small utility text — timestamps, helper text, meta labels. Four sizes (Mini/Sm/Md/Lg), all
        Gellix at the semantic <strong>Medium</strong> weight. Md and Lg use a notably wide 5px
        letter-spacing, distinct from Mini/Sm's 1px — preserved exactly as Figma specifies.
      </TypographyNotice>

      <TypographySectionHeading>Interactive Example</TypographySectionHeading>
      <LiveSpecimenStack rows={captions} />

      <TypographySectionHeading>Reference Table</TypographySectionHeading>
      <FixedTable rows={captions} />
    </div>
  ),
};

export const Monospaced: Story = {
  render: () => (
    <div>
      <TypographyPageTitle>Monospaced</TypographyPageTitle>
      <TypographyNotice>
        A single fixed style for code and technical content — Fira Mono Regular, 16px / 24px.
      </TypographyNotice>

      <TypographySectionHeading>Interactive Example</TypographySectionHeading>
      <LiveSpecimenStack rows={monospaced} />

      <TypographySectionHeading>Reference Table</TypographySectionHeading>
      <FixedTable rows={monospaced} />
    </div>
  ),
};
