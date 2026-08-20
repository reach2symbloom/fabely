/**
 * Fabely Pin Button — icon toggle in a square hit-target chip. Unlike
 * Bookmark Button, this one does carry container chrome per Figma: a
 * transparent-to-`alpha-5` hover background on a `--rounded-md` 32px chip.
 * The glyph itself swaps shape on select (tailed outline → headless solid),
 * not just color — verified against the raw Figma SVG paths, not the
 * screenshot.
 *
 * Composes the headless Base UI Toggle primitive directly (no ghost/outline
 * skin, no roundness prop — the chip shape here is fixed by Figma).
 * Visual source: Figma **Pin Button**
 * ([Pin Button](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16233-7891)
 * `16233:7891`).
 */
'use client';

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { useSuperscript } from '@/hooks/use-superscript';
import { cn } from '@/lib/utils';

/** Figma Vector (`16233:7839`) — unselected, tailed outline. */
const PIN_OUTLINE_PATH =
  'M11.9706 0.568211L16.0985 4.6961C16.3195 4.91717 16.4838 5.18836 16.5775 5.48658C16.6711 5.78481 16.6914 6.10125 16.6365 6.40899C16.5816 6.71672 16.4532 7.00665 16.2622 7.25411C16.0712 7.50156 15.8233 7.69922 15.5395 7.83027L14.0678 8.51012C13.5982 8.72745 13.184 9.0483 12.8561 9.44858C12.5282 9.84887 12.2952 10.3182 12.1746 10.8214L11.527 13.543C11.1754 15.0202 9.3399 15.5393 8.26634 14.4657L5.822 12.0214L1.41907 16.4232C1.34188 16.5004 1.25024 16.5616 1.14938 16.6034C1.04853 16.6452 0.940434 16.6667 0.83127 16.6667C0.722106 16.6667 0.614011 16.6452 0.513157 16.6034C0.412302 16.5616 0.320664 16.5004 0.243473 16.4232C0.166283 16.346 0.105052 16.2544 0.0632767 16.1535C0.0215014 16.0527 0 15.9446 0 15.8354C0 15.7262 0.0215014 15.6181 0.0632767 15.5173C0.105052 15.4164 0.166283 15.3248 0.243473 15.2476L4.64529 10.8447L2.20095 8.40032C1.12739 7.32676 1.64642 5.49128 3.12368 5.13972L5.84529 4.49203C6.34879 4.37219 6.81847 4.1395 7.21887 3.81154C7.61926 3.48358 7.93989 3.06892 8.15655 2.59888L8.8364 1.12717C8.96745 0.843375 9.16511 0.595432 9.41256 0.404433C9.66001 0.213434 9.94994 0.0850317 10.2577 0.0301486C10.5654 -0.0247345 10.8819 -0.00447429 11.1801 0.0892058C11.4783 0.182886 11.7495 0.347214 11.9706 0.568211ZM6.41312 10.2602L9.44305 13.289C9.47794 13.3239 9.5215 13.3488 9.56925 13.3613C9.617 13.3737 9.6672 13.3732 9.71467 13.3597C9.76215 13.3463 9.80517 13.3204 9.8393 13.2848C9.87343 13.2491 9.89744 13.205 9.90885 13.157L10.5565 10.4354C10.7355 9.68738 11.0816 8.9896 11.5689 8.39451C12.0563 7.79943 12.6721 7.32251 13.3702 6.99959L14.843 6.31974C14.8836 6.30104 14.9191 6.27279 14.9464 6.23742C14.9737 6.20204 14.9921 6.16058 15 6.11657C15.0078 6.07256 15.0049 6.02731 14.9915 5.98467C14.978 5.94203 14.9545 5.90327 14.9229 5.87169L10.795 1.7438C10.7634 1.71217 10.7246 1.68863 10.682 1.67521C10.6394 1.66179 10.5941 1.65887 10.5501 1.66671C10.5061 1.67456 10.4646 1.69293 10.4292 1.72025C10.3939 1.74758 10.3656 1.78305 10.3469 1.82366L9.66707 3.29647C9.34483 3.99503 8.86813 4.61127 8.27294 5.09868C7.67774 5.58609 6.97962 5.93195 6.23124 6.11013L3.50963 6.75782C3.46162 6.76922 3.41753 6.79323 3.3819 6.82736C3.34627 6.8615 3.3204 6.90452 3.30695 6.95199C3.2935 6.99946 3.29296 7.04966 3.30539 7.09741C3.31782 7.14516 3.34276 7.18873 3.37765 7.22362L6.40647 10.2535L6.41312 10.2602Z';

