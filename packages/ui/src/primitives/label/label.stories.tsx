import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { DirectionProvider } from '../direction';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '../field';
import { Input } from '../input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import { Textarea } from '../textarea';

import { Label } from './label';
import type { LabelLayout, LabelState } from './label';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages from Figma Label (OC) + shadcn Label.
 *
 * Docs: https://ui.shadcn.com/docs/components/base/label
 * Figma: https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-49170
 */

const meta = {
  title: 'Design System/Primitives/Label',
  component: Label,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

const LAYOUTS: { layout: LabelLayout; label: string }[] = [
  { layout: 'inline', label: 'Inline' },
  { layout: 'block', label: 'Block' },
];

const STATES: { state: LabelState; label: string }[] = [
  { state: 'default', label: 'Default' },
  { state: 'error', label: 'Error' },
];

/* ---------- Canonical examples ---------- */

/** shadcn label-demo — native label + checkbox. */
function DemoExample() {
  return (
    <div className="flex items-center gap-[var(--spacing-sm)]">
      <Checkbox id="label-demo-terms" />
      <Label htmlFor="label-demo-terms">Accept terms and conditions</Label>
    </div>
  );
}

function ErrorExample() {
  return (
    <Label htmlFor="label-error" state="error">
      Label
    </Label>
  );
}

function RequiredExample() {
  return (
    <Label htmlFor="label-required" required>
      Label
    </Label>
  );
}

/** Figma Layout × State matrix. Required is a separate boolean. */
function FigmaMatrixExample() {
  return (
    <div className="flex flex-col gap-[var(--spacing-lg)]">
      {STATES.map(({ state, label: stateLabel }) => (
        <div key={state} className="flex flex-col gap-[var(--spacing-sm)]">
          <p className="font-sans text-xs text-muted-foreground">State: {stateLabel}</p>
          <div className="flex w-56 flex-col gap-[var(--spacing-sm)]">
            {LAYOUTS.map(({ layout, label: layoutLabel }) => (
              <div key={layout} className="flex flex-col gap-[var(--spacing-2xs)]">
                <span className="font-sans text-xs text-muted-foreground">{layoutLabel}</span>
                <Label layout={layout} state={state}>
                  Label
                </Label>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-[var(--spacing-sm)]">
        <p className="font-sans text-xs text-muted-foreground">Show required</p>
        <div className="flex items-center gap-[var(--spacing-xl)]">
          <Label required>Label</Label>
          <Label layout="block" className="w-56" required>
            Label
          </Label>
        </div>
      </div>
    </div>
  );
}

/** shadcn docs Usage — Field + FieldLabel + Input. */
function FieldUsageExample() {
  return (
    <Field className="w-72">
      <FieldLabel htmlFor="label-field-email">Your email address</FieldLabel>
      <Input id="label-field-email" type="email" placeholder="m@example.com" />
    </Field>
  );
}

/** shadcn field-demo — payment form (Label in Field). */
function FieldDemoExample() {
  return (
    <form
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <FieldSet>
        <FieldLegend>Payment Method</FieldLegend>
        <FieldDescription>All transactions are secure and encrypted</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="label-pay-name">Name on Card</FieldLabel>
            <Input id="label-pay-name" autoComplete="cc-name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="label-pay-number">Card Number</FieldLabel>
            <Input id="label-pay-number" autoComplete="cc-number" />
            <FieldDescription>Enter your 16-digit card number</FieldDescription>
          </Field>
          <div className="grid grid-cols-3 gap-[var(--spacing-md)]">
            <Field>
              <FieldLabel htmlFor="label-pay-month">Month</FieldLabel>
              <Select>
                <SelectTrigger id="label-pay-month">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = String(i + 1).padStart(2, '0');
                    return (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="label-pay-year">Year</FieldLabel>
              <Select>
                <SelectTrigger id="label-pay-year">
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  {['2026', '2027', '2028', '2029'].map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="label-pay-cvv">CVV</FieldLabel>
              <Input id="label-pay-cvv" autoComplete="cc-csc" />
            </Field>
          </div>
          <FieldSet>
            <FieldLegend variant="label">Billing Address</FieldLegend>
            <FieldDescription>
              The billing address associated with your payment method
            </FieldDescription>
            <Field orientation="horizontal">
              <Checkbox id="label-pay-same" defaultChecked />
              <FieldLabel htmlFor="label-pay-same">Same as shipping address</FieldLabel>
            </Field>
          </FieldSet>
          <Field>
            <FieldLabel htmlFor="label-pay-comments">Comments</FieldLabel>
            <Textarea id="label-pay-comments" rows={3} />
          </Field>
          <div className="flex gap-[var(--spacing-xs)]">
            <Button type="submit">Submit</Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

/** shadcn label-rtl. */
function RtlExample() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="flex items-center gap-[var(--spacing-sm)]">
        <Checkbox id="label-rtl-terms" />
        <Label htmlFor="label-rtl-terms">قبول الشروط والأحكام</Label>
      </div>
    </DirectionProvider>
  );
}

function LabelPlayground() {
  const [layout, setLayout] = useState<LabelLayout>('inline');
  const [state, setState] = useState<LabelState>('default');
  const [required, setRequired] = useState(false);

  return (
    <PlaygroundPanel
      preview={
        <div className={layout === 'block' ? 'w-56' : undefined}>
          <Label layout={layout} state={state} required={required} htmlFor="label-playground">
            Label
          </Label>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Layout"
            value={layout}
            options={LAYOUTS.map(({ layout: value, label }) => ({ value, label }))}
            onChange={setLayout}
            fullWidth
          />
          <InlineSegmentedControl
            label="State"
            value={state}
            options={STATES.map(({ state: value, label }) => ({ value, label }))}
            onChange={setState}
            fullWidth
          />
          <InlineSegmentedControl
            label="Required"
            value={required ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setRequired(v === 'on')}
            fullWidth
          />
        </div>
      }
    />
  );
}

/* ---------- Overview ---------- */

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Label"
      description={
        <>
          Accessible caption for a control. Figma files this as Label (OC) —
          Layout, State, and an optional required mark — on the native{' '}
          <code>label</code> from shadcn. For form fields, use Field / FieldLabel
          (description and error live there); this primitive is the type and
          color those hosts inherit.
        </>
      }
      playground={<LabelPlayground />}
      variants={
        <div className="flex flex-wrap gap-4">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Error">
            <ErrorExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Required">
            <RequiredExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Figma Matrix">
            <FigmaMatrixExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Field">
            <FieldUsageExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Pair a standalone control with <code>htmlFor</code> / <code>id</code>{' '}
            (checkbox, radio, slider caption). Inside a form row, use{' '}
            <code>Field</code> + <code>FieldLabel</code> so orientation, invalid,
            and disabled host styles apply.
          </li>
          <li>
            <code>layout=&quot;inline&quot;</code> hugs the caption (checkbox /
            radio rows). <code>layout=&quot;block&quot;</code> fills the parent
            width (stacked captions).
          </li>
          <li>
            <code>state=&quot;error&quot;</code> tints the caption destructive.
            Field sets this automatically when the host is{' '}
            <code>data-invalid</code>.
          </li>
          <li>
            <code>required</code> draws a trailing <code>*</code> only. Mark the
            control <code>aria-required</code> (or native <code>required</code>)
            — do not rely on the asterisk for assistive tech.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Renders a native <code>label</code>. Clicking the caption focuses /
            toggles the labelled control.
          </li>
          <li>
            The required asterisk is <code>aria-hidden</code>. Put requiredness
            on the control, not the caption.
          </li>
          <li>
            Disabled styling follows <code>peer-disabled</code> and Field{' '}
            <code>group-data-[disabled]</code> — keep the control as the{' '}
            <code>peer</code> or inside <code>Field</code>.
          </li>
          <li>
            Do not use color alone for error: pair with FieldError / inline
            message on the Field.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Error: Story = {
  render: () => <ErrorExample />,
};

export const Required: Story = {
  render: () => <RequiredExample />,
};

export const FieldStory: Story = {
  name: 'Field',
  render: () => <FieldDemoExample />,
};

export const RTL: Story = {
  name: 'RTL',
  render: () => <RtlExample />,
};
