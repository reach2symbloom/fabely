import { describe, expect, it } from 'vitest';

import { derivePlaceholder, derivePromptbarPresentation } from './promptbar-presentation';
import type { PromptbarModeState, PromptbarState } from './promptbar-state';

const SCENE = { sceneTitle: 'The Eldergrove' };
const CHAPTER_SCENE = { chapter: 1, scene: 1 };
const SUGGESTIONS = [
  { kind: 'related-themes' as const, title: 'Related themes title', description: 'Related themes description' },
  { kind: 'topic-map' as const, title: 'Topic map title', description: 'Topic map description' },
  { kind: 'develop-scene' as const, title: 'Develop scene title', description: 'Develop scene description' },
];

function state(mode: PromptbarModeState): PromptbarState {
  return { mode, tokenCount: 750 };
}

describe('derivePromptbarPresentation — the 13 Figma Mode×Expanded states', () => {
  it('Audio, collapsed — no shelf, no composer, regardless of mode', () => {
    const result = derivePromptbarPresentation(
      state({ aiMode: 'gather', sceneConnected: false, scene: SCENE }),
      { isRecording: true }
    );
    expect(result).toEqual({ shelf: { visible: false }, composer: null });
  });

  it('Fia speak, collapsed — no shelf, composer shows mute + End, no mic/plus toggle', () => {
    const result = derivePromptbarPresentation(state({ aiMode: 'fia', fiaSubMode: 'speak' }), { isRecording: false });
    expect(result.shelf).toEqual({ visible: false });
    expect(result.composer).toMatchObject({
      sendVariant: 'text-end',
      showMuteButton: true,
      showMicButton: false,
      showAIModeToggle: true,
    });
  });

  it('Gather and roam, collapsed — disconnected badge, no trailing glyph, 3-item menu, connect row still carries the scene title', () => {
    const result = derivePromptbarPresentation(
      state({ aiMode: 'gather', sceneConnected: false, scene: SCENE }),
      { isRecording: false }
    );
    expect(result.shelf.visible).toBe(true);
    if (!result.shelf.visible) return;
    expect(result.shelf.statusRows).toEqual([
      [{ kind: 'scene-link-status', key: 'status', connected: false, sceneTitle: 'The Eldergrove' }],
    ]);
    expect(result.shelf.menuItems).toHaveLength(3);
    expect(result.shelf.menuItems?.map((item) => item.key)).toEqual(['connect', 'link-another', 'create-from-search']);
    // Disconnected still shows the scene it *would* connect to — the row
    // describes "the scene this search would link to," not "the scene
    // it's linked to." See PromptbarGatherState's own doc comment.
    expect(result.shelf.menuItems?.[0]).toMatchObject({
      kind: 'scene-link-connect',
      connected: false,
      sceneTitle: 'The Eldergrove',
    });
  });

  it('Gather for scene, collapsed — connected badge with trailing status glyph, 4-item menu with disconnect footer', () => {
    const result = derivePromptbarPresentation(
      state({ aiMode: 'gather', sceneConnected: true, scene: SCENE }),
      { isRecording: false }
    );
    expect(result.shelf.visible).toBe(true);
    if (!result.shelf.visible) return;
    expect(result.shelf.statusRows[0][0]).toMatchObject({
      kind: 'scene-link-status',
      connected: true,
      sceneTitle: 'The Eldergrove',
    });
    expect(result.shelf.menuItems).toHaveLength(4);
    expect(result.shelf.menuItems?.[0]).toMatchObject({ kind: 'scene-link-connect', connected: true, sceneTitle: 'The Eldergrove' });
    expect(result.shelf.menuItems?.at(-1)).toMatchObject({ key: 'disconnect', separatorBefore: true });
  });

  it('Scene desk, collapsed — connected badge, not expandable', () => {
    const result = derivePromptbarPresentation(state({ aiMode: 'scene-desk', scene: SCENE }), { isRecording: false });
    expect(result.shelf).toMatchObject({ visible: true, expandable: false });
    if (!result.shelf.visible) return;
    expect(result.shelf.menuItems).toBeUndefined();
    expect(result.shelf.statusRows[0][0]).toMatchObject({ leadingIcon: 'book-open-text', label: 'Scene desk' });
  });

  it('Fia default, collapsed — one row, context chip and overflow badge side by side, not expandable', () => {
    const result = derivePromptbarPresentation(
      state({
        aiMode: 'fia',
        fiaSubMode: 'default',
        contextBadges: [
          { id: 'a', label: 'Ch. 1, Sc. 1', onDismiss: () => {} },
          { id: 'b', label: '+2' },
        ],
      }),
      { isRecording: false }
    );
    expect(result.shelf).toMatchObject({ visible: true, expandable: false });
    if (!result.shelf.visible) return;
    expect(result.shelf.statusRows).toHaveLength(1);
    expect(result.shelf.statusRows[0][0]).toMatchObject({ kind: 'generic', dismissible: true });
    expect(result.shelf.statusRows[0][1]).toMatchObject({ kind: 'generic', dismissible: false });
  });

  it('Gather for scene, expanded vs. Gather and roam, expanded — same shelf shape, different menu length', () => {
    const connected = derivePromptbarPresentation(
      state({ aiMode: 'gather', sceneConnected: true, scene: SCENE }),
      { isRecording: false }
    );
    const disconnected = derivePromptbarPresentation(
      state({ aiMode: 'gather', sceneConnected: false, scene: SCENE }),
      { isRecording: false }
    );
    expect(connected.shelf.visible && connected.shelf.menuItems?.length).toBe(4);
    expect(disconnected.shelf.visible && disconnected.shelf.menuItems?.length).toBe(3);
  });

  it('Workflows Default, collapsed — trigger is the "N workflows" count badge', () => {
    const result = derivePromptbarPresentation(
      state({
        aiMode: 'fia',
        fiaSubMode: 'workflows',
        chapterScene: CHAPTER_SCENE,
        suggestions: SUGGESTIONS,
        activeWorkflow: null,
      }),
      { isRecording: false }
    );
    expect(result.shelf.visible).toBe(true);
    if (!result.shelf.visible) return;
    expect(result.shelf.trigger).toMatchObject({ key: 'workflow-count', label: '3 workflows' });
    expect(result.shelf.menuItems).toHaveLength(3);
  });

  it.each(SUGGESTIONS.map((s) => s.kind))(
    'Workflow: %s, collapsed — trigger becomes the dismissible active-workflow chip, menu still shows all suggestions checked correctly',
    (kind) => {
      const result = derivePromptbarPresentation(
        state({
          aiMode: 'fia',
          fiaSubMode: 'workflows',
          chapterScene: CHAPTER_SCENE,
          suggestions: SUGGESTIONS,
          activeWorkflow: { kind, label: kind },
        }),
        { isRecording: false }
      );
      expect(result.shelf.visible).toBe(true);
      if (!result.shelf.visible) return;
      expect(result.shelf.trigger).toMatchObject({ key: 'active-workflow', dismissible: true });
      const genericItems = result.shelf.menuItems?.filter((item) => item.kind === 'generic') ?? [];
      const activeItem = genericItems.find((item) => item.key === kind);
      expect(activeItem?.checked).toBe(true);
      expect(genericItems.filter((item) => item.checked)).toHaveLength(1);
    }
  );
});

