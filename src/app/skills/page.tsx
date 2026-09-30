import { skills } from "@/lib/profile";

export default function SkillsPage() {
  return (
    <section className="profile-page">
      <p className="eyebrow">Library / Skills</p>
      <h1>Skills</h1>
      {skills.length ? (
        <ul className="reference-list">
          {skills.map((skill) => (
            <li key={skill.name}>
              <h2>{skill.name}</h2>
              <p>{skill.note}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">No skills published yet.</p>
      )}
    </section>
  );
}
