import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState, type ReactNode } from 'react';
import { useArgs } from 'storybook/preview-api';
import { Search, Check, Info, ChevronRight, Coffee } from 'lucide-react';
import { Bolt } from '@solar-icons/react';
import {
  IconographyNotice,
  IconographyPageTitle,
  IconographySectionHeading,
  uiCellStyle,
  codeCellStyle,
} from './IconographyDocChrome';
import { InlineSegmentedControl } from './InlineSegmentedControl';

type SizeName = '2XS' | 'XS' | 'SM' | 'MD' | 'LG' | 'XL' | '2XL' | '3XL';
type SizeArgs = { size: SizeName };

const meta = {
  title: 'Design System/Foundations/Iconography',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;
type SizeStory = StoryObj<Meta<SizeArgs>>;

const sizeArgType = {
  control: { type: 'inline-radio' },
  options: ['2XS', 'XS', 'SM', 'MD', 'LG', 'XL', '2XL', '3XL'],
} as const;

type IconSizeToken = {
  name: SizeName;
  cssVar: string;
  reference: string;
  usage: string;
};

const iconSizes: IconSizeToken[] = [
  {
    name: '2XS',
    cssVar: '--icon-2xs',
    reference: 'var(--spacing-xs)',
    usage: 'Micro indicators in dense chrome; sparingly',
  },
  {
    name: 'XS',
    cssVar: '--icon-xs',
    reference: 'var(--spacing-sm)',
    usage: 'Badges, compact chips, inline metadata',
  },
  {
    name: 'SM',
    cssVar: '--icon-sm',
    reference: 'var(--spacing-md)',
    usage: 'Default inline with body text; inputs; small buttons',
  },
  {
    name: 'MD',
    cssVar: '--icon-md',
    reference: 'var(--spacing-lg)',
    usage: 'Buttons, list rows, navigation items',
  },
  {
    name: 'LG',
    cssVar: '--icon-lg',
    reference: 'var(--spacing-xl)',
    usage: 'Default component icon; alerts; toolbars',
  },
  {
    name: 'XL',
    cssVar: '--icon-xl',
    reference: 'var(--spacing-2xl)',
    usage: 'Featured actions; empty-state accents',
  },
  {
    name: '2XL',
    cssVar: '--icon-2xl',
    reference: 'var(--spacing-3xl)',
    usage: 'Large empty states; illustration anchors',
  },
  {
    name: '3XL',
    cssVar: '--icon-3xl',
    reference: 'var(--spacing-4xl)',
    usage: 'Hero / illustration-scale accents only',
  },
];

const sizeByName: Record<SizeName, IconSizeToken> = Object.fromEntries(
  iconSizes.map((t) => [t.name, t]),
) as Record<SizeName, IconSizeToken>;

function useResolvedValue(cssVar: string) {
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim());
  }, [cssVar]);
  return value;
}

function SpecimenPanel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 24,
        flexWrap: 'wrap',
      }}
    >
      {children}
    </div>
  );
}

function GuidanceList({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
      {items.map((item) => (
        <div
          key={item.title}
          style={{
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: 16,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-family-sans)',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            {item.title}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-family-sans)',
              fontSize: 13,
              lineHeight: 1.5,
              opacity: 0.85,
            }}
          >
            {item.body}
          </div>
        </div>
      ))}
    </div>
  );
}

function SizePreview({ size }: { size: SizeName }) {
  const token = sizeByName[size];
  const resolved = useResolvedValue(token.cssVar);
  const px = Number.parseFloat(resolved) || 24;
  const iconStyle = { width: `var(${token.cssVar})`, height: `var(${token.cssVar})` };
  const labelStyle = {
    fontFamily: 'var(--font-family-sans)',
    fontSize: 12,
    opacity: 0.75,
    textAlign: 'center' as const,
  };

  return (
    <SpecimenPanel>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Coffee
          aria-hidden
          style={iconStyle}
          strokeWidth={size === '2XS' || size === 'XS' ? 1.5 : 2}
        />
        <div style={labelStyle}>
          Lucide · Coffee
          <div>
            {token.name} · <code style={{ fontSize: 12 }}>{token.cssVar}</code>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Bolt aria-hidden weight="BoldDuotone" color="currentColor" size={px} />
        <div style={labelStyle}>
          Solar · Bolt
          <div>
            {token.name} · <code style={{ fontSize: 12 }}>{token.cssVar}</code>
          </div>
        </div>
      </div>
    </SpecimenPanel>
  );
}

