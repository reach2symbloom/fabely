# Label

Accessible caption from Figma [Label (OC)](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-49170)
(`842:49170`, set `103:9453`) with the [shadcn Label](https://ui.shadcn.com/docs/components/base/label) API.

Vendor `src/components/ui/label.tsx` stays untouched.

This is the OC leaf Field already assumed: type and color live here;
`FieldLabel` inherits them and keeps Field host / choice-card chrome.
`FieldTitle` shares `labelTypeClassName`.

No extra Label set on **Custom components** (template page only) — the OC page
is the source.

For form fields, use [Field](../field/README.md) (`FieldLabel`,
`FieldDescription`, `FieldError`). Standalone `Label` is for a control that
is not in a Field row (checkbox/radio next to a caption, Slider caption,
Button Group Text `render={<Label />}`).

## Figma source

| Figma | Prop |
| --- | --- |
| Layout Inline \| Block | `layout` |
| State Default \| Error | `state` |
| Show required | `required` (decorative `*`) |

Paragraph Small Medium. Default `--foreground`; error `--destructive`.
Asterisk gap `--spacing-3xs` (Figma 2px).

## Anatomy

```
Label            layout · state · required · htmlFor
└── children     caption
└── *            when required (aria-hidden)
```

## Tokens

| Role | Token |
| --- | --- |
| Type | Paragraph Small Medium |
| Default | `--foreground` |
| Error | `--destructive` (`state="error"` or Field `data-invalid`) |
| Required mark gap | `--spacing-3xs` |

## API

| Prop | Default | Notes |
| --- | --- | --- |
| `layout` | `inline` | `block` fills the parent width |
| `state` | `default` | `error` tints destructive |
| `required` | `false` | Trailing `*`; not `aria-required` |
| `htmlFor` | — | Native label association |
| `labelTypeClassName` | — | Shared type + Field invalid/disabled tone |

## Related

- [Field](../field/README.md) · [Checkbox](../checkbox/README.md) ·
  [Input](../input/README.md)
- Docs: [shadcn Label](https://ui.shadcn.com/docs/components/base/label)
- Base UI: [Label](https://base-ui.com/react/components/label#api-reference)
