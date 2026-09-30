import type { ReactNode } from "react";
import Link from "next/link";

import { getPopulatedCollections } from "@/lib/content/repository";
import { getNavigation } from "@/lib/navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MobileNavigation } from "./mobile-navigation";
import { SiteNavigation } from "./site-navigation";

export function SiteShell({ children }: { children: ReactNode }) {
  const groups = getNavigation(getPopulatedCollections());

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside id="site-index" className="desktop-sidebar">
        <Link className="brand" href="/">
          VF/DEV
        </Link>
        <div className="identity">
          <strong><em>Va</em>lentín<br /><em>Fe</em>rreyra<i className="identity-cursor" aria-hidden="true" /></strong>
          <span>Software developer<br />Buenos Aires, Argentina</span>
        </div>
        <SiteNavigation groups={groups} label="Site index" />
        <div className="sidebar-foot">
          <span className="availability">Working on something new</span>
          <ThemeToggle />
        </div>
      </aside>
      <MobileNavigation groups={groups} />
      <main id="main-content" className="site-main">
        {children}
      </main>
    </div>
  );
}
