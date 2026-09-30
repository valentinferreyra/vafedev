import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";

export function Callout({ children }: { children: ReactNode }) {
  return <aside className="mdx-callout">{children}</aside>;
}

export function Figure({
  children,
  caption,
}: {
  children: ReactNode;
  caption?: string;
}) {
  return (
    <figure className="mdx-figure">
      {children}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export function RelatedContent({
  collection,
  slug,
  children,
}: {
  collection: string;
  slug: string;
  children: ReactNode;
}) {
  return <Link href={`/${collection}/${slug}`}>{children}</Link>;
}

export const mdxComponents: MDXComponents = {
  h1: (props) => <h1 className="mdx-h1" {...props} />,
  h2: (props) => <h2 className="mdx-h2" {...props} />,
  h3: (props) => <h3 className="mdx-h3" {...props} />,
  p: (props) => <p className="mdx-paragraph" {...props} />,
  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) => (
    <Link href={href} {...props} />
  ),
  ul: (props) => <ul className="mdx-list" {...props} />,
  ol: (props) => <ol className="mdx-list" {...props} />,
  li: (props) => <li {...props} />,
  code: (props) => <code {...props} />,
  pre: (props) => <pre className="mdx-pre" {...props} />,
  blockquote: (props) => <blockquote className="mdx-quote" {...props} />,
  Callout,
  Figure,
  RelatedContent,
};
