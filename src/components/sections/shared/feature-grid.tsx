import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { IconTile } from "@/components/ui/icon";
import { Section, type SectionTone } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/cn";
import type { Feature, FeatureSection } from "@/types/content";

const columnStyles = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-5",
} as const;

export type FeatureColumns = keyof typeof columnStyles;

interface FeatureGridProps {
  items: Feature[];
  columns?: FeatureColumns;
  /** "card" = filled tiles; "plain" = hairline-topped columns. */
  variant?: "card" | "plain";
  className?: string;
}

export function FeatureGrid({ items, columns = 3, variant = "card", className }: FeatureGridProps) {
  const isCard = variant === "card";
  return (
    <RevealGroup as="ul" className={cn("grid gap-4", !isCard && "gap-x-8 gap-y-10", columnStyles[columns], className)}>
      {items.map((item) => (
        <RevealItem
          as="li"
          key={item.title}
          className={isCard ? "rounded-card bg-surface p-7 sm:p-8" : "border-t border-border pt-6"}
        >
          <IconTile icon={item.icon} variant={isCard ? "solid" : "soft"} />
          <h3 className="type-h4 mt-6">{item.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-pretty text-fg-mute">{item.description}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

interface FeatureBandProps {
  content: FeatureSection;
  id?: string;
  tone?: SectionTone;
  columns?: FeatureColumns;
}

/** A full section: heading plus a feature grid. */
export function FeatureBand({ content, id, tone, columns }: FeatureBandProps) {
  return (
    <Section id={id} tone={tone}>
      <SectionHeader {...content.heading} />
      <FeatureGrid items={content.items} columns={columns} className="mt-14" />
    </Section>
  );
}
