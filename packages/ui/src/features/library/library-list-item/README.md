# Library List Item

Book row for the Library grid/list — title, category/series badge,
timestamp, chapter/note/word counts, and (when active) a Continue/Start
writing link.

## Placement

NO — Library product chrome. Stays in
`src/features/library/library-list-item/`.

## Overlap

Searched primitives / atoms / molecules / organisms:

| Candidate | Verdict |
| --- | --- |
| **ListItem** (primitives) | Skip as shell — generic menu leaf (media/content/trailing slots, fill hover). This row is its own layout: stacked title + two meta rows + conditional link row, not a single-line leaf. |
| **Badge** | Compose as-is — `default` variant/size (`bg-alpha-333`, `text-neutrals-new-500`, mini-medium, `h-[18px]`, `rounded-sm`) matches the Figma Non-fiction pill exactly; `secondary` variant matches the Fiction pill (`tw-raw-secondary-ghost` fill, `tw-raw-secondary-200` text) — no overrides needed either way, exposed via `categoryVariant`. |
| **Icon Button `ghost` mini** | Compose — trailing ellipsis (Book actions). |
| **Button Link `primary` default** | Compose — Continue/Start writing; Figma's link color (`#7a736d`) is exactly `--neutrals-new-600`, the Link Button `primary` variant. |
| Lucide `EllipsisVertical` / `GitBranch` / `MoveRight` | Match the Figma icon set names (`ellipsis-vertical`, `git-branch`, `move-right`) 1:1 — used directly rather than re-exported SVGs. |

## Authoritative Figma

[Library list item](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16428-12557)
set (`16428:12557`). Axes:

| Axis | Values |
| --- | --- |
| Variant | Existing book · New book |
| Hover | False / True |
| Active | False / True |

Hover and Active never combine in Figma (6 published combos, not 8) —
Active suppresses this row's own `:hover` styling rather than layering on
top of it.

## Colors (Foundations)

| Role | Figma | Token |
| --- | --- | --- |
| Title (hover / active) | text default color (75%) | `--text` |
| Title (rest) | alpha/black/switch/alpha-60 | `--theme-alpha-black-switch-60` |
| Timestamp | muted-foreground | `--muted-foreground` |
| Chapter/note/word counts + dot dividers | alpha/black/switch/alpha-30 | `--theme-alpha-black-switch-30` |
| Category badge | neutrals (new)/500 on alpha-333 fill | Badge `default` variant (unmodified) |
| Continue/Start writing link | `#7a736d` | Link Button `primary` (`--neutrals-new-600`) |
| Active background | `rgba(255,255,255,0)` → `rgba(166,160,155,0.1)` gradient + 3px blur | inline gradient (no Foundations token published for this wash) |

## Structure

- **Title** — wraps (no clamp), `--text-paragraph-regular-regular`, in a
  flex row beside the actions button so long titles never collide with it
  (Figma's own layout absolutely overlaps the two and only avoids
  collision because its reference title's first line happens to be
  short — not reproduced here).
- **Actions button** — trailing ellipsis in that row (`showMenuButton`).
  Hidden by default; reveals on hover, `forceHover`, or keyboard focus.
  Deliberate deviation from Figma (which pins it visible at rest and while
  `active`) — product call to keep it hover-only, always reachable by
  keyboard via `focus-visible`.
- **Meta row 1** — category/series Badge + italic timestamp. Identical
  content between Figma's Hover and Rest nodes — only the row's own
  padding and title ink change on hover, so this ports as one meta block
  rather than duplicated hover/rest JSX.
- **Meta row 2** — chapter/note/word counts with dot dividers.
  `variant="existing-book"` only; a new book has no stats yet.
- **Link row** — Continue/Start writing, `active` only (`showLinkButton`).
  Decorative (`aria-hidden`, `tabIndex={-1}`) since the row's own stretched
  `href` link already covers navigation; label reads Continue vs. Start
  from `variant`.
- **`href`** — manuscript route. Prefer a real route; Storybook uses `#`.
  Stretched link behind the row; title/actions/link stay on top (`z-10`).
- **Hover (not active)** — padding shifts right (`px-md` → `pl-lg / pr-md`);
  title ink brightens to `--text`; actions button reveals. Row height is
  always content-driven (no fixed height to snap from) so the shift
  animates smoothly.
- **Active** — gradient + blur wash, link row revealed; hover styling
  suppressed. Actions button still only shows on hover/focus, not pinned.

## Deviations from Figma

1. **Link button is decorative, not a second link.** Figma's Continue/Start
   writing sits inside the same clickable card; giving it a real `href`
   would nest two navigations in one row. It renders as inert typography
   (`aria-hidden`, `tabIndex={-1}`) and lets the row-level stretched link
   own the click.
2. **`forceHover`** (Storybook/playground only) locks the hover paint
   without a pointer — mirrors [Chapter Menu List Item](../../chapter-nav/chapter-menu-list-item).
3. **No fixed rest height.** Figma pins Existing book's rest state to
   `130px`; ported that at first, but it meant the row snapped to `h-auto`
   on hover — `height: auto` can't be CSS-transitioned, so it jumped in one
   frame instead of easing. Dropped it; every state now sizes to content
   (matches how New book already behaved), so hover has nothing to snap.
