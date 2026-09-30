import { tools } from "@/lib/profile";

export default function ToolsPage() {
  return (
    <section className="profile-page">
      <p className="eyebrow">Library / Tools</p>
      <h1>Tools</h1>
      {tools.length ? (
        <ul className="reference-list">
          {tools.map((tool) => (
            <li key={tool.name}>
              <h2>{tool.name}</h2>
              <p>{tool.note}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">No tools published yet.</p>
      )}
    </section>
  );
}
