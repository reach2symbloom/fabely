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
import { CloudUpload, Coins, Image as ImageIcon, Monitor } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { TRANSITION_EMPHASIZED_FAST } from '@/lib/motion';
import type { AudioCaptureError } from '@/hooks/audio-capture-shared';
import type { LiveDictationStatus } from '@/hooks/use-live-dictation';
import { Button, IconButton } from '@/primitives/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/primitives/dropdown-menu';
import { ListItemTrailing } from '@/primitives/list-item';
import { Kbd } from '@/primitives/kbd';
import { Textarea } from '@/primitives/textarea';
import type { AIMode } from '../ai-mode-toggle';
import { AIModeToggle } from '../ai-mode-toggle';

import { PromptbarIcon } from './promptbar-icons';
import type { PromptbarComposerPresentation } from './promptbar-presentation';

/** Figma's control-row buttons (plus/mic/send) are 32×32 — `IconButton`'s
 * own `sm` box AND its default 16px icon both already match exactly
 * (confirmed via `get_variable_defs` on the mic button instance: bound to
 * Figma's `md` spacing variable, 16px — the same value as this codebase's
 * `--icon-sm`, just a different naming scheme between Figma's raw spacing
 * scale and this design system's semantic icon scale). An earlier pass
 * here claimed Figma wanted 20px and force-overrode to `--icon-md` — that
 * was wrong; kept as an explicit class (not simply omitted) only for
 * parity with `PromptbarAudioCard.tsx`'s own same-named constant, not
 * because an override is actually needed. */
