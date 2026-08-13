# Questionnaire

Multi-step questionnaire with single-choice, multiple-choice, freeform, and
skippable questions.

## Purpose

Import from this primitive rather than `src/components/ui/questionnaire`.
Behavior is `@shadcn/react/questionnaire`; chrome uses Foundations. The host
page, card, dialog, or drawer owns close / cancel, persistence, transport, and
branching.

Requires `@shadcn/react` ≥ 0.3.0 (Questionnaire export).

## Figma source

No dedicated Questionnaire set in Fabely Design System. Choice cards map to
[Item](../item/README.md) outline chrome; freeform answers use [Input](../input/README.md)
field fills; navigation uses the [Button](../button/README.md) family.

## Composition

```text
Questionnaire
├── QuestionnaireProgress
├── QuestionnaireItem
│   ├── QuestionnaireTitle
│   ├── QuestionnaireDescription
│   ├── QuestionnaireChoices
│   │   ├── QuestionnaireChoice
│   │   │   └── QuestionnaireChoiceDescription
│   │   └── QuestionnaireInput
│   └── QuestionnaireError
└── QuestionnaireActions
    ├── QuestionnairePrevious
    ├── QuestionnaireSkip
    ├── QuestionnaireNext
    └── QuestionnaireSubmit
```

Pass `items` on the root for server-rendered progress, actions, and shortcuts.
Map the same collection into `QuestionnaireItem` parts.

## Token substitutions

| Role | Foundations |
| --- | --- |
| Root / item / choices gaps | `--spacing-xl` / `--spacing-md` / `--spacing-sm` |
| Progress type | Paragraph Mini Medium + `--muted-foreground` |
| Title / description | Paragraph Regular Medium / Small Regular |
| Choice card | `--rounded-lg` (12), `--border`, hover `--theme-alpha-black-switch-5` |
| Choice checked | `--primary` border + quiet fill |
| Choice indicator | Checkbox / Radio geometry (`--spacing-md`, `--rounded-sm` / full) |
| Freeform input | Input default fill (`--theme-alpha-black-switch-333`) |
| Error | `--destructive` |
| Nav buttons | Button `outline` (Previous / Skip) · `primary` (Next / Submit) |
| Motion | `--duration-fast` |

## API

| Export | Notes |
| --- | --- |
| `Questionnaire` | Root form; `items`, `item` / `defaultItem`, `shortcuts`, `onItemChange` |
| `QuestionnaireProgress` | Named progress; supports `render` |
| `QuestionnaireItem` | `fieldset`; `name`, `required`, `multiple`, `invalid` |
| `QuestionnaireTitle` / `Description` / `Error` | Legend + support copy |
| `QuestionnaireChoices` / `Choice` / `Input` | Answers |
| `QuestionnaireChoiceDescription` | Styled helper under a choice label |
| `QuestionnaireActions` | Layout grid for nav |
| `QuestionnairePrevious` / `Skip` / `Next` / `Submit` | Button-styled nav |

See [shadcn Questionnaire](https://ui.shadcn.com/docs/components/base/questionnaire)
and the [@shadcn/react API](https://ui.shadcn.com/docs/react/questionnaire) for
controlled mode, resume, conditional items, and accessibility.

## Deferred

- Custom Progress bar story can compose Foundations [Progress](../progress/README.md)
  via the Progress `render` state when product needs a track instead of text.
- Animated item transitions stay host-owned (motion library).

## Related

- [Button](../button/README.md) · [Input](../input/README.md) · [Item](../item/README.md)
- [Card](../card/README.md) · [Dialog](../dialog/README.md) · [Progress](../progress/README.md)
- Docs: [shadcn Questionnaire](https://ui.shadcn.com/docs/components/base/questionnaire)
