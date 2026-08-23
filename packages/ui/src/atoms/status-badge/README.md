# Status Badge

Composable icon/text/status pill built on the Badge primitive.

## Placement

**YES** — a general-purpose composable atom, not a Promptbar-specific
feature. Figma's own source names it "Promptbar status badges," but the
anatomy (leading icon, primary text, middle icon/divider, secondary text,
trailing status/dismiss) is generic; nothing about the implementation is
tied to the Promptbar.

## Overlap

| Candidate | Verdict |
| --- | --- |
| [Badge](../../primitives/badge/README.md) primitive | **Compose, don't fork.** Every color/typography/spacing/radius value comes straight from Badge's own CVA variants — this never duplicates a class. `tone` is a narrowed, renamed alias over Badge's own `variant` (`neutral→default`, `secondary`, `fia`) — Badge ships 8 variants (`destructive`/`outline`/`ghost`/`alert`/`success` included) that don't correspond to anything in Figma's status-badge set; exposing all 8 here would reintroduce the "large cross-product of invalid combinations" this atom exists to avoid. |
| [Status](../status/README.md) atom | The `'glyph'` variant is reused directly through the `trailing` slot — not reimplemented inline. The `'label'` variant is a different job (a standalone connection-state row with a required label, not a badge composition) and isn't used here. |
| `LibraryListItem`'s inline `Badge` + `GitBranchIcon` composition | The closest prior art for "icon + text + secondary text inside a Badge" (plain children composition, no dedicated sub-component). `StatusBadge` generalizes that same pattern into a named, slotted atom rather than repeating the composition ad hoc at every call site — Badge's own README lists a dismissible variant as a documented, deliberately-deferred gap this atom fills. |

## Sources

| Source | Role |
| --- | --- |
| Figma [Promptbar status badges](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16199-2312) (`16199:2312`) | Visual — 17 Mode × Type × Subtype examples, decoded via `get_design_context`'s literal JSX (icon refs, colors, exact text) rather than screenshots (the frame was too large to render as one image) |
| [Badge](../../primitives/badge/README.md) primitive | Root behavior/styling |
| [Status](../status/README.md) atom (`variant="glyph"`) | Trailing "connected" glyph |
| [Separator](../../primitives/separator/README.md) primitive | Vertical divider option for `middleIcon` (Context/Alt example) |
| `lucide-react` | `BookOpen`, `Globe`, `GitBranch`, `Link2Off`, `X`, `Feather`, `Highlighter`, `ScrollText`, `GitCompare`, `Waypoints`, `Share2` |

## Composition

```text
StatusBadge → Badge (variant = tone→variant map, roundness="default")
  ├── leadingIcon
  ├── children (primary text)
  ├── middleIcon
  ├── secondaryText (max-w-[100px] truncated)
  └── onDismiss ? IconButton (real dismiss control) : trailing (Status glyph | icon | nothing)
```

