/**
 * Story-only spec sheet. Reads non-spatial Foundations values from the live
 * DOM (computed styles + class-listed state tokens) and lists them grouped
 * by named target. Pair with MeasurementOverlay for spacing / size.
 *
 * Do not use this in shipped components.
 */

import { PanelRightIcon } from 'lucide-react';
import {
  useCallback,
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react';

import { cn } from '@/lib/utils';
import { IconButton } from '@/primitives/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/primitives/sheet';

import {
  buildTokenCatalog,
  classStateTokens,
  createThemeProbes,
  formatPx,
  formatResolvedColor,
  isOpacityToken,
  isShadowToken,
  matchFontFamily,
  matchFontWeight,
  matchOpacity,
  matchPx,
  matchShadow,
  parsePx,
  themedColor,
  type ThemeProbes,
  type ThemedColor,
  type TokenCatalog,
} from './liveTokens';

export type SpecTarget = {
  /** Group heading in the sheet. */
  name: string;
  /** querySelector from the component root. Omit to measure the root. */
  selector?: string;
  /**
   * Nested node for typography / color when `selector` is a shell
   * (e.g. input inside Input Group).
   */
  textSelector?: string;
  /** Extra color node (e.g. prepend text). */
  colorSelector?: string;
};

export type TokenSpecSheetProps = {
  title: string;
  description?: string;
  subjectRef: RefObject<HTMLElement | null>;
  targets: SpecTarget[];
  /** If `subjectRef` is a wrapper, find the component root inside it. */
  rootSelector?: string;
  className?: string;
};

type SpecRow = {
  property: string;
  token: string | null;
  resolved: string;
  light?: string | null;
  dark?: string | null;
};

type SpecGroup = {
  name: string;
  rows: SpecRow[];
};

const captionStyle: CSSProperties = {
  fontFamily: 'var(--text-caption-mini-font-family)',
  fontWeight: 'var(--text-caption-mini-font-weight)' as CSSProperties['fontWeight'],
  fontSize: 'var(--text-caption-mini-font-size)',
  lineHeight: 'var(--text-caption-mini-line-height)',
  letterSpacing: 'var(--text-caption-mini-letter-spacing)',
};

const monoStyle: CSSProperties = {
  fontFamily: 'var(--text-monospaced-font-family)',
  fontWeight: 'var(--text-monospaced-font-weight)' as CSSProperties['fontWeight'],
  fontSize: 'var(--text-caption-mini-font-size)',
  lineHeight: 'var(--text-caption-mini-line-height)',
  letterSpacing: 'var(--text-monospaced-letter-spacing)',
};

const groupHeadingStyle: CSSProperties = {
  fontFamily: 'var(--text-paragraph-small-medium-font-family)',
  fontWeight: 'var(--text-paragraph-small-medium-font-weight)' as CSSProperties['fontWeight'],
  fontSize: 'var(--text-paragraph-small-medium-font-size)',
  lineHeight: 'var(--text-paragraph-small-medium-line-height)',
  letterSpacing: 'var(--text-paragraph-small-medium-letter-spacing)',
};

function resolveRoot(
  host: HTMLElement | null,
  rootSelector?: string,
): HTMLElement | null {
  if (!host) return null;
  if (rootSelector) {
    return (host.matches(rootSelector) ? host : host.querySelector(rootSelector)) as
      | HTMLElement
      | null;
  }
  return (host.firstElementChild as HTMLElement | null) ?? host;
}

function colorRow(property: string, color: ThemedColor): SpecRow {
  const same =
    color.light && color.dark && color.light === color.dark ? color.light : null;
  return {
    property,
    token: color.token,
    resolved: same ?? color.current,
    light: same ? null : color.light,
    dark: same ? null : color.dark,
  };
}

function lengthRow(property: string, px: number, token: string | null): SpecRow {
  return {
    property,
    token,
    resolved: formatPx(px),
  };
}

function textRow(property: string, token: string | null, resolved: string): SpecRow {
  return { property, token, resolved };
}

function isTextish(el: HTMLElement): boolean {
  const tag = el.tagName;
  return (
    tag === 'SPAN' ||
    tag === 'P' ||
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'LABEL' ||
    tag === 'A' ||
    tag === 'H1' ||
    tag === 'H2' ||
    tag === 'H3' ||
    tag === 'H4' ||
    tag === 'H5' ||
    tag === 'H6'
  );
}

function colorFromNamedToken(token: string, probes: ThemeProbes | null): ThemedColor {
  if (!probes) {
    return { token, current: token, light: null, dark: null };
  }
  const isDark = document.documentElement.classList.contains('dark');
  const lightRaw = probes.resolve('light', token);
  const darkRaw = probes.resolve('dark', token);
  const currentRaw = isDark ? darkRaw : lightRaw;
  const currentTheme = isDark ? 'dark' : 'light';
  return {
    token,
    current: formatResolvedColor(currentRaw, probes.background(currentTheme)),
    light: formatResolvedColor(lightRaw, probes.background('light')),
    dark: formatResolvedColor(darkRaw, probes.background('dark')),
  };
}

function readTypography(
  el: HTMLElement,
  catalog: TokenCatalog,
  probes: ThemeProbes | null,
  rows: SpecRow[],
) {
  const cs = getComputedStyle(el);
  rows.push(colorRow('Color', themedColor(cs.color, catalog, probes)));
  const sizePx = parsePx(cs.fontSize);
  const sizeToken = matchPx(sizePx, catalog.typeSizes, 'type');
  const prefix = sizeToken?.replace(/-font-size$/, '');
  rows.push(
    textRow(
      'Font family',
      matchFontFamily(cs.fontFamily, catalog, prefix),
      cs.fontFamily.replace(/"/g, ''),
    ),
  );
  rows.push(lengthRow('Size', sizePx, sizeToken));
  rows.push(
    textRow('Weight', matchFontWeight(cs.fontWeight, catalog, prefix), cs.fontWeight),
  );
  const lhPx = cs.lineHeight === 'normal' ? sizePx : parsePx(cs.lineHeight);
  rows.push(
    lengthRow('Line height', lhPx, matchPx(lhPx, catalog.typeLineHeights, 'type', prefix)),
  );
  const lsPx = cs.letterSpacing === 'normal' ? 0 : parsePx(cs.letterSpacing);
  rows.push(
    lengthRow(
      'Letter spacing',
      lsPx,
      matchPx(lsPx, catalog.typeLetterSpacing, 'type', prefix),
    ),
  );
}

function readBox(
  el: HTMLElement,
  catalog: TokenCatalog,
  probes: ThemeProbes | null,
  rows: SpecRow[],
) {
  const cs = getComputedStyle(el);
  rows.push(colorRow('Background', themedColor(cs.backgroundColor, catalog, probes)));

  const widthPx = parsePx(cs.borderTopWidth);
  rows.push(
    lengthRow('Border width', widthPx, matchPx(widthPx, catalog.strokes, 'stroke')),
  );
  rows.push(colorRow('Border color', themedColor(cs.borderTopColor, catalog, probes)));

  const radiusPx = parsePx(cs.borderTopLeftRadius);
  rows.push(lengthRow('Radius', radiusPx, matchPx(radiusPx, catalog.radii, 'radius')));

  const shadow = cs.boxShadow;
  if (!shadow || shadow === 'none') {
    rows.push(textRow('Shadow', null, 'none'));
  } else {
    rows.push(textRow('Shadow', matchShadow(shadow, catalog), shadow));
  }

  const opacity = Number(cs.opacity);
  if (Number.isFinite(opacity) && opacity < 1) {
    rows.push(textRow('Opacity', matchOpacity(opacity, catalog), String(opacity)));
  }
}

function readStateTokens(
  el: HTMLElement,
  catalog: TokenCatalog,
  probes: ThemeProbes | null,
  rows: SpecRow[],
) {
  const existing = new Set(rows.map((row) => row.property));
  for (const hit of classStateTokens(el)) {
    if (existing.has(hit.label)) continue;
    existing.add(hit.label);
    if (isOpacityToken(hit.token)) {
      const entry = catalog.opacities.find((item) => item.name === hit.token);
      rows.push(textRow(hit.label, hit.token, entry ? String(entry.value) : hit.token));
      continue;
    }
    if (isShadowToken(hit.token)) {
      const entry = catalog.shadows.find((item) => item.name === hit.token);
      rows.push(textRow(hit.label, hit.token, entry?.value ?? hit.token));
      continue;
    }
    rows.push(colorRow(hit.label, colorFromNamedToken(hit.token, probes)));
  }
}

function readTarget(
  root: HTMLElement,
  target: SpecTarget,
  catalog: TokenCatalog,
  probes: ThemeProbes | null,
): SpecGroup | null {
  const el = target.selector
    ? (root.querySelector(target.selector) as HTMLElement | null)
    : root;
  if (!el) return null;

  const rows: SpecRow[] = [];
  readBox(el, catalog, probes, rows);

  const textEl = target.textSelector
    ? ((el.querySelector(target.textSelector) as HTMLElement | null) ??
      (root.querySelector(target.textSelector) as HTMLElement | null))
    : isTextish(el)
      ? el
      : null;

  if (textEl) {
    readTypography(textEl, catalog, probes, rows);
    if (textEl.tagName === 'INPUT' || textEl.tagName === 'TEXTAREA') {
      const placeholder = getComputedStyle(textEl, '::placeholder');
      if (placeholder.color) {
        rows.push(
          colorRow('Placeholder color', themedColor(placeholder.color, catalog, probes)),
        );
      }
    }
  }

  if (target.colorSelector) {
    const extra =
      (el.querySelector(target.colorSelector) as HTMLElement | null) ??
      (root.querySelector(target.colorSelector) as HTMLElement | null);
    if (extra) {
      rows.push(
        colorRow(
          'Prepend color',
          themedColor(getComputedStyle(extra).color, catalog, probes),
        ),
      );
    }
  }

  const svg = el.querySelector('svg');
  if (svg) {
    const opacity = Number(getComputedStyle(svg).opacity);
    if (Number.isFinite(opacity)) {
      rows.push(
        textRow('Glyph opacity', matchOpacity(opacity, catalog), String(opacity)),
      );
    }
  }

  readStateTokens(el, catalog, probes, rows);
  if (textEl && textEl !== el) readStateTokens(textEl, catalog, probes, rows);

  return { name: target.name, rows };
}

function formatValue(row: SpecRow): string {
  const token = row.token ?? '(unmatched)';
  if (row.light && row.dark) {
    return `${token} (light ${row.light} · dark ${row.dark})`;
  }
  return `${token} (${row.resolved})`;
}

function readSpec(
  host: HTMLElement | null,
  targets: SpecTarget[],
  rootSelector?: string,
): SpecGroup[] {
  const root = resolveRoot(host, rootSelector);
  if (!root) return [];
  const catalog = buildTokenCatalog();
  const probes = createThemeProbes();
  try {
    return targets
      .map((target) => readTarget(root, target, catalog, probes))
      .filter((group): group is SpecGroup => group != null);
  } finally {
    probes?.dispose();
  }
}

export function TokenSpecSheet({
  title,
  description = 'Non-spatial Foundations values, read live from computed styles. Spatial marks stay on the measurement overlay.',
  subjectRef,
  targets,
  rootSelector,
  className,
}: TokenSpecSheetProps) {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<SpecGroup[]>([]);

  const snapshot = useCallback(() => {
    setGroups(readSpec(subjectRef.current, targets, rootSelector));
  }, [rootSelector, subjectRef, targets]);

  useLayoutEffect(() => {
    if (!open) return;
    snapshot();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const queued = () => {
      clearTimeout(timer);
      timer = setTimeout(snapshot, 120);
    };
    const host = subjectRef.current;
    const obs = new MutationObserver(queued);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    if (host) {
      obs.observe(host, {
        attributes: true,
        subtree: true,
        characterData: true,
        childList: true,
      });
    }
    return () => {
      clearTimeout(timer);
      obs.disconnect();
    };
  }, [open, snapshot, subjectRef]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="View spec"
            className={cn(className)}
          />
        }
      >
        <PanelRightIcon />
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-[var(--spacing-md)] pb-[var(--spacing-md)]">
          {groups.length === 0 ? (
            <p className="text-[color:var(--muted-foreground)]" style={captionStyle}>
              No live subject. Attach <code>subjectRef</code> to the rendered
              component.
            </p>
          ) : (
            <div className="flex flex-col gap-[var(--spacing-xl)]">
              {groups.map((group) => (
                <section key={group.name}>
                  <h3
                    className="mb-[var(--spacing-sm)] text-[color:var(--foreground)]"
                    style={groupHeadingStyle}
                  >
                    {group.name}
                  </h3>
                  <dl className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] gap-x-[var(--spacing-md)] gap-y-[var(--spacing-2xs)]">
                    {group.rows.map((row) => (
                      <div key={`${group.name}-${row.property}`} className="contents">
                        <dt
                          className="text-[color:var(--muted-foreground)]"
                          style={captionStyle}
                        >
                          {row.property}
                        </dt>
                        <dd
                          className="min-w-0 break-words text-[color:var(--foreground)]"
                          style={monoStyle}
                          title={formatValue(row)}
                        >
                          {formatValue(row)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
