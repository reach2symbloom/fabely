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
  FieldError,
  FieldLabel,
} from '../field';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground + shadcn Select docs demos (Align Item /
 * Groups / Scrollable / Disabled / Invalid / RTL).
 *
 * Docs: https://ui.shadcn.com/docs/components/base/select
 * Figma: https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16-1732
 */

const meta = {
  title: 'Design System/Primitives/Select',
  component: Select,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const fruits: {
  value: string;
  label: string;
  disabled?: boolean;
}[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'pineapple', label: 'Pineapple' },
  { value: 'grape', label: 'Grape', disabled: true },
];

const timezones = [
  {
    label: 'North America',
    items: [
      { value: 'est', label: 'Eastern Standard Time (EST)' },
      { value: 'cst', label: 'Central Standard Time (CST)' },
      { value: 'mst', label: 'Mountain Standard Time (MST)' },
      { value: 'pst', label: 'Pacific Standard Time (PST)' },
      { value: 'akst', label: 'Alaska Standard Time (AKST)' },
      { value: 'hst', label: 'Hawaii Standard Time (HST)' },
    ],
  },
  {
    label: 'Europe & Africa',
    items: [
      { value: 'gmt', label: 'Greenwich Mean Time (GMT)' },
      { value: 'cet', label: 'Central European Time (CET)' },
      { value: 'eet', label: 'Eastern European Time (EET)' },
      { value: 'west', label: 'Western European Summer Time (WEST)' },
      { value: 'cat', label: 'Central Africa Time (CAT)' },
      { value: 'eat', label: 'East Africa Time (EAT)' },
    ],
  },
  {
    label: 'Asia',
    items: [
      { value: 'msk', label: 'Moscow Time (MSK)' },
      { value: 'ist', label: 'India Standard Time (IST)' },
      { value: 'cst_china', label: 'China Standard Time (CST)' },
      { value: 'jst', label: 'Japan Standard Time (JST)' },
      { value: 'kst', label: 'Korea Standard Time (KST)' },
      { value: 'ist_indonesia', label: 'Indonesia Central Standard Time (WITA)' },
    ],
  },
] as const;

function FruitItems({ includeDisabled = false }: { includeDisabled?: boolean }) {
  return (
    <SelectGroup>
      {fruits
        .filter((fruit) => includeDisabled || !fruit.disabled)
        .map((fruit) => (
          <SelectItem
            key={fruit.value}
            value={fruit.value}
            disabled={fruit.disabled}
          >
            {fruit.label}
          </SelectItem>
        ))}
    </SelectGroup>
  );
}

/** shadcn select-demo — fruit picker (`items` on Root per docs Usage). */
function DemoExample({
  size = 'default',
  disabled = false,
  invalid = false,
}: {
  size?: 'sm' | 'default';
  disabled?: boolean;
  invalid?: boolean;
}) {
  const items = fruits.map(({ value, label }) => ({ value, label }));
  return (
    <Select items={items} defaultValue="apple" disabled={disabled}>
      <SelectTrigger
        className="w-[length:var(--spacing-10xl)]"
        size={size}
        aria-invalid={invalid || undefined}
        aria-label="Fruit"
      >
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <FruitItems includeDisabled />
      </SelectContent>
    </Select>
  );
}