4. **`duration-fast` spelled out as `duration-[var(--duration-fast)]`.**
   The bare class (used throughout this codebase, e.g. Chapter Menu List
   Item) is a silent no-op — Tailwind v4 only exposes a dynamic theme
   namespace for `ease-*`, not `duration-*`, so it resolves to nothing and
   transitions fall back to Tailwind's 150ms default instead of the
   intended 200ms token. Confirmed via computed styles. Worth a wider fix
   across the design system; out of scope here.
5. **Actions button is hover/focus-only, not pinned at rest or `active`.**
   Figma shows it visible whenever not hovering; product call here is to
   keep it hidden until hover, `forceHover`, or keyboard `focus-visible`.
6. **`categoryVariant`** (`'default' | 'secondary'`) — genre-driven Badge
   color, added for [Library Nav](../library-nav). The original 16428:12557
   set only ever showed Non-fiction (`default`); the Library Nav set
   (16431:13709) also shows Fiction as `secondary` (purple). No general
   Fiction/Non-fiction → color taxonomy is published in Figma beyond these
   two examples, so this stays an explicit prop rather than an inferred
   mapping from `category` text.
7. **`linkLabel`** override — defaults to the variant-derived Continue/Start
   writing, but Library Nav's active row reads "Resume writing" uniformly
   regardless of variant.
8. **`seriesLabel={false}`** — omit the git-branch + Series lockup. Library
   Nav's third book is a category-only Badge; the list-item set always
   showed Series.
9. **Active wash and link row are always mounted, not conditionally
   rendered.** First pass toggled `background-image`/`backdrop-filter`
   classes and mounted/unmounted the link row directly on `active` — both
   snapped instantly instead of animating (`background-image` has no
   interpolable path from `none`, and a removed element can't transition
   out). Now: a permanent absolutely-positioned wash layer whose *opacity*
   toggles (opacity is always animatable), and a permanent link-row
   wrapper whose height animates via the `grid-template-rows` 0fr→1fr
   technique (same one [Chapter Menu List Item](../../chapter-nav/chapter-menu-list-item)
   uses for its scenes reveal), with the inner content cross-fading via
   opacity/translate. Verified live (Playwright, sampling mid-transition
   computed styles) that both now interpolate instead of snapping.
10. **Cursor-follow glow on hover** — not in Figma. Product request: a soft
    radial light tracks the pointer over the card while hovering (never
    while `active`). Same mechanism as [Add Section Inline Button](../../chapter-nav/add-section-inline-button)'s
    pointer-follow glow — `pointermove`/`pointerenter` write `--glow-x` /
    `--glow-y` directly via `style.setProperty` (skips a React re-render
    per mouse move), consumed by two layered `radial-gradient`s (ambient +
    tighter core) using the same white/`--tw-raw-primary-gradient-1`
    color-mix recipe. Reveal is `group-hover`/`group-data-[force-hover]`
    on the *row* — the glow layers themselves are `pointer-events-none`,
    so they can never receive their own `:hover` (a real bug caught live:
    an initial pass used a bare `hover:` on the glow layer itself, which
    can't fire on a `pointer-events-none` element and left the glow stuck
    at opacity 0).
11. **"Bowstring" easing on the hover indent, not `--ease-emphasized`.**
    Product request: hovering (padding growing left) should read as tension
    building, and `active` (selecting a book) as that tension releasing —
    tuned through several rounds live (see inline comments on the three
    named easing spots in the component for the full history of what
    didn't work and why):
    - Hover-in — scoped to `:hover`/`[data-force-hover=true]` only — is a
      genuine 5s draw (`cubic-bezier(0.16,1,0.3,1)`, easeOutExpo-ish),
      deliberately hard to finish. A first cut used too steep a curve for
      the tiny 4px travel and looked "done" within 100ms; the current
      curve spreads real, visible motion across most of the 5s.
    - Leaving hover without clicking (the base/un-scoped rule) is a quick
      200ms retract (`cubic-bezier(0.08,0.82,0.17,1)`) — un-hovering isn't
      a release, so no bounce.
    - Entering/leaving `active` is a 200ms back-ease overshoot
      (`cubic-bezier(0.34,1.56,0.64,1)`) — snaps past the resting padding
      before settling. "Released."
12. **Cursor glow tuned from "searchlight" to ambient.** First pass was a
    56px-radius, 7%-peak single layer — still read as a small spotlight
    regardless of the low opacity, because a tightly-bounded shape reads
    as a spotlight no matter how faint. Widened to 260px (past the card's
    own width, so the gradient's edge sits mostly off-card) at 4.5% peak
    across 4 stops, which is what actually kills the spotlight look.
    Extended to render (and pointer-track) even while `active` — only the
    padding bow-draw stays active-exclusive.
13. **Ripple on click** — general press feedback, not from Figma. Circle
    expands from the click point and fades (`transform`/`opacity` only,
    per this codebase's `animation-vocabulary` skill notes on
    compositing), kept low-opacity to match the glow/edge-highlight's
    restraint rather than a bold Material ripple. The `onClick` prop
    composes with the internal ripple-spawn handler so a consumer can
    still react to clicks; [Library Nav](../library-nav) doesn't currently
    use it — it wraps each row in its own click handler instead (native
    event bubbling still reaches this row's own handler either way, so the
    ripple fires regardless of which element owns the semantic click
    behavior).
