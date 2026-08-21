/**
 * Semantic history contract for Paragraph List — one discrete event per
 * *completed* user action (never a stream of intermediate states), emitted
 * through `ParagraphListProps.onHistoryEvent`. Paragraph List does not
 * bind Cmd+Z/Cmd+Shift+Z and does not keep an undo/redo stack of its own —
 * it only reports what happened, with enough before/after data for a
 * caller to construct both the undo and the redo of that action
 * deterministically. A future Manuscript Editor/Application layer owns
 * the actual stack and the keybindings; this is only the event shape it
 * would record onto that stack.
 *
 * Every variant carries stable paragraph `id`s (never array indices as the
 * identity) plus whatever text/position data its own undo needs — indices
 * appear only where a position genuinely matters (`moveParagraph`'s
 * `fromIndex`/`toIndex`, `splitParagraph`/`mergeParagraphs`/
 * `insertParagraph`/`deleteParagraph`'s insertion/removal `index`), and are
 * captured at the moment of the event, not re-derived later — by the time
 * a caller undoes something, the live array may have moved on further.
 *
 * `insertParagraph`/`deleteParagraph` are part of this contract but not
 * currently emitted by anything in `ParagraphList.tsx` — there's no
 * standalone "insert a blank paragraph"/"delete this paragraph" action in
 * the component today (Enter always *splits*, Backspace always *merges*).
 * They're defined now so a caller can already type against the full
 * six-operation contract; wiring an actual UI trigger for either is a
 * separate, future change.
 */

export type ParagraphHistoryEvent =
  /** Committed text edit (fires on blur — already one event per edit
   * session, not per keystroke, since `ParagraphBlock.onTextChange`
   * itself only fires there). Undo: set `id`'s text to `before`. Redo:
   * set it to `after`. */
  | {
      type: 'editParagraph';
      id: string;
      before: string;
      after: string;
    }
  /** Enter split `sourceId` at `caretOffset` into `sourceId` (now
   * `textBefore`) + a new block `newId` (`textAfter`), inserted at
   * `index`. Undo: delete `newId`, restore `sourceId`'s text to
   * `sourceTextBefore`. Redo: set `sourceId`'s text to `textBefore`,
   * re-insert `newId` at `index` with `textAfter`. */
  | {
      type: 'splitParagraph';
      sourceId: string;
      sourceTextBefore: string;
      newId: string;
      index: number;
      caretOffset: number;
      textBefore: string;
      textAfter: string;
    }
  /** Backspace-at-start merged `removedId` (at `removedIndex`) into the
   * previous block `survivingId`, which keeps its id and gains the text,
   * with `insertedSpace` marking whether a joining space was inserted at
   * `joinOffset`. Undo: set `survivingId`'s text back to
   * `survivingTextBefore`, re-insert `removedId` at `removedIndex` with
   * `removedText`. Redo: set `survivingId`'s text to `survivingTextAfter`,
   * delete `removedId`. */
  | {
      type: 'mergeParagraphs';
      survivingId: string;
      survivingTextBefore: string;
      survivingTextAfter: string;
      removedId: string;
      removedText: string;
      removedIndex: number;
      insertedSpace: boolean;
      joinOffset: number;
    }
  /** A completed reorder — pointer drag (on drop) or keyboard reorder (on
   * each committed step), never intermediate drag-move positions. Undo:
   * move `id` from `toIndex` back to `fromIndex`. Redo: move it from
   * `fromIndex` to `toIndex`. */
  | {
      type: 'moveParagraph';
      id: string;
      fromIndex: number;
      toIndex: number;
    }
  /** Reserved — see module doc comment. Undo: delete `id`. Redo: re-insert
   * `id` at `index` with `text`. */
  | {
      type: 'insertParagraph';
      id: string;
      index: number;
      text: string;
    }
  /** Reserved — see module doc comment. Undo: re-insert `id` at `index`
   * with `text`. Redo: delete `id`. */
  | {
      type: 'deleteParagraph';
      id: string;
      index: number;
      text: string;
    };
