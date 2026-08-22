/**
 * Spot Images — decorative illustrations for Library entry-point cards.
 *
 * Source: Image Button's two Figma instances (`16455:16977`
 * "Import notes", `16455:17561` "Import your manuscript") — the 72×72
 * thumbnail each card shows, unrelated to the Brand Logos catalog
 * (those are third-party service marks; these are Fabely's own
 * illustration art).
 */

export type SpotImageKey = 'import-notes' | 'import-manuscript';

function url(file: string) {
  return new URL(`./${file}`, import.meta.url).href;
}

export const SPOT_IMAGES: Record<SpotImageKey, string> = {
  'import-notes': url('import-notes.png'),
  'import-manuscript': url('import-manuscript.png'),
};
