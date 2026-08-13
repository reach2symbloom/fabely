import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type PlaygroundPanelProps = {
  preview: ReactNode;
  controls: ReactNode;
  /**
   * Alignment of the preview region. Default `center` (Badge / Avatar).
   * Use `stretch` when the preview should fill the panel width (Alert).
   */
  previewAlign?: 'center' | 'stretch';
  className?: string;
};

/**
 * Shared Storybook playground chrome — bordered panel with a full-bleed
 * Foundations stroke divider between the component preview and the controls.
 *
 * Padding lives on the preview and controls sections individually (not the
 * outer panel) so the divider spans the full panel width with no left/right
 * inset. Width from `--stroke-thin`, color from `--border` — the same
 * Foundations pairing Accordion uses for item dividers.
 */
export function PlaygroundPanel({
  preview,
  controls,
  previewAlign = 'center',
  className,
}: PlaygroundPanelProps) {
  return (
    <div className={cn('flex flex-col rounded-lg border border-border', className)}>
      <div
        className={cn(
          'p-8',
          previewAlign === 'center' && 'flex flex-col items-center'
        )}
      >
        {preview}
      </div>
      <div
        role="separator"
        className="border-t-[length:var(--stroke-thin)] border-t-[color:var(--border)]"
      />
      <div className="p-8">{controls}</div>
    </div>
  );
}
