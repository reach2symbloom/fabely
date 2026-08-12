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

type TokenEntry = {
  name: string;
  cssVar: string;
  utilityClass: string;
  note: string;
};

const easeTokens: TokenEntry[] = [
  {
    name: 'drawer',
    cssVar: '--ease-drawer',
    utilityClass: 'ease-drawer',
    note: 'Overlay / sheet — cubic-bezier(0.32, 0.72, 0, 1)',
  },
  {
    name: 'emphasized',
    cssVar: '--ease-emphasized',
    utilityClass: 'ease-emphasized',
    note: 'Panel enter/exit — cubic-bezier(0.22, 1, 0.36, 1)',
  },
  {
    name: 'emphasized-in',
    cssVar: '--ease-emphasized-in',
    utilityClass: 'ease-emphasized-in',
    note: 'Nested content opacity — cubic-bezier(0.45, 1.005, 0, 1.005)',
  },
];

const durationTokens: TokenEntry[] = [
  {
    name: 'fast',
    cssVar: '--duration-fast',
    utilityClass: 'duration-fast',
    note: '200ms — handle / quick fades',
  },
  {
    name: 'normal',
    cssVar: '--duration-normal',
    utilityClass: 'duration-normal',
    note: '300ms — content opacity',
  },
  {
    name: 'drawer',
    cssVar: '--duration-drawer',
    utilityClass: 'duration-drawer',
    note: '450ms — drawer overlay + panel',
  },
];

type AccordionMotionEntry = {
  name: string;
  cssVar: string;
  utilityClass: string;
  note: string;
};

const accordionMotion: AccordionMotionEntry[] = [
  {
    name: 'accordion-down',
    cssVar: '--animate-accordion-down',
    utilityClass: 'animate-accordion-down',
    note: 'tw-animate-css; keyframes overridden in foundations/motion/accordion.css',
  },
  {
    name: 'accordion-up',
    cssVar: '--animate-accordion-up',
    utilityClass: 'animate-accordion-up',
    note: 'tw-animate-css; keyframes overridden in foundations/motion/accordion.css',
  },
];

type ResolvedMotion = {
  themeValue: string;
  animationName: string;
  duration: string;
  easing: string;
};

function useResolvedThemeVar(cssVar: string): string {
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(
      getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim(),
    );
  }, [cssVar]);
  return value;
}

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

function TokenRow({ entry }: { entry: TokenEntry }) {
  const value = useResolvedThemeVar(entry.cssVar);
  return (
    <tr>
      <td style={cellStyle}>{entry.name}</td>
      <td style={cellStyle}>{entry.cssVar}</td>
      <td style={cellStyle}>{entry.utilityClass}</td>
      <td style={cellStyle}>{value || '…'}</td>
      <td style={{ ...cellStyle, opacity: 0.75 }}>{entry.note}</td>
    </tr>
  );
}

function TokenTable({ entries }: { entries: TokenEntry[] }) {
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
      <thead>
        <tr>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Name</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>CSS Variable</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Utility</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Resolved</th>
          <th style={{ ...cellStyle, textAlign: 'left' }}>Note</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <TokenRow key={entry.cssVar} entry={entry} />
        ))}
      </tbody>
    </table>
  );
}

function MotionRow({ entry }: { entry: AccordionMotionEntry }) {
  const { probeRef, resolved } = useResolvedAccordionMotion(entry);
  return (
    <tr>
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

export const Tokens: Story = {
  name: 'Duration & easing',
  render: () => (
    <div>
      <PendingNotice>
        Seeded from shadcn Base Drawer curves. No Figma motion collection — add
        tokens here when a duration or easing is reused. Source:{' '}
        <code>foundations/motion/tokens.css</code>.
      </PendingNotice>

      <SectionHeading>Easing</SectionHeading>
      <TokenTable entries={easeTokens} />

      <SectionHeading>Duration</SectionHeading>
      <TokenTable entries={durationTokens} />

      <SectionHeading>Preview</SectionHeading>
      <div className="flex flex-wrap gap-6">
        <div
          className="size-16 rounded-[length:var(--radius)] bg-primary transition-transform duration-drawer ease-emphasized hover:translate-x-8"
          title="duration-drawer + ease-emphasized"
        />
        <div
          className="size-16 rounded-[length:var(--radius)] bg-secondary transition-transform duration-drawer ease-drawer hover:translate-x-8"
          title="duration-drawer + ease-drawer"
        />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Hover the squares — left uses <code>ease-emphasized</code> (panel), right{' '}
        <code>ease-drawer</code> (overlay).
      </p>
    </div>
  ),
};

export const AccordionOpenClose: Story = {
  name: 'Accordion open/close',
  render: () => (
    <div>
      <PendingNotice>
        Accordion still uses <code>tw-animate-css</code>{' '}
        <code>--animate-accordion-*</code> (0.2s ease-out). Foundations only
        overrides keyframes for Base UI&apos;s{' '}
        <code>--accordion-panel-height</code>. Shared duration/easing tokens are
        on the Duration &amp; easing story.
      </PendingNotice>

      <SectionHeading>Accordion utilities (DOM-resolved)</SectionHeading>
      <AccordionMotionTable />

      <SectionHeading>Live accordion</SectionHeading>
      <Accordion defaultValue={['item-1']} className="w-96 max-w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes — open/close uses <code>animate-accordion-down</code> /{' '}
            <code>animate-accordion-up</code>.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Where are duration tokens?</AccordionTrigger>
          <AccordionContent>
            See Foundations → Motion → Duration &amp; easing (
            <code>ease-drawer</code>, <code>duration-drawer</code>, …).
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
