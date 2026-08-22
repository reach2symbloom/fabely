export type ChapterNavEntityKind =
  | 'manuscript'
  | 'act'
  | 'chapter'
  | 'scene'
  | 'subscene';

/** Stable payload passed from Chapter Nav UI events to persistence adapters. */
export type ChapterNavMutationContext = {
  manuscriptId?: string;
  entityId?: string;
  parentId?: string;
  kind: ChapterNavEntityKind;
};

export type ChapterNavInsertContext = ChapterNavMutationContext & {
  insertAfterId?: string;
};
