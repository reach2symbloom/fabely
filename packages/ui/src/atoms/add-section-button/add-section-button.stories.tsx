/**
 * Add Section Button — Figma Default pill (16373:4622). Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BookOpenTextIcon,
  PlusIcon,
  SeparatorHorizontalIcon,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';

import { AddSectionButton } from './add-section-button';

const meta = {
  title: 'Design System/Atoms/Add Section Button',
  component: AddSectionButton,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  args: {
    'aria-label': 'Add chapter',
    children: (
      <>
        <BookOpenTextIcon />
        Add chapter
      </>
    ),
  },
} satisfies Meta<typeof AddSectionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

type Face = 'addChapter' | 'chapter' | 'act' | 'scene';

const FACES: Array<{
  value: Face;
  label: string;
  ariaLabel: string;
  icon: ReactNode;
  text: string;
}> = [
  {
    value: 'addChapter',
    label: 'Add chapter',
    ariaLabel: 'Add chapter',
    icon: <BookOpenTextIcon />,
    text: 'Add chapter',
  },
  {
    value: 'chapter',
    label: 'Chapter',
    ariaLabel: 'Add chapter',
    icon: <PlusIcon />,
    text: 'Chapter',
  },
  {
    value: 'act',
    label: 'Act',
    ariaLabel: 'Add act',
    icon: <SeparatorHorizontalIcon />,
    text: 'Act',
  },
  {
    value: 'scene',
    label: 'Scene',
    ariaLabel: 'Add scene',
    icon: <PlusIcon />,
    text: 'Scene',
  },
];

function DemoExample() {
  return (
    <AddSectionButton aria-label="Add chapter">
      <BookOpenTextIcon />
      Add chapter
    </AddSectionButton>
  );
}

function AddSectionButtonPlayground() {
  const [face, setFace] = useState<Face>('addChapter');
  const [active, setActive] = useState(false);
  const current = FACES.find((row) => row.value === face) ?? FACES[0];

  return (
    <PlaygroundPanel
      preview={
        <div className="flex min-h-40 items-center justify-center">
          <AddSectionButton
            aria-label={current.ariaLabel}
            active={active}
          >
            {current.icon}
            {current.text}
          </AddSectionButton>
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Face"
            value={face}
            onChange={(value) => setFace(value as Face)}
            options={FACES.map(({ value, label }) => ({ value, label }))}
            fullWidth
            className="col-span-2"
          />
          <InlineSegmentedControl
            label="Active"
            value={active ? 'on' : 'off'}
            onChange={(value) => setActive(value === 'on')}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
            fullWidth
          />
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Add Section Button"
      description="Icon + label pill from Figma Add section inline button Type=Default (16373:4622). Always paired with dividers in product — see Features / Add Section Inline Button."
      playground={<AddSectionButtonPlayground />}
      variants={
        <div className="flex flex-wrap gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Add chapter">
            <DemoExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Add chapter · active">
            <AddSectionButton aria-label="Add chapter" active>
              <BookOpenTextIcon />
              Add chapter
            </AddSectionButton>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Chapter">
            <AddSectionButton aria-label="Add chapter">
              <PlusIcon />
              Chapter
            </AddSectionButton>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Act">
            <AddSectionButton aria-label="Add act">
              <SeparatorHorizontalIcon />
              Act
            </AddSectionButton>
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Scene">
            <AddSectionButton aria-label="Add scene">
              <PlusIcon />
              Scene
            </AddSectionButton>
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Pass Lucide icon + label as children. Do not ship this alone in
            product UI — compose with glow / diamond rails via{' '}
            <code>AddSectionInlineButton</code>.
          </li>
          <li>
            With <code>href</code>, renders as <code>&lt;a&gt;</code> (route,
            <code>#</code> stub, or webhook URL). Without it, a{' '}
            <code>&lt;button&gt;</code> — use <code>onClick</code> or{' '}
            <code>formAction</code>.
          </li>
          <li>
            <code>active</code> locks the hover face for demos or forced
            highlight — not used by Scene insert (row hover already provides
            context).
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Always pass <code>aria-label</code> — short labels (“Act”) need
            context.
          </li>
        </ul>
      }
    />
  ),
};

export const Demo: Story = {
  render: () => <DemoExample />,
};
