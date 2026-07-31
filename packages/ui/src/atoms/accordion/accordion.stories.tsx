import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview is always the first page — description, a gallery composing the
 * canonical examples below (not duplicating them), usage guidance, a11y
 * notes, then an Args playground at the very bottom. Each example below
 * stays its own focused page. No Args playground is built for this atom
 * (per docs/DESIGN.md, it's only added once canonical examples are
 * complete, and this atom adds no Fabely-specific props/variants to
 * explore beyond the vendor primitive's own `type`/`collapsible`/`disabled`,
 * which the Basic/Multiple/Disabled example pages already demonstrate
 * directly).
 */

const meta = {
  title: 'Design System/Atoms/Accordion',
  component: Accordion,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  /* `type` has no default on the vendor primitive (a required prop on its
   * discriminated `type="single" | "multiple"` union) — every story below
   * fully replaces rendering via its own `render`, so this default only
   * exists to satisfy CSF3's generated Story type, which otherwise expects
   * every story to supply `args.type` itself. */
  args: { type: 'single' },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------- Shared content ----------
 * The same three FAQ items (shadcn's own canonical example copy) are
 * reused across every example below so each page demonstrates a
 * *behavioral* difference (single vs. multiple, disabled, bordered, RTL)
 * against identical content, rather than the content itself varying and
 * obscuring the comparison. */

const FAQ_ITEMS = [
  {
    value: 'item-1',
    question: 'Is it accessible?',
    answer: "Yes. It adheres to the WAI-ARIA design pattern.",
  },
  {
    value: 'item-2',
    question: 'Is it styled?',
    answer:
      "Yes. It comes with default styles that matches the other components' aesthetic.",
  },
  {
    value: 'item-3',
    question: 'Is it animated?',
    answer: "Yes. It's animated by default, but you can disable it if you prefer.",
  },
];

/* ---------- Canonical examples ----------
 * Each is a plain component so the Overview gallery and the individual
 * story page render the exact same implementation — composed, not
 * duplicated. */

/** shadcn docs' "Basic" example: `type="single"` with `collapsible`, one
 * item open at a time, the first item open by default via `defaultValue`.
 * This is the recommended default composition for most call sites. */
function BasicExample() {
  return (
    <Accordion type="single" collapsible defaultValue="item-1" className="w-96">
      {FAQ_ITEMS.map(({ value, question, answer }) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** shadcn docs' "Multiple" example: `type="multiple"` allows any number of
 * items open simultaneously — no `collapsible` prop here, it only applies
 * to `type="single"` (a single open item can always toggle back to none by
 * definition; `type="multiple"` has no equivalent "none allowed" concept to
 * gate). Two items start open via `defaultValue` (a string array for this
 * type, vs. a single string for `type="single"`). */
function MultipleExample() {
  return (
    <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-96">
      {FAQ_ITEMS.map(({ value, question, answer }) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** shadcn docs' "Disabled" example: the `disabled` prop on an individual
 * `AccordionItem` — that item's trigger is neither clickable nor
 * keyboard-focusable, but the rest of the accordion behaves normally. */
function DisabledExample() {
  return (
    <Accordion type="single" collapsible defaultValue="item-1" className="w-96">
      {FAQ_ITEMS.map(({ value, question, answer }, i) => (
        <AccordionItem key={value} value={value} disabled={i === 1}>
          <AccordionTrigger>
            {question}
            {i === 1 ? ' (disabled)' : ''}
          </AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** shadcn docs' "Borders" example, applied via `className` exactly per the
 * docs' own recipe — `border` on `Accordion`, `border-b last:border-b-0` on
 * each `AccordionItem` — rather than baked into the atom's own default
 * styling. `AccordionItem` already carries a bottom divider by default (see
 * accordion.tsx) — passing `border-b` again here is redundant with that
 * default and only additionally contributes the *side* borders' bottom
 * edge on the last item's own box, but is kept exactly as shadcn's docs
 * specify it (byte for byte) rather than simplified, since this page's
 * purpose is demonstrating that exact documented recipe, not an optimized
 * variant of it. Rounds the whole group with Foundations' `--radius`
 * (`foundations/radius.css`) — the standard "card-like container" radius
 * this project's other surfaces (e.g. `--card`) already imply — and colors
 * the border from `--border`, both applied via `className`, not new props
 * on the atom itself.
 *
 * Deliberately no horizontal padding on `Accordion` itself (an earlier
 * version added `px-[var(--spacing-md)]` here for visual breathing room,
 * which was a bug, not a stylistic choice): padding the shared container
 * narrows every item's own content box, including the width its `border-b`
 * is drawn against — the divider ends up shorter than, and inset from, the
 * outer `border`'s own left/right edges, instead of the edge-to-edge line
 * upstream's recipe produces. The same `px-[var(--spacing-md)]` breathing
 * room is applied one level down instead, directly on `AccordionItem`
 * (alongside its `border-b`): padding is inside an element's own border
 * (border-box sizing), so it insets `AccordionItem`'s *content*
 * (`AccordionTrigger`/`AccordionContent`, which fill the item's now-
 * narrower content box) without narrowing the item's own border-box — its
 * `border-b` still spans the item's full width, flush with the outer
 * `Accordion` border on both sides, exactly matching upstream. */
function BordersExample() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-1"
      className="w-96 rounded-[var(--radius)] border-[length:var(--stroke-thin)] border-[color:var(--border)]"
    >
      {FAQ_ITEMS.map(({ value, question, answer }) => (
        <AccordionItem
          key={value}
          value={value}
          className="border-b-[length:var(--stroke-thin)] border-[color:var(--border)] px-[var(--spacing-md)] last:border-b-0"
        >
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** A visually distinct callout for documenting deliberate scope limits —
 * so a limitation reads as "known and intentional" rather than looking
 * like an unfinished implementation to someone browsing Storybook. Reused
 * verbatim from avatar.stories.tsx's own `LimitationNotice`. */
function LimitationNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
      <span aria-hidden="true">⚠️</span>
      <span>{children}</span>
    </div>
  );
}

/** shadcn docs' "Card" example: "Wrap the Accordion in a Card component."
 * No `Card` atom/component exists yet anywhere in this package (checked:
 * `packages/ui/src/components/ui/` and `packages/ui/src/atoms/` — neither
 * has one) — per this task's own guidance to treat "no primitive exists
 * yet" as a minor judgment call rather than a blocking conflict, this uses
 * the simplest faithful equivalent instead: a plain `div` styled with this
 * project's own `--card`/`--border`/`--radius` Foundation tokens (the same
 * semantic tokens a real Card atom would eventually wrap), not a new
 * component. See README.md's Future Enhancements for the follow-up once a
 * real Card atom exists.
 *
 * Text color deliberately uses `--foreground`, not `--card-foreground`,
 * despite `--card-foreground` being the semantically-named pairing for
 * `--card` (and this project's existing convention elsewhere, e.g.
 * `--primary`/`--primary-foreground`, of always pairing a surface color
 * with its own dedicated foreground token — see avatar.tsx's use of
 * `--primary-foreground`). This is a deliberate, documented deviation, not
 * an oversight: `foundations/colors.css`'s own `--card-foreground` is
 * itself miswired for Dark mode (a pre-existing Foundations bug, not
 * something introduced by this atom or story) — in Dark it resolves to
 * `--theme-alpha-white-switch-100`, a token whose entire purpose is to
 * *flip* its base color between White (Light mode) and Black (Dark mode),
 * so in Dark mode `--card-foreground` ends up 100% opaque black, rendered
 * against `--card`'s own Dark value (`--theme-neutrals-900`, a dark
 * charcoal) — black-on-charcoal, unreadable. `--card`'s own Dark value has
 * no equivalent problem. This is the same category of bug this file's own
 * header comment already flags for `--sidebar-primary-foreground` (a
 * broken Figma alias), just not yet caught or documented for
 * `--card-foreground` specifically — nothing in this package consumed
 * `--card`/`--card-foreground` before this story. Fixing `colors.css`
 * itself is out of scope here (it's a shared Foundations token consumed
 * far beyond this one atom, and the task deliberately draws the line at
 * "reuse an existing correct token, don't invent or silently patch a
 * broken one here") — `--foreground` is reused instead: it's already the
 * token this project's own `body { @apply text-foreground }` rule
 * (globals.css) relies on globally, and it resolves correctly in *both*
 * themes (Light: black on `--card`'s white; Dark: white on `--card`'s dark
 * charcoal). See README.md's "Known issues" for the follow-up recommendation. */
function CardExample() {
  return (
    <div>
      <LimitationNotice>
        No Card atom exists in this package yet — this uses a plain div styled
        from the same Foundation tokens (--card, --border, --radius) a future
        Card atom would wrap, not a new component. Text color intentionally uses
        --foreground rather than --card-foreground — see accordion.stories.tsx's
        CardExample comment: --card-foreground itself resolves to black-on-dark-
        charcoal in Dark mode, a pre-existing Foundations bug, not something
        introduced here.
      </LimitationNotice>
      <div className="mt-4 w-96 rounded-[var(--radius)] border-[length:var(--stroke-thin)] border-[color:var(--border)] bg-[var(--card)] px-[var(--spacing-lg)] text-[color:var(--foreground)]">
        <Accordion type="single" collapsible defaultValue="item-1">
          {FAQ_ITEMS.map(({ value, question, answer }) => (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

/** shadcn docs' "RTL" example: the `dir="rtl"` prop, forwarded straight
 * through to the underlying Radix root (affects keyboard navigation
 * semantics — Arrow key direction — and the flex row's visual order, both
 * of which mirror correctly with no extra work). Documents one known,
 * unfixed limitation rather than silently working around it: the vendor
 * Trigger hardcodes `text-left` (a *physical* Tailwind utility) rather
 * than the *logical* `text-start`, so the question text itself stays
 * left-aligned even though the row's flex layout (and its chevron) has
 * correctly mirrored to the right — changing that is a vendor-file
 * behavior change, not a Foundations-token restyle, so it's out of this
 * milestone's explicit "no new props/variants, thin restyle only" scope. */
function RtlExample() {
  return (
    <div dir="rtl" className="flex flex-col gap-4">
      <LimitationNotice>
        Known limitation: the vendor Trigger uses a physical `text-left`, not a
        logical `text-start`, so question text stays left-aligned even though
        the row and chevron correctly mirror under `dir=&quot;rtl&quot;`. Not
        fixed here — doing so would change vendor-derived behavior beyond this
        milestone&apos;s restyle-only scope.
      </LimitationNotice>
      <Accordion type="single" collapsible defaultValue="item-1" dir="rtl" className="w-96">
        {FAQ_ITEMS.map(({ value, question, answer }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

/* ---------- Overview page chrome ----------
 * Reused verbatim from avatar.stories.tsx's own Section/GalleryItem. */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h3 className="font-sans text-sm font-medium text-foreground mb-3">{title}</h3>
      {children}
    </section>
  );
}

function GalleryItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-border p-6">
      {children}
      <span className="font-sans text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

/* ---------- Overview ---------- */

export const Overview: Story = {
  render: () => {
    return (
      <div className="w-[640px] max-w-full font-sans">
        <h2 className="text-lg font-semibold text-foreground mb-2">Accordion</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A vertically stacked set of interactive headings that each reveal a section of
          content. This atom wraps the upstream shadcn/Radix Accordion primitive with
          Fabely&apos;s Foundations-sourced spacing, radius, typography, color, and focus-ring
          styling — no Fabely-specific props or variants are added on top; see the atom&apos;s{' '}
          <code>README.md</code> for why (no Figma source exists yet for this component) and
          for the exact token substitutions made.
        </p>

        <Section title="Examples">
          <div className="flex flex-wrap gap-4">
            <GalleryItem label="Basic">
              <BasicExample />
            </GalleryItem>
            <GalleryItem label="Multiple">
              <MultipleExample />
            </GalleryItem>
            <GalleryItem label="Disabled">
              <DisabledExample />
            </GalleryItem>
            <GalleryItem label="Borders">
              <BordersExample />
            </GalleryItem>
            <GalleryItem label="Card">
              <CardExample />
            </GalleryItem>
            <GalleryItem label="RTL">
              <RtlExample />
            </GalleryItem>
          </div>
        </Section>

        <Section title="Usage guidance">
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
            <li>
              Use <code>type=&quot;single&quot;</code> (with <code>collapsible</code>) for the
              common "one section open at a time" case, and{' '}
              <code>type=&quot;multiple&quot;</code> when several sections may reasonably stay
              open together — the two are mutually exclusive per the vendor primitive, matching
              Radix&apos;s own API exactly (see README.md).
            </li>
            <li>
              Every <code>AccordionItem</code> needs a unique <code>value</code> within its
              parent <code>Accordion</code>.
            </li>
            <li>
              Use <code>disabled</code> on an individual <code>AccordionItem</code> to remove it
              from keyboard/pointer interaction without removing it from the list.
            </li>
            <li>
              This atom adds no new className hooks beyond what the vendor primitive already
              forwards — compose additional layout (borders, radius, background) via{' '}
              <code>className</code> at the call site, per the Borders/Card examples above,
              rather than proposing new variant props for a one-off need.
            </li>
          </ul>
        </Section>

        <Section title="Accessibility">
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
            <li>
              Follows the WAI-ARIA Accordion pattern via Radix: each trigger is a real{' '}
              <code>button</code> with <code>aria-expanded</code> and{' '}
              <code>aria-controls</code> wired up automatically, and each panel carries a
              matching <code>role=&quot;region&quot;</code>/<code>aria-labelledby</code> — no
              manual ARIA wiring is needed at the call site.
            </li>
            <li>
              Fully keyboard operable out of the box: Tab moves between triggers, Enter/Space
              toggles the focused item, and Arrow Up/Down (Home/End) move focus between triggers
              without changing which items are expanded.
            </li>
            <li>
              The focus-visible ring (<code>--effect-focus-ring-secondary</code>) is always
              present on keyboard focus — see accordion.tsx&apos;s <code>AccordionTrigger</code>{' '}
              comment for why Secondary, not Primary, is the correct token here.
            </li>
            <li>
              A <code>disabled</code> <code>AccordionItem</code>&apos;s trigger is excluded from
              the Tab order entirely (matching native <code>&lt;button disabled&gt;</code>{' '}
              behavior) — its state isn&apos;t conveyed by color alone.
            </li>
          </ul>
        </Section>
      </div>
    );
  },
};

/* ---------- Individual example pages ---------- */

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const Multiple: Story = {
  render: () => <MultipleExample />,
};

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

export const Borders: Story = {
  render: () => <BordersExample />,
};

export const Card: Story = {
  render: () => <CardExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
