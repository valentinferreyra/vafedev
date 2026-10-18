import Link from "next/link";
import { getCollection } from "@/lib/content/repository";
import { education, profile } from "@/lib/profile";

export default function HomePage() {
  const contributions = getCollection("projects").slice(0, 3);
  return (
    <div className="home-page home-story">
      <section className="home-hero">
        <p className="eyebrow">Backend engineer &amp; university instructor</p>
        <h1>{profile.name}</h1>
        <p className="home-lead">I build backend platforms and help developers understand the decisions behind them.</p>
        <div className="home-links"><Link href="#contributions">Explore my work ↓</Link><Link href="/about">More about me ↗</Link></div>
      </section>
      <section className="home-section story-block" aria-labelledby="work-title">
        <p className="eyebrow">01 / Professional experience</p>
        <div className="section-heading"><h2 id="work-title">Work</h2></div>
        <h3>Mercado Libre</h3>
        <p className="story-meta">Semi Senior Software Engineer · February 2025 – Present</p>
        <p>I build capabilities for customer service representatives and the teams developing applications on our CRM platform. My work includes event delivery, configuration, traceability, and operating backend systems.</p>
        <Link href="/timeline">See my professional experience ↗</Link>
      </section>
      <section className="home-section story-block" aria-labelledby="teaching-title">
        <p className="eyebrow">02 / Teaching</p>
        <div className="section-heading"><h2 id="teaching-title">Teaching</h2></div>
        <h3>Universidad Nacional de Quilmes</h3>
        <p className="story-meta">Estrategias de Persistencia · Instructor since March 2026</p>
        <p>I help students build their first APIs and reason about persistence choices. I also mentor project teams through code reviews, Git workflows, and design decisions.</p>
        <Link href="/timeline">Explore my teaching journey ↗</Link>
      </section>
      <section className="home-section story-block" aria-labelledby="education-title">
        <p className="eyebrow">03 / Studies</p>
        <div className="section-heading"><h2 id="education-title">Education</h2></div>
        <ul className="home-education">{education.map((item) => <li key={item.name}><h3>{item.name}</h3><p className="story-meta">{item.note}</p></li>)}</ul>
      </section>
      <section id="contributions" className="home-section story-block" aria-labelledby="contributions-title">
        <p className="eyebrow">04 / Selected work</p>
        <div className="section-heading"><h2 id="contributions-title">Selected contributions</h2></div>
        <div className="home-contributions">{contributions.map((entry) => (
          <article key={entry.slug}><h3><Link href={`/projects/${entry.slug}`}>{entry.title}</Link></h3><p>{entry.summary}</p></article>
        ))}</div>
        <Link href="/projects">All contributions ↗</Link>
      </section>
      <section className="home-section story-block home-contact" aria-labelledby="contact-title">
        <p className="eyebrow">05 / Contact</p>
        <div className="section-heading"><h2 id="contact-title">Let’s talk</h2></div>
        <p>I’m here to share work, exchange ideas, and connect with other developers and teams.</p>
        <Link href="/contact">Get in touch ↗</Link>
      </section>
    </div>
  );
}
