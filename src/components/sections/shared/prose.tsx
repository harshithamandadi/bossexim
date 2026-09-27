import type { ReactNode } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { IconTile } from "@/components/ui/icon";
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

interface ProseSplitProps {
  content: ProseContent;
  /** Shown under the heading, e.g. a button. */
  aside?: ReactNode;
  /** Shown under the paragraphs. */
  children?: ReactNode;
}

/** Heading on the left, the client's paragraphs (and any extras) on the right. */
export function ProseSplit({ content, aside, children }: ProseSplitProps) {
  return (
    <SplitLayout aside={<SectionHeader {...content.heading}>{aside}</SectionHeader>} stickyAside>
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
        <RevealItem as="li" key={item.title} className="flex items-center gap-4 rounded-card bg-surface p-5">
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
