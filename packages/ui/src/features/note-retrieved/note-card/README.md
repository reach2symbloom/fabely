# Note Card

A single note/answer row in the Gather panel's note list — editable title,
annotation, and (short) body; truncated read-only body with an expand hook
once long; footer metadata; bookmark/pin actions; hover-revealed
expand/more actions.

## Purpose

Composes existing pieces rather than rebuilding any of them:
[Gather Bookmark Button](../gather-bookmark-button/README.md) for the
bookmark/scene action, the [Pin Button](../../../atoms/pin-icon-button/README.md)
atom for the pinned indicator, and the [Textarea](../../../primitives/textarea/README.md)
primitive for the editable title/annotation/short-body fields. Storybook
groups it under **Features/Gather** even though its folder is
`features/note-retrieved/`, matching the existing convention (see
[Fia Answer](../fia-answer/README.md)).

## Sources

| Source | Role |
| --- | --- |
| Figma [Note card](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16064-4975) (`16064:4975`) | Visual — Title × Hover × Pin |
| [Gather Bookmark Button](../gather-bookmark-button/README.md) | The bookmark/scene action, top-right |
| [Pin Button](../../../atoms/pin-icon-button/README.md) atom | The pinned indicator, top-right |
| [Textarea](../../../primitives/textarea/README.md) | Title (`textStyle="heading"`, single row), annotation and short body (`textStyle="body"`, wraps) |
| [Icon Button](../../../primitives/button/icon-button/README.md) | Expand / more, hover-revealed footer actions |
| [Badge](../../../primitives/badge/README.md) | The trailing "Notes" badge — its `default` size/roundness already produces Figma's exact `18px` height, no overrides needed |

## Composition

```text
NoteCard (group/card, hover:bg-alpha-333)
  └── border-b row (optional — showBottomBorder)
        ├── title row (justify-between) — title Textarea (flex-1) — PinIconButton (optional) + GatherBookmarkButton
        ├── annotation Textarea (own row, full card width)
        ├── body — editable Textarea (short) OR truncated read-only button (long, calls onOpenNote)
        └── footer: index. · date · wordcount · Badge — Expand (every mode) / more DropdownMenu (hover-revealed)
```

**Title and annotation are decoupled, on separate rows.** An earlier pass
stacked them in one shared column, itself sharing a row with the Pin/
Bookmark icon cluster — which squeezed annotation to `card width - icon
cluster width`, not the card's own full width. The title row now uses
`justify-between` (title `Textarea` as the flexible side, the icon cluster
`shrink-0` on the right); annotation is its own full-width row directly
below, sized only by the card's own padding like the body text beneath it.

Figma encodes this as **7 named `Title × Hover × Pin` variants**
(`Title=True,Hover=False,Pin=False`, `…Hover=True…`, `…Hover=Bookmark…`,
`Title=False,…`, `…Pin=True…` ×2). Rather than reproduce each as a literal
named state, they decode into content state plus real CSS `:hover`:

- **Title / annotation are editable, not static text.** Real `Textarea`
  fields, `variant="invisible"` — zero chrome ever, not even on hover or
  focus; the only affordance is the native text cursor (`caret-color:
  var(--primary)` on the `invisible` variant itself). (An earlier pass
  used `variant="quiet"`, which still drew a faint hover/focus box; that
  read as too much chrome for what's meant to feel like plain text you can
  click into, so the primitive gained a dedicated `invisible` variant and
  these fields moved onto it.) Empty renders the native `placeholder` ("Add
  title" / "Add annotation" in `--theme-alpha-black-switch-50`); a value
  renders in `--theme-alpha-black-switch-70`, and steps up the alpha scale
  on hover (`-80`) — a quiet, hover-only "this is editable" cue that
  doesn't touch the focus/typing state. (The next fine-grained step, `-75`,
  read as too subtle to actually notice — `-80` is the smallest jump that
  reads clearly.) Annotation does the same at its own base (`-50` → `-60`
  on hover — already a full 10-point step, so it didn't need the same
  correction). Title uses `textStyle="heading"`
  (single row, Figma's Hover=Bookmark note explicitly calls this an inline
  title); annotation uses `textStyle="body"` and is allowed to wrap 2–3
  lines. Typography is overridden via `className` to Foundations' own
  `xl-regular` (title) / `small-regular` (annotation) tokens rather than the
  primitive's baked-in heading-2/paragraph-small defaults. `Enter` commits
  (blurs) instead of inserting a newline in both — they're single fields,
  not paragraphs.
