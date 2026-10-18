import { notFound } from "next/navigation";

import { ContentCollection } from "@/components/content/content-card";
import { BooksPreview } from "@/components/books-preview";
import { getCollection } from "@/lib/content/repository";
import { COLLECTIONS, isCollectionName } from "@/lib/content/types";

const titles: Record<(typeof COLLECTIONS)[number], string> = {
  projects: "Projects",
  learning: "Learning",
  designs: "Designs",
  blog: "Blog",
  goals: "Goals",
  books: "Books",
};

export function generateStaticParams() {
  return COLLECTIONS.map((collection) => ({ collection }));
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  if (!isCollectionName(collection)) notFound();
  if (collection === "books" && getCollection("books").length === 0) return <BooksPreview />;
  return <ContentCollection title={titles[collection]} entries={getCollection(collection)} />;
}
