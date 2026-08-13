import type { Meta, StoryObj } from '@storybook/react-vite';
import { createColumnHelper } from '@tanstack/react-table';
import { MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '../badge';
import { IconButton } from '../button';
import { Checkbox } from '../checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import { DataTable } from './data-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { type DataTableFeatures } from './data-table-features';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages. shadcn Data Table guide + TanStack Table v9.
 */

const meta = {
  title: 'Design System/Primitives/Data Table',
  component: DataTable,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

const payments: Payment[] = [
  { id: '728ed52f', amount: 100, status: 'pending', email: 'm@example.com' },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  { id: 'a1b2c3d4', amount: 316, status: 'success', email: 'ken99@example.com' },
  { id: 'b2c3d4e5', amount: 242, status: 'success', email: 'Abe45@example.com' },
  {
    id: 'c3d4e5f6',
    amount: 837,
    status: 'processing',
    email: 'Monserrat44@example.com',
  },
  { id: 'd4e5f6a7', amount: 874, status: 'success', email: 'Silas22@example.com' },
  {
    id: 'e5f6a7b8',
    amount: 721,
    status: 'failed',
    email: 'carmella@example.com',
  },
  { id: 'f6a7b8c9', amount: 450, status: 'pending', email: 'noah@example.com' },
  { id: 'a7b8c9d0', amount: 199, status: 'success', email: 'ava@example.com' },
  {
    id: 'b8c9d0e1',
    amount: 620,
    status: 'processing',
    email: 'liam@example.com',
  },
  { id: 'c9d0e1f2', amount: 88, status: 'failed', email: 'mia@example.com' },
  { id: 'd0e1f2a3', amount: 540, status: 'success', email: 'oliver@example.com' },
  { id: 'e1f2a3b4', amount: 305, status: 'pending', email: 'sophia@example.com' },
  {
    id: 'f2a3b4c5',
    amount: 912,
    status: 'processing',
    email: 'james@example.com',
  },
  { id: 'a3b4c5d6', amount: 150, status: 'success', email: 'isabella@example.com' },
];

const columnHelper = createColumnHelper<DataTableFeatures, Payment>();

function statusBadge(status: Payment['status']) {
  switch (status) {
    case 'success':
      return <Badge variant="success">{status}</Badge>;
    case 'failed':
      return <Badge variant="destructive">{status}</Badge>;
    case 'processing':
      return <Badge variant="alert">{status}</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() &&
          !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('status', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => statusBadge(row.getValue('status')),
  }),
  columnHelper.accessor('email', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => row.getValue('email'),
    filterFn: 'includesString',
  }),
  columnHelper.accessor('amount', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" className="justify-end" />
    ),
    cell: ({ row }) => (
      <div className="text-end [font-weight:var(--font-weight-paragraph-medium)]">
        {formatAmount(row.getValue('amount'))}
      </div>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <IconButton variant="ghost" size="sm" aria-label="Open menu" />
            }
          >
            <MoreHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
  }),
]);

const basicColumns = columnHelper.columns([
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('amount', {
    header: () => <div className="text-end">Amount</div>,
    cell: ({ row }) => (
      <div className="text-end [font-weight:var(--font-weight-paragraph-medium)]">
        {formatAmount(row.getValue('amount'))}
      </div>
    ),
  }),
]);

/* ---------- Playground ---------- */

function DataTablePlayground() {
  const [showFilter, setShowFilter] = useState(true);
  const [showViewOptions, setShowViewOptions] = useState(true);
  const [showPagination, setShowPagination] = useState(true);

  return (
    <PlaygroundPanel
      preview={
        <div className="w-full max-w-3xl">
          <DataTable
            columns={columns}
            data={payments.slice(0, 5)}
            pageSize={5}
            filterColumnId={showFilter ? 'email' : undefined}
            filterPlaceholder="Filter emails…"
            showViewOptions={showViewOptions}
            showPagination={showPagination}
          />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Filter"
            value={showFilter ? 'on' : 'off'}
            onChange={(v) => setShowFilter(v === 'on')}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
          />
          <InlineSegmentedControl
            label="View options"
            value={showViewOptions ? 'on' : 'off'}
            onChange={(v) => setShowViewOptions(v === 'on')}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
          />
          <InlineSegmentedControl
            label="Pagination"
            value={showPagination ? 'on' : 'off'}
            onChange={(v) => setShowPagination(v === 'on')}
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
          />
        </div>
      }
    />
  );
}

