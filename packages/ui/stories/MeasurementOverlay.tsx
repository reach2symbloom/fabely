/**
 * Story-only measurement overlay. Reads padding, gap, and box size from the
 * live DOM (getComputedStyle / getBoundingClientRect) and labels each mark
 * with the resolved pixel value plus the Foundations token that matches it.
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
    const rank =
      TOKEN_RANK.find((row) => row.test(name))?.rank ?? 99;
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

function collectMarks(
  subject: HTMLElement,
  overlay: HTMLElement,
  targets: MeasurementTarget[],
  catalog: TokenEntry[],
): Mark[] {
  const origin = overlay.getBoundingClientRect();
  const marks: Mark[] = [];
  const offset =
    catalog.find((t) => t.name === '--spacing-lg')?.px ??
    tokenToPx('--spacing-lg') ??
    20;
  const labelOff =
    catalog.find((t) => t.name === '--spacing-xl')?.px ??
    tokenToPx('--spacing-xl') ??
    24;

  for (const target of targets) {
    const el = target.selector
      ? (subject.querySelector(target.selector) as HTMLElement | null)
      : subject;
    if (!el) continue;
    const box = toLocal(el.getBoundingClientRect(), origin);
    const cs = getComputedStyle(el);

    if (target.measure.includes('width')) {
      const px = el.getBoundingClientRect().width;
      marks.push({
        id: `${target.name}-width`,
        kind: 'width',
        title: `${target.name} width`,
        px,
        token: matchToken(px, catalog, 'size'),
        x1: box.x,
        y1: box.y - offset,
        x2: box.x + box.w,
        y2: box.y - offset,
        labelX: box.x + box.w / 2,
        labelY: box.y - labelOff,
      });
    }

    if (target.measure.includes('height')) {
      const px = el.getBoundingClientRect().height;
      marks.push({
        id: `${target.name}-height`,
        kind: 'height',
        title: `${target.name} height`,
        px,
        token: matchToken(px, catalog, 'size'),
        x1: box.x + box.w + offset,
        y1: box.y,
        x2: box.x + box.w + offset,
        y2: box.y + box.h,
        labelX: box.x + box.w + labelOff,
        labelY: box.y + box.h / 2,
      });
    }

    if (target.measure.includes('padding')) {
      const sides: Array<{
        side: string;
        px: number;
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        labelX: number;
        labelY: number;
      }> = [
        {
          side: 'top',
          px: parsePx(cs.paddingTop),
          x1: box.x,
          y1: box.y,
          x2: box.x + box.w,
          y2: box.y + parsePx(cs.paddingTop),
          labelX: box.x + box.w / 2,
          labelY: box.y + parsePx(cs.paddingTop) / 2,
        },
        {
          side: 'right',
          px: parsePx(cs.paddingRight),
          x1: box.x + box.w - parsePx(cs.paddingRight),
          y1: box.y,
          x2: box.x + box.w,
          y2: box.y + box.h,
          labelX: box.x + box.w - parsePx(cs.paddingRight) / 2,
          labelY: box.y + box.h / 2,
        },
        {
          side: 'bottom',
          px: parsePx(cs.paddingBottom),
          x1: box.x,
          y1: box.y + box.h - parsePx(cs.paddingBottom),
          x2: box.x + box.w,
          y2: box.y + box.h,
          labelX: box.x + box.w / 2,
          labelY: box.y + box.h - parsePx(cs.paddingBottom) / 2,
        },
        {
          side: 'left',
          px: parsePx(cs.paddingLeft),
          x1: box.x,
          y1: box.y,
          x2: box.x + parsePx(cs.paddingLeft),
          y2: box.y + box.h,
          labelX: box.x + parsePx(cs.paddingLeft) / 2,
          labelY: box.y + box.h / 2,
        },
      ];
      for (const side of sides) {
        if (side.px <= 0) continue;
        marks.push({
          id: `${target.name}-padding-${side.side}`,
          kind: 'padding',
          title: `${target.name} padding-${side.side}`,
          px: side.px,
          token: matchToken(side.px, catalog, 'space'),
          x1: side.x1,
          y1: side.y1,
          x2: side.x2,
          y2: side.y2,
          labelX: side.labelX,
          labelY: side.labelY,
        });
      }
    }

    if (target.measure.includes('gap')) {
      const kids = visibleChildren(el);
      const column = cs.flexDirection.startsWith('column');
      let px = parsePx(column ? cs.rowGap : cs.columnGap);
      let x1 = box.x;
      let y1 = box.y;
      let x2 = box.x;
      let y2 = box.y;
      let labelX = box.x;
      let labelY = box.y;
      if (kids.length >= 2) {
        const a = toLocal(kids[0].getBoundingClientRect(), origin);
        const b = toLocal(kids[1].getBoundingClientRect(), origin);
        if (column) {
          px = b.y - (a.y + a.h);
          x1 = box.x + box.w / 2;
          y1 = a.y + a.h;
          x2 = box.x + box.w / 2;
          y2 = b.y;
          labelX = box.x + box.w / 2;
          labelY = (y1 + y2) / 2;
        } else {
          px = b.x - (a.x + a.w);
          x1 = a.x + a.w;
          y1 = box.y + box.h / 2;
          x2 = b.x;
          y2 = box.y + box.h / 2;
          labelX = (x1 + x2) / 2;
          labelY = box.y + box.h / 2;
        }
      }
      if (px > 0 || kids.length >= 2) {
        marks.push({
          id: `${target.name}-gap`,
          kind: 'gap',
          title: `${target.name} gap`,
          px,
          token: matchToken(px, catalog, 'space'),
          x1,
          y1,
          x2,
          y2,
          labelX,
          labelY,
        });
      }
    }
  }

  return marks;
}

function DimLine({ mark, tick }: { mark: Mark; tick: number }) {
  const horizontal = mark.y1 === mark.y2;
  const color = 'var(--tw-raw-secondary-400)';
  return (
    <g>
      {mark.kind === 'padding' ? (
        <rect
          x={Math.min(mark.x1, mark.x2)}
          y={Math.min(mark.y1, mark.y2)}
          width={Math.abs(mark.x2 - mark.x1)}
          height={Math.abs(mark.y2 - mark.y1)}
          fill={color}
          opacity={0.18}
        />
      ) : (
        <>
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
      const nextTick =
        catalog.find((t) => t.name === '--spacing-2xs')?.px ??
        tokenToPx('--spacing-2xs') ??
        4;
      setTick(nextTick);
      setMarks(collectMarks(subject, stage, targets, catalog));
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
    <div className={cn('relative', className)}>
      <div
        ref={stageRef}
        className="relative box-border"
        style={{ padding: 'var(--spacing-6xl)' }}
      >
        <div ref={subjectRef} inert>
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
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[length:var(--rounded-sm)] bg-[color:var(--background)] px-[var(--spacing-2xs)] py-[var(--spacing-3xs)] text-[color:var(--tw-raw-secondary-600)] shadow-[var(--shadow-sm-black)]"
            style={{
              ...captionStyle,
              left: mark.labelX,
              top: mark.labelY,
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
