import type { KeyboardEvent } from 'react';

/**
 * Ensure ⌘/Ctrl+A selects the field value instead of the surrounding page
 * (Storybook canvas, feature chrome, etc.).
 */
function selectAllOnModA(
  event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
) {
  if (!(event.metaKey || event.ctrlKey)) return;
  if (event.altKey || event.shiftKey) return;
  if (event.key.toLowerCase() !== 'a') return;

  const target = event.currentTarget;
  if (
    !(target instanceof HTMLInputElement) &&
    !(target instanceof HTMLTextAreaElement)
  ) {
    return;
  }

  // Native select-all can be stolen by ancestors; pin selection to the field.
  event.preventDefault();
  event.stopPropagation();
  target.select();
}

export { selectAllOnModA };
