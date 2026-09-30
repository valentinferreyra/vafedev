"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavigationGroup } from "@/lib/navigation";

type SiteNavigationProps = {
  groups: NavigationGroup[];
  label: string;
  onNavigate?: () => void;
};

export function SiteNavigation({ groups, label, onNavigate }: SiteNavigationProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="site-navigation">
      {groups.map((group) => (
        <div key={group.label} className="nav-group">
          <ul>
            {group.items.map((item) => {
              const current =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    onClick={onNavigate}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
