# Sheet

Edge panel that slides in from a screen edge over page content (Dialog-based).

## Purpose

Import from this primitive rather than `src/components/ui/sheet`. Public API
matches [shadcn Sheet](https://ui.shadcn.com/docs/components/base/sheet)
(Base UI Dialog): Trigger, Content (`side`, `showCloseButton`), Header / Title /
Description, Footer, Close.

Prefer [Drawer](../drawer/README.md) for bottom-sheet / swipe / snap gestures.
Sheet is the edge panel (Figma Left | Right primary; shadcn also top / bottom).

## Figma source

[Fabely Design System → Sheet](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry)
— component set **Sheet** with axes:

| Axis | Values | Code |
| --- | --- | --- |
| Orientation | Left / Right | `side` `left` / `right` (also `top` / `bottom` per shadcn) |
| Scrollable | False / True / Scrollable3 / Scrollable4 | Compose scroll in the body slot |

Surface: fill `--background`, radius **0** (flush to edge), DROP_SHADOW →
`--shadow-lg-*`. Header hosts the close control; Footer is an optional CTA row.

## Composition

```text
Sheet
├── SheetTrigger
└── SheetContent
    ├── SheetHeader
    │   ├── SheetTitle
    │   └── SheetDescription
    ├── (body)
    └── SheetFooter
```

## Token substitutions

| Role | Foundations | Notes |
| --- | --- | --- |
| Overlay scrim | `--overlay` | Shared with Dialog / Alert Dialog / Drawer |
| Surface fill | `--background` | Figma Sheet fill |
| Border | `--border` | Edge adjacent to page |
| Shadow lg | `--shadow-lg-black` / `-white` | Theme pair |
| Motion | `--duration-drawer` / `--ease-drawer` | Slide + fade |
| Header / footer pad | `--spacing-md` | |
| Title | Heading 4 | Serif light |
| Description | Paragraph Small Regular | `--muted-foreground` |
| Close glyph | `--icon-sm` via Icon Button `sm` | Lucide `X`; absolute `top` / `end` `--spacing-md` |

## API

| Export | Notes |
| --- | --- |
| `Sheet` / `SheetTrigger` / `SheetClose` | Base UI roots |
| `SheetContent` | `side` (default `right`); `showCloseButton` (default `true`); owns Overlay |
| `SheetHeader` / `SheetFooter` / `SheetTitle` / `SheetDescription` | Layout + type |

## Deferred

- Sticky footer fade as a first-class Footer prop (Dialog stories pattern)
- Dedicated Figma top / bottom orientations if design expands beyond Left / Right
- Scrollable* Figma variants as named presets once product needs them

## Related

- [Dialog](../dialog/README.md) — centered modal; same Dialog primitive family
- [Drawer](../drawer/README.md) — bottom sheet / swipe
- [Button](../button/README.md) — triggers, footer actions, close Icon Button
- shadcn: https://ui.shadcn.com/docs/components/base/sheet
- Base UI: https://base-ui.com/react/components/dialog
