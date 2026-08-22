/**
 * Minimal database-facing identity contract used by avatar-backed features.
 * Adapters can map any backend user record to this stable UI boundary.
 */
export type UserIdentity = {
  id: string;
  name: string;
  initials?: string | null;
  avatarUrl?: string | null;
  profileHref?: string | null;
};

export function getUserInitials(user: Pick<UserIdentity, 'name' | 'initials'>) {
  return user.initials?.trim() || user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
