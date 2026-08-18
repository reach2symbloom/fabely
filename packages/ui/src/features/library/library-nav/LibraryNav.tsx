/**
 * Library Nav — stacked book list with one active manuscript.
 *
 * Figma set: Library nav organism (`16431:13709`). Book=1 / 2 / 3 are
 * selected-index states of the same three-row list, not structural
 * variants. Each row is a Library List Item; this organism adds the
 * left rail (faint secondary-ghost track + primary-gradient accent on
 * the active row) and the uniform "Resume writing" label.
 *
 * Placement: NO — Library product chrome. Stays in
 * `src/features/library/library-nav/`.
 */
'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  LibraryListItem,
  type LibraryListItemCategoryVariant,
  type LibraryListItemProps,
  type LibraryListItemVariant,
} from '../library-list-item';

export type LibraryNavBook = {
  id: string;
  title: string;
  variant?: LibraryListItemVariant;
  category?: string;
  categoryVariant?: LibraryListItemCategoryVariant;
  seriesLabel?: LibraryListItemProps['seriesLabel'];
  timestampLabel?: string;
  chapterCount?: number;
  noteCount?: number;
  wordCount?: string;
  href?: string;
  showMenuButton?: boolean;
  onMenuClick?: LibraryListItemProps['onMenuClick'];
};

export type LibraryNavProps = {
  books: LibraryNavBook[];
  /** Currently open manuscript. Omit with `defaultActiveId` for uncontrolled. */
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  /**
   * Active-row link label. Library Nav Figma reads "Resume writing" on
   * every selected book; List Item defaults to Continue/Start writing.
   */
  linkLabel?: string;
  className?: string;
};

/**
 * Figma pins the rail 11px left of the 350px column: `--spacing-md` (16)
 * minus `--stroke-thick` (4) minus `--stroke-hairline` (0.5), rounded to
 * 11. Not a spacing token — documented exception.
 */
const RAIL_OFFSET = '-left-[11px]';

const RAIL_GEOMETRY = cn(
  'pointer-events-none absolute inset-y-0 w-[length:var(--stroke-thick)]',
  'rounded-[length:var(--stroke-hairline)]',
  RAIL_OFFSET,
);

function LibraryNav({
  books,
  activeId: activeIdProp,
  defaultActiveId,
  onActiveChange,
  linkLabel = 'Resume writing',
  className,
}: LibraryNavProps) {
  const isControlled = activeIdProp !== undefined;
  const [uncontrolledId, setUncontrolledId] = React.useState(
    defaultActiveId ?? books[0]?.id,
  );
  const activeId = isControlled ? activeIdProp : uncontrolledId;

  const select = React.useCallback(
    (id: string) => {
      if (!isControlled) setUncontrolledId(id);
      onActiveChange?.(id);
    },
    [isControlled, onActiveChange],
  );

  return (
    <nav
      aria-label="Library"
      data-slot="library-nav"
      className={cn('relative flex w-full max-w-[350px] flex-col', className)}
    >
      <span
        aria-hidden
        data-slot="library-nav-rail-track"
        className={cn(
          RAIL_GEOMETRY,
          'bg-[color-mix(in_srgb,var(--tw-raw-secondary-ghost)_12%,transparent)]',
        )}
      />
      <ul className="m-0 flex list-none flex-col p-0">
        {books.map((book) => {
          const active = book.id === activeId;
          return (
            <li key={book.id} className="relative">
              {active ? (
                <span
                  aria-hidden
                  data-slot="library-nav-rail-accent"
                  className={RAIL_GEOMETRY}
                  style={{ background: 'var(--gradient-primary-top-bottom)' }}
                />
              ) : null}
              <div
                onClick={() => select(book.id)}
                onKeyDown={(event) => {
                  if (book.href != null) return;
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    select(book.id);
                  }
                }}
              >
                <LibraryListItem
                  variant={book.variant}
                  active={active}
                  title={book.title}
                  category={book.category}
                  categoryVariant={book.categoryVariant}
                  seriesLabel={book.seriesLabel}
                  timestampLabel={book.timestampLabel}
                  chapterCount={book.chapterCount}
                  noteCount={book.noteCount}
                  wordCount={book.wordCount}
                  href={book.href}
                  linkLabel={linkLabel}
                  showMenuButton={book.showMenuButton}
                  onMenuClick={book.onMenuClick}
                  className="max-w-none"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { LibraryNav };
