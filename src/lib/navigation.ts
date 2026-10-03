import type { CollectionName } from "@/lib/content/types";

export type NavigationItem = {
  label: string;
  href: string;
  collection?: CollectionName;
};

export type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

const groups: NavigationGroup[] = [
  {
    label: "Profile",
    items: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Timeline", href: "/timeline" },
      { label: "Projects", href: "/projects", collection: "projects" },
      { label: "Learning", href: "/learning", collection: "learning" },
      { label: "Designs", href: "/designs", collection: "designs" },
      { label: "Blog", href: "/blog", collection: "blog" },
      { label: "Goals", href: "/goals", collection: "goals" },
      { label: "Skills", href: "/skills" },
      { label: "Tools", href: "/tools" },
      { label: "Books", href: "/books", collection: "books" },
    ],
  },
];

export function getNavigation(): NavigationGroup[] {
  return groups;
}
