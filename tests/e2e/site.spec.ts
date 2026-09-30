import { expect, test } from "@playwright/test";

test("starts light regardless of system preference and persists manual choices", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("link", { name: "About" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("remains usable when browser storage is denied", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("storage denied");
    };
    Storage.prototype.setItem = () => {
      throw new Error("storage denied");
    };
  });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("keeps the desktop index at 300px and keyboard reachable", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const sidebar = page.locator(".desktop-sidebar");

  await expect(sidebar).toBeVisible();
  expect(await sidebar.evaluate((element) => getComputedStyle(element).width)).toBe("300px");
  expect(await sidebar.evaluate((element) => getComputedStyle(element).position)).toBe(
    "sticky",
  );

  const focusedLabels = new Set<string>();
  for (let index = 0; index < 16; index += 1) {
    await page.keyboard.press("Tab");
    focusedLabels.add(
      await page.evaluate(() => document.activeElement?.textContent?.trim() ?? ""),
    );
  }
  for (const label of ["Home", "About", "Timeline"]) {
    expect(focusedLabels.has(label)).toBe(true);
  }
});

test("mobile index traps focus, closes with Escape, and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open index" });

  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Site index" });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: "Close index" })).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Switch to dark theme" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("unknown and draft routes use the shared not-found page", async ({ page }) => {
  for (const path of ["/unknown", "/projects/project-template"]) {
    await page.goto(path);
    await expect(
      page.getByRole("heading", { name: "This page is not part of the index." }),
    ).toBeVisible();
  }
});

test("the 320px layout has one main, ordered headings, no overflow, and visible focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");

  await expect(page.locator("main")).toHaveCount(1);
  const levels = await page.locator("h1, h2, h3, h4, h5, h6").evaluateAll((headings) =>
    headings.map((heading) => Number(heading.tagName.slice(1))),
  );
  expect(levels[0]).toBe(1);
  expect(levels.every((level, index) => index === 0 || level <= levels[index - 1] + 1)).toBe(
    true,
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);

  await page.keyboard.press("Tab");
  const focus = await page.evaluate(() => {
    const style = getComputedStyle(document.activeElement as Element);
    return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) };
  });
  expect(focus.style).not.toBe("none");
  expect(focus.width).toBeGreaterThanOrEqual(2);
});
