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
 * The grip handle also blooms a soft white radial glow behind its dots on
 * hover (`HANDLE_GLOW`) — restrained, diffuse, no hard edge, and secondary
 * to the dots' own slight alpha-deepen; Motion variant propagation
 * (`whileHover="hover"` on the button, `variants` on the glow span) drives
 * it rather than plain CSS `:hover`, since "very slight scale" needs an
 * actual animated value, not just an opacity transition.
 *
 * Clicking the paragraph text itself fires `onTextClick` — deliberately
 * not gated on `state` here, since this component doesn't track whether
 * it's "the selected one." A caller (Paragraph List) drops selection on
 * this when the clicked block was already selected — the same click that
 * lets you start editing shouldn't also leave the block-level `selected`
 * chrome showing.
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
import { motion, useReducedMotion } from 'motion/react';

import { TRANSITION_EMPHASIZED_FAST } from '@/lib/motion';
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
  /** Fires on clicking the paragraph text itself — not gated on `state`,
   * since this component doesn't know if it's "the selected one." A
   * caller typically drops selection here when this block was the
   * selected one (clicking into text to edit it isn't "still selected as
   * a block"), and ignores it otherwise. */
  onTextClick?: () => void;
  /** Fires with the edited text once editing the paragraph blurs. The
   * text is natively editable in place (`contentEditable`) — this
   * component doesn't own the text's source of truth any more than it
   * owns `state`; a caller writes the result back into `children` for the
   * next render. Omit to render read-only, plain text. */
  onTextChange?: (text: string) => void;
  /** Fires when `Enter` (not `Shift+Enter`, which inserts a normal soft
   * line break instead — not intercepted at all) is pressed while editing
   * the text, with the caret's plain-text offset at that moment. This
   * component only reports *where* the split happened, same as it only
   * ever reports raw interaction elsewhere — a caller (Paragraph List)
   * owns deciding what a split means for the array: which text stays,
   * which moves to a new block, and that new block's id. Only relevant
   * alongside `onTextChange` (read-only text isn't focusable to receive
   * it). The default newline is prevented either way. */
  onEnter?: (caretOffset: number) => void;
  /** Fires when `Backspace` is pressed with the caret collapsed at offset
   * `0` — never for a non-empty selection starting at `0`, which deletes
   * that selection instead, browser-default. Same "report where, caller
   * decides what" shape as `onEnter`: this component doesn't know whether
   * there's a previous block to merge into, only that the caret is at its
   * own start. The default backspace is prevented only when this fires
   * (`onBackspaceAtStart` returning without doing anything, e.g. because
   * this is the first block, is on the caller — see Paragraph List). */
  onBackspaceAtStart?: () => void;
  /** Focuses the paragraph text and places the caret at `autoFocusOffset`
   * (default the very start) — fires whenever `autoFocus`/`autoFocusOffset`
   * *change* to a new request, not just on mount, since a caller (Paragraph
   * List) sometimes needs to refocus a block that was already mounted
   * (e.g. the previous block after a Backspace-merge), not only a
   * freshly-inserted one. Doesn't repeatedly steal focus on unrelated
   * re-renders — only an actual new request (a changed value) re-fires it. */
  autoFocus?: boolean;
  autoFocusOffset?: number;
  /** Purely presentational vertical nudge (px, `0` default) on an inner
   * wrapper around the handle + text — never on the root this component
   * forwards `ref` to. A caller (Paragraph List) uses this to visually
   * separate a block from an active `DropTarget` divider adjacent to it
   * without moving this block's own measured rect, which drag targeting
   * reads directly off the root. See that caller for why. */
  contentOffsetY?: number;
};

/** Movement past this distance (px) turns a press into a drag rather than a
 * click. */
const DRAG_THRESHOLD_PX = 8;

/** Faint white bioluminescence behind the grip dots on hover — an
 * `ellipse` gradient (not `circle`, which would force a round shape
 * regardless of its box's own proportions) on a box shaped like the
 * dots' own 2×3 cluster — narrower than tall — so the glow reads as
 * coming from the dots themselves, not a spotlight placed behind an
 * unrelated round shape. Peaks at a modest 22% opacity (well short of a
 * "lit disc") and fades across several intermediate stops so the falloff
 * itself does most of the work, with no point along it that reads as a
 * hard edge. Deliberately not a Foundations token: same "invariant visual
 * treatment" precedent as the Foundations glows and Drop Target's chevron
 * glow — a literal value, not one derived from the current theme, since
 * the point is a fixed warm catch-light regardless of light/dark mode. */
