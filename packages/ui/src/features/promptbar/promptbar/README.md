# Promptbar

The Promptbar organism — the largest organism in the design system. Figma
[Promptbar organism](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16042-5539)
(`16042:5539`), 13 Mode×Expanded symbols.

Placement: NO — product-specific Promptbar chrome, stays in
`src/features/promptbar/promptbar/`.

## What this composes, not recreates

- [`PromptbarShelf`](../shelf/README.md) — the status card docked above the
  composer. Unmodified; this organism only supplies its
  `statusContent`/`trigger`/`children` props.
- [`AIModeToggle`](../ai-mode-toggle/AiModeToggle.tsx) — the Gather / Scene
  Desk / Fia segmented control. Unmodified.
- `Kbd` (`@/primitives/kbd`) — the `⌘V` hint.
- `IconButton` / `Button` (`@/primitives/button`) — every control-row and
  Audio-card button.
- `StatusBadge` / `Status` (`@/atoms/status-badge`, `@/atoms/status`) —
  every chip in the shelf's status row and the connected-scene glyph.
- `Textarea` (`@/primitives/textarea`), `variant="invisible"` — the prompt
  input.

Nothing here reimplements any of the above's own interaction/animation
behavior — see [Motion](#motion) below.

## Files

| File | Owns |
| --- | --- |
| `promptbar-state.ts` | Domain state types (`PromptbarState`) — pure, no React import. |
| `promptbar-presentation.ts` | Pure `state → presentation` derivation — no React/icon import. The only place anything branches on `aiMode`/`fiaSubMode`. |
| `promptbar-icons.tsx` | `PromptbarIconToken → component` lookup — the only file that imports every icon. |
| `PromptbarShelfContent.tsx` | Turns a shelf-presentation descriptor into `StatusBadge`/`ListItem`/`Status`/`Separator` JSX. |
| `PromptbarComposer.tsx` | The input card: `Textarea` + `Kbd` + control row. |
| `PromptbarAudioCard.tsx` | The no-shelf recording card. |
| `Promptbar.tsx` | The thin top-level skeleton — layout + motion-identity, nothing else. |

## State model

`Promptbar` takes one domain-state prop, `state: PromptbarState`:

```ts
type PromptbarState = {
  mode: PromptbarModeState; // discriminated on aiMode, and on fiaSubMode within Fia
  tokenCount: number;
};
```

Chapter/scene, scene-link connection, active workflow, and AI mode all
live inside `mode` — a host app never passes these as separate top-level
props. `promptbar-state.ts` reuses `StatusBadge`'s own data-shaping types
(`ChapterSceneReference`, `SceneConnectionInput`, `ParagraphSelectionReference`)
rather than redeclaring them.

Local interaction state (`isRecording`, `open`, the textarea's own
`value`) is controlled/uncontrolled on `Promptbar` itself — the same
`value`/`defaultValue`/`onValueChange` and `open`/`defaultOpen`/
`onOpenChange` pattern `AIModeToggle`/`PromptbarShelf` already use. This
state is *not* part of `PromptbarState` — it's ephemeral UI state, not
something a host app derives from chapter/scene/workflow context.

`derivePromptbarPresentation(state, { isRecording }, handlers)` is the one
function that turns state into what each region should render — icons are
referenced by string token (`PromptbarIconToken`), not component, so this
module has zero React/Lucide dependency and is trivially unit-testable
with plain `toEqual` assertions, no render step.

## Motion

No new animation language introduced. `PromptbarShelf` has exactly one
call site in `Promptbar.tsx`, never keyed by a domain value — its own
`statusContent`/`trigger`/`children` vary per render via props, so its
internal cascade/hover/chevron/checkmark-draw animations keep running
across mode switches instead of resetting from an accidental remount.
`AIModeToggle` is likewise one call site inside `PromptbarComposer`, so
its `layoutId` pill-morph works the same way.

The one intentional exception: entering/leaving Recording or Fia-speak
genuinely removes the shelf from the tree (Figma specifies no shelf in
either state) — wrapped in `AnimatePresence` at the `Promptbar.tsx` level
so that transition fades rather than pops. This is the shelf's own
mount/unmount, which `PromptbarShelf` has no opinion about (only its
internal open/closed one) — not a reimplementation of anything it owns.

## Decisions made without an exact Figma/primitive match

- **Icon-button size**: Figma's control-row buttons (32×32, 20px icon) and
  Audio buttons (36×36, 24px icon) don't exactly match any `IconButton`
  size slot. Reused the nearest box size (`sm`/`default`) with the icon
  glyph size overridden via `className` — confirmed with Christian rather
  than silently choosing.
- **Textarea typography**: `Textarea`'s `textStyle` only has `body`
  (14/20) and `heading`; Figma's placeholder is 16/24
  (`--text-paragraph-regular-regular-*`). Overridden via `className` at
  this one call site rather than widening the primitive's `textStyle`
  axis — revisit if a second consumer needs the same combination.
- **Scene Desk's shelf is not expandable** — no `Mode=Scene desk,
  Expanded=True` symbol exists in Figma; confirmed with Christian to treat
  it the same as Fia-default's static shelf, not reusing Gather's menu.
- **Fia-default's `AIModeToggle` value is `'fia'`** even though one Figma
  reference frame's toggle pill visually shows "Gather" active — confirmed
  with Christian this is a design-file inconsistency, not intentional.

## Deferred

- Real audio capture/waveform data — the Audio card's waveform is a
  static decorative pattern (confirmed against Figma, which doesn't
  animate it either); a host app wires real levels in later via its own
  recording pipeline, this component only owns the on/off UI state.
- A standalone reusable "Select Menu Group Label" primitive —
  `PromptbarShelfContent.tsx`'s `ShelfMenuCaption` reproduces the same
  local pattern `PromptbarShelf.stories.tsx` already established, since no
  free-standing primitive for it exists yet (every "group label" in this
  codebase today is a named export tied to its own Select/DropdownMenu/
  Combobox component).
