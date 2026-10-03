import type { Metadata } from "next";

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Software Developer`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${SITE_NAME} | Software Developer`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Software Developer`,
    description: SITE_DESCRIPTION,
  },
};
