/**
 * Fabely Avatar atom — thin re-export of the upstream shadcn Avatar
 * primitive (src/components/ui/avatar.tsx). This is the public API future
 * Fabely components should import Avatar from, not the vendor path
 * directly, so any future Fabely-specific behavior (variants, sizes,
 * badges, presence, grouping) can be layered in here without call sites
 * changing their import.
 *
 * Intentionally minimal for now: no variants, sizes, badges, groups, or
 * status indicators are added at this layer yet — see README.md.
 */
export { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
