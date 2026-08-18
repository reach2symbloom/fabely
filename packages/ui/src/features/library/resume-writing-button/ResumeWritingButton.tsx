/**
 * Resume Writing Button — Library continue/start CTA card.
 *
 * Figma set: Resume writing button (`16454:16821`). Axes are Type
 * (Jump back in / Start writing) × Hover. Hover never combines with a
 * distinct Active in this set — `forceHover` locks the hover paint for
 * Storybook.
 *
 * Placement: NO — Library product chrome. Stays in
 * `src/features/library/resume-writing-button/`.
 */
'use client';

import * as React from 'react';
import { ArrowRightIcon, MoveRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { iconButtonVariants } from '@/primitives/button';
import { buttonLinkVariants } from '@/primitives/button/link-button';
import { Separator } from '@/primitives/separator';

export type ResumeWritingButtonVariant = 'jump-back-in' | 'start-writing';

export type ResumeWritingButtonProps = {
  /** Jump back in (location + last-opened) vs. Start writing (no timestamp). */
  variant?: ResumeWritingButtonVariant;
  /** Storybook / playground — lock hover paint without a pointer. */
  forceHover?: boolean;
  /** Manuscript route. Renders the card as a link. */
  href?: string;
  title?: string;
  /** Scene/chapter lockup under the title. */
  locationLabel?: string;
  /** Jump-back-in only. Defaults to Figma "Last opened 2h ago". */
  timestampLabel?: string;
  /** Overrides the variant-derived Resume/Start writing label. */
  linkLabel?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
};

const BOOKMARK_RIBBON = new URL('./assets/bookmark-ribbon.png', import.meta.url)
  .href;

/** Press ripple — `--duration-normal` + `--ease-emphasized` (strong ease-out). */
const RIPPLE_DURATION_MS = 300;
const RIPPLE_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

type PressRippleSpec = { id: number; x: number; y: number };

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function PressRipple({
  id,
  x,
  y,
  onDone,
}: PressRippleSpec & { onDone: (id: number) => void }) {
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const animation = el.animate(
      [
        { transform: 'translate(-50%, -50%) scale(0.2)', opacity: 0.32 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 },
      ],
      { duration: RIPPLE_DURATION_MS, easing: RIPPLE_EASE, fill: 'forwards' },
    );
    animation.onfinish = () => onDone(id);
    return () => animation.cancel();
  }, [id, onDone]);

  return (
    <span
      ref={ref}
      aria-hidden
      data-slot="resume-writing-button-ripple"
      className="pointer-events-none absolute z-[2] size-[length:var(--tw-raw-spacing-20)] rounded-full bg-[color:var(--tw-raw-pantones-lavendar)]"
      style={{ left: x, top: y }}
    />
  );
}

const heading3 = [
  'font-[family-name:var(--text-heading-3-font-family)]',
  '[font-weight:var(--text-heading-3-font-weight)]',
  'text-[length:var(--text-heading-3-font-size)]',
  'leading-[var(--text-heading-3-line-height)]',
  'tracking-[var(--text-heading-3-letter-spacing)]',
].join(' ');

const paragraphSmallRegular = [
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-regular)]',
  'text-[length:var(--text-paragraph-small-regular-font-size)]',
  'leading-[var(--text-paragraph-small-regular-line-height)]',
  'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
].join(' ');

const paragraphMiniRegular = [
  'font-[family-name:var(--font-family-body)]',
  '[font-weight:var(--font-weight-paragraph-regular)]',
  'text-[length:var(--text-paragraph-mini-regular-font-size)]',
  'leading-[var(--text-paragraph-mini-regular-line-height)]',
  'tracking-[var(--text-paragraph-mini-regular-letter-spacing)]',
].join(' ');