describe('derivePlaceholder', () => {
  it('differs between Gather disconnected and connected', () => {
    expect(derivePlaceholder({ aiMode: 'gather', sceneConnected: false, scene: SCENE })).toBe(
      'Search your notes for material'
    );
    expect(derivePlaceholder({ aiMode: 'gather', sceneConnected: true, scene: SCENE })).toBe(
      'Search for material to bookmark to your scene desk'
    );
  });

  it('changes per active workflow, falling back to the generic prompt when none is active', () => {
    const base = { aiMode: 'fia' as const, fiaSubMode: 'workflows' as const, chapterScene: CHAPTER_SCENE, suggestions: SUGGESTIONS };
    expect(derivePlaceholder({ ...base, activeWorkflow: null })).toBe('Tell Fia what you want to do…');
    expect(derivePlaceholder({ ...base, activeWorkflow: { kind: 'related-themes', label: 'Related themes' } })).toBe(
      'Tell Fia what kind of related material to look for…'
    );
    expect(derivePlaceholder({ ...base, activeWorkflow: { kind: 'topic-map', label: 'Topic map' } })).toBe(
      'Find related ideas about…'
    );
    expect(derivePlaceholder({ ...base, activeWorkflow: { kind: 'develop-scene', label: 'Develop scene' } })).toBe(
      'Tell Fia what you want to develop in this scene…'
    );
  });
});
