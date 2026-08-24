/**
 * PromptbarShelf — Figma "Promptbar shelf" (16199:2558). 3 "Type" examples
 * (Default / Fia / Fia workflows) reproduced as Storybook configurations of
 * one shell, matching how `StatusBadge` treats Figma's own variant axes —
 * see this component's own doc comment for why.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Transition } from 'motion/react';
import {
  BookOpen,
  Feather,
  GitCompare,
  GitPullRequestCreate,
  Globe,
  Link2Off,
  SearchCheck,
  Share2,
  Waypoints,
  Workflow,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { EASE_OUT } from '@/lib/motion';
import { LineDotRightHorizontal } from '@/foundations/icons';
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
import { StatusBadge, truncateText } from '../../../atoms/status-badge';
import { Status } from '../../../atoms/status';
import { InlineSegmentedControl } from '../../../../stories/InlineSegmentedControl';
import { PlaygroundPanel } from '../../../../stories/PlaygroundPanel';
import { PRIMITIVE_PLAYGROUND_CONTROL_GRID, PrimitivePage } from '../../../../stories/PrimitivePage';

import { PromptbarShelf } from './PromptbarShelf';

const meta = {
  title: 'Design System/Features/Promptbar/Shelf',
  component: PromptbarShelf,
  tags: ['ai-generated'],
  parameters: { layout: 'centered' },
  /* Figma's source frame is dark-only chrome, same as AI Mode Toggle —
   * --neutrals-new-* only resolves to the intended dark values under the
   * real .dark toggle, not a local wrapper. */
  globals: { theme: 'dark' },
  args: { statusContent: 'Status' },
} satisfies Meta<typeof PromptbarShelf>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fixed-width canvas matching Figma's own 447px shelf frame. */
function ShelfCanvas({ children }: { children: React.ReactNode }) {
  return <div className="w-[447px]">{children}</div>;
}

/** A small caption row above a `ListItem` group — Figma's "Select Menu
 * Group Label" (also used by Combobox/Select's own optgroup headers). No
 * `min-h-8`: it centers text inside a fixed 32px-tall area regardless of
 * how close its own top edge sits to the chip row above — reading as
 * leftover top padding even with an explicit `pt-xs` set, since the
 * min-height would dominate and swallow it. Sized to content instead, so
 * `pt-xs` (8px) reliably reads as exactly that much breathing room above
 * the caption text, not an arbitrary offset inside a taller box. */
function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full items-center gap-[var(--spacing-xs)] px-[var(--spacing-xs)] pt-[var(--spacing-xs)] pb-[length:var(--spacing-1-375)]">
      <p className="text-[length:10px] leading-[14px] tracking-[1px] text-[color:var(--muted-foreground)] uppercase">
        {children}
      </p>
    </div>
  );
}

/* One coordinated transition, not two independent snaps: the menu item
 * (icon color, label crossfade, trailing checkmark — the checkmark's own
 * draw-in/fade-out enter/exit lives in `ListItemTrailing` /
 * `ListItemCheckmark` at the primitive level, reused here) resolves
 * first; the top badge starts its own crossfade shortly after, so the
 * shelf status visibly "catches up" to the row instead of both changing
 * in lockstep. Plain ease-out — no spring, no bounce. */
const CONNECTION_TRANSITION: Transition = { duration: 0.16, ease: EASE_OUT };

