import Link from "next/link";

import { education, sortTimeline, timeline } from "@/lib/profile";

export default function TimelinePage() {
  const entries = sortTimeline(timeline);
  return (
    <section className="profile-page">
      <p className="eyebrow">Profile / Timeline</p>
      <h1>Timeline</h1>
      {["Professional experience", "Teaching"].map((category) => (
        <section key={category} aria-label={category}>
          <h2>{category}</h2>
        <ol className="timeline-list">
          {entries.filter((entry) => entry.category === category).map((entry) => (
            <li key={`${entry.date}-${entry.title}`}>
              <time dateTime={entry.date}>{entry.period ?? entry.date}</time>
              <div>
                <h3>
                  {entry.href ? <Link href={entry.href}>{entry.title}</Link> : entry.title}
                </h3>
                <p>{entry.summary}</p>
              </div>
            </li>
          ))}
        </ol>
        </section>
      ))}
      <section aria-label="Education">
        <h2>Education</h2>
        <ul className="reference-list">
          {education.map((item) => (
            <li key={item.name}><h3>{item.name}</h3><p>{item.note}</p></li>
          ))}
        </ul>
      </section>
    </section>
  );
}
