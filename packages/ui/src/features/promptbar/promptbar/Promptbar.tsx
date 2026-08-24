/**
 * Promptbar organism — Figma "Promptbar organism" (`16042:5539`), the
 * largest organism in the design system. Composes existing components
 * (`PromptbarShelf`, `AIModeToggle`, `Kbd`, `IconButton`, `StatusBadge`/
 * `Status`, `Textarea`) rather than recreating any of them — see each
 * child component's own file for what it owns.
 *
 * This file stays a thin skeleton on purpose: it owns only the top-level
 * layout (shelf docked above the composer/Audio card) and the one piece
 * of genuinely organism-level concern — preserving component *identity*
 * across state changes (see the comment on the `PromptbarShelf` render
 * below) so `PromptbarShelf`'s own cascade/hover/chevron animations and
 * `AIModeToggle`'s own `layoutId` pill-morph keep working, rather than
 * getting reset by an accidental remount. Everything else — what the
 * shelf's `statusContent`/`trigger`/`children` actually render
 * (`PromptbarShelfContent.tsx`), what the composer row looks like
 * (`PromptbarComposer.tsx`), what the recording card looks like
 * (`PromptbarAudioCard.tsx`), and what any given `PromptbarState` *means*
 * (`promptbar-presentation.ts`) — lives in its own file. Nowhere in this
 * tree branches on `state.mode.aiMode`/`fiaSubMode` directly except
 * `promptbar-presentation.ts` itself.
 *
 * State ownership: `PromptbarState` (chapter/scene/paragraph, Scene Desk
 * vs. All Notes context, scene-link connection, active workflow, AI mode)
 * is domain state a host app constructs and passes in — see
 * `promptbar-state.ts`. `isRecording`/`open`/the textarea's own `value`
 * are local interaction state, controlled/uncontrolled exactly like
 * `AIModeToggle`'s `value`/`defaultValue`/`onValueChange` and
 * `PromptbarShelf`'s `open`/`defaultOpen`/`onOpenChange` already are.
 * None of this domain/orchestration logic moves into `PromptbarShelf` —
 * it keeps receiving plain `statusContent`/`trigger`/`children` through
 * its existing API and stays responsible only for its own local
 * presentation/interaction behavior, unmodified.
 */
'use client';

import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { TRANSITION_EMPHASIZED_FAST } from '@/lib/motion';
import { useLiveDictation, type LiveDictationAdapter } from '@/hooks/use-live-dictation';
import type { AIMode } from '../ai-mode-toggle';
import { PromptbarShelf } from '../shelf';

import { buildShelfMenuChildren, ShelfStatusRows, ShelfTrigger } from './PromptbarShelfContent';
import { PromptbarComposer } from './PromptbarComposer';
import { PromptbarAudioCard } from './PromptbarAudioCard';
import { derivePromptbarPresentation, type PromptbarActionHandlers } from './promptbar-presentation';
import type { PromptbarState, PromptbarWorkflowKind } from './promptbar-state';

export type PromptbarProps = PromptbarActionHandlers & {
  state: PromptbarState;

  /** Recording (Audio mode) — controlled/uncontrolled, defaults `false`. */
  isRecording?: boolean;
  defaultIsRecording?: boolean;
  onIsRecordingChange?: (recording: boolean) => void;

  /** Shelf open/collapsed — controlled/uncontrolled, defaults `false`.
   * Lifted into the organism (not left fully inside `PromptbarShelf`)
   * specifically so selecting a workflow can programmatically collapse
   * it, the same pattern `PromptbarShelf`'s own Fia-workflows story
   * already establishes for itself. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Textarea value — controlled/uncontrolled, passed straight through. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  maxLength?: number;
  showCharacterCount?: boolean;

  onAIModeChange?: (mode: AIMode) => void;
  onStartRecording?: () => void;
  onCancelRecording?: () => void;
  /** `blob` is `null` if nothing was ever captured; `transcript` is only
   * present when `onTranscribeRecording` succeeded — see
   * `PromptbarAudioCard`'s own `onConfirm`/`onTranscribeRecording` doc
   * comments. Whenever `transcript` is present, the textarea's own value
   * is populated with it before this fires. */
  onConfirmRecording?: (blob: Blob | null, transcript?: string) => void;
  /** The actual speech-to-text call — passed straight through to
   * `PromptbarAudioCard`; this organism makes no network calls of its own.
   * See that component's own doc comment for the full contract. */
  onTranscribeRecording?: (blob: Blob) => Promise<string>;
  /** Realtime dictation boundary for the composer's own mic icon — a
   * genuinely separate flow from `onTranscribeRecording` (see
   * `use-live-dictation.ts`'s own doc comment for why). Omit to leave the
   * mic icon inert, same as omitting `onTranscribeRecording` leaves Audio
   * Card's confirm non-transcribing. */
  onStartLiveDictation?: LiveDictationAdapter;
  onMute?: () => void;
  onSend?: () => void;
  onPlus?: () => void;
  onUploadNotes?: () => void;
  onImportNotesFromApp?: () => void;
  onAddImage?: () => void;
  onTokenCountClick?: () => void;

  className?: string;
};

