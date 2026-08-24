/**
 * Reusable microphone-recording controller — browser-native stack only
 * (`getUserMedia` + `AudioContext`/`AnalyserNode` + `MediaRecorder`), no
 * waveform/visualization dependency. Owns capture infrastructure only:
 * permission request, the live stream, an `AnalyserNode` a caller can read
 * amplitude data from, the recorded `Blob` once stopped, and cleanup.
 *
 * Deliberately does not touch the DOM or run its own animation loop — the
 * exposed `analyser` is a live `AnalyserNode` a presentation component reads
 * from inside its *own* `requestAnimationFrame` loop (see
 * `PromptbarAudioCard.tsx`'s `LiveWaveform`). Pushing per-frame amplitude
 * data through React state here would re-render on every frame; reading the
 * node directly in an imperative rAF loop is the standard pattern for audio
 * visualizers and keeps this hook a pure capture/state controller.
 *
 * No transcription here (out of scope for now) — `recordedBlob` is the
 * clean handoff point a future transcription call would consume.
 */
'use client';

import * as React from 'react';

import {
  classifyAudioCaptureError,
  getAudioContextConstructor,
  isMediaDevicesSupported,
  type AudioCaptureError,
  type AudioCaptureErrorType,
} from './audio-capture-shared';

export type AudioRecordingStatus =
  | 'idle'
  | 'requesting-permission'
  | 'recording'
  | 'stopped'
  | 'error';

/** Aliases of the shared capture-error types (`audio-capture-shared.ts`) —
 * kept under this hook's own name so existing consumers importing these
 * from here don't need to change. */
export type AudioRecordingErrorType = AudioCaptureErrorType;
export type AudioRecordingError = AudioCaptureError;

export type UseAudioRecordingResult = {
  status: AudioRecordingStatus;
  isRecording: boolean;
  error: AudioRecordingError | null;
  /** Live analyser for the active capture — read its `getByteFrequencyData`/
   * `getByteTimeDomainData` from a caller-owned `requestAnimationFrame`
   * loop. `null` whenever there's no active stream (idle, stopped, error,
   * or still requesting permission). */
  analyser: AnalyserNode | null;
  /** Raw capture stream, exposed for consumers that need it directly
   * (e.g. a future live-transcription stream) — the hook doesn't do
   * anything with this beyond owning its lifecycle. */
  stream: MediaStream | null;
  recordedBlob: Blob | null;
  /** Object URL for `recordedBlob` (e.g. for an `<audio>` preview) — owned
   * and revoked by this hook; don't revoke it yourself. */
  recordedUrl: string | null;
  /** Requests microphone permission and starts capture + recording. Safe
   * to call again after `stop`/`cancel`/an error. */
  start: () => Promise<void>;
  /** Stops capture and keeps the recording — finalizes `recordedBlob`/
   * `recordedUrl`, status becomes `'stopped'`. No-op unless `'recording'`. */
  stop: () => void;
  /** Stops capture and discards the recording — no blob, status resets to
   * `'idle'`. Also usable to abort a still-pending permission request. */
  cancel: () => void;
};

/** Chosen for reasonably fine-grained amplitude data without being
 * wasteful — callers resample/bucket this themselves for however many
 * bars their own visual treatment needs (kept as an unopinionated capture
 * hook, not this specific waveform's own bar count). */
const ANALYSER_FFT_SIZE = 1024;

function isRecordingSupported(): boolean {
  return (
    isMediaDevicesSupported() &&
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder !== 'undefined' &&
    getAudioContextConstructor() !== undefined
  );
}