function ResumeWritingButton({
  variant = 'jump-back-in',
  forceHover = false,
  href,
  title,
  locationLabel,
  timestampLabel = 'Last opened 2h ago',
  linkLabel,
  className,
  onClick,
}: ResumeWritingButtonProps) {
  const isJumpBackIn = variant === 'jump-back-in';
  const resolvedLinkLabel =
    linkLabel ?? (isJumpBackIn ? 'Resume writing' : 'Start writing');
  const resolvedTitle =
    title ?? (isJumpBackIn ? 'Fighting Fire with Fire' : 'Chapter 1');
  const resolvedLocation =
    locationLabel ??
    (isJumpBackIn ? 'The Eldergrove: Ch. 13 · Sc. 2' : 'Untitled Scene');

  const [ripples, setRipples] = React.useState<PressRippleSpec[]>([]);
  const rippleSeq = React.useRef(0);

  const dismissRipple = React.useCallback((id: number) => {
    setRipples((current) => current.filter((ripple) => ripple.id !== id));
  }, []);

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      if (event.button !== 0) return;
      if (prefersReducedMotion()) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const id = ++rippleSeq.current;
      setRipples((current) => [
        ...current,
        {
          id,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        },
      ]);
    },
    [],
  );

  const rootClassName = cn(
    'group group/resume-writing-button relative flex w-full max-w-[633px] items-center',
    'gap-[length:var(--spacing-xs)] rounded-[length:var(--rounded-xl)]',
    'overflow-hidden',
    'border-[length:var(--stroke-hairline)] border-solid',
    'border-[color:var(--theme-alpha-black-switch-10)]',
    'bg-[color:var(--theme-alpha-black-switch-5)]',
    'pl-[length:var(--spacing-7xl)] pr-[length:var(--spacing-xl)] py-[length:var(--spacing-md)]',
    'hover:border-[color:var(--theme-alpha-black-switch-20)]',
    'hover:bg-[color:color-mix(in_srgb,var(--tw-raw-white)_6%,transparent)]',
    'data-[force-hover=true]:border-[color:var(--theme-alpha-black-switch-20)]',
    'data-[force-hover=true]:bg-[color:color-mix(in_srgb,var(--tw-raw-white)_6%,transparent)]',
    'transition-[border-color,background-color,box-shadow] duration-[var(--duration-fast)] ease-emphasized',
    'text-left outline-none cursor-pointer',
    'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
    className,
  );

  const body = (
    <>
      <span
        aria-hidden
        data-slot="resume-writing-button-wash"
        className="pointer-events-none absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_top_left,var(--tw-raw-pantones-lavendar)_0%,transparent_60%)]"
      />

      {ripples.map((ripple) => (
        <PressRipple key={ripple.id} {...ripple} onDone={dismissRipple} />
      ))}

      <span
        aria-hidden
        data-slot="resume-writing-button-bookmark"
        className="pointer-events-none absolute top-[-2.5px] left-[23.5px] z-[1] h-[98px] w-[length:var(--tw-raw-spacing-11)]"
      >
        <img
          alt=""
          src={BOOKMARK_RIBBON}
          width={44}
          height={98}
          className="relative z-[1] size-full object-contain"
        />
      </span>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col items-start gap-[length:var(--spacing-xs)]">
        <span
          aria-hidden
          className={cn(
            buttonLinkVariants({ variant: 'secondary', size: 'default' }),
            'pointer-events-none',
            'group-hover/resume-writing-button:underline',
            'group-data-[force-hover=true]/resume-writing-button:underline',
          )}
        >
          {resolvedLinkLabel}
          <MoveRightIcon />
        </span>

        <div className="flex w-full flex-col items-start gap-[length:var(--spacing-xs)]">
          <p
            className={cn(
              heading3,
              'w-full text-[color:var(--text)]',
              'group-hover/resume-writing-button:text-[color:var(--foreground)]',
              'group-data-[force-hover=true]/resume-writing-button:text-[color:var(--foreground)]',
            )}
          >
            {resolvedTitle}
          </p>
          <p
            className={cn(
              paragraphSmallRegular,
              'w-full text-[color:var(--muted-foreground)]',
              'group-hover/resume-writing-button:text-[color:var(--text)]',
              'group-data-[force-hover=true]/resume-writing-button:text-[color:var(--text)]',
            )}
          >
            {resolvedLocation}
          </p>
        </div>

        {isJumpBackIn ? (
          <>
            <Separator
              orientation="horizontal"
              size="thin"
              spacing="regular"
              className="w-full [&_[data-slot=separator-line]]:bg-[image:linear-gradient(to_right,var(--theme-alpha-white-no-switch-5),transparent)] [&_[data-slot=separator-line]]:bg-transparent"
            />
            <p
              className={cn(
                paragraphMiniRegular,
                'w-full italic text-[color:var(--muted-foreground)]',
              )}
            >
              {timestampLabel}
            </p>
          </>
        ) : null}
      </div>

      <span
        aria-hidden
        data-slot="resume-writing-button-go"
        className={cn(
          iconButtonVariants({
            variant: 'glow',
            size: 'lg',
            roundness: 'round',
          }),
          'relative z-10 pointer-events-none',
          'size-[length:var(--tw-raw-spacing-14)]',
        )}
      >
        <ArrowRightIcon
          className={cn(
            'transition-transform duration-fast ease-emphasized',
            'group-hover:scale-110 group-data-[force-hover=true]:scale-110',
            'motion-reduce:transition-none',
          )}
        />
      </span>
    </>
  );

  if (href != null) {
    return (
      <a
        href={href}
        data-slot="resume-writing-button"
        data-variant={variant}
        data-force-hover={forceHover || undefined}
        className={rootClassName}
        aria-label={`${resolvedLinkLabel}: ${resolvedTitle}`}
        onPointerDown={handlePointerDown}
        onClick={onClick}
      >
        {body}
      </a>
    );
  }

  return (
    <button
      type="button"
      data-slot="resume-writing-button"
      data-variant={variant}
      data-force-hover={forceHover || undefined}
      className={rootClassName}
      aria-label={`${resolvedLinkLabel}: ${resolvedTitle}`}
      onPointerDown={handlePointerDown}
      onClick={onClick}
    >
      {body}
    </button>
  );
}

export { ResumeWritingButton };
