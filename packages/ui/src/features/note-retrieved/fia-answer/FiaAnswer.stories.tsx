import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Input } from '@/primitives/input';
import { Textarea } from '@/primitives/textarea';

import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import { FiaAnswer } from './FiaAnswer';

const copy = {
  answer:
    'Sophia is confronted by a fire dragon. In this moment Zeera realizes Sophia is a Lumithra—a powerful sorceress capable of wielding all elements.',
  source: 'The Lumithra',
  resultCount: 20,
};

const meta = {
  title: 'Design System/Features/Gather/Fia Answer',
  component: FiaAnswer,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: copy,
} satisfies Meta<typeof FiaAnswer>;

export default meta;
type Story = StoryObj<typeof meta>;

const controlLabelStyle = 'mb-1.5 font-sans text-xs text-muted-foreground';

function FiaAnswerPlayground() {
  const [answer, setAnswer] = useState(copy.answer);
  const [source, setSource] = useState(copy.source);
  const [resultCount, setResultCount] = useState(copy.resultCount);

  return (
    <PlaygroundPanel
      preview={
        <div className="flex w-full items-center justify-center">
          <FiaAnswer answer={answer} source={source} resultCount={resultCount} />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <div className="col-span-2">
            <div className={controlLabelStyle}>Answer</div>
            <Textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              rows={3}
            />
          </div>
          <div>
            <div className={controlLabelStyle}>Source</div>
            <Input value={source} onChange={(event) => setSource(event.target.value)} />
          </div>
          <div>
            <div className={controlLabelStyle}>Result count</div>
            <Input
              type="number"
              value={resultCount}
              onChange={(event) => setResultCount(Number(event.target.value))}
            />
          </div>
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Fia Answer"
      description="A single retrieved answer row in Fia's search results."
      playground={<FiaAnswerPlayground />}
      variants={
        <div className="flex flex-col gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Default">
            <FiaAnswer {...copy} />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Longer answer">
            <FiaAnswer
              answer="Zeera's journal describes the Lumithra bloodline as vanishingly rare — one born every few centuries — and warns that early elemental surges often go unrecognized until a moment of extreme stress forces them into the open."
              source="Zeera's Journal"
              resultCount={4}
            />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Rows are meant to stack in a results list — the bottom border separates adjacent rows.</li>
          <li>The silcrow mark and source badge are fixed chrome, not configurable per row.</li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>The silcrow mark is decorative and hidden from assistive technology.</li>
          <li>Answer text, source, and result count are all rendered as visible text content.</li>
        </ul>
      }
    />
  ),
};

export const Default: Story = {};
