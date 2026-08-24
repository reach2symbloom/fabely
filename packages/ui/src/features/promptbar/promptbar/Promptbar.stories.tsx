/**
 * Promptbar — Figma "Promptbar organism" (`16042:5539`), 13 Mode×Expanded
 * symbols. Every named story below maps directly onto one of those 13
 * symbols; a small number of reusable example components (one per
 * `aiMode`/`fiaSubMode` combination) cover them, parametrized by initial
 * state — not 13 near-duplicate blobs. Same convention
 * `PromptbarShelf.stories.tsx` already established for its own 3 Type
 * examples.
 */
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import { PRIMITIVE_PLAYGROUND_CONTROL_GRID, PrimitivePage } from '../../../../stories/PrimitivePage';

import type { LiveDictationAdapter } from '@/hooks/use-live-dictation';

import { Promptbar } from './Promptbar';
import type {
  PromptbarActiveWorkflow,
  PromptbarState,
  PromptbarWorkflowKind,
  PromptbarWorkflowSuggestion,
} from './promptbar-state';

const meta = {
  title: 'Design System/Features/Promptbar/Promptbar',
  component: Promptbar,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  // Figma's source frame is dark-only chrome, same as Shelf/AI Mode Toggle.
  globals: { theme: 'dark' },
  // `state` is a required prop — every story below overrides it (and
  // everything else) via `render`, but Storybook's own typing still
  // requires `args` to satisfy required props unless `meta` supplies a
  // fallback. Same fix `PromptbarShelf.stories.tsx` uses for its own
  // required `statusContent`.
  args: { state: { mode: { aiMode: 'gather', sceneConnected: false, scene: { sceneTitle: '' } }, tokenCount: 0 } },
} satisfies Meta<typeof Promptbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const SCENE_TITLE = 'The Eldergrove';
const TOKEN_COUNT = 750;
const CHAPTER_SCENE = { chapter: 1, scene: 1 };
const PARAGRAPH_SELECTION = { paragraphNumbers: [1, 2], isPartial: true };

const WORKFLOW_SUGGESTIONS: PromptbarWorkflowSuggestion[] = [
  {
    kind: 'related-themes',
    title: 'What else goes with this chapter?',
    description: 'Bundle useful notes into themes for this chapter',
  },
  {
    kind: 'topic-map',
    title: 'Generate a topic map related to…',
    description: 'Find high level topics and dive into related notes',
  },
  {
    kind: 'develop-scene',
    title: 'Develop this scene',
    description: 'Suggest what could happen next using the attached scene context',
  },
];

const WORKFLOW_LABEL: Record<PromptbarWorkflowKind, string> = {
  'related-themes': 'Related themes',
  'topic-map': 'Topic map',
  'develop-scene': 'Develop scene',
};

/** Gather mode — both "Gather and roam" (disconnected) and "Gather for
 * scene" (connected) are the same `aiMode: 'gather'` state, differing only
 * in `sceneConnected`; one component covers both Figma variants, collapsed
 * and expanded. `scene` is always present, matching the reference's own
 * two-independent-`useState`s model (see `PromptbarGatherState`'s own doc
 * comment) — the connect row shows this title regardless of connection
 * status. */
function GatherExample({ initialSceneConnected, defaultOpen }: { initialSceneConnected: boolean; defaultOpen: boolean }) {
  const [sceneConnected, setSceneConnected] = useState(initialSceneConnected);

  const state: PromptbarState = {
    mode: { aiMode: 'gather', sceneConnected, scene: { sceneTitle: SCENE_TITLE } },
    tokenCount: TOKEN_COUNT,
  };

  return (
    <Promptbar
      state={state}
      defaultOpen={defaultOpen}
      onConnectScene={() => setSceneConnected(true)}
      onDisconnectScene={() => setSceneConnected(false)}
    />
  );
}

/** Scene Desk — always connected (no disconnected case in Figma), shelf
 * not expandable (no `Mode=Scene desk, Expanded=True` symbol exists). */
function SceneDeskExample() {
  const state: PromptbarState = {
    mode: { aiMode: 'scene-desk', scene: { sceneTitle: SCENE_TITLE } },
    tokenCount: TOKEN_COUNT,
  };
  return <Promptbar state={state} />;
}

/** Fia default — static shelf (two stacked context-chip rows), not
 * expandable. */
