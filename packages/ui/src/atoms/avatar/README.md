# Avatar

The Fabely Avatar atom — a thin wrapper around the upstream shadcn Avatar primitive (`src/components/ui/avatar.tsx`, built on Radix UI's Avatar).

## Purpose

`Avatar` / `AvatarImage` / `AvatarFallback` establish the public API that future Fabely components (molecules, organisms, and applications) should depend on. Importing from this atom rather than the vendor path directly means any future Fabely-specific behavior can be layered in here without call sites needing to change their import.

## Wraps upstream

This atom does not modify, restyle, or extend the upstream primitive — it re-exports it as-is. Treat `src/components/ui/avatar.tsx` as vendor code.

## Future enhancements

Not yet implemented — deliberately deferred until a recurring pattern justifies them (per `docs/DESIGN.md`'s "begin with faithful implementation" principle):

- `AvatarGroup` / stacked avatars
- Size variants
- Status/presence indicators
- Badges

The upstream primitive already includes some of these (`AvatarBadge`, `AvatarGroup`, `AvatarGroupCount`, a `size` prop) — they are intentionally not yet re-exported through this layer until Fabely actually needs them.
