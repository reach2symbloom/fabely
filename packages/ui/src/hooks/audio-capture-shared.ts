/**
 * Low-level microphone-capture helpers shared by `useAudioRecording`
 * (record → blob → transcribe) and `useLiveDictation` (realtime streaming
 * transcript) — permission/support/error classification only, nothing
 * about *what* either hook does with a stream once it has one. Kept as its
 * own module specifically so those two genuinely different flows don't
 * have to duplicate this, per their own doc comments on why they otherwise
 * stay separate state machines.
 */
'use client';

export type AudioCaptureErrorType = 'permission-denied' | 'no-microphone' | 'unsupported' | 'unknown';

export type AudioCaptureError = {
  type: AudioCaptureErrorType;
  message: string;
};

export function getAudioContextConstructor(): typeof AudioContext | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
}

export function isMediaDevicesSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.mediaDevices?.getUserMedia === 'function';
}

export function classifyAudioCaptureError(err: unknown): AudioCaptureError {
  if (err instanceof DOMException) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.name === 'SecurityError') {
      return { type: 'permission-denied', message: 'Microphone access was denied.' };
    }
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      return { type: 'no-microphone', message: 'No microphone was found on this device.' };
    }
  }
  if (err instanceof Error) return { type: 'unknown', message: err.message };
  return { type: 'unknown', message: 'Something went wrong while accessing the microphone.' };
}
