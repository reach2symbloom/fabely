/**
 * Story-only live token matching. Probe Foundations CSS variables against
 * computed style values so overlays / spec sheets never invent a name.
 */

export type Rgba = { r: number; g: number; b: number; a: number };

export type ThemedColor = {
  token: string | null;
  current: string;
  light: string | null;
  dark: string | null;
};

const PX_TOLERANCE = 0.51;
const ALPHA_TOLERANCE = 0.02;
const CHANNEL_TOLERANCE = 1.5;

const SEMANTIC_COLOR = new Set([
  '--foreground',
  '--background',
  '--border',
  '--muted-foreground',
  '--muted',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--input',
  '--ring',
  '--overlay',
  '--text',
]);

function colorRank(name: string): number {
  if (SEMANTIC_COLOR.has(name)) return 0;
  if (name.startsWith('--theme-alpha-')) return 1;
  if (name.startsWith('--theme-neutrals-')) return 2;
  if (name.startsWith('--neutrals-new-')) return 3;
  if (name.startsWith('--tw-raw-')) return 4;
  return 5;
}

function lengthRank(name: string, role: 'radius' | 'stroke' | 'type'): number {
  if (role === 'radius') {
    if (name.startsWith('--rounded-') || name === '--radius') return 0;
    if (name.startsWith('--tw-raw-radius-')) return 1;
    return 9;
  }
  if (role === 'stroke') {
    if (name.startsWith('--stroke-')) return 0;
    return 9;
  }
  if (name.startsWith('--text-')) return 0;
  if (name.startsWith('--font-')) return 1;
  return 9;
}

function walkCssRules(rules: CSSRuleList, names: Set<string>, keep: (n: string) => boolean) {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule) {
      const sel = rule.selectorText ?? '';
      if (!sel.includes(':root') && !sel.includes('.dark')) continue;
      for (const name of Array.from(rule.style)) {
        if (keep(name)) names.add(name);
      }
    } else if ('cssRules' in rule) {
      try {
        walkCssRules((rule as CSSGroupingRule).cssRules, names, keep);
      } catch {
        /* cross-origin or empty grouping rule */
      }
    }
  }
}

export function collectCssVarNames(keep: (name: string) => boolean): string[] {
  const names = new Set<string>();
  const computed = getComputedStyle(document.documentElement);
  for (let i = 0; i < computed.length; i++) {
    const name = computed.item(i);
    if (keep(name)) names.add(name);
  }
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      walkCssRules(sheet.cssRules, names, keep);
    } catch {
      /* constructed / CORS stylesheet */
    }
  }
  return [...names];
}

export function parseCssColor(input: string): Rgba | null {
  const s = input.trim().toLowerCase();
  if (!s || s === 'none') return null;
  if (s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };

  const hex = s.match(/^#([0-9a-f]{3,8})$/);
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4) {
      h = [...h].map((c) => c + c).join('');
    }
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return { r, g, b, a };
  }

  const fn = s.match(/^rgba?\((.+)\)$/);
  if (fn) {
    const body = fn[1].trim();
    const modern = body.includes('/');
    let r: number;
    let g: number;
    let b: number;
    let a = 1;
    if (modern) {
      const [rgb, alpha] = body.split('/').map((p) => p.trim());
      const parts = rgb.split(/[\s,]+/).filter(Boolean);
      r = Number(parts[0]);
      g = Number(parts[1]);
      b = Number(parts[2]);
      a = Number(alpha);
    } else {
      const parts = body.split(/[\s,]+/).filter(Boolean);
      r = Number(parts[0]);
      g = Number(parts[1]);
      b = Number(parts[2]);
      if (parts[3] != null) a = Number(parts[3]);
    }
    if (![r, g, b, a].every(Number.isFinite)) return null;
    return { r, g, b, a };
  }

  return null;
}

export function rgbToHex(c: Rgba): string {
  if (c.a <= ALPHA_TOLERANCE) return 'transparent';
  const hex = [c.r, c.g, c.b]
    .map((n) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0'))
    .join('');
  if (c.a < 1 - ALPHA_TOLERANCE) {
    const a = Math.round(c.a * 255)
      .toString(16)
      .padStart(2, '0');
    return `#${hex}${a}`.toUpperCase();
  }
  return `#${hex}`.toUpperCase();
}

export function flattenOn(fg: Rgba, bg: Rgba): Rgba {
  const a = Math.min(1, Math.max(0, fg.a));
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    a: 1,
  };
}

export function formatResolvedColor(value: string, againstBg?: Rgba | null): string {
  const parsed = parseCssColor(value);
  if (!parsed) return value;
  if (parsed.a <= ALPHA_TOLERANCE) return 'transparent';
  if (parsed.a < 1 - ALPHA_TOLERANCE && againstBg) {
    return rgbToHex(flattenOn(parsed, againstBg));
  }
  return rgbToHex(parsed);
}

