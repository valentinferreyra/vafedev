import Link from "next/link";

import { sortTimeline, timeline } from "@/lib/profile";

export default function TimelinePage() {
  const entries = sortTimeline(timeline);
  return (
    <section className="profile-page">
      <p className="eyebrow">Profile / Timeline</p>
      <h1>Timeline</h1>
      {entries.length ? (
        <ol className="timeline-list">
          {entries.map((entry) => (
            <li key={`${entry.date}-${entry.title}`}>
              <time dateTime={entry.date}>{entry.date}</time>
              <div>
                <h2>
                  {entry.href ? <Link href={entry.href}>{entry.title}</Link> : entry.title}
                </h2>
                <p>{entry.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="empty-state">No milestones published yet.</p>
      )}
    </section>
  );
}
