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
- [ ] **Cross-primitive demos** — walk shadcn docs for each Fabely primitive;
      flesh out examples that need siblings we did not have at land time
      (toolbars, split buttons, field + addon strips, pagination clusters, etc.).
- [ ] **Thin-pass story cleanup** — replace placeholder / vendor-looking partners
      in Overview playgrounds with Fabely-matched primitives once available.

### Design system hygiene

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
