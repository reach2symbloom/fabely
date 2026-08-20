/**
 * Gather Bookmark Button — a split control (bookmark toggle + menu chevron)
 * for pinning notes/answers into a scene from the Gather panel.
 *
 * Distinct from the [Bookmark Button](../../../atoms/bookmark-button/README.md)
 * atom, which this component reuses internally as its toggle — this one adds
 * the chip housing, a hover-reveal "Add to scene" / "Remove from scene"
 * label (Gather mode only), and a trailing chevron menu trigger.
 *
 * Built on [Button Group](../../../primitives/button-group/README.md) — two
 * genuinely independent joined segments (bookmark, chevron), not one shared
 * div with a whole-row hover wash. That's what makes hovering one segment
 * leave the other alone, and lets the group hug to icon-only width when
 * Roam mode/no label is showing (each segment sizes to its own content;
 * there's no shared container reserving space for the other).
 *
 * The *default* fill, though, lives on the outer `ButtonGroup` itself, not
 * on either segment — each segment only ever adds a hover-triggered
 * *deepening* on top of that shared base. Painting the base fill on each
 * segment independently made the divider between them read as sitting
 * between two separately-colored boxes rather than embedded in one
 * continuous pill.
 *
 * Visual source: Figma **Bookmark Button** (Gather composite)
 * ([Bookmark Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16228-3535)
 * `16228:3535`).
 */
'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

import { BookmarkButton, type BookmarkButtonSize } from '@/atoms/bookmark-button';
import { cn } from '@/lib/utils';
import { ButtonGroup, ButtonGroupSeparator } from '@/primitives/button-group';
import { IconButton } from '@/primitives/button/icon-button';

/** Figma `Icon / chevron-down` (`1463:191`) — exact path, not Lucide's. */
const CHEVRON_DOWN_PATH =
  'M6.14645 0.146447C6.34171 -0.0488155 6.65822 -0.0488155 6.85348 0.146447C7.04874 0.341709 7.04874 0.658216 6.85348 0.853478L3.85348 3.85348C3.65822 4.04874 3.34171 4.04874 3.14645 3.85348L0.146447 0.853478C-0.0488155 0.658216 -0.0488155 0.341709 0.146447 0.146447C0.341709 -0.0488155 0.658216 -0.0488155 0.853478 0.146447L3.49996 2.79293L6.14645 0.146447Z';

function ChevronDownGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 6.99992 3.99992"
      /* Inline style, not a `size-*`/`w-*` class: Icon Button auto-sizes any
       * descendant svg lacking a class matching `size-*` — inline style is
       * the one thing guaranteed to beat that regardless of class content. */
      style={{ width: 7, height: 4 }}
      className={className}
      fill="currentColor"
    >
      <path d={CHEVRON_DOWN_PATH} />
    </svg>
  );
}

type GatherBookmarkButtonMode = 'gather' | 'roam';

type GatherBookmarkButtonProps = {
  /** Bookmarked / pinned-to-scene state (controlled). */
  active?: boolean;
  /** Uncontrolled initial state. */
  defaultActive?: boolean;
  onActiveChange?: (active: boolean) => void;
  /**
   * Figma `mode` — `gather` reveals an "Add to scene" / "Remove from scene"
   * label on hover; `roam` never shows the label but stays visibly housed
   * (`alpha-333`) even at rest.
   */
  mode?: GatherBookmarkButtonMode;
  /** Figma `Show superscript` — badge only renders while active. */
  showSuperscript?: boolean;
  /** Badge content when `showSuperscript` is active. Figma default is "2". */
  superscriptValue?: ReactNode;
  /** Label shown (Gather mode) when active. */
  activeLabel?: string;
  /** Label shown (Gather mode) when inactive. */
  inactiveLabel?: string;
  /** Trailing chevron — opens a menu (scene picker, etc). */
  onMenuClick?: () => void;
  /** Accessible name for the group itself (the two segments have their own). */
  groupLabel?: string;
  /** Glyph size — forwarded to the internal `BookmarkButton`. */
  size?: BookmarkButtonSize;
  className?: string;
  /** Storybook / playground — lock both segments' hover paint without a pointer. */
  forceHover?: boolean;
};

