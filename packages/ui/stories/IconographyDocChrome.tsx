import type { CSSProperties, ReactNode } from 'react';

/**
 * Shared documentation chrome for the Iconography foundation's Storybook
 * pages. Local to Iconography — mirrors EffectsDocChrome / TypographyDocChrome
 * — because documentation prose, table headers/cells, and section labels must
 * read in the design system's UI typeface (Gellix). Only genuine icon
 * specimens demonstrate the glyphs being documented.
 */

const uiFont: CSSProperties = {
  fontFamily: 'var(--font-family-sans)',
  fontWeight: 'var(--font-weight-sans-regular)',
};

export function IconographyPageTitle({ children }: { children: ReactNode }) {
  return <h2 style={{ ...uiFont, fontSize: 20, marginBottom: 16 }}>{children}</h2>;
}

export function IconographySectionHeading({ children }: { children: ReactNode }) {
  return <h3 style={{ ...uiFont, fontSize: 15, marginTop: 32 }}>{children}</h3>;
}

export function IconographySubHeading({ children }: { children: ReactNode }) {
  return <h4 style={{ ...uiFont, fontSize: 13, opacity: 0.75, marginTop: 4, marginBottom: 8 }}>{children}</h4>;
}

export function IconographyNotice({ children }: { children: ReactNode }) {
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
 * cells quoting literal CSS (variable names, resolved values, px metrics). */
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
