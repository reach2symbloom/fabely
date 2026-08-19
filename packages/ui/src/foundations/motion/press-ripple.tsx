/**
 * Press Ripple — click-origin circle that expands and fades.
 *
 * Promoted from Library List Item (first use) once Image Button needed the
 * same feedback. Only `transform`/`opacity` animate (GPU-composited, no
 * layout thrashing). Mounts at `scale(0)`, flips to expanded on the next
 * frame (a CSS transition needs a style change on a subsequent paint to
 * actually play, not just an initial state), then unmounts itself via
 * `onTransitionEnd`. Kept low-opacity/restrained (0.12 peak) rather than a
 * bold Material ripple — this fires on every click, so per
 * animation-vocabulary's "frequency of use" principle it needs to stay
 * quiet.
 *
 * Not what Resume Writing Button's go-control ripple uses — that one is a
 * WAAPI `element.animate` in `--tw-raw-pantones-lavendar`, deliberately a
 * different (branded, CTA-only) feel. This is the neutral white ripple for
 * ordinary card presses.
 */
import * as React from 'react';

import { cn } from '@/lib/utils';

export type PressRippleSpec = { id: number; x: number; y: number };

/** Ripple state + click-origin spawn/dismiss. Compose with `PressRippleLayer`. */
function usePressRipple() {
  const [ripples, setRipples] = React.useState<PressRippleSpec[]>([]);
  const idRef = React.useRef(0);

  const spawnRipple = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const id = idRef.current++;
    setRipples((current) => [
      ...current,
      { id, x: event.clientX - bounds.left, y: event.clientY - bounds.top },
    ]);
  }, []);

  const dismissRipple = React.useCallback((id: number) => {
    setRipples((current) => current.filter((ripple) => ripple.id !== id));
  }, []);

  return { ripples, spawnRipple, dismissRipple };
}

function PressRipple({
  x,
  y,
  onDone,
}: {
  x: number;
  y: number;
  onDone: () => void;
}) {
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setExpanded(true));
    /* Fallback cleanup — `motion-reduce:transition-none` means no transition
     * plays for reduced-motion users, so `onTransitionEnd` never fires. */
    const fallback = window.setTimeout(onDone, 600);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span
      aria-hidden
      onTransitionEnd={onDone}
      className={cn(
        'pointer-events-none absolute size-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full',
        'bg-[color:var(--tw-raw-white)]',
        'transition-[scale,opacity] duration-[520ms] ease-emphasized motion-reduce:transition-none',
        expanded ? 'scale-100 opacity-0' : 'scale-0 opacity-[0.12]',
      )}
      style={{ left: x, top: y }}
    />
  );
}

/** Absolute, clipped, `aria-hidden` layer — renders nothing while `ripples` is empty. */
function PressRippleLayer({
  ripples,
  onDismiss,
  className,
  dataSlot,
}: {
  ripples: PressRippleSpec[];
  onDismiss: (id: number) => void;
  className?: string;
  /** Optional `data-slot` for the layer, matching the caller's naming convention. */
  dataSlot?: string;
}) {
  if (ripples.length === 0) return null;

  return (
    <div
      aria-hidden
      data-slot={dataSlot}
      className={cn(
        'pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]',
        className,
      )}
    >
      {ripples.map((ripple) => (
        <PressRipple
          key={ripple.id}
          x={ripple.x}
          y={ripple.y}
          onDone={() => onDismiss(ripple.id)}
        />
      ))}
    </div>
  );
}

export { usePressRipple, PressRipple, PressRippleLayer };
