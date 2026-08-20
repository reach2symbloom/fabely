# Note Card

A single note/answer row in the Gather panel's note list — editable title,
annotation, and (short) body; truncated read-only body with an expand hook
once long; footer metadata; bookmark/pin actions; hover-revealed
expand/more actions.

## Purpose

Composes existing pieces rather than rebuilding any of them:
[Gather Bookmark Button](../gather-bookmark-button/README.md) for the
bookmark/scene action, the [Pin Button](../../../atoms/pin-button/README.md)
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
| [Pin Button](../../../atoms/pin-button/README.md) atom | The pinned indicator, top-right |
| [Textarea](../../../primitives/textarea/README.md) | Title (`textStyle="heading"`, single row), annotation and short body (`textStyle="body"`, wraps) |
| [Icon Button](../../../primitives/button/icon-button/README.md) | Expand / more, hover-revealed footer actions |
| [Badge](../../../primitives/badge/README.md) | The trailing "Notes" badge — its `default` size/roundness already produces Figma's exact `18px` height, no overrides needed |

## Composition

```text
NoteCard (group/card, hover:bg-alpha-333)
  └── border-b row (optional — showBottomBorder)
        ├── header: title Textarea + annotation Textarea — PinButton (optional) + GatherBookmarkButton
        ├── body — editable Textarea (short) OR truncated read-only button (long, calls onOpenNote)
        └── footer: index. · date · wordcount · Badge — Expand (long body only) / more IconButtons (hover-revealed)
```

Figma encodes this as **7 named `Title × Hover × Pin` variants**
(`Title=True,Hover=False,Pin=False`, `…Hover=True…`, `…Hover=Bookmark…`,
`Title=False,…`, `…Pin=True…` ×2). Rather than reproduce each as a literal
named state, they decode into content state plus real CSS `:hover`:

