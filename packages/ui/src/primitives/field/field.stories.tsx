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
import { Input } from '../input';
import type { InputProps } from '../input';
import { RadioGroup, RadioGroupItem } from '../radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import { Slider } from '../slider';
import { Switch } from '../switch';
import { Textarea } from '../textarea';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from './field';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. Figma Field + shadcn Field guide.
 *
 * Control chrome: Field demos use Input Style=Default / Regular / Default
 * roundness (Figma Input defaults) — not Ghost.
 */

type Orientation = 'vertical' | 'horizontal' | 'responsive';

/** Pinned Input defaults for Field demos (Figma Style=Default). */
function FieldInput(props: InputProps) {
  return (
    <Input variant="default" size="default" roundness="default" {...props} />
  );
}

const meta = {
  title: 'Design System/Primitives/Field',
  component: Field,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function InputExample() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
      {/* Figma Vertical Field — Type=Text Value, State=Default (+ Inline message) */}
      <Field>
        <FieldLabel htmlFor="field-figma-default">Label</FieldLabel>
        <FieldInput id="field-figma-default" defaultValue="Ch 1:" />
        <FieldDescription>Inline message</FieldDescription>
      </Field>
      {/* Figma Vertical Field — Type=Text Value, State=Error (+ Inline message) */}
      <Field data-invalid>
        <FieldLabel htmlFor="field-figma-error">Label</FieldLabel>
        <FieldInput
          id="field-figma-error"
          defaultValue="Ch 1:"
          aria-invalid
        />
        <FieldError>Inline message</FieldError>
      </Field>
    </div>
  );
}

function TextareaExample() {
  return (
    <Field className="w-80 max-w-full">
      <FieldLabel htmlFor="field-feedback">Feedback</FieldLabel>
      <Textarea
        id="field-feedback"
        placeholder="Share your thoughts…"
        rows={4}
      />
      <FieldDescription>Share your thoughts about our service.</FieldDescription>
    </Field>
  );
}

function SelectExample() {
  return (
    <Field className="w-80 max-w-full">
      <FieldLabel htmlFor="field-department">Department</FieldLabel>
      <Select>
        <SelectTrigger id="field-department">
          <SelectValue placeholder="Choose department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="engineering">Engineering</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="product">Product</SelectItem>
        </SelectContent>
      </Select>
      <FieldDescription>
        Select your department or area of work.
      </FieldDescription>
    </Field>
  );
}

function SliderExample() {
  const [value, setValue] = useState([200, 800]);
  return (
    <Field className="w-80 max-w-full">
      <FieldLabel>Price Range</FieldLabel>
      <Slider
        value={value}
        onValueChange={(next) =>
          setValue(Array.isArray(next) ? [...next] : [next])
        }
        min={0}
        max={1000}
        step={10}
      />
      <FieldDescription>
        Set your budget range (${value[0]} – {value[1]}).
      </FieldDescription>
    </Field>
  );
}

