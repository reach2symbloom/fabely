/**
 * Fabely Questionnaire — multi-step question flow.
 *
 * Public API matches [shadcn Questionnaire]
 * (https://ui.shadcn.com/docs/components/base/questionnaire). Behavior comes
 * from `@shadcn/react/questionnaire`; this primitive owns Foundations chrome
 * (type, choice cards, Input, Button nav). No dedicated Figma Questionnaire
 * set — surface maps to Item / Input / Button tokens.
 *
 * Vendor (`src/components/ui/questionnaire.tsx`) stays untouched if present.
 */

'use client';

import * as React from 'react';
import { Questionnaire as QuestionnairePrimitive } from '@shadcn/react/questionnaire';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { buttonVariants, type ButtonProps } from '../button';

function Questionnaire({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Root>) {
  return (
    <QuestionnairePrimitive.Root
      data-slot="questionnaire"
      className={cn(
        'flex w-full min-w-0 flex-col gap-[var(--spacing-xl)]',
        className,
      )}
      {...props}
    />
  );
}

function QuestionnaireProgress({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Progress>) {
  return (
    <QuestionnairePrimitive.Progress
      data-slot="questionnaire-progress"
      className={cn(
        'min-h-[1lh] w-fit min-w-[14ch]',
        'font-[family-name:var(--font-family-body)]',
        '[font-weight:var(--font-weight-paragraph-medium)]',
        'text-[length:var(--text-paragraph-mini-medium-font-size)]',
        'leading-[var(--text-paragraph-mini-medium-line-height)]',
        'tracking-[var(--text-paragraph-mini-medium-letter-spacing)]',
        'text-[color:var(--muted-foreground)] tabular-nums',
        className,
      )}
      {...props}
    />
  );
}

function QuestionnaireItem({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) {
  return (
    <QuestionnairePrimitive.Item
      data-slot="questionnaire-item"
      className={cn(
        'flex min-w-0 flex-col gap-[var(--spacing-md)] border-0 p-0 outline-none',
        className,
      )}
      {...props}
    />
  );
}

function QuestionnaireTitle({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Title>) {
  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      className={cn(
        'font-[family-name:var(--font-family-body)]',
        '[font-weight:var(--font-weight-paragraph-medium)]',
        'text-[length:var(--text-paragraph-regular-medium-font-size)]',
        'leading-[var(--text-paragraph-regular-medium-line-height)]',
        'tracking-[var(--text-paragraph-regular-medium-letter-spacing)]',
        'text-[color:var(--foreground)] text-pretty',
        '[&:not(:has(~[data-slot=questionnaire-description]))]:mb-[var(--spacing-md)]',
        className,
      )}
      {...props}
    />
  );
}

function QuestionnaireDescription({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Description>) {
  return (
    <QuestionnairePrimitive.Description
      data-slot="questionnaire-description"
      className={cn(
        'font-[family-name:var(--font-family-body)]',
        '[font-weight:var(--font-weight-paragraph-regular)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        'text-[color:var(--muted-foreground)] text-pretty',
        className,
      )}
      {...props}
    />
  );
}

function QuestionnaireChoices({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choices>) {
  return (
    <QuestionnairePrimitive.Choices
      data-slot="questionnaire-choices"
      className={cn(
        'group/questionnaire-choices grid min-w-0 gap-[var(--spacing-sm)]',
        className,
      )}
      {...props}
    />
  );
}

function QuestionnaireChoice({
  children,
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choice>) {
  return (
    <QuestionnairePrimitive.Choice
      data-slot="questionnaire-choice"
      className={cn(
        'group/questionnaire-choice relative flex cursor-pointer items-start',
        'gap-[var(--spacing-sm)]',
        'rounded-[length:var(--rounded-xl)]',
        'border-[length:var(--stroke-thin)] border-[color:var(--border)]',
        'bg-[color:var(--background)]',
        'px-[var(--spacing-md)] py-[var(--spacing-sm)]',
        'font-[family-name:var(--font-family-body)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        'text-start text-[color:var(--foreground)] outline-none select-none',
        'transition-[color,background-color,border-color,box-shadow]',
        'duration-[var(--duration-fast)]',
        'hover:bg-[color:var(--theme-alpha-black-switch-5)]',
        'has-[>input:focus-visible]:shadow-[var(--effect-focus-ring-secondary)]',
        'data-checked:border-[color:var(--primary)]',
        'data-checked:bg-[color:var(--theme-alpha-black-switch-5)]',
        'data-invalid:border-[color:var(--destructive)]',
        'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot="questionnaire-choice-input"
        className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
      />
      <span
        aria-hidden="true"
        data-slot="questionnaire-choice-indicator"
        className={cn(
          'pointer-events-none relative flex shrink-0 items-center justify-center',
          'mt-[length:var(--spacing-3xs)]',
          'size-[length:var(--spacing-md)]',
          'rounded-[length:var(--rounded-sm)]',
          'border-[length:var(--stroke-thin)] border-[color:var(--input)]',
          'bg-[color:var(--background)]',
          'text-[color:var(--primary-foreground)]',
          'group-data-[type=radio]/questionnaire-choice:rounded-full',
          'group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:mt-0',
          'group-data-checked/questionnaire-choice:border-[color:var(--primary)]',
          'group-data-checked/questionnaire-choice:bg-[color:var(--primary)]',
        )}
      >
        <span
          data-slot="questionnaire-choice-indicator-dot"
          className={cn(
            'hidden size-[length:var(--spacing-xs)] rounded-full',
            'bg-[color:var(--primary-foreground)]',
            'group-data-[type=checkbox]/questionnaire-choice:hidden',
            'group-data-checked/questionnaire-choice:block',
          )}
        />
        <CheckIcon
          data-slot="questionnaire-choice-indicator-check"
          aria-hidden="true"
          className={cn(
            'hidden size-[length:var(--icon-xs)]',
            'group-data-[type=radio]/questionnaire-choice:hidden',
            'group-data-checked/questionnaire-choice:block',
          )}
        />
      </span>
      <QuestionnairePrimitive.ChoiceLabel
        data-slot="questionnaire-choice-label"
        className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-3xs)] leading-snug"
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
      <QuestionnairePrimitive.ChoiceShortcut
        data-slot="questionnaire-choice-shortcut"
        className={cn(
          'pointer-events-none ms-auto hidden shrink-0 items-center justify-center',
          'mt-[length:var(--spacing-3xs)]',
          'size-[length:var(--spacing-xl)]',
          'rounded-full',
          'border-[length:var(--stroke-thin)] border-[color:var(--border)]',
          'bg-[color:var(--theme-alpha-black-switch-5)]',
          'font-[family-name:var(--font-family-body)] font-mono',
          '[font-weight:var(--font-weight-paragraph-medium)]',
          'text-[length:var(--text-paragraph-mini-medium-font-size)]',
          'leading-none',
          'text-[color:var(--muted-foreground)]',
          'group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:mt-0',
          'group-data-[shortcut]/questionnaire-choice:inline-flex',
        )}
      />
    </QuestionnairePrimitive.Choice>
  );
}

function QuestionnaireChoiceDescription({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      className={cn(
        'font-[family-name:var(--font-family-body)]',
        '[font-weight:var(--font-weight-paragraph-regular)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        'text-[color:var(--muted-foreground)]',
        className,
      )}
      {...props}
    />
  );
}

function QuestionnaireInput({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Input>) {
  return (
    <div
      data-slot="questionnaire-input-wrapper"
      className="group/questionnaire-input relative w-full min-w-0"
    >
      <QuestionnairePrimitive.Input
        data-slot="questionnaire-input"
        className={cn(
          'h-[length:var(--spacing-3xl)] w-full min-w-0',
          'rounded-[length:var(--rounded-lg)]',
          'border-[length:var(--stroke-thin)] border-transparent',
          'bg-[color:var(--theme-alpha-black-switch-333)]',
          'px-[var(--spacing-sm)] py-[var(--spacing-xs)]',
          'font-[family-name:var(--font-family-body)]',
          '[font-weight:var(--font-weight-paragraph-regular)]',
          'text-[length:var(--text-paragraph-small-regular-font-size)]',
          'leading-[var(--text-paragraph-small-regular-line-height)]',
          'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
          'text-[color:var(--foreground)]',
          'placeholder:text-[color:var(--muted-foreground)]',
          'outline-none transition-[color,background-color,border-color,box-shadow]',
          'duration-[var(--duration-fast)]',
          'focus-visible:shadow-[var(--effect-focus-ring-secondary)]',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:border-[color:var(--destructive)]',
          'aria-invalid:bg-[color:var(--background)]',
          'aria-invalid:focus-visible:shadow-[var(--effect-focus-ring-error)]',
          className,
        )}
        {...props}
      />
    </div>
  );
}

function QuestionnaireError({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Error>) {
  return (
    <QuestionnairePrimitive.Error
      data-slot="questionnaire-error"
      className={cn(
        'mt-[var(--spacing-xs)]',
        'font-[family-name:var(--font-family-body)]',
        '[font-weight:var(--font-weight-paragraph-regular)]',
        'text-[length:var(--text-paragraph-small-regular-font-size)]',
        'leading-[var(--text-paragraph-small-regular-line-height)]',
        'tracking-[var(--text-paragraph-small-regular-letter-spacing)]',
        'text-[color:var(--destructive)]',
        className,
      )}
      {...props}
    />
  );
}

function QuestionnaireActions({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cn(
        'grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center',
        'gap-[var(--spacing-xs)]',
        className,
      )}
      {...props}
    />
  );
}

type NavButtonProps = Pick<ButtonProps, 'size' | 'variant' | 'roundness'>;

function QuestionnairePrevious({
  children,
  className,
  size = 'default',
  variant = 'outline',
  roundness = 'default',
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Previous> &
  NavButtonProps) {
  return (
    <QuestionnairePrimitive.Previous
      data-slot="questionnaire-previous"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant, roundness }),
        'col-start-1 row-start-1 justify-self-start',
        className,
      )}
      {...props}
    >
      {children ?? 'Previous'}
    </QuestionnairePrimitive.Previous>
  );
}

function QuestionnaireSkip({
  children,
  className,
  size = 'default',
  variant = 'outline',
  roundness = 'default',
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Skip> & NavButtonProps) {
  return (
    <QuestionnairePrimitive.Skip
      data-slot="questionnaire-skip"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant, roundness }),
        'col-start-2 row-start-1 justify-self-end',
        className,
      )}
      {...props}
    >
      {children ?? 'Skip'}
    </QuestionnairePrimitive.Skip>
  );
}

function QuestionnaireNext({
  children,
  className,
  size = 'default',
  variant = 'primary',
  roundness = 'default',
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Next> & NavButtonProps) {
  return (
    <QuestionnairePrimitive.Next
      data-slot="questionnaire-next"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant, roundness }),
        'col-start-3 row-start-1 justify-self-end',
        className,
      )}
      {...props}
    >
      {children ?? 'Next'}
    </QuestionnairePrimitive.Next>
  );
}

function QuestionnaireSubmit({
  children,
  className,
  size = 'default',
  variant = 'primary',
  roundness = 'default',
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Submit> & NavButtonProps) {
  return (
    <QuestionnairePrimitive.Submit
      data-slot="questionnaire-submit"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant, roundness }),
        'col-start-3 row-start-1 justify-self-end',
        className,
      )}
      {...props}
    >
      {children ?? 'Submit'}
    </QuestionnairePrimitive.Submit>
  );
}

export {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
};

export type {
  QuestionnaireItemDefinition,
  QuestionnaireItemStatus,
  QuestionnaireShortcutMode,
} from '@shadcn/react/questionnaire';
