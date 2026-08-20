/**
 * Superscript visibility rule shared by controls with a Figma
 * `Show superscript` axis (Bookmark Icon Button `16066:5970`, Icon Button,
 * Chapter Nav Button — see each README's Deferred section). Figma only
 * shows the badge once the control is active/pressed; this hook keeps that
 * rule in one place instead of re-deriving it per component.
 */
'use client';

export type UseSuperscriptOptions = {
  /** Figma `Show superscript` boolean. */
  show?: boolean;
  /** Whether the host control is in its active/pressed state. */
  active?: boolean;
};

/** Superscript renders only when explicitly shown AND the control is active. */
function useSuperscript({ show = false, active = false }: UseSuperscriptOptions): boolean {
  return show && active;
}

export { useSuperscript };
