import type { CSSProperties, ReactNode } from 'react';

export type PrimitivePageProps = {
  title: string;
  description: ReactNode;
  playground: ReactNode;
  variants: ReactNode;
  usageGuidance: ReactNode;
  accessibility: ReactNode;
};

/**
 * Foundations Typography Style / Heading 2 — serif page title for Primitive
 * Overviews. Tokens only; no hardcoded size/weight/family.
 */
const storyTitleStyle: CSSProperties = {
  fontFamily: 'var(--text-heading-2-font-family)',
  fontWeight: 'var(--text-heading-2-font-weight)' as CSSProperties['fontWeight'],
  fontSize: 'var(--text-heading-2-font-size)',
  lineHeight: 'var(--text-heading-2-line-height)',
  letterSpacing: 'var(--text-heading-2-letter-spacing)',
};

/**
 * Foundations Typography Style / Paragraph Regular (Regular weight) —
 * one step up from the previous `text-sm` / Paragraph Small (14px) body.
 */
const storyDescriptionStyle: CSSProperties = {
  fontFamily: 'var(--text-paragraph-regular-regular-font-family)',
  fontWeight: 'var(--text-paragraph-regular-regular-font-weight)' as CSSProperties['fontWeight'],
  fontSize: 'var(--text-paragraph-regular-regular-font-size)',
  lineHeight: 'var(--text-paragraph-regular-regular-line-height)',
  letterSpacing: 'var(--text-paragraph-regular-regular-letter-spacing)',
};

/**
 * Foundations Typography Style / Heading 4 — section headings (Playground,
 * Variants, Usage guidance, Accessibility). Subordinate to the page title
 * (Heading 2 / 30px); stepped up from the previous `text-sm` (14px).
 */
const sectionHeadingStyle: CSSProperties = {
  fontFamily: 'var(--text-heading-4-font-family)',
  fontWeight: 'var(--text-heading-4-font-weight)' as CSSProperties['fontWeight'],
  fontSize: 'var(--text-heading-4-font-size)',
  lineHeight: 'var(--text-heading-4-line-height)',
  letterSpacing: 'var(--text-heading-4-letter-spacing)',
};

/**
 * Default playground control grid: 2 columns. Span `col-span-2` only for
 * long option sets or text inputs that need the full row.
 */
export const PRIMITIVE_PLAYGROUND_CONTROL_GRID =
  'grid w-full grid-cols-2 gap-4';

/**
 * Fixed Overview chrome for every Primitive story. Section order, page
 * inset, typography, and headings are owned here — call sites supply
 * content only and cannot reorder or omit sections. Incomplete sections
 * should pass placeholder copy, not be skipped.
 *
 * Page inset: `--spacing-6xl` (80px).
 * Title → description gap: `--spacing-xl` (24px).
 * Description: Paragraph Regular tokens; max 75% of page width.
 * Section headings: Heading 4 tokens (subordinate to Heading 2 title).
 * Variants (Figma vocabulary) + Playground: full page width.
 *
 * Pair Overview stories with `parameters: { layout: 'fullscreen' }` so this
 * inset is the page margin. All sections share the same left edge.
 *
 * Reference: Badge Overview (see docs/DESIGN.md "Component Story Structure").
 */
export function PrimitivePage({
  title,
  description,
  playground,
  variants,
  usageGuidance,
  accessibility,
}: PrimitivePageProps) {
  return (
    <div className="box-border w-full max-w-full font-sans p-[length:var(--spacing-6xl)]">
      <h1
        className="text-foreground mb-[length:var(--spacing-xl)]"
        style={storyTitleStyle}
      >
        {title}
      </h1>
      <p
        className="w-[75%] max-w-full text-muted-foreground"
        style={storyDescriptionStyle}
      >
        {description}
      </p>

      <Section title="Playground">{playground}</Section>
      <Section title="Variants">{variants}</Section>
      <Section title="Usage guidance">{usageGuidance}</Section>
      <Section title="Accessibility">{accessibility}</Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2
        className="text-foreground mb-[length:var(--spacing-md)]"
        style={sectionHeadingStyle}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Labeled tile used inside a PrimitivePage Variants gallery. */
export function PrimitiveGalleryItem({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-border p-6">
      {children}
      <span className="font-sans text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

/** Default copy for Overview sections not yet written. */
export const PRIMITIVE_PAGE_SECTION_PLACEHOLDER =
  'TODO: document this section.';
