import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CollectionPage, {
  generateStaticParams as generateCollectionParams,
} from "@/app/[collection]/page";
import DetailPage, {
  generateStaticParams as generateDetailParams,
} from "@/app/[collection]/[slug]/page";
import { ContentCollection } from "@/components/content/content-card";
import { RelatedEntries } from "@/components/content/content-detail";
import { mdxComponents } from "@/components/content/mdx-components";
import { buildContentMetadata } from "@/lib/content/metadata";
import type { ContentEntry } from "@/lib/content/types";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

const entry: ContentEntry = {
  collection: "projects",
  slug: "sample-project",
  title: "Sample project",
  summary: "A public project summary.",
  date: "2026-09-20",
  draft: false,
  status: "Completed",
  tags: ["architecture"],
  related: [{ collection: "designs", slug: "modular-design" }],
  source: "Project body.",
};

describe("content presentation", () => {
  it("lists public entries with their metadata", () => {
    render(<ContentCollection title="Projects" entries={[entry]} />);

    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sample project" })).toHaveAttribute(
      "href",
      "/projects/sample-project",
    );
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("architecture")).toBeInTheDocument();
  });

  it("renders an intentional empty collection state", () => {
    render(<ContentCollection title="Books" entries={[]} />);

    expect(screen.getByText("Nothing published here yet.")).toBeInTheDocument();
  });

  it("links related entries through their declared collection", () => {
    render(
      <RelatedEntries
        relations={[{ collection: "designs", slug: "modular-design" }]}
      />,
    );

    expect(screen.getByRole("link", { name: "Modular design" })).toHaveAttribute(
      "href",
      "/designs/modular-design",
    );
  });

  it("exposes only the approved MDX components", () => {
    expect(Object.keys(mdxComponents).sort()).toEqual(
      [
        "Callout",
        "Figure",
        "RelatedContent",
        "a",
        "blockquote",
        "code",
        "h1",
        "h2",
        "h3",
        "li",
        "ol",
        "p",
        "pre",
        "ul",
      ].sort(),
    );
  });
});

describe("content routes", () => {
  it("generates every collection index but no draft detail route", async () => {
    expect(generateCollectionParams()).toEqual([
      { collection: "projects" },
      { collection: "learning" },
      { collection: "designs" },
      { collection: "blog" },
      { collection: "goals" },
      { collection: "books" },
    ]);
    expect(generateDetailParams()).toEqual([
      { collection: "projects", slug: "crm-realtime" },
      { collection: "designs", slug: "crm-case-traceability" },
    ]);
  });

  it("renders a valid empty collection route", async () => {
    render(await CollectionPage({ params: Promise.resolve({ collection: "books" }) }));
    expect(screen.getByRole("heading", { name: "Books" })).toBeInTheDocument();
  });

  it("returns not-found for an invalid collection", async () => {
    await expect(
      CollectionPage({ params: Promise.resolve({ collection: "unknown" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("returns not-found for unknown and draft detail slugs", async () => {
    await expect(
      DetailPage({
        params: Promise.resolve({ collection: "projects", slug: "unknown" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(
      DetailPage({
        params: Promise.resolve({ collection: "projects", slug: "project-template" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("builds title, summary, and canonical metadata", () => {
    expect(buildContentMetadata(entry)).toMatchObject({
      title: "Sample project",
      description: "A public project summary.",
      alternates: { canonical: "https://vafedev.me/projects/sample-project" },
    });
  });
});
