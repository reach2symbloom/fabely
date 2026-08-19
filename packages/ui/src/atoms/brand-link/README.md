# Brand Link

Service logo + name lockup.

## Placement

YES — reusable wherever a brand mark needs to read as one unit (API
connections today; import-source pickers or settings rows later). Lives
in `src/atoms/brand-link/`.

## Overlap

| Candidate | Verdict |
| --- | --- |
| **Book Cover** | Skip — portrait manuscript cover art with an edit scrim, a different job. |
| **Image Button** | Skip — its thumbnail is a decorative illustration, not a brand-mark lockup. |
| **Foundations Brand Logos** | Compose at the call site — this atom takes a resolved `logoSrc`, it doesn't know about the brand catalog itself (that mapping lives in API Connection's `DEFAULTS_BY_BRAND`). |

## Authoritative Figma

[Brand link](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16456-17763)
(`16456:17763`), part of the [API Connections](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16456-17857)
set.

## Colors (Foundations)

| Role | Figma | Token |
| --- | --- | --- |
| Label | text-default-color 75% | `--foreground` |

## Structure

- 40×40 logo box, 8px padding, `object-contain` (brand marks vary in
  aspect ratio — `cover` would crop non-square ones).
- `paragraph/small/medium` label.
- Purely presentational: `logoSrc`/`label` are required inputs, no
  brand-catalog knowledge baked in. `logoClassName` exists specifically
  for one-off treatments a caller needs on the mark itself (e.g. API
  Connection inverts Apple's mark to white, since Figma ships only one
  black ink with no light/dark pair).

## API

| Prop | Notes |
| --- | --- |
| `logoSrc` | Required — resolved image URL |
| `label` | Required — brand name |
| `logoClassName` | Extra classes on the logo `<img>` |
