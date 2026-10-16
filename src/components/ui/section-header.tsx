import type { ReactNode } from "react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./eyebrow";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "start" | "center";
  /** "page" renders the page's <h1>; "section" an <h2>. */
  level?: "page" | "section";
  /** "split": heading (and children) on the left, description on the right, on large screens. */
  layout?: "stacked" | "split";
  className?: string;
  children?: ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "start",
  level = "section",
  layout = "stacked",
  className,
  children,
}: SectionHeaderProps) {
  const Heading = level === "page" ? "h1" : "h2";

  if (layout === "split") {
    return (
      <RevealGroup className={cn("grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16", className)}>
        <div>
          {eyebrow && (
            <RevealItem>
              <Eyebrow>{eyebrow}</Eyebrow>
            </RevealItem>
          )}
          <RevealItem>
            <Heading className={cn(level === "page" ? "type-h1" : "type-h2", "text-balance", eyebrow && "mt-5")}>{title}</Heading>
          </RevealItem>
          {children && <RevealItem className="mt-8">{children}</RevealItem>}
        </div>
        {description && (
          <RevealItem className="lg:pt-10">
            <p className="type-lead text-pretty text-fg-mute">{description}</p>
          </RevealItem>
        )}
      </RevealGroup>
    );
  }

  return (
    <RevealGroup className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <RevealItem>
          <Eyebrow>{eyebrow}</Eyebrow>
        </RevealItem>
      )}
      <RevealItem>
        <Heading className={cn(level === "page" ? "type-h1" : "type-h2", "text-balance", eyebrow && "mt-5")}>
          {title}
        </Heading>
      </RevealItem>
      {description && (
        <RevealItem>
          <p className="type-lead mt-6 text-pretty text-fg-mute">{description}</p>
        </RevealItem>
      )}
      {children && <RevealItem className="mt-10">{children}</RevealItem>}
    </RevealGroup>
  );
}
