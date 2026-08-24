/**
 * Promptbar — turns a `PromptbarShelfPresentation` descriptor into the
 * actual `StatusBadge`/`ListItem`/`Status`/`Separator` JSX for
 * `PromptbarShelf`'s `statusContent`/`trigger`/`children` slots.
 *
 * Split out of `Promptbar.tsx` specifically so that file stays a thin
 * skeleton (see its own doc comment) — this is where the nontrivial
 * amount of JSX-assembly for the shelf's own content lives, with nothing
 * here about the organism's top-level layout or motion-identity concerns.
 */
'use client';

import * as React from 'react';
import { Globe, Link2Off } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion, type Transition } from 'motion/react';

import { cn } from '@/lib/utils';
import { EASE_OUT } from '@/lib/motion';
import { LineDotRightHorizontal } from '@/foundations/icons';
import { Status } from '@/atoms/status';
import { StatusBadge, truncateText } from '@/atoms/status-badge';
import { Separator } from '@/primitives/separator';
import {
  ListItem,
  ListItemCheckmark,
  ListItemContent,
  ListItemDescription,
  ListItemMedia,
  ListItemTitle,
  ListItemTrailing,
} from '@/primitives/list-item';

import { PromptbarIcon } from './promptbar-icons';
import type {
  PromptbarBadgeSpec,
  PromptbarGenericBadgeSpec,
  PromptbarGenericMenuItemSpec,
  PromptbarMenuItemSpec,
  PromptbarSceneLinkConnectItemSpec,
  PromptbarSceneLinkStatusBadgeSpec,
} from './promptbar-presentation';

/** Figma's "Select Menu Group Label" (also used by Combobox/Select's own
 * optgroup headers) — reproduced here exactly as `PromptbarShelf`'s own
 * reference stories already establish it (`PromptbarShelf.stories.tsx`'s
 * local `GroupLabel`), since no standalone reusable primitive for it
 * exists yet (every other "group label" in this codebase is a named
 * export tied to its own Select/DropdownMenu/Combobox component, not a
 * free-standing one usable here). */
function ShelfMenuCaption({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full items-center gap-[var(--spacing-xs)] px-[var(--spacing-xs)] pt-[var(--spacing-xs)] pb-[length:var(--spacing-1-375)]">
      <p className="text-[length:10px] leading-[14px] tracking-[1px] text-[color:var(--muted-foreground)] uppercase">
        {children}
      </p>
    </div>
  );
}

function ShelfBadge({ spec }: { spec: PromptbarGenericBadgeSpec }) {
  return (
    <StatusBadge
      size={spec.size ?? 'compact'}
      tone={spec.tone ?? 'neutral'}
      leadingIcon={spec.leadingIcon ? <PromptbarIcon token={spec.leadingIcon} /> : undefined}
      middleIcon={spec.middleIcon ? <PromptbarIcon token={spec.middleIcon} /> : undefined}
      secondaryText={spec.secondaryText}
      // A fixed system message ("Not connected to scene") shouldn't inherit
      // the slot's default scene-title truncation — see
      // `PromptbarGenericBadgeSpec.secondaryIsSystemMessage`'s own doc
      // comment.
      secondaryTextClassName={spec.secondaryIsSystemMessage ? 'max-w-none overflow-visible whitespace-nowrap' : undefined}
      trailing={
        spec.trailingStatusGlyph ? (
          <Status variant="glyph" />
        ) : spec.trailingIcon ? (
          <PromptbarIcon token={spec.trailingIcon} />
        ) : undefined
      }
      onDismiss={spec.dismissible ? spec.onDismiss : undefined}
      dismissLabel={spec.dismissLabel}
    >
      {spec.label}
    </StatusBadge>
  );
}

/*
 * Below: an exact port of `PromptbarShelf.stories.tsx`'s `DefaultTypeExample`
 * badge-crossfade orchestration — same constants, same classes, same
 * timings, not a redesign. That story is the last-known-good reference
 * for this animation; see `PromptbarSceneLinkStatusBadgeSpec`'s own doc
 * comment for why this couldn't just be composed from the generic badge
 * above (the crossfade was never part of `StatusBadge`/`Status`
 * themselves — it's orchestration around their slots, which only ever
 * existed as story-local JSX until now).
 */