/**
 * Badge transition — the badge's own container (gap, padding, width,
 * height, position) is never *animated*: exactly one `StatusBadge` stays
 * mounted across both states (see `DefaultTypeExample`'s `statusContent`),
 * and only the three slots that actually differ between disconnected/
 * connected (icon, secondary text, trailing status atom) crossfade
 * internally, each via `ConnectionIconCrossfade` / `ConnectionTextCrossfade`
 * / `ConnectionAtomCrossfade` below. `leadingIcon` (Globe) and the primary
 * text ("All notes") never change, so they stay plain/unanimated. Where
 * the two states need different intrinsic widths (the text, and the
 * atom's own presence/absence), incoming content always mounts at its own
 * final size on the very first frame — invisible at `opacity: 0` — so
 * whatever reflow that causes happens silently before anything is visible
 * to reflow; only opacity (and, on the forward cascade specifically, a
 * subtle scale/blur "bloom" — see `bloomInitial`/`bloomAnimate`) is ever
 * actually tweened. That's different from an earlier version of this that
 * used Motion's `layout` prop to FLIP-animate the text's width — which
 * *did* visibly tween width, reading as the chip "morphing," exactly what
 * that refinement removed.
 *
 * Choreography is asymmetric by design (`badgeEnterTransition` /
 * `badgeExitTransition`):
 * - Disconnected → connected ("forward," more deliberate): disconnected
 *   icon+text fade out together (`BADGE_FORWARD_EXIT_S`), then connected
 *   icon → text → atom bloom in left-to-right (opacity + subtle scale +
 *   blur-to-crisp, `bloomInitial`/`bloomAnimate`), `BADGE_FORWARD_STAGGER_S`
 *   apart, each over `BADGE_FORWARD_ENTER_S` — the atom last, as the
 *   transition's "it worked" punctuation. Total ≈ 470ms.
 * - Connected → disconnected ("reverse," quick/utilitarian): connected
 *   icon+text+atom fade out together (`BADGE_REVERSE_EXIT_S`) — not the
 *   forward cascade played backward, and never the bloom treatment — then
 *   disconnected icon+text plain-fade back in together
 *   (`BADGE_REVERSE_ENTER_S`), no stagger. Total ≈ 260ms.
 */
const BADGE_FORWARD_EXIT_S = 0.11;
const BADGE_FORWARD_ENTER_S = 0.2;
const BADGE_FORWARD_STAGGER_S = 0.08;
const BADGE_REVERSE_EXIT_S = 0.12;
const BADGE_REVERSE_ENTER_S = 0.14;

/** The forward cascade's incoming elements "bloom" in — opacity, a very
 * subtle scale-up, and a tiny blur-to-crisp — rather than just fading;
 * reverse-direction and disconnected-group content stays plain opacity
 * only (see `plainInitial`/`plainAnimate` below), so the bloom reads as
 * specifically "confirming a successful connection," not a generic
 * transition mannerism applied everywhere. */
const BADGE_BLOOM_SCALE_FROM = 0.92;
const BADGE_BLOOM_BLUR_FROM = 'blur(2px)';
const BADGE_BLOOM_BLUR_TO = 'blur(0px)';

type BadgeGroup = 'disconnected' | 'connected';
type BadgeRole = 'icon' | 'text' | 'atom';

/** `group` is which semantic state this element belongs to, not which
 * direction is currently playing — a `'connected'` element only ever
 * *enters* during the forward transition and only ever *exits* during the
 * reverse one (and vice versa for `'disconnected'`), so each function only
 * needs to know its own group/role, never the live `connected` boolean. */
function badgeEnterTransition(group: BadgeGroup, role: BadgeRole, reducedMotion: boolean): Transition {
  if (reducedMotion) return { duration: 0 };
  if (group === 'connected') {
    const roleOffset = role === 'icon' ? 0 : role === 'text' ? BADGE_FORWARD_STAGGER_S : BADGE_FORWARD_STAGGER_S * 2;
    return { duration: BADGE_FORWARD_ENTER_S, ease: EASE_OUT, delay: BADGE_FORWARD_EXIT_S + roleOffset };
  }
  // Disconnected content re-enters together on the reverse transition — no role stagger.
  return { duration: BADGE_REVERSE_ENTER_S, ease: EASE_OUT, delay: BADGE_REVERSE_EXIT_S };
}

function badgeExitTransition(group: BadgeGroup, reducedMotion: boolean): Transition {
  if (reducedMotion) return { duration: 0 };
  return group === 'connected'
    ? { duration: BADGE_REVERSE_EXIT_S, ease: EASE_OUT }
    : { duration: BADGE_FORWARD_EXIT_S, ease: EASE_OUT };
}

/** Bloom entrance (opacity + subtle scale + blur-to-crisp) — only ever
 * used for a `'connected'`-group element's `initial`/`animate`, i.e. the
 * forward cascade. Never applied to `exit`: reversing mid-bloom would
 * read as the connection visibly "un-resolving," not a quick utilitarian
 * fade, which is what `Connected → Disconnected` calls for instead. */
