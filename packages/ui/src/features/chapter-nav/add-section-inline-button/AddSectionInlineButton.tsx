/**
 * Add Section Inline Button — insert row with glow / diamond dividers.
 *
 * Figma: Add section inline button (`16373:4624`) Chapter / Scene / Act
 * variants. The Default pill is the Add Section Button atom — never shown
 * alone here.
 *
 * Placement: feature. Stays in `src/features/chapter-nav/`.
 */

'use client';

import * as React from 'react';
import { PlusIcon, SeparatorHorizontalIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { AddSectionButton } from '@/atoms/add-section-button';
import { Input } from '@/primitives/input';

export type AddSectionInlineType =
  | 'chapter'
  | 'scene'
  | 'actUntitled'
  | 'actNoOnly'
  | 'actTitled';

/**
 * How a Chapter / Act / Scene pill fires. Prefer a real `href` for navigation
 * (including placeholder `#`), `onClick` for app handlers, or `formAction` /
 * `formMethod` for form / webhook posts.
 */
export type AddSectionAction = {
  /** Renders the pill as `<a href>`. Use `#` / route / webhook URL. */
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  /** Native form submit → server action / webhook endpoint. */
  formAction?: string;
  formMethod?: string;
  form?: string;
  type?: 'button' | 'submit' | 'reset';
};

export type AddSectionInlineButtonProps = {
  /** Figma Type axis (insert + Act split-parse). Default pill is the atom. */
  type?: AddSectionInlineType;
  /**
   * 1-based position in the act sequence. Drives the roman numeral for all
   * Act variants (I, II, III, …). Not editable — sequence-owned.
   */
  actIndex?: number;
  /** Act title field value when type is untitled / titled. */
  actTitle?: string;
  placeholder?: string;
  className?: string;
  /** Wire the Chapter pill (Chapter type row). */
  addChapter?: AddSectionAction;
  /** Wire the Act pill (Chapter type row). */
  addAct?: AddSectionAction;
  /** Wire the Scene pill (Scene type row). */
  addScene?: AddSectionAction;
  /**
   * Shorthand click handlers — merged after `add*.onClick`. Prefer `addChapter`
   * / `addAct` / `addScene` when you also need `href` or form attributes.
   */
  onAddChapter?: () => void;
  onAddAct?: () => void;
  onAddScene?: () => void;
  onActTitleChange?: (value: string) => void;
};

const dividerLabelType = [
  'font-[family-name:var(--text-paragraph-mini-medium-font-family)]',
  '[font-weight:var(--text-paragraph-mini-medium-font-weight)]',
  'text-[length:var(--text-paragraph-mini-medium-font-size)]',
  'leading-[var(--text-paragraph-mini-medium-line-height)]',
  'tracking-[var(--text-paragraph-mini-medium-letter-spacing)]',
].join(' ');

const actSerifType = [
  'font-[family-name:var(--text-paragraph-serif-regular-font-family)]',
  '[font-weight:var(--text-paragraph-serif-regular-font-weight)]',
  'text-[length:var(--text-paragraph-serif-regular-font-size)]',
  'leading-[var(--text-paragraph-serif-regular-line-height)]',
  'tracking-[var(--text-paragraph-serif-regular-letter-spacing)]',
].join(' ');

/** Secondary-200 fade — matches Figma linearGradient stops on insert rails. */
const SECONDARY_GLOW_LINE =
  'linear-gradient(90deg, color-mix(in srgb, var(--tw-raw-secondary-200) 0%, transparent) 0%, var(--tw-raw-secondary-200) 18.931%, var(--tw-raw-secondary-200) 85%, color-mix(in srgb, var(--tw-raw-secondary-200) 0%, transparent) 100%)';

function SecondaryGlowRail({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative flex min-h-0 min-w-0 flex-1 flex-col justify-center self-stretch py-[var(--spacing-xs)]',
        className,
      )}
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[length:var(--stroke-regular)] -translate-y-1/2 blur-[length:var(--spacing-3xs)]"
        style={{ background: SECONDARY_GLOW_LINE }}
      />
      <span
        className="h-[length:var(--stroke-thin)] w-full"
        style={{ background: SECONDARY_GLOW_LINE }}
      />
    </div>
  );
}

function ActDiamondRail() {
  return (
    <div
      aria-hidden
      className="flex min-w-0 flex-1 items-center self-stretch text-[color:var(--theme-alpha-black-switch-5)]"
    >
      <span className="size-[length:var(--spacing-1-5)] shrink-0 rotate-45 bg-current" />
      <span className="h-[length:var(--stroke-thin)] min-w-0 flex-1 bg-current" />
      <span className="size-[length:var(--spacing-1-5)] shrink-0 rotate-45 bg-current" />
    </div>
  );
}

/** 1-based act sequence → uppercase roman (I … MMMCMXCIX). */
function toRomanNumeral(index: number): string {
  const n = Math.floor(index);
  if (!Number.isFinite(n) || n < 1) return 'I';
  const table: Array<[number, string]> = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let remaining = Math.min(n, 3999);
  let out = '';
  for (const [value, glyph] of table) {
    while (remaining >= value) {
      out += glyph;
      remaining -= value;
    }
  }
  return out;
}

