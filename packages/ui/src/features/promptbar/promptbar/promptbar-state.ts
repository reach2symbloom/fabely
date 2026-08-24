/**
 * Promptbar — domain state types.
 *
 * Pure types only, no React import — this is the organism's own state
 * model, independent of how it eventually gets rendered (mirrors
 * `status-badge-content.ts`'s own "pure data-shaping, zero JSX" shape, one
 * level up: state, not just formatted strings). Composes `StatusBadge`'s
 * own data-shaping types (`ChapterSceneReference`, `SceneConnectionInput`,
 * `ParagraphSelectionReference`) and `AIModeToggle`'s own `AIMode` union
 * rather than redeclaring equivalent shapes — see each field's own comment
 * for which existing contract it reuses.
 *
 * `PromptbarState` is intentionally the *only* thing a host app has to
 * construct — chapter/scene/paragraph/selection, Scene Desk vs. All Notes
 * context, scene-link connection, active workflow, and AI mode all live
 * inside `mode` (a discriminated union on `aiMode`, and on `fiaSubMode`
 * within Fia), not as separate top-level props the organism has to
 * reconcile itself. `Promptbar` (the component) owns turning this into
 * presentation via `derivePromptbarPresentation` — see
 * `promptbar-presentation.ts` — never the other way around.
 */

import type { ChapterSceneReference, ParagraphSelectionReference, SceneConnectionInput } from '@/atoms/status-badge';

/** One dismissible context chip in the Fia-default shelf's stacked badge
 * rows (e.g. "Ch. 1, Sc. 1 · 'She's a Lumith…'"). `onDismiss` omitted
 * means not dismissible — the trailing "+2" overflow chip has no `×`. */
export type PromptbarFiaContextBadge = {
  id: string;
  label: string;
  onDismiss?: () => void;
};

export type PromptbarWorkflowKind = 'related-themes' | 'topic-map' | 'develop-scene';

/** One row in the "Suggested workflows" menu. */
export type PromptbarWorkflowSuggestion = {
  kind: PromptbarWorkflowKind;
  title: string;
  description: string;
};

/** The workflow currently running, if any — drives the dismissible
 * "Workflow: X" chip that replaces the "N workflows" trigger badge, and
 * the composer's placeholder copy. */
export type PromptbarActiveWorkflow = {
  kind: PromptbarWorkflowKind;
  label: string;
};

/** `scene` is always present, regardless of `sceneConnected` — it's "the
 * scene this search would link to," not "the scene it's linked to." The
 * reference implementation (`PromptbarShelf.stories.tsx`'s
 * `DefaultTypeExample`) models these as two genuinely independent pieces
 * of state (`useState(false)` for `connected`, a separate `useState` for
 * `sceneTitle`) — the "Connect/Connected to current scene" row's own
 * description always shows that scene's title either way, only the
 * title/icon/checkmark change with connection status. An earlier version
 * of this type conflated the two (only carrying a scene title in the
 * `'connected'` case), which silently dropped that always-visible scene
 * title in the disconnected state. */
export type PromptbarGatherState = {
  aiMode: 'gather';
  sceneConnected: boolean;
  scene: SceneConnectionInput;
};

/** Scene Desk has no "disconnected" case in Figma (no `Mode=Scene desk,
 * Expanded=True` symbol exists either — Scene Desk's shelf is a static
 * status display, not expandable, same treatment as Fia-default's). */
export type PromptbarSceneDeskState = {
  aiMode: 'scene-desk';
  scene: SceneConnectionInput;
};

/** Discriminated on `fiaSubMode` — each sub-mode carries only the data it
 * actually needs (e.g. `speak` carries nothing; `workflows` carries the
 * suggestion list + which one is active). The toggle's own displayed
 * value is `aiMode` ("fia") regardless of sub-mode — including
 * `fiaSubMode: 'default'`, where one Figma reference frame shows the
 * toggle pill on "Gather" instead; per product decision that's treated as
 * a design-file inconsistency, not intentional, so this type doesn't
 * carry a separate "toggle override" field for it. */
export type PromptbarFiaState =
  | { aiMode: 'fia'; fiaSubMode: 'default'; contextBadges: PromptbarFiaContextBadge[] }
  | { aiMode: 'fia'; fiaSubMode: 'speak' }
  | {
      aiMode: 'fia';
      fiaSubMode: 'workflows';
      chapterScene: ChapterSceneReference;
      paragraphSelection?: ParagraphSelectionReference;
      suggestions: PromptbarWorkflowSuggestion[];
      activeWorkflow: PromptbarActiveWorkflow | null;
    };

export type PromptbarModeState = PromptbarGatherState | PromptbarSceneDeskState | PromptbarFiaState;

/** The organism's one domain-state prop — supplied by the host app. Does
 * not include `isRecording`, `shelfOpen`, or the textarea's own value:
 * those are local interaction state (controlled/uncontrolled props on
 * `Promptbar` itself, mirroring `AIModeToggle`/`PromptbarShelf`'s own
 * `value`/`defaultValue`/`onValueChange` and `open`/`defaultOpen`/
 * `onOpenChange` patterns), not domain state a host app derives from
 * chapter/scene/workflow context. */
export type PromptbarState = {
  mode: PromptbarModeState;
  /** The "750" token-count pill. */
  tokenCount: number;
};
