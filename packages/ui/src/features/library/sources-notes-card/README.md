# Sources & Notes Card

Library entry point for bringing in notes, an existing draft, or files
from a linked integration.

## Placement

NO — Library product chrome. Stays in
`src/features/library/sources-notes-card/`.

Would not make sense reused outside Library with unrelated content.

## Overlap

Searched primitives / atoms / molecules / organisms / features:

| Candidate | Verdict |
| --- | --- |
| **Image Button** | Nest — the two entry-point cards ("Bring in your notes" / "Import your manuscript") are exactly Image Button's `import-notes` / `import-manuscript` types, reused as-is. |
| **API Connection** | Nest — each row in the Connections section, the canonical `../api-connections/` implementation (composes `Status`/`BrandLink` atoms, all 12 Foundations brand marks). A second, parallel `api-connection/` (singular) was built alongside this organism originally; reconciled away when this branch merged, since `api-connections/` already existed and covers everything this card needs — see its own README. |
| **Add Document List Item** | Skip — unrelated row (added document, not a source/connection). |

## Authoritative Figma

[Sources & notes card](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16456-17608)
set (`16456:17608`). Axis:

| Axis | Figma | API |
| --- | --- | --- |
| Linked | `16455:17604` False / `16456:17609` True | `connections` empty vs. non-empty |

`Linked` isn't its own boolean prop — the Connections section's only
content *is* the connections list, so "no connections" and "hide the
section" are the same state in Figma and here.

## Colors (Foundations)

| Role | Figma | Token |
| --- | --- | --- |
| Card border | alpha-black 10% | `--theme-alpha-black-switch-10` |
| Eyebrow icon + label | white 50% | `--theme-alpha-black-switch-60` (direct — not `--muted-foreground`, which doesn't re-resolve on a locally-`.dark`-wrapped canvas; see API Connection's README for the full explanation) |
| Description | white 75% | `--text` |

## Structure

- **Header** — cloud-upload glyph + uppercase eyebrow ("Sources &
  notes"), then a description paragraph.
- **Button row** — two nested `<ImageButton>` (`import-notes` /
  `import-manuscript`), each `flex-1` (Figma's fixed 292.5px width
  doesn't hold once the row's own max-width shrinks on a narrower
  card). Not a Figma axis (Figma only ever shows both side by side),
  but a real layout need: the row is a named `@container` (on the card
  root, not a viewport breakpoint — this card can sit in a narrow
  sidebar regardless of viewport width) and stacks Import manuscript
  below Bring in your notes once the card narrows past `@lg` (512px).
  `showManuscriptButton={false}` suppresses Import manuscript entirely
  (e.g. a fresh project with nothing to import yet) — Bring in your
  notes then fills the row alone.
- **Connections** (only when `connections` is non-empty) — uppercase
  eyebrow ("Connections") + one nested `<ApiConnection>` per entry.

## API

| Prop | Notes |
| --- | --- |
| `heading` / `description` | Header copy |
| `notesButtonProps` / `manuscriptButtonProps` | Forwarded to the respective Image Button (override `title`, `href`, `onClick`, …) |
| `showManuscriptButton` | Default `true`. `false` hides Import manuscript entirely |
| `connections` | `ApiConnectionProps[]`; non-empty renders the Connections section |
| `connectionsHeading` | Default `'Connections'` |
