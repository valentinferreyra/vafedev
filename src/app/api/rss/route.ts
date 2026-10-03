import { getCollection } from "@/lib/content/repository";
import { buildRss } from "@/lib/discovery";

export function GET() {
  return new Response(buildRss(getCollection("blog")), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
