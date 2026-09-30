import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">404 / Not found</p>
      <h1>This page is not part of the index.</h1>
      <p>The address may have changed, or the entry may not be published yet.</p>
      <div className="not-found-actions">
        <Link href="/">Back home</Link>
        <Link href="/#site-index">Open site index</Link>
      </div>
    </section>
  );
}