const HANDLE_GLOW = [
  'radial-gradient(ellipse,',
  'rgba(255,255,255,0.22) 0%,',
  'rgba(255,255,255,0.1) 40%,',
  'rgba(255,255,255,0.03) 70%,',
  'rgba(255,255,255,0) 100%)',
].join(' ');

/** Caret position as a plain-text character offset into `root` — the
 * standard "clone a range from the start of the element to the caret,
 * measure its stringified length" trick, which works regardless of how
 * many text nodes the caret's container is split across. Only ever
 * called on a plain-text `contentEditable` (no nested elements here), so
 * there's no risk of counting a non-text node's own markup as text. */
function getCaretOffset(root: HTMLElement): number {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return 0;
  const liveRange = selection.getRangeAt(0);
  const preCaretRange = document.createRange();
  preCaretRange.selectNodeContents(root);
  preCaretRange.setEnd(liveRange.endContainer, liveRange.endOffset);
  return preCaretRange.toString().length;
}

/** Inverse of `getCaretOffset` — places a collapsed caret at a plain-text
 * character offset into `root`. Only ever called on a plain-text
 * `contentEditable` (a single text node, or none at all when empty), so
 * there's no multi-node offset math to do: clamp into that one text node,
 * or just focus the (empty) root itself if there isn't one. */
