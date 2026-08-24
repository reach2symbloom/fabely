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
  onConfirmRecording?: () => void;
  onMute?: () => void;
  onSend?: () => void;
  onPlus?: () => void;

  className?: string;
};

function Promptbar({
  state,
  isRecording: isRecordingProp,
  defaultIsRecording = false,
  onIsRecordingChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  value,
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
  onAIModeChange,
  onStartRecording,
  onCancelRecording,
  onConfirmRecording,
  onMute,
  onSend,
  onPlus,
  className,
}: PromptbarProps) {
  const isRecordingControlled = isRecordingProp !== undefined;
  const [uncontrolledRecording, setUncontrolledRecording] = React.useState(defaultIsRecording);
  const isRecording = isRecordingControlled ? isRecordingProp : uncontrolledRecording;

  const openControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openControlled ? openProp : uncontrolledOpen;

  const reducedMotion = Boolean(useReducedMotion());

  function setRecording(next: boolean) {
    if (!isRecordingControlled) setUncontrolledRecording(next);
    onIsRecordingChange?.(next);
  }

  function setOpen(next: boolean) {
    if (!openControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  function handleStartRecording() {
    setRecording(true);
    onStartRecording?.();
  }

  function handleCancelRecording() {
    setRecording(false);
    onCancelRecording?.();
  }

  function handleConfirmRecording() {
    setRecording(false);
    onConfirmRecording?.();
  }

  /** Selecting a workflow also collapses the shelf — mirrors
   * `PromptbarShelf`'s own Fia-workflows reference story
   * (`pickWorkflow` there does the same `setOpen(false)`), just lifted up
   * a level since `open` itself is lifted here. */
  function handleSelectWorkflow(kind: PromptbarWorkflowKind) {
    onSelectWorkflow?.(kind);
    setOpen(false);
  }

  const presentation = React.useMemo(
    () =>
      derivePromptbarPresentation(
        state,
        { isRecording },
        {
          onConnectScene,
          onLinkAnotherScene,
          onCreateSceneFromSearch,
          onDisconnectScene,
          onSelectWorkflow: handleSelectWorkflow,
          onDismissActiveWorkflow,
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
    ]
  );

  return (
    <div data-slot="promptbar" className={cn('flex w-[455px] flex-col', className)}>
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
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          maxLength={maxLength}
          showCharacterCount={showCharacterCount}
          onStartRecording={handleStartRecording}
          onMute={onMute}
          onSend={onSend}
          onPlus={onPlus}
        />
      ) : (
        <PromptbarAudioCard onPlus={onPlus} onCancel={handleCancelRecording} onConfirm={handleConfirmRecording} />
      )}
    </div>
  );
}

export { Promptbar };