**Not Figma's own Mode × Type × Subtype axes.** Those 17 combinations are
mostly permutations of a handful of anatomical patterns (icon+text,
icon+text+middle-icon+secondary-text, icon+text+dismiss, plain text) —
translating the axes directly would mean a component that only knows how
to render `mode="Fia" type="Workflow" subtype="Related themes"`, not one
that knows how to render "icon + text + dismiss." Every one of Figma's 17
examples is reproduced in Storybook as a *configuration* of this one
component (see `status-badge.stories.tsx`'s `FigmaReference` story) — the
matrix lives in Storybook, not in the component's prop surface.

**Height, not roundness, carries `size`.** Badge's own `size`/`roundness`
compound variants only pair a 24px height with `roundness="round"` (a
pill) — but Figma's 24px status badges keep the exact same 5px
`rounded-sm` corners as its 18px ones. `size="default"` (24px) overrides
just the height (`--spacing-xl`, an existing token) on top of
`roundness="default"`, rather than reaching for Badge's `roundness="round"`
compound, which would incorrectly round the corners too.

**`trailing` is Figma's "trailing/status" region as one slot, not three.**
The brief's suggested API listed `trailingIcon`, `status`, and `onDismiss`
as three separate props. Collapsed to two here: `trailing` (a generic
`ReactNode` — `Status` in its glyph variant, another icon, or nothing) and
`onDismiss` (kept as its own callback specifically because it renders a
*real* accessible control, not something a caller would want to hand-roll
via a bare slot each time). Figma never shows a status glyph and a dismiss
control on the same badge, so `onDismiss` takes priority when both are
given.

**`middleIcon` accepts anything, matching how Figma joins primary and
secondary text differently across examples** — a bare `"·"` string
(Paragraph manuscript / Highlight / Note), the `Separator` primitive
(Context/Alt's vertical rule), or a real icon (`GitBranch` before "The
Eldergrove"). No dedicated "divider" sub-component was introduced for
this — it's a slot, not a rendering decision the atom makes.

**Dismiss is a real `IconButton`, not a decorative SVG.** `variant="ghost"
size="mini"`, sized down via `className` to Figma's own 16×16 footprint
(the same override-`size`-via-`className` pattern already used by
Combobox's own chip-remove, which is functionally the closest existing
precedent to a dismissible badge in this codebase) — `aria-label` defaults
to `"Remove"`, overridable via `dismissLabel` once several similar badges
could coexist in the same list (matching this repo's established
generic-vs-specific dismiss-label split; see Combobox vs. Attachment/
Bookmark's own object-specific labels).

**"threads" (Workflow: Topic map's icon) has no Lucide equivalent.**
Substituted with `Share2` (closest available network/connection glyph) in
the Storybook `FigmaReference` story — noted inline there, not hidden.

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `size` | `'compact'` | `'compact'` (~18px) or `'default'` (~24px) — an explicit per-instance choice, not derived from content; Figma uses both heights for equally simple content |
| `tone` | `'neutral'` | `'neutral'` \| `'secondary'` \| `'fia'` — maps onto a subset of Badge's own `variant`; `'fia'` is reserved for workflow chips (Topic map / Related themes / Develop scene), not other badge kinds |
| `leadingIcon` | — | Any `ReactNode`, typically a 12px Lucide icon |
| `children` | — | Required — primary text |
| `middleIcon` | — | Any `ReactNode` — bare text, `Separator`, or an icon |
| `secondaryText` | — | Truncates at `max-w-[100px]` (Figma's own literal value — unbound to any variable in Figma's own source either) |
| `trailing` | — | Generic trailing slot (e.g. `<Status variant="glyph" />`); ignored when `onDismiss` is set |
| `onDismiss` | — | Renders a real dismiss `IconButton` in the trailing slot instead of `trailing` |
| `dismissLabel` | `'Remove'` | Accessible name for the dismiss control |

All other `Badge` props (except `variant`/`size`/`roundness`, which this
atom owns) pass through.

## Tokens

| Concern | Foundations |
| --- | --- |
| Neutral tone | `--theme-alpha-black-switch-333` bg, `--neutrals-new-500` text (Badge's `default` variant) |
| Secondary tone | `secondary-ghost` bg, `--tw-raw-secondary-200` text (Badge's `secondary` variant) |
| Fia tone | `--theme-alpha-black-switch-333` bg (same neutral fill as `default`), `--tw-raw-fia-200` text (Badge's `fia` variant) — workflow chips only |
| Radius | `--rounded-sm` (5px, Badge's `roundness="default"`) |
| Compact height | 18px (Badge's own existing `size="default" roundness="default"` compound, unmodified) |
| Default height | `--spacing-xl` (24px), overriding just the height |
| Typography | `--text-paragraph-mini-medium-*` (Badge's own `size="default"`) |
| Dismiss control size | `--spacing-md` (16px), glyph `--icon-xs` (12px) |

## Future Promptbar Integration (Deferred)

The Promptbar itself has not been built yet — that is a future feature.
This atom, `Status`'s `variant="glyph"`, and `./status-badge-content.ts`'s
typed shapes/formatters exist so that feature has a ready contract to
consume once it exists. **Nothing here wires to real app state**: no
hooks, selectors, or context providers live in this atom or its content
module — wiring these types/functions to actual manuscript/editor state is
the future Promptbar consumer's responsibility, not this atom's.

`status-badge-content.ts` exports (also re-exported from this folder's
`index.ts`):

| Export | Shape | Feeds |
| --- | --- | --- |
| `GenreBadgeInput` | `{ genre: 'fiction' \| 'non-fiction'; isSeries: boolean }` | Genre badges — set at book creation |
| `ChapterSceneReference` | `{ chapter: number; scene: number }` | Context badges — user's current chapter/scene |
| `ParagraphSelectionReference` | `{ paragraphNumbers: number[]; isPartial: boolean }` | Fia paragraph-selection labels |
| `SceneConnectionInput` | `{ sceneTitle: string }` | Scene Desk / All Notes secondary text |
| `NotePreviewInput` | `{ noteTitle: string }` | Note secondary text |
| `HighlightPreviewInput` | `{ highlightedText: string }` | Highlight secondary text |
| `ParagraphPreviewInput` | `{ excerpt: string }` | Paragraph manuscript secondary text |
| `truncateText(text, max = 30)` | fn | Caps any of the above at Figma's 30-character rule before it reaches `secondaryText` |
| `formatChapterScene(ref, style)` | fn | `"Ch. 1, Sc. 1"` (comma) or `"Ch. 1 · Sc. 1"` (dot) — both literal styles appear in Figma |
| `formatParagraphReference(ref)` | fn | `"¶ 1, 2"`, or `"¶ 1, 2*"` when `isPartial` — asterisk marks a partial-paragraph selection, never a full one |
| `genreBadgeTone(genre)` / `genreBadgeLabel(genre)` | fn | `tone`/label derivation for Genre badges |

`status-badge.stories.tsx`'s `FigmaReferenceVariants` exercises every one
of these against mocked inputs (fake chapter/scene numbers, a fake scene
title, fake highlight/note text) — read it as the reference usage example
for whoever builds the Promptbar integration.

## Deferred

- No polymorphic `render`/`asChild` passthrough beyond what Badge itself
  offers — a link-shaped status badge isn't in the Figma set.
- No Promptbar hooks/selectors/context providers — see "Future Promptbar
  Integration" above.
