import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AlignLeftIcon,
  SparklesIcon,
  ThumbsUpIcon,
  type LucideIcon,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '../field';

import { RadioGroup, RadioGroupItem } from './radio-group';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — then shadcn Radio Group docs + Figma Rich Radio Container
 * (Card / Icon SM / Icon LG / Block).
 */

const meta = {
  title: 'Design System/Primitives/Radio Group',
  component: RadioGroup,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const FRAME = 'w-full max-w-sm';

/**
 * Icon / Block hide the control; `sr-only` alone loses to RadioGroupItem’s
 * `relative` / `size-*`, so the radio still eats flex space (left gap / top gap).
 * Pin it out of flow; label `htmlFor` keeps the hit target.
 */
const RICH_RADIO_CONTROL_HIDDEN = [
  'pointer-events-none !absolute top-0 left-0',
  '!size-px overflow-hidden !border-0 p-0 opacity-0 !shadow-none',
  'after:hidden',
].join(' ');

type PlaygroundLayout = 'default' | 'rich';
/** Figma Rich Radio Chip Size × Icon × Orientation. */
type RichStyle = 'card' | 'icon-sm' | 'icon-lg' | 'block';

const RICH_OPTIONS = [
  {
    value: 'plus',
    title: 'Plus',
    description: 'For individuals and small teams.',
  },
  {
    value: 'pro',
    title: 'Pro',
    description: 'For growing businesses.',
  },
  {
    value: 'enterprise',
    title: 'Enterprise',
    description: 'For large teams and enterprises.',
  },
] as const;

const ICON_CHIP_OPTIONS: {
  value: string;
  title: string;
  icon: LucideIcon;
}[] = [
  { value: 'like', title: 'Line 1', icon: ThumbsUpIcon },
  { value: 'align', title: 'Line 1', icon: AlignLeftIcon },
];

const BLOCK_OPTIONS = [
  { value: 'alpha', title: 'Line 1' },
  { value: 'beta', title: 'Line 1' },
] as const;

/**
 * Figma Rich Radio Chip Line 1 — Paragraph Small Regular + `--text`;
 * checked → `--foreground` via FieldLabel `group/field-label`.
 */
function RichRadioTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <FieldTitle
      className={[
        'font-[family-name:var(--text-paragraph-small-regular-font-family)]',
        '[font-weight:var(--text-paragraph-small-regular-font-weight)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        'text-[color:var(--text)]',
        'group-has-data-checked/field-label:text-[color:var(--foreground)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </FieldTitle>
  );
}

/** Figma Rich Radio Chip Line 2 — Paragraph Mini Regular (not Field info message). */
function RichRadioDescription({ children }: { children: ReactNode }) {
  return (
    <p
      className={[
        'w-full text-pretty',
        'font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
        '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
        'text-[length:var(--text-paragraph-mini-regular-font-size)]',
        'leading-[var(--text-paragraph-mini-regular-line-height)]',
        'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
        'text-[color:var(--muted-foreground)]',
      ].join(' ')}
    >
      {children}
    </p>
  );
}

function DemoExample({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  return (
    <RadioGroup
      defaultValue="comfortable"
      disabled={disabled}
      className={FRAME}
    >
      <Field orientation="horizontal">
        <RadioGroupItem value="default" id="rg-demo-default" />
        <FieldLabel htmlFor="rg-demo-default">Default</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="comfortable" id="rg-demo-comfortable" />
        <FieldLabel htmlFor="rg-demo-comfortable">Comfortable</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="compact" id="rg-demo-compact" />
        <FieldLabel htmlFor="rg-demo-compact">Compact</FieldLabel>
      </Field>
    </RadioGroup>
  );
}

/** Figma Size=Card — radio + Line 1 / Line 2 (optional Flipped). */
function RichRadioCardExample({
  disabled = false,
  flipped = false,
  showDescription = true,
}: {
  disabled?: boolean;
  flipped?: boolean;
  showDescription?: boolean;
}) {
  return (
    <RadioGroup
      key={`card-${flipped}-${showDescription}-${disabled}`}
      defaultValue="pro"
      disabled={disabled}
      className={FRAME}
    >
      {RICH_OPTIONS.map((option) => (
        <FieldLabel
          key={option.value}
          choice="card"
          htmlFor={`rg-card-${option.value}`}
        >
          <Field
            orientation="horizontal"
            className={[
              '!items-start',
              'gap-[var(--spacing-sm)]',
              flipped ? 'flex-row-reverse' : null,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <RadioGroupItem
              value={option.value}
              id={`rg-card-${option.value}`}
            />
            <FieldContent className="gap-[var(--spacing-1-5)]">
              <RichRadioTitle>{option.title}</RichRadioTitle>
              {showDescription ? (
                <RichRadioDescription>{option.description}</RichRadioDescription>
              ) : null}
            </FieldContent>
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
}

/** Figma Icon=True, Size=SM|LG, Orientation=Horizontal — icon chip, radio visually hidden. */
function RichRadioIconChipExample({
  size = 'sm',
  disabled = false,
}: {
  size?: 'sm' | 'lg';
  disabled?: boolean;
}) {
  const iconClass =
    size === 'lg'
      ? 'size-[length:var(--icon-md)]'
      : 'size-[length:var(--icon-sm)]';

  return (
    <RadioGroup
      key={`icon-${size}-${disabled}`}
      defaultValue="like"
      disabled={disabled}
      className="flex w-fit flex-row flex-wrap gap-[var(--spacing-sm)]"
    >
      {ICON_CHIP_OPTIONS.map(({ value, title, icon: Icon }) => (
        <FieldLabel
          key={value}
          choice="icon"
          htmlFor={`rg-icon-${size}-${value}`}
        >
          {/* Sibling of Field so it cannot steal flex gap inside the chip. */}
          <RadioGroupItem
            value={value}
            id={`rg-icon-${size}-${value}`}
            className={RICH_RADIO_CONTROL_HIDDEN}
          />
          {/*
            Do not use orientation="horizontal" — that forces FieldTitle
            (data-slot=field-label) to 120px when no radio is inside Field.
          */}
          <Field
            className={[
              '!flex !h-full !w-fit !flex-row !items-center',
              '[&>*]:!w-auto !gap-[var(--spacing-xs)]',
            ].join(' ')}
          >
            <Icon
              aria-hidden="true"
              className={`${iconClass} shrink-0 text-[color:var(--foreground)]`}
            />
            <RichRadioTitle className="!w-fit whitespace-nowrap">
              {title}
            </RichRadioTitle>
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
}

/** Figma Icon=True, Size=LG, Orientation=Vertical — block tile. */
function RichRadioBlockExample({ disabled = false }: { disabled?: boolean }) {
  return (
    <RadioGroup
      key={`block-${disabled}`}
      defaultValue="alpha"
      disabled={disabled}
      className="flex w-fit flex-row flex-wrap gap-[var(--spacing-sm)]"
    >
      {BLOCK_OPTIONS.map((option) => (
        <FieldLabel
          key={option.value}
          choice="block"
          htmlFor={`rg-block-${option.value}`}
        >
          <RadioGroupItem
            value={option.value}
            id={`rg-block-${option.value}`}
            className={RICH_RADIO_CONTROL_HIDDEN}
          />
          <Field className="w-full flex-col items-center justify-center !gap-[var(--spacing-1-5)]">
            {/* Figma Brand logos slot (Claude) — 40px frame, 8px pad; coral mark. */}
            <span
              aria-hidden="true"
              className="flex size-[length:var(--icon-2xl)] shrink-0 items-center justify-center p-[var(--spacing-xs)]"
            >
              <SparklesIcon className="size-full text-[color:var(--tw-raw-pantones-salmon)]" />
            </span>
            <RichRadioTitle className="w-full justify-center text-center">
              {option.title}
            </RichRadioTitle>
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
}

function RichRadioExample({
  style = 'card',
  disabled = false,
  flipped = false,
  showDescription = true,
}: {
  style?: RichStyle;
  disabled?: boolean;
  flipped?: boolean;
  showDescription?: boolean;
}) {
  if (style === 'icon-sm') {
    return <RichRadioIconChipExample size="sm" disabled={disabled} />;
  }
  if (style === 'icon-lg') {
    return <RichRadioIconChipExample size="lg" disabled={disabled} />;
  }
  if (style === 'block') {
    return <RichRadioBlockExample disabled={disabled} />;
  }
  return (
    <RichRadioCardExample
      disabled={disabled}
      flipped={flipped}
      showDescription={showDescription}
    />
  );
}

/** Card alias for older story exports. */
function RichRadioContainerExample(
  props: Parameters<typeof RichRadioCardExample>[0],
) {
  return <RichRadioCardExample {...props} />;
}

function ChoiceCardExample() {
  return (
    <FieldSet className={FRAME}>
      <FieldLegend variant="label">Compute Environment</FieldLegend>
      <FieldDescription>
        Select the compute environment for your cluster.
      </FieldDescription>
      <RadioGroup defaultValue="k8s">
        <FieldLabel htmlFor="rg-card-k8s" choice="card">
          <Field orientation="horizontal" className="!items-start gap-[var(--spacing-sm)]">
            <RadioGroupItem value="k8s" id="rg-card-k8s" />
            <FieldContent>
              <FieldTitle>Kubernetes</FieldTitle>
              <FieldDescription>
                Run GPU workloads on a K8s cluster.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="rg-card-vm" choice="card">
          <Field orientation="horizontal" className="!items-start gap-[var(--spacing-sm)]">
            <RadioGroupItem value="vm" id="rg-card-vm" />
            <FieldContent>
              <FieldTitle>Virtual Machine</FieldTitle>
              <FieldDescription>
                Access a cluster to run GPU workloads.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      </RadioGroup>
    </FieldSet>
  );
}

function FieldsetExample() {
  return (
    <FieldSet className={FRAME}>
      <FieldLegend variant="label">Subscription Plan</FieldLegend>
      <FieldDescription>
        Yearly and lifetime plans offer significant savings.
      </FieldDescription>
      <RadioGroup defaultValue="yearly">
        <Field orientation="horizontal">
          <RadioGroupItem value="monthly" id="rg-fs-monthly" />
          <FieldLabel htmlFor="rg-fs-monthly">Monthly ($9.99/month)</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="yearly" id="rg-fs-yearly" />
          <FieldLabel htmlFor="rg-fs-yearly">Yearly ($99.99/year)</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="lifetime" id="rg-fs-lifetime" />
          <FieldLabel htmlFor="rg-fs-lifetime">Lifetime ($299.99)</FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  );
}

function DisabledExample() {
  return <DemoExample disabled />;
}

function InvalidExample() {
  return (
    <FieldSet className={FRAME}>
      <FieldLegend variant="label">Notification Preferences</FieldLegend>
      <FieldDescription>
        Choose how you want to receive notifications.
      </FieldDescription>
      <RadioGroup defaultValue="email">
        <Field orientation="horizontal" data-invalid>
          <RadioGroupItem value="email" id="rg-inv-email" aria-invalid />
          <FieldLabel htmlFor="rg-inv-email">Email only</FieldLabel>
        </Field>
        <Field orientation="horizontal" data-invalid>
          <RadioGroupItem value="sms" id="rg-inv-sms" aria-invalid />
          <FieldLabel htmlFor="rg-inv-sms">SMS only</FieldLabel>
        </Field>
        <Field orientation="horizontal" data-invalid>
          <RadioGroupItem value="both" id="rg-inv-both" aria-invalid />
          <FieldLabel htmlFor="rg-inv-both">Both Email & SMS</FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  );
}

function RtlExample() {
  return (
    <div dir="rtl" className={FRAME}>
      <RadioGroup defaultValue="comfortable">
        <Field orientation="horizontal">
          <RadioGroupItem value="default" id="rg-rtl-default" />
          <FieldContent>
            <FieldLabel htmlFor="rg-rtl-default">افتراضي</FieldLabel>
            <FieldDescription>
              تباعد قياسي لمعظم حالات الاستخدام.
            </FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="comfortable" id="rg-rtl-comfortable" />
          <FieldContent>
            <FieldLabel htmlFor="rg-rtl-comfortable">مريح</FieldLabel>
            <FieldDescription>مساحة أكبر بين العناصر.</FieldDescription>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="compact" id="rg-rtl-compact" />
          <FieldContent>
            <FieldLabel htmlFor="rg-rtl-compact">مضغوط</FieldLabel>
            <FieldDescription>تباعد أدنى للتخطيطات الكثيفة.</FieldDescription>
          </FieldContent>
        </Field>
      </RadioGroup>
    </div>
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: function OverviewStory() {
    const [layout, setLayout] = useState<PlaygroundLayout>('rich');
    const [richStyle, setRichStyle] = useState<RichStyle>('card');
    const [flipped, setFlipped] = useState(false);
    const [showDescription, setShowDescription] = useState(true);
    const [disabled, setDisabled] = useState(false);

    const isCard = richStyle === 'card';

    return (
      <PrimitivePage
        title="Radio Group"
        description="Single-select radios. Rich Radio Chip (Figma 19:5987): Card / Icon / Block checked use the primary gradient border + focus ring. Compose via FieldLabel `choice`."
        playground={
          <PlaygroundPanel
            previewAlign="stretch"
            preview={
              <div className="flex w-full justify-center">
                {layout === 'rich' ? (
                  <RichRadioExample
                    style={richStyle}
                    disabled={disabled}
                    flipped={flipped}
                    showDescription={showDescription}
                  />
                ) : (
                  <DemoExample disabled={disabled} />
                )}
              </div>
            }
            controls={
              <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
                <InlineSegmentedControl
                  label="Layout"
                  value={layout}
                  options={[
                    { value: 'default', label: 'Default' },
                    { value: 'rich', label: 'Rich container' },
                  ]}
                  onChange={(v) => setLayout(v as PlaygroundLayout)}
                  fullWidth
                />
                <InlineSegmentedControl
                  label="Disabled"
                  value={disabled ? 'on' : 'off'}
                  options={[
                    { value: 'off', label: 'Off' },
                    { value: 'on', label: 'On' },
                  ]}
                  onChange={(v) => setDisabled(v === 'on')}
                  fullWidth
                />
                {layout === 'rich' ? (
                  <>
                    <div className="col-span-2">
                      <InlineSegmentedControl
                        label="Rich style"
                        value={richStyle}
                        options={[
                          { value: 'card', label: 'Card' },
                          { value: 'icon-sm', label: 'Icon SM' },
                          { value: 'icon-lg', label: 'Icon LG' },
                          { value: 'block', label: 'Block' },
                        ]}
                        onChange={(v) => setRichStyle(v as RichStyle)}
                        fullWidth
                      />
                    </div>
                    {isCard ? (
                      <>
                        <InlineSegmentedControl
                          label="Flipped"
                          value={flipped ? 'on' : 'off'}
                          options={[
                            { value: 'off', label: 'Radio start' },
                            { value: 'on', label: 'Radio end' },
                          ]}
                          onChange={(v) => setFlipped(v === 'on')}
                          fullWidth
                        />
                        <InlineSegmentedControl
                          label="Description"
                          value={showDescription ? 'on' : 'off'}
                          options={[
                            { value: 'on', label: 'Line 2 on' },
                            { value: 'off', label: 'Line 2 off' },
                          ]}
                          onChange={(v) => setShowDescription(v === 'on')}
                          fullWidth
                        />
                      </>
                    ) : null}
                  </>
                ) : null}
              </div>
            }
          />
        }
        variants={
          <div className="flex flex-col gap-[var(--spacing-xl)]">
            <PrimitiveGalleryItem label="Rich · Card">
              <RichRadioCardExample />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Rich · Card Flipped">
              <RichRadioCardExample flipped />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Rich · Icon SM">
              <RichRadioIconChipExample size="sm" />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Rich · Icon LG">
              <RichRadioIconChipExample size="lg" />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Rich · Block">
              <RichRadioBlockExample />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Choice card">
              <ChoiceCardExample />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Fieldset">
              <FieldsetExample />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Disabled">
              <DisabledExample />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Invalid">
              <InvalidExample />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="RTL">
              <RtlExample />
            </PrimitiveGalleryItem>
          </div>
        }
        usageGuidance={
          <ul className="list-disc space-y-[var(--spacing-xs)] ps-[var(--spacing-md)]">
            <li>
              Compose <code>RadioGroup</code> → <code>RadioGroupItem</code> with
              Field / FieldLabel for clickable rows.
            </li>
            <li>
              Rich Radio Container (Figma): Card shows the radio; Icon / Block
              hide it out of flow (not <code>sr-only</code> alone — that still
              reserved flex space) and use the card chrome as the affordance.
              Icon / Block checked = primary gradient border + focus ring
              (same recipe as Card). Flipped is Card-only.
            </li>
            <li>
              Invalid: <code>aria-invalid</code> on the item and{' '}
              <code>data-invalid</code> on Field.
            </li>
          </ul>
        }
        accessibility={
          <ul className="list-disc space-y-[var(--spacing-xs)] ps-[var(--spacing-md)]">
            <li>
              Native radio semantics via Base UI; only one value in the group.
            </li>
            <li>
              Icon / Block tiles keep a real radio (visually hidden) so keyboard
              and AT still work.
            </li>
            <li>
              Disable the whole group with <code>disabled</code> on{' '}
              <code>RadioGroup</code>.
            </li>
          </ul>
        }
      />
    );
  },
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Description: Story = {
  name: 'Rich Radio Container',
  render: () => <RichRadioContainerExample />,
};

export const RichRadioContainerFlipped: Story = {
  name: 'Rich Radio Container Flipped',
  render: () => <RichRadioContainerExample flipped />,
};

export const RichIconSm: Story = {
  name: 'Rich Icon SM',
  render: () => <RichRadioIconChipExample size="sm" />,
};

export const RichIconLg: Story = {
  name: 'Rich Icon LG',
  render: () => <RichRadioIconChipExample size="lg" />,
};

export const RichBlock: Story = {
  name: 'Rich Block',
  render: () => <RichRadioBlockExample />,
};

export const ChoiceCard: Story = {
  name: 'Choice Card',
  render: () => <ChoiceCardExample />,
};

export const Fieldset: Story = {
  render: () => <FieldsetExample />,
};

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

export const Invalid: Story = {
  render: () => <InvalidExample />,
};

export const RTL: Story = {
  name: 'RTL',
  render: () => <RtlExample />,
};