/** Figma Vector (`16233:7847`) — selected, headless solid pin head. */
const PIN_FILLED_PATH =
  'M11.9706 0.568211L16.0985 4.6961C16.3195 4.91717 16.4838 5.18836 16.5775 5.48658C16.6711 5.78481 16.6914 6.10125 16.6365 6.40899C16.5816 6.71672 16.4532 7.00665 16.2622 7.25411C16.0712 7.50156 15.8233 7.69922 15.5395 7.83027L14.0678 8.51012C13.5982 8.72745 13.184 9.0483 12.8561 9.44858C12.5282 9.84887 12.2952 10.3182 12.1746 10.8214L11.527 13.543C11.1754 15.0202 9.3399 15.5393 8.26634 14.4657L5.822 12.0214L1.41907 16.4232C1.34188 16.5004 1.25024 16.5616 1.14938 16.6034C1.04853 16.6452 0.940434 16.6667 0.83127 16.6667C0.722106 16.6667 0.614011 16.6452 0.513157 16.6034C0.412302 16.5616 0.320664 16.5004 0.243473 16.4232C0.166283 16.346 0.105052 16.2544 0.0632767 16.1535C0.0215014 16.0527 0 15.9446 0 15.8354C0 15.7262 0.0215014 15.6181 0.0632767 15.5173C0.105052 15.4164 0.166283 15.3248 0.243473 15.2476L4.64529 10.8447L2.20095 8.40032C1.12739 7.32676 1.64642 5.49128 3.12368 5.13972L5.84529 4.49203C6.34879 4.37219 6.81847 4.1395 7.21887 3.81154C7.61926 3.48358 7.93989 3.06892 8.15655 2.59888L8.8364 1.12717C8.96745 0.843376 9.16511 0.595432 9.41256 0.404433C9.66002 0.213434 9.94994 0.0850317 10.2577 0.0301486C10.5654 -0.0247345 10.8819 -0.0044743 11.1801 0.0892058C11.4783 0.182886 11.7495 0.347214 11.9706 0.568211Z';

function PinGlyph({ active, className }: { active: boolean; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16.6667 16.6667"
      className={className}
      fill="currentColor"
    >
      <path d={active ? PIN_FILLED_PATH : PIN_OUTLINE_PATH} />
    </svg>
  );
}

type PinButtonProps = Omit<TogglePrimitive.Props, 'children'> & {
  /** Figma `Show superscript` — badge only renders while pressed. */
  showSuperscript?: boolean;
  /** Badge content when `showSuperscript` is active. Figma default is "2". */
  superscriptValue?: ReactNode;
  /** Storybook / playground — lock hover paint without a pointer. */
  forceHover?: boolean;
};

function PinButton({
  className,
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  showSuperscript = false,
  superscriptValue = 2,
  forceHover = false,
  'aria-label': ariaLabelProp,
  ...props
}: PinButtonProps) {
  const isControlled = pressedProp !== undefined;
  const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed);
  const pressed = isControlled ? Boolean(pressedProp) : uncontrolledPressed;

  const handlePressedChange: NonNullable<TogglePrimitive.Props['onPressedChange']> = (
    next,
    eventDetails
  ) => {
    if (!isControlled) {
      setUncontrolledPressed(next);
    }
    onPressedChange?.(next, eventDetails);
  };

  const ariaLabel = ariaLabelProp ?? (pressed ? 'Unpin' : 'Pin');

  const superscriptVisible = useSuperscript({ show: showSuperscript, active: pressed });

  return (
    <TogglePrimitive
      data-slot="pin-button"
      data-force-hover={forceHover || undefined}
      {...props}
      pressed={isControlled ? pressedProp : undefined}
      defaultPressed={isControlled ? undefined : defaultPressed}
      onPressedChange={handlePressedChange}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center',
        'size-[length:var(--spacing-2xl)] rounded-[length:var(--rounded-md)]',
        'border-0 p-0 outline-none select-none',
        /* Figma 16233:7891 — chip background is hover-only, both selected and not. */
        'bg-[var(--theme-alpha-black-switch-0)] hover:bg-[var(--theme-alpha-black-switch-5)]',
        'data-[force-hover=true]:bg-[var(--theme-alpha-black-switch-5)]',
        'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
        'disabled:pointer-events-none disabled:opacity-50',
        /* Glyph color — unselected alpha-20, selected alpha-50 (no hover shift, no primary). */
        'text-[color:var(--theme-alpha-black-switch-20)]',
        'data-pressed:text-[color:var(--theme-alpha-black-switch-50)]',
        'aria-pressed:text-[color:var(--theme-alpha-black-switch-50)]',
        '[&_svg]:transition-colors',
        '[&_svg]:duration-[var(--duration-fast)]',
        '[&_svg]:ease-[var(--ease-emphasized)]',
        className
      )}
    >
      <span className="relative inline-flex size-[length:var(--icon-md)] items-center justify-center">
        <PinGlyph active={pressed} className="size-[length:var(--icon-sm)]" />
        {superscriptVisible && (
          <span
            aria-hidden
            className={cn(
              /* Figma 16233:7848/7849 — Superscript, offset from the Icon box. */
              'absolute -top-2 left-4',
              'flex items-center justify-center',
              'px-[length:var(--spacing-2xs)] py-[length:var(--spacing-3xs)]',
              'font-[family-name:var(--text-paragraph-mini-medium-font-family)]',
              '[font-weight:var(--text-paragraph-mini-medium-font-weight)]',
              'text-[10px] leading-[var(--text-paragraph-mini-medium-line-height)]',
              'tracking-[var(--text-paragraph-mini-medium-letter-spacing)]',
              'text-[color:var(--muted-foreground)]',
              'whitespace-nowrap'
            )}
          >
            {superscriptValue}
          </span>
        )}
      </span>
    </TogglePrimitive>
  );
}

export { PinButton, type PinButtonProps };
