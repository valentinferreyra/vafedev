import Link from "next/link";

import { getCollection } from "@/lib/content/repository";
import { profile, sortTimeline, timeline } from "@/lib/profile";

export default function HomePage() {
  const milestones = sortTimeline(timeline).slice(0, 3);
  const featuredDesign = getCollection("designs")[0];

  return (
    <div className="home-page">
      <div className="page-path">
        <span>Home / Overview</span>
        <span>Open to meaningful problems</span>
      </div>

      <section className="home-hero">
        <p className="eyebrow">Software developer · Profile 2026</p>
        <h1>{profile.headline}</h1>
        <p className="home-lead">{profile.introduction}</p>
        <ul className="keyword-list" aria-label="Areas of interest">
          <li>Backend systems</li>
          <li>Architecture</li>
          <li>Product thinking</li>
        </ul>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <h2>Now</h2>
          <span>Current focus</span>
        </div>
        <div className="home-row">
          <span>Today</span>
          <div>
            <h3>{profile.currentFocus.title}</h3>
            <p>{profile.currentFocus.summary}</p>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <h2>Selected milestones</h2>
          <span>Timeline</span>
        </div>
        {milestones.length ? (
          milestones.map((milestone) => (
            <div className="home-row" key={`${milestone.date}-${milestone.title}`}>
              <time dateTime={milestone.date}>{milestone.date.slice(0, 4)}</time>
              <div>
                <h3>
                  {milestone.href ? (
                    <Link href={milestone.href}>{milestone.title}</Link>
                  ) : (
                    milestone.title
                  )}
                </h3>
                <p>{milestone.summary}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="section-empty">No milestones published yet.</p>
        )}
      </section>

      {featuredDesign ? (
        <section className="home-section">
          <div className="section-heading">
            <h2>Featured design</h2>
            <span>Design note</span>
          </div>
          <div className="featured-design">
            <h3>
              <Link href={`/designs/${featuredDesign.slug}`}>{featuredDesign.title}</Link>
            </h3>
            <p>{featuredDesign.summary}</p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
