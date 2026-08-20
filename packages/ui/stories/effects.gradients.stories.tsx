import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { EffectsNotice, EffectsSectionHeading, uiCellStyle, codeCellStyle } from './EffectsDocChrome';
import { InlineSegmentedControl } from './InlineSegmentedControl';

type Direction = 'Up' | 'Down' | 'Left' | 'Right';
type Args = { direction: Direction };

const meta = {
  title: 'Design System/Foundations/Effects/Gradients',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<Meta<Args>>;

const directionArgType = {
  control: { type: 'inline-radio' },
  options: ['Up', 'Down', 'Left', 'Right'],
} as const;

type GradientToken = {
  name: Direction;
  cssVar: string;
  note?: string;
};

const gradients: GradientToken[] = [
  {
    name: 'Up',
    cssVar: '--effect-gradient-fade-up',
    note: 'Figma "gradients/fade/fade up" — Note Footer’s scrim. Sits at a bottom edge, fades upward.',
  },
  { name: 'Down', cssVar: '--effect-gradient-fade-down', note: 'Mirror of Up, for a top edge.' },
  { name: 'Left', cssVar: '--effect-gradient-fade-left', note: 'Rotated for a right-hand edge scroll affordance.' },
  { name: 'Right', cssVar: '--effect-gradient-fade-right', note: 'Rotated for a left-hand edge scroll affordance.' },
];

const gradientByDirection: Record<Direction, GradientToken> = {
  Up: gradients[0],
  Down: gradients[1],
  Left: gradients[2],
  Right: gradients[3],
};

/** Which edge the solid stop sits on — the overlay panel this positions at. */
const overlayStyleByDirection: Record<Direction, React.CSSProperties> = {
  Up: { inset: 'auto 0 0 0', height: '60%' },
  Down: { inset: '0 0 auto 0', height: '60%' },
  Left: { inset: '0 0 0 auto', width: '60%' },
  Right: { inset: '0 auto 0 0', width: '60%' },
};

function useResolvedValue(cssVar: string) {
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim());
  }, [cssVar]);
  return value;
}

/** Faux content behind the gradient, so the fade-to-transparent edge reads clearly. */
function FauxContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{
            height: 8,
            borderRadius: 4,
            background: 'var(--muted-foreground)',
            opacity: 0.3,
            width: `${80 - i * 10}%`,
          }}
        />
      ))}
    </div>
  );
}

function GradientPreview({ direction }: { direction: Direction }) {
  const token = gradientByDirection[direction];
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
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 260,
          height: 160,
          overflow: 'hidden',
          background: 'var(--card)',
        }}
      >
        <FauxContent />
        <div
          style={{
            position: 'absolute',
            ...overlayStyleByDirection[direction],
            background: `var(${token.cssVar})`,
          }}
        />
      </div>
    </div>
  );
}

function GradientRow({ token }: { token: GradientToken }) {
  const resolved = useResolvedValue(token.cssVar);
  return (
    <tr>
      <td style={uiCellStyle}>
        <div
          style={{
            position: 'relative',
            width: 64,
            height: 48,
            borderRadius: 8,
            overflow: 'hidden',
            background: 'var(--card)',
          }}
        >
          <FauxContent />
          <div
            style={{
              position: 'absolute',
              ...overlayStyleByDirection[token.name],
              background: `var(${token.cssVar})`,
            }}
          />
        </div>
      </td>
      <td style={uiCellStyle}>Fade {token.name}</td>
      <td style={codeCellStyle}>{token.cssVar}</td>
      <td style={codeCellStyle}>{resolved || '…'}</td>
      <td style={{ ...uiCellStyle, opacity: 0.75, fontSize: 13, maxWidth: 280 }}>{token.note ?? ''}</td>
    </tr>
  );
}

export const Overview: Story = {
  argTypes: { direction: directionArgType },
  args: { direction: 'Up' },
  render: () => {
    const [args, updateArgs] = useArgs<Args>();
    const direction: Direction = args.direction ?? 'Up';
    return (
      <div>
        <EffectsNotice>
          <strong>Gradients</strong> are semantic "content fades into the surface" treatments — a
          two-stop fade from transparent to the theme's own surface color
          (<code>--theme-alpha-white-switch-*</code>: white in light theme, near-black in dark),
          so no light/dark variants or consumer-supplied color are needed. Figma only defines{' '}
          <code>fade up</code> (Note Footer's scrim); Down/Left/Right are the same gradient
          rotated to the other three edges, generated alongside it so all four are available
          together.
        </EffectsNotice>

        <EffectsSectionHeading>Interactive Example</EffectsSectionHeading>
        <InlineSegmentedControl
          value={direction}
          options={['Up', 'Down', 'Left', 'Right']}
          onChange={(v) => updateArgs({ direction: v })}
          ariaLabel="Direction"
          className="mb-6"
        />
        <GradientPreview direction={direction} />

        <EffectsSectionHeading>Reference Table</EffectsSectionHeading>
        <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
          <thead>
            <tr>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Preview</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Token</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>CSS Variable</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Resolved Value</th>
              <th style={{ ...uiCellStyle, textAlign: 'left' }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {gradients.map((g) => (
              <GradientRow key={g.cssVar} token={g} />
            ))}
          </tbody>
        </table>

        <EffectsSectionHeading>Architecture Notes</EffectsSectionHeading>
        <EffectsNotice>
          The direction suffix names the edge the <em>solid</em> stop sits on, matching how it
          reads in use — <code>fade-up</code> docks at a bottom edge and fades upward into
          transparency; <code>fade-down</code> is the mirror, for a top edge;{' '}
          <code>fade-left</code>/<code>fade-right</code> for a side edge (horizontal scroll
          affordances).
        </EffectsNotice>
      </div>
    );
  },
};