function CompactTable({
  withSelection = false,
}: {
  withSelection?: boolean;
}) {
  return (
    <DataTable
      columns={withSelection ? columns : basicColumns}
      data={payments.slice(0, 5)}
      filterColumnId={withSelection ? 'email' : undefined}
      showViewOptions={withSelection}
      showPagination={false}
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Data Table"
      description="TanStack Table v9 composition on Table — filter, sort, select, paginate. Guide-style helpers, not a single registry component."
      playground={<DataTablePlayground />}
      variants={
        <div className="flex flex-col gap-[var(--spacing-xl)]">
          <PrimitiveGalleryItem label="Basic">
            <div className="w-full max-w-2xl">
              <CompactTable />
            </div>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Full (selection · filter · actions)">
            <div className="w-full max-w-3xl">
              <CompactTable withSelection />
            </div>
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Define columns with <code>createColumnHelper&lt;DataTableFeatures, T&gt;()</code>{' '}
            and the shared <code>dataTableFeatures</code> bag.
          </li>
          <li>
            Use <code>DataTable</code> when the payments-style shell fits; otherwise
            compose <code>useTable</code> + Table yourself with the same helpers.
          </li>
          <li>
            Pair row selection with Checkbox; row actions with Dropdown Menu /
            Icon Button.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Clicking a row toggles selection; checkboxes and the actions menu
            stop that (direct click only). Selection checkboxes need{' '}
            <code>aria-label</code>s.
          </li>
          <li>
            Row-action Icon Buttons require an <code>aria-label</code> on the
            trigger.
          </li>
          <li>
            Sortable headers are real buttons inside Dropdown Menu triggers —
            keyboard focus follows the menu pattern.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <DataTable
        columns={columns}
        data={payments}
        filterColumnId="email"
        filterPlaceholder="Filter emails…"
      />
    </div>
  ),
};

export const Basic: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <DataTable
        columns={basicColumns}
        data={payments.slice(0, 5)}
        showViewOptions={false}
        showPagination={false}
      />
    </div>
  ),
};

export const Sorting: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <DataTable
        columns={columnHelper.columns([
          columnHelper.accessor('email', {
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Email" />
            ),
          }),
          columnHelper.accessor('amount', {
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Amount" />
            ),
            cell: ({ row }) => formatAmount(row.getValue('amount')),
          }),
        ])}
        data={payments.slice(0, 8)}
        showViewOptions={false}
        showPagination={false}
      />
    </div>
  ),
};

export const Filtering: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <DataTable
        columns={columnHelper.columns([
          columnHelper.accessor('email', {
            header: 'Email',
            filterFn: 'includesString',
          }),
          columnHelper.accessor('status', { header: 'Status' }),
        ])}
        data={payments}
        filterColumnId="email"
        filterPlaceholder="Filter emails…"
        showViewOptions={false}
        showPagination={false}
      />
    </div>
  ),
};

export const Pagination: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <DataTable
        columns={basicColumns}
        data={payments}
        showViewOptions={false}
      />
    </div>
  ),
};

export const RowSelection: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <DataTable
        columns={columns}
        data={payments.slice(0, 8)}
        filterColumnId="email"
        showViewOptions={false}
      />
    </div>
  ),
};

export const Visibility: Story = {
  name: 'Column Visibility',
  render: () => (
    <div className="w-full max-w-3xl">
      <DataTable
        columns={columns}
        data={payments.slice(0, 6)}
        showPagination={false}
      />
    </div>
  ),
};

export const RowActions: Story = {
  render: () => (
    <div className="w-full max-w-3xl">
      <DataTable
        columns={columns}
        data={payments.slice(0, 5)}
        showViewOptions={false}
        showPagination={false}
      />
    </div>
  ),
};

export const RTL: Story = {
  render: () => (
    <div className="w-full max-w-3xl" dir="rtl">
      <DataTable
        columns={columns}
        data={payments.slice(0, 6)}
        filterColumnId="email"
        filterPlaceholder="تصفية البريد…"
      />
    </div>
  ),
};
