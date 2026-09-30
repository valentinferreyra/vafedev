import { describe, expect, it } from "vitest";

import { SITE_URL } from "@/lib/site";

describe("site identity", () => {
  it("uses the canonical vafedev domain", () => {
    expect(SITE_URL).toBe("https://vafedev.me");
  });
});
