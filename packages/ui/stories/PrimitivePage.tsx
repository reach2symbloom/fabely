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
 * Fixed Overview chrome for every Primitive story. Section order, page
 * inset, playground max-width, and headings are owned here — call sites
 * supply content only and cannot reorder or omit sections. Incomplete
 * sections should pass placeholder copy, not be skipped.
 *
 * Page inset: `--tw-raw-spacing-14` (56px). Exact Foundations raw match;
 * the published semantic scale has no 56px step (`--spacing-4xl` = 48px,
 * `--spacing-5xl` = 64px).
 *
 * Playground max-width: 640px — single shared layout width (not a spacing
 * token). Do not set width wrappers in individual Primitive stories.
 *
 * Pair Overview stories with `parameters: { layout: 'fullscreen' }` so this
 * inset is the page margin (not stacked on Storybook's centered/padded
 * chrome). All sections share the same left edge.
 *
 * Reference: Badge Overview (see docs/DESIGN.md "Component Story Structure").
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
    <div className="box-border w-full max-w-full font-sans p-[length:var(--tw-raw-spacing-14)]">
      <h2 className="text-lg font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>

      <Section title="Playground">
        <div className="w-full max-w-[640px]">{playground}</div>
      </Section>
      <Section title="Examples">{examples}</Section>
      <Section title="Usage guidance">{usageGuidance}</Section>
      <Section title="Accessibility">{accessibility}</Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
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
