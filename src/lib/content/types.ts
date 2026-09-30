export const COLLECTIONS = [
  "projects",
  "learning",
  "designs",
  "blog",
  "goals",
  "books",
] as const;

export type CollectionName = (typeof COLLECTIONS)[number];

export type ContentRelation = {
  collection: CollectionName;
  slug: string;
};

export type ContentMeta = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  draft: boolean;
  status?: string;
  tags: string[];
  related: ContentRelation[];
};

export type ContentEntry = ContentMeta & {
  collection: CollectionName;
  source: string;
};

export type ContentOptions = {
  root?: string;
  includeDrafts?: boolean;
};
