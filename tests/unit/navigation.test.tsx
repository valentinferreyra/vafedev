import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { SiteNavigation } from "@/components/layout/site-navigation";
import { getNavigation } from "@/lib/navigation";

let pathname = "/about";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

const everyCollection = new Set([
  "projects",
  "learning",
  "designs",
  "blog",
  "goals",
  "books",
] as const);

describe("navigation model", () => {
  it("keeps the approved primary and secondary order", () => {
    const [primary, secondary] = getNavigation(everyCollection);

    expect(primary.items.map(({ label }) => label)).toEqual([
      "Home",
      "About",
      "Timeline",
      "Projects",
      "Learning",
      "Designs",
    ]);
    expect(secondary.items.map(({ label }) => label)).toEqual([
      "Blog",
      "Goals",
      "Skills",
      "Tools",
      "Books",
    ]);
  });

  it("omits empty collections while keeping static routes", () => {
    const groups = getNavigation(new Set());
    expect(groups.flatMap(({ items }) => items.map(({ label }) => label))).toEqual([
      "Home",
      "About",
      "Timeline",
      "Skills",
      "Tools",
    ]);
  });
});

describe("SiteNavigation", () => {
  beforeEach(() => {
    pathname = "/about";
  });

  it("marks the current route and keeps disclosure groups independent", () => {
    render(<SiteNavigation groups={getNavigation(everyCollection)} label="Primary" />);

    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const details = document.querySelectorAll("details");
    expect(details).toHaveLength(2);
    expect(details[0]).toHaveAttribute("open");
    expect(details[1]).toHaveAttribute("open");

    fireEvent.click(within(details[0]).getByText("Profile"));

    expect(details[0]).not.toHaveAttribute("open");
    expect(details[1]).toHaveAttribute("open");
  });
});

describe("MobileNavigation", () => {
  it("opens, traps focus, closes with Escape, and restores trigger focus", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation groups={getNavigation(everyCollection)} />);
    const trigger = screen.getByRole("button", { name: "Open index" });

    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Site index" });
    const close = within(dialog).getByRole("button", { name: "Close index" });
    expect(close).toHaveFocus();

    await user.tab({ shift: true });
    expect(within(dialog).getByRole("button", { name: /switch to dark theme/i })).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Site index" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes with its labeled close control", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation groups={getNavigation(everyCollection)} />);
    await user.click(screen.getByRole("button", { name: "Open index" }));

    await user.click(screen.getByRole("button", { name: "Close index" }));

    expect(screen.queryByRole("dialog", { name: "Site index" })).not.toBeInTheDocument();
  });

  it("includes a theme control in mobile navigation", async () => {
    const user = userEvent.setup();
    render(<MobileNavigation groups={getNavigation(everyCollection)} />);
    await user.click(screen.getByRole("button", { name: "Open index" }));

    expect(screen.getByRole("button", { name: /switch to dark theme/i })).toBeInTheDocument();
  });
});
