import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getEntry } from "@/lib/content/repository";
import type { ContentEntry, ContentRelation } from "@/lib/content/types";
import { mdxComponents } from "./mdx-components";

function titleFromSlug(slug: string) {
  const value = slug.replaceAll("-", " ");
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function RelatedEntries({ relations }: { relations: ContentRelation[] }) {
  if (!relations.length) return null;
  return (
    <aside className="related-content" aria-labelledby="related-title">
      <h2 id="related-title">Related content</h2>
      <ul>
        {relations.map((relation) => {
          const title = getEntry(relation.collection, relation.slug)?.title;
          return (
            <li key={`${relation.collection}/${relation.slug}`}>
              <Link href={`/${relation.collection}/${relation.slug}`}>
                {title ?? titleFromSlug(relation.slug)}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export async function ContentDetail({ entry }: { entry: ContentEntry }) {
  return (
    <article className="content-detail">
      <header>
        <p className="eyebrow">
          {entry.collection} / {entry.date}
        </p>
        <h1>{entry.title}</h1>
        <p className="content-summary">{entry.summary}</p>
        {entry.tags.length ? (
          <ul className="tag-list" aria-label="Tags">
            {entry.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
      </header>
      {entry.source ? (
        <div className="mdx-content">
          <MDXRemote source={entry.source} components={mdxComponents} />
        </div>
      ) : null}
      <RelatedEntries relations={entry.related} />
    </article>
  );
}
