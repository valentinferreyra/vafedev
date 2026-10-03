"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  window.addEventListener("vafedev-theme-change", onChange);
  return () => window.removeEventListener("vafedev-theme-change", onChange);
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light");

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem("vafedev-theme", nextTheme);
    } catch {
      // The visual choice still works when storage is unavailable.
    }
    window.dispatchEvent(new Event("vafedev-theme-change"));
  }

  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Switch to ${nextTheme} theme`}
      onClick={toggleTheme}
    >
      <span>{theme === "light" ? "Dark" : "Light"}</span>
    </button>
  );
}
