# Post-primitives docket

Follow-ups to run **after** the shadcn → Fabely primitives pass is complete
(every wrapper under `src/primitives/` Figma-matched or consciously skipped —
not thin-pass stubs).

**When:** Agent rule `.cursor/rules/post-primitives-docket.mdc` reminds us to
revisit this file once that milestone hits. Do not treat items here as blockers
while finishing individual primitives.

## Why this exists

Several primitives land with **composition seams** aimed at partners that are
still thin-pass or missing (e.g. Button Group ↔ Input / Input Group / Select /
Popover). Stories and join CSS are sketched; they need a second pass once those
partners have real sizes, tokens, and chrome.

## Docket

### Composition & Storybook

- [ ] **Button Group × partners** — re-verify join, height parity, and stories
      for Input, Input Group, Select, Popover (and any other shadcn Button Group
      demos we skipped). Promote or trim selectors that only exist for thin-pass
      chrome. See [Button Group README → Deferred](../src/primitives/button-group/README.md#deferred).
- [ ] **Date Picker × Popover / Field / Input** — Date Picker guide landed;
      re-verify Popover chrome and Field / Input / Input Group hosts once those
      are Foundations-matched; optional Persian (`react-day-picker/persian`).
      See [Date Picker README → Deferred](../src/primitives/date-picker/README.md#deferred).
- [ ] **Card × form partners** — re-verify login / Spacing / RTL demos once
      Input, Label, and Field are Foundations-matched. See
      [Card README → Deferred](../src/primitives/card/README.md#deferred).
- [ ] **Card × Image / Aspect Ratio** — swap the Image story cover wrapper for
      Foundations Aspect Ratio (and any media primitive) when those land. See
      [Card README → Deferred](../src/primitives/card/README.md#deferred).
- [ ] **Carousel × Autoplay / Image** — add `embla-carousel-autoplay` (+ Plugin
      story) and the Figma “Carousel with Image” composition once Aspect Ratio /
      media partners land. See
      [Carousel README → Deferred](../src/primitives/carousel/README.md#deferred).
- [ ] **Checkbox × Field / Label / Table** — re-verify Basic, Description,
      Disabled, Group, Invalid, and RTL demos once Field and Label are
      Foundations-matched; re-skin Data Table selection rows once Table is
      Foundations-matched (selection demo lives under Data Table); optionally
      compose Figma Checkbox Group (Inline / Block) instead of a second
      primitive. See
      [Checkbox README → Deferred](../src/primitives/checkbox/README.md#deferred).
- [ ] **Data Table × Table / Input / Select** — re-skin grid chrome once Table
      lands; re-verify filter field and page-size Select once those primitives
      are Foundations-matched. See
      [Data Table README → Deferred](../src/primitives/data-table/README.md#deferred).
- [ ] **Collapsible × Field / Input / Tabs** — re-verify Settings Panel once
      Field and Input are Foundations-matched; restore Explorer / Outline Tabs
      on File Tree once Tabs lands. See
      [Collapsible README → Deferred](../src/primitives/collapsible/README.md#deferred).
- [ ] **Combobox × Input Group / sizes** — re-verify ComboboxInput host once
      Input Group is Foundations-matched; add Input Group addon demo; expose
      Figma Size (Large / Small / Mini) and Style Ghost if product needs them.
      See [Combobox README → Deferred](../src/primitives/combobox/README.md#deferred).
- [ ] **Combobox × deletable Chip** — swap inline `ComboboxChip` remove chrome
      for the shared deletable Chip primitive once it exists. See
      [Combobox README → Deferred](../src/primitives/combobox/README.md#deferred).
- [ ] **Command × Dialog / Input Group** — re-verify CommandDialog against
      Foundations Dialog chrome; re-verify search field host once Input Group
      lands; optional Figma Command Item Style=Square icon. See
      [Command README → Deferred](../src/primitives/command/README.md#deferred).
- [ ] **Dialog × Field / Input / mobile** — re-verify profile / share demos once
      Field and Input land; add Figma Mobile / full-screen Type variants if
      product needs them. See
      [Dialog README → Deferred](../src/primitives/dialog/README.md#deferred).
- [ ] **Drawer × Field / Input / Radio** — re-verify Responsive (Dialog↔Drawer)
      and Delivery Method demos once Field, Input, Label, and Radio Group are
      Foundations-matched. See
      [Drawer README → Deferred](../src/primitives/drawer/README.md#deferred).
- [ ] **Empty × Input Group** — re-verify Input Group empty-state demo once
      Input Group is Foundations-matched. See
      [Empty README → Deferred](../src/primitives/empty/README.md#deferred).
- [ ] **Cross-primitive demos** — walk shadcn docs for each Fabely primitive;
      flesh out examples that need siblings we did not have at land time
      (toolbars, split buttons, field + addon strips, pagination clusters, etc.).
- [ ] **Thin-pass story cleanup** — replace placeholder / vendor-looking partners
      in Overview playgrounds with Fabely-matched primitives once available.

### Design system hygiene

- [ ] **Scroll fade on overflow lists** — apply `scroll-fade`
      (from `src/styles/scroll-fade.css`) to remaining scroll containers:
      Dropdown Menu / Select popups, Scroll Area viewport, Sidebar, etc.
      CommandList + Combobox list + Context Menu Content already use
      `scroll-fade`.
- [ ] **Token / size ladders** — confirm shared ladders (Text ↔ Icon height
      parity, Input Group vs Button heights, SelectTrigger in groups) against
      Figma; document one source of truth in `docs/DESIGN.md` if still scattered.
- [ ] **Invented / deferred motion** — second use of any duration/easing →
      Foundations (per design-tokens rule); sweep primitives for leftovers.
- [ ] **Vendor vs owned** — list any remaining thin re-exports that should stay
      vendor forever vs get a Fabely ownership pass.

### Product / process

- [ ] **Primitives README** — update “Figma-matched” vs thin-pass lists; mark
      this docket done or roll remaining items into a new backlog.
- [ ] **Code Connect / Figma** — optional sync pass for the completed set.
- [ ] **App adoption** — note which apps should switch imports from
      `components/ui/*` to `primitives/*` first.

## How to add items

While building a primitive, if you skip a composition because a partner is
missing or thin-pass, add a checkbox here (and a one-liner on that primitive’s
README under **Deferred**). Keep items actionable and named by primitive.
