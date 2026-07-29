import type { CSSProperties, ReactNode } from 'react';

/**
 * Shared documentation chrome for the Effects foundation's own Storybook
 * pages (Glows, Focus Rings). Local to Effects — mirrors TypographyDocChrome
 * — because documentation prose, table headers/cells, and section labels
 * must read in the design system's UI typeface (Gellix), never any display
 * typeface. Only genuine specimen elements (the glow/ring preview itself)
 * demonstrate the effect being documented.
 */

const uiFont: CSSProperties = { fontFamily: 'var(--font-family-sans)', fontWeight: 'var(--font-weight-sans-regular)' };

export function EffectsSectionHeading({ children }: { children: ReactNode }) {
  return <h3 style={{ ...uiFont, fontSize: 15, marginTop: 32 }}>{children}</h3>;
}

export function EffectsNotice({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        ...uiFont,
        border: '1px dashed var(--border)',
        borderRadius: 8,
        padding: 16,
        fontSize: 14,
        lineHeight: 1.5,
        opacity: 0.85,
      }}
    >
      {children}
    </div>
  );
}

/** Table chrome (headers, labels, notes) — Gellix. Reserve monospace only for
 * cells quoting literal CSS (variable names, resolved values). */
export const uiCellStyle: CSSProperties = {
  ...uiFont,
  padding: '10px 12px',
  borderBottom: '1px solid var(--border)',
  verticalAlign: 'middle',
};

export const codeCellStyle: CSSProperties = {
  ...uiCellStyle,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 12,
};
