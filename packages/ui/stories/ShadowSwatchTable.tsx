import { useEffect, useState, type CSSProperties } from 'react';

export type ShadowToken = {
  /** Display name, e.g. "sm-black" */
  name: string;
  /** CSS custom property that holds this token's full box-shadow value, e.g. "--shadow-sm-black" */
  cssVar: string;
  /** The Alpha color token this shadow aliases, e.g. "--theme-alpha-black-no-switch-10" */
  reference: string;
  /** Which base color this shadow is built from — picks a contrasting preview backdrop so the shadow reads clearly regardless of the page's active Light/Dark toggle. */
  polarity: 'black' | 'white';
  /** Free-form note, e.g. a deviation from literal Figma color references */
  note?: string;
};

/** Reads the token's live value off the document root. Shadows are theme-independent (polarity is an explicit component choice, not theme-driven), so unlike ColorSwatchTable there's no dependency on the active Light/Dark global. */
function useResolvedValue(cssVar: string) {
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim());
  }, [cssVar]);
  return value;
}

const cellStyle: CSSProperties = {
  padding: '12px',
  borderBottom: '1px solid var(--border)',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 13,
  verticalAlign: 'middle',
};

function Row({ token }: { token: ShadowToken }) {
  const resolved = useResolvedValue(token.cssVar);
  // Preview against the surface each polarity is designed for: a black
  // shadow reads against a light surface, a white shadow against a dark
  // one — so both remain visible regardless of the page's own theme toggle.
  const backdrop = token.polarity === 'black' ? 'var(--tw-raw-white)' : 'var(--tw-raw-black)';
  return (
    <tr>
      <td style={{ ...cellStyle, padding: '20px 12px' }}>
        <div
          style={{
            width: 220,
            height: 90,
            background: backdrop,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible',
          }}
        >
          <div
            style={{
              width: 100,
              height: 48,
              borderRadius: 6,
              background: backdrop,
              boxShadow: `var(${token.cssVar})`,
            }}
          />
        </div>
      </td>
      <td style={cellStyle}>{token.name}</td>
      <td style={cellStyle}>{token.cssVar}</td>
      <td style={cellStyle}>{token.reference}</td>
      <td style={cellStyle}>{resolved || '…'}</td>
      <td style={{ ...cellStyle, opacity: 0.75 }}>{token.note ?? ''}</td>
    </tr>
  );
}

export function ShadowSwatchTable({ tokens }: { tokens: ShadowToken[] }) {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
      <thead>
        <tr>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Preview</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Token</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>CSS Variable</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Aliases (Alpha)</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Resolved Value</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Note</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((t) => (
          <Row key={t.cssVar} token={t} />
        ))}
      </tbody>
    </table>
  );
}