function colorsEqual(a: Rgba, b: Rgba): boolean {
  return (
    Math.abs(a.r - b.r) <= CHANNEL_TOLERANCE &&
    Math.abs(a.g - b.g) <= CHANNEL_TOLERANCE &&
    Math.abs(a.b - b.b) <= CHANNEL_TOLERANCE &&
    Math.abs(a.a - b.a) <= ALPHA_TOLERANCE
  );
}

function copyAccessibleStyles(doc: Document) {
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const text = Array.from(sheet.cssRules)
        .map((rule) => rule.cssText)
        .join('\n');
      if (!text) continue;
      const style = doc.createElement('style');
      style.textContent = text;
      doc.head.appendChild(style);
    } catch {
      const node = sheet.ownerNode;
      if (node) doc.head.appendChild(node.cloneNode(true));
    }
  }
}

function makeThemedIframe(theme: 'light' | 'dark'): HTMLIFrameElement | null {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.tabIndex = -1;
  iframe.style.cssText =
    'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;border:0';
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    return null;
  }
  copyAccessibleStyles(doc);
  doc.documentElement.classList.toggle('dark', theme === 'dark');
  doc.body.style.background = 'var(--background)';
  const probe = doc.createElement('div');
  probe.setAttribute('data-token-probe', '');
  doc.body.appendChild(probe);
  return iframe;
}

export type ThemeProbes = {
  resolve: (theme: 'light' | 'dark', token: string) => string;
  background: (theme: 'light' | 'dark') => Rgba | null;
  dispose: () => void;
};

export function createThemeProbes(): ThemeProbes | null {
  const light = makeThemedIframe('light');
  const dark = makeThemedIframe('dark');
  if (!light?.contentDocument || !dark?.contentDocument) {
    light?.remove();
    dark?.remove();
    return null;
  }

  const frames = { light, dark } as const;

  function probeEl(theme: 'light' | 'dark'): HTMLElement | null {
    return frames[theme].contentDocument?.querySelector('[data-token-probe]') ?? null;
  }

  function view(theme: 'light' | 'dark'): Window | null {
    return frames[theme].contentWindow;
  }

  return {
    resolve(theme, token) {
      const el = probeEl(theme);
      const win = view(theme);
      if (!el || !win) return '';
      el.style.color = `var(${token})`;
      return win.getComputedStyle(el).color;
    },
    background(theme) {
      const el = probeEl(theme);
      const win = view(theme);
      if (!el || !win) return null;
      return parseCssColor(win.getComputedStyle(el.parentElement ?? el).backgroundColor);
    },
    dispose() {
      light.remove();
      dark.remove();
    },
  };
}

function probeColorOn(el: HTMLElement, token: string): string {
  const prev = el.style.color;
  el.style.color = `var(${token})`;
  const value = getComputedStyle(el).color;
  el.style.color = prev;
  return value;
}

export function isColorToken(name: string): boolean {
  if (!name.startsWith('--')) return false;
  if (
    /spacing|radius|rounded|duration|ease|font|icon|stroke|opacity|shadow|effect|leading|tracking|letter|text-/.test(
      name,
    )
  ) {
    /* `--text` semantic color is allowed; `--text-*` type tokens are not. */
    if (name === '--text') return true;
    if (name.startsWith('--text-')) return false;
    return false;
  }
  return (
    SEMANTIC_COLOR.has(name) ||
    name.startsWith('--theme-') ||
    name.startsWith('--tw-raw-') ||
    name.startsWith('--neutrals-') ||
    name.startsWith('--chart-') ||
    name.startsWith('--sidebar-') ||
    name.startsWith('--ring-')
  );
}

export function isRadiusToken(name: string): boolean {
  return (
    name.startsWith('--rounded-') ||
    name.startsWith('--tw-raw-radius-') ||
    name === '--radius'
  );
}

export function isStrokeToken(name: string): boolean {
  return name.startsWith('--stroke-');
}

export function isTypeToken(name: string): boolean {
  return name.startsWith('--text-') || name.startsWith('--font-');
}

export function isOpacityToken(name: string): boolean {
  return name.startsWith('--opacity-');
}

export function isShadowToken(name: string): boolean {
  return name.startsWith('--shadow-') || name.startsWith('--effect-');
}

function probeLength(token: string, cssProp: 'width' | 'fontSize' | 'borderWidth'): number | null {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
  probe.style[cssProp] = `var(${token})`;
  document.body.appendChild(probe);
  const px = parseFloat(getComputedStyle(probe)[cssProp]);
  probe.remove();
  return Number.isFinite(px) ? px : null;
}

