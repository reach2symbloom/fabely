import type { Meta, StoryObj } from '@storybook/react-vite';

import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import { PrimitiveGalleryItem, PrimitivePage } from '../../../../stories/PrimitivePage';

import { FiaAnswer } from './FiaAnswer';

const copy = {
  answer:
    'Sophia is confronted by a fire dragon. In this moment Zeera realizes Sophia is a Lumithra—a powerful sorceress capable of wielding all elements.',
  source: 'The Lumithra',
  resultCount: 20,
};

const meta = {
  title: 'Design System/Features/Note Retrieved/Fia Answer',
  component: FiaAnswer,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: copy,
} satisfies Meta<typeof FiaAnswer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Fia Answer"
      description="A single retrieved answer row in Fia's search results."
      playground={
        <PlaygroundPanel
          preview={
            <div className="flex w-full items-center justify-center">
              <FiaAnswer {...copy} />
            </div>
          }
          controls={
            <p className="text-sm text-muted-foreground">
              No configurable states — content is passed via <code>answer</code>, <code>source</code>, and{' '}
              <code>resultCount</code> props.
            </p>
          }
        />
      }
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
