import { profile } from "@/lib/profile";

export default function AboutPage() {
  return (
    <article className="profile-page">
      <p className="eyebrow">Profile / About</p>
      <h1>About</h1>
      <p className="profile-intro">
        {profile.name} · {profile.role} · {profile.location}
      </p>
      <div className="narrative">
        {profile.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
