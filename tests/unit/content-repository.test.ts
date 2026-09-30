import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  getCollection,
  getEntry,
  getPopulatedCollections,
  validateContent,
} from "@/lib/content/repository";

const fixtures = path.join(process.cwd(), "tests/fixtures/content");
const root = (name: string) => path.join(fixtures, name);

describe("content repository", () => {
  it("parses valid metadata, sorts newest first, and excludes drafts", () => {
    const entries = getCollection("projects", { root: root("valid") });

    expect(entries.map(({ slug }) => slug)).toEqual(["newer-project", "older-project"]);
    expect(entries[0]).toMatchObject({
      title: "Newer project",
      tags: ["architecture"],
      related: [{ collection: "designs", slug: "modular-design" }],
      draft: false,
    });
  });

  it("can include drafts explicitly", () => {
    expect(
      getEntry("projects", "draft-project", {
        root: root("valid"),
        includeDrafts: true,
      }),
    ).toMatchObject({ slug: "draft-project", draft: true });
    expect(getEntry("projects", "draft-project", { root: root("valid") })).toBeNull();
  });

  it("reports only populated public collections", () => {
    expect(getPopulatedCollections({ root: root("valid") })).toEqual(
      new Set(["projects", "designs"]),
    );
  });

  it("rejects duplicate slugs", () => {
    expect(() => validateContent({ root: root("duplicates") })).toThrow(/duplicate slug/i);
  });

  it("rejects malformed dates", () => {
    expect(() => validateContent({ root: root("malformed") })).toThrow(/date/i);
  });

  it("rejects relations to missing entries", () => {
    expect(() => validateContent({ root: root("missing-relation") })).toThrow(
      /missing related entry/i,
    );
  });

  it("rejects relations to draft entries", () => {
    expect(() => validateContent({ root: root("draft-relation") })).toThrow(
      /draft related entry/i,
    );
  });

  it("rejects relations that declare the wrong collection", () => {
    expect(() => validateContent({ root: root("wrong-collection") })).toThrow(
      /wrong collection/i,
    );
  });

  it("returns an empty list for an absent collection directory", () => {
    expect(getCollection("books", { root: root("empty") })).toEqual([]);
  });
});
