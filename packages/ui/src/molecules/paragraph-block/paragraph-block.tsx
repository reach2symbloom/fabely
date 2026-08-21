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
 * Doesn't own the `state` value itself — same pattern as Split & Parse —
 * but it does own telling the caller *which* state to move to: pressing the
 * grip handle and moving past a small threshold fires `onDragStart`
 * (→ `drag`); releasing fires `onSelect` (→ `selected`) whether that press
 * ever crossed the threshold (a plain click) or not (letting go mid-drag).
 * Both land on `selected` because a release always ends with this block as
 * the active one — the only question is whether the pointer was moving when
 * it happened. The release listener lives on `window`, not the button, so
 * letting go after dragging the pointer away from the handle still fires
 * `onSelect`.
 *
 * Still not a drag engine, though: it doesn't move itself, decide where it
 * sits relative to other blocks, or reorder anything — that's
 * [Paragraph List](../../features/manuscript/paragraph-list/README.md)'s
 * job entirely. It exposes `handleProps` (spread onto the grip button,
 * composed with the internal press handler rather than overwriting it) and
 * forwards `ref`/`style` so a caller can wire in whatever drag adapter it
 * uses — dnd-kit's `useDraggable`/`useDroppable`, `useSortable`, or
 * otherwise — without this component knowing dnd-kit exists. Paragraph
 * List uses `useDraggable`/`useDroppable` (`@dnd-kit/core`), not
 * `useSortable`; see that component's README for why.
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
   * `attributes` from `useSortable()` go here. Composed with, not
   * overwritten by, the internal press-vs-drag handler. */
  handleProps?: React.HTMLAttributes<HTMLButtonElement>;
  /** Fires once a press on the grip handle moves past the drag threshold. */
  onDragStart?: () => void;
  /** Fires on releasing the grip handle — a plain click, or letting go
   * mid-drag. Either way the block should end up `selected`. */
  onSelect?: () => void;
};

/** Movement past this distance (px) turns a press into a drag rather than a
 * click. */
const DRAG_THRESHOLD_PX = 4;

/**
 * Distinguishes a click from a drag on the grip handle by watching pointer
 * movement after `pointerdown`, entirely on `window` (not the button) so a
 * release after the pointer has left the handle — or the block itself —
 * still resolves. Plain closures over local `let`s, not `useState`, since
 * nothing here needs to trigger a re-render; only the `onDragStart`/
 * `onSelect` callbacks it fires do that, in the caller.
 */
function useHandlePressDetection(onDragStart?: () => void, onSelect?: () => void) {
  const callbacksRef = React.useRef({ onDragStart, onSelect });
  callbacksRef.current = { onDragStart, onSelect };

  return React.useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;

    const originX = event.clientX;
    const originY = event.clientY;
    const button = event.currentTarget;
    let dragging = false;

    function handlePointerMove(moveEvent: PointerEvent) {
      if (dragging) return;
      const distance = Math.hypot(moveEvent.clientX - originX, moveEvent.clientY - originY);
      if (distance > DRAG_THRESHOLD_PX) {
        dragging = true;
        callbacksRef.current.onDragStart?.();
      }
    }

    function cleanup() {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', cleanup);
    }

    function handlePointerUp() {
      cleanup();
      callbacksRef.current.onSelect?.();
      // A click/drag leaves the handle holding DOM focus (clicking a button
      // focuses it in most browsers). Once this row sits in a real list,
      // ArrowUp/ArrowDown reorder the selected block — pressing one while
      // the handle still has focus makes the browser reconsider its
      // `:focus-visible` heuristic (pointer-granted focus was invisible;
      // a keydown while still focused flips it visible) and flash a native
      // focus ring for a keypress that has nothing to do with this button.
      // Blurring on release avoids it without touching real Tab-driven
      // keyboard focus, which never reaches this handler at all.
      button.blur();
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', cleanup);
  }, []);
}

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
  (
    {
      state = 'default',
      handleProps,
      onDragStart,
      onSelect,
      className,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const forceHandleVisible = state !== 'default';
    const detectPress = useHandlePressDetection(onDragStart, onSelect);
    const { onPointerDown: handlePointerDown, ...restHandleProps } = handleProps ?? {};

    return (
      <div
        ref={ref}
        data-slot="paragraph-block"
        data-state={state}
        style={style}
        className={cn(
          'group/paragraph-block flex w-full items-start gap-[length:var(--spacing-sm)]',
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
          onPointerDown={(event) => {
            handlePointerDown?.(event);
            detectPress(event);
          }}
          {...restHandleProps}
        >
          <GripVerticalIcon className="size-[length:var(--icon-lg)]" />
        </button>
        <p className={cn('min-w-px flex-1 [word-break:break-word]', TEXT_STYLE)}>{children}</p>
      </div>
    );
  },
);
ParagraphBlock.displayName = 'ParagraphBlock';
