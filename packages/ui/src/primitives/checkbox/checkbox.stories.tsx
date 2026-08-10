import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { Checkbox } from './checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '../field';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages aligned with shadcn Checkbox docs + Figma Checked?/State.
 *
 * Deferred partners (README → Deferred / post-primitives docket): Field, Label,
 * Table, Figma Checkbox Group.
 */

const meta = {
  title: 'Design System/Primitives/Checkbox',
  component: Checkbox,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

function LimitationNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
      <span aria-hidden="true">⚠️</span>
      <span>{children}</span>
    </div>
  );
}

/* ---------- Canonical examples ---------- */

function BasicExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <LimitationNotice>
        Field / Label are still thin-pass — layout only until those primitives
        are Foundations-matched.
      </LimitationNotice>
      <Field orientation="horizontal">
        <Checkbox id="terms" />
        <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
      </Field>
    </div>
  );
}

function DescriptionExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <LimitationNotice>
        Uses thin-pass Field content / description chrome.
      </LimitationNotice>
      <Field orientation="horizontal">
        <Checkbox id="terms-desc" defaultChecked />
        <FieldContent>
          <FieldLabel htmlFor="terms-desc">Accept terms and conditions</FieldLabel>
          <FieldDescription>
            By clicking this checkbox, you agree to the terms and conditions.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  );
}

function DisabledExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <LimitationNotice>
        Field <code>data-disabled</code> host styles come from thin-pass Field.
      </LimitationNotice>
      <Field orientation="horizontal" data-disabled>
        <Checkbox id="notifications" disabled />
        <FieldLabel htmlFor="notifications">Enable notifications</FieldLabel>
      </Field>
      <Field orientation="horizontal" data-disabled>
        <Checkbox id="notifications-on" disabled defaultChecked />
        <FieldLabel htmlFor="notifications-on">
          Notifications already on
        </FieldLabel>
      </Field>
    </div>
  );
}

function InvalidExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <LimitationNotice>
        Invalid Field host text uses thin-pass Field; checkbox chrome is Fabely.
      </LimitationNotice>
      <Field orientation="horizontal" data-invalid>
        <Checkbox id="terms-invalid" aria-invalid />
        <FieldLabel htmlFor="terms-invalid">
          Accept terms and conditions
        </FieldLabel>
      </Field>
      <Field orientation="horizontal" data-invalid>
        <Checkbox id="terms-invalid-on" aria-invalid defaultChecked />
        <FieldLabel htmlFor="terms-invalid-on">
          Accept terms and conditions
        </FieldLabel>
      </Field>
    </div>
  );
}

function GroupExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <LimitationNotice>
        Checkbox list via thin-pass FieldSet / FieldGroup (not the Figma Checkbox
        Group component set).
      </LimitationNotice>
      <FieldSet>
        <FieldLegend variant="label">Show these items on the desktop:</FieldLegend>
        <FieldDescription>
          Select the items you want to show on the desktop.
        </FieldDescription>
        <div data-slot="checkbox-group" className="flex flex-col gap-3">
          {(
            [
              ['hard-disks', 'Hard disks', true],
              ['external-disks', 'External disks', true],
              ['cds', 'CDs, DVDs, and iPods', false],
              ['servers', 'Connected servers', false],
            ] as const
          ).map(([id, label, checked]) => (
            <Field key={id} orientation="horizontal">
              <Checkbox id={id} defaultChecked={checked} />
              <FieldLabel htmlFor={id}>{label}</FieldLabel>
            </Field>
          ))}
        </div>
      </FieldSet>
    </div>
  );
}

function IndeterminateExample() {
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);

  return (
    <div className="flex flex-col items-start gap-4">
      <Field orientation="horizontal">
        <Checkbox
          id="select-all"
          checked={checked}
          indeterminate={indeterminate}
          onCheckedChange={(value) => {
            setIndeterminate(false);
            setChecked(value === true);
          }}
        />
        <FieldLabel htmlFor="select-all">Select all</FieldLabel>
      </Field>
      <p className="text-sm text-muted-foreground">
        Figma <code>Checked?=Indeterminate</code> — Lucide minus glyph.
      </p>
    </div>
  );
}