function setCaretOffset(root: HTMLElement, offset: number) {
  const range = document.createRange();
  const textNode = root.firstChild;
  if (textNode?.nodeType === Node.TEXT_NODE) {
    const clamped = Math.max(0, Math.min(offset, textNode.textContent?.length ?? 0));
    range.setStart(textNode, clamped);
  } else {
    range.selectNodeContents(root);
  }
  range.collapse(true);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

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
      // A click/drag leaves the handle holding DOM focus (clicking a
      // button focuses it in most browsers) — previously blurred here to
      // avoid a stray `:focus-visible` ring flashing on the next
      // unrelated keydown. Removed: a selected row now needs to *keep*
      // focus for ArrowUp/ArrowDown reordering (Paragraph List's
      // `onKeyDown`) to reach this button at all. The ring itself is
      // still suppressed for this pointer-driven focus, just not by
      // blurring — see `pointerFocusRef`/`showFocusRing` below.
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
      onTextClick,
      onTextChange,
      onEnter,
      onBackspaceAtStart,
      autoFocus,
      autoFocusOffset = 0,
      contentOffsetY = 0,
      className,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const forceHandleVisible = state !== 'default';
    const textRef = React.useRef<HTMLParagraphElement>(null);

    React.useEffect(() => {
      if (!autoFocus) return;
      const node = textRef.current;
      if (!node) return;
      node.focus();
      setCaretOffset(node, autoFocusOffset);
      // Deliberately depends on the request, not `[]` — this needs to
      // re-fire for an *already-mounted* block (the previous block after
      // a Backspace-merge is never freshly mounted the way a
      // just-inserted block is), not just once at mount. It still won't
      // fire on an unrelated re-render, since `autoFocus`/`autoFocusOffset`
      // only change value when a caller makes an actual new request.
    }, [autoFocus, autoFocusOffset]);
    const detectPress = useHandlePressDetection(onDragStart, onSelect);
    const {
      onPointerDown: handlePointerDown,
      onFocus: handleFocus,
      onBlur: handleBlur,
      ...restHandleProps
    } = handleProps ?? {};

    // A mouse click legitimately focuses the handle (needed for
    // ArrowUp/ArrowDown reordering to reach it at all — see "Press vs.
    // drag" in the README), but shouldn't *show* a focus ring: the
    // block's own `selected` chrome already says "this one's active."
    // `:focus-visible` alone can't tell "pointer-focused, then an arrow
    // key made the browser reconsider" apart from "genuinely Tab-focused"
    // — both end up `:focus-visible`. Track it explicitly instead:
    // `pointerFocusRef` is set the instant a pointer press starts (before
    // the resulting native focus fires), so `onFocus` can tell which kind
    // of focus this is and only show the ring for the real keyboard case.
    const pointerFocusRef = React.useRef(false);
    const [showFocusRing, setShowFocusRing] = React.useState(false);
    // Suppresses *both* the handle's `group-hover` and `group-focus-within`
    // visibility triggers while the paragraph text itself holds focus
    // (typing). `focus-within` alone can't distinguish "the text is
    // focused" from "the handle itself is Tab-focused" — and the handle
    // does still need to stay visible for the latter (keyboard users
    // tabbing to it shouldn't land on an invisible button) — so this only
    // ever suppresses the rule, on the one element it shouldn't apply to.
    // Hover needs suppressing too, not just focus-within: clicking into
    // the text leaves the pointer sitting right where it clicked, so
    // `:hover` alone would keep the handle visible until the pointer
    // physically moved away — a lingering, distracting handle right after
    // the click that actually focused the text, not a stale hover from
    // before it.
    const [isTextFocused, setIsTextFocused] = React.useState(false);

    // Reduced motion keeps the glow (it's not a bounce or a translation,
    // just a fade) but drops the "very slight scale" — scale is the part
    // that reads as movement.
    const prefersReducedMotion = useReducedMotion();
    const glowVariants = {
      rest: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.85 },
      hover: { opacity: 1, scale: 1 },
    };

    return (
      <div
        ref={ref}
        data-slot="paragraph-block"
        data-state={state}
        style={style}
        className={cn(
          // `group/paragraph-block` lives here, not on the inner
          // transform wrapper below — the handle's hover reveal
          // (`group-hover/paragraph-block`) needs to cover this root's
          // own `p-sm` padding too (the gutter between the card's border
          // and the handle/text), which is outside the inner wrapper's
          // own box. Purely a CSS hover-scope marker; doesn't interact
          // with `contentOffsetY`'s transform, which stays on the inner
          // wrapper for its own, separate reason (see that prop's doc
          // comment).
          'group/paragraph-block border border-solid p-[length:var(--spacing-sm)]',
          'transition-[border-color,border-radius,background-color,box-shadow] duration-fast ease-emphasized',
          CONTAINER_STATE_STYLES[state],
          className,
        )}
        {...props}
      >
        {/* Presentational only — `contentOffsetY` nudges handle + text as
            a unit, never the root above (what drag targeting measures).
            See the prop's own doc comment. */}
        <motion.div
          className="flex w-full items-start gap-[length:var(--spacing-sm)]"
          animate={{ y: contentOffsetY }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {/* Expanded hover/click target, reaching into the root's own
              padding on three sides (negative margin) while an equal
              padding keeps the button's own rendered position unchanged
              — same "bigger hit zone, same visuals" technique as the
              root's `group/paragraph-block` extension, just narrower in
              scope. `group/handle` is deliberately separate from
              `group/paragraph-block`: hovering here should reveal the
              handle even while `isTextFocused` (typing) suppresses the
              whole-card hover/focus-within triggers below — moving the
              pointer specifically toward the handle reads as intent to
              grab the block, not the ambient "mouse happens to be
              somewhere on the card" that made the whole-card trigger
              distracting mid-edit. Not extended rightward — that's the
              text's own space, gap-sm already separates them. */}
          <div className="group/handle -mt-[length:var(--spacing-sm)] -mb-[length:var(--spacing-sm)] -ml-[length:var(--spacing-sm)] shrink-0 pt-[length:var(--spacing-sm)] pb-[length:var(--spacing-sm)] pl-[length:var(--spacing-sm)]">
            <motion.button
              type="button"
              aria-label="Drag to reorder paragraph"
              initial="rest"
              whileHover="hover"
              className={cn(
                // Anchored to the first line's own line-height geometry, not a
                // hand-tuned constant: `(line-height - icon size) / 2` is the
                // offset that centers a --icon-lg glyph against a line box of
                // --text-paragraph-serif-regular-line-height — so this stays
                // correct if either token changes, and holds regardless of how
                // many lines follow (only the *first* line's own box matters).
                // +1px on top is a deliberate optical nudge past that exact
                // math, not a rounding fix.
                'relative flex shrink-0 cursor-grab items-center justify-center',
                'pt-[calc((var(--text-paragraph-serif-regular-line-height)-var(--icon-lg))/2+1px)]',
                // `-20`, not `--muted-foreground` (`-60`) — fainter at rest
                // than the rest of the app's muted text, since this icon
                // only exists to hint "draggable" once the row's already
                // hovered; it doesn't need to compete with actual content.
                'text-[color:var(--theme-alpha-black-switch-20)] opacity-0',
                'rounded-[length:var(--rounded-xs)] outline-none',
                'transition-[opacity,color,box-shadow] duration-fast ease-emphasized',
                'active:cursor-grabbing',
                // Same switch-token family as the rest color above, two
                // alpha stops up — deepens (more black) in light mode,
                // lightens (more white) in dark mode, automatically, since
                // it's the theme flip already baked into the token, not two
                // separate color values to keep in sync. Secondary to the
                // glow below — a slight brighten, not the main hover cue.
                'hover:text-[color:var(--theme-alpha-black-switch-80)]',
                showFocusRing && 'shadow-[var(--effect-focus-ring-secondary)]',
                !isTextFocused &&
                  'group-hover/paragraph-block:opacity-100 group-focus-within/paragraph-block:opacity-100',
                // Never gated on `isTextFocused` — see `group/handle`'s own
                // comment above for why hovering specifically toward the
                // handle should still reveal it even mid-edit.
                'group-hover/handle:opacity-100',
                forceHandleVisible && 'opacity-100',
              )}
              onPointerDown={(event) => {
                pointerFocusRef.current = true;
                handlePointerDown?.(event);
                detectPress(event);
              }}
              onFocus={(event) => {
                if (pointerFocusRef.current) {
                  pointerFocusRef.current = false;
                } else {
                  setShowFocusRing(true);
                }
                handleFocus?.(event);
              }}
              onBlur={(event) => {
                setShowFocusRing(false);
                handleBlur?.(event);
              }}
              {...(restHandleProps as React.ComponentProps<typeof motion.button>)}
            >
              {/* Tightly bounds just the dots (exactly `--icon-lg`), independent
                  of the button's own `pt-xs` padding — the glow below centers
                  on *this* box, not the button's, so padding can't throw its
                  alignment off. */}
              <span className="relative inline-flex size-[length:var(--icon-lg)] items-center justify-center">
                <motion.span
                  aria-hidden
                  variants={glowVariants}
                  transition={TRANSITION_EMPHASIZED_FAST}
                  // 14×22 — narrower than tall, matching the dots' own 2×3
                  // cluster (roughly 10×18 within the 24×24 icon, per its
                  // `inset-[12.5%_29.17%]` dot layout), not the icon's own
                  // square footprint.
                  className="pointer-events-none absolute top-1/2 left-1/2 h-[22px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ background: HANDLE_GLOW }}
                />
                <GripVerticalIcon className="relative size-[length:var(--icon-lg)]" />
              </span>
            </motion.button>
          </div>
          <p
            ref={textRef}
            contentEditable={onTextChange !== undefined}
            suppressContentEditableWarning
            onClick={onTextClick}
            onFocus={() => setIsTextFocused(true)}
            onBlur={(event) => {
              setIsTextFocused(false);
              onTextChange?.(event.currentTarget.textContent ?? '');
            }}
            onKeyDown={
              (onEnter || onBackspaceAtStart) &&
              ((event) => {
                // Shift+Enter isn't handled at all — falls through to the
                // browser's own contentEditable behavior, which inserts a
                // soft line break in place. Only plain Enter splits.
                if (onEnter && event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  onEnter(getCaretOffset(event.currentTarget));
                  return;
                }
                // Only a *collapsed* caret genuinely at offset 0 — a real
                // selection starting at 0 should delete that selection first,
                // the browser's own default, not merge into the previous
                // block.
                if (
                  onBackspaceAtStart &&
                  event.key === 'Backspace' &&
                  window.getSelection()?.isCollapsed &&
                  getCaretOffset(event.currentTarget) === 0
                ) {
                  event.preventDefault();
                  onBackspaceAtStart();
                }
              })
            }
            className={cn(
              'min-w-px flex-1 [word-break:break-word] outline-none',
              TEXT_STYLE,
            )}
          >
            {children}
          </p>
        </motion.div>
      </div>
    );
  },
);
ParagraphBlock.displayName = 'ParagraphBlock';
