"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import type { NavigationGroup } from "@/lib/navigation";
import { SiteNavigation } from "./site-navigation";

type MobileNavigationProps = {
  groups: NavigationGroup[];
};

export function MobileNavigation({ groups }: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), summary',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="mobile-navigation">
      <div className="mobile-bar">
        <Link className="mobile-brand" href="/">
          VF/DEV
        </Link>
        <button
          ref={triggerRef}
          type="button"
          className="index-trigger"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          Open index
        </button>
      </div>
      {open ? (
        <div className="mobile-overlay" onMouseDown={close}>
          <div
            ref={panelRef}
            className="mobile-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site index"
            onKeyDown={handleKeyDown}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mobile-panel-head">
              <span>Index</span>
              <button type="button" onClick={close} aria-label="Close index">
                Close
              </button>
            </div>
            <SiteNavigation groups={groups} label="Mobile" onNavigate={close} />
            <div className="mobile-panel-foot">
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
