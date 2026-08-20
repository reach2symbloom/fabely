# Note Card

A single note/answer row in the Gather panel's note list — title +
annotation, body, footer metadata, bookmark/pin actions, and hover-revealed
reorder/more actions.

## Purpose

Composes two existing Gather pieces rather than rebuilding either:
[Gather Bookmark Button](../gather-bookmark-button/README.md) for the
bookmark/scene action, and the [Pin Button](../../../atoms/pin-button/README.md)
atom for the pinned indicator. Storybook groups it under **Features/Gather**
even though its folder is `features/note-retrieved/`, matching the existing
convention (see [Fia Answer](../fia-answer/README.md)).

## Sources

| Source | Role |
| --- | --- |
| Figma [Note card](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16064-4975) (`16064:4975`) | Visual — Title × Hover × Pin |
| [Gather Bookmark Button](../gather-bookmark-button/README.md) | The bookmark/scene action, top-right |
| [Pin Button](../../../atoms/pin-button/README.md) atom | The pinned indicator, top-right |
| [Icon Button](../../../primitives/button/icon-button/README.md) | Reorder / more, hover-revealed footer actions |
| [Badge](../../../primitives/badge/README.md) | The trailing "Notes" badge — its `default` size/roundness already produces Figma's exact `18px` height, no overrides needed |

## Composition

```text
NoteCard (group/card, hover:bg-alpha-333)
  └── border-b row
        ├── header: title/placeholder + annotation/placeholder — PinButton (if pinned) + GatherBookmarkButton
        ├── body paragraph
        └── footer: date · wordcount · Badge — reorder/more IconButtons (hover-revealed)
  └── absolute index ordinal (bottom-left)
```

Figma encodes this as **7 named `Title × Hover × Pin` variants**
(`Title=True,Hover=False,Pin=False`, `…Hover=True…`, `…Hover=Bookmark…`,
`Title=False,…`, `…Pin=True…` ×2). Rather than reproduce each as a literal
named state, they decode into two content booleans plus real CSS `:hover`:

- **`title`** (derived from whether the `title` prop is truthy) — empty
  shows "Add title" / "Add annotation" placeholders in
  `--theme-alpha-black-switch-50`; present shows the real copy in
  `--theme-alpha-black-switch-70`. Content gap also shifts: `--spacing-2xs`
  (4px) with a title, `--spacing-sm` (12px) without — matches Figma's
  looser empty-state spacing.
- **`pinned`** — per Figma, `PinButton` only renders once already pinned;
  there's no separate always-visible pin trigger in the source. When
  pinned, it sits directly left of the bookmark control, both persistently
  visible (not hover-gated).
- **Real hover** (`group/card` + `:hover`, not a JS-tracked "Hover" enum) —
  the whole row washes `--theme-alpha-black-switch-333`, and the footer's
  reorder/more `IconButton`s fade in from `opacity-0`. Figma's
  `Hover=Bookmark` named variant (bookmark control specifically hovered,
  overlaying the title) needs no separate handling here — `GatherBookmarkButton`
  already manages its own independent hover internally.

**Bookmark `mode` tracks `title`, not a separate prop.** Figma's header
`BookmarkButton` instances default to `mode="Gather"` (hover-reveals "Add to
scene"), while the no-title body variants explicitly pass
`mode="Roam (all + no scene)"` (icon-only chip, no label). Rather than expose
a redundant mode prop on `NoteCard`, this composite derives it:
`hasTitle ? 'gather' : 'roam'` — a titleless note doesn't have a "scene" name
yet, so the hover label wouldn't make sense.

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `title` / `annotation` | — | Empty shows "Add title" / "Add annotation" placeholders |
| `body` | — | Required; always shown regardless of other state |
| `date` / `wordCount` | — | Footer metadata; each only renders if provided |
| `badgeLabel` | `'Notes'` | Trailing `Badge` text |
| `index` | — | Small ordinal, bottom-left, decorative (`aria-hidden`) |
| `pinned` / `defaultPinned` / `onPinnedChange` | — | Controlled/uncontrolled; `PinButton` only renders when `true` |
| `bookmarked` / `defaultBookmarked` / `onBookmarkedChange` | — | Forwarded to `GatherBookmarkButton`'s `active` |
| `onReorder` / `onMoreOptions` | — | Hover-revealed footer `IconButton` handlers |
| `forceHover` | `false` | Storybook-only — locks the row's hover paint via `data-force-hover` without a real pointer |

## Tokens

| Concern | Foundations |
| --- | --- |
| Row hover wash | `--theme-alpha-black-switch-333` |
| Divider | `--theme-alpha-black-switch-5`, `--stroke-thin` |
| Title / body text | `--text-paragraph-xl-medium-*` / `--text-paragraph-regular-regular-*`, `--theme-alpha-black-switch-70` |
| Annotation / metadata / placeholder text | `--text-paragraph-mini-regular-*`, `--theme-alpha-black-switch-50` |
| Index ordinal | `--theme-alpha-black-switch-20` |
| Motion | `--duration-fast` / `--ease-emphasized` |

## Deferred

- **Reorder / more menu content** — `onReorder` / `onMoreOptions` are bare
  callbacks; the actual reorder interaction and the "more options" menu
  aren't built yet.
