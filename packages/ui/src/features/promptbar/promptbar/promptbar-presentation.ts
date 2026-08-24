/**
 * Promptbar — pure state → presentation derivation.
 *
 * No React import, no icon-component import — icons are referenced by a
 * closed string-literal token (`PromptbarIconToken`), resolved to an
 * actual component only in `promptbar-icons.tsx`. That keeps this module
 * trivially unit-testable (`expect(derivePromptbarPresentation(...)).
 * toEqual({...})`, no render step, no DOM) and free of any dependency on
 * `motion/react` or Lucide, matching `promptbar-state.ts`'s own "pure
 * data, no React" shape.
 *
 * This is the one place the Figma Mode×Expanded axis actually gets read —
 * every other file in this feature consumes the descriptor this produces,
 * never branches on `state.mode.aiMode`/`fiaSubMode` itself. That's what
 * keeps `Promptbar.tsx` a thin skeleton instead of the "one giant
 * component full of variant-specific conditional markup" this feature was
 * explicitly built to avoid.
 */

import type {
  ChapterSceneReference,
  ParagraphSelectionReference,
  SceneConnectionInput,
} from '@/atoms/status-badge';
import { formatChapterScene, formatParagraphReference } from '@/atoms/status-badge';
import type {
  PromptbarActiveWorkflow,
  PromptbarFiaContextBadge,
  PromptbarModeState,
  PromptbarState,
  PromptbarWorkflowKind,
  PromptbarWorkflowSuggestion,
} from './promptbar-state';

export type PromptbarIconToken =
  | 'globe'
  | 'book-open-text'
  | 'link-off'
  | 'line-dot'
  | 'workflow'
  | 'feather'
  | 'check'
  | 'git-compare'
  | 'share2'
  | 'zap'
  | 'coins'
  | 'mic'
  | 'mic-off'
  | 'audio-lines'
  | 'arrow-up'
  | 'square'
  | 'plus'
  | 'x';

export type PromptbarGenericBadgeSpec = {
  kind: 'generic';
  key: string;
  leadingIcon?: PromptbarIconToken;
  label: string;
  middleIcon?: PromptbarIconToken;
  secondaryText?: string;
  /** True for a fixed system message ("Not connected to scene") rather
   * than scene-title/context content — opts the badge out of
   * `StatusBadge`'s default scene-title truncation via
   * `secondaryTextClassName`, same distinction `PromptbarShelf`'s own
   * stories already established for this exact string. */
  secondaryIsSystemMessage?: boolean;
  trailingIcon?: PromptbarIconToken;
  trailingStatusGlyph?: boolean;
  tone?: 'neutral' | 'secondary' | 'fia';
  size?: 'compact' | 'default';
  dismissible?: boolean;
  dismissLabel?: string;
  onDismiss?: () => void;
};

/**
 * The Gather-mode status badge ("All notes · The Eldergrove") — kept as
 * its own variant rather than squeezed into `PromptbarGenericBadgeSpec`
 * because its reference implementation (`PromptbarShelf.stories.tsx`'s
 * `DefaultTypeExample`) is never a static badge: the icon, secondary
 * text, and trailing status glyph each crossfade (with a "bloom" —
 * opacity + subtle scale + blur-to-crisp — on the way to connected)
 * whenever `connected` flips, via `ConnectionIconCrossfade`/
 * `ConnectionTextCrossfade`/`ConnectionAtomCrossfade`. A generic
 * label/secondaryText/icon spec has no way to express that choreography.
 * `PromptbarShelfContent.tsx`'s `SceneLinkStatusBadge` renders this
 * exactly as the reference built it.
 */
export type PromptbarSceneLinkStatusBadgeSpec = {
  kind: 'scene-link-status';
  key: string;
  connected: boolean;
  sceneTitle: string;
};

export type PromptbarBadgeSpec = PromptbarGenericBadgeSpec | PromptbarSceneLinkStatusBadgeSpec;

export type PromptbarGenericMenuItemSpec = {
  kind: 'generic';
  key: string;
  icon: PromptbarIconToken;
  title: string;
  description: string;
  checked?: boolean;
  onSelect?: () => void;
  separatorBefore?: boolean;
};

