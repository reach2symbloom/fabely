import type { ReactNode } from 'react';

export type PrimitivePageProps = {
  title: string;
  description: ReactNode;
  playground: ReactNode;
  examples: ReactNode;
  usageGuidance: ReactNode;
  accessibility: ReactNode;
};

/**
 * Fixed Overview chrome for every Primitive story. Section order and
 * headings are owned here — call sites supply content only and cannot
 * reorder or omit Playground / Examples / Usage guidance / Accessibility.
 * Incomplete sections should pass placeholder copy, not be skipped.
 *
 * Reference layout: Badge Overview (see docs/DESIGN.md "Component Story
 * Structure").
 */
export function PrimitivePage({
  title,
  description,
  playground,
  examples,
  usageGuidance,
  accessibility,
}: PrimitivePageProps) {
  return (
    <div className="w-[640px] max-w-full font-sans">
      <h2 className="text-lg font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>

      <Section title="Playground">{playground}</Section>
      <Section title="Examples">{examples}</Section>
      <Section title="Usage guidance">{usageGuidance}</Section>
      <Section title="Accessibility">{accessibility}</Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h3 className="font-sans text-sm font-medium text-foreground mb-3">{title}</h3>
      {children}
    </section>
  );
}

/** Labeled tile used inside a PrimitivePage Examples gallery. */
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
