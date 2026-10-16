import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { DottedGlobe } from "@/components/ui/dotted-globe";
import { IconTile } from "@/components/ui/icon";
import { FootprintMap } from "@/components/ui/footprint-map";
import { siteConfig } from "@/config";
import { SectionHeader } from "@/components/ui/section-header";
import { SplitLayout } from "@/components/ui/split-layout";
import { cn } from "@/lib/cn";
import type { Highlight, ProseContent } from "@/types/content";

/** Splits text on blank lines, for copy stored as one field (e.g. product overviews). */
export function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function Prose({ paragraphs, className }: { paragraphs: string[]; className?: string }) {
  return (
    <RevealGroup className={cn("max-w-2xl space-y-5", className)}>
      {paragraphs.map((paragraph) => (
        <RevealItem key={paragraph}>
          <p className="type-body text-pretty text-fg-mute">{paragraph}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

export type AccentVariant = "map" | "globe" | "mark";

/**
 * A branded gradient panel under a split heading, so the tall left column isn't
 * left as empty white space (large screens only; phones stack the layout anyway).
 */
export function AccentPanel({ variant = "map", caption = siteConfig.company.motto }: { variant?: AccentVariant; caption?: string }) {
  return (
    <Reveal delay={0.15} className="mt-10 hidden lg:block">
      <div data-tone="dark" className="deep-gradient relative isolate overflow-hidden rounded-panel p-6 shadow-[0_30px_60px_-35px_rgb(8_33_79/0.6)]">
        <div aria-hidden className="dot-grid absolute inset-0 -z-10 opacity-25 [mask-image:radial-gradient(ellipse_at_top_right,#000,transparent_70%)]" />
        {variant === "map" && (
          <FootprintMap />
        )}
        {variant === "globe" && (
          <div className="relative mx-auto aspect-square w-3/4 rounded-full bg-[radial-gradient(circle_at_35%_30%,#4fa8e8,#1560bd_55%,#0a3270)] shadow-[0_0_80px_-10px_rgb(79_168_232/0.6)]">
            <DottedGlobe className="absolute inset-0 size-full" />
          </div>
        )}
        {variant === "mark" && (
          // The official BOSS Group logo (mark and wordmark), in white (client request, 15 Oct 2026).
          <div className="grid aspect-[16/9] place-items-center">
            <Image
              src="/images/group/boss-group-logo-white.png"
              alt="BOSS Group"
              width={606}
              height={534}
              sizes="220px"
              className="h-36 w-auto drop-shadow-[0_10px_30px_rgb(79_168_232/0.45)]"
            />
          </div>
        )}
        <p className="mt-5 font-display text-[15px] font-semibold text-fg">{caption}</p>
      </div>
    </Reveal>
  );
}

interface ProseSplitProps {
  content: ProseContent;
  /** Shown under the heading, e.g. a button. */
  aside?: ReactNode;
  /** Shown under the paragraphs. */
  children?: ReactNode;
  /** The gradient panel under the heading; `false` hides it. */
  accent?: AccentVariant | false;
}

/** Heading on the left, the client's paragraphs (and any extras) on the right. */
export function ProseSplit({ content, aside, children, accent = "map" }: ProseSplitProps) {
  return (
    <SplitLayout
      aside={
        <>
          <SectionHeader {...content.heading}>{aside}</SectionHeader>
          {accent && <AccentPanel variant={accent} />}
        </>
      }
      stickyAside
    >
      <Prose paragraphs={content.paragraphs} />
      {children}
    </SplitLayout>
  );
}

/** Short labelled points with icons, e.g. strengths or business models. */
export function HighlightGrid({ items, className }: { items: Highlight[]; className?: string }) {
  return (
    <RevealGroup as="ul" className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <RevealItem as="li" key={item.title} className="flex items-center gap-4 card-gradient rounded-card bg-surface p-5">
          <IconTile icon={item.icon} size="sm" variant="soft" />
          <span className="font-display text-[17px] leading-snug font-semibold">{item.title}</span>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/** A closing line in the brand's voice, e.g. "Focused Today & Flexible for Tomorrow." */
export function Motto({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Reveal className={cn("mt-10", className)}>
      <p className="type-h4 border-l-2 border-brand pl-5 text-balance">{children}</p>
    </Reveal>
  );
}
