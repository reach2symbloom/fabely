import type { CSSProperties, ReactNode } from 'react';

/**
 * Shared documentation chrome for the Typography foundation's own Storybook
 * pages. Local to Typography (not the shared SectionHeading/PendingNotice
 * used by other foundations) because the whole point here is that the
 * documentation itself must read in the design system's UI typeface
 * (Gellix), never the display typeface (Sharp Serif) it's describing — the
 * docs shouldn't look self-referentially styled with the tokens they
 * document. Sharp Serif only appears inside genuine specimen cells that
 * demonstrate what Sharp Serif (or a Heading style built on it) looks like.
 */

// Regular weight by default everywhere in this chrome — documentation should
// read as quiet and editorial, not typographically loud. Bold is reserved for
// genuine inline emphasis within prose (<strong> inside TypographyNotice),
// not applied structurally to headings/headers/labels just because they're
// headings/headers/labels.
const uiFont: CSSProperties = { fontFamily: 'var(--font-family-sans)', fontWeight: 'var(--font-weight-sans-regular)' };

/** Top-of-page title for a dedicated Typography Styles page (Headings,
 * Paragraph, Manuscript, Captions, Monospaced, All Styles) — each is now its
 * own Storybook story/page rather than a subsection of one combined page. */
export function TypographyPageTitle({ children }: { children: ReactNode }) {
  return <h2 style={{ ...uiFont, fontSize: 20, marginBottom: 16 }}>{children}</h2>;
}

/** Subsection label within a page, e.g. "Interactive Example", "Reference
 * Table", "Architecture Notes" — or a nested implementation label beneath a
 * subsection, e.g. "Sharp Serif" under Manuscript's reference table. */
export function TypographySectionHeading({ children }: { children: ReactNode }) {
  return <h3 style={{ ...uiFont, fontSize: 15, marginTop: 32 }}>{children}</h3>;
}

export function TypographySubHeading({ children }: { children: ReactNode }) {
  return <h4 style={{ ...uiFont, fontSize: 13, opacity: 0.75, marginTop: 4, marginBottom: 8 }}>{children}</h4>;
}

export function TypographyNotice({ children }: { children: ReactNode }) {
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
