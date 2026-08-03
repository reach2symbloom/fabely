import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { BadgeCheckIcon, Loader2Icon } from 'lucide-react';
import { Badge } from './badge';
import type { BadgeRoundness, BadgeSize, BadgeVariant } from './badge';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import { PrimitiveGalleryItem, PrimitivePage } from '../../../stories/PrimitivePage';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview is always the first page — description, interactive Playground
 * at the top (same order as Avatar / Alert), then a gallery composing the
 * canonical examples below (not duplicating them), usage guidance, and a11y
 * notes. Each example below stays its own focused page.
 */

const meta = {
  title: 'Design System/Primitives/Badge',
  component: Badge,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const FIGMA_VARIANTS: { variant: BadgeVariant; label: string }[] = [
  { variant: 'default', label: 'Default (Primary)' },
  { variant: 'secondary', label: 'Secondary' },
  { variant: 'outline', label: 'Outline' },
  { variant: 'ghost', label: 'Ghost (Tertiary)' },
  { variant: 'destructive', label: 'Destructive' },
  { variant: 'success', label: 'Success' },
  { variant: 'alert', label: 'Alert' },
];

const ALL_VARIANTS: { variant: BadgeVariant; label: string }[] = [
  ...FIGMA_VARIANTS,
  { variant: 'link', label: 'Link' },
];

const SIZES: { size: BadgeSize; label: string }[] = [
  { size: 'default', label: 'Default' },
  { size: 'large', label: 'Large' },
];

const ROUNDNESSES: { roundness: BadgeRoundness; label: string }[] = [
  { roundness: 'default', label: 'Default' },
  { roundness: 'round', label: 'Round' },
];

/* ---------- Canonical examples ---------- */

/** Recommended default composition — Figma Primary / size Default /
 * roundness Default, label only. */
function DefaultExample() {
  return <Badge>Badge</Badge>;
}

/** Every Figma color variant plus the vendor/docs-only `link` variant. */
function VariantsExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {ALL_VARIANTS.map(({ variant, label }) => (
        <Badge key={variant} variant={variant}>
          {label}
        </Badge>
      ))}
    </div>
  );
}

/** Figma Size axis — Default (Paragraph Mini Medium) vs Large (Paragraph
 * Small Medium), shown for both roundness values. */
