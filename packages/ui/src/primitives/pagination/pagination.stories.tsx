import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';
import { Field, FieldLabel } from '../field';
import {
  NativeSelect,
  NativeSelectOption,
} from '../native-select';
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
 * example pages. No Figma; patterns follow shadcn Pagination docs.
 */

const meta = {
  title: 'Design System/Primitives/Pagination',
  component: Pagination,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------- Canonical examples (shadcn docs) ---------- */

function DemoExample() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function SimpleExample() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">5</PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

/** Prev / next only — pairs with a rows-per-page selector (data tables). */
function IconsOnlyExample() {
  return (
    <div className="flex items-center justify-between gap-[var(--spacing-md)]">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
        {/* NativeSelect: Foundations field chrome. Custom Select is still thin-pass. */}
        <NativeSelect
          id="select-rows-per-page"
          defaultValue="25"
          aria-label="Rows per page"
          className="w-20"
        >
          <NativeSelectOption value="10">10</NativeSelectOption>
          <NativeSelectOption value="25">25</NativeSelectOption>
          <NativeSelectOption value="50">50</NativeSelectOption>
          <NativeSelectOption value="100">100</NativeSelectOption>
        </NativeSelect>
      </Field>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function toArabicNumerals(num: number): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .split('')
    .map((digit) => arabicNumerals[parseInt(digit, 10)])
    .join('');
}

function RtlExample() {
  return (
    <Pagination dir="rtl">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" text="السابق" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">{toArabicNumerals(1)}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {toArabicNumerals(2)}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">{toArabicNumerals(3)}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" text="التالي" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

/* ---------- Playground ---------- */

function PaginationPlayground() {
  const [activePage, setActivePage] = useState(2);
  const [showEllipsis, setShowEllipsis] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const pages = showEllipsis ? [1, 2, 3] : [1, 2, 3, 4, 5];
  const safeActive = pages.includes(activePage) ? activePage : pages[0]!;

  return (
    <PlaygroundPanel
      preview={
        <Pagination>
          <PaginationContent>
            {showLabels ? (
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
            ) : null}
            {pages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === safeActive}
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            {showEllipsis ? (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            ) : null}
            {showLabels ? (
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            ) : null}
          </PaginationContent>
        </Pagination>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Active page"
            value={String(safeActive)}
            options={pages.map((p) => ({ value: String(p), label: String(p) }))}
            onChange={(v) => setActivePage(Number(v))}
            fullWidth
          />
          <InlineSegmentedControl
            label="Ellipsis"
            value={showEllipsis ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setShowEllipsis(v === 'on')}
            fullWidth
          />
          <InlineSegmentedControl
            label="Prev / next"
            value={showLabels ? 'on' : 'off'}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            onChange={(v) => setShowLabels(v === 'on')}
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
      title="Pagination"
      description={
        <>
          Page navigation with previous / next links. No Figma source — Accordion-style
          Foundations restyle of the shadcn Pagination API. Controls use Text Button
          ghost / outline chrome (page digits are square <code>--spacing-9</code>).
        </>
      }
      playground={<PaginationPlayground />}
      variants={
        <div className="flex flex-col gap-6">
          <PrimitiveGalleryItem label="Demo">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Simple">
            <SimpleExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Icons only">
            <IconsOnlyExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="RTL">
            <RtlExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Compose <code>Pagination</code> → <code>PaginationContent</code> →{' '}
            <code>PaginationItem</code> wrapping link / ellipsis / prev / next.
          </li>
          <li>
            Current page: <code>PaginationLink isActive</code> (sets{' '}
            <code>aria-current=&quot;page&quot;</code>).
          </li>
          <li>
            Localized labels: <code>text</code> on <code>PaginationPrevious</code> /{' '}
            <code>PaginationNext</code>.
          </li>
          <li>
            Routing: links render <code>&lt;a&gt;</code>; wrap or replace with your
            router <code>Link</code> when needed (see shadcn Next.js note).
          </li>
          <li>
            Data tables: Icons-only prev/next beside a rows-per-page{' '}
            <code>NativeSelect</code> (Foundations chrome; custom{' '}
            <code>Select</code> is still thin-pass).
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            Root is a <code>nav</code> with <code>aria-label=&quot;pagination&quot;</code>.
          </li>
          <li>
            Prev / next expose <code>aria-label</code> (&quot;Go to previous/next
            page&quot;); visible label text may hide below <code>sm</code>.
          </li>
          <li>
            <code>PaginationEllipsis</code> is <code>aria-hidden</code> with an
            sr-only &quot;More pages&quot; hint.
          </li>
          <li>
            Chevrons flip under <code>dir=&quot;rtl&quot;</code> via{' '}
            <code>rtl:rotate-180</code>.
          </li>
        </ul>
      }
    />
  ),
};

/* ---------- Individual example pages ---------- */

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Simple: Story = {
  render: () => <SimpleExample />,
};

export const IconsOnly: Story = {
  name: 'Icons only',
  render: () => <IconsOnlyExample />,
};

export const RTL: Story = {
  render: () => <RtlExample />,
};
