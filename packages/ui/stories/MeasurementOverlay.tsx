/**
 * Story-only measurement overlay. Reads padding, gap, and box size from the
 * live DOM (getComputedStyle / getBoundingClientRect) and labels each mark
 * with the resolved pixel value plus the Foundations token that matches it.
 *
 * Presentation is Figma-style redline: the subject stays un-annotated in the
 * center; dimension lines and labels sit outside its bounding box in stacked
 * lanes (padding nearest, gaps next, overall size furthest).
 *
 * Do not use this in shipped components — it exists so stories can catch
 * token/name vs rendered-px mismatches against Figma.
 */

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';

export type MeasurementProperty = 'padding' | 'gap' | 'width' | 'height';

export type MeasurementTarget = {
  /** querySelector from the subject root. Omit to measure the subject itself. */
  selector?: string;
  name: string;
  measure: MeasurementProperty[];
};

export type MeasurementOverlayProps = {
  enabled: boolean;
  children: ReactNode;
  targets?: MeasurementTarget[];
  className?: string;
};

type TokenEntry = {
  name: string;
  px: number;
  rank: number;
};

type Side = 'top' | 'right' | 'bottom' | 'left';

type RawSpan = {
  id: string;
  kind: MeasurementProperty;
  title: string;
  px: number;
  token: string | null;
  side: Side;
  /** Measured interval in overlay-local coordinates. */
  u1: number;
  u2: number;
};

type Mark = {
  id: string;
  kind: MeasurementProperty;
  title: string;
  px: number;
  token: string | null;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  labelX: number;
  labelY: number;
  labelTx: string;
  labelTy: string;
  witnesses: Array<{ x1: number; y1: number; x2: number; y2: number }>;
};

const DEFAULT_TARGETS: MeasurementTarget[] = [
  {
    name: 'container',
    measure: ['padding', 'gap', 'width', 'height'],
  },
];

const TOKEN_RANK: Array<{ test: (name: string) => boolean; rank: number }> = [
  { test: (n) => n.startsWith('--icon-'), rank: 0 },
  { test: (n) => n.startsWith('--spacing-'), rank: 1 },
  { test: (n) => n.startsWith('--rounded-') || n === '--radius', rank: 2 },
  { test: (n) => n.startsWith('--tw-raw-spacing-'), rank: 3 },
  { test: (n) => n.startsWith('--tw-raw-radius-'), rank: 4 },
];

const SPACE_RANK: Array<{ test: (name: string) => boolean; rank: number }> = [
  { test: (n) => n.startsWith('--spacing-'), rank: 0 },
  { test: (n) => n.startsWith('--tw-raw-spacing-'), rank: 1 },
  { test: (n) => n.startsWith('--icon-'), rank: 2 },
];

const PX_TOLERANCE = 0.51;

const captionStyle: CSSProperties = {
  fontFamily: 'var(--text-caption-mini-font-family)',
  fontWeight: 'var(--text-caption-mini-font-weight)' as CSSProperties['fontWeight'],
  fontSize: 'var(--text-caption-mini-font-size)',
  lineHeight: 'var(--text-caption-mini-line-height)',
  letterSpacing: 'var(--text-caption-mini-letter-spacing)',
};

function isFoundationsLengthToken(name: string): boolean {
  return (
    name.startsWith('--spacing-') ||
    name.startsWith('--tw-raw-spacing-') ||
    name.startsWith('--rounded-') ||
    name.startsWith('--tw-raw-radius-') ||
    name.startsWith('--icon-') ||
    name === '--radius'
  );
}

function walkCssRules(rules: CSSRuleList, names: Set<string>) {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule) {
      const sel = rule.selectorText ?? '';
      if (!sel.includes(':root') && !sel.includes('.dark')) continue;
      for (const name of Array.from(rule.style)) {
        if (isFoundationsLengthToken(name)) names.add(name);
      }
    } else if ('cssRules' in rule) {
      try {
        walkCssRules((rule as CSSGroupingRule).cssRules, names);
      } catch {
        /* cross-origin or empty grouping rule */
      }
    }
  }
}

function collectTokenNames(): string[] {
  const names = new Set<string>();
  const computed = getComputedStyle(document.documentElement);
  for (let i = 0; i < computed.length; i++) {
    const name = computed.item(i);
    if (isFoundationsLengthToken(name)) names.add(name);
  }
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      walkCssRules(sheet.cssRules, names);
    } catch {
      /* constructed / CORS stylesheet */
    }
  }
  return [...names];
}

function tokenToPx(name: string): number | null {
  const probe = document.createElement('div');
  probe.style.cssText = [
    'position:absolute',
    'visibility:hidden',
    'pointer-events:none',
    `width:var(${name})`,
    `height:var(${name})`,
  ].join(';');
  document.body.appendChild(probe);
  const px = parseFloat(getComputedStyle(probe).width);
  probe.remove();
  return Number.isFinite(px) ? px : null;
}

