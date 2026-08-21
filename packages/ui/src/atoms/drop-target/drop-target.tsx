/**
 * Drop Target — the glowing insertion-line indicator a drag-reorderable list
 * renders between items to show where a drop would land. Presentation only:
 * a caller (Paragraph List, Chapter Menu's outline drag) owns computing
 * *which* gap is currently active and re-renders this in that gap.
 *
 * Promoted from Chapter Menu's own `DropIndicatorDivider`/`DropIndicatorSlot`
 * (originally `ChapterMenu.stories.tsx`) into a shared atom rather than
 * duplicating it for Paragraph List — both are the same Figma component,
 * **Paragraph drop line** (`Chevron=No, Orientation=H` variant; the
 * `Chevron=Yes` and `Orientation=V` variants aren't used by either caller
 * yet). `SecondaryGlowRail` itself moved here too (was previously defined in
 * `features/chapter-nav/add-section-inline-button/AddSectionInlineButton.tsx`,
 * which now imports it back) — an atom can't reach into a feature for a
 * piece it depends on.
 *
 * `active` toggles a `grid-template-rows` `0fr` → `1fr` tween (not
 * `height`/`max-height`) so the slot can be always-mounted at zero size
 * rather than conditionally rendered — every gap in a list can render one of
 * these permanently, and only the currently-active one visibly opens. No
 * layout jump between "not rendered" and "rendered at 0 height", and no
 * `max-height` guess to pick.
 *
 * No gap-compensation margin is baked in — Chapter Menu's own row gap needed
 * `[margin-block:calc(var(--outline-row-gap,0px)*-0.5)]` to sit flush
 * between rows, but that's specific to how *that* list spaces its rows, not
 * a Drop Target concern. Pass it (or an equivalent) via `className` if a
 * caller's own row gap needs the same treatment.
 *
 * Visual source: Figma **Paragraph drop line**
 * ([node](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16372-4438)
 * `16372:4438`).
 */
import { cn } from '@/lib/utils';

const SECONDARY_GLOW_LINE =
  'linear-gradient(90deg, color-mix(in srgb, var(--tw-raw-secondary-200) 0%, transparent) 0%, var(--tw-raw-secondary-200) 18.931%, var(--tw-raw-secondary-200) 85%, color-mix(in srgb, var(--tw-raw-secondary-200) 0%, transparent) 100%)';

/** The rail itself, with no open/close animation — used standalone by
 * callers that already own their own show/hide (e.g. Add Section Inline
 * Button's own hover chrome), and internally by `DropTarget`. */
export function SecondaryGlowRail({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative flex min-h-0 min-w-0 flex-1 flex-col justify-center self-stretch py-[var(--spacing-xs)]',
        className,
      )}
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[length:var(--stroke-regular)] -translate-y-1/2 blur-[length:var(--spacing-3xs)]"
        style={{ background: SECONDARY_GLOW_LINE }}
      />
      <span
        className="h-[length:var(--stroke-thin)] w-full"
        style={{ background: SECONDARY_GLOW_LINE }}
      />
    </div>
  );
}

export type DropTargetProps = {
  /** Whether this is the live prospective insertion point right now. */
  active?: boolean;
  className?: string;
};

export function DropTarget({ active = false, className }: DropTargetProps) {
  return (
    <div
      aria-hidden={!active}
      data-slot="drop-target"
      data-active={active}
      className={cn(
        'grid transition-[grid-template-rows,opacity] duration-normal ease-emphasized',
        active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        className,
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="pointer-events-none relative z-20 flex min-h-[length:var(--spacing-xl)] items-center">
          <SecondaryGlowRail />
        </div>
      </div>
    </div>
  );
}
