/**
 * Doc types — Figma set `16509:30930` (Type=PDF / Doc / Docx).
 *
 * Multi-color rasters, not currentColor glyphs. Size the frame with `--icon-*`
 * when they sit at icon scale (Add Document List Item uses `--icon-lg`).
 */

export type DocTypeImage = 'pdf' | 'doc' | 'docx';

export const DOC_TYPE_IMAGES: Record<DocTypeImage, string> = {
  pdf: new URL('./doc-type-pdf.png', import.meta.url).href,
  doc: new URL('./doc-type-doc.png', import.meta.url).href,
  docx: new URL('./doc-type-docx.png', import.meta.url).href,
};