function probeFontFamily(token: string): string {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
  probe.style.fontFamily = `var(${token})`;
  document.body.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily;
  probe.remove();
  return family;
}

function probeFontWeight(token: string): string {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
  probe.style.fontWeight = `var(${token})`;
  document.body.appendChild(probe);
  const weight = getComputedStyle(probe).fontWeight;
  probe.remove();
  return weight;
}

function probeShadow(token: string): string {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
  probe.style.boxShadow = `var(${token})`;
  document.body.appendChild(probe);
  const shadow = getComputedStyle(probe).boxShadow;
  probe.remove();
  return shadow;
}

function normalizeFamily(value: string): string {
  return value
    .split(',')
    .map((part) => part.trim().replace(/^["']|["']$/g, '').toLowerCase())
    .join(',');
}

function normalizeShadow(value: string): string {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

export type TokenCatalog = {
  colors: Array<{ name: string; value: string; parsed: Rgba }>;
  radii: Array<{ name: string; px: number }>;
  strokes: Array<{ name: string; px: number }>;
  typeSizes: Array<{ name: string; px: number }>;
  typeLineHeights: Array<{ name: string; px: number }>;
  typeLetterSpacing: Array<{ name: string; px: number }>;
  typeFamilies: Array<{ name: string; value: string }>;
  typeWeights: Array<{ name: string; value: string }>;
  opacities: Array<{ name: string; value: number }>;
  shadows: Array<{ name: string; value: string }>;
};

export function buildTokenCatalog(): TokenCatalog {
  const catalog: TokenCatalog = {
    colors: [],
    radii: [],
    strokes: [],
    typeSizes: [],
    typeLineHeights: [],
    typeLetterSpacing: [],
    typeFamilies: [],
    typeWeights: [],
    opacities: [],
    shadows: [],
  };

  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
  document.body.appendChild(probe);

  for (const name of collectCssVarNames(isColorToken)) {
    const value = probeColorOn(probe, name);
    const parsed = parseCssColor(value);
    if (!parsed) continue;
    catalog.colors.push({ name, value, parsed });
  }
  probe.remove();

  for (const name of collectCssVarNames(isRadiusToken)) {
    const px = probeLength(name, 'width');
    if (px == null) continue;
    catalog.radii.push({ name, px });
  }
  for (const name of collectCssVarNames(isStrokeToken)) {
    const px = probeLength(name, 'borderWidth');
    if (px == null) continue;
    catalog.strokes.push({ name, px });
  }
  for (const name of collectCssVarNames(isTypeToken)) {
    if (name.endsWith('-font-size')) {
      const px = probeLength(name, 'fontSize');
      if (px != null) catalog.typeSizes.push({ name, px });
    } else if (name.endsWith('-line-height')) {
      const px = probeLength(name, 'fontSize');
      if (px != null) catalog.typeLineHeights.push({ name, px });
    } else if (name.endsWith('-letter-spacing')) {
      const px = probeLength(name, 'fontSize');
      if (px != null) catalog.typeLetterSpacing.push({ name, px });
    } else if (name.endsWith('-font-family') || name.startsWith('--font-family-')) {
      catalog.typeFamilies.push({ name, value: probeFontFamily(name) });
    } else if (name.endsWith('-font-weight') || name.startsWith('--font-weight-')) {
      catalog.typeWeights.push({ name, value: probeFontWeight(name) });
    }
  }
  for (const name of collectCssVarNames(isOpacityToken)) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const value = parseFloat(raw);
    if (Number.isFinite(value)) catalog.opacities.push({ name, value });
  }
  for (const name of collectCssVarNames(isShadowToken)) {
    catalog.shadows.push({ name, value: probeShadow(name) });
  }

  return catalog;
}

function pickNamed<T extends { name: string }>(
  hits: T[],
  rank: (name: string) => number,
): T | null {
  if (hits.length === 0) return null;
  hits.sort((a, b) => {
    const ar = rank(a.name);
    const br = rank(b.name);
    if (ar !== br) return ar - br;
    return a.name.length - b.name.length;
  });
  return hits[0] ?? null;
}

export function matchColor(value: string, catalog: TokenCatalog): string | null {
  const parsed = parseCssColor(value);
  if (!parsed) return null;
  const hits = catalog.colors.filter((entry) => colorsEqual(entry.parsed, parsed));
  return pickNamed(hits, colorRank)?.name ?? null;
}

export function matchPx(
  px: number,
  entries: Array<{ name: string; px: number }>,
  role: 'radius' | 'stroke' | 'type',
  preferPrefix?: string,
): string | null {
  const hits = entries.filter((entry) => Math.abs(entry.px - px) <= PX_TOLERANCE);
  if (preferPrefix) {
    const related = hits.filter((entry) => entry.name.startsWith(preferPrefix));
    const picked = pickNamed(related, (name) => lengthRank(name, role));
    if (picked) return picked.name;
  }
  return pickNamed(hits, (name) => lengthRank(name, role))?.name ?? null;
}

export function matchFontFamily(
  value: string,
  catalog: TokenCatalog,
  preferPrefix?: string,
): string | null {
  const n = normalizeFamily(value);
  const hits = catalog.typeFamilies.filter((entry) => normalizeFamily(entry.value) === n);
  if (preferPrefix) {
    const related = hits.filter((entry) => entry.name.startsWith(preferPrefix));
    const picked = pickNamed(related, (name) => lengthRank(name, 'type'));
    if (picked) return picked.name;
  }
  return pickNamed(hits, (name) => lengthRank(name, 'type'))?.name ?? null;
}

export function matchFontWeight(
  value: string,
  catalog: TokenCatalog,
  preferPrefix?: string,
): string | null {
  const n = String(parseInt(value, 10) || value);
  const hits = catalog.typeWeights.filter((entry) => {
    const w = String(parseInt(entry.value, 10) || entry.value);
    return w === n;
  });
  if (preferPrefix) {
    const related = hits.filter((entry) => entry.name.startsWith(preferPrefix));
    const picked = pickNamed(related, (name) => lengthRank(name, 'type'));
    if (picked) return picked.name;
  }
  return pickNamed(hits, (name) => lengthRank(name, 'type'))?.name ?? null;
}

export function matchOpacity(value: number, catalog: TokenCatalog): string | null {
  const hits = catalog.opacities.filter(
    (entry) => Math.abs(entry.value - value) <= ALPHA_TOLERANCE,
  );
  return pickNamed(hits, () => 0)?.name ?? null;
}

export function matchShadow(value: string, catalog: TokenCatalog): string | null {
  const n = normalizeShadow(value);
  if (!n || n === 'none') return null;
  const hits = catalog.shadows.filter((entry) => normalizeShadow(entry.value) === n);
  return pickNamed(hits, (name) => (name.startsWith('--shadow-') ? 0 : 1))?.name ?? null;
}

export function themedColor(
  computed: string,
  catalog: TokenCatalog,
  probes: ThemeProbes | null,
): ThemedColor {
  const token = matchColor(computed, catalog);
  const currentBg = parseCssColor(getComputedStyle(document.documentElement).backgroundColor);
  const current = formatResolvedColor(computed, currentBg);
  if (!token || !probes) {
    return { token, current, light: null, dark: null };
  }
  const lightRaw = probes.resolve('light', token);
  const darkRaw = probes.resolve('dark', token);
  return {
    token,
    current,
    light: formatResolvedColor(lightRaw, probes.background('light')),
    dark: formatResolvedColor(darkRaw, probes.background('dark')),
  };
}

export function parsePx(value: string): number {
  if (value === 'normal' || value === 'auto') return 0;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export function formatPx(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return `${rounded}px`;
}

const VAR_RE = /var\((--[a-zA-Z0-9-]+)\)/g;

export type ClassTokenHit = {
  label: string;
  token: string;
};

function hoverLabel(cls: string, token: string): string {
  const kind =
    cls.includes('placeholder')
      ? 'Placeholder'
      : cls.includes('group-data-open') || cls.includes('data-open')
        ? 'Open'
        : cls.includes('group-hover') || cls.includes('hover:')
          ? 'Hover'
          : cls.includes('active:') || cls.includes('data-[pressed]')
            ? 'Pressed'
            : cls.includes('focus-visible')
              ? 'Focus'
              : 'State';
  if (cls.includes('bg-') || cls.includes('bg-[')) {
    return `${kind} background`;
  }
  if (cls.includes('text-') || cls.includes('text-[')) return `${kind} color`;
  if (cls.includes('opacity')) return `${kind} opacity`;
  if (cls.includes('shadow')) return `${kind} shadow`;
  if (cls.includes('border')) return `${kind} border`;
  return `${kind} ${token}`;
}

export function classStateTokens(el: Element): ClassTokenHit[] {
  const className = typeof el.className === 'string' ? el.className : '';
  const hits: ClassTokenHit[] = [];
  const seen = new Set<string>();
  for (const cls of className.split(/\s+/)) {
    if (!cls) continue;
    const isState = /(?:^|:)(hover|active|focus-visible|placeholder|data-open|group-hover|group-data-open|data-\[pressed\])/.test(
      cls,
    );
    if (!isState) continue;
    for (const match of cls.matchAll(VAR_RE)) {
      const token = match[1];
      const label = hoverLabel(cls, token);
      const key = `${label}|${token}`;
      if (seen.has(key)) continue;
      seen.add(key);
      hits.push({ label, token });
    }
  }
  return hits;
}
