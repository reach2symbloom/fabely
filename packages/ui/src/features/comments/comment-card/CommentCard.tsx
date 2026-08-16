'use client';

import * as React from 'react';
import { CircleCheckIcon, ReplyIcon } from 'lucide-react';

import { FiaSilcrow } from '@/foundations/icons';
import { AvatarWithLabel, getUserInitials, type UserIdentity } from '@/molecules/avatar-with-label';
import { Button, IconButton } from '@/primitives/button';
import { Kbd } from '@/primitives/kbd';
import { Textarea } from '@/primitives/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/primitives/tooltip';
import { cn } from '@/lib/utils';

export type CommentCardScene =
  | 'new-comment'
  | 'existing'
  | 'edit-existing'
  | 'reply'
  | 'replying'
  | 'replied';

export type CommentCardSubmitAction =
  | 'add-comment'
  | 'save-comment'
  | 'add-reply';

export type CommentCardSubmitContext = {
  action: CommentCardSubmitAction;
  scene: Extract<CommentCardScene, 'new-comment' | 'edit-existing' | 'replying'>;
  commentId?: string;
  replyId?: string;
};

export type CommentCardFiaContext = {
  source: 'comment-card';
  scene: CommentCardScene;
  commentId?: string;
  replyId?: string;
  comment: string;
  reply?: string;
  location: string;
  locationHref?: string;
  author: { id?: string; name: string };
  replyAuthor?: { id?: string; name: string };
};

export type CommentCardProps = Omit<React.ComponentProps<'article'>, 'children'> & {
  scene?: CommentCardScene;
  /** Storybook/visual testing only: locks Existing into its native hover presentation. */
  forceHover?: boolean;
  /** Current user record, normally mapped directly from the project database. */
  user?: UserIdentity;
  author?: string;
  initials?: string;
  avatarSrc?: string;
  timestamp?: string;
  comment?: string;
  /** Collaborator record used by Replying and Replied scenes. */
  replyUser?: UserIdentity;
  replyAuthor?: string;
  replyInitials?: string;
  replyAvatarSrc?: string;
  replyTimestamp?: string;
  replyComment?: string;
  location?: string;
  locationHref?: string;
  commentId?: string;
  replyId?: string;
  /** Backend capability: true only when this project has an eligible collaborator. */
  collaborationEnabled?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  submitting?: boolean;
  onSubmit?: (value: string, context: CommentCardSubmitContext) => void;
  onAddComment?: (value: string, context: CommentCardSubmitContext) => void;
  onSaveChanges?: (value: string, context: CommentCardSubmitContext) => void;
  onAddReply?: (value: string, context: CommentCardSubmitContext) => void;
  onCancel?: () => void;
  onEdit?: () => void;
  onReply?: () => void;
  /** Supplies this thread as context to the future Fia sidecar. */
  onSendToFia?: (context: CommentCardFiaContext) => void;
};

const DEFAULT_COMMENT =
  'This quote should be it’s own paragraph. I’m also considering making this line longer as well.';
const DEFAULT_REPLY =
  'I’m compelled to believe this may need to be defined further before proceeding.';

function CommentAnchor({ active }: { active: boolean }) {
  return (
    <span
      data-slot="comment-anchor"
      data-state={active ? 'active' : 'quiet'}
      aria-hidden="true"
      className={cn(
        [
          'pointer-events-none absolute left-[calc(100%+var(--spacing-md))] top-1/2 -translate-y-1/2 rounded-full',
          'transition-[width,height,border-width,border-color,background-color,box-shadow] duration-fast ease-emphasized',
          'motion-reduce:transition-none',
        ],
        active
          ? [
              'size-[var(--spacing-xl)]',
              'animate-[comment-anchor-breathe_3.6s_ease-in-out_infinite] motion-reduce:animate-none',
              'box-border border-[9px] border-[color:var(--tw-raw-neutral-700)]',
              'bg-[color:var(--tw-raw-pantones-saffron)]',
              'shadow-[0_0_10px_color-mix(in_srgb,var(--tw-raw-neutral-300)_60%,transparent),0_0_8px_color-mix(in_srgb,var(--tw-raw-black)_50%,transparent)]',
            ]
          : [
              'size-[var(--spacing-md)] box-border border-[6px] border-[color:var(--tw-raw-neutral-850)]',
              'bg-[color:color-mix(in_srgb,var(--tw-raw-white)_25%,transparent)]',
            ],
      )}
    />
  );
}