const BADGE_FORWARD_EXIT_S = 0.11;
const BADGE_FORWARD_ENTER_S = 0.2;
const BADGE_FORWARD_STAGGER_S = 0.08;
const BADGE_REVERSE_EXIT_S = 0.12;
const BADGE_REVERSE_ENTER_S = 0.14;

const BADGE_BLOOM_SCALE_FROM = 0.92;
const BADGE_BLOOM_BLUR_FROM = 'blur(2px)';
const BADGE_BLOOM_BLUR_TO = 'blur(0px)';

type BadgeGroup = 'disconnected' | 'connected';
type BadgeRole = 'icon' | 'text' | 'atom';

function badgeEnterTransition(group: BadgeGroup, role: BadgeRole, reducedMotion: boolean): Transition {
  if (reducedMotion) return { duration: 0 };
  if (group === 'connected') {
    const roleOffset = role === 'icon' ? 0 : role === 'text' ? BADGE_FORWARD_STAGGER_S : BADGE_FORWARD_STAGGER_S * 2;
    return { duration: BADGE_FORWARD_ENTER_S, ease: EASE_OUT, delay: BADGE_FORWARD_EXIT_S + roleOffset };
  }
  return { duration: BADGE_REVERSE_ENTER_S, ease: EASE_OUT, delay: BADGE_REVERSE_EXIT_S };
}

function badgeExitTransition(group: BadgeGroup, reducedMotion: boolean): Transition {
  if (reducedMotion) return { duration: 0 };
  return group === 'connected'
    ? { duration: BADGE_REVERSE_EXIT_S, ease: EASE_OUT }
    : { duration: BADGE_FORWARD_EXIT_S, ease: EASE_OUT };
}

function bloomInitial(reducedMotion: boolean) {
  return reducedMotion ? false : { opacity: 0, scale: BADGE_BLOOM_SCALE_FROM, filter: BADGE_BLOOM_BLUR_FROM };
}
function bloomAnimate(transition: Transition) {
  return { opacity: 1, scale: 1, filter: BADGE_BLOOM_BLUR_TO, transition };
}

function plainInitial(reducedMotion: boolean) {
  return reducedMotion ? false : { opacity: 0 };
}
function plainAnimate(transition: Transition) {
  return { opacity: 1, transition };
}
function plainExit(transition: Transition) {
  return { opacity: 0, transition };
}

const CONNECTION_ICON_SIZE_CLASS = 'size-[length:var(--tw-raw-spacing-3)] text-current';

