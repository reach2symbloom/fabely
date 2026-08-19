# Bookshelf Template

Library page shell — Header (wordmark + "New manuscript" CTA), Library Nav,
and Footer (account-menu avatar + Upgrade plan + notifications).

## Placement

NO — Library product chrome. Stays in
`src/features/library/bookshelf-template/`.

## Overlap

| Candidate | Verdict |
| --- | --- |
| **Library Nav** | Composed as-is for the scrollable book list — no fork. |
| **Avatar with Label** | Composed as-is (`size="md"`, `padded={false}`, `actionLabel`/`actionHref`/`onActionClick` for "Upgrade plan") as the account-menu trigger's content — the *whole* thing, including the real "Upgrade plan" anchor, lives inside the trigger. See Structure for how the trigger stays HTML-valid and "Upgrade plan" keeps its own independent hover despite the nesting. |
| **Dropdown Menu** | Composed as-is for the account-menu popup (`DropdownMenuTrigger` `render`-wraps a `role="button"` div around Avatar with Label; `DropdownMenuItem`/`DropdownMenuSeparator` for the two stub rows). No new primitive. |
| **Button / Icon Button / Badge / Separator** | Composed as-is; no new variants added. "New manuscript" is `primaryOutline` (Figma's own gradient-ring button); the notifications badge is `Badge` default/default (18px, matches Figma exactly). |

No new primitive-level styling was authored for this piece — it is purely
an arrangement of already-published components, per `docs/DESIGN.md`'s
Templates layer ("arrange organisms, molecules, and atoms into a structure,
without final content").

## Authoritative Figma

[Bookshelf template](https://www.figma.com/design/gV94L0qCmvwQkddNbEktry/Fabely-Design-System?node-id=16431-14662)
(`16431:14662`). One example — Header / Library / Footer stack, 357px wide.

## Structure

- **Header** — wordmark (`logo` slot or `logoSrc` convenience prop, wrapped
  in a home `<a>` unless `homeHref={false}`) + full-width "New manuscript"
  button (`primaryOutline` Text Button when no `newManuscriptHref`, or the
  same chrome on a real `<a>` when a route is given — see button README's
  "real document navigation" row).
- **Library** — `LibraryNav` with `books` / `activeId` / `defaultActiveId` /
  `onActiveChange` / `linkLabel` passed straight through. Fills remaining
  height (`flex-1 min-h-0`); no internal scroll behavior added here — that's
  Library Nav's own concern if the list grows past the viewport.
- **Footer** — hairline `Separator`, then the account-identity block, then
  a ghost notifications control with an absolutely-positioned `Badge` count
  (hidden at 0) — a real `<a>` in
  `iconButtonVariants({ variant: 'ghost', size: 'sm' })` chrome when
  `notificationsHref` is set (destination not yet decided product-side —
  the prop exists so a route can be dropped in later), otherwise a plain
  `IconButton`.
- **Account identity block** (primary — `avatarPopoverDisabled={false}`,
  the default): a `DropdownMenu` whose trigger `render`-wraps a
  `role="button"` `<div>` (`ACCOUNT_TRIGGER_CLASSNAME` — padding, hover
  fill, focus ring) around the *entire* `AvatarWithLabel`, "Upgrade plan"
  included via its `actionLabel`/`actionHref`. A `<div>`, not a native
  `<button>`, because a `<button>`'s content model cannot validly contain
  interactive content and "Upgrade plan" is a real nested `<a>`; Base UI's
  `Menu.Trigger` adds the button semantics (role, keyboard activation,
  `aria-haspopup`/`aria-expanded`) itself via `render`, same pattern this
  primitive already uses elsewhere with `<Button render={...} />`.
  `onActionClick` calls `event.stopPropagation()` before the host's own
  `onUpgradeClick`, so clicking "Upgrade plan" only navigates — it doesn't
  also toggle the menu from the click bubbling up to the trigger div.
  "Upgrade plan"'s hover stays independent of the trigger's ambient fill
  because `buttonLinkVariants`'s `hover:underline` lives on the anchor
  itself — a second, self-owned cue layered on top, not merged into one;
  it doesn't require carving the link out of the trigger's hit area. The
  popup repeats a small avatar + name header, a separator, then two stub
  `DropdownMenuItem`s: "Account settings" (`render`s as a real `<a>` when
  `userProfileHref`/`user.profileHref` is set, otherwise a plain
  non-navigating item) and "Sign out" (`onSignOutClick`, no default
  behavior — host wires the real sign-out call).
- **Account identity block** (`avatarPopoverDisabled={true}`) — the
  pre-popover behavior: a single `AvatarWithLabel` with its own built-in
  `actionLabel`/`actionHref`/`onActionClick` rendering "Upgrade plan"
  (independent hover here too, for free, since Avatar with Label's action
  is a real anchor whenever its own root isn't itself a link). The avatar
  row itself becomes a real `<a>` to `userProfileHref`/`user.profileHref`
  when set (cursor + hover fill, Avatar with Label's own
  interactive-vs-static rule), otherwise a static row.
- Both modes share `AVATAR_FALLBACK_CLASSNAME` — Figma's lavender pantone
  fallback fill, not Avatar's generic blush default.

## Theming

Requires a `.dark`-rooted host (same as every other Library piece — this
surface has no Figma light variant). Toggle `.dark` on
`document.documentElement`, not on a wrapper inside the tree: several
switch-token aliases this component depends on (`--muted-foreground`, in
Library Nav's timestamps and the notifications icon) are declared once at
`:root` and only re-declared for the *raw* switch tokens under `.dark` —
their `var()` resolves using whichever element the alias itself is
declared on, i.e. `:root`, so it only picks up the dark value when `.dark`
sits on the true document root. A `.dark` class on some descendant div
leaves those aliases silently stuck on their light value even though the
raw tokens flip correctly right next to them. Storybook's own toolbar
toggle already does this correctly (see `.storybook/preview.tsx`); this
component's story pins `globals: { theme: 'dark' }` so it renders correctly
without relying on the toolbar's current state.

## Colors (Foundations)

| Role | Figma | Token |
| --- | --- | --- |
| Root surface | `tw-raw/black` | `var(--tw-raw-black)` |
| New manuscript ring | `tw-raw/primary-gradient/1` → `/2` | `var(--gradient-primary-top-bottom)` via Button's `primaryOutline` (`GRADIENT_BORDER`) |
| Upgrade plan link | `tw-raw/fia/200` | Link Button `variant="fia"` |
| Account-menu popup | shadcn `--popover` / `--popover-foreground` / `--border` | Dropdown Menu's own `CONTENT_SURFACE` — no override |
| Notification badge | `alpha/black/switch/alpha-333` fill + `neutrals-500` text | Badge `variant="default"` |

## Deviations from Figma

1. **Demo content only, not data-driven defaults.** `books` and `user` are
   required/derived props, not baked-in Figma copy — same convention as
   Library Nav (`books`) and Chapter Menu Header (`author`).
2. **No internal viewport / scroll model.** Figma shows one fixed-height
   frame (`1037px`); this component is `h-full w-full max-w-[357px]` so a
   host can size it (e.g. an app sidebar) rather than hard-coding Figma's
   canvas height.
3. **Account-menu popover has no Figma source.** The static Figma frame
   just shows the avatar + name at rest — there's no published popup
   design. Built as a minimal real shell (name header, Account settings,
   Sign out) using Dropdown Menu's existing Foundations chrome rather than
   inventing new surface styling; `avatarPopoverDisabled` exists for hosts
   that would rather not have product decide this yet.
