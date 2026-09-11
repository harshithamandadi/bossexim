import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SplitLayoutProps {
  aside: ReactNode;
  children: ReactNode;
  /** Keep the aside pinned while the main column scrolls (desktop only). */
  stickyAside?: boolean;
  className?: string;
}

/** The recurring "narrow heading column + wide content column" layout. */
export function SplitLayout({ aside, children, stickyAside = false, className }: SplitLayoutProps) {
  return (
    <div className={cn("grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20", className)}>
      <div className={cn(stickyAside && "lg:sticky lg:top-36 lg:self-start")}>{aside}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