function ConnectionIconCrossfade({ connected, reducedMotion }: { connected: boolean; reducedMotion: boolean }) {
  return (
    <span className="relative inline-flex items-center justify-center">
      <AnimatePresence mode="popLayout" initial={false}>
        {connected ? (
          <motion.span
            key="connected-icon"
            className="flex items-center justify-center"
            initial={bloomInitial(reducedMotion)}
            animate={bloomAnimate(badgeEnterTransition('connected', 'icon', reducedMotion))}
            exit={plainExit(badgeExitTransition('connected', reducedMotion))}
          >
            <LineDotRightHorizontal className={CONNECTION_ICON_SIZE_CLASS} />
          </motion.span>
        ) : (
          <motion.span
            key="disconnected-icon"
            className="flex items-center justify-center"
            initial={plainInitial(reducedMotion)}
            animate={plainAnimate(badgeEnterTransition('disconnected', 'icon', reducedMotion))}
            exit={plainExit(badgeExitTransition('disconnected', reducedMotion))}
          >
            <Link2Off className={CONNECTION_ICON_SIZE_CLASS} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function ConnectionTextCrossfade({
  connected,
  sceneTitle,
  reducedMotion,
}: {
  connected: boolean;
  sceneTitle: string;
  reducedMotion: boolean;
}) {
  return (
    <span className="relative inline-block overflow-hidden align-middle">
      <AnimatePresence mode="popLayout" initial={false}>
        {connected ? (
          <motion.span
            key="connected-text"
            className="block overflow-hidden text-ellipsis whitespace-nowrap"
            initial={bloomInitial(reducedMotion)}
            animate={bloomAnimate(badgeEnterTransition('connected', 'text', reducedMotion))}
            exit={plainExit(badgeExitTransition('connected', reducedMotion))}
          >
            {truncateText(sceneTitle, 100)}
          </motion.span>
        ) : (
          <motion.span
            key="disconnected-text"
            className="block overflow-hidden text-ellipsis whitespace-nowrap"
            initial={plainInitial(reducedMotion)}
            animate={plainAnimate(badgeEnterTransition('disconnected', 'text', reducedMotion))}
            exit={plainExit(badgeExitTransition('disconnected', reducedMotion))}
          >
            Not connected to scene
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function ConnectionAtomCrossfade({ connected, reducedMotion }: { connected: boolean; reducedMotion: boolean }) {
  return (
    <span className="relative inline-flex">
      <AnimatePresence mode="popLayout" initial={false}>
        {connected ? (
          <motion.span
            key="connection-atom"
            className="inline-flex"
            initial={bloomInitial(reducedMotion)}
            animate={bloomAnimate(badgeEnterTransition('connected', 'atom', reducedMotion))}
            exit={plainExit(badgeExitTransition('connected', reducedMotion))}
          >
            <Status variant="glyph" />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}

function SceneLinkStatusBadge({ spec }: { spec: PromptbarSceneLinkStatusBadgeSpec }) {
  const { connected, sceneTitle } = spec;
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <StatusBadge
      leadingIcon={<Globe />}
      middleIcon={<ConnectionIconCrossfade connected={connected} reducedMotion={reducedMotion} />}
      secondaryText={<ConnectionTextCrossfade connected={connected} sceneTitle={sceneTitle} reducedMotion={reducedMotion} />}
      secondaryTextClassName="max-w-none overflow-visible whitespace-nowrap"
      trailing={<ConnectionAtomCrossfade connected={connected} reducedMotion={reducedMotion} />}
    >
      All notes
    </StatusBadge>
  );
}

function AnyBadge({ spec }: { spec: PromptbarBadgeSpec }) {
  return spec.kind === 'scene-link-status' ? <SceneLinkStatusBadge spec={spec} /> : <ShelfBadge spec={spec} />;
}

/** The shelf's always-visible status row(s) — `statusContent` itself. An
 * array of rows (not a flat array of badges) so Fia-default's two
 * *stacked* context-chip rows and every other mode's single row share one
 * shape without a separate prop. */
function ShelfStatusRows({ rows }: { rows: PromptbarBadgeSpec[][] }) {
  return (
    <div className="flex w-full flex-col items-start gap-[var(--spacing-2xs)]">
      {rows.map((row, index) => (
        // eslint-disable-next-line react/no-array-index-key -- rows have no
        // independent identity beyond position; each badge inside does.
        <div key={index} className="flex items-center gap-[var(--spacing-2xs)]">
          {row.map((badge) => (
            <AnyBadge key={badge.key} spec={badge} />
          ))}
        </div>
      ))}
    </div>
  );
}

function ShelfTrigger({ spec }: { spec: PromptbarBadgeSpec }) {
  return <AnyBadge spec={spec} />;
}

function ShelfMenuItemRow({ spec }: { spec: PromptbarGenericMenuItemSpec }) {
  return (
    <ListItem selected={spec.checked} onClick={spec.onSelect} className={spec.onSelect ? 'cursor-pointer' : undefined}>
      <ListItemMedia>
        <PromptbarIcon token={spec.icon} />
      </ListItemMedia>
      <ListItemContent>
        <ListItemTitle>{spec.title}</ListItemTitle>
        <ListItemDescription>{spec.description}</ListItemDescription>
      </ListItemContent>
      <ListItemTrailing className="p-[length:var(--spacing-3xs)]">
        {spec.checked ? <ListItemCheckmark className="size-[length:var(--icon-sm)]" /> : null}
      </ListItemTrailing>
    </ListItem>
  );
}

/* Below: an exact port of `PromptbarShelf.stories.tsx`'s `DefaultTypeExample`
 * — same constants, same classes, same timings — not a redesign. That
 * story is the last-known-good reference for this row; see
 * `PromptbarSceneLinkConnectItemSpec`'s own doc comment for why this
 * couldn't just be composed from the generic row above. */
const CONNECTION_TRANSITION: Transition = { duration: 0.16, ease: EASE_OUT };

function ConnectionLabel({ connected, reducedMotion }: { connected: boolean; reducedMotion: boolean }) {
  const label = connected ? 'Connected to current scene' : 'Connect to current scene';
  return (
    <ListItemTitle className="relative block h-[length:var(--text-paragraph-small-regular-line-height)] w-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.span
          key={label}
          className="absolute inset-0 block truncate"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reducedMotion ? { duration: 0 } : CONNECTION_TRANSITION}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </ListItemTitle>
  );
}

function SceneLinkConnectItem({ spec }: { spec: PromptbarSceneLinkConnectItemSpec }) {
  const { connected, sceneTitle, onConnect, onDisconnect } = spec;
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <ListItem selected={connected} onClick={onConnect} className="cursor-pointer">
      <ListItemMedia>
        <LineDotRightHorizontal
          className={cn(
            'transition-colors duration-[160ms] ease-out',
            connected && 'text-[color:var(--tw-raw-success-500)]!'
          )}
        />
      </ListItemMedia>
      <ListItemContent>
        <ConnectionLabel connected={connected} reducedMotion={reducedMotion} />
        <div className="flex h-[length:var(--text-paragraph-mini-regular-line-height)] w-full min-w-0 items-center gap-[var(--spacing-sm)] overflow-hidden">
          <ListItemDescription className="min-w-0 shrink truncate">{truncateText(sceneTitle, 100)}</ListItemDescription>
          {connected ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDisconnect?.();
              }}
              className="flex shrink-0 items-center gap-[var(--spacing-3xs)] text-[length:var(--text-paragraph-mini-regular-font-size)] leading-[var(--text-paragraph-mini-regular-line-height)] text-primary hover:underline"
            >
              <Link2Off className="size-[length:var(--icon-sm)]" />
              Disconnect
            </button>
          ) : null}
        </div>
      </ListItemContent>
      <ListItemTrailing className="p-[length:var(--spacing-3xs)]">
        {connected ? <ListItemCheckmark className="size-[length:var(--icon-sm)]" /> : null}
      </ListItemTrailing>
    </ListItem>
  );
}

/**
 * Builds the shelf's expandable menu content as a flat array of top-level
 * nodes — deliberately a plain function returning an array, *not* a
 * wrapping `<ShelfMenu/>` component. `PromptbarShelf`'s own staggered
 * cascade animation drives its stagger/timing off `React.Children.toArray
 * (children)`, treating each top-level child (the caption, every row, and
 * the divider) as its own animated step. A custom component used as
 * `<SomeWrapper>{...}</SomeWrapper>` is opaque to that enumeration — React
 * can't see into a component's own render output from the outside — so
 * wrapping the whole menu (or bundling the divider+row together inside
 * one item component) collapses however many conceptual rows exist down
 * to however many *opaque wrapper elements* there are, breaking both the
 * per-row stagger and the header's own collapse-timing math
 * (`cascadeExitTotalMs`, which depends on the real count). Returning a
 * flat array here and splicing it directly as `PromptbarShelf`'s
 * `children` (`Promptbar.tsx` does `{expandable ? buildShelfMenuChildren
 * (...) : undefined}`, not `{expandable ? <ShelfMenu/> : undefined}`)
 * keeps every row — and the divider — participating in the exact same
 * cascade `PromptbarShelf.stories.tsx`'s own hand-written reference
 * examples already establish.
 *
 * Only ever rendered when `PromptbarShelfPresentation.expandable` is
 * true; `Promptbar.tsx` passes `undefined` (not `null`) otherwise, to
 * correctly toggle `PromptbarShelf`'s own `expandable = children !==
 * undefined` check.
 */
function buildShelfMenuChildren(caption: string | undefined, items: PromptbarMenuItemSpec[]): React.ReactNode[] {
  const children: React.ReactNode[] = [];

  if (caption) {
    children.push(<ShelfMenuCaption key="caption">{caption}</ShelfMenuCaption>);
  }

  for (const item of items) {
    if (item.kind === 'generic' && item.separatorBefore) {
      children.push(
        <div key={`${item.key}-separator`} className="w-full py-[length:var(--spacing-xs)]">
          <Separator />
        </div>
      );
    }
    children.push(
      item.kind === 'scene-link-connect' ? (
        <SceneLinkConnectItem key={item.key} spec={item} />
      ) : (
        <ShelfMenuItemRow key={item.key} spec={item} />
      )
    );
  }

  return children;
}

export { ShelfStatusRows, ShelfTrigger, buildShelfMenuChildren };
