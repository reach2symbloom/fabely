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
type HeadingLevel = '1' | '2' | '3' | '4';
type HeadingArgs = { level: HeadingLevel };
type CaptionSize = 'mini' | 'sm' | 'md' | 'lg';
type CaptionArgs = { size: CaptionSize };

const meta = {
  title: 'Design System/Foundations/Typography/Typography Styles',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;
type WeightStory = StoryObj<Meta<WeightArgs>>;
type HeadingsStory = StoryObj<Meta<HeadingArgs>>;
type CaptionsStory = StoryObj<Meta<CaptionArgs>>;

// "Bold" is the public semantic name (Figma + Storybook); it resolves to the
// Gellix Semibold face via --font-weight-paragraph-bold (Sharp Serif's own
// Bold face for Manuscript — see the header note on --font-weight-paragraph-
// serif-* in typography.css), but "Semibold" is never surfaced in the
// control or the documentation UI.
const weightArgType = {
  control: { type: 'inline-radio' },
  options: ['Regular', 'Medium', 'Bold'],
} as const;

const headingLevelArgType = {
  control: { type: 'inline-radio', labels: { '1': 'H1', '2': 'H2', '3': 'H3', '4': 'H4' } },
  options: ['1', '2', '3', '4'],
} as const;

const captionSizeArgType = {
  control: { type: 'inline-radio', labels: { mini: 'Mini', sm: 'Sm', md: 'Md', lg: 'Lg' } },
  options: ['mini', 'sm', 'md', 'lg'],
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
 * primary documentation experience exposes the relevant choice directly on
 * the page. Syncs with Storybook's args store via useArgs (in each story's
 * render), so it and the native Controls panel always agree. Generic so
 * Weight, Heading level, and Caption size all reuse the same component. */
function InlineSegmentedControl<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        gap: 4,
        padding: 4,
        border: '1px solid var(--border)',
        borderRadius: 8,
        marginBottom: 16,
      }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            fontFamily: 'var(--font-family-sans)',
            fontWeight: 'var(--font-weight-sans-regular)',
            fontSize: 13,
            padding: '6px 16px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            background: value === opt.value ? 'var(--primary)' : 'transparent',
            color: value === opt.value ? 'var(--primary-foreground)' : 'inherit',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const weightOptions: { value: Weight; label: string }[] = [
  { value: 'Regular', label: 'Regular' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Bold', label: 'Bold' },
];

const headingLevelOptions: { value: HeadingLevel; label: string }[] = [
  { value: '1', label: 'H1' },
  { value: '2', label: 'H2' },
  { value: '3', label: 'H3' },
  { value: '4', label: 'H4' },
];

const captionSizeOptions: { value: CaptionSize; label: string }[] = [
  { value: 'mini', label: 'Mini' },
  { value: 'sm', label: 'Sm' },
  { value: 'md', label: 'Md' },
  { value: 'lg', label: 'Lg' },
];

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

/* ---------- Pages ---------- */

export const Headings: HeadingsStory = {
  argTypes: { level: headingLevelArgType },
  args: { level: '1' },
  render: () => {
    const [args, updateArgs] = useArgs<HeadingArgs>();
    const level: HeadingLevel = args.level ?? '1';
    const slug = `heading-${level}`;
    return (
      <div>
        <TypographyPageTitle>Headings</TypographyPageTitle>
        <TypographyNotice>
          Fabely's display hierarchy — Heading 1 through Heading 4. All four use Sharp Serif at
          the semantic <strong>Light</strong> weight (aliased via{' '}
          <code>--font-family-headings</code> / <code>--font-weight-serif-light</code>), sized
          56/30/24/20px. There are no weight variants — hierarchy comes from size and
          paragraph-spacing, not boldness.
        </TypographyNotice>

        <TypographySectionHeading>Interactive Example</TypographySectionHeading>
        <InlineSegmentedControl
          value={level}
          options={headingLevelOptions}
          onChange={(l) => updateArgs({ level: l })}
          ariaLabel="Heading level"
        />
        <LiveSpecimenPanel slug={slug} />

        <TypographySectionHeading>Reference Table</TypographySectionHeading>
        <FixedTable rows={headings} />

        <TypographySectionHeading>Architecture Notes</TypographySectionHeading>
        <TypographyNotice>
          All four headings share the same font-family and weight — only size, line-height, and
          paragraph-spacing change across the scale. paragraph-spacing (48/30/20/20px) is the
          space Figma specifies after each heading before the following content.
        </TypographyNotice>
      </div>
    );
  },
};

export const Paragraph: WeightStory = {
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
        <InlineSegmentedControl
          value={weight}
          options={weightOptions}
          onChange={(w) => updateArgs({ weight: w })}
          ariaLabel="Weight"
        />
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

export const Manuscript: WeightStory = {
  argTypes: { weight: weightArgType },
  args: { weight: 'Regular' },
  render: () => {
    const [args, updateArgs] = useArgs<WeightArgs>();
    const weight: Weight = args.weight ?? 'Regular';
    return (
      <div>
        <TypographyPageTitle>Manuscript</TypographyPageTitle>
        <TypographyNotice>
          Manuscript represents the semantic typography layer for long-form reading text. Sharp
          Serif is the current default manuscript implementation. Unlike Paragraph, Manuscript
          maintains its own semantic weight mappings and documentation. It does not inherit the
          Paragraph (Gellix) weight definitions or implementation notes. The Manuscript semantic
          API is intentionally designed to support future user-selectable manuscript font
          families while remaining stable for components.
        </TypographyNotice>

        <TypographySectionHeading>Interactive Example</TypographySectionHeading>
        <InlineSegmentedControl
          value={weight}
          options={weightOptions}
          onChange={(w) => updateArgs({ weight: w })}
          ariaLabel="Weight"
        />
        <LiveSpecimenPanel slug={`paragraph-serif-${weightSlug(weight)}`} />

        <TypographySectionHeading>Reference Table</TypographySectionHeading>
        <TypographySubHeading>Sharp Serif</TypographySubHeading>
        <VariantTable rows={manuscriptSizes} weight={weight} />

        <TypographySectionHeading>Manuscript Weight Mapping</TypographySectionHeading>
        <TypographyNotice>
          Manuscript typography represents long-form reading text. Its semantic weights are
          resolved independently of the Paragraph typography. Manuscript does not inherit the
          Gellix weight mappings or implementation notes. The current implementation uses Sharp
          Serif, but the Manuscript semantic API is intentionally designed to support future
          manuscript font families without changing the API consumed by components.
          <br />
          <br />
          Regular, Medium, and Bold currently resolve through <code>
            --font-weight-paragraph-serif-*
          </code>{' '}
          to Sharp Serif's own Regular (400), Medium (500), and Bold (700) faces — a mapping
          verified against the registered <code>@font-face</code> declarations and the resolved
          CSS custom properties, independently of any other typography group. This mapping against
          Figma's exact Manuscript weight-token intent is still unconfirmed pending that source
          data — flagged for verification, not asserted as final.
        </TypographyNotice>

        <TypographySectionHeading>Architecture Notes</TypographySectionHeading>
        <TypographyNotice>
          <strong>Manuscript</strong> is the stable semantic layer; <strong>Sharp Serif</strong> is
          today's concrete implementation, nested beneath it. paragraph-spacing (20px) and
          letter-spacing (0px) aren't independently visible for this style in Figma's Styles panel
          (which only shows size/line-height) — carried over from the already-confirmed Paragraph
          XL values, since the font-size/line-height happen to match exactly.
          <br />
          <br />
          <strong>TODO:</strong> Expand the Manuscript section to support multiple
          user-selectable manuscript fonts (e.g. Sharp Serif, Garamond, Baskerville, etc.). The
          Manuscript semantic layer should remain stable while individual manuscript font families
          become interchangeable implementations beneath it.
          <br />
          <br />
          <strong>Group-Specific Documentation.</strong> Documentation should describe the
          semantic group it belongs to. Shared controls (such as a weight selector) do not imply
          shared semantics. Each typography group should document:
          <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
            <li>its purpose</li>
            <li>its semantic behavior</li>
            <li>its implementation details (when relevant)</li>
            <li>its architectural rationale</li>
          </ul>
          Paragraph and Manuscript may both expose semantic weight controls, but they represent
          different typography systems and should evolve independently. Documentation should
          describe the semantic layer itself rather than inheriting explanations from another
          implementation.
        </TypographyNotice>
      </div>
    );
  },
};

export const Captions: CaptionsStory = {
  argTypes: { size: captionSizeArgType },
  args: { size: 'mini' },
  render: () => {
    const [args, updateArgs] = useArgs<CaptionArgs>();
    const size: CaptionSize = args.size ?? 'mini';
    const slug = `caption-${size}`;
    return (
      <div>
        <TypographyPageTitle>Captions</TypographyPageTitle>
        <TypographyNotice>
          Small utility text — timestamps, helper text, meta labels. Four sizes (Mini/Sm/Md/Lg),
          all Gellix at the semantic <strong>Medium</strong> weight. Md and Lg use a notably wide
          5px letter-spacing, distinct from Mini/Sm's 1px — preserved exactly as Figma specifies.
        </TypographyNotice>

        <TypographySectionHeading>Interactive Example</TypographySectionHeading>
        <InlineSegmentedControl
          value={size}
          options={captionSizeOptions}
          onChange={(s) => updateArgs({ size: s })}
          ariaLabel="Caption size"
        />
        <LiveSpecimenPanel slug={slug} />

        <TypographySectionHeading>Reference Table</TypographySectionHeading>
        <FixedTable rows={captions} />
      </div>
    );
  },
};

export const Monospaced: Story = {
  render: () => (
    <div>
      <TypographyPageTitle>Monospaced</TypographyPageTitle>
      <TypographyNotice>
        A single fixed style for code and technical content — Fira Mono Regular, 16px / 24px.
        There are no meaningful controls, so a static specimen (in the table below) and reference
        table are sufficient.
      </TypographyNotice>

      <TypographySectionHeading>Reference Table</TypographySectionHeading>
      <FixedTable rows={monospaced} />
    </div>
  ),
};