function SizesExample() {
  return (
    <div className="flex flex-col gap-6">
      {ROUNDNESSES.map(({ roundness, label: roundLabel }) => (
        <div key={roundness}>
          <p className="mb-3 font-sans text-xs text-muted-foreground">Roundness: {roundLabel}</p>
          <div className="flex flex-wrap items-end gap-4">
            {SIZES.map(({ size, label }) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Badge size={size} roundness={roundness}>
                  Label
                </Badge>
                <span className="font-sans text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Figma Roundness axis — Default (--rounded-sm) vs Round (--rounded-full). */
function RoundnessExample() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {ROUNDNESSES.map(({ roundness, label }) => (
        <div key={roundness} className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Badge roundness={roundness}>Label</Badge>
            <Badge roundness={roundness} variant="secondary">
              Label
            </Badge>
            <Badge roundness={roundness} variant="destructive">
              Label
            </Badge>
          </div>
          <span className="font-sans text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

/** shadcn docs' "With Icon" — Lucide icon as a child. `data-icon` selects
 * inline-start vs inline-end layout without a dedicated prop. */
function WithIconExample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary" data-icon="inline-start">
          <BadgeCheckIcon aria-hidden="true" />
          Verified
        </Badge>
        <Badge variant="destructive" data-icon="inline-start">
          <BadgeCheckIcon aria-hidden="true" />
          Failed
        </Badge>
        <Badge variant="outline" data-icon="inline-end">
          Next
          <BadgeCheckIcon aria-hidden="true" />
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {SIZES.map(({ size, label }) => (
          <Badge key={size} size={size} variant="secondary" data-icon="inline-start">
            <BadgeCheckIcon aria-hidden="true" />
            {label}
          </Badge>
        ))}
      </div>
    </div>
  );
}

/** shadcn docs' "With Spinner" — no Spinner primitive exists in this package yet,
 * so this uses Lucide's Loader2 with animate-spin (the same glyph family
 * Avatar's icon examples already rely on), not a new component. */
function WithSpinnerExample() {
  return (
    <div>
      <LimitationNotice>
        No Spinner primitive exists in this package yet — this uses Lucide{' '}
        <code>Loader2Icon</code> with <code>animate-spin</code>, matching the
        shadcn docs&apos; spinner composition without inventing a Spinner
        primitive here.
      </LimitationNotice>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Badge variant="secondary" data-icon="inline-start">
          <Loader2Icon aria-hidden="true" className="animate-spin" />
          Syncing
        </Badge>
        <Badge variant="outline" data-icon="inline-start">
          <Loader2Icon aria-hidden="true" className="animate-spin" />
          Loading
        </Badge>
      </div>
    </div>
  );
}

/** shadcn docs' "Link" — Base UI `render` + native `<a>`. */
function LinkExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="link" render={<a href="https://fabely.app" />}>
        Fabely
      </Badge>
      <Badge variant="secondary" render={<a href="https://fabely.app" />}>
        Secondary link
      </Badge>
      <Badge variant="outline" render={<a href="https://fabely.app" />}>
        Outline link
      </Badge>
    </div>
  );
}

/** shadcn docs' "Custom Colors" — override via className rather than a new
 * variant prop, using Foundation tokens that aren't already a Badge
 * variant (Pantone blush). */
function CustomColorsExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge className="bg-[var(--tw-raw-pantones-blush)] text-[color:var(--primary-foreground)] border-transparent">
        Blush
      </Badge>
      <Badge
        variant="outline"
        className="border-[color:var(--tw-raw-pantones-lavendar)] text-[color:var(--tw-raw-pantones-lavendar)]"
      >
        Lavender outline
      </Badge>
    </div>
  );
}

/** shadcn docs' "RTL" — wrap in `dir="rtl"`; `data-icon` flex-row-reverse
 * and gap still compose correctly under RTL. */
function RtlExample() {
  return (
    <div dir="rtl" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary" data-icon="inline-start">
          <BadgeCheckIcon aria-hidden="true" />
          تم التحقق
        </Badge>
        <Badge variant="outline">شارة</Badge>
        <Badge variant="destructive">خطأ</Badge>
      </div>
    </div>
  );
}

/** Full Figma color × size matrix at Default roundness — the gallery
 * overview of the authored design surface. */
function FigmaMatrixExample() {
  return (
    <div className="flex flex-col gap-6">
      {SIZES.map(({ size, label }) => (
        <div key={size}>
          <p className="mb-3 font-sans text-xs text-muted-foreground">Size: {label}</p>
          <div className="flex flex-wrap items-center gap-3">
            {FIGMA_VARIANTS.map(({ variant, label: vLabel }) => (
              <Badge key={variant} variant={variant} size={size}>
                {vLabel}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LimitationNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
      <span aria-hidden="true">⚠️</span>
      <span>{children}</span>
    </div>
  );
}

/* ---------- Playground (Overview top) ----------
 * Rendered inline at the top of the Overview page (same order as Avatar /
 * Alert) so visitors can experiment with the full option set directly
 * alongside the live examples. State is plain component-local `useState`,
 * not Storybook args. Binary / few-option controls (Size, Roundness, Icon,
 * Link) use the shared InlineSegmentedControl story helper; unordered sets
 * (Variant) stay as selects. */

const playgroundLabelClass = 'font-sans text-xs text-muted-foreground';
const playgroundControlClass =
  'mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm';

function PlaygroundField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={playgroundLabelClass}>{label}</span>
      {children}
    </label>
  );
}

const ICON_OPTIONS: { value: 'none' | 'start' | 'end' | 'spinner'; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'start', label: 'Start' },
  { value: 'end', label: 'End' },
  { value: 'spinner', label: 'Spinner' },
];

function BadgePlayground() {
  const [variant, setVariant] = useState<BadgeVariant>('default');
  const [size, setSize] = useState<BadgeSize>('default');
  const [roundness, setRoundness] = useState<BadgeRoundness>('default');
  const [icon, setIcon] = useState<'none' | 'start' | 'end' | 'spinner'>('none');
  const [asLink, setAsLink] = useState(false);

  const content = (
    <>
      {icon === 'start' || icon === 'spinner' ? (
        icon === 'spinner' ? (
          <Loader2Icon aria-hidden="true" className="animate-spin" />
        ) : (
          <BadgeCheckIcon aria-hidden="true" />
        )
      ) : null}
      Label
      {icon === 'end' ? <BadgeCheckIcon aria-hidden="true" /> : null}
    </>
  );

  const dataIcon =
    icon === 'end' ? 'inline-end' : icon === 'none' ? undefined : 'inline-start';

  return (
    <PlaygroundPanel
      preview={
        asLink ? (
          <Badge
            render={<a href="#" />}
            variant={variant}
            size={size}
            roundness={roundness}
            data-icon={dataIcon}
          >
            {content}
          </Badge>
        ) : (
          <Badge variant={variant} size={size} roundness={roundness} data-icon={dataIcon}>
            {content}
          </Badge>
        )
      }
      controls={
        <div className="grid w-full max-w-sm grid-cols-2 gap-4">
          <div className="col-span-2">
            <PlaygroundField label="Variant">
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as BadgeVariant)}
                className={playgroundControlClass}
              >
                {ALL_VARIANTS.map(({ variant: v, label }) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
            </PlaygroundField>
          </div>

          <InlineSegmentedControl
            label="Size"
            value={size}
            options={SIZES.map(({ size: s, label }) => ({ value: s, label }))}
            onChange={setSize}
            fullWidth
          />

          <InlineSegmentedControl
            label="Roundness"
            value={roundness}
            options={ROUNDNESSES.map(({ roundness: r, label }) => ({ value: r, label }))}
            onChange={setRoundness}
            fullWidth
          />

          <div className="col-span-2">
            <InlineSegmentedControl
              label="Icon"
              value={icon}
              options={ICON_OPTIONS}
              onChange={setIcon}
              fullWidth
            />
          </div>

          <div className="col-span-2">
            <InlineSegmentedControl
              label="Link"
              value={asLink ? 'on' : 'off'}
              options={[
                { value: 'off', label: 'Off' },
                { value: 'on', label: 'On' },
              ]}
              onChange={(v) => setAsLink(v === 'on')}
              fullWidth
            />
          </div>
        </div>
      }
    />
  );
}

/* ---------- Overview ---------- */

export const Overview: Story = {
  render: () => (
    <PrimitivePage
      title="Badge"
      description={
        <>
          A small label for status, category, or metadata. This primitive wraps the upstream
          shadcn Badge primitive with Fabely&apos;s Figma-authored size, roundness, and color
          variants (soft tinted fills — not the vendor&apos;s solid primary chip), sourced from
          Foundations. Polymorphism uses Base UI <code>render</code>, matching the vendored file
          — see the primitive&apos;s <code>README.md</code> for the Figma → API mapping and
          what&apos;s deliberately deferred.
        </>
      }
      playground={<BadgePlayground />}
      examples={
        <div className="flex flex-wrap gap-4">
          <PrimitiveGalleryItem label="Default">
            <DefaultExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Variants">
            <VariantsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Sizes">
            <SizesExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Roundness">
            <RoundnessExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Figma Matrix">
            <FigmaMatrixExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="With Icon">
            <WithIconExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="With Spinner">
            <WithSpinnerExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Link">
            <LinkExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Custom Colors">
            <CustomColorsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
          <li>
            Prefer the <code>variant</code>, <code>size</code>, and <code>roundness</code> props
            over overriding fill/radius/type via <code>className</code> — all three are sourced
            from the Figma Badge set and Foundations tokens.
          </li>
          <li>
            <code>default</code> is Figma&apos;s Primary (soft muted), not a solid primary fill.
            Use <code>secondary</code> for the lavender accent chip.
          </li>
          <li>
            <code>ghost</code> maps to Figma Tertiary. <code>success</code> / <code>alert</code>{' '}
            are Figma-only extensions (no vendor equivalent). <code>link</code> is kept for the
            shadcn Link composition and is not in Figma.
          </li>
          <li>
            For icons, pass a Lucide (or other) SVG as a child and set{' '}
            <code>data-icon=&quot;inline-start&quot;</code> or <code>&quot;inline-end&quot;</code>{' '}
            — no dedicated icon prop.
          </li>
          <li>
            Use the <code>render</code> prop (e.g. <code>{"render={<a href=... />}"}</code>) to
            render the badge as a link or other interactive element (Base UI{' '}
            <code>useRender</code> — not Radix <code>asChild</code>).
          </li>
          <li>
            One-off colors that aren&apos;t a variant belong in <code>className</code> (see Custom
            Colors), not new variant names proposed at the call site.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1.5">
          <li>
            Badge is presentational by default (<code>span</code>). When used as a control via{' '}
            <code>render</code>, the rendered element carries the accessible name and role —
            ensure links/buttons have meaningful text (not icon-only without{' '}
            <code>aria-label</code>).
          </li>
          <li>
            Decorative icons should set <code>aria-hidden=&quot;true&quot;</code>; the label text
            is what screen readers announce.
          </li>
          <li>
            Focus-visible rings are variant-specific Foundation effect tokens (primary / secondary
            / error / success / alert) so keyboard focus is never color-alone.
          </li>
          <li>
            Don&apos;t rely on badge color alone to convey state — pair with text (and an icon when
            helpful).
          </li>
        </ul>
      }
    />
  ),
};

/* ---------- Individual example pages ---------- */

export const Default: Story = {
  render: () => <DefaultExample />,
};

export const Variants: Story = {
  render: () => <VariantsExample />,
};

export const Sizes: Story = {
  render: () => <SizesExample />,
};

export const Roundness: Story = {
  render: () => <RoundnessExample />,
};

export const FigmaMatrix: Story = {
  render: () => <FigmaMatrixExample />,
};

export const WithIcon: Story = {
  render: () => <WithIconExample />,
};

export const WithSpinner: Story = {
  render: () => <WithSpinnerExample />,
};

export const Link: Story = {
  render: () => <LinkExample />,
};

export const CustomColors: Story = {
  render: () => <CustomColorsExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
