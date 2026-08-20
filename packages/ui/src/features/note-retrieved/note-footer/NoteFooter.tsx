/**
 * Note Footer — a bottom-edge scrim over scrollable note content, with a
 * `prev`/`next` [Lateral Toggles](../../../atoms/lateral-toggles/README.md)
 * pair docked at its left/right edges. Fades from transparent to the
 * theme's own surface color, signalling more content beneath while still
 * surfacing chapter navigation. No rounded corners — Figma's own root
 * frame has none.
 *
 * The scrim is Foundations' `--effect-gradient-fade-up`
 * ([Gradients](../../../foundations/effects/gradients/README.md)),
 * lifted out of this component into its own Effects token — Figma names
 * this exact style "gradients/fade/fade up".
 *
 * Figma authors "Mode=Dark"/"Mode=Light" as two separate variants, each
 * hand-simulating the other theme's colors (the Dark variant hardcodes
 * white-on-charcoal rgba values rather than referencing a switch token).
 * Not reproduced as a prop here — `--effect-gradient-fade-up` and Lateral
 * Toggles' own text (`--theme-alpha-black-switch-85`) both consume switch
 * tokens, which flip automatically with the app's light/dark theme —
 * nothing left for a `mode` prop to control.
 *
 * Visual source: Figma **Note Footer**
 * ([node](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16091-10278)
 * `16091:10278`).
 */
'use client';

import { LateralToggles } from '@/atoms/lateral-toggles';
import { cn } from '@/lib/utils';

type NoteFooterProps = {
  /** Previous chapter's title. Omit to hide the `prev` toggle (e.g. first chapter). */
  prevTitle?: string;
  /** Next chapter's title. Omit to hide the `next` toggle (e.g. last chapter). */
  nextTitle?: string;
  onPrevClick?: () => void;
  onNextClick?: () => void;
  /** Forwarded to both toggles — see Lateral Toggles' own `shortcutEnabled`. */
  shortcutEnabled?: boolean;
  className?: string;
};

function NoteFooter({
  prevTitle,
  nextTitle,
  onPrevClick,
  onNextClick,
  shortcutEnabled = true,
  className,
}: NoteFooterProps) {
  return (
    <div
      data-slot="note-footer"
      className={cn(
        'flex w-full items-center justify-between',
        'p-[var(--spacing-md)]',
        'bg-[image:var(--effect-gradient-fade-up)]',
        className
      )}
    >
      {prevTitle ? (
        <LateralToggles
          direction="prev"
          title={prevTitle}
          onClick={onPrevClick}
          shortcutEnabled={shortcutEnabled}
        />
      ) : (
        <span aria-hidden />
      )}
      {nextTitle ? (
        <LateralToggles
          direction="next"
          title={nextTitle}
          onClick={onNextClick}
          shortcutEnabled={shortcutEnabled}
        />
      ) : (
        <span aria-hidden />
      )}
    </div>
  );
}

export { NoteFooter, type NoteFooterProps };