function bloomInitial(reducedMotion: boolean) {
  return reducedMotion ? false : { opacity: 0, scale: BADGE_BLOOM_SCALE_FROM, filter: BADGE_BLOOM_BLUR_FROM };
}
function bloomAnimate(transition: Transition) {
  return { opacity: 1, scale: 1, filter: BADGE_BLOOM_BLUR_TO, transition };
}

/** Plain opacity-only entrance — the disconnected group's own re-entry on
 * the reverse transition, and (via `exit`) how every element leaves
 * regardless of direction. No scale/blur ever, so reverse never bounces
 * off residual bloom values from a prior forward transition. */
function plainInitial(reducedMotion: boolean) {
  return reducedMotion ? false : { opacity: 0 };
}
function plainAnimate(transition: Transition) {
  return { opacity: 1, transition };
}
function plainExit(transition: Transition) {
  return { opacity: 0, transition };
}

/* Badge's own icon-sizing rule (`[&>svg]:size-[length:var(--tw-raw-
 * spacing-3)]`, 12px) only matches an `<svg>` that's a *direct* child of
 * the badge root — wrapping icons in the extra spans this crossfade needs
 * takes them out of that selector's reach entirely, so without this they
 * fall back to Lucide's much larger intrinsic size. Applied explicitly on
 * both icons below rather than relying on inheritance. */
const CONNECTION_ICON_SIZE_CLASS = 'size-[length:var(--tw-raw-spacing-3)] text-current';

/** Same `AnimatePresence mode="popLayout"` crossfade shape as the text and
 * atom slots below — only one icon mounted at a time, so the connected
 * icon's forward-entrance can bloom while the disconnected icon's
 * reverse-entrance (and both icons' exits) stay a plain fade, without the
 * two directions fighting over one always-mounted element's animate
 * target (an earlier version of this kept both icons permanently mounted
 * and just toggled opacity, which couldn't cleanly support "bloom on the
 * way in, plain fade on the way out" for the same element). Icons are the
 * same footprint either way, so there's no width-stability concern here. */
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

/** "Not connected to scene" and a scene title are different lengths — the
 * `relative` wrapper plus `AnimatePresence mode="popLayout"` (no `layout`
 * prop anywhere) is what keeps this an opacity/bloom-only crossfade
 * instead of a width tween: the outgoing string is taken out of flow
 * (`position: absolute`, positioned against this `relative` parent) the
 * instant its exit starts, so it overlays the incoming string rather than
 * fighting it for space; the incoming string mounts in normal flow at its
 * own natural size immediately, at `opacity: 0` — the container silently
 * snaps to the new width on that same first frame, before anything is
 * visible, and only opacity (plus the connected string's own subtle
 * scale/blur bloom) animates from there. Deliberately not the slot's
 * usual `max-w-[100px]` truncation (see `secondaryText`'s own doc
 * comment) — `secondaryTextClassName` on the `StatusBadge` below clears
 * it. */
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

/** Only mounted while connected — reserving this slot permanently (an
 * earlier version of this) left a dead gap after "Not connected to scene"
 * with nothing to fill it. Mounting fresh at `opacity: 0` has the same
 * "silent first-frame snap" property as the text crossfade above: the
 * badge gains the atom's width instantly, invisibly, before the bloom-in
 * has drawn anything. `Status`'s own pulse loop starts naturally on
 * mount, which already reads as "beginning once resolved" without this
 * needing its own delay logic for that. Always the bloom treatment (never
 * plain) — the atom only ever appears via the forward cascade, never the
 * reverse one, so there's no "which direction" branch to make here. */
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

/** Crossfades the row's own title between its unconnected/connected
 * copy — absolutely positioned inside a height-locked relative box (the
 * title's own line-height token) so the outgoing/incoming text overlap
 * instead of stacking, and the row never grows a second line's worth of
 * height mid-transition. */
