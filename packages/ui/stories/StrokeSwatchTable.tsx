import { useEffect, useState, type CSSProperties } from 'react';

export type StrokeToken = {
  /** Display name as it appears in Figma (e.g. "hairline" or "regular") */
  name: string;
  /** CSS custom property that holds this token, without var(), e.g. "--stroke-regular" */
  cssVar: string;
  /** Free-form note, e.g. a TODO */
  note?: string;
};

/** Reads the token's live value off the document root. Stroke is theme-independent, so unlike ColorSwatchTable there's no dependency on the active Light/Dark global. */
function useResolvedValue(cssVar: string) {
  const [value, setValue] = useState('');
  useEffect(() => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    setValue(v);
  }, [cssVar]);
  return value;
}

const cellStyle: CSSProperties = {
  padding: '8px 12px',
  borderBottom: '1px solid var(--border)',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 13,
  verticalAlign: 'middle',
};

function Row({ token }: { token: StrokeToken }) {
  const resolved = useResolvedValue(token.cssVar);
  return (
    <tr>
      <td style={cellStyle}>
        <div
          style={{
            height: 40,
            width: 60,
            borderStyle: 'solid',
            borderWidth: `var(${token.cssVar})`,
            borderColor: 'var(--primary)',
          }}
        />
      </td>
      <td style={cellStyle}>{token.name}</td>
      <td style={cellStyle}>{token.cssVar}</td>
      <td style={cellStyle}>{resolved || '…'}</td>
      <td style={{ ...cellStyle, opacity: 0.75 }}>{token.note ?? ''}</td>
    </tr>
  );
}

export function StrokeSwatchTable({ tokens }: { tokens: StrokeToken[] }) {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
      <thead>
        <tr>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Preview</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Token</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>CSS Variable</th>
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
