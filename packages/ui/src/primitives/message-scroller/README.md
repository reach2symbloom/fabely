# Message Scroller

Chat transcript scroll container — anchors turns, follows streamed replies,
preserves place when history loads, and jumps to messages.

## Naming

**Export / folder:** `MessageScroller` — matches
[shadcn Message Scroller](https://ui.shadcn.com/docs/components/base/message-scroller)
for import parity.

**Product language:** Chat UI / chat transcript scroller. Prefer that in app
copy and IA; keep the primitive name for the design-system API.

## Purpose

Import from this primitive rather than `src/components/ui/message-scroller`.
Behavior is `@shadcn/react/message-scroller`; chrome uses Foundations. Compose
rows with [Message](../message/README.md), [Bubble](../bubble/README.md),
[Marker](../marker/README.md), etc. — the scroller does not own AI state or
transport.

Place inside a **height-constrained** parent (`flex-1` / fixed height).

## Figma source

No dedicated Message Scroller / Chat UI frame in Fabely Design System. Layout
gaps and the jump control map to Foundations; message chrome comes from Message
/ Bubble.

## Composition

```text
MessageScrollerProvider
└── MessageScroller
    ├── MessageScrollerViewport
    │   └── MessageScrollerContent
    │       └── MessageScrollerItem   (message / marker / load-earlier row)
    └── MessageScrollerButton         (jump to start | end)
```

## Token substitutions

| Role | Foundations |
| --- | --- |
| Row stack gap | `--spacing-2xl` (32) |
| Content inset | `--spacing-md` (16) pad x/y |
| Jump button inset | `--spacing-md` (16) |
| Jump button | IconButton `secondary` / `sm` / `round` |
| Jump motion | `--duration-fast` / `--duration-drawer` · `--ease-emphasized` / `--ease-emphasized-in` |
| Viewport fade | `scroll-fade-y` (top + bottom) |

## API

| Export | Notes |
| --- | --- |
| `MessageScrollerProvider` | Headless root — `autoScroll`, `defaultScrollPosition`, `scrollPreviousItemPeek`, … |
| `MessageScroller` | Styled frame (`size-full`) |
| `MessageScrollerViewport` | Scroll element + fade |
| `MessageScrollerContent` | Transcript column (`role="log"` from package) |
| `MessageScrollerItem` | Row boundary; `messageId`, `scrollAnchor` |
| `MessageScrollerButton` | Jump control; `direction` `start` \| `end` |
| `useMessageScroller` | `scrollToMessage` / `scrollToEnd` / `scrollToStart` |
| `useMessageScrollerVisibility` | `currentAnchorId`, `visibleMessageIds` |
| `useMessageScrollerScrollable` | `{ start, end }` edges |

Mark turn starts with `scrollAnchor` (usually the user message). See shadcn
docs for opening position, prepend history, and virtualization notes.

## Core concepts (Storybook)

Lean demos only — enough to exercise the primitive:

| Story | Concept |
| --- | --- |
| Demo | Transcript + jump button + fade / inset |
| Last anchor open | `defaultScrollPosition="last-anchor"` + peek |
| Jump commands | `useMessageScroller` |

Full shadcn Chat UI demo (Card + Empty + Input Group + AI SDK scripted
stream) is **deferred** — product apps own that composition. See Deferred.

## Deferred

- [ ] **Chat UI shell Storybook demo** — recreate shadcn `MessageScrollerDemo`
      (Card + Empty + Input Group + send/reset + streaming transport) without
      pulling AI SDK into `@fabely/ui`, or document the app-owned recipe.
      Docket: [post-primitives-docket.md](../../../.migration/post-primitives-docket.md)

## Related

- [Message](../message/README.md) · [Marker](../marker/README.md) ·
  [Bubble](../bubble/README.md)
- Docket: [post-primitives-docket.md](../../../.migration/post-primitives-docket.md)
- Docs: [shadcn Message Scroller](https://ui.shadcn.com/docs/components/base/message-scroller)