function SizeRow({ token }: { token: IconSizeToken }) {
  const resolved = useResolvedValue(token.cssVar);
  return (
    <tr>
      <td style={uiCellStyle}>
        <div
          style={{
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed var(--border)',
            borderRadius: 8,
          }}
        >
          <Search
            aria-hidden
            style={{ width: `var(${token.cssVar})`, height: `var(${token.cssVar})` }}
            strokeWidth={token.name === '2XS' || token.name === 'XS' ? 1.5 : 2}
          />
        </div>
      </td>
      <td style={uiCellStyle}>{token.name}</td>
      <td style={codeCellStyle}>{token.cssVar}</td>
      <td style={codeCellStyle}>{token.reference}</td>
      <td style={codeCellStyle}>{resolved || '…'}</td>
      <td style={{ ...uiCellStyle, opacity: 0.75, fontSize: 13, maxWidth: 280 }}>{token.usage}</td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Overview: Story = {
  render: () => (
    <div>
      <IconographyPageTitle>Iconography</IconographyPageTitle>
      <IconographyNotice>
        <strong>Iconography</strong> establishes the global icon system for the Fabely Design
        System. Icons clarify action, status, and navigation — they should feel precise and
        quiet, never decorative noise. Prefer a single visual language per surface so interfaces
        stay coherent.
      </IconographyNotice>

      <IconographySectionHeading>Philosophy</IconographySectionHeading>
      <GuidanceList
        items={[
          {
            title: 'Lucide is the primary system icon set',
            body: 'Use Lucide for UI chrome: buttons, inputs, navigation, alerts, badges, menus, and any interactive control. Its consistent geometric stroke language is the default Fabely system look.',
          },
          {
            title: 'Solar Bold Duotone is permitted for illustrations',
            body: 'Reach for Solar (Bold Duotone) when you need an illustrative accent, empty-state metaphor, or a glyph Lucide does not offer. Treat it as a secondary set — not system UI chrome.',
          },
          {
            title: 'Never mix icon styles in the same interface',
            body: 'A screen, dialog, or component composition should use one set end-to-end. Mixing Lucide stroke icons with Solar Bold Duotone glyphs in the same toolbar, list, or alert creates visual dissonance and undermines the system.',
          },
        ]}
      />

      <IconographySectionHeading>Quick reference</IconographySectionHeading>
      <IconographyNotice>
        Size tokens live under <code>--icon-*</code> and alias Spacing semantic tokens. Browse{' '}
        <strong>Size Tokens</strong>, <strong>Stroke &amp; Alignment</strong>,{' '}
        <strong>Icon Library → Lucide / Solar</strong>, and <strong>Best Practices</strong> for the
        full guidance.
      </IconographyNotice>
    </div>
  ),
};

export const SizeTokens: SizeStory = {
  name: 'Size Tokens',
  argTypes: { size: sizeArgType },
  args: { size: 'LG' },
  render: () => {
    const [args, updateArgs] = useArgs<SizeArgs>();
    const size: SizeName = args.size ?? 'LG';
    return (
      <div>
        <IconographyPageTitle>Icon Size Tokens</IconographyPageTitle>
        <IconographyNotice>
          These are the canonical Foundation icon size tokens (<code>--icon-2xs</code> …
          <code>--icon-3xl</code>). Components must consume them via{' '}
          <code>var(--icon-*)</code> instead of hardcoded px or ad-hoc Tailwind sizes. Every
          token aliases a Spacing semantic token so icon frames stay on the same rhythm as
          layout spacing. Do not invent sizes outside this scale.
        </IconographyNotice>

        <IconographySectionHeading>Interactive Example</IconographySectionHeading>
        <InlineSegmentedControl
          label="Size"
          value={size}
          options={['2XS', 'XS', 'SM', 'MD', 'LG', 'XL', '2XL', '3XL']}
          onChange={(v) => updateArgs({ size: v })}
          className="mb-3"
        />
        <SizePreview size={size} />

        <IconographySectionHeading>Reference Table</IconographySectionHeading>
        <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
          <thead>
            <tr>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Preview</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Token</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>CSS Variable</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Aliases</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Resolved Value</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Typical usage</th>
            </tr>
          </thead>
          <tbody>
            {iconSizes.map((token) => (
              <SizeRow key={token.cssVar} token={token} />
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

export const StrokeAndAlignment: Story = {
  name: 'Stroke & Alignment',
  render: () => (
    <div>
      <IconographyPageTitle>Stroke &amp; Alignment</IconographyPageTitle>
      <IconographyNotice>
        Icons must sit on the same optical grid as type and controls. Stroke weight, box
        centering, and gap to labels matter as much as which glyph you pick.
      </IconographyNotice>

      <IconographySectionHeading>Stroke consistency</IconographySectionHeading>
      <GuidanceList
        items={[
          {
            title: 'Keep Lucide stroke width stable',
            body: 'Default to strokeWidth 2 at SM and above. At 2XS / XS, 1.5 is acceptable so hairlines do not clog. Do not mix stroke widths among sibling icons in the same control group.',
          },
          {
            title: 'Match optical weight to type',
            body: 'Icons next to Paragraph Small / medium UI labels should feel co-equal with the text stroke — not heavier than the label, not wispy. Prefer currentColor so icons inherit the control’s text color (and disabled opacity).',
          },
        ]}
      />

      <IconographySectionHeading>Optical alignment</IconographySectionHeading>
      <SpecimenPanel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 420 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2xs)',
              fontFamily: 'var(--font-family-sans)',
              fontSize: 14,
            }}
          >
            <Check aria-hidden style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }} />
            Aligned to text midpoint (items-center)
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--spacing-sm)',
              fontFamily: 'var(--font-family-sans)',
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            <Info
              aria-hidden
              style={{
                width: 'var(--icon-lg)',
                height: 'var(--icon-lg)',
                marginTop: 2,
                flexShrink: 0,
              }}
            />
            <span>
              Multi-line copy: keep the icon optically pinned to the first line. Prefer a slight
              top nudge over vertical centering when the block wraps.
            </span>
          </div>
        </div>
      </SpecimenPanel>

      <IconographySectionHeading>Icon centering</IconographySectionHeading>
      <GuidanceList
        items={[
          {
            title: 'Center in the hit target, not just the glyph box',
            body: 'Icon-only buttons and badge icon slots should center the SVG in a square frame sized to the icon token (or the control’s fixed icon slot). Avoid asymmetric padding that shifts the glyph off-center.',
          },
          {
            title: 'Preserve the viewBox',
            body: 'Do not stretch icons with unequal width/height. Always set both axes to the same --icon-* token (or a single size prop).',
          },
        ]}
      />

      <IconographySectionHeading>Icon spacing relative to text</IconographySectionHeading>
      <SpecimenPanel>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-2xs)',
            fontFamily: 'var(--font-family-sans)',
            fontSize: 14,
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid var(--border)',
          }}
        >
          <Search aria-hidden style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }} />
          gap: spacing-2xs (4px)
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            fontFamily: 'var(--font-family-sans)',
            fontSize: 14,
            padding: '10px 16px',
            borderRadius: 8,
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
          }}
        >
          Continue
          <ChevronRight aria-hidden style={{ width: 'var(--icon-md)', height: 'var(--icon-md)' }} />
        </div>
      </SpecimenPanel>
      <IconographyNotice>
        Default label gap is <code>--spacing-2xs</code> (4px) for compact controls (badges, chips)
        and <code>--spacing-xs</code> (8px) for buttons and nav items. Reuse Spacing tokens — do
        not hardcode ad-hoc gaps.
      </IconographyNotice>

      <IconographySectionHeading>Component guidance</IconographySectionHeading>
      <GuidanceList
        items={[
          {
            title: 'Buttons',
            body: 'Leading/trailing icons: SM–MD depending on button size. Icon-only buttons: MD–LG with an equal padding box. Keep one size per button group.',
          },
          {
            title: 'Badges',
            body: 'Prefer XS (12px) for default badges; SM only when the badge type scale is large. Gap to label: spacing-2xs.',
          },
          {
            title: 'Alerts',
            body: 'Single-line alerts typically use SM; two-line alerts may step up to LG so the icon balances the title block. Status color comes from the alert variant — icons use currentColor.',
          },
          {
            title: 'Inputs',
            body: 'Leading/trailing adornments use SM, vertically centered in the field. Keep clear space from the field edge with spacing tokens, not magic numbers.',
          },
          {
            title: 'Navigation',
            body: 'Sidebar / tab icons: MD–LG. Pair with medium-weight labels. Active and inactive states change color/opacity, not icon set or stroke style.',
          },
        ]}
      />
    </div>
  ),
};

