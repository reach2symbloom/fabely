/**
 * Brand Logos — third-party service marks (API connections, import sources).
 *
 * Source: Figma "Brand logos" frame (`16456:17973`), Library page
 * (`16428:12467`). Each brand renders as a tight-cropped, unpadded PNG —
 * Figma's own `BrandLogos` sub-component takes padding via `className`
 * at each call site, not baked into the mark, so size/pad at the
 * consumer (see README).
 *
 * `openai-light` / `openai-dark` are the same mark in two inks — pick
 * whichever reads against your surface (light = dark glyph, dark = white
 * glyph).
 *
 * Obsidian and Keep are each composited from multiple Figma-exported
 * layers (masked/positioned pieces, not a single flat export) — rendered
 * once to a flattened transparent PNG rather than reconstructed at
 * runtime. See README for the full source-asset breakdown.
 */

export type BrandLogoKey =
  | 'apple'
  | 'claude'
  | 'dropbox'
  | 'evernote'
  | 'google-drive'
  | 'icloud'
  | 'keep'
  | 'notion'
  | 'obsidian'
  | 'onedrive'
  | 'openai-dark'
  | 'openai-light'
  | 'play-store';

function url(file: string) {
  return new URL(`./${file}`, import.meta.url).href;
}

export const BRAND_LOGOS: Record<BrandLogoKey, string> = {
  apple: url('apple.png'),
  claude: url('claude.png'),
  dropbox: url('dropbox.png'),
  evernote: url('evernote.png'),
  'google-drive': url('google-drive.png'),
  icloud: url('icloud.png'),
  keep: url('keep.png'),
  notion: url('notion.png'),
  obsidian: url('obsidian.png'),
  onedrive: url('onedrive.png'),
  'openai-dark': url('openai-dark.png'),
  'openai-light': url('openai-light.png'),
  'play-store': url('play-store.png'),
};
