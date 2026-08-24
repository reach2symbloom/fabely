/**
 * Promptbar — `PromptbarIconToken` → icon component lookup.
 *
 * The only file in this feature that imports every icon it uses — kept
 * separate from `promptbar-presentation.ts` specifically so that module
 * stays icon/React-free (see its own doc comment). No new icon assets:
 * every glyph here is either an existing Lucide import already used
 * elsewhere in the Promptbar feature, or one of the three Fabely custom
 * icons under `@/foundations/icons`.
 */
import type * as React from 'react';
import {
  ArrowUp,
  AudioLines,
  BookOpenText,
  Check,
  Coins,
  Feather,
  GitCompare,
  Globe,
  Link2Off,
  Mic,
  MicOff,
  Plus,
  Share2,
  Square,
  Workflow,
  X,
  Zap,
} from 'lucide-react';

import { LineDotRightHorizontal } from '@/foundations/icons';
import type { PromptbarIconToken } from './promptbar-presentation';

export const PROMPTBAR_ICON: Record<PromptbarIconToken, React.ComponentType<{ className?: string }>> = {
  globe: Globe,
  'book-open-text': BookOpenText,
  'link-off': Link2Off,
  'line-dot': LineDotRightHorizontal,
  workflow: Workflow,
  feather: Feather,
  check: Check,
  'git-compare': GitCompare,
  share2: Share2,
  zap: Zap,
  coins: Coins,
  mic: Mic,
  'mic-off': MicOff,
  'audio-lines': AudioLines,
  'arrow-up': ArrowUp,
  square: Square,
  plus: Plus,
  x: X,
};

function PromptbarIcon({ token, className }: { token: PromptbarIconToken; className?: string }) {
  const Icon = PROMPTBAR_ICON[token];
  return <Icon className={className} />;
}

export { PromptbarIcon };
