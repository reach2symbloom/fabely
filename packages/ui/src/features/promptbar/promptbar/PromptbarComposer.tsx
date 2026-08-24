/**
 * Promptbar — the input card below the shelf: an "effectively invisible"
 * `Textarea`, the `⌘V` `Kbd` hint, and the control row (plus / `AIModeToggle`
 * / token-count pill / mic-or-mute / send).
 *
 * Split out of `Promptbar.tsx` so the organism's own top-level layout/
 * motion-identity code stays separate from this row's own composition —
 * see `Promptbar.tsx`'s doc comment.
 */
'use client';

import * as React from 'react';
import { Coins } from 'lucide-react';
import { LayoutGroup } from 'motion/react';

import { cn } from '@/lib/utils';
import { Button, IconButton } from '@/primitives/button';
import { Kbd } from '@/primitives/kbd';
import { Textarea } from '@/primitives/textarea';
import type { AIMode } from '../ai-mode-toggle';
import { AIModeToggle } from '../ai-mode-toggle';

import { PromptbarIcon } from './promptbar-icons';
import type { PromptbarComposerPresentation } from './promptbar-presentation';

/** Figma's control-row buttons (plus/mic/send) are 32×32 — `IconButton`'s
 * `sm` box matches exactly, but its default 16px icon doesn't (Figma wants
 * 20px); override the icon size only, not the box. Same override-via-
 * className pattern already established for `Kbd`/`Status`/`ListItem`'s
 * own type-scale deviations elsewhere in this codebase, chosen over
 * widening `IconButton`'s own size-slot API for two Promptbar-only pixel
 * targets. */
const CONTROL_ICON_CLASS = 'size-[length:var(--icon-md)]';

const CARD_SHELL_CLASSNAME = cn(
  'flex w-full flex-col gap-[var(--spacing-sm)]',
  'bg-[color:var(--neutrals-new-150)]',
  'border border-[color:var(--border)]',
  'rounded-[length:var(--rounded-xl)]',
  // Figma's own literal xl/shadow-1 + xl/shadow-2 — this Foundations token
  // is that exact composite (0 20 25 -5 + 0 8 10 -6, alpha-333), not an
  // approximation reached for because it was close.
  'shadow-[var(--shadow-xl-black)]',
  'pt-[var(--spacing-sm)] pr-[var(--spacing-md)] pb-[var(--spacing-sm)] pl-[var(--spacing-sm)]'
);

/** `Textarea`'s own `variant="invisible"` already strips background/
 * border/focus chrome and (via the base `field-sizing-content` class,
 * unconditional across every variant) already auto-grows with content —
 * nothing to add for either. Two real gaps, both closed via `className`
 * rather than widening the primitive (same reasoning as
 * `CONTROL_ICON_CLASS` above):
 * 1. `roundness="default"` still carries its own padding + a 3-line
 *    `min-h` floor sized for a standalone padded field — wrong for a
 *    placeholder row that starts at one line with padding owned by the
 *    card shell above. `p-0 min-h-0` clears both.
 * 2. `textStyle` only has `body` (paragraph/small, 14/20) and `heading` —
 *    Figma's spec here is paragraph/regular (16/24), a third scale
 *    neither covers. One call site's deviation is a className override,
 *    not a new `textStyle` value — revisit only if a second consumer
 *    elsewhere needs this same 16/24 combination in an invisible
 *    textarea. */
const TEXTAREA_CLASSNAME = cn(
  'p-0 min-h-0',
  'text-[length:var(--text-paragraph-regular-regular-font-size)]',
  'leading-[var(--text-paragraph-regular-regular-line-height)]',
  'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]'
);

export type PromptbarComposerProps = {
  presentation: PromptbarComposerPresentation;
  aiMode: AIMode;
  onAIModeChange?: (mode: AIMode) => void;
  tokenCount: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  maxLength?: number;
  showCharacterCount?: boolean;
  onStartRecording?: () => void;
  onMute?: () => void;
  onSend?: () => void;
  onPlus?: () => void;
  className?: string;
};

