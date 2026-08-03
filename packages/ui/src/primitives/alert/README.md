# Alert

The Fabely Alert primitive — wraps the upstream shadcn Alert primitive (`src/components/ui/alert.tsx`) to match this design system's own Figma Alert component (node `58:5416`, "Fabely Design System" file: `gV94L0qCmvwQkddNbEktry`), inspected directly via the Figma MCP connection.

## Scope

Implements all 4 of Figma's `Type` values (`Neutral`, `Error`, `Alert`, `Success`), each at both line counts, with an optional leading icon. Figma's `Flip Icon` boolean and `Show Button` slot remain out of scope, matching the previous (Neutral-only) milestone this one extends.

| Figma property | Fabely equivalent |
| --- | --- |
| `Type` (Neutral/Error/Alert/Success) | `type` prop on `Alert` (`"neutral"` default, `"error"`, `"alert"`, `"success"`) |
| `Lines` (1 vs. 2) | Not a prop — derived from whether an `AlertDescription` child is present. Pass one for a two-line alert, omit it for one line. |
| Icon shown/hidden | Not a prop for any of the 4 types — derived from whether an icon element (any non-`AlertTitle`/`AlertDescription` child) is present, `success` included. Figma's own Success schema has no icon slot at all (its checkmark instance there is unconditional), but this primitive deliberately derives its visibility from composition anyway, matching the other 3 types, rather than forcing it permanently on. Whichever icon element is passed for `type="success"` is ignored in favor of a fixed checkmark — only its *presence* is used as the show/hide signal, not its identity. |
| `Flip Icon` | Not implemented. |
| `Show Button` | Not implemented — no `AlertAction` in this primitive. |

`type` is a genuine prop, unlike `Lines`/icon visibility — there's no composition signal that could stand in for "which color treatment" the way a child's presence already stands in for line count, so this is the one control this milestone adds beyond the previous, Neutral-only scope's derive-everything-from-children approach.

**Figma's own `Type=Alert` value is renamed to `"Warning"` in Storybook** (the prop value is still `type="alert"`, matching Figma exactly) to avoid confusion with the Alert component itself.

## Wraps upstream

Unchanged from the previous milestone: `src/components/ui/alert.tsx` stays vendor code, untouched; `Alert` overrides its CSS grid layout to a flex row (`items-center`) and partitions its children into an icon vs. a title+description content wrapper internally — see git history for the fuller writeup, still accurate for all 4 types since layout doesn't vary by `type`, only color does.

Vendor's own `variant` prop (`"default" | "destructive"`) is still not exposed on this primitive's `Alert` — `type` is the equivalent surface now, with its own 4 values (a superset of what `variant` could express).

## Colors — sourced from Figma per type, cross-checked against Foundations

**`neutral`** is unchanged from the approved milestone — `--theme-alpha-black-switch-333`/`-30` (a "switch" family that already flips light/dark), `--effect-focus-ring-secondary`, and `--foreground` cover it exactly with existing tokens, no hardcoded values.

**`error`, `alert`, and `success`** are different in an important way: Figma binds their backgrounds/borders to literal, *unbound* alpha values (not variables) — unlike `neutral`'s switch-token background, these three keep a fixed brand-color tint in both themes (an error alert stays "error-red," it doesn't invert to gray in dark mode). Per this milestone's own instructions, hardcoded Figma values without a matching declared Foundation step are preserved as literally specified — reconstructed via `color-mix()` from the closest existing raw primitive rather than a bare hex, with a `TODO(design-tokens)` comment in `alert.tsx` at each site — rather than inventing new named tokens for single-use percentages:

- **`error`** — background is 8% of `--tw-raw-error-400`; border is 32% of `--tw-raw-error-300`; ring is 8% of `--tw-raw-error-ghost` (`#C43551`) — all three are literal, unbound values, not the switching `--ring-error` semantic token (its light/dark values don't match Figma's literal ring color here). Same pattern as `alert`/`success` below, which also build their own rings from their own raw ghost token rather than `--ring-alert`/`--ring-success`. Title text binds to the raw, non-switching `--tw-raw-error-50` — see "Known limitations" below.
- **`alert`** (Figma: `Type=Alert`, Storybook: "Warning") — background/border/ring are all built from the *already-declared* `--tw-raw-alert-ghost` token, whose own colors.css comment says "8% opacity per Figma" — matches this type's background and ring exactly; its border is the same base at 28%, no matching declared step.
  **Deviation from Figma's literal value:** Figma's own inspected title-text binding here is `--tw-raw-error-50` (pale *pink*) — almost certainly a copy/paste artifact from the Error variant this one was likely duplicated from in Figma (an amber-tinted surface with pink title text reads as a mistake, not a design choice). This primitive uses `--tw-raw-alert-50` (the matching amber-family shade) instead of reproducing that inconsistency. Worth confirming with design and fixing at the source in Figma.
