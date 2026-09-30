import type { Metadata } from "next";
import { Geist_Mono, IBM_Plex_Sans } from "next/font/google";

import { ThemeScript } from "@/components/theme/theme-script";
import { SiteShell } from "@/components/layout/site-shell";
import {
  SITE_LANGUAGE,
} from "@/lib/site";
import { siteMetadata } from "@/lib/site-metadata";
import "./globals.css";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={SITE_LANGUAGE}
      data-theme="light"
      suppressHydrationWarning
      className={`${plex.variable} ${geistMono.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