function GatherBookmarkButton({
  active: activeProp,
  defaultActive = false,
  onActiveChange,
  mode = 'gather',
  showSuperscript = false,
  superscriptValue = 2,
  activeLabel = 'Remove from scene',
  inactiveLabel = 'Add to scene',
  onMenuClick,
  groupLabel = 'Bookmark',
  size = 'default',
  className,
  forceHover = false,
}: GatherBookmarkButtonProps) {
  const isControlled = activeProp !== undefined;
  const [uncontrolledActive, setUncontrolledActive] = useState(defaultActive);
  const active = isControlled ? Boolean(activeProp) : uncontrolledActive;

  const handlePressedChange = (next: boolean) => {
    if (!isControlled) {
      setUncontrolledActive(next);
    }
    onActiveChange?.(next);
  };

  /** Figma: once active, or in Roam mode, the group stays visibly housed. */
  const persistentHoused = active || mode === 'roam';
  const label = active ? activeLabel : inactiveLabel;

  /**
   * Rest/default fill lives on the group, painted once. Each segment below
   * only ever adds its OWN hover-triggered deepening on top of that shared
   * base — never a base fill of its own — so the divider between them sits
   * on one continuous background instead of between two separate boxes.
   */
  const groupBg = persistentHoused
    ? 'bg-[var(--theme-alpha-black-switch-333)]'
    : 'bg-transparent';

  /**
   * Independent per-segment hover deepening. `!persistentHoused` only
   * happens in `gather` mode (Roam is always persistently housed): the
   * group is transparent, so a segment's own hover paints the full
   * `alpha-333` itself. Once housed and `active`, there's no further
   * hover change (static). Housed-but-inactive (Roam) deepens the
   * group's `alpha-333` base to `alpha-5` on that segment's own hover.
   */
  const hoverDeepenClasses = !persistentHoused
    ? 'hover:bg-[var(--theme-alpha-black-switch-333)] data-[force-hover=true]:bg-[var(--theme-alpha-black-switch-333)]'
    : active
      ? ''
      : 'hover:bg-[var(--theme-alpha-black-switch-5)] data-[force-hover=true]:bg-[var(--theme-alpha-black-switch-5)]';

  return (
    <ButtonGroup
      aria-label={groupLabel}
      data-slot="gather-bookmark-button"
      className={cn(
        'h-[length:var(--spacing-2xl)] overflow-hidden rounded-[length:var(--rounded-md)]',
        'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
        groupBg,
        /* Figma chip is --rounded-md (8); Button Group's own default end-cap
         * is --rounded-lg (12) — override both end caps to match. */
        '[&>[data-slot]:first-child]:rounded-l-[length:var(--rounded-md)]!',
        '[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-[length:var(--rounded-md)]!',
        className
      )}
    >
      <BookmarkButton
        size={size}
        pressed={isControlled ? activeProp : undefined}
        defaultPressed={isControlled ? undefined : defaultActive}
        onPressedChange={handlePressedChange}
        showSuperscript={showSuperscript}
        superscriptValue={superscriptValue}
        forceHover={forceHover}
        aria-label={label}
        className={cn(
          'group/label h-full p-[length:var(--spacing-2xs)]',
          'transition-[background-color,gap] duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
          mode === 'gather' && 'gap-0 hover:gap-[length:var(--spacing-2xs)]',
          mode === 'gather' && forceHover && 'gap-[length:var(--spacing-2xs)]',
          hoverDeepenClasses
        )}
        trailingContent={
          mode === 'gather' && (
            <span
              className={cn(
                'overflow-hidden whitespace-nowrap',
                'max-w-0 opacity-0',
                'transition-[max-width,opacity] duration-[var(--duration-fast)] ease-[var(--ease-emphasized)]',
                'group-hover/label:max-w-[140px] group-hover/label:opacity-100',
                forceHover && 'max-w-[140px] opacity-100',
                'font-[family-name:var(--text-paragraph-mini-regular-font-family)]',
                '[font-weight:var(--text-paragraph-mini-regular-font-weight)]',
                'text-[length:var(--text-paragraph-mini-regular-font-size)]',
                'leading-[var(--text-paragraph-mini-regular-line-height)]',
                'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
                'text-[color:var(--muted-foreground)]'
              )}
            >
              {label}
            </span>
          )
        }
      />

      {/* Only present once housed — no reserved dead space at rest. Figma
       * measures the line inset 4px from both the top and bottom of the
       * 32px row (`16231:7040`: y=4, height=24). */}
      {persistentHoused && (
        <ButtonGroupSeparator
          className="my-[length:var(--spacing-2xs)]! bg-[var(--theme-alpha-black-switch-5)]!"
        />
      )}

      {/* A real, independent Icon Button — its own hover deepening, entirely
       * unaffected by hovering the bookmark segment. Figma's chevron column
       * is a 24×32 frame (4px horizontal padding, 8px vertical) around a
       * 16px "Fade button" — not Icon Button's own square `sm` (32×32)
       * footprint, so width/height/padding are overridden to match exactly. */}
      <IconButton
        variant="ghost"
        aria-label="More options"
        onClick={onMenuClick}
        data-force-hover={forceHover || undefined}
        className={cn(
          'h-full w-[24px]',
          'px-[length:var(--spacing-2xs)] py-[length:var(--spacing-xs)]',
          /* Same deepening rule as the bookmark segment — independent, own hover. */
          hoverDeepenClasses,
          persistentHoused
            ? 'text-[color:var(--theme-alpha-black-switch-50)]'
            : [
                'text-[color:var(--theme-alpha-black-switch-20)]',
                'hover:text-[color:var(--theme-alpha-black-switch-50)]',
                'data-[force-hover=true]:text-[color:var(--theme-alpha-black-switch-50)]',
              ]
        )}
      >
        <ChevronDownGlyph />
      </IconButton>
    </ButtonGroup>
  );
}

export { GatherBookmarkButton, type GatherBookmarkButtonProps, type GatherBookmarkButtonMode };