function buildCatalog(): TokenEntry[] {
  const entries: TokenEntry[] = [];
  for (const name of collectTokenNames()) {
    const px = tokenToPx(name);
    if (px == null) continue;
    const rank = TOKEN_RANK.find((row) => row.test(name))?.rank ?? 99;
    entries.push({ name, px, rank });
  }
  return entries;
}

function matchToken(
  px: number,
  catalog: TokenEntry[],
  role: 'space' | 'size',
): string | null {
  const hits = catalog.filter((t) => Math.abs(t.px - px) <= PX_TOLERANCE);
  if (hits.length === 0) return null;
  const table = role === 'space' ? SPACE_RANK : TOKEN_RANK;
  hits.sort((a, b) => {
    const ar = table.find((row) => row.test(a.name))?.rank ?? 99;
    const br = table.find((row) => row.test(b.name))?.rank ?? 99;
    if (ar !== br) return ar - br;
    return a.name.length - b.name.length;
  });
  return hits[0]?.name ?? null;
}

function formatPx(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return `${rounded}px`;
}

function markLabel(px: number, token: string | null): string {
  return token ? `${formatPx(px)} · ${token}` : `${formatPx(px)} · (content)`;
}

function parsePx(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function toLocal(
  rect: DOMRect,
  origin: DOMRect,
): { x: number; y: number; w: number; h: number } {
  return {
    x: rect.left - origin.left,
    y: rect.top - origin.top,
    w: rect.width,
    h: rect.height,
  };
}

function visibleChildren(el: HTMLElement): HTMLElement[] {
  return Array.from(el.children).filter((node): node is HTMLElement => {
    if (!(node instanceof HTMLElement)) return false;
    const cs = getComputedStyle(node);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = node.getBoundingClientRect();
    return r.width > 0 || r.height > 0;
  });
}

function kindLane(kind: MeasurementProperty): number {
  if (kind === 'padding') return 0;
  if (kind === 'gap') return 1;
  return 2;
}

function catalogPx(catalog: TokenEntry[], name: string, fallback: number): number {
  return catalog.find((t) => t.name === name)?.px ?? tokenToPx(name) ?? fallback;
}

/**
 * Live engine: read spans from the DOM. Placement (lanes, labels) is a
 * separate pass so a Figma-style redline never draws on the subject.
 */
function collectSpans(
  subject: HTMLElement,
  overlay: HTMLElement,
  targets: MeasurementTarget[],
  catalog: TokenEntry[],
): RawSpan[] {
  const origin = overlay.getBoundingClientRect();
  const spans: RawSpan[] = [];

  for (const target of targets) {
    const el = target.selector
      ? (subject.querySelector(target.selector) as HTMLElement | null)
      : subject;
    if (!el) continue;
    const box = toLocal(el.getBoundingClientRect(), origin);
    const cs = getComputedStyle(el);

    if (target.measure.includes('width')) {
      const px = el.getBoundingClientRect().width;
      spans.push({
        id: `${target.name}-width`,
        kind: 'width',
        title: `${target.name} width`,
        px,
        token: matchToken(px, catalog, 'size'),
        side: 'top',
        u1: box.x,
        u2: box.x + box.w,
      });
    }

    if (target.measure.includes('height')) {
      const px = el.getBoundingClientRect().height;
      spans.push({
        id: `${target.name}-height`,
        kind: 'height',
        title: `${target.name} height`,
        px,
        token: matchToken(px, catalog, 'size'),
        side: 'right',
        u1: box.y,
        u2: box.y + box.h,
      });
    }

    if (target.measure.includes('padding')) {
      const pad = {
        top: parsePx(cs.paddingTop),
        right: parsePx(cs.paddingRight),
        bottom: parsePx(cs.paddingBottom),
        left: parsePx(cs.paddingLeft),
      };
      if (pad.top > 0) {
        spans.push({
          id: `${target.name}-padding-top`,
          kind: 'padding',
          title: `${target.name} padding-top`,
          px: pad.top,
          token: matchToken(pad.top, catalog, 'space'),
          side: 'left',
          u1: box.y,
          u2: box.y + pad.top,
        });
      }
      if (pad.bottom > 0) {
        spans.push({
          id: `${target.name}-padding-bottom`,
          kind: 'padding',
          title: `${target.name} padding-bottom`,
          px: pad.bottom,
          token: matchToken(pad.bottom, catalog, 'space'),
          side: 'left',
          u1: box.y + box.h - pad.bottom,
          u2: box.y + box.h,
        });
      }
      if (pad.left > 0) {
        spans.push({
          id: `${target.name}-padding-left`,
          kind: 'padding',
          title: `${target.name} padding-left`,
          px: pad.left,
          token: matchToken(pad.left, catalog, 'space'),
          side: 'bottom',
          u1: box.x,
          u2: box.x + pad.left,
        });
      }
      if (pad.right > 0) {
        spans.push({
          id: `${target.name}-padding-right`,
          kind: 'padding',
          title: `${target.name} padding-right`,
          px: pad.right,
          token: matchToken(pad.right, catalog, 'space'),
          side: 'bottom',
          u1: box.x + box.w - pad.right,
          u2: box.x + box.w,
        });
      }
    }

    if (target.measure.includes('gap')) {
      const kids = visibleChildren(el);
      const column = cs.flexDirection.startsWith('column');
      if (kids.length >= 2) {
        const a = toLocal(kids[0].getBoundingClientRect(), origin);
        const b = toLocal(kids[1].getBoundingClientRect(), origin);
        if (column) {
          const px = b.y - (a.y + a.h);
          spans.push({
            id: `${target.name}-gap`,
            kind: 'gap',
            title: `${target.name} gap`,
            px,
            token: matchToken(px, catalog, 'space'),
            side: 'left',
            u1: a.y + a.h,
            u2: b.y,
          });
        } else {
          const px = b.x - (a.x + a.w);
          spans.push({
            id: `${target.name}-gap`,
            kind: 'gap',
            title: `${target.name} gap`,
            px,
            token: matchToken(px, catalog, 'space'),
            side: 'bottom',
            u1: a.x + a.w,
            u2: b.x,
          });
        }
      }
    }
  }

  return spans;
}

function layoutMarks(
  spans: RawSpan[],
  subject: { x: number; y: number; w: number; h: number },
  catalog: TokenEntry[],
): Mark[] {
  const inset = catalogPx(catalog, '--spacing-lg', 20);
  const pitch = catalogPx(catalog, '--spacing-3xl', 40);
  const labelGap = catalogPx(catalog, '--spacing-sm', 12);

  const bySide: Record<Side, RawSpan[]> = {
    top: [],
    right: [],
    bottom: [],
    left: [],
  };
  for (const span of spans) bySide[span.side].push(span);

  const marks: Mark[] = [];

  (Object.keys(bySide) as Side[]).forEach((side) => {
    const group = bySide[side];
    if (group.length === 0) return;
    const unique = [...new Set(group.map((s) => kindLane(s.kind)))].sort(
      (a, b) => a - b,
    );
    const remap = new Map(unique.map((lane, i) => [lane, i]));

    for (const span of group) {
      const lane = remap.get(kindLane(span.kind)) ?? 0;
      const dist = inset + lane * pitch;
      const u1 = Math.min(span.u1, span.u2);
      const u2 = Math.max(span.u1, span.u2);
      const mid = (u1 + u2) / 2;
      const short = u2 - u1 < 48;

      if (side === 'top' || side === 'bottom') {
        const dimY =
          side === 'top' ? subject.y - dist : subject.y + subject.h + dist;
        const edgeY = side === 'top' ? subject.y : subject.y + subject.h;
        const labelY =
          side === 'top' ? dimY - labelGap : dimY + labelGap;
        let labelX = mid;
        let labelTx = '-50%';
        if (short && span.kind === 'padding') {
          if (span.id.endsWith('-left')) {
            labelX = u1;
            labelTx = '-100%';
          } else if (span.id.endsWith('-right')) {
            labelX = u2;
            labelTx = '0';
          }
        }
        marks.push({
          ...span,
          x1: u1,
          y1: dimY,
          x2: u2,
          y2: dimY,
          labelX,
          labelY,
          labelTx,
          labelTy: side === 'top' ? '-100%' : '0',
          witnesses: [
            { x1: u1, y1: edgeY, x2: u1, y2: dimY },
            { x1: u2, y1: edgeY, x2: u2, y2: dimY },
          ],
        });
      } else {
        const dimX =
          side === 'left' ? subject.x - dist : subject.x + subject.w + dist;
        const edgeX = side === 'left' ? subject.x : subject.x + subject.w;
        const labelX =
          side === 'left' ? dimX - labelGap : dimX + labelGap;
        marks.push({
          ...span,
          x1: dimX,
          y1: u1,
          x2: dimX,
          y2: u2,
          labelX,
          labelY: mid,
          labelTx: side === 'left' ? '-100%' : '0',
          labelTy: '-50%',
          witnesses: [
            { x1: edgeX, y1: u1, x2: dimX, y2: u1 },
            { x1: edgeX, y1: u2, x2: dimX, y2: u2 },
          ],
        });
      }
    }
  });

  return marks;
}

function DimLine({ mark, tick }: { mark: Mark; tick: number }) {
  const horizontal = mark.y1 === mark.y2;
  /*
   * Contrast vs story `--background` (WCAG, relative luminance):
   *   --foreground  light #080B0C on #E7E5E4 = 15.73:1
   *                 dark  #F9F9F9 on #27272A = 14.15:1
   *   --muted-foreground (guides)  light ~#616262 = 4.87:1 / dark ~#A5A5A6 = 6.05:1
   * Previous labels used `--tw-raw-secondary-600` (#422DA8) = 1.54:1 in dark.
   */
  const color = 'var(--foreground)';
  const guide = 'var(--muted-foreground)';
  return (
    <g>
      {mark.witnesses.map((w, i) => (
        <line
          key={`${mark.id}-w${i}`}
          x1={w.x1}
          y1={w.y1}
          x2={w.x2}
          y2={w.y2}
          stroke={guide}
          strokeWidth={1}
          strokeDasharray="2 3"
        />
      ))}
      <line
        x1={mark.x1}
        y1={mark.y1}
        x2={mark.x2}
        y2={mark.y2}
        stroke={color}
        strokeWidth={1}
      />
      {horizontal ? (
        <>
          <line
            x1={mark.x1}
            y1={mark.y1 - tick}
            x2={mark.x1}
            y2={mark.y1 + tick}
            stroke={color}
            strokeWidth={1}
          />
          <line
            x1={mark.x2}
            y1={mark.y2 - tick}
            x2={mark.x2}
            y2={mark.y2 + tick}
            stroke={color}
            strokeWidth={1}
          />
        </>
      ) : (
        <>
          <line
            x1={mark.x1 - tick}
            y1={mark.y1}
            x2={mark.x1 + tick}
            y2={mark.y1}
            stroke={color}
            strokeWidth={1}
          />
          <line
            x1={mark.x2 - tick}
            y1={mark.y2}
            x2={mark.x2 + tick}
            y2={mark.y2}
            stroke={color}
            strokeWidth={1}
          />
        </>
      )}
    </g>
  );
}

export function MeasurementOverlay({
  enabled,
  children,
  targets = DEFAULT_TARGETS,
  className,
}: MeasurementOverlayProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [tick, setTick] = useState(4);

  useLayoutEffect(() => {
    if (!enabled) {
      setMarks([]);
      return;
    }

    const stage = stageRef.current;
    const host = subjectRef.current;
    const subject = host?.firstElementChild;
    if (!stage || !(subject instanceof HTMLElement)) return;

    let catalog = buildCatalog();

    const measure = () => {
      if (catalog.length === 0) catalog = buildCatalog();
      const nextTick = catalogPx(catalog, '--spacing-2xs', 4);
      setTick(nextTick);
      const origin = stage.getBoundingClientRect();
      const box = toLocal(subject.getBoundingClientRect(), origin);
      const spans = collectSpans(subject, stage, targets, catalog);
      setMarks(layoutMarks(spans, box, catalog));
    };

    let cancelled = false;
    const safeMeasure = () => {
      if (!cancelled) measure();
    };

    safeMeasure();
    const ro = new ResizeObserver(safeMeasure);
    ro.observe(subject);
    ro.observe(stage);
    void document.fonts?.ready.then(safeMeasure);
    window.addEventListener('resize', safeMeasure);
    const theme = new MutationObserver(safeMeasure);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    const tree = new MutationObserver(safeMeasure);
    tree.observe(subject, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
    });

    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener('resize', safeMeasure);
      theme.disconnect();
      tree.disconnect();
    };
  }, [enabled, targets]);

  if (!enabled) return <>{children}</>;

  return (
    <div className={cn('relative inline-block max-w-full', className)}>
      <div
        ref={stageRef}
        className="relative box-border overflow-visible"
        style={{ padding: 'var(--tw-raw-spacing-48)' }}
      >
        <div ref={subjectRef} className="w-fit" inert>
          {children}
        </div>
        <svg
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
          aria-hidden
        >
          {marks.map((mark) => (
            <DimLine key={mark.id} mark={mark} tick={tick} />
          ))}
        </svg>
        {marks.map((mark) => (
          <span
            key={`${mark.id}-label`}
            className="pointer-events-none absolute z-10 whitespace-nowrap rounded-[length:var(--rounded-sm)] bg-[color:var(--background)] px-[var(--spacing-2xs)] py-[var(--spacing-3xs)] text-[color:var(--foreground)] shadow-[var(--shadow-sm-black)]"
            style={{
              ...captionStyle,
              left: mark.labelX,
              top: mark.labelY,
              transform: `translate(${mark.labelTx}, ${mark.labelTy})`,
            }}
            title={mark.title}
          >
            {markLabel(mark.px, mark.token)}
          </span>
        ))}
      </div>
    </div>
  );
}