- **`success`** — background/border are 4%/32% of `--tw-raw-success-ghost` (the 32% border is this milestone's own cited example of a hardcoded value with no matching Foundation step). The ring reuses the *same* token at the 12% its own comment documents. Title text uses the switching `--foreground` (Figma's own value here, unlike `error`/`alert`) — no light/dark caveat for this type.

Icon size (16px one line / 24px two lines) and the icon/content gap (`--spacing-sm`/`--spacing-md`) are unchanged from `neutral` and identical across all 4 types — confirmed against every one of Figma's 8 variant nodes, not just Neutral's 2.

**Not reproduced:** Figma's Error/Alert types at `Lines=1` additionally wrap their icon in its own `pt-[2px]` "Icon-aligner" for a sub-pixel optical nudge — skipped as imperceptible at this size rather than adding a fourth conditional wrapper for a 2px difference.

### Icon color

The icon's color is intentionally *independent* of the title-text color documented above — in Figma every type's icon reads as a distinct semantic accent, not the same (sometimes near-white/pale) shade as its own title. This primitive overrides vendor's own `[&>svg]:text-current` (which would otherwise make the icon inherit whatever `text-*` color is on the Alert root, i.e. the title's own color) with a per-type `[&>svg]:text-*` rule of the same selector shape, so `tailwind-merge` reliably drops vendor's default:

- **`neutral`** — `--muted-foreground` (already-declared, already-switching; the same secondary/quiet semantic already used for `AlertDescription`). A real Foundation token, no TODO.
- **`error`** — `--destructive`, this design system's own existing, already-switching semantic accent for error (light: `--tw-raw-error-500`, dark: `--tw-raw-error-300`) — the same token vendor's own `destructive` variant already uses for its text color. A real Foundation token, no TODO.
- **`alert`/`success`** — neither has a declared semantic accent token yet (only the raw `tw-raw-alert-*`/`tw-raw-success-*` scales exist), so each type's own scale "main" step is used directly (`--tw-raw-alert-600`/`--tw-raw-success-600`).
  **TODO(design-tokens):** promote these to real `--warning`/`--success` semantic accent tokens (mirroring `--destructive`) once Foundations defines them, rather than reaching into the raw scale here.

## Known limitations

- **`error`/`alert` title-text contrast in light mode.** Both types bind their title text to a raw, theme-invariant Figma color (`--tw-raw-error-50`/`--tw-raw-alert-50` — very pale shades) against an *also* theme-invariant, very light-tinted background. In dark mode this reads clearly (confirmed via Storybook's accessibility panel: 0 violations on both dedicated pages). In light mode, the same pale text lands on a background that's *also* pale, so contrast fails (confirmed: 3 flagged elements on each of the dedicated Error/Warning pages). This is inherited directly from Figma's own literal (non-switching) values for these two types, not something introduced or silently patched here — per this milestone's instructions, hardcoded values without a Foundation-token equivalent are preserved and flagged (see the `TODO(design-tokens)` comments in `alert.tsx`) rather than papered over with an invented semantic token Figma doesn't itself define. Worth raising with design: either these two types need a real switching token pair, or they're intentionally dark-mode-only surfaces.
- **Pre-existing, page-wide `--muted-foreground` contrast issue.** `AlertDescription` (all 4 types, both themes) uses vendor's own `text-muted-foreground`, which was already flagged as a platform-wide limitation in an earlier milestone, unrelated to this one.

## Future enhancements

- `Flip Icon`.
- `Show Button` / an `AlertAction`-style slot.
- A real Fabely Button atom.
- Dismissible/closeable alerts.
- Resolving the `error`/`alert` light-mode title-contrast gap and the `alert` title-color Figma inconsistency at the source (in Figma), once design has weighed in.