/**
 * The "Connect/Connected to current scene" row — kept as its own variant
 * rather than squeezed into `PromptbarGenericMenuItemSpec` because its
 * reference implementation (`PromptbarShelf.stories.tsx`'s
 * `DefaultTypeExample`) carries real behavior a generic
 * title/description/icon row can't express: a title crossfade between
 * "Connect"/"Connected" copy, a `transition-colors` icon that resolves to
 * success-green once connected, and an inline "Disconnect" link beside the
 * scene title (visible only once connected). `sceneTitle` is always
 * present regardless of `connected` — this row shows "the scene this
 * search would link to," not "the scene it's linked to," so the title
 * never disappears when disconnected. `PromptbarShelfContent.tsx`'s
 * `SceneLinkConnectItem` renders this exactly as the reference built it.
 */
export type PromptbarSceneLinkConnectItemSpec = {
  kind: 'scene-link-connect';
  key: string;
  connected: boolean;
  sceneTitle: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

export type PromptbarMenuItemSpec = PromptbarGenericMenuItemSpec | PromptbarSceneLinkConnectItemSpec;

export type PromptbarShelfPresentation =
  | { visible: false }
  | {
      visible: true;
      /** Rows of badges — every mode today renders exactly one row (Figma
       * has no shelf variant with genuinely stacked status rows); kept as
       * an array of rows, not a flat array, so a future mode that does
       * need to stack doesn't require reshaping this type. */
      statusRows: PromptbarBadgeSpec[][];
      trigger?: PromptbarBadgeSpec;
      expandable: boolean;
      menuCaption?: string;
      menuItems?: PromptbarMenuItemSpec[];
    };

export type PromptbarComposerPresentation = {
  placeholder: string;
  /** `'stacked'` only for the Fia-workflows composer (placeholder above
   * the Kbd hint, `flex-col`) — every other mode is `'inline'` (one row,
   * `flex-row`). Confirmed via Figma metadata: the workflow-active
   * variants reuse the exact same "Fia typing" frame as the no-active-
   * workflow default, so the stacked layout applies to all of them, not
   * just the bare default. */
  placeholderLayout: 'inline' | 'stacked';
  showAIModeToggle: boolean;
  /** `'text-end'` only for Fia-speak — the one mode whose send control
   * shows a visible "End" label instead of being icon-only. */
  sendVariant: 'icon' | 'text-end';
  showMuteButton: boolean;
  showPlusButton: boolean;
  showMicButton: boolean;
};

export type PromptbarPresentation = {
  shelf: PromptbarShelfPresentation;
  /** `null` when recording — the whole card is replaced by the Audio
   * waveform card, which has no composer at all. */
  composer: PromptbarComposerPresentation | null;
};

const WORKFLOW_ICON: Record<PromptbarWorkflowKind, PromptbarIconToken> = {
  'related-themes': 'git-compare',
  'topic-map': 'share2',
  'develop-scene': 'zap',
};

const WORKFLOW_LABEL: Record<PromptbarWorkflowKind, string> = {
  'related-themes': 'Related themes',
  'topic-map': 'Topic map',
  'develop-scene': 'Develop scene',
};

/** Shared by Gather (both connection states) and, in principle, Scene
 * Desk's own connected shelf — the "change scene link" menu is one
 * builder, not several near-duplicate item lists. Scene Desk itself never
 * calls this today (its shelf isn't expandable — see `promptbar-state.ts`'s
 * own comment on `PromptbarSceneDeskState`). The first item is always the
 * `'scene-link-connect'` row (see that type's own doc comment for why it's
 * not a generic row) — its `sceneTitle` is `scene.sceneTitle` regardless
 * of `sceneConnected`, exactly matching the reference's own behavior. */
export function deriveSceneLinkMenuItems(
  sceneConnected: boolean,
  scene: SceneConnectionInput,
  onConnect: () => void,
  onLinkAnother: () => void,
  onCreateFromSearch: () => void,
  onDisconnect: () => void
): PromptbarMenuItemSpec[] {
  const items: PromptbarMenuItemSpec[] = [
    {
      kind: 'scene-link-connect',
      key: 'connect',
      connected: sceneConnected,
      sceneTitle: scene.sceneTitle,
      onConnect,
      onDisconnect,
    },
    {
      kind: 'generic',
      key: 'link-another',
      icon: 'link-off',
      title: 'Link to another scene',
      description: 'Bookmarks will be moved to the new scene',
      onSelect: onLinkAnother,
    },
    {
      kind: 'generic',
      key: 'create-from-search',
      icon: 'workflow',
      title: 'Create scene from this search',
      description: 'Turn these results into a new scene',
      onSelect: onCreateFromSearch,
    },
  ];

  if (sceneConnected) {
    items.push({
      kind: 'generic',
      key: 'disconnect',
      icon: 'link-off',
      title: 'Disconnect search from current scene',
      description: 'Bookmarks will be saved to the search history',
      separatorBefore: true,
      onSelect: onDisconnect,
    });
  }

  return items;
}

export function deriveWorkflowMenuItems(
  suggestions: PromptbarWorkflowSuggestion[],
  activeWorkflow: PromptbarActiveWorkflow | null,
  onSelect: (kind: PromptbarWorkflowKind) => void
): PromptbarMenuItemSpec[] {
  return suggestions.map((suggestion) => ({
    kind: 'generic' as const,
    key: suggestion.kind,
    icon: WORKFLOW_ICON[suggestion.kind],
    title: suggestion.title,
    description: suggestion.description,
    checked: activeWorkflow?.kind === suggestion.kind,
    onSelect: () => onSelect(suggestion.kind),
  }));
}

function sceneLinkStatusBadge(sceneConnected: boolean, scene: SceneConnectionInput): PromptbarBadgeSpec {
  return { kind: 'scene-link-status', key: 'status', connected: sceneConnected, sceneTitle: scene.sceneTitle };
}

function sceneDeskStatusBadge(scene: SceneConnectionInput): PromptbarBadgeSpec {
  return {
    kind: 'generic',
    key: 'status',
    leadingIcon: 'book-open-text',
    label: 'Scene desk',
    middleIcon: 'line-dot',
    secondaryText: scene.sceneTitle,
    trailingStatusGlyph: true,
  };
}

function chapterSceneParagraphLabel(
  chapterScene: ChapterSceneReference,
  paragraphSelection?: ParagraphSelectionReference
): string {
  const base = formatChapterScene(chapterScene, 'dot');
  return paragraphSelection ? `${base} · ${formatParagraphReference(paragraphSelection)}` : base;
}

/** Handlers a host app supplies for the scene-link/workflow menu rows —
 * kept as its own parameter object (rather than folded into
 * `PromptbarState`) since these are behavior, not state, and
 * `promptbar-state.ts` is deliberately state-only. */
export type PromptbarActionHandlers = {
  onConnectScene?: () => void;
  onLinkAnotherScene?: () => void;
  onCreateSceneFromSearch?: () => void;
  onDisconnectScene?: () => void;
  onSelectWorkflow?: (kind: PromptbarWorkflowKind) => void;
  onDismissActiveWorkflow?: () => void;
  onDismissParagraphSelection?: () => void;
};

const NOOP = () => {};

export function deriveShelfPresentation(
  mode: PromptbarModeState,
  handlers: PromptbarActionHandlers
): PromptbarShelfPresentation {
  switch (mode.aiMode) {
    case 'gather': {
      const menuItems = deriveSceneLinkMenuItems(
        mode.sceneConnected,
        mode.scene,
        handlers.onConnectScene ?? NOOP,
        handlers.onLinkAnotherScene ?? NOOP,
        handlers.onCreateSceneFromSearch ?? NOOP,
        handlers.onDisconnectScene ?? NOOP
      );
      return {
        visible: true,
        expandable: true,
        statusRows: [[sceneLinkStatusBadge(mode.sceneConnected, mode.scene)]],
        menuCaption: 'CHANGE SCENE LINK',
        menuItems,
      };
    }

    case 'scene-desk':
      // Not expandable — no `Mode=Scene desk, Expanded=True` symbol exists
      // in Figma; see `PromptbarSceneDeskState`'s own doc comment.
      return {
        visible: true,
        expandable: false,
        statusRows: [[sceneDeskStatusBadge(mode.scene)]],
      };

    case 'fia':
      switch (mode.fiaSubMode) {
        case 'default':
          return {
            visible: true,
            expandable: false,
            // One row — the context chip and its "+2" overflow badge sit
            // side by side (Figma Fia default, 16220:1152), not stacked.
            statusRows: [
              mode.contextBadges.map(
                (badge: PromptbarFiaContextBadge): PromptbarBadgeSpec => ({
                  kind: 'generic',
                  key: badge.id,
                  leadingIcon: 'book-open-text',
                  label: badge.label,
                  dismissible: badge.onDismiss !== undefined,
                  onDismiss: badge.onDismiss,
                })
              ),
            ],
          };

        case 'speak':
          // No shelf at all in Fia-speak — confirmed, not merely omitted.
          return { visible: false };

        case 'workflows': {
          const trigger: PromptbarBadgeSpec = mode.activeWorkflow
            ? {
                kind: 'generic',
                key: 'active-workflow',
                leadingIcon: WORKFLOW_ICON[mode.activeWorkflow.kind],
                label: `Workflow: ${mode.activeWorkflow.label}`,
                tone: 'fia',
                size: 'default',
                dismissible: true,
                dismissLabel: `Remove Workflow: ${mode.activeWorkflow.label}`,
                onDismiss: handlers.onDismissActiveWorkflow,
              }
            : {
                kind: 'generic',
                key: 'workflow-count',
                leadingIcon: 'feather',
                label: `${mode.suggestions.length} workflows`,
                tone: 'fia',
                size: 'default',
              };

          /* "Topic map" and "Develop scene" swap the left status badge to
           * the scene-link one (same as Gather's) instead of the chapter/
           * scene/paragraph-selection badge every other workflow state
           * shows — confirmed against Figma (`16337:7352`/`16337:7353` vs
           * `16337:7354`/the bare `16337:7351` default). Those two
           * workflows operate on "the connected scene," not a text
           * selection, so that's the context worth surfacing here. */
          const usesSceneLinkStatus =
            mode.activeWorkflow?.kind === 'topic-map' || mode.activeWorkflow?.kind === 'develop-scene';

          const statusBadge: PromptbarBadgeSpec = usesSceneLinkStatus
            ? sceneLinkStatusBadge(mode.sceneConnected ?? false, mode.scene ?? { sceneTitle: '' })
            : {
                kind: 'generic',
                key: 'status',
                leadingIcon: 'book-open-text',
                label: chapterSceneParagraphLabel(mode.chapterScene, mode.paragraphSelection),
                size: 'default',
                // Dismissible only when there's an actual selection to
                // clear — confirmed against Figma (the badge's own "Fade
                // button" + Icon/x) — not the bare chapter/scene case.
                dismissible: mode.paragraphSelection !== undefined,
                dismissLabel: 'Clear text selection',
                onDismiss: handlers.onDismissParagraphSelection,
              };

          return {
            visible: true,
            expandable: true,
            statusRows: [[statusBadge]],
            trigger,
            menuCaption: 'SUGGESTED WORKFLOWS',
            menuItems: deriveWorkflowMenuItems(mode.suggestions, mode.activeWorkflow, handlers.onSelectWorkflow ?? NOOP),
          };
        }
      }
  }
}

export function derivePlaceholder(mode: PromptbarModeState): string {
  switch (mode.aiMode) {
    case 'gather':
      return mode.sceneConnected
        ? 'Search for material to bookmark to your scene desk'
        : 'Search your notes for material';
    case 'scene-desk':
      return 'Search your scene bookmarks to pin into your scene';
    case 'fia':
      switch (mode.fiaSubMode) {
        case 'default':
          return 'Ask Fia about your writing…';
        case 'speak':
          return 'Type';
        case 'workflows':
          switch (mode.activeWorkflow?.kind) {
            case 'related-themes':
              return 'Tell Fia what kind of related material to look for…';
            case 'topic-map':
              return 'Find related ideas about…';
            case 'develop-scene':
              return 'Tell Fia what you want to develop in this scene…';
            default:
              return 'Tell Fia what you want to do…';
          }
      }
  }
}

export function deriveComposerPresentation(mode: PromptbarModeState): PromptbarComposerPresentation {
  const isFiaWorkflows = mode.aiMode === 'fia' && mode.fiaSubMode === 'workflows';
  const isFiaSpeak = mode.aiMode === 'fia' && mode.fiaSubMode === 'speak';

  return {
    placeholder: derivePlaceholder(mode),
    placeholderLayout: isFiaWorkflows ? 'stacked' : 'inline',
    showAIModeToggle: true,
    sendVariant: isFiaSpeak ? 'text-end' : 'icon',
    showMuteButton: isFiaSpeak,
    showPlusButton: true,
    showMicButton: !isFiaSpeak,
  };
}

export function derivePromptbarPresentation(
  state: PromptbarState,
  ui: { isRecording: boolean },
  handlers: PromptbarActionHandlers = {}
): PromptbarPresentation {
  if (ui.isRecording) {
    return { shelf: { visible: false }, composer: null };
  }
  return {
    shelf: deriveShelfPresentation(state.mode, handlers),
    composer: deriveComposerPresentation(state.mode),
  };
}
