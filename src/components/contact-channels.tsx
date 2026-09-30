"use client";

import { useState } from "react";

const channels = [
  { name: "Email", label: "valentinferreyradev@gmail.com", href: "mailto:valentinferreyradev@gmail.com", path: "M3 5h18v14H3z M3 5l9 7 9-7" },
  { name: "LinkedIn", label: "valentinferreyra", href: "https://www.linkedin.com/in/valentinferreyra", path: "M4 9v11 M4 4v.5 M9 20V9h5v2c2-4 6-2 6 2v7 M14 11v9" },
  { name: "GitHub", label: "valentinferreyra", href: "https://github.com/valentinferreyra", path: "M9 21v-4c-4 1-4-2-6-2 M15 21v-4c0-1-.5-2-1-2 4-.5 6-2 6-6 0-2-1-3-1-3 0-1 0-3-.5-3-2 0-3 1-3 1-2-.5-5-.5-7 0 0 0-1-1-3-1-.5 0-.5 2-.5 3-1 1-1 2-1 3 0 4 2 5.5 6 6-.5 0-1 1-1 2" },
  { name: "X", label: "@vafedev", href: "https://x.com/vafedev", path: "M4 3h4l12 18h-4z M20 3L4 21" },
];

export function ContactChannels() {
  const [message, setMessage] = useState("");
  async function copyDiscord() {
    try {
      await navigator.clipboard.writeText("valenttinf");
      setMessage("Username copied.");
    } catch {
      setMessage("Copy this username: valenttinf");
    }
  }
  return (
    <>
      <ul className="contact-channels">
        {channels.map(({ name, label, href, path }) => (
          <li key={name}>
            <a href={href}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} /></svg>
              <span><strong>{name}</strong><span>{label}</span></span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={copyDiscord} aria-label="Copy Discord username valenttinf">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 4l-3 1c-2 4-3 8-3 12l5 3 2-3 M16 4l3 1c2 4 3 8 3 12l-5 3-2-3 M5 16c4 2 10 2 14 0 M8 5c3-1 5-1 8 0" /><circle cx="8" cy="12" r="1" /><circle cx="16" cy="12" r="1" /></svg>
            <span><strong>Discord</strong><span>valenttinf</span></span>
            <span className="contact-action">Copy username</span>
          </button>
        </li>
      </ul>
      <p role="status" className="contact-status">{message}</p>
    </>
  );
}