function FieldsetExample() {
  return (
    <FieldSet className="w-80 max-w-full">
      <FieldLegend>Address Information</FieldLegend>
      <FieldDescription>
        We need your address to deliver your order.
      </FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="field-street">Street Address</FieldLabel>
          <FieldInput id="field-street" autoComplete="street-address" />
        </Field>
        <Field>
          <FieldLabel htmlFor="field-city">City</FieldLabel>
          <FieldInput id="field-city" autoComplete="address-level2" />
        </Field>
        <Field>
          <FieldLabel htmlFor="field-postal">Postal Code</FieldLabel>
          <FieldInput id="field-postal" autoComplete="postal-code" />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}

function CheckboxExample() {
  return (
    <FieldSet className="w-80 max-w-full">
      <FieldLegend variant="label">Show these items on the desktop</FieldLegend>
      <FieldDescription>
        Select the items you want to show on the desktop.
      </FieldDescription>
      <FieldGroup data-slot="checkbox-group">
        {(
          [
            ['hard-disks', 'Hard disks'],
            ['external', 'External disks'],
            ['cds', 'CDs, DVDs, and iPods'],
            ['servers', 'Connected servers'],
          ] as const
        ).map(([id, label]) => (
          <Field key={id} orientation="horizontal">
            <Checkbox id={`field-cb-${id}`} />
            <FieldLabel htmlFor={`field-cb-${id}`}>{label}</FieldLabel>
          </Field>
        ))}
        <Field orientation="horizontal">
          <Checkbox id="field-cb-sync" defaultChecked />
          <FieldContent>
            <FieldLabel htmlFor="field-cb-sync">
              Sync Desktop &amp; Documents folders
            </FieldLabel>
            <FieldDescription>
              Your Desktop &amp; Documents folders are being synced with iCloud
              Drive.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}

function RadioExample() {
  return (
    <FieldSet className="w-80 max-w-full">
      <FieldLegend variant="label">Subscription Plan</FieldLegend>
      <FieldDescription>
        Yearly and lifetime plans offer significant savings.
      </FieldDescription>
      <RadioGroup defaultValue="yearly" className="gap-[var(--spacing-sm)]">
        {(
          [
            ['monthly', 'Monthly ($9.99/month)'],
            ['yearly', 'Yearly ($99.99/year)'],
            ['lifetime', 'Lifetime ($299.99)'],
          ] as const
        ).map(([value, label]) => (
          <Field key={value} orientation="horizontal">
            <RadioGroupItem value={value} id={`field-radio-${value}`} />
            <FieldLabel htmlFor={`field-radio-${value}`}>{label}</FieldLabel>
          </Field>
        ))}
      </RadioGroup>
    </FieldSet>
  );
}

function SwitchExample() {
  return (
    <Field orientation="horizontal" className="w-80 max-w-full">
      <FieldContent>
        <FieldLabel htmlFor="field-mfa">Multi-factor authentication</FieldLabel>
        <FieldDescription>
          Require a second factor when signing in.
        </FieldDescription>
      </FieldContent>
      <Switch id="field-mfa" />
    </Field>
  );
}

function ChoiceCardExample() {
  return (
    <FieldSet className="w-80 max-w-full">
      <FieldLegend variant="label">Compute Environment</FieldLegend>
      <FieldDescription>
        Select the compute environment for your cluster.
      </FieldDescription>
      <RadioGroup defaultValue="k8s" className="gap-[var(--spacing-sm)]">
        <FieldLabel htmlFor="field-choice-k8s" choice="card">
          <Field orientation="horizontal" className="!items-start gap-[var(--spacing-sm)]">
            <RadioGroupItem value="k8s" id="field-choice-k8s" />
            <FieldContent>
              <FieldTitle>Kubernetes</FieldTitle>
              <FieldDescription>
                Run GPU workloads on a K8s cluster.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="field-choice-vm" choice="card">
          <Field orientation="horizontal" className="!items-start gap-[var(--spacing-sm)]">
            <RadioGroupItem value="vm" id="field-choice-vm" />
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

function FieldGroupExample() {
  return (
    <FieldGroup className="w-80 max-w-full">
      <FieldSet>
        <FieldLegend variant="label">Responses</FieldLegend>
        <FieldDescription>
          Get notified when ChatGPT responds to requests that take time.
        </FieldDescription>
        <Field orientation="horizontal">
          <Checkbox id="field-push-responses" defaultChecked />
          <FieldLabel htmlFor="field-push-responses">
            Push notifications
          </FieldLabel>
        </Field>
      </FieldSet>
      <FieldSeparator />
      <FieldSet>
        <FieldLegend variant="label">Tasks</FieldLegend>
        <FieldDescription>
          Get notified when tasks you&apos;ve created have updates.
        </FieldDescription>
        <FieldGroup data-slot="checkbox-group">
          <Field orientation="horizontal">
            <Checkbox id="field-push-tasks" defaultChecked />
            <FieldLabel htmlFor="field-push-tasks">
              Push notifications
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="field-email-tasks" />
            <FieldLabel htmlFor="field-email-tasks">
              Email notifications
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
}

function ValidationExample() {
  return (
    <Field data-invalid className="w-80 max-w-full">
      <FieldLabel htmlFor="field-email-invalid">Email</FieldLabel>
      <FieldInput
        id="field-email-invalid"
        type="email"
        defaultValue="not-an-email"
        aria-invalid
      />
      <FieldError>Enter a valid email address.</FieldError>
    </Field>
  );
}

function ResponsiveExample() {
  return (
    <FieldSet className="w-full max-w-xl">
      <FieldLegend>Profile</FieldLegend>
      <FieldDescription>Fill in your profile information.</FieldDescription>
      <FieldGroup className="@container/field-group">
        <Field orientation="responsive">
          <FieldLabel htmlFor="field-responsive-name">Name</FieldLabel>
          <FieldContent>
            <FieldInput id="field-responsive-name" placeholder="Evil Rabbit" />
            <FieldDescription>
              Provide your full name for identification
            </FieldDescription>
          </FieldContent>
        </Field>
        <div className="flex gap-[var(--spacing-xs)]">
          <Button type="button">Submit</Button>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </div>
      </FieldGroup>
    </FieldSet>
  );
}

function RtlExample() {
  return (
    <div dir="rtl">
      <FieldSet className="w-80 max-w-full">
        <FieldLegend>الملف الشخصي</FieldLegend>
        <FieldDescription>يظهر هذا في الفواتير ورسائل البريد.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="field-rtl-name">الاسم الكامل</FieldLabel>
            <FieldInput id="field-rtl-name" autoComplete="off" />
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="field-rtl-user">اسم المستخدم</FieldLabel>
            <FieldInput id="field-rtl-user" aria-invalid autoComplete="off" />
            <FieldError>اختر اسم مستخدم آخر.</FieldError>
          </Field>
          <Field orientation="horizontal">
            <Switch id="field-rtl-news" />
            <FieldLabel htmlFor="field-rtl-news">
              الاشتراك في النشرة الإخبارية
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}

function DemoPayment() {
  return (
    <form
      className="w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <FieldSet>
        <FieldLegend>Payment Method</FieldLegend>
        <FieldDescription>
          All transactions are secure and encrypted
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="field-demo-name">Name on Card</FieldLabel>
            <FieldInput id="field-demo-name" autoComplete="cc-name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="field-demo-number">Card Number</FieldLabel>
            <FieldInput id="field-demo-number" autoComplete="cc-number" />
            <FieldDescription>
              Enter your 16-digit card number
            </FieldDescription>
          </Field>
          <div className="grid grid-cols-3 gap-[var(--spacing-md)]">
            <Field>
              <FieldLabel htmlFor="field-demo-month">Month</FieldLabel>
              <Select>
                <SelectTrigger id="field-demo-month">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const m = String(i + 1).padStart(2, '0');
                    return (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="field-demo-year">Year</FieldLabel>
              <Select>
                <SelectTrigger id="field-demo-year">
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  {['2026', '2027', '2028', '2029'].map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="field-demo-cvv">CVV</FieldLabel>
              <FieldInput id="field-demo-cvv" autoComplete="cc-csc" />
            </Field>
          </div>
          <FieldSet>
            <FieldLegend variant="label">Billing Address</FieldLegend>
            <FieldDescription>
              The billing address associated with your payment method
            </FieldDescription>
            <Field orientation="horizontal">
              <Checkbox id="field-demo-same" defaultChecked />
              <FieldLabel htmlFor="field-demo-same">
                Same as shipping address
              </FieldLabel>
            </Field>
          </FieldSet>
          <Field>
            <FieldLabel htmlFor="field-demo-comments">Comments</FieldLabel>
            <Textarea id="field-demo-comments" rows={3} />
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

function FieldPlayground() {
  const [orientation, setOrientation] = useState<Orientation>('vertical');
  const [state, setState] = useState<'default' | 'error'>('default');
  const [inlineMessage, setInlineMessage] = useState(true);
  const invalid = state === 'error';

  return (
    <PlaygroundPanel
      preview={
        <Field
          orientation={orientation}
          data-invalid={invalid || undefined}
          className="w-80 max-w-full"
        >
          {orientation === 'horizontal' ? (
            <>
              <FieldLabel htmlFor="field-play">Label</FieldLabel>
              <FieldContent>
                <FieldInput
                  id="field-play"
                  defaultValue="Ch 1:"
                  aria-invalid={invalid || undefined}
                />
                {inlineMessage && !invalid ? (
                  <FieldDescription>Inline message</FieldDescription>
                ) : null}
                {inlineMessage && invalid ? (
                  <FieldError>Inline message</FieldError>
                ) : null}
              </FieldContent>
            </>
          ) : (
            <>
              <FieldLabel htmlFor="field-play">Label</FieldLabel>
              <FieldInput
                id="field-play"
                defaultValue="Ch 1:"
                aria-invalid={invalid || undefined}
              />
              {inlineMessage && !invalid ? (
                <FieldDescription>Inline message</FieldDescription>
              ) : null}
              {inlineMessage && invalid ? (
                <FieldError>Inline message</FieldError>
              ) : null}
            </>
          )}
        </Field>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Orientation"
            value={orientation}
            onChange={(v) => setOrientation(v as Orientation)}
            options={[
              { value: 'vertical', label: 'Vertical' },
              { value: 'horizontal', label: 'Horizontal' },
              { value: 'responsive', label: 'Responsive' },
            ]}
          />
          <InlineSegmentedControl
            label="State"
            value={state}
            onChange={(v) => setState(v as 'default' | 'error')}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'error', label: 'Error' },
            ]}
          />
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Inline message"
              value={inlineMessage ? 'on' : 'off'}
              onChange={(v) => setInlineMessage(v === 'on')}
              options={[
                { value: 'on', label: 'On' },
                { value: 'off', label: 'Off' },
              ]}
            />
          </div>
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Field"
      description="Figma Vertical / Horizontal Field layout with the shadcn Field API. Text Value controls use Foundations Input (Style=Default)."
      playground={<FieldPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Text Value (Figma)">
            <InputExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Demo">
            <DemoPayment />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Checkbox">
            <CheckboxExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Choice card">
            <ChoiceCardExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Validation">
            <ValidationExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Compose <code>FieldLabel</code> + control + optional{' '}
            <code>FieldDescription</code> / <code>FieldError</code> (Figma
            Inline message).
          </li>
          <li>
            Text Value chrome is Foundations <code>Input</code> with{' '}
            <code>variant=&quot;default&quot;</code> (filled) — not Ghost.
          </li>
          <li>
            Set <code>data-invalid</code> on <code>Field</code> and{' '}
            <code>aria-invalid</code> on the control for Error state.
          </li>
          <li>
            Stack gap is <code>--spacing-1-5</code> (6); Select / Textarea /
            Checkbox / Radio / Slider stay on those primitives.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>Field</code> uses <code>role=&quot;group&quot;</code>; pair{' '}
            <code>FieldLabel htmlFor</code> with control <code>id</code>.
          </li>
          <li>
            <code>FieldError</code> is <code>role=&quot;alert&quot;</code>; keep
            it adjacent to the control.
          </li>
          <li>
            Prefer <code>FieldSet</code> / <code>FieldLegend</code> for related
            checkbox and radio groups.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoPayment />,
};

export const InputStory: Story = {
  name: 'Input',
  render: () => <InputExample />,
};

export const TextareaStory: Story = {
  name: 'Textarea',
  render: () => <TextareaExample />,
};

export const SelectStory: Story = {
  name: 'Select',
  render: () => <SelectExample />,
};

export const SliderStory: Story = {
  name: 'Slider',
  render: () => <SliderExample />,
};

export const FieldsetStory: Story = {
  name: 'Fieldset',
  render: () => <FieldsetExample />,
};

export const CheckboxStory: Story = {
  name: 'Checkbox',
  render: () => <CheckboxExample />,
};

export const RadioStory: Story = {
  name: 'Radio',
  render: () => <RadioExample />,
};

export const SwitchStory: Story = {
  name: 'Switch',
  render: () => <SwitchExample />,
};

export const ChoiceCard: Story = {
  name: 'Choice Card',
  render: () => <ChoiceCardExample />,
};

export const FieldGroupStory: Story = {
  name: 'Field Group',
  render: () => <FieldGroupExample />,
};

export const Responsive: Story = {
  render: () => <ResponsiveExample />,
};

export const Validation: Story = {
  render: () => <ValidationExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