- **Body is editable when short, read-only + truncated when long — and the
  switch is gated on focus, not raw length.** Under `bodyTruncateThreshold`
  characters (default `359` — set to the exact character count of the
  sample Eldergrove paragraph used across these stories, so the default demo
  text is itself editable), body is the same kind of `variant="invisible"`
  `Textarea` as annotation — genuinely editable inline, `Enter` also commits
  rather than adding a line. Over the threshold, it renders as a
  `line-clamp-6` `<button>` instead: read-only, and **double**-clicking it
  calls `onOpenNote` — a hook for a full-width note view that doesn't exist
  yet. Not a single click: the body still reads and behaves like a normal
  paragraph (selectable, readable), and a single click fired far too
  easily while doing either. Keyboard access stays a single Enter/Space
  (there's no keyboard equivalent of "double-press" a reasonable user
  would expect) via an explicit `onKeyDown`, not the button's native click
  activation.
  **Typing past the threshold mid-edit doesn't eject the field into that
  read-only view** — that would drop focus/cursor position out from under
  the user's own keystroke. Instead, while focused, a body that's grown past
  the threshold caps its growth at `12` lines (double the read-only view's
  own `line-clamp-6`) and becomes a scroll container
  (`max-h-[...] overflow-y-auto`) rather than growing the row unbounded.
  Only once the field is blurred is the length reassessed: over the
  threshold, it flips to the read-only truncated view; still under it, it
  stays editable. Empty renders the native `placeholder` ("Add your note…"
  in `--theme-alpha-black-switch-50`, matching title/annotation). Body's own
  state is simpler than title/annotation's full controlled/uncontrolled
  pair: it's always internally uncontrolled (seeded from the `body` prop),
  reporting edits via `onBodyChange` rather than requiring a controlled
  round-trip — a bare placeholder string doesn't need the full
  value/defaultValue/onChange trio to justify the extra API surface.
- **`pinned`** — see "Pin visibility vs. interactivity" below; this isn't
  Figma-literal anymore.
- **Real hover** (`group/card` + `:hover`, not a JS-tracked "Hover" enum) —
  the whole row washes `--theme-alpha-black-switch-333`, and the footer's
  Expand/more `IconButton`s fade in from `opacity-0`. Figma's
  `Hover=Bookmark` named variant (bookmark control specifically hovered,
  overlaying the title) needs no separate handling here — `GatherBookmarkButton`
  already manages its own independent hover internally.

**The footer's first icon is "Expand," not "Reorder."** An earlier pass
mislabeled Figma's `chevrons-up-down` icon as a drag-reorder handle. Figma's
own component description for that exact icon (`1463:191`... `1463:194`) is
literally "expand, unfold, vertical" — it's an expand affordance. It's
wired directly to the same `onOpenNote` hook the truncated body button
itself calls, and renders in every mode — short or long body alike (an
earlier pass gated it to long-body-only, reasoning a short note was
"already fully visible, nothing to expand into"; that read too literally —
opening the full-width view is a generally useful action regardless of
body length, not just an escape hatch for truncation).