function RtlExample() {
  return (
    <div dir="rtl" className="flex w-full max-w-sm flex-col gap-4">
      <LimitationNotice>
        RTL copy; Field/Label partners still thin-pass.
      </LimitationNotice>
      <Field orientation="horizontal">
        <Checkbox id="terms-rtl" defaultChecked />
        <FieldContent>
          <FieldLabel htmlFor="terms-rtl">قبول الشروط والأحكام</FieldLabel>
          <FieldDescription>
            بالنقر على هذا المربع، فإنك توافق على الشروط.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="notifications-rtl" />
        <FieldLabel htmlFor="notifications-rtl">تفعيل الإشعارات</FieldLabel>
      </Field>
    </div>
  );
}

function StatesGalleryExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Checkbox aria-label="Unchecked" />
      <Checkbox aria-label="Checked" defaultChecked />
      <Checkbox aria-label="Indeterminate" indeterminate />
      <Checkbox
        aria-label="Focus"
        className="shadow-[var(--effect-focus-ring-primary)]"
      />
      <Checkbox
        aria-label="Focus checked"
        defaultChecked
        className="shadow-[var(--effect-focus-ring-primary)]"
      />
      <Checkbox aria-label="Disabled" disabled />
      <Checkbox aria-label="Disabled checked" disabled defaultChecked />
      <Checkbox aria-label="Invalid" aria-invalid />
      <Checkbox aria-label="Invalid checked" aria-invalid defaultChecked />
    </div>
  );
}

/* ---------- Playground ---------- */

type PlaygroundComposition = 'alone' | 'label' | 'description' | 'group';

const PLAYGROUND_COMPOSITIONS: {
  value: PlaygroundComposition;
  label: string;
}[] = [
  { value: 'alone', label: 'Alone' },
  { value: 'label', label: 'Label' },
  { value: 'description', label: 'Description' },
  { value: 'group', label: 'Group' },
];

function CheckboxPlayground() {
  const [composition, setComposition] =
    useState<PlaygroundComposition>('label');
  const [checkedMode, setCheckedMode] = useState<
    'false' | 'true' | 'indeterminate'
  >('false');
  const [state, setState] = useState<
    'default' | 'focus' | 'disabled' | 'error'
  >('default');

  const indeterminate = checkedMode === 'indeterminate';
  const checked = checkedMode === 'true';
  const disabled = state === 'disabled';
  const invalid = state === 'error';
  const focusClass =
    state === 'focus' ? 'shadow-[var(--effect-focus-ring-primary)]' : undefined;

  const onCheckedChange = (value: boolean) => {
    if (disabled) return;
    setCheckedMode(value ? 'true' : 'false');
  };

  const control = (
    <Checkbox
      id="playground-checkbox"
      checked={checked}
      indeterminate={indeterminate}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      aria-label={composition === 'alone' ? 'Playground checkbox' : undefined}
      className={focusClass}
      onCheckedChange={onCheckedChange}
    />
  );

  let preview: ReactNode;
  if (composition === 'alone') {
    preview = control;
  } else if (composition === 'label') {
    preview = (
      <Field
        orientation="horizontal"
        data-disabled={disabled || undefined}
        data-invalid={invalid || undefined}
        className="w-fit max-w-sm"
      >
        {control}
        <FieldLabel htmlFor="playground-checkbox">
          Accept terms and conditions
        </FieldLabel>
      </Field>
    );
  } else if (composition === 'description') {
    preview = (
      <Field
        orientation="horizontal"
        data-disabled={disabled || undefined}
        data-invalid={invalid || undefined}
        className="w-fit max-w-sm"
      >
        {control}
        <FieldContent>
          <FieldLabel htmlFor="playground-checkbox">
            Accept terms and conditions
          </FieldLabel>
          <FieldDescription>
            By clicking this checkbox, you agree to the terms and conditions.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  } else {
    preview = (
      <FieldSet
        data-disabled={disabled || undefined}
        className="w-fit max-w-sm"
      >
        <FieldLegend variant="label">Show these items on the desktop:</FieldLegend>
        <FieldDescription>
          Select the items you want to show on the desktop.
        </FieldDescription>
        <div data-slot="checkbox-group" className="flex flex-col gap-3">
          {(
            [
              ['pg-hard-disks', 'Hard disks'],
              ['pg-external-disks', 'External disks'],
              ['pg-cds', 'CDs, DVDs, and iPods'],
              ['pg-servers', 'Connected servers'],
            ] as const
          ).map(([id, label], index) => (
            <Field
              key={id}
              orientation="horizontal"
              data-disabled={disabled || undefined}
              data-invalid={invalid || undefined}
            >
              <Checkbox
                id={id}
                defaultChecked={index < 2}
                disabled={disabled}
                aria-invalid={invalid || undefined}
                className={focusClass}
              />
              <FieldLabel htmlFor={id}>{label}</FieldLabel>
            </Field>
          ))}
        </div>
      </FieldSet>
    );
  }

  return (
    <PlaygroundPanel
      preview={preview}
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <div className="col-span-2">
            <InlineSegmentedControl
              label="Composition"
              value={composition}
              onChange={setComposition}
              options={PLAYGROUND_COMPOSITIONS}
              fullWidth
            />
          </div>
          {composition !== 'group' ? (
            <InlineSegmentedControl
              label="Checked?"
              value={checkedMode}
              onChange={setCheckedMode}
              options={[
                { value: 'false', label: 'False' },
                { value: 'true', label: 'True' },
                { value: 'indeterminate', label: 'Indeterminate' },
              ]}
              fullWidth
            />
          ) : null}
          <InlineSegmentedControl
            label="State"
            value={state}
            onChange={setState}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'focus', label: 'Focus' },
              { value: 'disabled', label: 'Disabled' },
              { value: 'error', label: 'Error' },
            ]}
            fullWidth
            className={composition === 'group' ? 'col-span-2' : undefined}
          />
        </div>
      }
    />
  );
}