function TokenCountPill({ tokenCount }: { tokenCount: number }) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center gap-[var(--spacing-1-5)]',
        'rounded-[length:var(--rounded-lg)] px-[var(--spacing-2xs)] py-[var(--spacing-3xs)]',
        'bg-[color:var(--theme-alpha-white-no-switch-001)]',
        'text-[length:var(--text-paragraph-mini-regular-font-size)]',
        'leading-[var(--text-paragraph-mini-regular-line-height)]',
        'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
        'text-[color:var(--theme-alpha-black-switch-30)]',
        'tabular-nums'
      )}
    >
      {tokenCount.toLocaleString()}
      <Coins className="size-[length:var(--icon-xs)]" />
    </div>
  );
}

function PromptbarComposer({
  presentation,
  aiMode,
  onAIModeChange,
  tokenCount,
  value,
  defaultValue,
  onValueChange,
  maxLength,
  showCharacterCount,
  onStartRecording,
  onMute,
  onSend,
  onPlus,
  className,
}: PromptbarComposerProps) {
  function handleTextareaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    onValueChange?.(event.target.value);
  }

  /* AIModeToggle's active-pill morph uses a fixed, module-level `layoutId`
   * ('ai-mode-toggle-pill') — never namespaced per instance, since nothing
   * before this composed more than one AIModeToggle on a page at once.
   * Multiple simultaneous instances (e.g. this organism's own Storybook
   * Overview page, which renders several Promptbar examples side by side)
   * would otherwise all fight over that one shared layout identity, which
   * is what breaks the pill's morph animation across instances. Wrapping
   * in `LayoutGroup` with a unique per-instance `id` scopes that layoutId
   * locally — a purely additive wrap around the existing component, not a
   * change to AIModeToggle.tsx itself, so its own canonical behavior stays
   * untouched. */
  const layoutGroupId = React.useId();

  return (
    <div data-slot="promptbar-composer" className={cn(CARD_SHELL_CLASSNAME, className)}>
      <div className="flex w-full items-center gap-[var(--spacing-xs)]">
        <Textarea
          variant="invisible"
          roundness="default"
          resizable={false}
          rows={1}
          placeholder={presentation.placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={handleTextareaChange}
          maxLength={maxLength}
          showCharacterCount={showCharacterCount}
          className={TEXTAREA_CLASSNAME}
        />
        <Kbd className="shrink-0">⌘V</Kbd>
      </div>

      <div className="flex w-full items-center justify-between gap-[var(--spacing-xs)]">
        <div className="flex items-center gap-[var(--spacing-xs)]">
          {presentation.showPlusButton ? (
            <IconButton variant="ghost" size="sm" roundness="round" aria-label="Add attachment" onClick={onPlus}>
              <PromptbarIcon token="plus" className={CONTROL_ICON_CLASS} />
            </IconButton>
          ) : null}
          {presentation.showAIModeToggle ? (
            <LayoutGroup id={layoutGroupId}>
              <AIModeToggle value={aiMode} onValueChange={onAIModeChange} />
            </LayoutGroup>
          ) : null}
        </div>

        <div className="flex items-center gap-[var(--spacing-xs)]">
          <TokenCountPill tokenCount={tokenCount} />
          {presentation.showMicButton ? (
            <IconButton variant="ghost" size="sm" roundness="round" aria-label="Start recording" onClick={onStartRecording}>
              <PromptbarIcon token="mic" className={CONTROL_ICON_CLASS} />
            </IconButton>
          ) : null}
          {presentation.showMuteButton ? (
            <IconButton
              variant="ghost"
              size="sm"
              roundness="round"
              aria-label="Mute"
              onClick={onMute}
              className="border border-[color:var(--theme-alpha-black-switch-10)] bg-[color:var(--tw-raw-error-ghost)] text-[color:var(--tw-raw-error-600)]"
            >
              <PromptbarIcon token="mic-off" className={CONTROL_ICON_CLASS} />
            </IconButton>
          ) : null}
          {presentation.sendVariant === 'text-end' ? (
            <Button
              type="button"
              size="mini"
              roundness="default"
              onClick={onSend}
              className="bg-[image:var(--gradient-primary-left-right)] text-[color:var(--primary-foreground)]"
            >
              <PromptbarIcon token="audio-lines" className="size-[length:var(--icon-sm)]" />
              End
            </Button>
          ) : (
            <IconButton
              variant="ghost"
              size="sm"
              roundness="default"
              aria-label="Send"
              onClick={onSend}
              className="bg-[image:var(--gradient-primary-left-right)] text-[color:var(--primary-foreground)]"
            >
              <PromptbarIcon token="audio-lines" className={CONTROL_ICON_CLASS} />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
}

export { PromptbarComposer };
