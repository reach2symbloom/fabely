/**
 * Add Section Inline Button — insert rows with dividers. Overview via PrimitivePage.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type MouseEvent } from 'react';

import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../../stories/PrimitivePage';

import {
  AddSectionInlineButton,
  type AddSectionInlineType,
} from './AddSectionInlineButton';

const meta = {
  title: 'Design System/Features/Add Section Inline Button',
  component: AddSectionInlineButton,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AddSectionInlineButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const DEMO_FRAME = 'w-[length:var(--tw-raw-spacing-80)]';

const TYPE_OPTIONS: Array<{ value: AddSectionInlineType; label: string }> = [
  { value: 'chapter', label: 'Chapter' },
  { value: 'scene', label: 'Scene' },
  { value: 'actUntitled', label: 'Act untitled' },
  { value: 'actNoOnly', label: 'Act no. only' },
  { value: 'actTitled', label: 'Act titled' },
];

const DEMO_ACTIONS = {
  addChapter: {
    href: '#add-chapter',
    onClick: (event: MouseEvent) => {
      event.preventDefault();
      // eslint-disable-next-line no-console -- Storybook action demo
      console.info('add chapter');
    },
  },
  addAct: {
    href: '#add-act',
    onClick: (event: MouseEvent) => {
      event.preventDefault();
      // eslint-disable-next-line no-console -- Storybook action demo
      console.info('add act');
    },
  },
  addScene: {
    href: '#add-scene',
    onClick: (event: MouseEvent) => {
      event.preventDefault();
      // eslint-disable-next-line no-console -- Storybook action demo
      console.info('add scene');
    },
  },
} as const;

function ChapterExample() {
  return (
    <div className={DEMO_FRAME}>
      <AddSectionInlineButton
        type="chapter"
        addChapter={DEMO_ACTIONS.addChapter}
        addAct={DEMO_ACTIONS.addAct}
      />
    </div>
  );
}

function SceneExample() {
  return (
    <div className={DEMO_FRAME}>
      <AddSectionInlineButton
        type="scene"
        addScene={DEMO_ACTIONS.addScene}
      />
    </div>
  );
}

function ActUntitledExample() {
  return (
    <div className={DEMO_FRAME}>
      <AddSectionInlineButton type="actUntitled" />
    </div>
  );
}

function ActNoOnlyExample() {
  return (
    <div className={DEMO_FRAME}>
      <AddSectionInlineButton type="actNoOnly" />
    </div>
  );
}

function ActTitledExample() {
  return (
    <div className={DEMO_FRAME}>
      <AddSectionInlineButton type="actTitled" actTitle="Titled" />
    </div>
  );
}

function AddSectionPlayground() {
  const [type, setType] = useState<AddSectionInlineType>('chapter');
  const [actIndex, setActIndex] = useState(1);
  const isAct =
    type === 'actUntitled' || type === 'actNoOnly' || type === 'actTitled';

  return (
    <PlaygroundPanel
      previewAlign="stretch"
      preview={
        <div className={`flex min-h-40 w-full items-center ${DEMO_FRAME}`}>
          <AddSectionInlineButton
            type={type}
            actIndex={actIndex}
            actTitle={type === 'actTitled' ? 'Titled' : undefined}
            addChapter={DEMO_ACTIONS.addChapter}
            addAct={DEMO_ACTIONS.addAct}
            addScene={DEMO_ACTIONS.addScene}
          />
        </div>
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Type"
            value={type}
            onChange={(value) => setType(value as AddSectionInlineType)}
            options={TYPE_OPTIONS}
            fullWidth
            className="col-span-2"
          />
          {isAct ? (
            <InlineSegmentedControl
              label="Act index"
              value={String(actIndex)}
              onChange={(value) => setActIndex(Number(value))}
              options={[
                { value: '1', label: '1 → I' },
                { value: '2', label: '2 → II' },
                { value: '3', label: '3 → III' },
                { value: '4', label: '4 → IV' },
              ]}
              fullWidth
              className="col-span-2"
            />
          ) : null}
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Add Section Inline Button"
      description="Insert Chapter, Act, or Scene between manuscript sections — always with glow or diamond dividers. Composes the Add Section Button atom. Figma Add section inline button Chapter / Scene / Act (16373:4624)."
      playground={<AddSectionPlayground />}
      variants={
        <div className="flex w-full flex-col gap-[var(--spacing-md)]">
          <PrimitiveGalleryItem label="Chapter" fill>
            <ChapterExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Scene" fill>
            <SceneExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Act untitled" fill>
            <ActUntitledExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Act no. only" fill>
            <ActNoOnlyExample />
          </PrimitiveGalleryItem>
          <PrimitiveGalleryItem label="Act titled" fill>
            <ActTitledExample />
          </PrimitiveGalleryItem>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Use for manuscript insert rows only. Pills come from{' '}
            <code>AddSectionButton</code> (atom); this feature owns the
            secondary glow rails and Act diamond rails.
          </li>
          <li>
            Wire inserts with <code>addChapter</code> / <code>addAct</code> /{' '}
            <code>addScene</code>: <code>href</code> (route or placeholder{' '}
            <code>#</code>), <code>onClick</code>, or{' '}
            <code>formAction</code> / <code>formMethod</code> for webhooks.
            Shorthand <code>onAddChapter</code> / <code>onAddAct</code> /{' '}
            <code>onAddScene</code> still work.
          </li>
          <li>
            Pass <code>actIndex</code> (1-based) from the act sequence — the
            roman numeral is derived, never typed. Act no. only is display
            text, not an input.
          </li>
          <li>
            The Figma Default pill is not a feature surface — see{' '}
            <code>Design System/Atoms/Add Section Button</code>.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            Pills expose <code>aria-label</code> (“Add chapter”, “Add act”,
            “Add scene”). Act no. only uses{' '}
            <code>aria-label=&quot;Act I&quot;</code> (from sequence). Title
            fields use <code>aria-label=&quot;Act title&quot;</code>.
          </li>
        </ul>
      }
    />
  ),
};

export const Chapter: Story = {
  render: () => <ChapterExample />,
};

export const Scene: Story = {
  render: () => <SceneExample />,
};

export const ActUntitled: Story = {
  render: () => <ActUntitledExample />,
};

export const ActNoOnly: Story = {
  render: () => <ActNoOnlyExample />,
};

export const ActTitled: Story = {
  render: () => <ActTitledExample />,
};