**`mode` is the surrounding page context, not derived from `title`.** An
earlier pass derived the bookmark control's `mode` from whether the note had
a title (`hasTitle ? 'gather' : 'roam'`), because Figma's own title-less
example frames happened to use Roam mode — reading a coincidence of one
mockup as a rule. In the real app, a `NoteCard` renders inside either the
Gather panel or Roam; that page context is what should drive the bookmark
variant. `mode` (`'gather'` default / `'roam'`) is a plain prop, forwarded
straight through to `GatherBookmarkButton`.

**Pin and Bookmark match glyph size and rest color.** `GatherBookmarkButton`
gained a `size` passthrough (to its internal `BookmarkIconButton`) specifically
so this composite could set `size="sm"` (`--icon-sm`, 16px) — matching
`PinIconButton`'s own fixed glyph size exactly, rather than Bookmark defaulting
to 20px next to Pin's 16px. Both already shared the same rest-state color
token (`--theme-alpha-black-switch-20`) without any change needed.

**Pin visibility vs. interactivity are separate axes, deliberately not
Figma-literal.** Figma's source only ever renders `PinIconButton` once the card
is already `pinned` — there's no way to pin an unpinned note through this
control at all. `showPin` (whether the control renders) and `pinInteractive`
(whether it can be toggled, vs. read-only) are independent props precisely
so a consumer isn't stuck with that gap: `showPin` defaults `true` regardless
of `pinned`, so pinning from an unpinned state is possible; a context that
shouldn't offer pinning sets `showPin={false}`; a context that should display
pin status without allowing changes sets `pinInteractive={false}` (renders
`disabled`).

**Every demo is uncontrolled by default.** `title` / `annotation` / `pinned`
/ `bookmarked` all follow the same controlled/uncontrolled pattern: pass the
bare prop with no `onChange` and it's a *locked* value (typing or clicking
does nothing, since nothing re-supplies a new prop) — use `defaultTitle` /
`defaultAnnotation` / `defaultPinned` / `defaultBookmarked` for a genuinely
interactive demo, or pass both the value and its `onChange` for a real
controlled instance (see the `Controlled` story).

