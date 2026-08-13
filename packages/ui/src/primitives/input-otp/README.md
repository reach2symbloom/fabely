# Input OTP

Accessible one-time password / PIN slots with copy-paste.

## Purpose

Import from this primitive rather than `src/components/ui/input-otp`. Public API
matches [shadcn Input OTP](https://ui.shadcn.com/docs/components/base/input-otp)
(built on [input-otp](https://input-otp.rodz.dev)).

## Figma source

[Input OTP](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=140-11468)
(`140:11468`) — page [Input OTP](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=842-49177).

Axes:

| Figma | Code |
| --- | --- |
| Size Default · Large · Small · Mini | `size` on `InputOTP` |
| Position Left · Middle · Right | Connected slots via `first:` / `last:` in a group |
| State Empty · Placeholder · Value · Focus · Error · Error Focus · Disabled | library + `aria-invalid` / `disabled` / `placeholder` |

## Composition

```text
InputOTP
├── InputOTPGroup
│   ├── InputOTPSlot
│   ├── InputOTPSlot
│   └── InputOTPSlot
├── InputOTPSeparator
└── InputOTPGroup
    ├── InputOTPSlot
    ├── InputOTPSlot
    └── InputOTPSlot
```

## Props

| Export | Notes |
| --- | --- |
| `InputOTP` | `maxLength`, `value` / `onChange`, `pattern`, `disabled`, `placeholder`, `size` |
| `InputOTPGroup` | Connected slot row |
| `InputOTPSlot` | `index`; inherits group `size` |
| `InputOTPSeparator` | Minus glyph between groups (`--icon-sm`) |
| `REGEXP_ONLY_DIGITS` / `…_CHARS` / `…_DIGITS_AND_CHARS` | Re-exported from `input-otp` |

## Token substitutions

| Role | Foundations |
| --- | --- |
| Slot fill | `--background` |
| Slot border | `--input` / `--stroke-thin` |
| Focus ring | `--effect-focus-ring-secondary` |
| Error border | `--destructive` |
| Error focus ring | `--effect-focus-ring-error` |
| Value type | Paragraph Small Regular (Mini → Paragraph Mini); `--foreground` |
| Placeholder type | `--muted-foreground` @ 50% |
| Size ladder | Mini 24 / Small 32 / Default 36 / Large 40 (`--spacing-xl` / `2xl` / `9` / `3xl`) |
| End radii | Mini `--rounded-sm` · Small `--rounded-md` · Default/Large `--rounded-lg` |
| Separator icon | `--icon-sm` |
| Disabled | container `opacity-50` |

## Deferred

- **QA / consolidate non-Overview stories** — Pattern, Separator, Disabled,
  Controlled, Invalid, Four Digits, Alphanumeric, Form, RTL, and Sizes should
  likely live in the Overview playground, or at least appear as Variants on
  Overview (not only as separate story pages). Walk them against Figma +
  [shadcn Input OTP](https://ui.shadcn.com/docs/components/base/input-otp)
  when consolidating
- Form demo partners (Button / Field / Card) already Foundations-matched —
  re-check spacing if Field / Card stack gap changes
- Optional: discrete gap between single-slot groups if product wants separated
  tiles instead of only connected groups
- **Placeholder stacked `opacity-50`** — slot placeholder is `--muted-foreground`
  plus `opacity-50` (~30% effective now that muted is switch-60). Drop the extra
  opacity or keep a quieter placeholder on purpose. Docket: Design system hygiene.

## Related

- Docs: [shadcn Input OTP](https://ui.shadcn.com/docs/components/base/input-otp)
- Library: [input-otp](https://input-otp.rodz.dev)
- [Input](../input/README.md) — related field chrome (different fill model)