type IdentityProps = {
  userId?: string;
  author: string;
  initials: string;
  avatarSrc?: string;
  timestamp?: string;
  resolved?: boolean;
  olive?: boolean;
};

function CommentIdentity({ userId, author, initials, avatarSrc, timestamp, resolved, olive }: IdentityProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <AvatarWithLabel
        data-user-id={userId}
        size="sm"
        name={author}
        initials={initials}
        src={avatarSrc}
        gradient={false}
        fallbackClassName={olive ? 'bg-[color:var(--tw-raw-pantones-muted-olive)]' : 'bg-[color:var(--tw-raw-pantones-blush)]'}
      />
      {timestamp ? (
        <div className="flex items-center gap-[var(--spacing-sm)] text-[color:var(--muted-foreground)]">
          <span className="text-[length:var(--text-paragraph-mini-regular-font-size)] leading-[var(--text-paragraph-mini-regular-line-height)]">{timestamp}</span>
          {resolved ? <CircleCheckIcon className="size-[var(--icon-xs)]" aria-label="Resolved" /> : null}
        </div>
      ) : null}
    </div>
  );
}

function CommentText({ children }: { children: React.ReactNode }) {
  return <p className="w-full min-w-0 break-words [overflow-wrap:anywhere] text-[length:var(--text-paragraph-small-regular-font-size)] leading-[var(--text-paragraph-small-regular-line-height)] text-[color:var(--muted-foreground)]">{children}</p>;
}

function CommentLocation({ location, href }: { location: string; href?: string }) {
  const className = 'text-[length:var(--text-paragraph-small-regular-font-size)] leading-[var(--text-paragraph-small-regular-line-height)] text-[color:var(--muted-foreground)]';
  return href ? <a href={href} data-action="open-location" className={cn(className, 'hover:underline')}>{location}</a> : <span className={className}>{location}</span>;
}

function FiaCommentAction({ onClick }: { onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={(
          <IconButton
            type="button"
            size="sm"
            variant="fiaGhost"
            aria-label="Ask Fia about this comment"
            data-action="send-to-fia"
            onClick={onClick}
          />
        )}
      >
        <FiaSilcrow />
      </TooltipTrigger>
      <TooltipContent>Ask Fia</TooltipContent>
    </Tooltip>
  );
}

function ComposerActions({ editing, replying, submitting, onSubmit, onCancel }: { editing?: boolean; replying?: boolean; submitting?: boolean; onSubmit: () => void; onCancel?: () => void }) {
  return (
    <div className="flex items-center gap-[var(--spacing-xs)]">
      <Button
        type="button"
        size="small"
        variant="primary"
        data-action={editing ? 'save-comment' : replying ? 'add-reply' : 'add-comment'}
        disabled={submitting}
        aria-busy={submitting || undefined}
        onClick={onSubmit}
      >
        {editing ? 'Save changes' : 'Add comment'}
        <Kbd data-icon="inline-end">⌘↵</Kbd>
      </Button>
      <Button type="button" size="small" variant="ghost" data-action="cancel" disabled={submitting} onClick={onCancel}>
        {editing ? 'Discard changes' : 'Cancel'}
        <Kbd data-icon="inline-end">esc</Kbd>
      </Button>
    </div>
  );
}