**Title/annotation/body carry no shell radius at all**, via the primitive's
`invisible` variant itself (`rounded-none!`) — not a parent-level override.
An earlier pass, back when these fields used `variant="quiet"`, scoped a
`--rounded-md` correction onto the title/annotation column from outside the
primitive (`quiet`'s own shell radius needed correcting one notch down).
That override quietly became a bug once the fields moved to `invisible`: its
descendant-selector class carries higher CSS specificity than the
primitive's own `rounded-none!`, so even though both are `!important`, the
column-level rule kept winning and the radius stayed visible — most
obviously as a rounded clip on the title's own text-selection highlight.
Removed; `invisible` owns its own (lack of) radius now, unconditionally.

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `title` / `defaultTitle` / `onTitleChange` | — | Editable `Textarea`; empty shows "Add title"; `Enter` commits |
| `annotation` / `defaultAnnotation` / `onAnnotationChange` | — | Editable `Textarea`, wraps 2–3 lines; empty shows "Add annotation"; `Enter` commits |
| `body` / `onBodyChange` | — | Required initial value. Editable inline under `bodyTruncateThreshold`; truncated + read-only over it (reassessed on blur, not mid-keystroke) |
| `bodyTruncateThreshold` | `359` | Character count above which body truncates instead of staying editable |
| `onOpenNote` | — | Hook — fires on **double**-click of the truncated body (single Enter/Space if focused via keyboard) *and* a single click of the Expand icon; opens the full note (view not built yet) |
| `date` | — | Footer metadata; only renders if provided |
| `wordCount` | live count of `body` | Footer metadata; defaults to a real, live word count of the note text (not a caller-supplied guess). Only updates on blur, not per-keystroke — recounting live while typing read as distracting. Pass explicitly to override with something else (e.g. a linked manuscript excerpt's count) |
| `tag` | `'notes'` | Trailing `Badge` — closed set (`notes` \| `research` \| `manuscript`), each with its own label + color |
| `index` | — | Small ordinal in the footer ("1."), left of `date`, decorative (`aria-hidden`) |
| `mode` | `'gather'` | Surrounding page context — forwarded to `GatherBookmarkButton`'s own `mode` |
| `showPin` | `true` | Whether the Pin control renders at all — independent of `pinned` |
| `pinInteractive` | `true` | Whether the (shown) Pin control can be toggled, vs. read-only/`disabled` |
| `pinned` / `defaultPinned` / `onPinnedChange` | — | Controlled/uncontrolled pinned state |
| `bookmarked` / `defaultBookmarked` / `onBookmarkedChange` | — | Forwarded to `GatherBookmarkButton`'s `active` |
| `onCopyNote` / `onCopyHighlights` / `onDeleteNote` | — | Hover-revealed 3-dot `DropdownMenu` — Copy note to clipboard / Copy all highlights / Delete note (destructive) |
| `showBottomBorder` | `true` | Off for the last row in a list, or a caller that draws its own separators |
| `forceHover` | `false` | Storybook-only — locks the row's hover paint via `data-force-hover` without a real pointer |

## Tokens

| Concern | Foundations |
| --- | --- |
| Row hover wash | `--theme-alpha-black-switch-333` |
| Divider | `--theme-alpha-black-switch-5`, `--stroke-thin` |
| Title | `--text-paragraph-xl-regular-*`, `--theme-alpha-black-switch-70`, hover `-80` |
| Body | `--text-paragraph-regular-regular-*`, `--theme-alpha-black-switch-70`, hover `-80` |
| Annotation | `--text-paragraph-small-regular-*`, `--theme-alpha-black-switch-50`, hover `-60` |
| Metadata / placeholder text | `--text-paragraph-mini-regular-*` (metadata) / `--theme-alpha-black-switch-50` |
| Index ordinal | `--theme-alpha-black-switch-20` |
| Title top padding | `--spacing-3xs` (2px) |
| Title → annotation gap | `--spacing-3xs` (2px flex-gap; `Textarea`'s own 1px shell border nets it to ~4px rendered) |
| Annotation → body gap | `--spacing-xs` (8px) |
| Body → footer metadata gap | `--spacing-sm` (12px) |
| Body edit-mode growth cap | `12` lines (`--text-paragraph-regular-regular-line-height` × 12) once over `bodyTruncateThreshold` while focused, then scrolls via the textarea's own `overflow-y`, styled to match Foundations' scrollbar (thin thumb, `--theme-alpha-white-no-switch-25`, `--spacing-3xs` end padding) — not the `ScrollArea` primitive, which can't meaningfully wrap a native `<textarea>` (its `field-sizing-content` sizing silently caps at whatever fits a height-constrained ancestor rather than overflowing it, so `ScrollArea`'s own viewport never sees anything to scroll) |
| Pin / Bookmark glyph size | `--icon-sm` (16px), matched between both |
| Pin hover background | `--theme-alpha-black-switch-333` — matches the row's own hover wash |
| Motion | `--duration-fast` / `--ease-emphasized` |

**The 3-dot button opens a real `DropdownMenu`** (not a bare callback) —
Copy note to clipboard, Copy all highlights, Delete note (`variant="destructive"`,
via [Dropdown Menu](../../../primitives/dropdown-menu/README.md)'s own
`ListItem`-backed rows). `onCopyNote` / `onCopyHighlights` / `onDeleteNote`
are the three item handlers; the trigger composes straight onto the
existing `IconButton` via Base UI's `render` prop
(`DropdownMenuTrigger render={<IconButton .../>}`), so there's no separate
wrapper element or duplicated hit target.

## Deferred

- **Full note view** — `onOpenNote` is a bare callback/hook; the full-width
  note view it's meant to open doesn't exist yet.
- **Copy/delete implementations** — `onCopyNote` / `onCopyHighlights` /
  `onDeleteNote` are bare callbacks; the actual clipboard-write and
  delete-confirmation logic aren't built yet.
