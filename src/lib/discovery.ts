import type { MetadataRoute } from "next";

import type { ContentEntry } from "@/lib/content/types";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const staticRoutes = ["/", "/about", "/timeline", "/skills", "/tools", "/contact"];

export function buildSitemap(entries: ContentEntry[]): MetadataRoute.Sitemap {
  const publicEntries = entries.filter(({ draft }) => !draft);
  const populated = new Set(publicEntries.map(({ collection }) => collection));
  const collectionRoutes = [...populated].map((collection) => `/${collection}`);
  const detailRoutes = publicEntries.map(
    ({ collection, slug }) => `/${collection}/${slug}`,
  );

  return [...staticRoutes, ...collectionRoutes, ...detailRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
  }));
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildRss(entries: ContentEntry[]): string {
  const items = entries
    .filter(({ draft }) => !draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((entry) => {
      const url = `${SITE_URL}/blog/${entry.slug}`;
      return `<item><title>${escapeXml(entry.title)}</title><link>${url}</link><guid>${url}</guid><description>${escapeXml(entry.summary)}</description><pubDate>${new Date(`${entry.date}T00:00:00Z`).toUTCString()}</pubDate></item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(SITE_NAME)}</title><link>${SITE_URL}</link><description>${escapeXml(SITE_DESCRIPTION)}</description>${items}</channel></rss>`;
}