function CommentCard({
  scene = 'new-comment', user, author, initials, avatarSrc,
  timestamp, comment = DEFAULT_COMMENT, replyUser, replyAuthor, replyInitials,
  replyAvatarSrc, replyTimestamp = '7m ago', replyComment = DEFAULT_REPLY,
  location = 'Ch. 1 · Sc. 1 · ¶ 3', locationHref, commentId, replyId,
  collaborationEnabled = false, maxLength = 500, autoFocus = false, submitting = false,
  onSubmit, onAddComment, onSaveChanges, onAddReply, onCancel, onEdit, onReply, onSendToFia,
  forceHover = false, className, onClick, onKeyDown, onPointerEnter, onPointerLeave, tabIndex, ...props
}: CommentCardProps) {
  const [pointerHovered, setPointerHovered] = React.useState(false);
  const resolvedAuthor = author ?? user?.name ?? 'Christian';
  const resolvedInitials = initials ?? (user ? getUserInitials(user) : 'CD');
  const resolvedAvatarSrc = avatarSrc ?? user?.avatarUrl ?? undefined;
  const resolvedReplyAuthor = replyAuthor ?? replyUser?.name ?? 'Ralph';
  const resolvedReplyInitials = replyInitials ?? (replyUser ? getUserInitials(replyUser) : 'RC');
  const resolvedReplyAvatarSrc = replyAvatarSrc ?? replyUser?.avatarUrl ?? undefined;
  const requestedReplyScene = scene === 'reply' || scene === 'replying' || scene === 'replied';
  const renderedScene = requestedReplyScene && !collaborationEnabled ? 'existing' : scene;
  const newComment = renderedScene === 'new-comment';
  const editing = renderedScene === 'edit-existing';
  const replying = renderedScene === 'replying';
  const existingHover = renderedScene === 'existing' && (forceHover || pointerHovered);
  const replyScene = renderedScene === 'reply' || replying || renderedScene === 'replied';
  const activeAnchor = newComment || editing || replying;
  const [value, setValue] = React.useState(newComment ? '' : replying ? replyComment : comment);

  React.useEffect(() => {
    setValue(newComment ? '' : replying ? replyComment : comment);
  }, [comment, newComment, replyComment, replying, renderedScene]);

  const submit = () => {
    const trimmedValue = value.trim();
    if (!trimmedValue || submitting || !(newComment || editing || replying)) return;

    const context: CommentCardSubmitContext = {
      action: editing ? 'save-comment' : replying ? 'add-reply' : 'add-comment',
      scene: editing ? 'edit-existing' : replying ? 'replying' : 'new-comment',
      commentId,
      replyId,
    };

    onSubmit?.(trimmedValue, context);
    if (editing) onSaveChanges?.(trimmedValue, context);
    else if (replying) onAddReply?.(trimmedValue, context);
    else onAddComment?.(trimmedValue, context);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
    if (event.key === 'Escape') onCancel?.();
  };
  const cardTimestamp = timestamp ?? (replyScene ? '2d ago' : 'Just now');
  const composer = newComment || editing || replying;
  const sendToFia = React.useCallback(() => {
    onSendToFia?.({
      source: 'comment-card',
      scene: renderedScene,
      commentId,
      replyId,
      comment,
      reply: replyScene && renderedScene !== 'reply' ? replyComment : undefined,
      location,
      locationHref,
      author: { id: user?.id, name: resolvedAuthor },
      replyAuthor: replyScene && renderedScene !== 'reply'
        ? { id: replyUser?.id, name: resolvedReplyAuthor }
        : undefined,
    });
  }, [comment, commentId, location, locationHref, onSendToFia, renderedScene, replyComment, replyId, replyScene, replyUser?.id, resolvedAuthor, resolvedReplyAuthor, user?.id]);

  return (
    <article
      data-slot="comment-card"
      data-scene={renderedScene}
      data-collaboration={collaborationEnabled ? 'enabled' : 'solo'}
      data-hovered={existingHover || undefined}
      className={cn(
        'relative flex w-[344px] flex-col overflow-visible rounded-[length:var(--rounded-xl)] transition-[background-color,opacity]',
        composer
          ? ['border border-[color:color-mix(in_srgb,var(--tw-raw-pantones-saffron)_16%,transparent)]', 'bg-[color:var(--card)] shadow-[var(--shadow-lg-black)]']
          : 'bg-[color:var(--theme-alpha-black-switch-333)]',
        renderedScene === 'existing' && 'cursor-pointer',
        renderedScene === 'existing' && !existingHover && 'opacity-56',
        existingHover && 'bg-[color:var(--theme-alpha-black-switch-5)] opacity-100',
        className,
      )}
      tabIndex={renderedScene === 'existing' ? (tabIndex ?? 0) : tabIndex}
      aria-label={renderedScene === 'existing' ? 'Edit comment' : undefined}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || renderedScene !== 'existing') return;
        const target = event.target;
        if (target instanceof Element && target.closest('a,button,[data-action]')) return;
        onEdit?.();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || renderedScene !== 'existing') return;
        if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return;
        event.preventDefault();
        onEdit?.();
      }}
      onPointerEnter={(event) => {
        setPointerHovered(true);
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        setPointerHovered(false);
        onPointerLeave?.(event);
      }}
      {...props}
    >
      {replyScene ? (
        <div className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-md)]">
          <div className="flex flex-col gap-[var(--spacing-xs)]">
            <CommentIdentity userId={user?.id} author={resolvedAuthor} initials={resolvedInitials} avatarSrc={resolvedAvatarSrc} timestamp={cardTimestamp} resolved />
            <CommentText>{comment}</CommentText>
          </div>
          {renderedScene !== 'reply' ? (
            <div className="h-px w-full bg-[color:var(--theme-alpha-black-switch-5)]" />
          ) : null}
          {renderedScene === 'reply' ? (
            <Button type="button" size="small" variant="outline" roundness="default" data-action="reply" className="self-start" onClick={onReply}>Reply<ReplyIcon data-icon="inline-end" /></Button>
          ) : (
            <div className="flex flex-col gap-[var(--spacing-xs)]">
              <CommentIdentity userId={replyUser?.id} author={resolvedReplyAuthor} initials={resolvedReplyInitials} avatarSrc={resolvedReplyAvatarSrc} timestamp={renderedScene === 'replied' ? replyTimestamp : undefined} resolved={renderedScene === 'replied'} olive />
              {replying ? (
                <Textarea variant="filled" value={value} onChange={(event) => setValue(event.target.value)} maxLength={maxLength} resizable autoFocus={autoFocus} className="min-h-[58px]" onKeyDown={handleKeyDown} />
              ) : <CommentText>{replyComment}</CommentText>}
            </div>
          )}
          {renderedScene === 'replied' ? (
            <Button type="button" size="small" variant="outline" roundness="default" data-action="reply" className="self-start" onClick={onReply}>Reply<ReplyIcon data-icon="inline-end" /></Button>
          ) : null}
          {replying ? <ComposerActions replying submitting={submitting} onSubmit={submit} onCancel={onCancel} /> : null}
          {renderedScene !== 'reply' ? (
            <div className="h-px w-full bg-[color:var(--border)]" />
          ) : null}
          <div className="flex w-full items-center justify-between gap-[var(--spacing-xs)]">
            <CommentLocation location={location} href={locationHref} />
            <FiaCommentAction onClick={sendToFia} />
          </div>
        </div>
      ) : (
        <>
          <header className="px-[var(--spacing-md)] pb-[var(--spacing-xs)] pt-[var(--spacing-md)]">
            <CommentIdentity userId={user?.id} author={resolvedAuthor} initials={resolvedInitials} avatarSrc={resolvedAvatarSrc} timestamp={newComment || editing ? undefined : cardTimestamp} />
          </header>
          <div className="px-[var(--spacing-md)] py-[var(--spacing-xs)]">
            {newComment || editing ? (
              <Textarea variant="filled" value={value} onChange={(event) => setValue(event.target.value)} placeholder={newComment ? 'Write a comment...' : undefined} maxLength={maxLength} showCharacterCount={newComment} resizable autoFocus={autoFocus} onKeyDown={handleKeyDown} />
            ) : <CommentText>{comment}</CommentText>}
          </div>
          <footer className="flex items-center justify-between px-[var(--spacing-md)] pb-[var(--spacing-md)] pt-[var(--spacing-xs)]">
            {newComment || editing ? <ComposerActions editing={editing} submitting={submitting} onSubmit={submit} onCancel={onCancel} /> : <CommentLocation location={location} href={locationHref} />}
            {!newComment && !editing ? <FiaCommentAction onClick={sendToFia} /> : null}
          </footer>
        </>
      )}
      <CommentAnchor active={activeAnchor} />
    </article>
  );
}

export { CommentCard };