/** Appends a dictation event's text onto whatever the composer already
 * held before this session/utterance — never replaces it wholesale (see
 * `PromptbarProps`'s own doc comment on why `value` had to be lifted). */
function mergeDictationText(base: string, eventText: string): string {
  if (!eventText) return base;
  if (!base) return eventText;
  return base.endsWith(' ') || base.endsWith('\n') ? base + eventText : `${base} ${eventText}`;
}

function Promptbar({
  state,
  isRecording: isRecordingProp,
  defaultIsRecording = false,
  onIsRecordingChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  value: valueProp,
  defaultValue,
  onValueChange,
  maxLength,
  showCharacterCount,
  onConnectScene,
  onLinkAnotherScene,
  onCreateSceneFromSearch,
  onDisconnectScene,
  onSelectWorkflow,
  onDismissActiveWorkflow,
  onDismissParagraphSelection,
  onAIModeChange,
  onStartRecording,
  onCancelRecording,
  onConfirmRecording,
  onTranscribeRecording,
  onStartLiveDictation,
  onMute,
  onSend,
  onPlus,
  onUploadNotes,
  onImportNotesFromApp,
  onAddImage,
  onTokenCountClick,
  className,
}: PromptbarProps) {
  const isRecordingControlled = isRecordingProp !== undefined;
  const [uncontrolledRecording, setUncontrolledRecording] = React.useState(defaultIsRecording);
  const isRecording = isRecordingControlled ? isRecordingProp : uncontrolledRecording;

  const openControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openControlled ? openProp : uncontrolledOpen;

  /* Lifted here (not left as a bare pass-through to `PromptbarComposer`/
   * `Textarea`, each of which already has its own uncontrolled fallback)
   * specifically so a finished transcription can *set* the field — with
   * the value living only as far down as `Textarea`'s own internal state,
   * nothing above it has a way to push a new value in after the fact. Same
   * controlled/uncontrolled shape as `isRecording`/`open` above. */
  const valueControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? '');
  const value = valueControlled ? valueProp : uncontrolledValue;

  const reducedMotion = Boolean(useReducedMotion());

  function setRecording(next: boolean) {
    if (!isRecordingControlled) setUncontrolledRecording(next);
    onIsRecordingChange?.(next);
  }

  function setOpen(next: boolean) {
    if (!openControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  function setValue(next: string) {
    if (!valueControlled) setUncontrolledValue(next);
    onValueChange?.(next);
  }

  /* Mode 2 — realtime dictation. Fully separate from `useAudioRecording`/
   * `PromptbarAudioCard` (Mode 1) — see `use-live-dictation.ts`'s own doc
   * comment for why one hook doesn't cover both. Called here (not inside
   * `PromptbarComposer`) specifically so exclusivity between the two modes
   * — only one may own the mic — is just a function call to a sibling
   * handler, not a ref bridged across components. */
  const dictation = useLiveDictation(onStartLiveDictation);
  /* Snapshot of `value` from just before the *current* session/utterance —
   * `useLiveDictation` has no concept of composer text, so merging
   * interim/final events into `value` and reverting on cancel are this
   * component's own job. Updated to the merged text on every `isFinal`
   * event, so a session with several spoken utterances appends each one
   * after the last rather than overwriting it. */
  const dictationBaseTextRef = React.useRef('');

  React.useEffect(() => {
    if (!dictation.event) return;
    const merged = mergeDictationText(dictationBaseTextRef.current, dictation.event.text);
    setValue(merged);
    if (dictation.event.isFinal) dictationBaseTextRef.current = merged;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only `dictation.event` should re-run this; `setValue`'s own identity changes with every keystroke elsewhere.
  }, [dictation.event]);

  function handleStartDictation() {
    dictationBaseTextRef.current = value;
    void dictation.start();
  }

  function handleStopDictation() {
    dictation.stop();
  }

  function handleCancelDictation() {
    dictation.cancel();
    setValue(dictationBaseTextRef.current);
  }

  /* Exclusivity — only one voice-input mode owns the mic. The reverse
   * direction (dictation starting while Audio Card is up) can't happen:
   * the mic icon lives inside `PromptbarComposer`, which isn't even
   * mounted while `isRecording` is true (Audio Card replaces it). */
  function handleStartRecording() {
    if (dictation.status === 'listening') dictation.stop();
    else if (dictation.status !== 'idle') dictation.cancel();
    setRecording(true);
    onStartRecording?.();
  }

  function handleCancelRecording() {
    setRecording(false);
    onCancelRecording?.();
  }

  function handleConfirmRecording(blob: Blob | null, transcript?: string) {
    setRecording(false);
    if (transcript !== undefined) setValue(transcript);
    onConfirmRecording?.(blob, transcript);
  }

  /** Any selection made inside the expanded shelf menu — a workflow, or a
   * scene-link change (Connect / Link to another scene / Create from
   * search / Disconnect) — collapses the shelf afterward, but not
   * instantly. The row's own checkmark draw-in (`ListItemCheckmark`,
   * `CHECKMARK_DRAW_TRANSITION`, 200ms) needs to actually finish and be
   * seen before the shelf collapses out from under it, or the selection
   * never registers as having happened. ~400ms hold after that (600ms
   * total from selection) is the "pause for a beat" — long enough to read
   * as deliberate, short enough not to feel like a stall. Cleared on
   * unmount so a selection right before navigating away never fires
   * `setOpen` after this component is gone, and on every new call so two
   * rapid selections don't collapse twice. */
  const collapseTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(
    () => () => {
      if (collapseTimeoutRef.current !== undefined) clearTimeout(collapseTimeoutRef.current);
    },
    []
  );

  function scheduleCollapse() {
    if (collapseTimeoutRef.current !== undefined) clearTimeout(collapseTimeoutRef.current);
    collapseTimeoutRef.current = setTimeout(() => setOpen(false), reducedMotion ? 0 : 600);
  }

  function handleSelectWorkflow(kind: PromptbarWorkflowKind) {
    onSelectWorkflow?.(kind);
    scheduleCollapse();
  }

  function handleConnectScene() {
    onConnectScene?.();
    scheduleCollapse();
  }

  function handleLinkAnotherScene() {
    onLinkAnotherScene?.();
    scheduleCollapse();
  }

  function handleCreateSceneFromSearch() {
    onCreateSceneFromSearch?.();
    scheduleCollapse();
  }

  function handleDisconnectScene() {
    onDisconnectScene?.();
    scheduleCollapse();
  }

  const presentation = React.useMemo(
    () =>
      derivePromptbarPresentation(
        state,
        { isRecording },
        {
          onConnectScene: handleConnectScene,
          onLinkAnotherScene: handleLinkAnotherScene,
          onCreateSceneFromSearch: handleCreateSceneFromSearch,
          onDisconnectScene: handleDisconnectScene,
          onSelectWorkflow: handleSelectWorkflow,
          onDismissActiveWorkflow,
          onDismissParagraphSelection,
        }
      ),
    [
      state,
      isRecording,
      onConnectScene,
      onLinkAnotherScene,
      onCreateSceneFromSearch,
      onDisconnectScene,
      onSelectWorkflow,
      onDismissActiveWorkflow,
      onDismissParagraphSelection,
    ]
  );

  return (
    <div data-slot="promptbar" className={cn('flex w-full min-w-[350px] flex-col', className)}>
      {/*
       * `PromptbarShelf` has exactly one call site — not a ternary between
       * several differently-branched `<PromptbarShelf>` elements, and
       * never keyed by `state.mode.aiMode`/any other domain value. A
       * `key` change is an explicit remount signal to React: it would
       * discard the shelf's own cascade-entrance/chevron-rotation
       * animation state on every mode switch, for no reason — its
       * `statusContent`/`trigger`/`children` already vary per render via
       * `presentation.shelf` without needing that. `children` is passed
       * as `undefined` (not `null`) when not expandable, to correctly
       * drive `PromptbarShelf`'s own `expandable = children !==
       * undefined` check.
       *
       * The one *intentional* identity break: entering/leaving Recording
       * or Fia-speak genuinely removes the shelf from the tree (Figma
       * specifies no shelf in either state) — `presentation.shelf.visible`
       * flips to `false` and this whole block unmounts. `AnimatePresence`
       * here softens *that* transition (a fade, not an instant pop) —
       * this is the shelf's own mount/unmount, which `PromptbarShelf`
       * itself has no opinion about (only its internal open/closed one),
       * not a reimplementation of anything `PromptbarShelf` already owns.
       */}
      <AnimatePresence initial={false}>
        {presentation.shelf.visible ? (
          <motion.div
            key="shelf"
            /* Pulls the composer up into the shelf's own
             * `pb-[var(--spacing-4xl)]` reach-under padding (48px — see
             * `PromptbarShelf.tsx`'s doc comment on `SHELF_BASE`, uniform
             * across every mode/branch there) so that zone reads as
             * covered rather than as dead space, leaving exactly 8px of it
             * visible as the shelf peeking out from underneath — matching
             * the shelf's own `pt-[var(--spacing-xs)]` (8px) top padding,
             * so the reveal reads as the same padding on both sides of the
             * content, not a mismatched sliver. `-40px` (not a spacing
             * token) is that arithmetic (48 reach-under − 8 desired
             * reveal), deliberately not chasing Figma's own literal
             * auto-layout number here — visual balance won over exact
             * parity. */
            className={cn('px-[var(--spacing-2xs)]', '-mb-[40px]')}
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reducedMotion ? { duration: 0 } : TRANSITION_EMPHASIZED_FAST}
          >
            <PromptbarShelf
              statusContent={<ShelfStatusRows rows={presentation.shelf.statusRows} />}
              trigger={presentation.shelf.trigger ? <ShelfTrigger spec={presentation.shelf.trigger} /> : undefined}
              open={open}
              onOpenChange={setOpen}
            >
              {presentation.shelf.expandable
                ? buildShelfMenuChildren(presentation.shelf.menuCaption, presentation.shelf.menuItems ?? [])
                : undefined}
            </PromptbarShelf>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {presentation.composer ? (
        <PromptbarComposer
          presentation={presentation.composer}
          aiMode={state.mode.aiMode}
          onAIModeChange={onAIModeChange}
          tokenCount={state.tokenCount}
          value={value}
          onValueChange={setValue}
          maxLength={maxLength}
          showCharacterCount={showCharacterCount}
          onStartRecording={handleStartRecording}
          dictationStatus={dictation.status}
          dictationError={dictation.error}
          onStartDictation={onStartLiveDictation ? handleStartDictation : undefined}
          onStopDictation={handleStopDictation}
          onCancelDictation={handleCancelDictation}
          onMute={onMute}
          onSend={onSend}
          onPlus={onPlus}
          onUploadNotes={onUploadNotes}
          onImportNotesFromApp={onImportNotesFromApp}
          onAddImage={onAddImage}
          onTokenCountClick={onTokenCountClick}
        />
      ) : (
        <PromptbarAudioCard
          onPlus={onPlus}
          onCancel={handleCancelRecording}
          onConfirm={handleConfirmRecording}
          onTranscribeRecording={onTranscribeRecording}
        />
      )}
    </div>
  );
}

export { Promptbar };
