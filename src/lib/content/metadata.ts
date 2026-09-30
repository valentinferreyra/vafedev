import type { Metadata } from "next";

import { SITE_URL } from "@/lib/site";
import type { ContentEntry } from "./types";

export function buildContentMetadata(entry: ContentEntry): Metadata {
  const url = `${SITE_URL}/${entry.collection}/${entry.slug}`;
  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical: url },
    openGraph: { title: entry.title, description: entry.summary, url },
  };
}
