import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AboutPage from "@/app/about/page";
import HomePage from "@/app/page";
import SkillsPage from "@/app/skills/page";
import TimelinePage from "@/app/timeline/page";
import ToolsPage from "@/app/tools/page";
import { profile, sortTimeline, type TimelineEntry } from "@/lib/profile";

describe("profile content", () => {
  it("uses only the known identity and explicit placeholder copy", () => {
    expect(profile).toMatchObject({
      name: "Valentín Ferreyra",
      role: "Software developer",
      location: "Buenos Aires, Argentina",
    });
    expect(profile.about.every((paragraph) => paragraph.startsWith("Placeholder:"))).toBe(
      true,
    );
  });

  it("sorts timeline entries newest first without dropping related links", () => {
    const entries: TimelineEntry[] = [
      {
        date: "2024-01-01",
        title: "Earlier milestone",
        summary: "Placeholder: earlier.",
      },
      {
        date: "2026-01-01",
        title: "Later milestone",
        summary: "Placeholder: later.",
        href: "/projects/example",
      },
    ];

    expect(sortTimeline(entries)).toEqual([entries[1], entries[0]]);
  });
});

describe("profile pages", () => {
  it("renders identity, current focus, and selected milestones on Home", () => {
    render(<HomePage />);

    expect(screen.getByText("Software developer · Profile 2026")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: profile.headline })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Now" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Selected milestones" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Featured design" })).not.toBeInTheDocument();
  });

  it("renders About as narrative placeholder content", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(screen.getAllByText(/^Placeholder:/)).toHaveLength(profile.about.length);
  });

  it("renders an intentional empty Timeline", () => {
    render(<TimelinePage />);
    expect(screen.getByRole("heading", { name: "Timeline" })).toBeInTheDocument();
    expect(screen.getByText("No milestones published yet.")).toBeInTheDocument();
  });

  it("renders honest Skills and Tools placeholders", () => {
    const { unmount } = render(<SkillsPage />);
    expect(screen.getByRole("heading", { name: "Skills" })).toBeInTheDocument();
    expect(screen.getByText("No skills published yet.")).toBeInTheDocument();
    unmount();

    render(<ToolsPage />);
    expect(screen.getByRole("heading", { name: "Tools" })).toBeInTheDocument();
    expect(screen.getByText("No tools published yet.")).toBeInTheDocument();
  });

  it("contains none of the Next.js starter copy", () => {
    const { container } = render(<HomePage />);
    expect(container).not.toHaveTextContent("To get started");
    expect(container).not.toHaveTextContent("Deploy Now");
  });
});
