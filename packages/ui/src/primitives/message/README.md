# Message

Conversation row layout — avatar, alignment, header, and footer around a
message surface.

## Purpose

Import from this primitive rather than `src/components/ui/message`. Public API
matches [shadcn Message](https://ui.shadcn.com/docs/components/base/message).
`Message` owns the row; render the visible surface with
[Bubble](../bubble/README.md). Thread scroll →
[Message Scroller](../message-scroller/README.md) (still thin-pass).

## Figma source

No dedicated Message component set in Fabely Design System. Layout gaps and
meta type use Foundations. Bubble chrome is Figma **Chat bubbles**
(`16340:807`); Avatar sizes come from the Avatar primitive.

## Composition

```text
Message                    align="start" | "end"
├── MessageAvatar          (optional; empty slot keeps group alignment)
└── MessageContent
    ├── MessageHeader      (sender name — always start-aligned)
    ├── Bubble             (from="other" | "user")
    └── MessageFooter      (status / actions — follows align)

MessageGroup
├── Message …
└── Message …
```

## Token substitutions

| Role | Foundations |
| --- | --- |
| Row / group gap | `--spacing-xs` (8) |
| Content stack gap | `--spacing-2-5` (10) |
| Avatar slot min width | `--spacing-2xl` (32) — pair with Avatar `size="small"` |
| Avatar lift when footer | `--spacing-2xl` translate |
| Header / footer pad-x | `--spacing-3-5` (14) |
| Header / footer type | Paragraph Mini Medium · `--muted-foreground` |
| Row body type | Paragraph Small Regular |

## API

| Export | Notes |
| --- | --- |
| `Message` | `align`: `start` \| `end` (default `start`) |
| `MessageGroup` | Stack consecutive same-sender rows |
| `MessageAvatar` | Bottom-anchored; lifts above footer when present |
| `MessageContent` | Header + surface + footer column |
| `MessageHeader` | Meta above the bubble |
| `MessageFooter` | Meta / actions below; `justify-end` when `align="end"` |

Map `align="end"` ↔ Bubble `from="user"`; `align="start"` ↔ `from="other"`.

## Deferred

- [ ] **Message Scroller** — conversation scroll container still thin-pass
- [ ] **Spinner** — status Marker demos may still use thin-pass Spinner

## Related

- [Attachment](../attachment/README.md) · [Bubble](../bubble/README.md) ·
  [Avatar](../avatar/README.md) · [Marker](../marker/README.md)
- Received files: compose `AttachmentRightIcons` → `AttachmentRightIcon`
  (download) — not a separate download component
- Docket: [post-primitives-docket.md](../../../.migration/post-primitives-docket.md)
- Docs: [shadcn Message](https://ui.shadcn.com/docs/components/base/message)
