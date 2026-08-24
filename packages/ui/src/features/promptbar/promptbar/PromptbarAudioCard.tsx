/**
 * Promptbar — the Audio (recording) card. Replaces the shelf + composer
 * entirely while recording (Figma has no shelf, no textarea, no `AIModeToggle`
 * in this mode) — a single row: plus button, a decorative static waveform,
 * cancel (×) and confirm (✓).
 *
 * The waveform is a static bar pattern, not real audio-level data (confirmed
 * against Figma — it doesn't animate or respond to input there either); a
 * host app wiring up real capture can swap in live levels later without
 * this component's own shape changing.
 */
'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { IconButton } from '@/primitives/button';

import { PromptbarIcon } from './promptbar-icons';

const CONTROL_ICON_CLASS = 'size-[length:var(--icon-lg)]';

/** Deterministic, not `Math.random()` — same output every render (no
 * hydration mismatch) and no re-render churn from re-rolling on every
 * paint. Purely decorative bar heights, 8–88px, loosely wave-shaped. */
const WAVEFORM_BAR_COUNT = 90;
const WAVEFORM_HEIGHTS = Array.from({ length: WAVEFORM_BAR_COUNT }, (_, index) => {
  const wave = Math.sin(index * 0.45) * 0.5 + Math.sin(index * 1.7) * 0.3 + Math.sin(index * 0.15) * 0.2;
  const normalized = (wave + 1) / 2; // 0..1
  return Math.round(8 + normalized * 80); // 8..88
});

function Waveform() {
  return (
    <div
      aria-hidden
      className="flex h-[48px] flex-1 items-center gap-px overflow-clip px-[var(--spacing-1-75)]"
    >
      {WAVEFORM_HEIGHTS.map((height, index) => (
        <span
          // eslint-disable-next-line react/no-array-index-key -- static decorative array, no identity beyond position
          key={index}
          className="w-[3px] shrink-0 rounded-full bg-[color:var(--theme-alpha-black-switch-15)]"
          style={{ height }}
        />
      ))}
    </div>
  );
}

export type PromptbarAudioCardProps = {
  onPlus?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  className?: string;
};

function PromptbarAudioCard({
  onPlus,
  onCancel,
  onConfirm,
  cancelLabel = 'Cancel recording',
  confirmLabel = 'Confirm recording',
  className,
}: PromptbarAudioCardProps) {
  return (
    <div
      data-slot="promptbar-audio-card"
      className={cn(
        'flex h-[72px] w-full items-center justify-between gap-[var(--spacing-sm)]',
        'bg-[color:var(--neutrals-new-150)]',
        'border border-[color:var(--border)]',
        'rounded-[length:var(--rounded-xl)]',
        'shadow-[var(--shadow-xl-black)]',
        'pl-[var(--spacing-sm)] pr-[var(--spacing-md)] py-[var(--spacing-sm)]',
        className
      )}
    >
      <IconButton variant="ghost" size="default" roundness="round" aria-label="Add attachment" onClick={onPlus}>
        <PromptbarIcon token="plus" className={CONTROL_ICON_CLASS} />
      </IconButton>

      <Waveform />

      <div className="flex shrink-0 items-center gap-[var(--spacing-xs)]">
        <IconButton variant="ghost" size="default" roundness="round" aria-label={cancelLabel} onClick={onCancel}>
          <PromptbarIcon token="x" className={CONTROL_ICON_CLASS} />
        </IconButton>
        <IconButton variant="ghost" size="default" roundness="round" aria-label={confirmLabel} onClick={onConfirm}>
          <PromptbarIcon token="check" className={CONTROL_ICON_CLASS} />
        </IconButton>
      </div>
    </div>
  );
}

export { PromptbarAudioCard };
