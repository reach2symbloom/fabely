# ListItem

The Fabely ListItem primitive — shared leaf-row atom for menus and lists.

## Purpose

`ListItem` and its composition parts are the public API future Fabely
components should depend on for any list or menu row. Import from this
primitive rather than hand-rolling row chrome in Dropdown Menu, Command,
Select, Context Menu, Popover, or standalone lists.

Deliberately **not** named MenuItem — unscoped to any one surface.

## Figma source

Visual source of truth: Figma component set **Menu Item** in
[Fabely Design System](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=18-1010)
(`fileKey` `gV94L0qCmvwQkddNbEktry`, node `18:1010`, page Select & Combobox).

**Not this component:** shadcn / Figma **Item** on page Item / Callout — that
is a bordered card-like row with a different shape.

## Composition

```text
ListItem
├── ListItemMedia        (optional — left decoration)
├── ListItemContent
│   ├── ListItemTitle
│   └── ListItemDescription  (optional — Line 2)
└── ListItemTrailing     (optional — right decoration)
```

Optional slots are presence-based (omit the child). Hosts compose via Base UI
`render={<ListItem … />}` on menu/select items.

## Figma → API mapping

| Figma axis | Values | Primitive API |
| --- | --- | --- |
| Type | Default / Accent / Destructive | `variant`: `default` \| `accent` \| `destructive` |
| Size | Regular / Large | `size`: `default` \| `lg` |
| State | Default / Hover / Focus / Active / Selected / Disabled | CSS + `selected` / `disabled` / `data-pressed` |
| Show left decoration | boolean | `ListItemMedia` child |
| Show line 2 | boolean | `ListItemDescription` child |
| Show right decoration | boolean | `ListItemTrailing` child |

Size slot names follow `docs/DESIGN.md` “Size slots”; values are ListItem’s
own (default ≈ 32, lg ≈ 40).

## Decisions / deviations from Figma

1. **Quiet hover/pressed → Button `@5` / `@10`** (not Figma Default hover
   `@333`). Third component aligned this way after Icon Button and
   Breadcrumb — library interaction model over Figma’s lighter hover.
   Story mirrors: `data-hovered` / `data-pressed` / `data-focused`.
2. **Active and Selected paint identically** (`@10` on Default; accent /
   destructive soft recipes use their pressed layer). Distinguished by
   `data-selected` / `aria-selected`, not by fill. Selected/disabled
   utilities match only `=""` (Base UI) or `="true"` — not `="false"`
   (cmdk), because Tailwind’s `data-selected:` is presence-only.
3. Code name `ListItem` — Figma set is “Menu Item”.

## Token map (summary)

| Role | Foundations |
| --- | --- |
| Radius | `--rounded-md` |
| Default pad / gap | `--spacing-xs`, `--spacing-1-375` |
| Large pad / gap | `--spacing-sm`, `--spacing-1-875` |
| Title / description | Paragraph Small / Mini Regular |
| Title overflow | single-line truncate |
| Description overflow | wraps within the content column (`line-clamp-2`); never into Trailing |
| Media / trailing (default) | `--icon-md` (20) — Figma decoration Size=Default |
| Media / trailing (lg) | `--icon-xl` (32) — Figma decoration Size=Large |
| Media ↔ content (inner) | `--spacing-sm` (12) — Figma leading AL |
| Title ↔ description | `--spacing-2xs` (4) — one step above Figma’s 2px |
| Root ↔ trailing | `--spacing-xs` (default) / `--spacing-sm` (lg) |
| Quiet hover / pressed | `--theme-alpha-black-switch-5` / `-10` |
| Focus rings | `--effect-focus-ring-secondary` / `-error` |
| Accent fill | `color-mix(… secondary-ghost 12%)` |
| Destructive soft | `--destructive` under `--theme-alpha-white-switch-95` / `-85` |

## API

- **`variant`**, **`size`**, **`selected`**, **`disabled`**
- **`render`** — Base UI `useRender` for host menu items / links
- **`listItemVariants`** — CVA helper for class maps
- Named children as above — no `title` / `icon` props
