/**
 * Fabely Data Table — TanStack Table v9 composition helpers on top of Table.
 *
 * Not a registry component: shadcn ships a guide, not a single `data-table`
 * package. Import these helpers (and compose columns yourself) rather than
 * inventing a one-size-fits-all grid. Table chrome stays on the Table
 * primitive (still thin-pass); partners use Foundations-matched primitives
 * where available.
 *
 * Guide: https://ui.shadcn.com/docs/components/base/data-table
 */

'use client';

import * as React from 'react';
import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';

import { cn } from '@/lib/utils';
import { Input } from '../input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';

import {
  dataTableFeatures,
  type DataTableFeatures,
} from './data-table-features';
import { DataTablePagination } from './data-table-pagination';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  /** Column id used by the filter input. Omit to hide the filter. */
  filterColumnId?: string;
  filterPlaceholder?: string;
  showViewOptions?: boolean;
  showPagination?: boolean;
  /** Initial page size (TanStack default is 10). */
  pageSize?: number;
  className?: string;
}

function DataTable<TData extends RowData>({
  columns,
  data,
  filterColumnId,
  filterPlaceholder = 'Filter…',
  showViewOptions = true,
  showPagination = true,
  pageSize = 10,
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: { pageIndex: 0, pageSize },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const showToolbar = Boolean(filterColumnId) || showViewOptions;

  return (
    <div className={cn('flex flex-col gap-[var(--spacing-md)]', className)}>
      {showToolbar ? (
        <div className="flex items-center gap-[var(--spacing-xs)]">
          {filterColumnId ? (
            <Input
              placeholder={filterPlaceholder}
              value={
                (table.getColumn(filterColumnId)?.getFilterValue() as string) ??
                ''
              }
              onChange={(event) =>
                table
                  .getColumn(filterColumnId)
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          ) : null}
          {showViewOptions ? <DataTableViewOptions table={table} /> : null}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[length:var(--rounded-md)] border border-[color:var(--border)]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const canSelect = row.getCanSelect();
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                    className={cn(
                      'hover:bg-[var(--theme-alpha-black-switch-333)] data-[state=selected]:bg-[var(--theme-alpha-black-switch-5)]',
                      canSelect && 'cursor-pointer',
                    )}
                    onClick={(event) => {
                      if (!canSelect) return;
                      /*
                       * Row click toggles selection. Ignore clicks that hit
                       * secondary controls (checkbox, ⋮ menu, links, etc.) so
                       * those require a direct activation.
                       */
                      const target = event.target as HTMLElement;
                      if (
                        target.closest(
                          'button, a, input, label, textarea, select, [role="checkbox"], [role="menuitem"], [data-slot="checkbox"], [data-slot="dropdown-menu-trigger"]',
                        )
                      ) {
                        return;
                      }
                      row.toggleSelected();
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-[var(--spacing-3xl)] text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination ? <DataTablePagination table={table} /> : null}
    </div>
  );
}

export { DataTable };
export type { DataTableProps };