- **Title / annotation are editable, not static text.** Real `Textarea`
  fields, `variant="ghost"` — no visible chrome until hovered/focused, so
  they read as plain text at rest and reveal a subtle box once you're about
  to edit. Empty renders the native `placeholder` ("Add title" / "Add
  annotation" in `--theme-alpha-black-switch-50`); a value renders in
  `--theme-alpha-black-switch-70`. Title uses `textStyle="heading"` (single
  row, Figma's Hover=Bookmark note explicitly calls this an inline title);
  annotation uses `textStyle="body"` and is allowed to wrap 2–3 lines.
  Typography is overridden via `className` to Foundations' own
  `xl-regular` (title) / `small-regular` (annotation) tokens rather than the
  primitive's baked-in heading-2/paragraph-small defaults. `Enter` commits
  (blurs) instead of inserting a newline in both — they're single fields,
  not paragraphs.
- **Body is editable when short, read-only + truncated when long.** Under
  `bodyTruncateThreshold` characters (default `240`), body is the same kind
  of `Textarea` as annotation — genuinely editable inline, `Enter` also
  commits rather than adding a line. Over the threshold, it renders as a
  `line-clamp-6` `<button>` instead: read-only, and clicking it calls
  `onOpenNote` — a hook for a full-width note view that doesn't exist yet.
  Body's own state is simpler than title/annotation's full
  controlled/uncontrolled pair: it's always internally uncontrolled (seeded
  from the `body` prop), reporting edits via `onBodyChange` rather than
  requiring a controlled round-trip — there's no "empty body" placeholder
  state to justify the extra API surface.
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
literally "expand, unfold, vertical" — it's an expand affordance, and it
only makes sense once there's something to expand *into*. It's now wired
directly to the same `onOpenNote` hook the truncated body button itself
calls, and only renders when body is actually truncated — a short body is
already fully visible and editable inline, so there's nothing to expand.

**`mode` is the surrounding page context, not derived from `title`.** An
earlier pass derived the bookmark control's `mode` from whether the note had
a title (`hasTitle ? 'gather' : 'roam'`), because Figma's own title-less
example frames happened to use Roam mode — reading a coincidence of one
mockup as a rule. In the real app, a `NoteCard` renders inside either the
Gather panel or Roam; that page context is what should drive the bookmark
variant. `mode` (`'gather'` default / `'roam'`) is a plain prop, forwarded
straight through to `GatherBookmarkButton`.

**Pin and Bookmark match glyph size and rest color.** `GatherBookmarkButton`
gained a `size` passthrough (to its internal `BookmarkButton`) specifically
so this composite could set `size="sm"` (`--icon-sm`, 16px) — matching
`PinButton`'s own fixed glyph size exactly, rather than Bookmark defaulting
to 20px next to Pin's 16px. Both already shared the same rest-state color
token (`--theme-alpha-black-switch-20`) without any change needed.

**Pin visibility vs. interactivity are separate axes, deliberately not
Figma-literal.** Figma's source only ever renders `PinButton` once the card
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

**Title/annotation's shell radius is one notch down from the primitive's
default**, `--rounded-md` (8px) instead of `Textarea`'s own `--rounded-lg`
(12px). The primitive doesn't expose a `className` on its shell wrapper (only
on the inner `<textarea>`), so this is scoped from the parent via
`[&_[data-slot=textarea-control]]:rounded-[length:var(--rounded-md)]!` on the
title/annotation column.

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `title` / `defaultTitle` / `onTitleChange` | — | Editable `Textarea`; empty shows "Add title"; `Enter` commits |
| `annotation` / `defaultAnnotation` / `onAnnotationChange` | — | Editable `Textarea`, wraps 2–3 lines; empty shows "Add annotation"; `Enter` commits |
| `body` / `onBodyChange` | — | Required initial value. Editable inline under `bodyTruncateThreshold`; truncated + read-only over it |
| `bodyTruncateThreshold` | `240` | Character count above which body truncates instead of staying editable |
| `onOpenNote` | — | Hook — fires from the truncated body button *and* the Expand icon; opens the full note (view not built yet) |
| `date` / `wordCount` | — | Footer metadata; each only renders if provided |
| `badgeLabel` | `'Notes'` | Trailing `Badge` text |
| `index` | — | Small ordinal in the footer ("1."), left of `date`, decorative (`aria-hidden`) |
| `mode` | `'gather'` | Surrounding page context — forwarded to `GatherBookmarkButton`'s own `mode` |
| `showPin` | `true` | Whether the Pin control renders at all — independent of `pinned` |
| `pinInteractive` | `true` | Whether the (shown) Pin control can be toggled, vs. read-only/`disabled` |
| `pinned` / `defaultPinned` / `onPinnedChange` | — | Controlled/uncontrolled pinned state |
| `bookmarked` / `defaultBookmarked` / `onBookmarkedChange` | — | Forwarded to `GatherBookmarkButton`'s `active` |
| `onMoreOptions` | — | Hover-revealed 3-dot menu handler |
| `showBottomBorder` | `true` | Off for the last row in a list, or a caller that draws its own separators |
| `forceHover` | `false` | Storybook-only — locks the row's hover paint via `data-force-hover` without a real pointer |

## Tokens

| Concern | Foundations |
| --- | --- |
| Row hover wash | `--theme-alpha-black-switch-333` |
| Divider | `--theme-alpha-black-switch-5`, `--stroke-thin` |
| Title | `--text-paragraph-xl-regular-*`, `--theme-alpha-black-switch-70` |
| Body | `--text-paragraph-regular-regular-*`, `--theme-alpha-black-switch-70` |
| Annotation | `--text-paragraph-small-regular-*`, `--theme-alpha-black-switch-50` |
| Metadata / placeholder text | `--text-paragraph-mini-regular-*` (metadata) / `--theme-alpha-black-switch-50` |
| Index ordinal | `--theme-alpha-black-switch-20` |
| Title → annotation gap | `--spacing-3xs` (2px flex-gap; `Textarea`'s own 1px shell border nets it to ~4px rendered) |
| Annotation → body gap | `--spacing-xs` (8px) |
| Body → footer metadata gap | `--spacing-sm` (12px) |
| Title/annotation shell radius | `--rounded-md` (8px) — one notch down from the primitive's own `--rounded-lg` |
| Pin / Bookmark glyph size | `--icon-sm` (16px), matched between both |
| Motion | `--duration-fast` / `--ease-emphasized` |

## Deferred

- **More menu content** — `onMoreOptions` is a bare callback; the actual
  "more options" menu isn't built yet.
- **Full note view** — `onOpenNote` is a bare callback/hook; the full-width
  note view it's meant to open doesn't exist yet.
