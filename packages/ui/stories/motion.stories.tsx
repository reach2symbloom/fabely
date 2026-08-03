import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/primitives/accordion';
import { PendingNotice, SectionHeading } from './ColorSwatchTable';

const meta = {
  title: 'Design System/Foundations/Motion',
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Motion has no Foundations tokens yet — no duration/easing CSS variables,
 * no Figma motion collection. What exists today is accordion open/close:
 * `tw-animate-css` registers `--animate-accordion-*` (0.2s ease-out), and
 * `foundations/motion/accordion.css` redefines the keyframes against
 * `--accordion-panel-height`. This story surfaces those live DOM values
 * only — it does not invent a motion scale.
 */
type AccordionMotionEntry = {
  name: string;
  /** Theme token from tw-animate-css, e.g. "--animate-accordion-down" */
  cssVar: string;
  /** Utility class components apply, e.g. "animate-accordion-down" */
  utilityClass: string;
  note: string;
};

const accordionMotion: AccordionMotionEntry[] = [
  {
    name: 'accordion-down',
    cssVar: '--animate-accordion-down',
    utilityClass: 'animate-accordion-down',
    note: 'tw-animate-css theme token; keyframes overridden in foundations/motion/accordion.css',
  },
  {
    name: 'accordion-up',
    cssVar: '--animate-accordion-up',
    utilityClass: 'animate-accordion-up',
    note: 'tw-animate-css theme token; keyframes overridden in foundations/motion/accordion.css',
  },
];

type ResolvedMotion = {
  themeValue: string;
  animationName: string;
  duration: string;
  easing: string;
};

/** Reads theme-token text plus computed animation-* off a live utility class. */
function useResolvedAccordionMotion(entry: AccordionMotionEntry): {
  probeRef: RefObject<HTMLDivElement | null>;
  resolved: ResolvedMotion;
} {
  const probeRef = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState<ResolvedMotion>({
    themeValue: '',
    animationName: '',
    duration: '',
    easing: '',
  });

  useEffect(() => {
    const themeValue = getComputedStyle(document.documentElement)
      .getPropertyValue(entry.cssVar)
      .trim();

    const el = probeRef.current;
    if (!el) {
      setResolved({ themeValue, animationName: '', duration: '', easing: '' });
      return;
    }

    const cs = getComputedStyle(el);
    setResolved({
      themeValue,
      animationName: cs.animationName,
      duration: cs.animationDuration,
      easing: cs.animationTimingFunction,
    });
  }, [entry.cssVar, entry.utilityClass]);

  return { probeRef, resolved };
}

const cellStyle: CSSProperties = {
  padding: '8px 12px',
  borderBottom: '1px solid var(--border)',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 13,
  verticalAlign: 'middle',
};

function MotionRow({ entry }: { entry: AccordionMotionEntry }) {
  const { probeRef, resolved } = useResolvedAccordionMotion(entry);
  return (
    <tr>
      {/* Off-screen probe: Tailwind utility must be on a real node for getComputedStyle */}
      <td style={{ ...cellStyle, width: 0, padding: 0, border: 'none' }}>
        <div
          ref={probeRef}
          className={entry.utilityClass}
          aria-hidden
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clipPath: 'inset(50%)',
            whiteSpace: 'nowrap',
          }}
        />
      </td>
      <td style={cellStyle}>{entry.name}</td>
      <td style={cellStyle}>{entry.cssVar}</td>
      <td style={cellStyle}>{resolved.animationName || '…'}</td>
      <td style={cellStyle}>{resolved.duration || '…'}</td>
      <td style={cellStyle}>{resolved.easing || '…'}</td>
      <td style={cellStyle}>{resolved.themeValue || '…'}</td>
      <td style={{ ...cellStyle, opacity: 0.75 }}>{entry.note}</td>
    </tr>
  );
}

function AccordionMotionTable() {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
      <thead>
        <tr>
          <th style={{ ...cellStyle, textAlign: 'left', width: 0, padding: 0, border: 'none' }} />
          <th style={{ ...cellStyle, textAlign: 'left' }}>Name</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>CSS Variable</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>animation-name</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>duration</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>easing</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Theme value</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Note</th>
        </tr>
      </thead>
      <tbody>
        {accordionMotion.map((entry) => (
          <MotionRow key={entry.cssVar} entry={entry} />
        ))}
      </tbody>
    </table>
  );
}

export const AccordionOpenClose: Story = {
  name: 'Accordion open/close',
  render: () => (
    <div>
      <PendingNotice>
        <strong>No Motion tokens yet.</strong> Figma has no motion collection. Duration and
        easing come from <code>tw-animate-css</code> defaults (
        <code>--animate-accordion-*</code>). Foundations only overrides the accordion keyframes
        so they interpolate against Base UI&apos;s <code>--accordion-panel-height</code>. Values
        below are read from the live DOM — nothing here invents a duration or easing scale.
      </PendingNotice>

      <SectionHeading>Accordion utilities (DOM-resolved)</SectionHeading>
      <AccordionMotionTable />

      <SectionHeading>Live accordion</SectionHeading>
      <Accordion defaultValue={['item-1']} className="w-96 max-w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes — open/close uses <code>animate-accordion-down</code> /{' '}
            <code>animate-accordion-up</code>. Toggle to see the motion Foundations documents
            today.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Are there duration tokens?</AccordionTrigger>
          <AccordionContent>
            Not yet. When a second component needs the same duration or easing, promote it to a
            Foundations Motion token rather than duplicating the literal.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
