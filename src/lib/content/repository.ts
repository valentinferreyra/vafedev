import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import { contentMetaSchema } from "./schema";
import {
  COLLECTIONS,
  type CollectionName,
  type ContentEntry,
  type ContentOptions,
} from "./types";

export type { CollectionName, ContentEntry, ContentMeta, ContentRelation } from "./types";

const defaultRoot = path.join(process.cwd(), "content");

function readRegistry(root = defaultRoot): Map<string, ContentEntry> {
  const registry = new Map<string, ContentEntry>();

  for (const collection of COLLECTIONS) {
    const directory = path.join(root, collection);
    if (!fs.existsSync(directory)) continue;

    for (const file of fs.readdirSync(directory).filter((name) => name.endsWith(".mdx"))) {
      const raw = fs.readFileSync(path.join(directory, file), "utf8");
      const { data, content } = matter(raw);
      const meta = contentMetaSchema.parse(data);
      const key = `${collection}/${meta.slug}`;

      if (registry.has(key)) {
        throw new Error(`Duplicate slug: ${key}`);
      }

      registry.set(key, { ...meta, collection, source: content.trim() });
    }
  }

  for (const entry of registry.values()) {
    for (const relation of entry.related) {
      const target = registry.get(`${relation.collection}/${relation.slug}`);
      if (target?.draft) {
        throw new Error(`Draft related entry: ${relation.collection}/${relation.slug}`);
      }
      if (target) continue;

      const sameSlug = [...registry.values()].find(({ slug }) => slug === relation.slug);
      if (sameSlug) {
        throw new Error(
          `Wrong collection for ${relation.slug}: expected ${sameSlug.collection}, received ${relation.collection}`,
        );
      }
      throw new Error(`Missing related entry: ${relation.collection}/${relation.slug}`);
    }
  }

  return registry;
}

export function validateContent(options: Pick<ContentOptions, "root"> = {}): void {
  readRegistry(options.root);
}

export function getCollection(
  name: CollectionName,
  options: ContentOptions = {},
): ContentEntry[] {
  return [...readRegistry(options.root).values()]
    .filter((entry) => entry.collection === name)
    .filter((entry) => options.includeDrafts || !entry.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getEntry(
  name: CollectionName,
  slug: string,
  options: ContentOptions = {},
): ContentEntry | null {
  const entry = readRegistry(options.root).get(`${name}/${slug}`) ?? null;
  return entry && (options.includeDrafts || !entry.draft) ? entry : null;
}

export function getPopulatedCollections(
  options: ContentOptions = {},
): Set<CollectionName> {
  return new Set(
    COLLECTIONS.filter((collection) => getCollection(collection, options).length > 0),
  );
}
