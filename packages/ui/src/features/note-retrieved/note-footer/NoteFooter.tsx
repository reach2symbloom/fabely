/**
 * Note Footer — a bottom-edge scrim over scrollable note content, with a
 * `prev`/`next` [Lateral Toggles](../../../atoms/lateral-toggles/README.md)
 * pair docked at its left/right edges. Fades from transparent to the card's
 * own background color, signalling more content beneath while still
 * surfacing chapter navigation.
 *
 * Figma authors "Mode=Dark"/"Mode=Light" as two separate variants, each
 * hand-simulating the other theme's colors (the Dark variant hardcodes
 * white-on-charcoal rgba values rather than referencing a switch token).
 * Not reproduced as a prop here — the scrim fades to `--card` (so it always
 * matches the real card background, light or dark) and Lateral Toggles'
 * own text uses `--theme-alpha-black-switch-85`, which flips automatically
 * with the app's light/dark theme — nothing left for a `mode` prop to
 * control.
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
        /* Figma "fade up": transparent at the top edge (where card content
         * scrolls under it) to `--card` at the bottom — the semantic
         * token, not a raw alpha-switch value, so this matches whatever
         * the real card background is (light or dark) without a mode prop. */
        'bg-gradient-to-b from-transparent to-[color:var(--card)]',
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
