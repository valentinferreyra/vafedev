import type { MetadataRoute } from "next";

import { getCollection } from "@/lib/content/repository";
import { COLLECTIONS } from "@/lib/content/types";
import { buildSitemap } from "@/lib/discovery";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(COLLECTIONS.flatMap((collection) => getCollection(collection)));
}
