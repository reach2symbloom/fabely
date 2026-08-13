# Dialog

A modal window overlaid on the page that renders content underneath inert.

## Purpose

Import from this primitive rather than `src/components/ui/dialog`. Public API
matches [shadcn Dialog](https://ui.shadcn.com/docs/components/base/dialog)
(Base UI Dialog): Trigger, Content (`showCloseButton`), Header / Title /
Description, Footer, Close.

## Figma source

[Fabely Design System → Dialog](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry?node-id=842-51941)
— component sets **Dialog** (`Type`: Desktop / Desktop Scrollable / Mobile /
Mobile Full Screen Scrollable), **Dialog Header**, **Dialog Footer**.

## Composition

```text
Dialog
├── DialogTrigger
└── DialogContent
    ├── DialogHeader
    │   ├── DialogTitle
    │   └── DialogDescription
    ├── (body)
    └── DialogFooter
```

## Token substitutions

| Source | Foundations | Notes |
| --- | --- | --- |
| Surface radius 16 | `--radius` | Not Alert Dialog `--rounded-xl` (20) |
| Surface fill / border | `--popover` / `--border` | |
| Shadow lg | `--shadow-lg-black` / `-white` | Theme pair |
| Overlay scrim | `--overlay` | Shared with Alert Dialog |
| Content pad / gap | `--spacing-md` | Header / footer Figma pad |
| Title | Heading 4 | Serif light |
| Description | Paragraph Small Regular | `--muted-foreground` |
| Close glyph | `--icon-sm` via Icon Button `sm` | Lucide `X`; absolute `top` / `end` `--spacing-md` |
| Footer actions gap | `--spacing-xs` | Compose Fabely Buttons |

## API

| Export | Notes |
| --- | --- |
| `Dialog` / `DialogTrigger` / `DialogPortal` / `DialogClose` | Base UI roots |
| `DialogContent` | `showCloseButton` (default `true`); owns Overlay |
| `DialogOverlay` | Foundations scrim |
| `DialogHeader` / `DialogFooter` / `DialogTitle` / `DialogDescription` | Layout + type |

## Deferred

- Mobile / full-screen Type variants from Figma once product needs them
- Sticky footer fade as a first-class Footer prop (stories use gradient classes)
- Re-verify Field / Input hosts once those are Foundations-matched
- CommandDialog host — re-check once Command consumers pick up this chrome

## Related

- [Alert Dialog](../alert-dialog/README.md) — confirmations; larger surface radius
- [Button](../button/README.md) — triggers, footer actions, close Icon Button
- Base UI: https://base-ui.com/react/components/dialog
- shadcn: https://ui.shadcn.com/docs/components/base/dialog