function useAudioRecording(): UseAudioRecordingResult {
  const [status, setStatus] = React.useState<AudioRecordingStatus>('idle');
  const [error, setError] = React.useState<AudioRecordingError | null>(null);
  const [analyser, setAnalyser] = React.useState<AnalyserNode | null>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = React.useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = React.useState<string | null>(null);

  /* Refs mirror the live objects so cleanup (including the unmount effect,
   * which closes over whatever existed at mount time otherwise) always
   * tears down the *current* instances, not a stale render's. */
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const sourceNodeRef = React.useRef<MediaStreamAudioSourceNode | null>(null);
  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const recordedUrlRef = React.useRef<string | null>(null);
  /* Set right before tearing a recording down without keeping it — read
   * inside the recorder's own async `onstop` to decide whether to finalize
   * a blob or discard. */
  const discardRef = React.useRef(false);

  const teardownCapture = React.useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);

    sourceNodeRef.current?.disconnect();
    sourceNodeRef.current = null;

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      void audioContextRef.current.close().catch(() => {});
    }
    audioContextRef.current = null;

    setAnalyser(null);
    recorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const start = React.useCallback(async () => {
    if (status === 'recording' || status === 'requesting-permission') return;

    if (!isRecordingSupported()) {
      setError({ type: 'unsupported', message: 'Audio recording is not supported in this browser.' });
      setStatus('error');
      return;
    }

    setError(null);
    setStatus('requesting-permission');
    discardRef.current = false;

    let mediaStream: MediaStream;
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      setError(classifyAudioCaptureError(err));
      setStatus('error');
      return;
    }

    /* `cancel()` can fire while permission was still pending (the user
     * dismissed the recording UI before the browser prompt resolved) — the
     * stream that just arrived has to be shut down immediately rather than
     * wired up, or it'd leak an active mic capture nothing is using. */
    if (discardRef.current) {
      mediaStream.getTracks().forEach((track) => track.stop());
      return;
    }

    streamRef.current = mediaStream;
    setStream(mediaStream);

    const AudioContextCtor = getAudioContextConstructor();
    if (!AudioContextCtor) {
      mediaStream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setStream(null);
      setError({ type: 'unsupported', message: 'Audio recording is not supported in this browser.' });
      setStatus('error');
      return;
    }

    const audioContext = new AudioContextCtor();
    audioContextRef.current = audioContext;

    const sourceNode = audioContext.createMediaStreamSource(mediaStream);
    sourceNodeRef.current = sourceNode;

    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = ANALYSER_FFT_SIZE;
    sourceNode.connect(analyserNode);
    setAnalyser(analyserNode);

    chunksRef.current = [];
    const recorder = new MediaRecorder(mediaStream);
    recorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      const shouldKeep = !discardRef.current && chunksRef.current.length > 0;
      if (shouldKeep) {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (recordedUrlRef.current) URL.revokeObjectURL(recordedUrlRef.current);
        const url = URL.createObjectURL(blob);
        recordedUrlRef.current = url;
        setRecordedBlob(blob);
        setRecordedUrl(url);
        setStatus('stopped');
      } else {
        setStatus('idle');
      }
      teardownCapture();
    };

    recorder.start();
    setStatus('recording');
  }, [status, teardownCapture]);

  const stop = React.useCallback(() => {
    if (status !== 'recording') return;
    discardRef.current = false;
    /* Status flips to `'stopped'` inside `onstop` (see above) — the recorder
     * flushes a final `dataavailable` asynchronously before that event
     * fires, so setting it here would be premature. */
    recorderRef.current?.stop();
  }, [status]);

  const cancel = React.useCallback(() => {
    if (status === 'idle') return;
    discardRef.current = true;

    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop(); // onstop sees discardRef and skips finalizing a blob
    } else {
      teardownCapture();
    }

    if (recordedUrlRef.current) {
      URL.revokeObjectURL(recordedUrlRef.current);
      recordedUrlRef.current = null;
    }
    setRecordedBlob(null);
    setRecordedUrl(null);
    setError(null);
    setStatus('idle');
  }, [status, teardownCapture]);

  React.useEffect(
    () => () => {
      discardRef.current = true;
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      sourceNodeRef.current?.disconnect();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        void audioContextRef.current.close().catch(() => {});
      }
      if (recordedUrlRef.current) URL.revokeObjectURL(recordedUrlRef.current);
    },
    []
  );

  return {
    status,
    isRecording: status === 'recording',
    error,
    analyser,
    stream,
    recordedBlob,
    recordedUrl,
    start,
    stop,
    cancel,
  };
}

export { useAudioRecording };
