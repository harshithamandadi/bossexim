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
  className?: string;
  children?: ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "start",
  level = "section",
  className,
  children,
}: SectionHeaderProps) {
  const Heading = level === "page" ? "h1" : "h2";

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