function FiaDefaultExample() {
  const [dismissed, setDismissed] = useState(false);
  const state: PromptbarState = {
    mode: {
      aiMode: 'fia',
      fiaSubMode: 'default',
      contextBadges: dismissed
        ? [{ id: 'overflow', label: '+2' }]
        : [
            {
              id: 'chapter-scene',
              label: `Ch. 1, Sc. 1 · "She's a Lumith…"`,
              onDismiss: () => setDismissed(true),
            },
            { id: 'overflow', label: '+2' },
          ],
    },
    tokenCount: TOKEN_COUNT,
  };
  return <Promptbar state={state} />;
}

/** Fia speak — no shelf at all; the composer's control row swaps mic for
 * a mute button and the send control shows visible "End" text. */
function FiaSpeakExample() {
  const state: PromptbarState = { mode: { aiMode: 'fia', fiaSubMode: 'speak' }, tokenCount: TOKEN_COUNT };
  return <Promptbar state={state} />;
}

/** Fia workflows — covers the bare "N workflows" trigger and all 3
 * active-workflow variants; selecting a suggestion sets `activeWorkflow`
 * and collapses the shelf (`Promptbar`'s own `onOpenChange` handling —
 * see its doc comment on `handleSelectWorkflow`). */
function FiaWorkflowsExample({
  initialActiveWorkflow,
  defaultOpen,
}: {
  initialActiveWorkflow: PromptbarActiveWorkflow | null;
  defaultOpen: boolean;
}) {
  const [activeWorkflow, setActiveWorkflow] = useState<PromptbarActiveWorkflow | null>(initialActiveWorkflow);
  const [paragraphSelection, setParagraphSelection] = useState<typeof PARAGRAPH_SELECTION | undefined>(
    PARAGRAPH_SELECTION
  );

  const state: PromptbarState = {
    mode: {
      aiMode: 'fia',
      fiaSubMode: 'workflows',
      chapterScene: CHAPTER_SCENE,
      paragraphSelection,
      // Only "Topic map"/"Develop scene" ever render this (the trigger
      // badge swaps to scene-link status for those two — see
      // `promptbar-presentation.ts`) — supplied unconditionally since it's
      // cheap and keeps every activeWorkflow value demoable from one state
      // object, matching this file's own "parametrized by initial state,
      // not near-duplicate blobs" convention.
      sceneConnected: true,
      scene: { sceneTitle: SCENE_TITLE },
      suggestions: WORKFLOW_SUGGESTIONS,
      activeWorkflow,
    },
    tokenCount: TOKEN_COUNT,
  };

  return (
    <Promptbar
      state={state}
      defaultOpen={defaultOpen}
      onSelectWorkflow={(kind) => setActiveWorkflow({ kind, label: WORKFLOW_LABEL[kind] })}
      onDismissActiveWorkflow={() => setActiveWorkflow(null)}
      onDismissParagraphSelection={() => setParagraphSelection(undefined)}
    />
  );
}

/** Storybook-only stand-in for a real speech-to-text backend — there isn't
 * one anywhere in this repo (confirmed by searching before building this
 * flow at all). Exists purely so the loading/error/retry states in
 * `PromptbarAudioCard` are actually exercisable here; a host app supplies
 * its own real implementation via `onTranscribeRecording`, never this one. */
function mockTranscribeRecording(shouldFail: boolean): (blob: Blob) => Promise<string> {
  return () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) reject(new Error('Mock transcription service unavailable.'));
        else resolve('This is a simulated transcript — wire a real speech-to-text backend to replace this.');
      }, 1200);
    });
}

/** Storybook-only stand-in for a realtime dictation backend — same
 * reasoning as `mockTranscribeRecording` above, no production transport
 * lives in this package (see `use-live-dictation.ts`). Emits a few interim
 * events (one word at a time, mimicking growing best-guess text) then a
 * final event, so the composer's own append/replace-current-utterance
 * behavior is visible without a real provider. `stop()` (returned to
 * `useLiveDictation`) tears the interval down, covering rapid start/stop —
 * clicking the mic again mid-sequence just cancels the timer, nothing
 * lingers. */
function mockLiveDictationAdapter(shouldFail: boolean): LiveDictationAdapter {
  return ({ onTranscript, onError }) => {
    if (shouldFail) {
      const timeoutId = setTimeout(
        () => onError({ type: 'unknown', message: 'Mock dictation service unavailable.' }),
        700
      );
      return { stop: () => clearTimeout(timeoutId) };
    }

    const words = ['Once', 'upon', 'a', 'time', 'in', 'the', 'Eldergrove…'];
    let index = 0;
    const intervalId = setInterval(() => {
      index += 1;
      const isFinal = index >= words.length;
      onTranscript({ text: words.slice(0, index).join(' '), isFinal });
      if (isFinal) clearInterval(intervalId);
    }, 350);

    return { stop: () => clearInterval(intervalId) };
  };
}

