"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { contactLink, mainNavigation, routes, siteConfig, uiLabels } from "@/config";
import { useIsScrolled } from "@/hooks/use-is-scrolled";
import { cn } from "@/lib/cn";
import { SPRING_ISLAND } from "@/lib/motion";
import { isActivePath } from "@/lib/navigation";
import { DesktopPanel } from "./desktop-panel";
import { MobileMenu } from "./mobile-menu";

const ISLAND_RADIUS = 26;
const MOBILE_MENU_ID = "mobile-menu";

/**
 * "Dynamic island" navigation: a floating pill that morphs open to reveal a
 * section's links on hover (desktop) or the full menu (mobile).
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isScrolled = useIsScrolled();
  const [openGroupLabel, setOpenGroupLabel] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const openGroup = mainNavigation.find((group) => group.label === openGroupLabel);
  const isExpanded = Boolean(openGroup) || isMobileOpen;

  const closeAll = useCallback(() => {
    setOpenGroupLabel(null);
    setIsMobileOpen(false);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeAll]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3">
      <motion.div
        layout
        data-tone="dark"
        transition={SPRING_ISLAND}
        style={{ borderRadius: ISLAND_RADIUS }}
        onMouseLeave={() => setOpenGroupLabel(null)}
        className={cn(
          // relative: anchors the outgoing menu panel while it fades out (popLayout).
          "pointer-events-auto relative w-full max-w-md overflow-hidden bg-canvas/75 text-fg ring-1 ring-white/10",
          "backdrop-blur-2xl backdrop-saturate-150 transition-[background-color,box-shadow] duration-500 xl:w-auto xl:max-w-none",
          (isScrolled || isExpanded) && "bg-canvas/90 shadow-[0_24px_60px_-24px_rgb(0_0_0/0.55)]",
        )}
      >
        <motion.div layout="position" className="flex h-13 items-center gap-2 pr-2 pl-3.5">
          <Link
            href={routes.home}
            onClick={closeAll}
            aria-label={`${siteConfig.company.name} — home`}
            className="shrink-0 rounded-full"
          >
            <Logo />
          </Link>

          <nav aria-label={uiLabels.mainNavigation} className="ml-3 hidden xl:block">
            <ul className="flex items-center">
              {mainNavigation.map((group) => {
                const isOpen = group.label === openGroupLabel;
                const isCurrent = isActivePath(pathname, group.href);
                return (
                  <li key={group.label}>
                    <Link
                      href={group.href}
                      onClick={closeAll}
                      onMouseEnter={() => setOpenGroupLabel(group.label)}
                      onFocus={() => setOpenGroupLabel(group.label)}
                      aria-current={isCurrent ? "page" : undefined}
                      className={cn(
                        "block rounded-full px-3 py-2 text-[13px] font-medium whitespace-nowrap text-fg/70 transition-colors duration-300 hover:text-fg",
                        (isOpen || isCurrent) && "text-fg",
                        isOpen && "bg-white/10",
                      )}
                    >
                      {group.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 pl-2">
            <ButtonLink href={contactLink.href} onClick={closeAll} size="sm" className="hidden sm:inline-flex">
              {contactLink.label}
            </ButtonLink>
            <button
              type="button"
              onClick={() => setIsMobileOpen((open) => !open)}
              aria-expanded={isMobileOpen}
              aria-controls={MOBILE_MENU_ID}
              aria-label={isMobileOpen ? uiLabels.closeMenu : uiLabels.openMenu}
              className="grid size-10 place-items-center rounded-full transition-colors hover:bg-white/10 xl:hidden"
            >
              {isMobileOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            </button>
          </div>
        </motion.div>

        <AnimatePresence initial={false} mode="popLayout">
          {openGroup && <DesktopPanel key={openGroup.label} group={openGroup} onNavigate={closeAll} />}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {isMobileOpen && <MobileMenu id={MOBILE_MENU_ID} onNavigate={closeAll} />}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
