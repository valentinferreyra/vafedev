import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound from "@/app/not-found";
import robots from "@/app/robots";
import { buildRss, buildSitemap } from "@/lib/discovery";
import type { ContentEntry } from "@/lib/content/types";
import { SITE_LANGUAGE, SITE_URL } from "@/lib/site";
import { siteMetadata } from "@/lib/site-metadata";

const publicBlog: ContentEntry = {
  collection: "blog",
  slug: "a-and-b",
  title: "A & B <C>",
  summary: "Notes about <systems> & trade-offs.",
  date: "2026-09-20",
  draft: false,
  tags: [],
  related: [],
  source: "Body",
};

const newerBlog: ContentEntry = {
  ...publicBlog,
  slug: "newer-post",
  title: "Newer post",
  summary: "A newer note.",
  date: "2026-09-21",
};

describe("site discovery", () => {
  it("uses English and the canonical vafedev domain", () => {
    expect(SITE_LANGUAGE).toBe("en");
    expect(siteMetadata.metadataBase?.toString()).toBe("https://vafedev.me/");
    expect(siteMetadata.alternates).toMatchObject({ canonical: SITE_URL });
    expect(siteMetadata.title).toMatchObject({
      default: "Valentín Ferreyra | Software Developer",
    });
  });

  it("builds a sitemap from static routes and public content only", () => {
    const draft = { ...publicBlog, slug: "draft-post", draft: true };
    const urls = buildSitemap([publicBlog, draft]).map(({ url }) => url);

    expect(urls).toContain(`${SITE_URL}/`);
    expect(urls).toContain(`${SITE_URL}/about`);
    expect(urls).toContain(`${SITE_URL}/blog`);
    expect(urls).toContain(`${SITE_URL}/blog/a-and-b`);
    expect(urls).not.toContain(`${SITE_URL}/projects`);
    expect(urls).not.toContain(`${SITE_URL}/blog/draft-post`);
  });

  it("references the canonical sitemap from robots", () => {
    expect(robots()).toMatchObject({ sitemap: `${SITE_URL}/sitemap.xml` });
  });

  it("builds descending RSS with absolute escaped URLs and text", () => {
    const xml = buildRss([publicBlog, newerBlog, { ...publicBlog, draft: true }]);

    expect(xml.indexOf("Newer post")).toBeLessThan(xml.indexOf("A &amp; B &lt;C&gt;"));
    expect(xml).toContain(`${SITE_URL}/blog/a-and-b`);
    expect(xml).toContain("Notes about &lt;systems&gt; &amp; trade-offs.");
    expect(xml).not.toContain("draft-post");
  });
});

describe("not found", () => {
  it("offers Home and Index recovery links", () => {
    render(<NotFound />);

    expect(screen.getByRole("link", { name: "Back home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Open site index" })).toHaveAttribute(
      "href",
      "/#site-index",
    );
  });
});