/* ---------- Stories ---------- */

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Checkbox"
      description={
        <>
          Toggle between checked and not checked. Foundations restyle of the
          shadcn / Base UI checkbox — Figma <code>Checked?</code> and{' '}
          <code>State</code> axes (including indeterminate minus). Pair with
          Field for labeled layouts; see the primitive README for deferred
          partners.
        </>
      }
      playground={<CheckboxPlayground />}
      variants={
        <div className="flex flex-wrap gap-4">
          <PrimitiveGalleryItem label="States">
            <StatesGalleryExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Basic">
            <BasicExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Description">
            <DescriptionExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Disabled">
            <DisabledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Invalid">
            <InvalidExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Group">
            <GroupExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Indeterminate">
            <IndeterminateExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Use <code>defaultChecked</code> for uncontrolled, or{' '}
            <code>checked</code> + <code>onCheckedChange</code> when controlled.
          </li>
          <li>
            Set <code>indeterminate</code> for the Figma minus state (e.g. select
            all with a mixed selection).
          </li>
          <li>
            Pair with Field + FieldLabel; set <code>aria-invalid</code> on the
            checkbox and <code>data-invalid</code> on the Field for errors.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Always provide an accessible name via a linked label or{' '}
            <code>aria-label</code>.
          </li>
          <li>
            Focus uses Foundations secondary focus ring; invalid focus uses the
            error ring.
          </li>
          <li>
            Disabled checkboxes are not focusable; keep Field{' '}
            <code>data-disabled</code> in sync when hosting.
          </li>
        </ul>
      }
    />
  ),
};

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const Description: Story = {
  render: () => <DescriptionExample />,
};

export const Disabled: Story = {
  render: () => <DisabledExample />,
};

export const Invalid: Story = {
  render: () => <InvalidExample />,
};

export const Group: Story = {
  render: () => <GroupExample />,
};

export const Indeterminate: Story = {
  render: () => <IndeterminateExample />,
};

export const RTL: Story = {
  name: 'RTL',
  render: () => <RtlExample />,
};
