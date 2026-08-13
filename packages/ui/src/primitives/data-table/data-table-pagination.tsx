'use client';

import type { ReactTable, RowData } from '@tanstack/react-table';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react';

import { IconButton } from '../button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

import type { DataTableFeatures } from './data-table-features';

interface DataTablePaginationProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

/** Page size, selection count, and page navigation for a data table. */
function DataTablePagination<TData extends RowData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-[var(--spacing-xs)]">
      <div className="flex-1 text-[length:var(--text-paragraph-small-regular-font-size)] leading-[var(--text-paragraph-small-regular-line-height)] text-[color:var(--muted-foreground)]">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center gap-[var(--spacing-xl)]">
        <div className="flex items-center gap-[var(--spacing-xs)]">
          <p className="text-[length:var(--text-paragraph-small-medium-font-size)] leading-[var(--text-paragraph-small-medium-line-height)] [font-weight:var(--font-weight-paragraph-medium)]">
            Rows per page
          </p>
          <Select
            value={`${table.state.pagination.pageSize}`}
            onValueChange={(value) => {
              if (value != null) table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger size="sm">
              <SelectValue placeholder={String(table.state.pagination.pageSize)} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                {[5, 10, 20, 25, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-[length:var(--text-paragraph-small-medium-font-size)] leading-[var(--text-paragraph-small-medium-line-height)] [font-weight:var(--font-weight-paragraph-medium)]">
          Page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center gap-[var(--spacing-xs)]">
          <IconButton
            variant="outline"
            size="sm"
            className="hidden lg:inline-flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to first page"
          >
            <ChevronsLeftIcon />
          </IconButton>
          <IconButton
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Go to next page"
          >
            <ChevronRightIcon />
          </IconButton>
          <IconButton
            variant="outline"
            size="sm"
            className="hidden lg:inline-flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Go to last page"
          >
            <ChevronsRightIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export { DataTablePagination };
export type { DataTablePaginationProps };
