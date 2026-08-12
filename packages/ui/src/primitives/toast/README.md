# Toast

A succinct message that is displayed temporarily.

## Purpose

Import from this primitive rather than `src/components/ui/toast`. Public API
matches [shadcn Toast](https://ui.shadcn.com/docs/components/base/toast)
(Base UI [Toast](https://base-ui.com/react/components/toast)).

## Figma source

No dedicated Toast component set in Fabely Design System. Chrome uses
Foundations floating-panel tokens (popover fill, border, `--rounded-2xl`,
lg shadow) — same family as Dialog / Dropdown surfaces.

## Composition

```text
Toaster                    (Provider + Portal + Viewport + ToastList)
└── toast.add / .promise / .close   (manager)

Each toast row:
Toast
└── ToastContent
    ├── ToastIcon          (from `type`)
    ├── ToastTitle
    ├── ToastDescription
    ├── ToastAction        (from `actionProps`)
    └── ToastClose
```

Mount `<Toaster />` once (layout / Storybook decorator). Trigger with
`toast.add({ title, description?, type?, actionProps? })` or
`toast.promise(...)`.

## Position

| `position` | Notes |
| --- | --- |
| `bottom-right` (default) | Matches prior Toaster / shadcn — existing mounts unchanged |
| `bottom-center` | Centered snackbar-style |
| `bottom-left` | Mirror of right; useful beside a right sidebar |

Corner positions keep vendor’s mobile-center → `sm+` corner behavior.
Top placements (`top-left` / `top-center` / `top-right`) are **deferred**
until a real consumer needs them — same pattern as Toggle Group’s Mini
(deferred until a partner lands).

## Token substitutions

| Role | Foundations |
| --- | --- |
| Fill / text | `--popover` / `--popover-foreground` |
| Radius | `--rounded-2xl` |
| Border | `--border` |
| Padding / icon gap | `--spacing-md` / `--spacing-sm` |
| Shadow | `--shadow-lg-black` / `--shadow-lg-white` |
| Title / description | Paragraph Small Medium / Regular |
| Icon size | `--icon-sm` |
| Focus | `--effect-focus-ring-secondary` |
| Stack motion | `--ease-emphasized` + `--duration-drawer` (height: `--duration-fast`) |
| Viewport inset | `--spacing-md` |

### Status icon colors

| `type` | Color |
| --- | --- |
| `success` | `--tw-raw-success-600` |
| `info` | `--muted-foreground` (TODO: semantic `--info`) |
| `warning` | `--tw-raw-alert-600` (TODO: semantic `--warning`) |
| `error` | `--destructive` |
| `loading` | `--muted-foreground` + spin |

## API

| Export | Notes |
| --- | --- |
| `Toaster` | Provider + portal viewport; `position` defaults to `bottom-right` |
| `ToasterPosition` | `'bottom-right' \| 'bottom-center' \| 'bottom-left'` |
| `toast` | Shared manager — `add` / `close` / `promise` |
| `createToastManager` / `useToastManager` | Custom managers |
| `Toast` … `ToastClose` | Low-level parts (custom list renderers) |

Action uses Fabely `Button` (`outline` / `small`); close uses `IconButton`
(`ghost` / `sm`).

## Deferred

- **Top placements** — deferred until a real consumer needs them (Toggle
  Group Mini pattern).
- Optional Figma Toast set if design adds one later
- Semantic `--info` / `--warning` accent tokens (shared with Alert)
- Re-verify surface once Popover is Foundations-matched if floating recipes
  converge

## Related

- Docket: [post-primitives-docket.md](../../../.migration/post-primitives-docket.md)
- Docs: [shadcn Toast](https://ui.shadcn.com/docs/components/base/toast)
- API: [Base UI Toast](https://base-ui.com/react/components/toast)
