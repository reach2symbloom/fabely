/**
 * Paragraph Block — a single manuscript paragraph rendered as a draggable
 * list row: `default` (no chrome, handle hidden), `drag` (lifted — border,
 * card fill, inner shadow), and `selected` (same lifted treatment, in the
 * secondary/lavender border color instead of neutral). The 6-dot grip
 * handle at the left is hidden at rest and reveals on real hover/focus —
 * `drag`/`selected` force it visible instead, since those states aren't
 * necessarily under the pointer (e.g. a keyboard-reordered or
 * programmatically selected block).
 *
 * Presentational only, deliberately: this component owns the four visual
 * states from Figma, not a drag engine. It exposes `handleProps` (spread
 * onto the grip button) and forwards `ref`/`style` so a caller can drop it
 * straight into `@dnd-kit/sortable`'s `useSortable()` — `setNodeRef` on the
 * ref, `transform`/`transition` via `style`, `listeners`/`attributes` via
 * `handleProps` — without this component knowing dnd-kit exists.
 *
 * Figma's card-fill layer (`shadcn/general/background (white)`, `#e7e5e4`
 * fill behind the text in `drag`/`selected`) is applied here as the
 * container's own `background`, not a separate absolute inset div — same
 * visual result, since nothing sits between the border and that fill in
 * Figma's structure, and it lets the inset shadow live on the same element
 * instead of a fourth layer.
 *
 * Radius genuinely changes with state (not just border color) — `default`/
 * `hover` use Figma's own `rounded-lg` (12px), `drag`/`selected` use
 * Figma's own `radius` (16px) — both foundations tokens share Figma's exact
 * names, so no re-derivation was needed.
 *
 * The inset shadow (`0 0 7px rgba(148, 140, 134, 0.3)`) has no foundations
 * token yet (`foundations/shadows/raw` and `/semantic` are still empty
 * scaffolding) — reproduced as Figma's literal value, same as other
 * not-yet-tokenized effects in this codebase.
 *
 * Visual source: Figma **Paragraph block**
 * ([node](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16129-377)
 * `16129:377`).
 */
'use client';

import * as React from 'react';
import { GripVerticalIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export type ParagraphBlockState = 'default' | 'drag' | 'selected';

export type ParagraphBlockProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Visual state. `default` reveals its handle on real hover/focus; `drag`
   * and `selected` force the lifted treatment and handle regardless of the
   * pointer. */
  state?: ParagraphBlockState;
  /** Spread onto the grip handle button — dnd-kit's `listeners` +
   * `attributes` from `useSortable()` go here. */
  handleProps?: React.HTMLAttributes<HTMLButtonElement>;
};

const TEXT_STYLE = [
  'font-[family-name:var(--text-paragraph-serif-regular-font-family)]',
  '[font-weight:var(--text-paragraph-serif-regular-font-weight)]',
  'text-[length:var(--text-paragraph-serif-regular-font-size)]',
  'leading-[var(--text-paragraph-serif-regular-line-height)]',
  'tracking-[var(--text-paragraph-serif-regular-letter-spacing)]',
  'text-[color:var(--theme-alpha-black-switch-75)]',
].join(' ');

const LIFTED_SHADOW = 'shadow-[inset_0px_0px_7px_0px_rgba(148,140,134,0.3)]';

const CONTAINER_STATE_STYLES: Record<ParagraphBlockState, string> = {
  default: 'rounded-[length:var(--rounded-lg)] border-transparent',
  drag: cn(
    'rounded-[length:var(--radius)] border-[color:var(--border)] bg-[color:var(--card)]',
    LIFTED_SHADOW,
  ),
  selected: cn(
    'rounded-[length:var(--radius)] border-[color:var(--tw-raw-secondary-200)] bg-[color:var(--card)]',
    LIFTED_SHADOW,
  ),
};

export const ParagraphBlock = React.forwardRef<HTMLDivElement, ParagraphBlockProps>(
  ({ state = 'default', handleProps, className, children, style, ...props }, ref) => {
    const forceHandleVisible = state !== 'default';

    return (
      <div
        ref={ref}
        data-slot="paragraph-block"
        data-state={state}
        style={style}
        className={cn(
          'group/paragraph-block flex items-start gap-[length:var(--spacing-sm)]',
          'border border-solid p-[length:var(--spacing-sm)]',
          'transition-[border-color,border-radius,background-color,box-shadow] duration-fast ease-emphasized',
          CONTAINER_STATE_STYLES[state],
          className,
        )}
        {...props}
      >
        <button
          type="button"
          aria-label="Drag to reorder paragraph"
          className={cn(
            'flex shrink-0 cursor-grab items-center justify-center pt-[length:var(--spacing-xs)]',
            'text-[color:var(--muted-foreground)] opacity-0',
            'transition-opacity duration-fast ease-emphasized',
            'active:cursor-grabbing',
            'group-hover/paragraph-block:opacity-100 group-focus-within/paragraph-block:opacity-100',
            forceHandleVisible && 'opacity-100',
          )}
          {...handleProps}
        >
          <GripVerticalIcon className="size-[length:var(--icon-lg)]" />
        </button>
        <p className={cn('min-w-px flex-1 [word-break:break-word]', TEXT_STYLE)}>{children}</p>
      </div>
    );
  },
);
ParagraphBlock.displayName = 'ParagraphBlock';
