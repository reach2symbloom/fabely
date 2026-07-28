import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';

export type ColorToken = {
  /** Display name as it appears in Figma (e.g. "600 (main)") */
  name: string;
  /** CSS custom property that holds this token, without var(), e.g. "--tw-raw-neutral-600" */
  cssVar: string;
  /** For aliased tokens: the CSS custom property (or properties) this one references */
  reference?: string;
  /** Free-form note, e.g. "12% opacity per Figma" or a TODO */
  note?: string;
  /** True if this row documents a token that is NOT yet declared in CSS */
  pending?: boolean;
};

/**
 * Reads the token's live value off the document root. Re-resolves whenever
 * cssVar changes; a theme change remounts the whole story tree (see
 * .storybook/preview.tsx), which reruns this effect and picks up the new value.
 */
function useResolvedValue(cssVar: string, pending?: boolean) {
  const [value, setValue] = useState('');
  useEffect(() => {
    if (pending) return;
    const v = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    setValue(v);
  }, [cssVar, pending]);
  return value;
}

const cellStyle: CSSProperties = {
  padding: '8px 12px',
  borderBottom: '1px solid var(--border)',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 13,
  verticalAlign: 'middle',
};

function Row({ token }: { token: ColorToken }) {
  const resolved = useResolvedValue(token.cssVar, token.pending);
  return (
    <tr style={token.pending ? { opacity: 0.6 } : undefined}>
      <td style={cellStyle}>
        {token.pending ? (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: '1px dashed var(--border)',
            }}
            title="Not yet declared"
          />
        ) : (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: `var(${token.cssVar})`,
            }}
          />
        )}
      </td>
      <td style={cellStyle}>{token.name}</td>
      <td style={cellStyle}>{token.cssVar}</td>
      <td style={cellStyle}>{token.reference ?? '—'}</td>
      <td style={cellStyle}>{token.pending ? 'not declared' : resolved || '…'}</td>
      <td style={{ ...cellStyle, opacity: 0.75 }}>{token.note ?? ''}</td>
    </tr>
  );
}

export function ColorSwatchTable({
  tokens,
  referenceLabel = 'References',
}: {
  tokens: ColorToken[];
  referenceLabel?: string;
}) {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
      <thead>
        <tr>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Preview</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Token</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>CSS Variable</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>{referenceLabel}</th>
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

export function SectionHeading({ children }: { children: ReactNode }) {
  return <h3 style={{ fontFamily: 'ui-monospace, monospace', fontSize: 15, marginTop: 32 }}>{children}</h3>;
}

export function PendingNotice({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: '1px dashed var(--border)',
        borderRadius: 8,
        padding: 16,
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        fontSize: 14,
        lineHeight: 1.5,
        opacity: 0.85,
      }}
    >
      {children}
    </div>
  );
}
