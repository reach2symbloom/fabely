import type { ComponentType } from 'react';
import { icons, type LucideIcon } from 'lucide-react';
import * as SolarIcons from '@solar-icons/react';

import { FiaSilcrow } from '../src/foundations/icons';

/**
 * Icon Library data.
 *
 * Lucide: full published set from lucide-react's `icons` map (system UI).
 * Optional usage notes annotate icons Fabely already uses in components.
 *
 * Solar: full published set from @solar-icons/react. Canonical weight for
 * Fabely is BoldDuotone — illustration accents and glyphs Lucide lacks.
 *
 * Fabely Icons: brand glyphs under `src/foundations/icons`.
 */

export type SolarLibraryIcon = ComponentType<{
  size?: number | string;
  color?: string;
  weight?: 'Bold' | 'Linear' | 'Outline' | 'BoldDuotone' | 'LineDuotone' | 'Broken';
  className?: string;
}>;

export type FabelyLibraryIcon = ComponentType<{
  className?: string;
  title?: string;
}>;

/** Package internals / providers — not glyph components. */
const SOLAR_NON_ICONS = new Set(['SolarProvider', 'default', 'IconBase', 'SSR']);

/** Full Solar catalog — sorted alphabetically. Canonical weight: BoldDuotone. */
export const solarAll: { name: string; Icon: SolarLibraryIcon }[] = Object.entries(SolarIcons)
  .filter(([name, value]) => {
    if (SOLAR_NON_ICONS.has(name)) return false;
    if (name[0] !== name[0].toUpperCase()) return false;
    return typeof value === 'object' || typeof value === 'function';
  })
  .map(([name, Icon]) => ({ name, Icon: Icon as SolarLibraryIcon }))
  .sort((a, b) => a.name.localeCompare(b.name));

/** Full Lucide catalog — sorted alphabetically. */
export const lucideAll: { name: string; Icon: LucideIcon }[] = Object.entries(icons)
  .map(([name, Icon]) => ({ name, Icon }))
  .sort((a, b) => a.name.localeCompare(b.name));

/** Fabely brand glyphs — Foundations `src/foundations/icons`. */
export const fabelyAll: {
  name: string;
  Icon: FabelyLibraryIcon;
  usage?: string;
}[] = [
  {
    name: 'FiaSilcrow',
    Icon: FiaSilcrow,
    usage: 'Upgrade / Fia lockup — Chapter Menu Header',
  },
];

/** Optional usage notes for Lucide icons already adopted in Fabely UI. */
export const lucideUsageNotes: Record<string, string> = {
  Check: 'Success confirmation, completed tasks',
  CheckCheck: 'Read / delivered confirmation (Alert success)',
  X: 'Dismiss, clear, close overlays',
  Plus: 'Create, add items, compose actions',
  Pencil: 'Edit, rename, inline modification',
  Trash2: 'Delete, destructive actions',
  Search: 'Search fields, filter entry points',
  Settings: 'Preferences, configuration',
  User: 'Profile, account, avatar fallbacks',
  Mail: 'Email, messaging channels',
  Bell: 'Notifications, activity alerts',
  Info: 'Informational alerts and helper text',
  CircleAlert: 'Warning / attention status',
  AlertTriangle: 'Caution, destructive risk',
  CircleCheck: 'Positive status, validated state',
  CircleX: 'Error status, invalid state',
  ChevronDown: 'Expand menus, selects, accordions',
  ChevronRight: 'Navigate forward, nested disclosure',
  ArrowLeft: 'Back navigation, previous step',
  ArrowRight: 'Forward navigation, next step',
  ExternalLink: 'Opens outside the current surface',
  Eye: 'Reveal content (e.g. show password)',
  EyeOff: 'Conceal content (e.g. hide password)',
  Camera: 'Capture / upload media (Avatar badge)',
  Loader2: 'Pending / in-progress spinners',
};
