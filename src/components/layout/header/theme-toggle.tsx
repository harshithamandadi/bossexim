"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { uiLabels } from "@/config/ui";
import { cn } from "@/lib/cn";
import { EASE_SMOOTH } from "@/lib/motion";

export const THEME_STORAGE_KEY = "bgexim-theme";

/** Runs before the page paints (see site-shell.tsx), so a saved dark choice never flashes light. */
export const THEME_INIT_SCRIPT = `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

type Theme = "light" | "dark";

const listeners = new Set<() => void>();
const readTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked; the choice then lasts for this page view only.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Light / dark switch in the header. Defaults to light; the choice is remembered on this device. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light" as Theme);
  const isDark = theme === "dark";
  const label = isDark ? uiLabels.lightMode : uiLabels.darkMode;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-10 place-items-center rounded-full text-fg transition-colors hover:bg-white/10",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
          transition={{ duration: 0.25, ease: EASE_SMOOTH }}
          className="grid place-items-center"
        >
          {isDark ? <Sun aria-hidden className="size-[18px]" /> : <Moon aria-hidden className="size-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