function ConnectionLabel({ connected, reducedMotion }: { connected: boolean; reducedMotion: boolean }) {
  const label = connected ? 'Connected to current scene' : 'Connect to current scene';
  return (
    <ListItemTitle
      /* `w-full` is load-bearing, not decorative — `ListItemContent` is a
       * column flex with `items-start`, which shrink-wraps each child to
       * its own in-flow content width. Once the label text below becomes
       * `absolute` (for the crossfade), it stops contributing to that
       * sizing, so without an explicit width this element collapses to
       * 0px and the `inset-0` children collapse right along with it —
       * present but invisible, clipped by `overflow-hidden` at zero
       * width. */
      className="relative block h-[length:var(--text-paragraph-small-regular-line-height)] w-full overflow-hidden"
    >
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

/**
 * The header badge and the "which scene" menu must agree on connection
 * state — showing a "Not connected" badge alongside an already-checked
 * "Connected to current scene" option was a real inconsistency this atom
 * shouldn't demonstrate. `connected` drives both: the badge (Not
 * connected vs. connected-with-a-pulsing `Status` glyph) and the first
 * option's title/icon/checkmark ("Connect" when unchecked, "Connected"
 * once picked). Purely a Storybook demonstration — `PromptbarShelf` has
 * no connection-state concept of its own (`statusContent`/`children` are
 * plain slots); a real Promptbar consumer would own this the same way.
 */
function DefaultTypeExample() {
  const [connected, setConnected] = useState(false);
  /* The scene title lives behind its own hook, not a literal repeated at
   * every call site — the header badge and the "Connect/Connected to
   * current scene" menu item must agree on which scene is current, the
   * same reasoning as `connected` above. */
  const [sceneTitle] = useState('The Eldergrove');
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <ShelfCanvas>
      <PromptbarShelf
        statusContent={
          /* Exactly one `StatusBadge` — never swapped/unmounted between
           * states — so its own container (padding, gap, height,
           * position) is never at risk of resizing or reflowing. Only the
           * three slots that actually change (icon, secondary text,
           * trailing atom) crossfade internally; see each crossfade
           * component's own doc comment above. */
          <StatusBadge
            leadingIcon={<Globe />}
            middleIcon={<ConnectionIconCrossfade connected={connected} reducedMotion={reducedMotion} />}
            secondaryText={
              <ConnectionTextCrossfade connected={connected} sceneTitle={sceneTitle} reducedMotion={reducedMotion} />
            }
            secondaryTextClassName="max-w-none overflow-visible whitespace-nowrap"
            trailing={<ConnectionAtomCrossfade connected={connected} reducedMotion={reducedMotion} />}
          >
            All notes
          </StatusBadge>
        }
      >
        <GroupLabel>Change scene link</GroupLabel>
        <ListItem selected={connected} onClick={() => setConnected(true)} className="cursor-pointer">
          <ListItemMedia>
            {/* Only this row's icon breaks from ListItem's default icon
             * color (`text-primary`) once connected — success-500 signals
             * this is the scene now on record as connected. `!` needed:
             * that ambient rule's descendant selector otherwise outweighs
             * a plain class on the svg itself. `transition-colors` (not
             * left to snap) is what makes this read as the icon *resolving*
             * into its connected color, matching the label crossfade and
             * trailing check happening alongside it. */}
            <LineDotRightHorizontal
              className={cn(
                'transition-colors duration-[160ms] ease-out',
                connected && 'text-[color:var(--tw-raw-success-500)]!'
              )}
            />
          </ListItemMedia>
          <ListItemContent>
            <ConnectionLabel connected={connected} reducedMotion={reducedMotion} />
            {/* `h-[...line-height] overflow-hidden` pins this row to
             * exactly the description's own line box — without it, the
             * row's height is the max of its children's intrinsic
             * heights, and the "Disconnect" button's text (no explicit
             * `leading-*` of its own) picks up the browser's default line
             * height rather than the description's 16px, which is taller
             * and was expanding the whole row (and so the whole
             * `ListItem`) the moment it appeared. */}
            <div className="flex h-[length:var(--text-paragraph-mini-regular-line-height)] w-full min-w-0 items-center gap-[var(--spacing-sm)] overflow-hidden">
              <ListItemDescription className="min-w-0 shrink truncate">
                {truncateText(sceneTitle, 100)}
              </ListItemDescription>
              {connected ? (
                <button
                  type="button"
                  /* Stops this bubbling up to the row's own `onClick`
                   * (`setConnected(true)`) — without this, disconnecting
                   * here would immediately reconnect via the parent's
                   * handler. */
                  onClick={(event) => {
                    event.stopPropagation();
                    setConnected(false);
                  }}
                  className="flex shrink-0 items-center gap-[var(--spacing-3xs)] text-[length:var(--text-paragraph-mini-regular-font-size)] leading-[var(--text-paragraph-mini-regular-line-height)] text-primary hover:underline"
                >
                  <Link2Off className="size-[length:var(--icon-sm)]" />
                  Disconnect
                </button>
              ) : null}
            </div>
          </ListItemContent>
          {/* Always rendered — `ListItemTrailing` reserves its own fixed-
           * size slot regardless of whether the checkmark is currently
           * mounted, so the row's width/alignment never shifts when it
           * enters or exits (that enter/exit animation itself lives inside
           * the primitive, not here). */}
          <ListItemTrailing className="p-[length:var(--spacing-3xs)]">
            {connected ? <ListItemCheckmark className="size-[length:var(--icon-sm)]" /> : null}
          </ListItemTrailing>
        </ListItem>
        <ListItem>
          <ListItemMedia>
            <SearchCheck />
          </ListItemMedia>
          <ListItemContent>
            <ListItemTitle>Link to another scene</ListItemTitle>
            <ListItemDescription>Bookmarks will be moved to the new scene</ListItemDescription>
          </ListItemContent>
        </ListItem>
        <ListItem>
          <ListItemMedia>
            <GitPullRequestCreate />
          </ListItemMedia>
          <ListItemContent>
            <ListItemTitle>Create scene from this search</ListItemTitle>
            <ListItemDescription>Turn these results into a new scene</ListItemDescription>
          </ListItemContent>
        </ListItem>
        {/* Only meaningful once there's something to disconnect — showing
         * this while already disconnected offered an action with nothing
         * behind it. */}
        {connected ? (
          <>
            <div className="w-full py-[length:var(--spacing-xs)]">
              <Separator />
            </div>
            <ListItem onClick={() => setConnected(false)} className="cursor-pointer">
              <ListItemMedia>
                <Link2Off />
              </ListItemMedia>
              <ListItemContent>
                <ListItemTitle>Disconnect search from current scene</ListItemTitle>
                <ListItemDescription>Bookmarks will be saved to the search history</ListItemDescription>
              </ListItemContent>
            </ListItem>
          </>
        ) : null}
      </PromptbarShelf>
    </ShelfCanvas>
  );
}

function FiaTypeExample() {
  return (
    <ShelfCanvas>
      <PromptbarShelf
        statusContent={
          <div className="flex items-start gap-[var(--spacing-xs)]">
            <StatusBadge
              size="default"
              leadingIcon={<BookOpen />}
              middleIcon="·"
              secondaryText="“She’s a Lumith...”"
              onDismiss={() => {}}
              dismissLabel="Remove Ch. 1, Sc. 1 reference"
            >
              Ch. 1, Sc. 1
            </StatusBadge>
            <StatusBadge size="default">+ 2</StatusBadge>
          </div>
        }
      />
    </ShelfCanvas>
  );
}

type WorkflowId = 'related-themes' | 'topic-map' | 'develop-scene';

/** Icon/label for each workflow's resulting chip — reuses the exact icon
 * choices `StatusBadge`'s own "Workflow · X" reference examples already
 * established, so the chip that appears here matches the one already
 * documented there. */
const WORKFLOW_CHIP: Record<WorkflowId, { icon: ReactNode; label: string }> = {
  'related-themes': { icon: <GitCompare />, label: 'Workflow: Related themes' },
  'topic-map': { icon: <Share2 className="-rotate-90" />, label: 'Workflow: Topic map' },
  'develop-scene': { icon: <Waypoints />, label: 'Workflow: Develop scene' },
};

/**
 * Picking a suggested workflow collapses the shelf and replaces the
 * "3 workflows" count badge (`trigger`) with a dismissible chip for the
 * one just picked — `open` is lifted into this story specifically so
 * selecting a workflow can programmatically collapse the shelf, the same
 * way a real Promptbar consumer would react to a workflow being run.
 * Purely local story state; `PromptbarShelf` has no workflow concept of
 * its own.
 */
function FiaWorkflowsTypeExample() {
  const [open, setOpen] = useState(false);
  const [workflow, setWorkflow] = useState<WorkflowId | null>(null);

  function pickWorkflow(id: WorkflowId) {
    setWorkflow(id);
    setOpen(false);
  }

  return (
    <ShelfCanvas>
      <PromptbarShelf
        open={open}
        onOpenChange={setOpen}
        statusContent={
          <StatusBadge
            size="default"
            leadingIcon={<BookOpen />}
            middleIcon="·"
            secondaryText="¶ 1, 2*"
            onDismiss={() => {}}
            dismissLabel="Remove chapter reference"
          >
            Ch. 1 · Sc. 1
          </StatusBadge>
        }
        trigger={
          workflow ? (
            <StatusBadge
              size="default"
              tone="fia"
              leadingIcon={WORKFLOW_CHIP[workflow].icon}
              onDismiss={() => setWorkflow(null)}
              dismissLabel={`Remove ${WORKFLOW_CHIP[workflow].label}`}
            >
              {WORKFLOW_CHIP[workflow].label}
            </StatusBadge>
          ) : (
            <StatusBadge size="default" tone="fia" leadingIcon={<Feather className="-rotate-90" />}>
              3 workflows
            </StatusBadge>
          )
        }
      >
        <GroupLabel>Suggested workflows</GroupLabel>
        {/* `selected` + a trailing check on whichever workflow is currently
         * picked — collapsing the shelf doesn't clear `workflow` (only
         * `pickWorkflow` does, via the chip's own dismiss), so reopening
         * must show the same row still checked, not reset to "nothing
         * selected." `ListItemTrailing` is always rendered (reserving its
         * slot) with `ListItemCheckmark` passed conditionally — same
         * reusable enter/exit + draw-in treatment as the Default type's
         * own connect/connected row, not a one-off here. */}
        <ListItem
          selected={workflow === 'related-themes'}
          onClick={() => pickWorkflow('related-themes')}
          className="cursor-pointer"
        >
          <ListItemMedia>
            <Workflow />
          </ListItemMedia>
          <ListItemContent>
            <ListItemTitle>What else goes with this chapter?</ListItemTitle>
            <ListItemDescription>Bundle useful notes into themes for this chapter</ListItemDescription>
          </ListItemContent>
          <ListItemTrailing className="p-[length:var(--spacing-3xs)]">
            {workflow === 'related-themes' ? <ListItemCheckmark className="size-[length:var(--icon-sm)]" /> : null}
          </ListItemTrailing>
        </ListItem>
        <ListItem
          selected={workflow === 'topic-map'}
          onClick={() => pickWorkflow('topic-map')}
          className="cursor-pointer"
        >
          <ListItemMedia>
            {/* "threads" glyph — no Lucide equivalent, same substitution as
             * StatusBadge's own Workflow: Topic map example. */}
            <Share2 />
          </ListItemMedia>
          <ListItemContent>
            <ListItemTitle>Generate a topic map related to…</ListItemTitle>
            <ListItemDescription>Find high level topics and dive into related notes</ListItemDescription>
          </ListItemContent>
          <ListItemTrailing className="p-[length:var(--spacing-3xs)]">
            {workflow === 'topic-map' ? <ListItemCheckmark className="size-[length:var(--icon-sm)]" /> : null}
          </ListItemTrailing>
        </ListItem>
        <ListItem
          selected={workflow === 'develop-scene'}
          onClick={() => pickWorkflow('develop-scene')}
          className="cursor-pointer"
        >
          <ListItemMedia>
            <Waypoints />
          </ListItemMedia>
          <ListItemContent>
            <ListItemTitle>Develop this scene</ListItemTitle>
            <ListItemDescription>Suggest what could happen next using the attached scene context</ListItemDescription>
          </ListItemContent>
          <ListItemTrailing className="p-[length:var(--spacing-3xs)]">
            {workflow === 'develop-scene' ? <ListItemCheckmark className="size-[length:var(--icon-sm)]" /> : null}
          </ListItemTrailing>
        </ListItem>
      </PromptbarShelf>
    </ShelfCanvas>
  );
}

type ShelfType = 'default' | 'fia' | 'fia-workflows';

const SHELF_TYPE_OPTIONS: { value: ShelfType; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'fia', label: 'Fia' },
  { value: 'fia-workflows', label: 'Fia workflows' },
];

