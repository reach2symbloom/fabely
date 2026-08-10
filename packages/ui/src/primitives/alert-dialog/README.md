# Alert Dialog

The Fabely Alert Dialog primitive — phase 1 exposes the full shadcn Alert Dialog API surface (composition tree including `AlertDialogMedia`, Content `size`). Dialog chrome remains the vendor's (`src/components/ui/alert-dialog.tsx`); Action and Cancel compose our Button primitive.

## Purpose

Import Alert Dialog parts from this primitive rather than the vendor path. Future Fabely / Figma restyling lands here without call sites changing imports.

## Phase 1 status

- **Full shadcn API** — Root, Trigger, Content (`size`), Header, Media, Title, Description, Footer, Cancel, Action (plus Overlay / Portal). Documented patterns in Storybook: Basic, Small, Media, Small with Media, Destructive, RTL.
- **Our Button** — `AlertDialogTrigger` is composed at call sites via `render={<Button variant="…" />}`; `AlertDialogAction` and `AlertDialogCancel` render our Button (not `src/components/ui/button`).
- **Trigger variants** — `AlertDialogTrigger` constrains nothing about Button look; pass any Fabely Button variant. `secondary` appears in demos only as a quiet default, not an API rule.
- **Surface radius (Foundations)** — Content uses `--rounded-xl` → `--tw-raw-radius-20` (**20px**), overriding the vendor's `rounded-4xl`.
- **Overlay scrim (Foundations)** — semantic `--overlay` → `--theme-alpha-black-no-switch-30` (`--tw-raw-black` @ 30%), replacing vendor `bg-black/30`. Non-switching; shared with Dialog / Sheet / Drawer when those land.
- **Otherwise vendor styling** — no further Fabely / Figma remapping of dialog chrome yet.
- **Cancel default (Fabely convention)** — shadcn uses `variant="outline"`; Fabely Button has no `outline`, so `AlertDialogCancel` defaults to Button `tertiary`.

## API (shadcn docs)

### Composition

```text
AlertDialog
├── AlertDialogTrigger
└── AlertDialogContent
    ├── AlertDialogHeader
    │   ├── AlertDialogMedia
    │   ├── AlertDialogTitle
    │   └── AlertDialogDescription
    └── AlertDialogFooter
        ├── AlertDialogCancel
        └── AlertDialogAction
```

### `size` (on `AlertDialogContent`)

| Prop   | Type                | Default     |
| ------ | ------------------- | ----------- |
| `size` | `"default" \| "sm"` | `"default"` |

Other parts follow [Base UI Alert Dialog](https://base-ui.com/react/components/alert-dialog#api-reference).

## Usage

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@fabely/ui/primitives/alert-dialog';
import { Button } from '@fabely/ui/primitives/button';

<AlertDialog>
  <AlertDialogTrigger render={<Button variant="secondary" />}>
    Show Dialog
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel variant="tertiary">Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```
