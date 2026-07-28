import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';

export type ColorToken = {
  /** Display name as it appears in Figma (e.g. "600 (main)") */
  name: string;
  /** CSS custom property that holds this token, without var(), e.g. "--tw-raw-neutral-600" */
  cssVar: string;
  /** For aliased tokens: the CSS custom property this one references */
  reference?: string;
  /** Free-form note, e.g. "12% opacity per Figma" or a TODO */
  note?: string;
  /** True if this row documents a token that is NOT yet declared in CSS */
  pending?: boolean;
};

function useResolvedValue(cssVar: string, scopeRef: RefObject<HTMLElement | null> | undefined, pending?: boolean) {
  const [value, setValue] = useState('');
  useEffect(() => {
    if (pending) return;
    const scopeEl = scopeRef?.current ?? document.documentElement;
    const v = getComputedStyle(scopeEl).getPropertyValue(cssVar).trim();
    setValue(v);
  }, [cssVar, pending, scopeRef]);
  return value;
}

const cellStyle: CSSProperties = {
  padding: '8px 12px',
  borderBottom: '1px solid #33333333',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 13,
  verticalAlign: 'middle',
};

function Row({ token, scopeRef }: { token: ColorToken; scopeRef?: RefObject<HTMLElement | null> }) {
  const resolved = useResolvedValue(token.cssVar, scopeRef, token.pending);
  return (
    <tr style={token.pending ? { opacity: 0.6 } : undefined}>
      <td style={cellStyle}>
        {token.pending ? (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: '1px dashed #888',
            }}
            title="Not yet declared"
          />
        ) : (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: '1px solid #00000022',
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
  dark = false,
}: {
  tokens: ColorToken[];
  referenceLabel?: string;
  /** Render inside a scoped `.dark` wrapper so tokens resolve their dark-mode value. */
  dark?: boolean;
}) {
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const table = (
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
          <Row key={t.cssVar} token={t} scopeRef={dark ? scopeRef : undefined} />
        ))}
      </tbody>
    </table>
  );

  if (!dark) return table;

  return (
    <div ref={scopeRef} className="dark" style={{ padding: 16, borderRadius: 8, background: 'var(--tw-raw-black)' }}>
      {table}
    </div>
  );
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return <h3 style={{ fontFamily: 'ui-monospace, monospace', fontSize: 15, marginTop: 32 }}>{children}</h3>;
}

export function PendingNotice({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: '1px dashed #888',
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