/** Switches the playground's live preview between the 3 Type
 * configurations — not a real `PromptbarShelf` prop (there isn't one;
 * see the component's own doc comment for why), purely a Storybook
 * control for trying each configuration without scrolling to the
 * variants gallery below. */
function PromptbarShelfPlayground() {
  const [type, setType] = useState<ShelfType>('default');

  return (
    <PlaygroundPanel
      preview={
        type === 'default' ? (
          <DefaultTypeExample />
        ) : type === 'fia' ? (
          <FiaTypeExample />
        ) : (
          <FiaWorkflowsTypeExample />
        )
      }
      controls={
        <div className={PRIMITIVE_PLAYGROUND_CONTROL_GRID}>
          <InlineSegmentedControl
            label="Type"
            value={type}
            onChange={(v) => setType(v as ShelfType)}
            options={SHELF_TYPE_OPTIONS}
            fullWidth
            className="col-span-2"
          />
        </div>
      }
    />
  );
}

export const Overview: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <PrimitivePage
      title="Promptbar Shelf"
      description="The elevated card docked to the top of the Promptbar — a status summary (built from StatusBadge/Status) plus an optional click-to-expand ListItem menu. Figma Promptbar shelf (16199:2558). The Promptbar organism itself doesn't exist yet; this only prepares the shelf to dock into it later."
      playground={<PromptbarShelfPlayground />}
      variants={
        <div className="flex flex-col gap-[var(--spacing-lg)]">
          <div>
            <p className="mb-2 text-sm font-medium">Default — expandable scene-link menu</p>
            <DefaultTypeExample />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Fia — static context row (not expandable)</p>
            <FiaTypeExample />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Fia workflows — expandable workflow suggestions</p>
            <FiaWorkflowsTypeExample />
          </div>
        </div>
      }
      usageGuidance={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            <code>children</code> (the expanded content) is what decides
            whether the shelf expands at all — omit it entirely for a
            static, non-interactive shelf (Figma&apos;s plain Fia type).
            When given, compose a group-label caption,{' '}
            <code>ListItem</code>s, and an optional <code>Separator</code>{' '}
            + footer <code>ListItem</code>s exactly as shown here. The
            shelf itself renders none of that content.
          </li>
          <li>
            <code>trigger</code> is optional content beside the chevron
            (Fia workflows&apos; own count <code>StatusBadge</code>) — not
            required for a shelf to expand. Default type expands with a
            bare chevron and no trigger content at all; deliberately no
            text label there (a &quot;Change&quot; label would wrongly
            imply the chevron edits something rather than expands the
            shelf).
          </li>
          <li>
            Uncontrolled by default (<code>defaultOpen</code>); pass{' '}
            <code>open</code>/<code>onOpenChange</code> to control expansion
            from outside once this docks into the real Promptbar organism.
          </li>
        </ul>
      }
      accessibility={
        <ul className="list-disc space-y-2 ps-5 text-sm text-muted-foreground">
          <li>
            The expandable header is a real, keyboard-operable button (via
            the <code>Collapsible</code> primitive) — not a styled{' '}
            <code>div</code> with a click handler.
          </li>
          <li>
            The connected-state checkmark is a decorative,{' '}
            <code>ListItemTrailing</code>-slotted icon — the row&apos;s own
            text (&quot;Connected to current scene&quot;) already states
            the meaning.
          </li>
        </ul>
      }
    />
  ),
};

export const Default: Story = { render: () => <DefaultTypeExample /> };
export const Fia: Story = { render: () => <FiaTypeExample /> };
export const FiaWorkflows: Story = { render: () => <FiaWorkflowsTypeExample /> };
