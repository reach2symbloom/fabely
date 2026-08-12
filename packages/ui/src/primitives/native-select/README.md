# Native Select

Styled native HTML `<select>` with Foundations field chrome.

## Purpose

Import from this primitive rather than `src/components/ui/native-select`. Public
API matches [shadcn Native Select](https://ui.shadcn.com/docs/components/base/native-select).

**When to use**

- Native browser / OS picker (especially mobile)
- Simple forms, preference / settings-style fields
- Progressive enhancement or when a custom popup is overkill

**When not to**

- Designed menus, animations, or complex item chrome → use
  [Select](../select/README.md) (still thin-pass until Foundations-matched)

## Figma source

No dedicated Native Select set. Chrome mirrors [Input](../input/README.md)
Foundations tokens (fill, radius, focus, invalid).

## Composition

```text
NativeSelect                 size="sm" | "default"
├── NativeSelectOption
└── NativeSelectOptGroup     (optional)
    └── NativeSelectOption
```

## Token substitutions

| Role | Foundations |
| --- | --- |
| Fill | `--theme-alpha-black-switch-333` |
| Type | Paragraph Small Regular (sm → Mini Regular) |
| Radius | `--rounded-lg` (sm → `--rounded-md`) |
| Height | default `--spacing-3xl` / sm `--spacing-2xl` |
| Focus | `--effect-focus-ring-secondary` |
| Invalid | `--destructive` border + `--effect-focus-ring-error` |
| Chevron | Lucide · `--icon-sm` · `--muted-foreground` |

## API

| Export | Notes |
| --- | --- |
| `NativeSelect` | Native `<select>`; `size` `sm` \| `default` |
| `NativeSelectOption` | `<option>` (Canvas colors for OS menus) |
| `NativeSelectOptGroup` | `<optgroup>` |

## Deferred

- Re-verify Field Type=Select demos once custom [Select](../select/README.md)
  is Foundations-matched (Field may host either)

## Related

- [Input](../input/README.md) · [Field](../field/README.md) ·
  [Select](../select/README.md)
- Docs: [shadcn Native Select](https://ui.shadcn.com/docs/components/base/native-select)