/** Live dictation — the composer's own mic icon, entirely separate from
 * the Audio Card flow above (`RecordingExample`). Starts/stops via the mic
 * button itself; existing composer text is preserved and dictation appends
 * after it. */
function LiveDictationExample() {
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [value, setValue] = useState('');
  const state: PromptbarState = {
    mode: { aiMode: 'gather', sceneConnected: false, scene: { sceneTitle: SCENE_TITLE } },
    tokenCount: TOKEN_COUNT,
  };
  return (
    <div className="flex flex-col gap-[var(--spacing-sm)]">
      <InlineSegmentedControl
        label="Mock dictation"
        value={simulateFailure ? 'fail' : 'succeed'}
        onChange={(v) => setSimulateFailure(v === 'fail')}
        options={[
          { value: 'succeed', label: 'Succeeds' },
          { value: 'fail', label: 'Fails' },
        ]}
      />
      <Promptbar
        state={state}
        value={value}
        onValueChange={setValue}
        onStartLiveDictation={mockLiveDictationAdapter(simulateFailure)}
      />
    </div>
  );
}

/** Audio — the whole card replaced by the waveform/cancel/confirm card;
 * confirming or cancelling returns to whatever mode was active before.
 * Confirming also runs the mock transcription above, then hands the result
 * back into the (also-shown) composer's own text. */
function RecordingExample() {
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [value, setValue] = useState('');
  const state: PromptbarState = {
    mode: { aiMode: 'gather', sceneConnected: false, scene: { sceneTitle: SCENE_TITLE } },
    tokenCount: TOKEN_COUNT,
  };
  return (
    <div className="flex flex-col gap-[var(--spacing-sm)]">
      <InlineSegmentedControl
        label="Mock transcription"
        value={simulateFailure ? 'fail' : 'succeed'}
        onChange={(v) => setSimulateFailure(v === 'fail')}
        options={[
          { value: 'succeed', label: 'Succeeds' },
          { value: 'fail', label: 'Fails (test retry)' },
        ]}
      />
      <Promptbar
        state={state}
        defaultIsRecording
        value={value}
        onValueChange={setValue}
        onTranscribeRecording={mockTranscribeRecording(simulateFailure)}
      />
    </div>
  );
}

// ---- Overview ----

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Promptbar"
      description="The largest organism in the design system — Figma Promptbar organism (16042:5539). Composes PromptbarShelf, AIModeToggle, Kbd, IconButton, StatusBadge/Status, and Textarea rather than recreating any of them; owns only the domain-state → presentation derivation and the top-level layout that keeps those components mounted at stable identities across state changes."
      playground={<PromptbarPlayground />}
      variants={
        <div className="flex flex-col gap-[var(--spacing-lg)]">
          <div>
            <p className="mb-2 text-sm font-medium">Gather — disconnected / connected, collapsed / expanded</p>
            <div className="flex flex-col gap-[var(--spacing-md)]">
              <GatherExample initialSceneConnected={false} defaultOpen={false} />
              <GatherExample initialSceneConnected defaultOpen={false} />
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Scene Desk — always connected, not expandable</p>
            <SceneDeskExample />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Fia default — static context chips</p>
            <FiaDefaultExample />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Fia speak — no shelf, mute + End controls</p>
            <FiaSpeakExample />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Fia workflows — suggestions / active workflow</p>
            <FiaWorkflowsExample initialActiveWorkflow={null} defaultOpen={false} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Audio — recording</p>
            <RecordingExample />
          </div>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>state</code> is the one domain-state prop a host app constructs — chapter/scene, scene-link connection,
            active workflow, and AI mode all live inside <code>state.mode</code> (a discriminated union on{' '}
            <code>aiMode</code>, and on <code>fiaSubMode</code> within Fia). See <code>promptbar-state.ts</code>.
          </li>
          <li>
            <code>isRecording</code>/<code>open</code>/the textarea&apos;s own <code>value</code> are local interaction
            state — controlled/uncontrolled exactly like <code>AIModeToggle</code>&apos;s own{' '}
            <code>value</code>/<code>defaultValue</code>/<code>onValueChange</code>.
          </li>
          <li>
            <code>PromptbarShelf</code> is composed unmodified — its own expand/collapse, hover, chevron, cascade, and
            checkmark-draw behavior all keep working exactly as shipped.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>Every icon-only control (plus, mic, mute, send, cancel/confirm) carries a real accessible name via <code>aria-label</code>.</li>
          <li>The textarea preserves native keyboard/focus behavior — no custom key handling beyond what <code>Textarea</code> already provides.</li>
        </ul>
      }
    />
  ),
};

