# Field

Compose labels, controls, and help text into accessible form fields and groups.

## Purpose

Import from this primitive rather than `src/components/ui/field`. Public API
matches [shadcn Field](https://ui.shadcn.com/docs/components/base/field):
Field / Label / Description / Error / Content / Title, plus FieldGroup,
FieldSet / Legend, FieldSeparator.

## Figma source

[Vertical Field](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=120-13754)
(`120:13754`) and [Horizontal Field](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=120-13775)
(`120:13775`): Type × State (Default / Error); optional Inline message.

**Text Value** controls use Foundations [Input](../input/README.md)
(`variant="default"`). Select / Textarea / Checkbox / Radio / Slider stay on
those primitives (thin-pass until matched).

## Composition

```text
Field
├── FieldLabel
├── Input / Textarea / Switch / Select / …
├── FieldDescription
└── FieldError
```

```text
FieldSet
├── FieldLegend
├── FieldDescription
└── FieldGroup
    └── Field …
```

## Token substitutions

| Source | Foundations | Notes |
| --- | --- | --- |
| Label ↔ control ↔ message gap | `--spacing-1-5` | 6px (Figma 2xs + 2) |
| Checkbox / radio ↔ label gap | `--spacing-sm` | 12px — choice rows only |
| Horizontal label column | `120px` | Figma Horizontal Field |
| FieldGroup / FieldSet stack | `--spacing-xl` | Between fields / sections |
| Label / Title | Paragraph Small Medium | `--foreground`; invalid → destructive |
| Description | Paragraph Small Regular | Inline message + Lucide `Info` (`--icon-sm`) |
| Error | Paragraph Small Regular | Inline message + `CircleAlert`; `text-destructive` |
| Legend | Paragraph Regular Medium | `label` variant → Small Medium |
| Choice-card host (Card) | `--rounded-lg`; hairline + `--theme-alpha-black-switch-10`; pad `--spacing-sm`; checked → primary gradient border + `--effect-focus-ring-primary` | `FieldLabel` wrapping Field (`choice="card"` or omit) |
| Choice-card host (Icon) | `--background` fill; `--border`; pad `--spacing-2-5`; h 40; checked → primary gradient border + ring | `choice="icon"` |
| Choice-card host (Block) | `--tw-raw-black` fill; alpha-10; 110px wide; checked → primary gradient border + ring | `choice="block"` |

## API

| Export | Notes |
| --- | --- |
| `Field` | `orientation`: `vertical` \| `horizontal` \| `responsive`; `data-invalid` |
| `FieldLabel` / `FieldTitle` | Label type; choice-card when wrapping Field (`choice`: `card` \| `icon` \| `block`) |
| `FieldDescription` / `FieldError` | Helper / `role="alert"` |
| `FieldContent` | Groups label + description beside controls |
| `FieldGroup` / `FieldSet` / `FieldLegend` / `FieldSeparator` | Grouping |

## Deferred

Field composes many partners. **Revisit this primitive after each lands**
(Foundations-matched), not only at the end of the thin-pass:

- [ ] **Label** — FieldLabel host type / disabled / invalid
- [ ] **Textarea** — Field Textarea demos + Figma Type=Textarea
- [ ] **Select** — Field Select demos + Figma Type=Select
- [ ] **Slider** — Field Slider demos + Figma Type=Slider
- [ ] **Radio Group** — Field Radio demos + Figma Type=Radio — control chrome
      landed; re-verify Field host demos in Storybook. See
      [Radio Group README](../src/primitives/radio-group/README.md) ·
      [Field README → Deferred](../src/primitives/field/README.md#deferred).
- [ ] **Checkbox** — Field Checkbox / choice-card demos (Checkbox already
  matched; re-check Field hosts once Label is matched)
- [ ] **Switch** — Field Switch demos
- [ ] **Separator** — FieldSeparator chrome
- [ ] **Inline message (OC)** — swap Lucide `Info` / `CircleAlert` on
  Description / Error for the shared OC when it lands

**Input** (`variant="default"`) is the Text Value control chrome — already
matched; only re-check if Input size / decoration API changes.

Docket: [Field × control partners](../../../.migration/post-primitives-docket.md).
