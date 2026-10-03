import Link from "next/link";

import type { ContentEntry } from "@/lib/content/types";

export function ContentCard({ entry }: { entry: ContentEntry }) {
  return (
    <article className="content-card">
      <div className="content-card-meta">
        <time dateTime={entry.date}>{entry.date}</time>
        {entry.status ? <span>{entry.status}</span> : null}
      </div>
      <h2>
        <Link href={`/${entry.collection}/${entry.slug}`}>{entry.title}</Link>
      </h2>
      <p>{entry.summary}</p>
      {entry.tags.length ? (
        <ul className="tag-list" aria-label="Tags">
          {entry.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export function ContentCollection({
  title,
  entries,
}: {
  title: string;
  entries: ContentEntry[];
}) {
  return (
    <section className="collection-page">
      <p className="eyebrow">Index / {title}</p>
      <h1>{title}</h1>
      {entries.length ? (
        <div className="content-list">
          {entries.map((entry) => (
            <ContentCard key={entry.slug} entry={entry} />
          ))}
        </div>
      ) : (
        <p className="empty-state">Nothing published here yet.</p>
      )}
    </section>
  );
}
