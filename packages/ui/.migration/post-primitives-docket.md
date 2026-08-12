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
      Foundations-matched; Table / Data Table selection chrome is matched —
      spot-check when convenient; optionally compose Figma Checkbox Group
      (Inline / Block) instead of a second primitive. See
      [Checkbox README → Deferred](../src/primitives/checkbox/README.md#deferred).
- [ ] **Data Table × Input / Select** — Table row/cell chrome is matched;
      optional drop of the temporary bordered shell; re-verify filter field and
      page-size Select once those partners need a pass. See
      [Data Table README → Deferred](../src/primitives/data-table/README.md#deferred).
- [ ] **Collapsible × Field / Input / Tabs** — re-verify Settings Panel once
      Field and Input are Foundations-matched; restore Explorer / Outline Tabs
      on File Tree (Tabs is Foundations-matched). See
      [Collapsible README → Deferred](../src/primitives/collapsible/README.md#deferred).
- [ ] **Tabs AI toggle / Size5 / Solar / Thread / Fill=False Large** — Figma
      Tabs (segmented) odd sizes (AI toggle, Size5), Solar icon set, Thread
      tabs / counter molecule, and Fill=False Large elevated inactive chrome —
      not on the shadcn Tabs surface. See
      [Tabs README → Deferred](../src/primitives/tabs/README.md#deferred).
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
- [ ] **Input × Input Group / Field** — Input Group shell is Foundations-matched;
      re-check Field host demos and any remaining decoration vs addon guidance.
      See [Input README → Deferred](../src/primitives/input/README.md#deferred).
- [ ] **Input Group × Kbd** — re-verify demos once Kbd is Foundations-matched;
      Spinner / Textarea hosts are matched. Optional Custom Input story. See
      [Input Group README → Deferred](../src/primitives/input-group/README.md#deferred).
- [ ] **Input OTP × non-Overview stories** — Pattern, Separator, Disabled,
      Controlled, Invalid, Four Digits, Alphanumeric, Form, RTL, and Sizes
      should likely live in the Overview playground, or at least show as
      Variants on Overview (not only separate pages); QA against Figma +
      shadcn when consolidating. See
      [Input OTP README → Deferred](../src/primitives/input-otp/README.md#deferred).
- [ ] **Item × Avatar / image media** — re-check left-slot alignment against
      Figma Item once Avatar polish settles. See
      [Item README → Deferred](../src/primitives/item/README.md#deferred).
- [ ] **Kbd × Tooltip** — Foundations Tooltip is Neutrals (New)/150 (cream /
      charcoal). Confirm Default switch alphas (not Glow) read correctly in
      light and dark inside Tooltip Content. See
      [Kbd README → Deferred](../src/primitives/kbd/README.md#deferred) and
      [Tooltip README → Deferred](../src/primitives/tooltip/README.md#deferred).
- [ ] **Kbd × light-mode final check** — Default / Glow / Tooltip / Input Group /
      Button in light theme (Glow charcoal only when needed; Default never on a
      dark panel; contrast). See
      [Kbd README → Deferred](../src/primitives/kbd/README.md#deferred).
- [ ] **Hover Card × Popover / Tooltip** — no dedicated Figma Hover Card; surface
      uses background + floating panel tokens. Tooltip landed on Neutrals/150
      (compact); re-verify / share panel recipe once **Popover** is
      Foundations-matched. See
      [Hover Card README → Deferred](../src/primitives/hover-card/README.md#deferred).
- [x] **Toggle Group × Toggle** — shared `toggleVariants` (Ghost/Outline ·
      sm/default/lg · roundness) from Toggle; Toggle Group keeps connected
      Position CSS (`spacing={0}` shell / dividers). See
      [Toggle](../src/primitives/toggle/README.md) /
      [Toggle Group](../src/primitives/toggle-group/README.md).
- [ ] **Toggle Mini (24)** — Figma Size=Mini; not on shadcn size ladder.
      Deferred on both Toggle and Toggle Group. See
      [Toggle README → Deferred](../src/primitives/toggle/README.md#deferred).
- [ ] **Toggle Icon Button** (`164:20378`) — separate primitive (Text Button /
      Icon Button relationship). See
      [Toggle README → Deferred](../src/primitives/toggle/README.md#deferred).
- [ ] **Marker × Spinner** — Spinner is Foundations-matched; spot-check Status
      demos when convenient. Message thread composition is landed; shimmer
      utility is in `packages/ui/src/styles/shimmer.css`. See
      [Marker README → Deferred](../src/primitives/marker/README.md#deferred).
- [ ] **Message Scroller × Chat UI shell** — Storybook (or app recipe) for full
      shadcn streaming demo: Empty + Input Group + send/reset + transport,
      without AI SDK in `@fabely/ui`. See
      [Message Scroller README → Deferred](../src/primitives/message-scroller/README.md#deferred).
- [ ] **Field × control partners** — Field depends on many siblings; after
      each Foundations-matches, re-verify Field demos and Figma Type variants
      (Label, Select, Slider, Radio Group, Checkbox hosts, Switch,
      Separator, Inline message OC). Input / Textarea Text Value chrome is
      already matched.
      Checklist: [Field README → Deferred](../src/primitives/field/README.md#deferred).
- [ ] **Cross-primitive demos** — walk shadcn docs for each Fabely primitive;
      flesh out examples that need siblings we did not have at land time
      (toolbars, split buttons, field + addon strips, pagination clusters, etc.).
- [ ] **Thin-pass story cleanup** — replace placeholder / vendor-looking partners
      in Overview playgrounds with Fabely-matched primitives once available.

### Design system hygiene

- [ ] **IMPORTANT — Figma custom components vs shadcn** — global gate for the
      primitives pass. For **every** primitive (and when closing the pass), open
      its Figma page **and** the file’s **Custom components** section. Check for
      Fabely-authored sets / organisms that should be used *instead of* (or in
      addition to) the shadcn demo tree. Do not assume the shadcn docs are the
      full inventory. Land those customs or add an explicit Deferred + checkbox
      here — never silently skip them. Example: Spinner’s page-load **Spinner
      large** / **Loader Atoms** live beside the leaf Spinner and need their own
      pass. Re-walk remaining thin-pass primitives with this gate before marking
      the pass done.
- [ ] **Slots refactor audit (Figma ↔ code)** — after the primitives pass is
      complete, walk layout / shell primitives (Item, Card, Empty, Field,
      Alert, Dialog/Drawer headers, section-style compositions, etc.) against
      Figma native slots and `.cursor/rules/figma-slots.mdc`. Goal: open
      content stays slot contracts (`children` / named parts), enumerable
      axes stay variants/props — no variant explosion or prop matrices for
      “what goes in the hole.” Check Storybook shows the slot contract, not
      only one frozen tree; flag Figma components that still use detach /
      swap menus where a slot should exist. Framing:
      [The Case for Slots](https://southleft.substack.com/p/the-case-for-slots).
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
- [ ] **Global press ripple / push effect** — shared Foundations interaction
      (click-origin ink) for buttons, toggles, and similar controls. Toggle
      prototype was pulled (clip/overshoot made duration unreadable). Design
      once, reuse everywhere — not per-primitive. See
      [Toggle README → Deferred](../src/primitives/toggle/README.md#deferred).
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
