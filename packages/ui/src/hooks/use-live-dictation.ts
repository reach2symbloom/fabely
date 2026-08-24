/**
 * Realtime/streaming dictation controller — deliberately a separate state
 * machine from `useAudioRecording`, not a second mode bolted onto it. That
 * hook is record-first-transcribe-after (mic → `Blob` → wait); this one is
 * continuous (mic → interim/final text as the user is still speaking).
 * Forcing both through one hook would mean every consumer has to reason
 * about states that don't apply to it (a `recordedBlob` field on a
 * realtime session, a `Blob`-shaped result nobody streaming words needs).
 *
 * This hook still owns `getUserMedia` itself (reusing
 * `audio-capture-shared.ts`, the same low-level helpers `useAudioRecording`
 * uses) rather than delegating microphone access entirely to the adapter —
 * that's what lets a consumer enforce "only one voice-input mode owns the
 * mic at a time" and get consistent permission/error states regardless of
 * which realtime provider is actually wired up. The acquired `MediaStream`
 * is handed to the adapter for providers that need to stream raw audio
 * themselves (a websocket-based realtime API); an adapter wrapping
 * something that manages its own mic access internally (e.g. the Web
 * Speech API's `SpeechRecognition`) is free to ignore it — at the cost of
 * that adapter's own internal mic request being a second, separate one
 * this hook can't see or coordinate. Documented tradeoff, not a bug: a
 * fully provider-agnostic interface can't know which shape a given
 * adapter needs.
 *
 * No production transport lives here or anywhere in this package — see
 * `LiveDictationAdapter`'s own doc comment.
 */
'use client';

import * as React from 'react';

import { classifyAudioCaptureError, isMediaDevicesSupported, type AudioCaptureError } from './audio-capture-shared';

export type LiveDictationStatus = 'idle' | 'requesting-permission' | 'listening' | 'error';

export type LiveDictationTranscriptEvent = {
  /** Best-guess-so-far text for the *current* utterance — replaces, not
   * appends to, whatever the previous event carried, matching how interim
   * results work in the Web Speech API and most realtime STT providers
   * (each interim result is the whole segment re-guessed, not a delta). */
  text: string;
  isFinal: boolean;
};

export type LiveDictationSession = {
  /** Ends the session from the adapter's own side (e.g. the realtime
   * connection dropped) — call this instead of just going silent, so
   * `useLiveDictation` reflects it as an error rather than looking like
   * it's still listening. */
  stop: () => void;
};

export type StartLiveDictationOptions = {
  /** Raw mic audio — see this file's own doc comment for which adapter
   * shapes need it vs. can ignore it. */
  stream: MediaStream;
  onTranscript: (event: LiveDictationTranscriptEvent) => void;
  onError: (error: AudioCaptureError) => void;
};

/**
 * Host-supplied realtime transcription boundary. Starts a streaming
 * session against whatever backend/provider the host has integrated and
 * returns a handle to stop it; `onTranscript`/`onError` are called for as
 * long as the session is alive. No implementation of this ships in
 * `packages/ui` — Storybook uses a mock (`Promptbar.stories.tsx`'s
 * `mockLiveDictationAdapter`), and a real one is an app/host-layer
 * concern (which realtime STT provider, what protocol, where API keys
 * live — never in client or Storybook code).
 */
export type LiveDictationAdapter = (
  options: StartLiveDictationOptions
) => LiveDictationSession | Promise<LiveDictationSession>;

export type UseLiveDictationResult = {
  status: LiveDictationStatus;
  error: AudioCaptureError | null;
  /** Latest transcript event — `null` until the first one arrives for the
   * current session, reset to `null` on `start`. Consume via an effect,
   * the same pattern `useAudioRecording`'s `recordedBlob` already uses;
   * this hook doesn't know what a "composer" is and never touches one. */
  event: LiveDictationTranscriptEvent | null;
  /** Requests microphone permission and starts a session against
   * `adapter`. No-op (resolves immediately) if `adapter` is `undefined` or
   * a session is already active. */
  start: () => Promise<void>;
  /** Ends the session, leaving `event` at whatever it last was — a
   * consumer that's been mirroring `event.text` into its own text already
   * has the finalized result, nothing further to do. */
  stop: () => void;
  /** Ends the session and resets `event` back to `null` — also usable to
   * abort a still-pending permission request. Discarding *composer* text
   * back to a pre-session snapshot is the consumer's own job (this hook
   * has no concept of composer text to revert). */
  cancel: () => void;
};

function useLiveDictation(adapter: LiveDictationAdapter | undefined): UseLiveDictationResult {
  const [status, setStatus] = React.useState<LiveDictationStatus>('idle');
  const [error, setError] = React.useState<AudioCaptureError | null>(null);
  const [event, setEvent] = React.useState<LiveDictationTranscriptEvent | null>(null);

  const streamRef = React.useRef<MediaStream | null>(null);
  const sessionRef = React.useRef<LiveDictationSession | null>(null);
  /* Distinguishes "we tore this down on purpose" from the session's own
   * `onError`/`onTranscript` still firing after that — same guard shape as
   * `useAudioRecording`'s `discardRef`. */
  const activeRef = React.useRef(false);

  const teardown = React.useCallback(() => {
    activeRef.current = false;
    sessionRef.current?.stop();
    sessionRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const start = React.useCallback(async () => {
    if (!adapter) return;
    if (status === 'listening' || status === 'requesting-permission') return;

    if (!isMediaDevicesSupported()) {
      setError({ type: 'unsupported', message: 'Live dictation is not supported in this browser.' });
      setStatus('error');
      return;
    }

    setError(null);
    setEvent(null);
    setStatus('requesting-permission');
    activeRef.current = true;

    let mediaStream: MediaStream;
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      if (!activeRef.current) return; // cancelled while permission was pending
      setError(classifyAudioCaptureError(err));
      setStatus('error');
      return;
    }

    if (!activeRef.current) {
      // `cancel()` fired while permission was pending — shut the stream
      // straight back down, nothing is wired up to use it.
      mediaStream.getTracks().forEach((track) => track.stop());
      return;
    }

    streamRef.current = mediaStream;

    try {
      const session = await adapter({
        stream: mediaStream,
        onTranscript: (nextEvent) => {
          if (!activeRef.current) return;
          setEvent(nextEvent);
        },
        onError: (adapterError) => {
          if (!activeRef.current) return;
          teardown();
          setError(adapterError);
          setStatus('error');
        },
      });
      if (!activeRef.current) {
        // Cancelled while the adapter itself was still starting up.
        session.stop();
        mediaStream.getTracks().forEach((track) => track.stop());
        return;
      }
      sessionRef.current = session;
      setStatus('listening');
    } catch (err) {
      if (!activeRef.current) return;
      mediaStream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setError(classifyAudioCaptureError(err));
      setStatus('error');
    }
  }, [adapter, status, teardown]);

  const stop = React.useCallback(() => {
    if (status !== 'listening') return;
    teardown();
    setStatus('idle');
  }, [status, teardown]);

  const cancel = React.useCallback(() => {
    if (status === 'idle') return;
    teardown();
    setEvent(null);
    setError(null);
    setStatus('idle');
  }, [status, teardown]);

  React.useEffect(() => () => teardown(), [teardown]);

  return { status, error, event, start, stop, cancel };
}

export { useLiveDictation };