// ---- Named stories — one per Figma symbol ----

export const AudioRecording: Story = { render: () => <RecordingExample /> };
// Not a Figma Mode×Expanded symbol (dictation is a composer-level
// interaction, not a distinct visual state) — kept here anyway since it's
// the one place `onStartLiveDictation` is exercisable in isolation.
export const LiveDictation: Story = { render: () => <LiveDictationExample /> };
export const FiaSpeak: Story = { render: () => <FiaSpeakExample /> };
export const GatherRoamCollapsed: Story = {
  render: () => <GatherExample initialSceneConnected={false} defaultOpen={false} />,
};
export const GatherForSceneCollapsed: Story = {
  render: () => <GatherExample initialSceneConnected defaultOpen={false} />,
};
export const SceneDeskCollapsed: Story = { render: () => <SceneDeskExample /> };
export const FiaDefaultCollapsed: Story = { render: () => <FiaDefaultExample /> };
export const GatherForSceneExpanded: Story = {
  render: () => <GatherExample initialSceneConnected defaultOpen />,
};
export const GatherRoamExpanded: Story = {
  render: () => <GatherExample initialSceneConnected={false} defaultOpen />,
};
export const WorkflowsDefaultCollapsed: Story = {
  render: () => <FiaWorkflowsExample initialActiveWorkflow={null} defaultOpen={false} />,
};
export const WorkflowsExpanded: Story = {
  render: () => <FiaWorkflowsExample initialActiveWorkflow={null} defaultOpen />,
};
export const WorkflowRelatedThemes: Story = {
  render: () => (
    <FiaWorkflowsExample initialActiveWorkflow={{ kind: 'related-themes', label: 'Related themes' }} defaultOpen={false} />
  ),
};
export const WorkflowTopicMap: Story = {
  render: () => (
    <FiaWorkflowsExample initialActiveWorkflow={{ kind: 'topic-map', label: 'Topic map' }} defaultOpen={false} />
  ),
};
export const WorkflowDevelopScene: Story = {
  render: () => (
    <FiaWorkflowsExample initialActiveWorkflow={{ kind: 'develop-scene', label: 'Develop scene' }} defaultOpen={false} />
  ),
};

// ---- Playground — controls for every meaningful state dimension ----

type AIModeControl = 'gather' | 'scene-desk' | 'fia';
type SceneLinkControl = 'disconnected' | 'connected';
type FiaSubModeControl = 'default' | 'speak' | 'workflows';
type ActiveWorkflowControl = 'none' | PromptbarWorkflowKind;
type ShelfOpenControl = 'collapsed' | 'expanded';

function buildPlaygroundState(params: {
  aiMode: AIModeControl;
  sceneLink: SceneLinkControl;
  fiaSubMode: FiaSubModeControl;
  activeWorkflow: ActiveWorkflowControl;
  tokenCount: number;
}): PromptbarState {
  const { aiMode, sceneLink, fiaSubMode, activeWorkflow, tokenCount } = params;

  if (aiMode === 'gather') {
    return {
      mode: {
        aiMode: 'gather',
        sceneConnected: sceneLink === 'connected',
        scene: { sceneTitle: SCENE_TITLE },
      },
      tokenCount,
    };
  }

  if (aiMode === 'scene-desk') {
    return { mode: { aiMode: 'scene-desk', scene: { sceneTitle: SCENE_TITLE } }, tokenCount };
  }

  if (fiaSubMode === 'default') {
    return {
      mode: {
        aiMode: 'fia',
        fiaSubMode: 'default',
        contextBadges: [
          { id: 'chapter-scene', label: `Ch. 1, Sc. 1 · "She's a Lumith…"` },
          { id: 'overflow', label: '+2' },
        ],
      },
      tokenCount,
    };
  }

  if (fiaSubMode === 'speak') {
    return { mode: { aiMode: 'fia', fiaSubMode: 'speak' }, tokenCount };
  }

  return {
    mode: {
      aiMode: 'fia',
      fiaSubMode: 'workflows',
      chapterScene: CHAPTER_SCENE,
      paragraphSelection: PARAGRAPH_SELECTION,
      sceneConnected: true,
      scene: { sceneTitle: SCENE_TITLE },
      suggestions: WORKFLOW_SUGGESTIONS,
      activeWorkflow: activeWorkflow === 'none' ? null : { kind: activeWorkflow, label: WORKFLOW_LABEL[activeWorkflow] },
    },
    tokenCount,
  };
}

