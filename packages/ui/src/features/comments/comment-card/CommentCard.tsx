'use client';

import * as React from 'react';
import { CircleCheckIcon, ReplyIcon } from 'lucide-react';

import { AvatarWithLabel } from '@/molecules/avatar-with-label';
import { Button } from '@/primitives/button';
import { Kbd } from '@/primitives/kbd';
import { Textarea } from '@/primitives/textarea';
import { cn } from '@/lib/utils';

export type CommentCardMode = 'compose' | 'existing' | 'edit' | 'reply';
export type CommentAnchorState = 'none' | 'quiet' | 'active';

export type CommentCardProps = Omit<React.ComponentProps<'article'>, 'children'> & {
  mode?: CommentCardMode;
  anchor?: CommentAnchorState;
  author?: string;
  initials?: string;
  avatarSrc?: string;
  timestamp?: string;
  comment?: string;
  location?: string;
  maxLength?: number;
  autoFocus?: boolean;
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
  onReply?: () => void;
};

function CommentAnchor({ state }: { state: Exclude<CommentAnchorState, 'none'> }) {
  return (
    <span
      data-slot="comment-anchor"
      data-state={state}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute left-[calc(100%+var(--spacing-md))] top-1/2 -translate-y-1/2 rounded-full',
        state === 'active'
          ? [
              'size-[var(--spacing-xl)]',
              'bg-[color:var(--tw-raw-fia-200)]',
              'border-[6px] border-[color:var(--theme-alpha-black-switch-20)]',
              'shadow-[0_0_18px_4px_color-mix(in_srgb,var(--tw-raw-fia-200)_35%,transparent)]',
            ]
          : 'size-[var(--spacing-md)] bg-[color:var(--theme-alpha-black-switch-10)] border-[5px] border-[color:var(--theme-alpha-black-switch-333)]',
      )}
    />
  );
}

function CommentCard({
  mode = 'compose',
  anchor = 'active',
  author = 'Christian',
  initials = 'CD',
  avatarSrc,
  timestamp = 'Just now',
  comment = 'This quote should be its own paragraph. I’m also considering making this line longer as well.',
  location = 'Ch. 1 · Sc. 1 · ¶ 3',
  maxLength = 500,
  autoFocus = false,
  onSubmit,
  onCancel,
  onReply,
  className,
  ...props
}: CommentCardProps) {
  const editing = mode === 'compose' || mode === 'edit' || mode === 'reply';
  const [value, setValue] = React.useState(mode === 'compose' || mode === 'reply' ? '' : comment);

  const submit = () => {
    if (value.trim()) onSubmit?.(value.trim());
  };

  return (
    <article
      data-slot="comment-card"
      data-mode={mode}
      className={cn(
        'relative flex w-[344px] flex-col overflow-visible rounded-[length:var(--rounded-xl)]',
        editing
          ? [
              'border border-[color:color-mix(in_srgb,var(--tw-raw-fia-200)_16%,transparent)]',
              'bg-[color:var(--card)] shadow-[var(--shadow-lg-black)]',
            ]
          : 'bg-[color:var(--theme-alpha-black-switch-333)]',
        className,
      )}
      {...props}
    >
      <header className="flex items-center justify-between px-[var(--spacing-md)] pb-[var(--spacing-xs)] pt-[var(--spacing-md)]">
        <AvatarWithLabel
          size="sm"
          name={author}
          initials={initials}
          src={avatarSrc}
          gradient={false}
          fallbackClassName="bg-[color:var(--tw-raw-pantones-blush)]"
        />
        {mode !== 'compose' ? (
          <div className="flex items-center gap-[var(--spacing-sm)] text-[color:var(--muted-foreground)]">
            <span className="text-[length:var(--text-paragraph-mini-regular-font-size)] leading-[var(--text-paragraph-mini-regular-line-height)]">
              {timestamp}
            </span>
            <CircleCheckIcon className="size-[var(--icon-xs)]" aria-label="Resolved" />
          </div>
        ) : null}
      </header>

      <div className="px-[var(--spacing-md)] py-[var(--spacing-xs)]">
        {editing ? (
          <Textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={mode === 'reply' ? 'Write a reply...' : 'Write a comment...'}
            maxLength={maxLength}
            showCharacterCount
            resizable
            autoFocus={autoFocus}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                event.preventDefault();
                submit();
              }
              if (event.key === 'Escape') onCancel?.();
            }}
          />
        ) : (
          <p className="text-[length:var(--text-paragraph-small-regular-font-size)] leading-[var(--text-paragraph-small-regular-line-height)] text-[color:var(--muted-foreground)]">
            {comment}
          </p>
        )}
      </div>

      <footer className="flex items-center justify-between px-[var(--spacing-md)] pb-[var(--spacing-md)] pt-[var(--spacing-xs)]">
        {editing ? (
          <div className="flex items-center gap-[var(--spacing-xs)]">
            <Button size="small" variant="primary" onClick={submit}>
              {mode === 'edit' ? 'Save changes' : 'Add comment'}
              <Kbd data-icon="inline-end">⌘↵</Kbd>
            </Button>
            <Button size="small" variant="ghost" onClick={onCancel}>
              {mode === 'edit' ? 'Discard changes' : 'Cancel'}
              <Kbd data-icon="inline-end">esc</Kbd>
            </Button>
          </div>
        ) : (
          <>
            <span className="text-[length:var(--text-paragraph-small-regular-font-size)] leading-[var(--text-paragraph-small-regular-line-height)] text-[color:var(--muted-foreground)]">
              {location}
            </span>
            <Button size="mini" variant="ghost" onClick={onReply}>
              Reply
              <ReplyIcon data-icon="inline-end" />
            </Button>
          </>
        )}
      </footer>

      {anchor !== 'none' ? <CommentAnchor state={anchor} /> : null}
    </article>
  );
}

export { CommentCard };
