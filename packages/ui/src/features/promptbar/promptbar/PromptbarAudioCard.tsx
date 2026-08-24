/**
 * Promptbar — the Audio (recording) card. Replaces the shelf + composer
 * entirely while recording (Figma has no shelf, no textarea, no `AIModeToggle`
 * in this mode) — a single row: plus button, a live waveform, cancel (×) and
 * confirm (✓).
 *
 * Capture itself lives in `useAudioRecording` (`@/hooks/use-audio-recording`)
 * — this component consumes that hook rather than owning raw microphone
 * infrastructure. Figma's own waveform is static reference art; its bar
 * shape, spacing, and color (and the container) are preserved exactly, but
 * the heights driving it come from the live analyser the hook exposes, not
 * a decorative fixed pattern — see `LiveWaveform`'s own doc comment for
 * how (a scrolling time-history of amplitude samples, not a per-frame
 * frequency-spectrum snapshot).
 */
'use client';

import * as React from 'react';
import { useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';
import { IconButton } from '@/primitives/button';
import { useAudioRecording } from '@/hooks/use-audio-recording';

import { PromptbarIcon } from './promptbar-icons';

const CONTROL_ICON_CLASS = 'size-[length:var(--icon-lg)]';

const WAVEFORM_BAR_COUNT = 90;
const WAVEFORM_MIN_HEIGHT = 8;
const WAVEFORM_MAX_HEIGHT = 88;

/** The previous static component's own pattern, kept as the resting shape
 * shown before a live analyser exists (still requesting permission, or
 * capture has ended) — the bar row has *something* wave-like to show from
 * the first paint instead of popping from flat/empty to live the instant
 * capture actually starts. */
const RESTING_HEIGHTS = Array.from({ length: WAVEFORM_BAR_COUNT }, (_, index) => {
  const wave = Math.sin(index * 0.45) * 0.5 + Math.sin(index * 1.7) * 0.3 + Math.sin(index * 0.15) * 0.2;
  const normalized = (wave + 1) / 2; // 0..1
  return Math.round(WAVEFORM_MIN_HEIGHT + normalized * (WAVEFORM_MAX_HEIGHT - WAVEFORM_MIN_HEIGHT));
});

/** How often a bar shift is *committed* — i.e. how fast history scrolls
 * left, one bar per tick. Independent of how often the analyser is
 * actually read (every rAF frame — see the `tick` loop below): commit
 * cadence alone governs how much wall-clock audio a 90-bar row spans, so
 * it's the one number that controls traversal speed and is left
 * unchanged from the original design specifically so that speed doesn't
 * shift as a side effect of the latency fix below. */
const SAMPLE_INTERVAL_MS = 65;
/** Per-frame easing of *already-committed* history bars (every position
 * except the live edge, see below) toward their shifted-in target — not a
 * spring, just enough smoothing that a commit tick doesn't pop the whole
 * row discretely into its new positions. Irrelevant to onset latency:
 * the live edge bypasses this entirely (see `tick`), so raising or
 * lowering it only changes how smoothly *already-past* audio resettles
 * after each shift, not how fast new audio appears. */
const DISPLAY_LERP_FACTOR = 0.35;
/** Exponential smoothing on the *raw* RMS reading — now recomputed every
 * rAF frame (not once per commit tick, which is what made the previous
 * pass laggy: an EMA with this same coefficient only advancing every
 * 65ms took ~4-5 ticks, ~300ms, to reflect a step change). Run at frame
 * rate, this coefficient converges within ~2-3 frames instead — light
 * enough to still absorb real per-frame RMS noise (this is *the* thing
 * standing between the live edge and raw jitter, see `tick`), fast enough
 * that it's no longer the bottleneck for onset latency. */
const AMPLITUDE_SMOOTHING = 0.6;
/** Typical mic input rarely drives raw RMS (0..1) anywhere near 1 —
 * without gain, ordinary speech reads as barely-there bars. Picked
 * empirically for "normal speaking volume produces clearly readable
 * variation without clipping on louder syllables"; not derived from a
 * spec, there isn't one for this. */
const AMPLITUDE_GAIN = 2.2;

function sampleAmplitude(analyser: AnalyserNode, timeDomainBuffer: Uint8Array): number {
  analyser.getByteTimeDomainData(timeDomainBuffer);
  let sumSquares = 0;
  for (let i = 0; i < timeDomainBuffer.length; i++) {
    const centered = (timeDomainBuffer[i] - 128) / 128; // -1..1
    sumSquares += centered * centered;
  }
  return Math.sqrt(sumSquares / timeDomainBuffer.length); // RMS, 0..~1
}

/**
 * Time-history waveform — each bar is one *past amplitude sample*, oldest
 * on the left, newest on the right; a new sample shifts every bar left and
 * drops the oldest, so the row reads as captured audio history rather than
 * current loudness spread across frequency bins (which is what this
 * component used to draw — see git history). Bar heights are still
 * written straight to each `<span>`'s `style.height` in a
 * `requestAnimationFrame` loop, never through React state, for the same
 * reason as before: 90 bars updating every frame is well past what's sane
 * to push through a re-render. `analyser` is a live node owned by
 * `useAudioRecording`; this component only ever reads from it — one
 * amplitude value per frame, never re-deriving all 90 bars from a single
 * analyser read (that was the old frequency-spectrum approach).
 *
 * The rightmost bar is a "live edge," not a history slot — it always
 * mirrors the current smoothed amplitude directly, every frame, so speech
 * onset is visible almost immediately; everything to its left is
 * already-committed history, shifted left once per commit tick
 * (`SAMPLE_INTERVAL_MS`) and eased into place. That split is what lets the
 * row react fast at the edge while still reading as a stable, sampled
 * history rather than a live volume meter for its other 89 bars.
 */
function LiveWaveform({ analyser }: { analyser: AnalyserNode | null }) {
  const barRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const reducedMotion = Boolean(useReducedMotion());

  /* `historyRef[0]` is the oldest sample still on screen (leftmost bar),
   * `historyRef[length - 1]` is the newest (rightmost) — a plain array,
   * shifted on each new sample. No DOM nodes move; index `i`'s value is
   * simply written into `barRefs.current[i]` every frame, so the "scroll"
   * is entirely a value-shift, not a layout/transform animation. Values
   * are normalized amplitude (0..1), converted to px only at paint time. */
  const historyRef = React.useRef<number[]>(Array(WAVEFORM_BAR_COUNT).fill(0));
  /* What's actually painted this frame — eases toward `historyRef` (see
   * `DISPLAY_LERP_FACTOR`) rather than mirroring it exactly, so motion
   * reads as continuous despite new samples only landing every
   * `SAMPLE_INTERVAL_MS`. */
  const displayedRef = React.useRef<number[]>(Array(WAVEFORM_BAR_COUNT).fill(0));
  const smoothedAmplitudeRef = React.useRef(0);

  React.useEffect(() => {
    if (!analyser) {
      // No live signal yet (or not anymore) — settle back to the resting shape.
      barRefs.current.forEach((bar, index) => {
        if (bar) bar.style.height = `${RESTING_HEIGHTS[index]}px`;
      });
      return;
    }

    // Fresh session — don't scroll in whatever a *previous* recording's
    // history happened to leave behind.
    historyRef.current = Array(WAVEFORM_BAR_COUNT).fill(0);
    displayedRef.current = Array(WAVEFORM_BAR_COUNT).fill(0);
    smoothedAmplitudeRef.current = 0;

    const timeDomainBuffer = new Uint8Array(analyser.fftSize);
    let frameId: number;
    let lastSampleTime = 0;

    function tick(timestamp: number) {
      /* Read + smooth every frame, not gated behind the commit interval —
       * this is the actual latency fix. `smoothedAmplitudeRef` is always
       * as fresh as the current frame allows, whether or not this tick
       * also happens to commit a new bar. Not batching/averaging multiple
       * analyser frames into one reading — one `getByteTimeDomainData`
       * call per rAF frame, same as before, just no longer thrown away on
       * frames that fall between commits. */
      const rawAmplitude = sampleAmplitude(analyser!, timeDomainBuffer);
      const gained = Math.min(1, rawAmplitude * AMPLITUDE_GAIN);
      smoothedAmplitudeRef.current =
        smoothedAmplitudeRef.current * (1 - AMPLITUDE_SMOOTHING) + gained * AMPLITUDE_SMOOTHING;

      if (timestamp - lastSampleTime >= SAMPLE_INTERVAL_MS) {
        lastSampleTime = timestamp;
        // Under silence this keeps committing near-zero values every
        // tick — louder history keeps traversing left and dropping off
        // rather than freezing, decaying the row toward baseline as
        // required. Traversal speed is exactly this cadence, unchanged.
        historyRef.current.shift();
        historyRef.current.push(smoothedAmplitudeRef.current);
      }

      const history = historyRef.current;
      const displayed = displayedRef.current;
      const lastIndex = WAVEFORM_BAR_COUNT - 1;
      // Bars 0..lastIndex-1 are already-committed history — eased toward
      // their shifted-in target, same as before (governs how smoothly the
      // *past* resettles after a commit, not onset latency).
      for (let i = 0; i < lastIndex; i++) {
        const target = history[i];
        displayed[i] = reducedMotion ? target : displayed[i] + (target - displayed[i]) * DISPLAY_LERP_FACTOR;
        const el = barRefs.current[i];
        if (el) el.style.height = `${WAVEFORM_MIN_HEIGHT + displayed[i] * (WAVEFORM_MAX_HEIGHT - WAVEFORM_MIN_HEIGHT)}px`;
      }
      /* The live edge (rightmost bar) — mirrors `smoothedAmplitudeRef`
       * directly every frame, bypassing `history`/the lerp above
       * entirely. That's what makes speech onset show up within a frame
       * or two: no waiting for the next commit tick, no second smoothing
       * pass on top of `AMPLITUDE_SMOOTHING`. Once a commit tick fires,
       * whatever this bar is currently showing becomes the value bar
       * `lastIndex - 1` eases toward next — it's continuously "about to
       * be" the next history entry, not a separate thing. */
      displayed[lastIndex] = smoothedAmplitudeRef.current;
      const liveEl = barRefs.current[lastIndex];
      if (liveEl) {
        liveEl.style.height = `${WAVEFORM_MIN_HEIGHT + displayed[lastIndex] * (WAVEFORM_MAX_HEIGHT - WAVEFORM_MIN_HEIGHT)}px`;
      }

      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [analyser, reducedMotion]);

  return (
    <div
      aria-hidden
      /* `min-w-0` — 90 fixed-width `shrink-0` bars give this flex item a
       * min-content width (their summed width) far past what's actually
       * available; a flex item's default `min-width: auto` can't shrink
       * below that, so without this it was forcing the row (and the ×/✓
       * buttons after it) wider than the card, `overflow-clip` here doing
       * nothing since the box itself never got small enough to need it. */
      className="flex h-[48px] min-w-0 flex-1 items-center gap-px overflow-clip px-[var(--spacing-1-75)]"
    >
      {RESTING_HEIGHTS.map((height, index) => (
        <span
          // eslint-disable-next-line react/no-array-index-key -- fixed-count bars, no identity beyond position
          key={index}
          ref={(el) => {
            barRefs.current[index] = el;
          }}
          className="w-[3px] shrink-0 rounded-full bg-[color:var(--theme-alpha-black-switch-15)]"
          style={{ height }}
        />
      ))}
    </div>
  );
}

/** Replaces the waveform region while there's no live signal to show —
 * requesting permission, or a real capture failure (denied / no device /
 * unsupported browser). Cancel (always visible in the control row) is
 * still how a user backs out of any of these; `onRetry` only appears once
 * there's actually something to retry. */
function RecordingStatusMessage({ children, onRetry }: { children: React.ReactNode; onRetry?: () => void }) {
  return (
    <div className="flex h-[48px] min-w-0 flex-1 items-center gap-[var(--spacing-xs)] px-[var(--spacing-1-75)]">
      <p className="truncate text-[length:var(--text-paragraph-small-regular-font-size)] text-[color:var(--muted-foreground)]">
        {children}
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 cursor-pointer text-[length:var(--text-paragraph-small-regular-font-size)] text-[color:var(--primary)] hover:underline"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

export type PromptbarAudioCardProps = {
  onPlus?: () => void;
  onCancel?: () => void;
  /** Fires once the recording is finalized (and transcribed, if
   * `onTranscribeRecording` is supplied) — the one moment this component
   * hands control back. `blob` is `null` if nothing was ever captured
   * (e.g. confirmed immediately after a permission error). `transcript` is
   * only ever present when `onTranscribeRecording` succeeded — omitted
   * (not just empty-string) whenever transcription wasn't attempted or
   * available, so a host can tell "no transcript" from "empty transcript"
   * if that distinction ever matters. */
  onConfirm?: (blob: Blob | null, transcript?: string) => void;
  /** The actual speech-to-text call — this component (and this package)
   * never makes network requests itself, matching every other Promptbar
   * handler prop. Supply this to turn a confirmed recording into
   * transcribed text; omit it to keep today's behavior (the raw blob goes
   * straight to `onConfirm`, no transcription attempted — there is
   * currently no transcription backend anywhere in this repo to call by
   * default). Reject with a `message` describing the failure — the card
   * shows it with a "Try again" affordance that re-calls this with the
   * same blob, no re-recording needed. */
  onTranscribeRecording?: (blob: Blob) => Promise<string>;
  cancelLabel?: string;
  confirmLabel?: string;
  className?: string;
};

type TranscriptionPhase = 'idle' | 'transcribing' | 'error';

function PromptbarAudioCard({
  onPlus,
  onCancel,
  onConfirm,
  onTranscribeRecording,
  cancelLabel = 'Cancel recording',
  confirmLabel = 'Confirm recording',
  className,
}: PromptbarAudioCardProps) {
  const { start, stop, cancel, status, error, analyser, recordedBlob } = useAudioRecording();

  /* Mounting this card *is* "recording started" from the domain-state's own
   * perspective — `Promptbar.tsx` only ever renders it while `isRecording`
   * — so capture begins on mount, not a separate user action. Guarded with
   * a ref (not just the hook's own internal status check) because React 18
   * Strict Mode double-invokes effects in dev: both calls would otherwise
   * read the same pre-update `status` from this render's closure and both
   * pass the hook's "already recording" guard, opening two simultaneous
   * capture streams. */
  const hasStartedRef = React.useRef(false);
  React.useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    void start();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliberately mount-only; re-running on `start`'s own identity changes would restart capture mid-recording.
  }, []);

  const [transcriptionPhase, setTranscriptionPhase] = React.useState<TranscriptionPhase>('idle');
  const [transcriptionError, setTranscriptionError] = React.useState<string | null>(null);
  /* Set by `handleCancel` — checked once an in-flight `onTranscribeRecording`
   * call resolves/rejects so a result that lands *after* the user already
   * backed out never fires `onConfirm` or repaints an error the card no
   * longer shows (this component stays mounted through transcribing —
   * `Promptbar.tsx` doesn't swap it away until `onConfirm` actually fires —
   * so it's still around to receive that stale result). */
  const cancelledRef = React.useRef(false);

  async function runTranscription(blob: Blob) {
    if (!onTranscribeRecording) {
      onConfirm?.(blob);
      return;
    }
    setTranscriptionPhase('transcribing');
    setTranscriptionError(null);
    try {
      const transcript = await onTranscribeRecording(blob);
      if (cancelledRef.current) return;
      setTranscriptionPhase('idle');
      onConfirm?.(blob, transcript);
    } catch (err) {
      if (cancelledRef.current) return;
      setTranscriptionPhase('error');
      setTranscriptionError(err instanceof Error ? err.message : 'Transcription failed.');
    }
  }

  /* `stop()` finalizes asynchronously (`MediaRecorder`'s own `onstop`) —
   * transcription (or `onConfirm`, if no transcriber is supplied) fires
   * from here once `recordedBlob` actually lands, rather than
   * optimistically inside the confirm button's click handler. */
  const notifiedRef = React.useRef(false);
  React.useEffect(() => {
    if (status !== 'stopped' || notifiedRef.current) return;
    notifiedRef.current = true;
    if (recordedBlob) {
      void runTranscription(recordedBlob);
    } else {
      onConfirm?.(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, recordedBlob]);

  function handleCancel() {
    cancelledRef.current = true;
    cancel();
    onCancel?.();
  }

  function handleRetryTranscription() {
    if (recordedBlob) void runTranscription(recordedBlob);
  }

  function errorMessage(): string {
    switch (error?.type) {
      case 'permission-denied':
        return 'Microphone access was denied.';
      case 'no-microphone':
        return 'No microphone was found.';
      case 'unsupported':
        return 'Recording isn’t supported in this browser.';
      default:
        return error?.message ?? 'Something went wrong.';
    }
  }

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
      <IconButton variant="ghost" size="lg" roundness="round" aria-label="Add attachment" onClick={onPlus}>
        <PromptbarIcon token="plus" className={CONTROL_ICON_CLASS} />
      </IconButton>

      {status === 'error' ? (
        <RecordingStatusMessage onRetry={() => void start()}>{errorMessage()}</RecordingStatusMessage>
      ) : status === 'requesting-permission' ? (
        <RecordingStatusMessage>Waiting for microphone access…</RecordingStatusMessage>
      ) : transcriptionPhase === 'transcribing' ? (
        <RecordingStatusMessage>Transcribing…</RecordingStatusMessage>
      ) : transcriptionPhase === 'error' ? (
        <RecordingStatusMessage onRetry={handleRetryTranscription}>
          {transcriptionError ?? 'Transcription failed.'}
        </RecordingStatusMessage>
      ) : (
        <LiveWaveform analyser={analyser} />
      )}

      <div className="flex shrink-0 items-center gap-0">
        <IconButton variant="ghost" size="lg" roundness="round" aria-label={cancelLabel} onClick={handleCancel}>
          <PromptbarIcon token="x" className={CONTROL_ICON_CLASS} />
        </IconButton>
        <IconButton
          variant="ghost"
          size="lg"
          roundness="round"
          aria-label={confirmLabel}
          onClick={stop}
          disabled={status !== 'recording'}
        >
          <PromptbarIcon token="check" className={CONTROL_ICON_CLASS} />
        </IconButton>
      </div>
    </div>
  );
}

export { PromptbarAudioCard };