/** Live control panel over the real `Promptbar` API — every axis below is
 * fully controlled (not `defaultX`), so toggling a control always reflects
 * immediately regardless of `Promptbar`'s own internal uncontrolled-state
 * fallback. */
function PromptbarPlayground() {
  const [isRecording, setIsRecording] = useState(false);
  const [aiMode, setAiMode] = useState<AIModeControl>('gather');
  const [sceneLink, setSceneLink] = useState<SceneLinkControl>('disconnected');
  const [fiaSubMode, setFiaSubMode] = useState<FiaSubModeControl>('default');
  const [activeWorkflow, setActiveWorkflow] = useState<ActiveWorkflowControl>('none');
  const [open, setOpen] = useState(false);
  const [tokenCount, setTokenCount] = useState(TOKEN_COUNT);

  const hasShelf = !isRecording && !(aiMode === 'fia' && fiaSubMode === 'speak');
  const isExpandable = hasShelf && (aiMode === 'gather' || (aiMode === 'fia' && fiaSubMode === 'workflows'));

  const state = buildPlaygroundState({ aiMode, sceneLink, fiaSubMode, activeWorkflow, tokenCount });

  return (
    <PlaygroundPanel
      preview={
        <Promptbar
          state={state}
          isRecording={isRecording}
          onIsRecordingChange={setIsRecording}
          open={isExpandable && open}
          onOpenChange={setOpen}
          onAIModeChange={setAiMode}
          onConnectScene={() => setSceneLink('connected')}
          onDisconnectScene={() => setSceneLink('disconnected')}
          onSelectWorkflow={(kind) => setActiveWorkflow(kind)}
          onDismissActiveWorkflow={() => setActiveWorkflow('none')}
        />
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Recording"
            value={isRecording ? 'on' : 'off'}
            onChange={(v) => setIsRecording(v === 'on')}
            options={['off', 'on']}
          />
          <InlineSegmentedControl
            label="AI mode"
            value={aiMode}
            onChange={setAiMode}
            options={[
              { value: 'gather', label: 'Gather' },
              { value: 'scene-desk', label: 'Scene Desk' },
              { value: 'fia', label: 'Fia' },
            ]}
          />
          {aiMode === 'gather' ? (
            <InlineSegmentedControl
              label="Scene link"
              value={sceneLink}
              onChange={setSceneLink}
              options={[
                { value: 'disconnected', label: 'Disconnected' },
                { value: 'connected', label: 'Connected' },
              ]}
            />
          ) : null}
          {aiMode === 'fia' ? (
            <InlineSegmentedControl
              label="Fia sub-mode"
              value={fiaSubMode}
              onChange={setFiaSubMode}
              options={[
                { value: 'default', label: 'Default' },
                { value: 'speak', label: 'Speak' },
                { value: 'workflows', label: 'Workflows' },
              ]}
            />
          ) : null}
          {aiMode === 'fia' && fiaSubMode === 'workflows' ? (
            <InlineSegmentedControl
              label="Active workflow"
              value={activeWorkflow}
              onChange={setActiveWorkflow}
              options={[
                { value: 'none', label: 'None' },
                { value: 'related-themes', label: 'Related themes' },
                { value: 'topic-map', label: 'Topic map' },
                { value: 'develop-scene', label: 'Develop scene' },
              ]}
            />
          ) : null}
          {isExpandable ? (
            <InlineSegmentedControl<ShelfOpenControl>
              label="Shelf"
              value={open ? 'expanded' : 'collapsed'}
              onChange={(v) => setOpen(v === 'expanded')}
              options={[
                { value: 'collapsed', label: 'Collapsed' },
                { value: 'expanded', label: 'Expanded' },
              ]}
            />
          ) : null}
          <div>
            <div className="mb-1.5 font-sans text-xs text-muted-foreground">Token count</div>
            <input
              type="number"
              value={tokenCount}
              onChange={(event) => setTokenCount(Number(event.target.value))}
              className="w-full rounded-sm border border-border bg-transparent px-3 py-1.5 font-sans text-sm text-foreground"
            />
          </div>
        </div>
      }
    />
  );
}