function SectionAddPill({
  action,
  onAdd,
  ariaLabel,
  children,
}: {
  action?: AddSectionAction;
  onAdd?: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  const handleClick: React.MouseEventHandler<
    HTMLAnchorElement | HTMLButtonElement
  > = (event) => {
    action?.onClick?.(event);
    if (!event.defaultPrevented) onAdd?.();
  };

  if (action?.href != null) {
    return (
      <AddSectionButton
        aria-label={ariaLabel}
        href={action.href}
        onClick={handleClick}
        target={action.target}
        rel={action.rel}
      >
        {children}
      </AddSectionButton>
    );
  }

  return (
    <AddSectionButton
      aria-label={ariaLabel}
      type={action?.type ?? 'button'}
      onClick={handleClick}
      formAction={action?.formAction}
      formMethod={action?.formMethod}
      form={action?.form}
    >
      {children}
    </AddSectionButton>
  );
}

function AddSectionInlineButton({
  type = 'chapter',
  actIndex = 1,
  actTitle,
  placeholder = 'Untitled',
  className,
  addChapter,
  addAct,
  addScene,
  onAddChapter,
  onAddAct,
  onAddScene,
  onActTitleChange,
}: AddSectionInlineButtonProps) {
  const [title, setTitle] = React.useState(actTitle ?? '');

  React.useEffect(() => {
    if (actTitle !== undefined) setTitle(actTitle);
  }, [actTitle]);

  const isAct =
    type === 'actUntitled' || type === 'actNoOnly' || type === 'actTitled';

  function commitTitle(next: string) {
    setTitle(next);
    onActTitleChange?.(next);
  }

  if (isAct) {
    const roman = toRomanNumeral(actIndex);

    if (type === 'actNoOnly') {
      return (
        <div
          data-slot="add-section-inline-button"
          data-type={type}
          className={cn(
            'flex w-full max-w-full items-center gap-[var(--spacing-sm)]',
            'pt-[var(--spacing-sm)] pb-[var(--spacing-xs)]',
            className,
          )}
        >
          <ActDiamondRail />
          <span
            aria-label={`Act ${roman}`}
            className={cn(
              actSerifType,
              'shrink-0 px-[var(--spacing-1-5)]',
              'text-[color:var(--neutrals-new-500)] whitespace-nowrap',
            )}
          >
            {roman}
          </span>
          <ActDiamondRail />
        </div>
      );
    }

    return (
      <div
        data-slot="add-section-inline-button"
        data-type={type}
        className={cn(
          'flex w-full max-w-full items-center gap-[var(--spacing-sm)]',
          'pt-[var(--spacing-sm)] pb-[var(--spacing-xs)]',
          className,
        )}
      >
        <ActDiamondRail />
        <div className="flex shrink-0 items-center gap-[var(--spacing-2xs)]">
          <span
            className={cn(
              actSerifType,
              'text-[color:var(--neutrals-new-500)] whitespace-nowrap',
            )}
          >
            {`${roman}.`}
          </span>
          <Input
            variant="quiet"
            size="mini"
            aria-label="Act title"
            value={title}
            placeholder={type === 'actUntitled' ? placeholder : undefined}
            onChange={(event) => commitTitle(event.currentTarget.value)}
            className={cn(
              actSerifType,
              'h-[length:var(--spacing-2xl)] w-auto field-sizing-content',
              'rounded-[length:var(--rounded-md)]',
              'px-[var(--spacing-1-5)]',
              'text-[color:var(--neutrals-new-500)]',
              'placeholder:text-[color:var(--theme-alpha-black-switch-25)]',
            )}
          />
        </div>
        <ActDiamondRail />
      </div>
    );
  }

  return (
    <div
      data-slot="add-section-inline-button"
      data-type={type}
      className={cn(
        'flex w-full max-w-full items-center gap-[var(--spacing-2xs)]',
        'pt-[var(--spacing-2xs)] pb-[var(--spacing-3xs)]',
        className,
      )}
    >
      <SecondaryGlowRail />
      {type === 'scene' ? (
        <SectionAddPill
          action={addScene}
          onAdd={onAddScene}
          ariaLabel="Add scene"
        >
          <PlusIcon />
          Scene
        </SectionAddPill>
      ) : (
        <>
          <SectionAddPill
            action={addChapter}
            onAdd={onAddChapter}
            ariaLabel="Add chapter"
          >
            <PlusIcon />
            Chapter
          </SectionAddPill>
          <span
            className={cn(
              dividerLabelType,
              'text-[color:var(--muted-foreground)] shrink-0',
            )}
          >
            /
          </span>
          <SectionAddPill
            action={addAct}
            onAdd={onAddAct}
            ariaLabel="Add act"
          >
            <SeparatorHorizontalIcon />
            Act
          </SectionAddPill>
        </>
      )}
      <SecondaryGlowRail />
    </div>
  );
}

export { AddSectionInlineButton };
