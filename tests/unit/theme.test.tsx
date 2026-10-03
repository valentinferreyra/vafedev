import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { themeInitializer } from "@/components/theme/theme-script";
import { ThemeToggle } from "@/components/theme/theme-toggle";

function runInitializer() {
  window.eval(themeInitializer);
}

describe("theme initialization", () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = "dark";
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    [null, "light"],
    ["light", "light"],
    ["dark", "dark"],
    ["sepia", "light"],
  ])("uses %s as a saved preference and resolves to %s", (stored, expected) => {
    if (stored) localStorage.setItem("vafedev-theme", stored);
    const matchMedia = vi.fn();
    Object.defineProperty(window, "matchMedia", { configurable: true, value: matchMedia });

    runInitializer();

    expect(document.documentElement.dataset.theme).toBe(expected);
    expect(matchMedia).not.toHaveBeenCalled();
  });

  it("falls back to light when storage cannot be read", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });

    expect(runInitializer).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = "light";
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("switches to dark and persists the choice", () => {
    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole("button", { name: /switch to dark theme/i }));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("vafedev-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: /switch to light theme/i })).toHaveTextContent(
      "Light",
    );
  });

  it("stays usable when storage cannot be written", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    render(<ThemeToggle />);

    expect(() => {
      fireEvent.click(screen.getByRole("button", { name: /switch to dark theme/i }));
    }).not.toThrow();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("reflects a dark theme applied before hydration", async () => {
    document.documentElement.dataset.theme = "dark";
    render(<ThemeToggle />);

    await act(async () => {});

    expect(screen.getByRole("button", { name: /switch to light theme/i })).toHaveTextContent(
      "Light",
    );
  });
});
