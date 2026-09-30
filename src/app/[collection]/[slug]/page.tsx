import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentDetail } from "@/components/content/content-detail";
import { buildContentMetadata } from "@/lib/content/metadata";
import { getCollection, getEntry } from "@/lib/content/repository";
import {
  COLLECTIONS,
  isCollectionName,
} from "@/lib/content/types";

type DetailParams = { collection: string; slug: string };

export function generateStaticParams() {
  return COLLECTIONS.flatMap((collection) =>
    getCollection(collection).map(({ slug }) => ({ collection, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<DetailParams>;
}): Promise<Metadata> {
  const { collection, slug } = await params;
  if (!isCollectionName(collection)) notFound();
  const entry = getEntry(collection, slug);
  if (!entry) notFound();
  return buildContentMetadata(entry);
}

export default async function DetailPage({
  params,
}: {
  params: Promise<DetailParams>;
}) {
  const { collection, slug } = await params;
  if (!isCollectionName(collection)) notFound();
  const entry = getEntry(collection, slug);
  if (!entry) notFound();
  return <ContentDetail entry={entry} />;
}
