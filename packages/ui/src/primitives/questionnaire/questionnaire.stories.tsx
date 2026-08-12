import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../stories/PlaygroundPanel';
import {
  PRIMITIVE_PLAYGROUND_CONTROL_GRID,
  PrimitiveGalleryItem,
  PrimitivePage,
} from '../../../stories/PrimitivePage';
import { Button } from '../button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
  type QuestionnaireShortcutMode,
} from './questionnaire';

/**
 * Component Storybook IA (see docs/DESIGN.md "Component Story Structure"):
 * Overview first — Playground, Variants gallery, usage, a11y — then focused
 * example pages from shadcn Questionnaire docs.
 */

const meta = {
  title: 'Design System/Primitives/Questionnaire',
  component: Questionnaire,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Questionnaire>;

export default meta;
type Story = StoryObj<typeof meta>;

const FRAME = 'w-full max-w-lg';

const demoItems = [
  {
    choices: [
      { value: 'delegation' },
      { value: 'questions' },
      { value: 'both' },
    ],
    name: 'direction',
    required: true,
  },
  {
    choices: [
      { value: 'progress' },
      { value: 'decisions' },
      { value: 'risks' },
    ],
    name: 'signals',
  },
  {
    choices: [{ value: 'week' }, { value: 'cycle' }, { value: 'later' }],
    name: 'timing',
    required: true,
  },
] as const;

const multipleItems = [
  {
    choices: [
      { value: 'source' },
      { value: 'tests' },
      { value: 'docs' },
      { value: 'history' },
    ],
    name: 'context',
    required: true,
  },
] as const;

const freeformItems = [
  {
    choices: [
      { value: 'smallest' },
      { value: 'module' },
      { value: 'replace' },
    ],
    name: 'approach',
    required: true,
  },
] as const;

const skipItems = [
  {
    choices: [
      { value: 'feature' },
      { value: 'bug' },
      { value: 'refactor' },
    ],
    name: 'kind',
    required: true,
  },
  {
    choices: [
      { value: 'deps' },
      { value: 'db' },
      { value: 'api' },
    ],
    name: 'constraints',
  },
  {
    choices: [
      { value: 'tests' },
      { value: 'diff' },
      { value: 'both' },
    ],
    name: 'review',
    required: true,
  },
] as const;

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

function DemoQuestions() {
  return (
    <>
      <QuestionnaireItem name="direction" required>
        <QuestionnaireTitle>What should we prototype next?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose one direction or write another answer.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="delegation">
            <span className="font-medium">Sub-agent delegation</span>
            <QuestionnaireChoiceDescription>
              Show when work is delegated and what comes back.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="questions">
            <span className="font-medium">Question prompts</span>
            <QuestionnaireChoiceDescription>
              Show choices while the agent waits for input.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="both">
            <span className="font-medium">Both together</span>
            <QuestionnaireChoiceDescription>
              Explore one unified interaction pattern.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireInput
            aria-label="Another direction"
            placeholder="Type another direction…"
          />
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="signals" multiple>
        <QuestionnaireTitle>
          What should every progress update include?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Select all that apply, or skip this question.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="progress">Progress</QuestionnaireChoice>
          <QuestionnaireChoice value="decisions">Decisions</QuestionnaireChoice>
          <QuestionnaireChoice value="risks">Risks</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="timing" required>
        <QuestionnaireTitle>When should this be revisited?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose when this should be revisited.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="week">This week</QuestionnaireChoice>
          <QuestionnaireChoice value="cycle">Next cycle</QuestionnaireChoice>
          <QuestionnaireChoice value="later">Revisit later</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
    </>
  );
}

function DemoNavigation({
  submitLabel = 'Save answers',
}: {
  submitLabel?: string;
}) {
  return (
    <QuestionnaireActions className="w-full">
      <QuestionnairePrevious />
      <QuestionnaireSkip />
      <QuestionnaireNext>Next</QuestionnaireNext>
      <QuestionnaireSubmit>{submitLabel}</QuestionnaireSubmit>
    </QuestionnaireActions>
  );
}

function DemoExample({
  shortcuts = 'letters',
}: {
  shortcuts?: QuestionnaireShortcutMode | undefined;
}) {
  return (
    <Questionnaire
      className={FRAME}
      defaultItem="direction"
      items={demoItems}
      shortcuts={shortcuts}
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress />
      <DemoQuestions />
      <DemoNavigation />
    </Questionnaire>
  );
}

function MultipleExample() {
  return (
    <Questionnaire
      className={FRAME}
      defaultItem="context"
      items={multipleItems}
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="context" multiple required>
        <QuestionnaireTitle>
          What context should the agent inspect?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Select every source that may affect the implementation.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="source">
            Relevant source files
          </QuestionnaireChoice>
          <QuestionnaireChoice value="tests">Existing tests</QuestionnaireChoice>
          <QuestionnaireChoice value="docs">
            Architecture documentation
          </QuestionnaireChoice>
          <QuestionnaireChoice value="history">
            Recent commit history
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Share context</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}

function FreeformExample() {
  return (
    <Questionnaire
      className={FRAME}
      defaultItem="approach"
      items={freeformItems}
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="approach" required>
        <QuestionnaireTitle>
          How should the agent approach this refactor?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose a strategy or write a more specific instruction.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="smallest">
            Make the smallest safe change
          </QuestionnaireChoice>
          <QuestionnaireChoice value="module">
            Refactor one module at a time
          </QuestionnaireChoice>
          <QuestionnaireChoice value="replace">
            Replace the implementation completely
          </QuestionnaireChoice>
          <QuestionnaireInput
            aria-label="Another approach"
            placeholder="Type another approach…"
          />
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Use this approach</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}

function SkipExample() {
  return (
    <Questionnaire
      className={FRAME}
      defaultItem="kind"
      items={skipItems}
      onSubmit={handleSubmit}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="kind" required>
        <QuestionnaireTitle>What kind of change is this?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose the category that best describes the work.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="feature">New feature</QuestionnaireChoice>
          <QuestionnaireChoice value="bug">Bug fix</QuestionnaireChoice>
          <QuestionnaireChoice value="refactor">Refactor</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="constraints">
        <QuestionnaireTitle>
          Are there any implementation constraints?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Answer if needed, or intentionally skip this question.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="deps">
            Do not add dependencies
          </QuestionnaireChoice>
          <QuestionnaireChoice value="db">
            Do not change the database
          </QuestionnaireChoice>
          <QuestionnaireChoice value="api">
            Preserve the public API
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="review" required>
        <QuestionnaireTitle>How should the work be reviewed?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose the checks the agent should complete before handoff.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="tests">
            Run the test suite
          </QuestionnaireChoice>
          <QuestionnaireChoice value="diff">
            Review the final diff
          </QuestionnaireChoice>
          <QuestionnaireChoice value="both">
            Tests and diff review
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <DemoNavigation submitLabel="Submit brief" />
    </Questionnaire>
  );
}

function CardExample() {
  const directionTitleId = React.useId();
  const signalsTitleId = React.useId();
  const timingTitleId = React.useId();

  return (
    <Questionnaire
      defaultItem="direction"
      items={demoItems}
      shortcuts="numbers"
      onSubmit={handleSubmit}
    >
      <QuestionnaireItem
        aria-labelledby={directionTitleId}
        name="direction"
        required
      >
        <Card className={FRAME}>
          <CardHeader>
            <QuestionnaireTitle id={directionTitleId} render={<CardTitle />}>
              What should we prototype next?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Choose one direction or write another answer.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="delegation">
                <span className="font-medium">Sub-agent delegation</span>
                <QuestionnaireChoiceDescription>
                  Show when work is delegated and what comes back.
                </QuestionnaireChoiceDescription>
              </QuestionnaireChoice>
              <QuestionnaireChoice value="questions">
                <span className="font-medium">Question prompts</span>
                <QuestionnaireChoiceDescription>
                  Show choices while the agent waits for input.
                </QuestionnaireChoiceDescription>
              </QuestionnaireChoice>
              <QuestionnaireChoice value="both">
                <span className="font-medium">Both together</span>
                <QuestionnaireChoiceDescription>
                  Explore one unified interaction pattern.
                </QuestionnaireChoiceDescription>
              </QuestionnaireChoice>
              <QuestionnaireInput
                aria-label="Another direction"
                placeholder="Type another direction…"
              />
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
          <CardFooter>
            <DemoNavigation />
          </CardFooter>
        </Card>
      </QuestionnaireItem>
      <QuestionnaireItem
        aria-labelledby={signalsTitleId}
        name="signals"
        multiple
      >
        <Card className={FRAME}>
          <CardHeader>
            <QuestionnaireTitle id={signalsTitleId} render={<CardTitle />}>
              What should every progress update include?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Select all that apply, or skip this question.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="progress">
                Progress
              </QuestionnaireChoice>
              <QuestionnaireChoice value="decisions">
                Decisions
              </QuestionnaireChoice>
              <QuestionnaireChoice value="risks">Risks</QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
          <CardFooter>
            <DemoNavigation />
          </CardFooter>
        </Card>
      </QuestionnaireItem>
      <QuestionnaireItem aria-labelledby={timingTitleId} name="timing" required>
        <Card className={FRAME}>
          <CardHeader>
            <QuestionnaireTitle id={timingTitleId} render={<CardTitle />}>
              When should this be revisited?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Choose when this should be revisited.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="week">This week</QuestionnaireChoice>
              <QuestionnaireChoice value="cycle">Next cycle</QuestionnaireChoice>
              <QuestionnaireChoice value="later">
                Revisit later
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
          <CardFooter>
            <DemoNavigation />
          </CardFooter>
        </Card>
      </QuestionnaireItem>
    </Questionnaire>
  );
}

function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Open questionnaire
      </DialogTrigger>
      <DialogContent>
        <Questionnaire
          defaultItem="direction"
          items={demoItems}
          onSubmit={handleSubmit}
        >
          <DialogHeader>
            <DialogTitle className="sr-only">
              Plan an agent interface
            </DialogTitle>
            <DialogDescription className="sr-only">
              Answer three questions to shape the next prototype.
            </DialogDescription>
            <QuestionnaireProgress
              className="font-semibold tracking-widest text-[color:var(--foreground)] uppercase"
              render={(props, state) => (
                <span {...props}>
                  Question {state.current} of {state.total}
                </span>
              )}
            />
          </DialogHeader>
          <DemoQuestions />
          <DialogFooter>
            <DemoNavigation />
          </DialogFooter>
        </Questionnaire>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Stories ---------- */

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: function OverviewStory() {
    const [shortcuts, setShortcuts] = useState<
      'none' | QuestionnaireShortcutMode
    >('letters');

    return (
      <PrimitivePage
        title="Questionnaire"
        description="Multi-step single / multiple choice, freeform, and skippable questions. Behavior from @shadcn/react; chrome from Foundations (Item, Input, Button)."
        playground={
          <PlaygroundPanel
            previewAlign="stretch"
            preview={
              <div className="flex justify-center">
                <DemoExample
                  shortcuts={shortcuts === 'none' ? undefined : shortcuts}
                />
              </div>
            }
            controls={
              <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
                <InlineSegmentedControl
                  aria-label="Shortcuts"
                  label="Shortcuts"
                  value={shortcuts}
                  onChange={(v) =>
                    setShortcuts(v as 'none' | QuestionnaireShortcutMode)
                  }
                  options={[
                    { value: 'none', label: 'Off' },
                    { value: 'letters', label: 'Letters' },
                    { value: 'numbers', label: 'Numbers' },
                  ]}
                />
              </div>
            }
          />
        }
        variants={
          <>
            <PrimitiveGalleryItem label="Multiple">
              <MultipleExample />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Freeform">
              <FreeformExample />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Explicit skip">
              <SkipExample />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Card">
              <CardExample />
            </PrimitiveGalleryItem>
            <PrimitiveGalleryItem label="Dialog">
              <DialogExample />
            </PrimitiveGalleryItem>
          </>
        }
        usageGuidance={
          <ul className="list-disc space-y-[var(--spacing-xs)] ps-[var(--spacing-md)]">
            <li>
              Define <code>items</code> once — pass to the root and map into{' '}
              <code>QuestionnaireItem</code> parts.
            </li>
            <li>
              Host owns close / cancel, persistence, transport, and branching;
              Questionnaire owns active item, answers, validation, and nav.
            </li>
            <li>
              Always give <code>QuestionnaireInput</code> an accessible name
              (<code>aria-label</code> or visible label) — placeholder is not
              enough.
            </li>
          </ul>
        }
        accessibility={
          <ul className="list-disc space-y-[var(--spacing-xs)] ps-[var(--spacing-md)]">
            <li>
              <code>QuestionnaireItem</code> is a <code>fieldset</code>; title
              is its <code>legend</code>.
            </li>
            <li>
              Fixed choices keep native radio / checkbox behavior; progress is a
              named progressbar; inactive items and actions are inert.
            </li>
            <li>
              Successful navigation focuses the new item; failed validation
              focuses an available answer control.
            </li>
          </ul>
        }
      />
    );
  },
};

export const Demo: Story = {
  render: () => <DemoExample />,
};

export const Multiple: Story = {
  render: () => <MultipleExample />,
};

export const Freeform: Story = {
  render: () => <FreeformExample />,
};

export const Skip: Story = {
  render: () => <SkipExample />,
};

export const Shortcuts: Story = {
  render: () => <DemoExample shortcuts="letters" />,
};

export const CardComposition: Story = {
  name: 'Card',
  render: () => <CardExample />,
};

export const DialogComposition: Story = {
  name: 'Dialog',
  render: () => <DialogExample />,
};