/** shadcn groups demo. */
function GroupsExample() {
  return (
    <Select defaultValue="banana">
      <SelectTrigger className="w-[length:var(--spacing-10xl)]" aria-label="Fruit">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="broccoli">Broccoli</SelectItem>
          <SelectItem value="spinach">Spinach</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

/** shadcn scrollable timezone demo. */
function ScrollableExample() {
  return (
    <Select>
      <SelectTrigger className="w-[length:var(--spacing-10xl)]" aria-label="Timezone">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        {timezones.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}

function DisabledExample() {
  return <DemoExample disabled />;
}

function InvalidExample() {
  return (
    <Field data-invalid className="w-[length:var(--spacing-10xl)]">
      <FieldLabel>Fruit</FieldLabel>
      <FieldContent>
        <Select>
          <SelectTrigger aria-invalid aria-label="Fruit" className="w-full">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <FruitItems />
          </SelectContent>
        </Select>
        <FieldError>Please select a fruit.</FieldError>
      </FieldContent>
    </Field>
  );
}

function RtlExample() {
  return (
    <div dir="rtl" className="flex flex-col gap-[var(--spacing-sm)]">
      <p className="text-[length:var(--text-paragraph-mini-regular-font-size)] text-[color:var(--muted-foreground)]">
        العربية (RTL)
      </p>
      <Select defaultValue="apple">
        <SelectTrigger className="w-[length:var(--spacing-10xl)]" aria-label="فاكهة">
          <SelectValue placeholder="اختر فاكهة" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple">تفاح</SelectItem>
            <SelectItem value="banana">موز</SelectItem>
            <SelectItem value="blueberry">توت</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

function AlignItemExample() {
  const [align, setAlign] = useState(true);
  return (
    <div className="flex flex-col gap-[var(--spacing-sm)]">
      <InlineSegmentedControl
        label="Align item with trigger"
        value={align ? 'on' : 'off'}
        options={[
          { value: 'off', label: 'Off' },
          { value: 'on', label: 'On' },
        ]}
        onChange={(v) => setAlign(v === 'on')}
        fullWidth
      />
      <Select defaultValue="banana">
        <SelectTrigger className="w-[length:var(--spacing-10xl)]" aria-label="Fruit">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={align}>
          <FruitItems />
        </SelectContent>
      </Select>
    </div>
  );
}

function SelectPlayground() {
  const [size, setSize] = useState<'sm' | 'default'>('default');
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);

  return (
    <PlaygroundPanel
      previewAlign="center"
      preview={
        <DemoExample size={size} disabled={disabled} invalid={invalid} />
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Size"
            value={size}
            options={[
              { value: 'sm', label: 'Sm' },
              { value: 'default', label: 'Default' },
            ]}
            onChange={(v) => setSize(v as 'sm' | 'default')}
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
          <InlineSegmentedControl
            label="Invalid"
            value={invalid ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setInvalid(v === 'on')}
            fullWidth
            className="col-span-2"
          />
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Select"
      description="Designed popup picker from Figma Select & Combobox — field chrome + ListItem rows. Prefer Native Select for OS pickers."
      playground={<SelectPlayground />}
      variants={
        <div className="flex flex-col gap-[var(--spacing-xl)]">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Align Item With Trigger">
            <AlignItemExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Groups">
            <GroupsExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Scrollable">
            <ScrollableExample />
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
            Pass <code>items</code> on <code>Select</code> (Base UI) when you
            have a value/label list; still render <code>SelectItem</code>s in
            the content tree.
          </li>
          <li>
            Prefer this for designed popups; use{' '}
            <code>NativeSelect</code> for OS / lightweight fields.
          </li>
          <li>
            Wrap items in <code>SelectGroup</code>. Use{' '}
            <code>SelectLabel</code> / <code>SelectSeparator</code> for
            sections.
          </li>
          <li>
            <code>alignItemWithTrigger</code> on <code>SelectContent</code>{' '}
            (default true) lines the selected row up with the trigger.
          </li>
          <li>
            Invalid: <code>data-invalid</code> on Field +{' '}
            <code>aria-invalid</code> on <code>SelectTrigger</code>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-[var(--spacing-xs)] ps-[var(--spacing-md)]">
          <li>
            Trigger is a focusable button; focus uses Foundations{' '}
            <code>--effect-focus-ring-secondary</code>.
          </li>
          <li>
            Provide an accessible name via <code>aria-label</code> or a Field
            label.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Groups: Story = {
  render: () => <GroupsExample />,
};

export const Scrollable: Story = {
  render: () => <ScrollableExample />,
};

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

export const Invalid: Story = {
  render: () => <InvalidExample />,
};

export const AlignItemWithTrigger: Story = {
  name: 'Align Item With Trigger',
  render: () => <AlignItemExample />,
};

export const RTL: Story = {
  name: 'RTL',
  render: () => <RtlExample />,
};
