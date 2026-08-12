import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

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
 * Overview first — then shadcn Radio Group docs examples (Description, Choice
 * Card, Fieldset, Disabled, Invalid, RTL).
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

function DescriptionExample() {
  return (
    <RadioGroup defaultValue="plus" className={FRAME}>
      <FieldLabel htmlFor="rg-desc-plus">
        <Field orientation="horizontal">
          <RadioGroupItem value="plus" id="rg-desc-plus" />
          <FieldContent>
            <FieldTitle>Plus</FieldTitle>
            <FieldDescription>
              For individuals and small teams.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="rg-desc-pro">
        <Field orientation="horizontal">
          <RadioGroupItem value="pro" id="rg-desc-pro" />
          <FieldContent>
            <FieldTitle>Pro</FieldTitle>
            <FieldDescription>For growing businesses.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="rg-desc-enterprise">
        <Field orientation="horizontal">
          <RadioGroupItem value="enterprise" id="rg-desc-enterprise" />
          <FieldContent>
            <FieldTitle>Enterprise</FieldTitle>
            <FieldDescription>
              For large teams and enterprises.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </RadioGroup>
  );
}

function ChoiceCardExample() {
  return (
    <FieldSet className={FRAME}>
      <FieldLegend variant="label">Compute Environment</FieldLegend>
      <FieldDescription>
        Select the compute environment for your cluster.
      </FieldDescription>
      <RadioGroup defaultValue="k8s">
        <FieldLabel htmlFor="rg-card-k8s">
          <Field orientation="horizontal" className="items-start">
            <RadioGroupItem value="k8s" id="rg-card-k8s" />
            <FieldContent>
              <FieldTitle>Kubernetes</FieldTitle>
              <FieldDescription>
                Run GPU workloads on a K8s cluster.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="rg-card-vm">
          <Field orientation="horizontal" className="items-start">
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
    const [disabled, setDisabled] = useState(false);

    return (
      <PrimitivePage
        title="Radio Group"
        description="Single-select radios. Chrome twins Checkbox (16 circle, primary fill + dot); compose with Field for labels, descriptions, and fieldsets."
        playground={
          <PlaygroundPanel
            preview={<DemoExample disabled={disabled} />}
            controls={
              <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
                <InlineSegmentedControl
                  label="Disabled"
                  value={disabled ? 'on' : 'off'}
                  options={[
                    { value: 'off', label: 'Off' },
                    { value: 'on', label: 'On' },
                  ]}
                  onChange={(v) => setDisabled(v === 'on')}
                />
              </div>
            }
          />
        }
        variants={
          <div className="flex flex-col gap-[var(--spacing-xl)]">
            <PrimitiveGalleryItem label="Description">
              <DescriptionExample />
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
              Choice cards: wrap the Field in <code>FieldLabel</code> so the
              whole card toggles the radio.
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
              Expanded hit target on the control; prefer labeled Field rows for
              the full clickable area.
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
  render: () => <DescriptionExample />,
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