const CONTROL_ICON_CLASS = 'size-[length:var(--icon-sm)]';

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
 *    textarea.
 * 3. Placeholder color — the primitive's own default (`placeholder:text-
 *    [color:var(--muted-foreground)]`, alpha-60) is a step darker than
 *    this field's own Figma binding, confirmed via `get_variable_defs`:
 *    `alpha/black/switch/alpha-40` (`--theme-alpha-black-switch-40`), not
 *    the generic muted-foreground token.
 * 4. `pl-[var(--spacing-xs)]` (8px) — lines the placeholder/text up with
 *    the ghost plus button in the control row below, which has that same
 *    8px inset baked into its own hit target; `p-0` alone left the text
 *    flush with the card edge, reading as misaligned against it. */
const TEXTAREA_CLASSNAME = cn(
  'p-0 min-h-0',
  'text-[length:var(--text-paragraph-regular-regular-font-size)]',
  'leading-[var(--text-paragraph-regular-regular-line-height)]',
  'tracking-[var(--text-paragraph-regular-regular-letter-spacing)]',
  'placeholder:text-[color:var(--theme-alpha-black-switch-40)]',
  'pl-[var(--spacing-xs)]'
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
  /** Mode 2 — realtime dictation (separate from the Audio Card recording
   * flow above; see `use-live-dictation.ts`). `onStartDictation` is
   * `undefined` (not just a no-op) whenever the host never supplied
   * `onStartLiveDictation` to `Promptbar` — the mic button then renders as
   * genuinely inert, mirroring how the Audio Card handles a missing
   * `onTranscribeRecording`. */
  dictationStatus?: LiveDictationStatus;
  dictationError?: AudioCaptureError | null;
  onStartDictation?: () => void;
  onStopDictation?: () => void;
  onCancelDictation?: () => void;
  onMute?: () => void;
  onSend?: () => void;
  /** Fires when the attach menu (the `+` trigger) opens — not a single
   * action anymore now that it opens a menu of three (see
   * `onUploadNotes`/`onImportNotesFromApp`/`onAddImage`), kept for hosts
   * that only care that the affordance was engaged. */
  onPlus?: () => void;
  onUploadNotes?: () => void;
  onImportNotesFromApp?: () => void;
  onAddImage?: () => void;
  onTokenCountClick?: () => void;
  className?: string;
};

/** Entry point to buying more credits, not a static readout — styled as a
 * Fade button (Figma Fade button, `12042:25189`: rest alpha-40, hover
 * alpha-100), the same recipe `IconButton`'s own `fade` variant uses.
 * That variant is icon-only, so it can't be reused directly here (this
 * control's content is the number *and* the icon together) — the opacity
 * is applied to the whole button instead of just the glyph, with the
 * content itself at full-strength color, matching how `fade` fades its
 * own icon against a fixed-color face. */
function TokenCountPill({ tokenCount, onClick }: { tokenCount: number; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex shrink-0 cursor-pointer items-center gap-[var(--spacing-1-5)]',
        'rounded-[length:var(--rounded-lg)] px-[var(--spacing-2xs)] py-[var(--spacing-3xs)]',
        'bg-[color:var(--theme-alpha-white-no-switch-001)]',
        'text-[length:var(--text-paragraph-mini-regular-font-size)]',
        'leading-[var(--text-paragraph-mini-regular-line-height)]',
        'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
        'text-[color:var(--theme-alpha-black-switch-100)]',
        'tabular-nums outline-none transition-opacity duration-fast ease-emphasized',
        'opacity-[var(--opacity-fade)]',
        'hover:opacity-100 active:opacity-100 data-[pressed]:opacity-100 focus-visible:opacity-100',
        'focus-visible:shadow-[var(--effect-focus-ring-secondary)]'
      )}
    >
      {tokenCount.toLocaleString()}
      <Coins className="size-[length:var(--icon-xs)]" />
    </button>
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
  dictationStatus = 'idle',
  dictationError,
  onStartDictation,
  onStopDictation,
  onCancelDictation,
  onMute,
  onSend,
  onPlus,
  onUploadNotes,
  onImportNotesFromApp,
  onAddImage,
  onTokenCountClick,
  className,
}: PromptbarComposerProps) {
  /* `Kbd` hides once there's typed content — needs the textarea's current
   * text regardless of controlled/uncontrolled, mirroring `Textarea`'s own
   * isControlled fallback (this component doesn't otherwise track the
   * value itself, since it normally just forwards value/defaultValue
   * straight through). */
  const isValueControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? '');
  const currentValue = isValueControlled ? value : uncontrolledValue;
  const reducedMotion = Boolean(useReducedMotion());

  function handleTextareaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!isValueControlled) setUncontrolledValue(event.target.value);
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
        <AnimatePresence initial={false}>
          {!currentValue ? (
            <motion.span
              key="kbd"
              /* Width (to/from `'auto'`, Motion measures the natural size)
               * animates alongside opacity, not just opacity alone — a
               * pure fade held the hint's full layout footprint right up
               * until unmount, so the space it occupied snapped away
               * instantly at the end instead of closing smoothly. Same
               * timing token as the send icon's crossfade (`TRANSITION_
               * EMPHASIZED_FAST`) so both read as one coordinated state
               * change, not two separately-timed animations. */
              className="shrink-0 overflow-hidden"
              initial={reducedMotion ? false : { opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, width: 0 }}
              transition={reducedMotion ? { duration: 0 } : TRANSITION_EMPHASIZED_FAST}
            >
              <Kbd>⌘V</Kbd>
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex w-full items-center justify-between gap-[var(--spacing-xs)]">
        <div className="flex items-center gap-[var(--spacing-2xs)]">
          {presentation.showPlusButton ? (
            <DropdownMenu onOpenChange={(open) => (open ? onPlus?.() : undefined)}>
              <DropdownMenuTrigger
                render={<IconButton variant="ghost" size="sm" roundness="round" aria-label="Add attachment" />}
              >
                <PromptbarIcon token="plus" className={CONTROL_ICON_CLASS} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" className="w-auto min-w-0">
                <DropdownMenuItem size="lg" onClick={onUploadNotes}>
                  <Monitor />
                  Upload notes
                  <ListItemTrailing className="w-auto shrink-0 gap-[var(--spacing-2xs)] p-0 text-muted-foreground">
                    <span className="text-[length:var(--text-paragraph-mini-regular-font-size)] whitespace-nowrap">
                      .txt, .doc, .pdf
                    </span>
                  </ListItemTrailing>
                </DropdownMenuItem>
                <DropdownMenuItem size="lg" onClick={onImportNotesFromApp}>
                  <CloudUpload />
                  Import notes from app
                </DropdownMenuItem>
                <DropdownMenuItem size="lg" onClick={onAddImage}>
                  <ImageIcon />
                  Add an image
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          {presentation.showAIModeToggle ? (
            <LayoutGroup id={layoutGroupId}>
              <AIModeToggle value={aiMode} onValueChange={onAIModeChange} />
            </LayoutGroup>
          ) : null}
        </div>

        <div className="flex items-center gap-[var(--spacing-xs)]">
          <TokenCountPill tokenCount={tokenCount} onClick={onTokenCountClick} />
          {presentation.showMicButton ? (
            /* Mode 2 — realtime dictation, entirely separate from the
             * primary send/waveform button's Mode 1 (record → Audio Card
             * → transcribe). Never opens the Audio Card. Inert (no
             * `onClick` at all) when the host hasn't supplied
             * `onStartLiveDictation` to `Promptbar` — same "omit the
             * boundary, get inert UI" contract the send button already has
             * for `onTranscribeRecording`. */
            <IconButton
              variant="ghost"
              size="sm"
              roundness="round"
              aria-label={
                dictationStatus === 'listening'
                  ? 'Stop dictation'
                  : dictationStatus === 'error'
                    ? `Dictation error: ${dictationError?.message ?? 'unknown'} — retry`
                    : 'Start dictation'
              }
              onClick={
                onStartDictation
                  ? dictationStatus === 'listening'
                    ? onStopDictation
                    : onStartDictation
                  : undefined
              }
              onKeyDown={(event) => {
                if (event.key === 'Escape' && dictationStatus !== 'idle') onCancelDictation?.();
              }}
              /* `-ml-[6px]` narrows this row's own `gap-xs` (8px) between
               * this button and the token pill before it down to 2px —
               * this instance specifically, not a row-wide gap change, so
               * mic→mute and mic→send stay at the row's normal spacing. */
              className={cn(
                '-ml-[6px]',
                dictationStatus === 'error' && 'text-[color:var(--tw-raw-error-600)]'
              )}
            >
              <span className="relative inline-flex size-[length:var(--icon-sm)] items-center justify-center">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={dictationStatus === 'listening' ? 'stop' : 'mic'}
                    className="absolute inset-0 flex items-center justify-center"
                    initial={reducedMotion ? false : { opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
                    transition={reducedMotion ? { duration: 0 } : TRANSITION_EMPHASIZED_FAST}
                  >
                    <PromptbarIcon
                      token={dictationStatus === 'listening' ? 'square' : 'mic'}
                      className={CONTROL_ICON_CLASS}
                    />
                  </motion.span>
                </AnimatePresence>
              </span>
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
              variant="primary"
              size="sm"
              roundness="default"
              aria-label={currentValue ? 'Send' : 'Start recording'}
              /* Same control, two roles — matches the icon it's already
               * showing (see the crossfade below): waveform + starts a
               * recording when the composer is empty, arrow + sends once
               * there's text. Not `onSend` unconditionally — that was the
               * actual bug (`useAudioRecording` was reachable only via the
               * separate mic button, which visually promised "start
               * recording" but wasn't the button carrying the waveform
               * icon that implies it). */
              onClick={currentValue ? onSend : onStartRecording}
              /* `primary` (not `ghost`) — same fix as the `text-end` variant
               * above, which already gets this right by using `primary`
               * with only its gradient direction overridden. `primary`'s
               * own hover/active feedback is opacity-based
               * (`hover:opacity-[var(--opacity-hover-soft)]`, `shared.ts`),
               * not a text-color swap, so the icon's `text-current` never
               * gets repainted away from `--primary-foreground` on
               * interaction — the bug a `ghost` + manual-gradient
               * composition had (`ghost` repaints text to `--foreground` on
               * hover/active/focus). `bg-clip-padding` also comes for free
               * from `primary` — without it the gradient paints to the
               * border-box edge and seams visibly against the transparent
               * border. */
              /* `shadow-[none]` (bracket syntax), not the bare `shadow-none`
               * keyword utility — confirmed elsewhere in this codebase
               * (`AiModeToggle.tsx`) that `shadow-none` doesn't dedupe
               * against `primary`'s own `shadow-[var(--effect-focus-ring-
               * primary-rest)]`/`focus-visible:shadow-[var(--effect-focus-
               * ring-primary)]` in this project's tailwind-merge config, so
               * the bare keyword would leave both classes in the string
               * with the ring still winning depending on CSS source order.
               * Two overrides, not one: `primary`'s "focus ring" is
               * actually two declarations — an unconditional resting one
               * (the first `shadow-[...]`, applied regardless of real
               * focus — a gradient-border illusion, same pattern as `Tabs`'
               * own `data-active:shadow-[...]` elsewhere in this codebase)
               * plus a real `focus-visible:` one. Killing only the
               * focus-visible half left the resting ring fully visible at
               * all times, not fixing anything. This instance only —
               * `primary`'s own ring stays for every other consumer. */
              className="bg-[image:var(--gradient-primary-left-right)] shadow-[none] focus-visible:shadow-[none]"
            >
              {/* One persistent button shell — only this inner icon
               * crossfades between waveform/send, never the `IconButton`
               * itself (no unmount, so position/size/radius/shadow/
               * background never flash or reset). Both icon states are
               * absolutely stacked on the same center so the outswapping
               * fade/scale never causes any width or position jump; same
               * pattern `AIModeToggle`'s own label crossfade already uses. */}
              <span className="relative inline-flex size-[length:var(--icon-md)] items-center justify-center">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={currentValue ? 'arrow-up' : 'audio-lines'}
                    className="absolute inset-0 flex items-center justify-center"
                    initial={reducedMotion ? false : { opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
                    transition={reducedMotion ? { duration: 0 } : TRANSITION_EMPHASIZED_FAST}
                  >
                    <PromptbarIcon token={currentValue ? 'arrow-up' : 'audio-lines'} className={CONTROL_ICON_CLASS} />
                  </motion.span>
                </AnimatePresence>
              </span>
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
}

export { PromptbarComposer };
