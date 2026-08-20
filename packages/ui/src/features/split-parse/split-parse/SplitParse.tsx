/**
 * Split & Parse — an inline manuscript-editor row: click to mark a split
 * point ("Parse here"), which flips to a confirmation row ("Note parsed")
 * with an undo trigger. Icon fused to a dashed rule on the left; a second
 * dashed rule fills the right, so the label always reads centered in
 * whatever width the row hugs.
 *
 * Figma's `mode` prop ("Light"/"Dark") isn't app theme — the two variants
 * bind to different *semantic* tokens (`foreground` vs `primary-foreground`,
 * the exact shadcn pairing for "text on the default background" vs "text on
 * a `--primary`-filled background"), not the same token auto-switching. So
 * this is really "what surface is this row placed on," renamed `surface`
 * (`'default' | 'primary'`) to say that directly — e.g. a split marker
 * sitting inside a `--primary`-colored highlight span needs `primary`, not
 * an app dark theme.
 *
 * Visual source: Figma **Split & parse**
 * ([node](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16095-208)
 * `16095:208`).
 */
'use client';

import { CircleCheckIcon, ScissorsIcon, Undo2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { IconButton } from '@/primitives/button/icon-button';

type SplitParseState = 'default' | 'split-created';
type SplitParseSurface = 'default' | 'primary';

/** Figma binds directly to `foreground` (default) / `primary-foreground` (primary) — the shadcn pairing, not a raw or switch token. */
const TEXT_COLOR: Record<SplitParseSurface, string> = {
  default: 'text-[color:var(--foreground)]',
  primary: 'text-[color:var(--primary-foreground)]',
};

/** Figma "Note parsed" pantone — Ginseng on default, a lighter Ginseng tint on primary (see colors.css). */
const PARSED_TEXT_COLOR: Record<SplitParseSurface, string> = {
  default: 'text-[color:var(--tw-raw-pantones-ginseng)]',
  primary: 'text-[color:var(--tw-raw-pantones-ginseng-light)]',
};

const LABEL_TYPE = [
  'shrink-0 whitespace-nowrap text-center',
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-medium)]',
  'text-[length:var(--text-paragraph-mini-medium-font-size)]',
  'leading-[var(--text-paragraph-mini-medium-line-height)]',
  'tracking-[var(--text-paragraph-mini-medium-letter-spacing)]',
].join(' ');

function DashedLine({ surface }: { surface: SplitParseSurface }) {
  return (
    <span
      aria-hidden
      className={cn(
        'h-0 min-w-0 flex-1 border-t border-dashed',
        surface === 'primary'
          ? 'border-[color:color-mix(in_srgb,var(--primary-foreground)_15%,transparent)]'
          : 'border-[color:var(--theme-alpha-black-switch-10)]'
      )}
    />
  );
}

type SplitParseProps = {
  /** `'default'` ("Parse here", clickable) or `'split-created'` ("Note parsed", with an undo trigger). */
  state?: SplitParseState;
  /** Which token pairing this row's text/icons use — see the surface note above. */
  surface?: SplitParseSurface;
  /** Fires when the `default`-state row is clicked. */
  onParse?: () => void;
  /** Fires when the `split-created`-state undo trigger is clicked. */
  onUndo?: () => void;
  className?: string;
};

function SplitParse({
  state = 'default',
  surface = 'default',
  onParse,
  onUndo,
  className,
}: SplitParseProps) {
  const rowClassName = cn(
    'flex w-full items-center gap-[var(--spacing-xs)]',
    'pt-[var(--spacing-2xs)] pb-[var(--spacing-3xs)]',
    className
  );

  if (state === 'split-created') {
    return (
      <div
        data-slot="split-parse"
        data-state="split-created"
        data-surface={surface}
        className={rowClassName}
      >
        <span className="flex min-w-0 flex-1 items-center gap-[var(--spacing-3xs)]">
          <CircleCheckIcon
            aria-hidden
            className={cn('size-[length:var(--icon-md)] shrink-0', PARSED_TEXT_COLOR[surface])}
          />
          <DashedLine surface={surface} />
        </span>
        <span className={cn(LABEL_TYPE, PARSED_TEXT_COLOR[surface])}>Note parsed</span>
        <span className="flex min-w-0 flex-1 items-center gap-[var(--spacing-xs)]">
          <DashedLine surface={surface} />
          <IconButton
            variant="fade"
            size="mini"
            aria-label="Undo split"
            onClick={onUndo}
            className="size-[length:var(--icon-sm)] shrink-0 rounded-[length:var(--rounded-lg)] p-0"
          >
            <Undo2Icon aria-hidden className="size-[length:var(--icon-sm)]" />
          </IconButton>
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onParse}
      data-slot="split-parse"
      data-state="default"
      data-surface={surface}
      className={cn('cursor-pointer', rowClassName)}
    >
      <span className="flex min-w-0 flex-1 items-center gap-[var(--spacing-3xs)]">
        <ScissorsIcon
          aria-hidden
          className={cn('size-[length:var(--icon-md)] shrink-0', TEXT_COLOR[surface])}
        />
        <DashedLine surface={surface} />
      </span>
      <span className={cn(LABEL_TYPE, TEXT_COLOR[surface])}>Parse here</span>
      <DashedLine surface={surface} />
    </button>
  );
}

export { SplitParse, type SplitParseProps, type SplitParseState, type SplitParseSurface };
