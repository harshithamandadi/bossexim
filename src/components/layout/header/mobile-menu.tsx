"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { contactLink, mainNavigation, uiLabels } from "@/config";
import { EASE_APPLE } from "@/lib/motion";

const ITEM_STAGGER = 0.04;

export function MobileMenu({ id, onNavigate }: { id: string; onNavigate: () => void }) {
  return (
    <motion.nav
      id={id}
      aria-label={uiLabels.mobileNavigation}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-h-[calc(100dvh-5.5rem)] overflow-y-auto px-2 pb-3 xl:hidden"
    >
      <ul className="divide-y divide-border">
        {mainNavigation.map((group, index) => (
          <motion.li
            key={group.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + index * ITEM_STAGGER, duration: 0.5, ease: EASE_APPLE }}
            className="py-3"
          >
            <Link href={group.href} onClick={onNavigate} className="type-h4 block px-3 py-1.5">
              {group.label}
            </Link>
            <ul className="mt-1 grid grid-cols-2 gap-x-2">
              {group.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className="block rounded-lg px-3 py-1.5 text-sm text-fg-mute transition-colors hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ul>
      <ButtonLink href={contactLink.href} onClick={onNavigate} className="mt-2 w-full" withArrow>
        {contactLink.label}
      </ButtonLink>
    </motion.nav>
  );
}