export const BestPractices: Story = {
  name: 'Best Practices',
  render: () => (
    <div>
      <IconographyPageTitle>Best Practices</IconographyPageTitle>
      <IconographyNotice>
        Icons carry meaning. Use them with the same care as copy — clear intent, accessible
        labeling, and consistent pairing with status and interaction states.
      </IconographyNotice>

      <IconographySectionHeading>Decorative vs semantic</IconographySectionHeading>
      <GuidanceList
        items={[
          {
            title: 'Decorative icons',
            body: 'When the adjacent text already conveys the meaning, mark the icon aria-hidden and let the label speak. Most button/badge leading icons are decorative.',
          },
          {
            title: 'Semantic icons',
            body: 'When the icon is the sole carrier of meaning (icon-only button, status without text), provide an accessible name via aria-label / title / visually hidden text. Never rely on color alone for status.',
          },
        ]}
      />

      <IconographySectionHeading>Interactive icons</IconographySectionHeading>
      <GuidanceList
        items={[
          {
            title: 'Hit targets',
            body: 'Icon-only controls need a comfortable hit area (at least ~40px) even when the glyph is SM/MD. Enlarge the tap target with padding, not by inventing a larger icon size.',
          },
          {
            title: 'Feedback',
            body: 'Hover/focus/active should follow the host control (button, menu item). Prefer color and focus-ring tokens from Effects — do not swap to a different icon set on interaction.',
          },
        ]}
      />

      <IconographySectionHeading>Status icons</IconographySectionHeading>
      <GuidanceList
        items={[
          {
            title: 'Map glyph to semantic intent',
            body: 'Success → check / circle-check; Warning → triangle / circle-alert; Error → circle-x / x; Info → info. Pair with semantic color tokens (success, alert, destructive, muted).',
          },
          {
            title: 'Keep status icons Lucide',
            body: 'Status is system UI. Do not substitute Solar illustration glyphs for alert or validation status — that role belongs to the Lucide set.',
          },
        ]}
      />

      <IconographySectionHeading>Directional icons</IconographySectionHeading>
      <GuidanceList
        items={[
          {
            title: 'Respect reading direction',
            body: 'Chevrons and arrows that imply forward/back should flip in RTL (or use logical directional icons). Vertical expand/collapse chevrons generally do not flip.',
          },
          {
            title: 'Be consistent about meaning',
            body: 'ChevronRight = navigate / nested; ChevronDown = expand in place; ExternalLink = leaves the surface. Do not overload one glyph with conflicting jobs in the same product area.',
          },
        ]}
      />

      <IconographySectionHeading>Disabled states</IconographySectionHeading>
      <GuidanceList
        items={[
          {
            title: 'Inherit disabled styling',
            body: 'Icons inside disabled controls should use currentColor and inherit the control’s disabled opacity/color — do not hand-tint icons to a separate gray that drifts from the text.',
          },
          {
            title: 'Do not change the glyph',
            body: 'Disabled is a state of the control, not a different icon. Keep the same Lucide (or Solar) glyph; only affordance and color change.',
          },
        ]}
      />

      <IconographySectionHeading>Avoid inconsistent usage</IconographySectionHeading>
      <GuidanceList
        items={[
          {
            title: 'One set per interface',
            body: 'Do not place Lucide and Solar side-by-side in the same toolbar, list, alert, or nav. If a screen needs illustration, isolate Solar to the empty/hero region and keep chrome on Lucide.',
          },
          {
            title: 'Stay on the size scale',
            body: 'Only use --icon-2xs … --icon-3xl. Ad-hoc 14px / 18px / 22px sizes fragment the system (legacy Badge 14px is a known debt — migrate to XS or SM).',
          },
          {
            title: 'Same metaphor, same glyph',
            body: 'Pick one icon for a concept (e.g. Settings vs SlidersHorizontal) and reuse it product-wide. Swapping synonyms across screens trains users to distrust the icon language.',
          },
        ]}
      />
    </div>
  ),
};
