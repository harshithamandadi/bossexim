import { AnimatedNumber } from "@/components/motion/animated-number";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";
import type { Stat } from "@/types/content";

const layoutStyles = {
  /** One row of four with dividers — home page strip. */
  row: { list: "grid-cols-2 gap-y-10 lg:grid-cols-4", item: "lg:px-8 lg:first:pl-0 lg:[&+&]:border-l lg:[&+&]:border-border", value: "type-h1" },
  /** Two-by-two — inside cards. */
  grid: { list: "grid-cols-2 gap-x-6 gap-y-8", item: "", value: "type-h2" },
} as const;

export function StatList({ stats, layout = "row", className }: { stats: Stat[]; layout?: keyof typeof layoutStyles; className?: string }) {
  const styles = layoutStyles[layout];
  return (
    <RevealGroup as="ul" className={cn("grid", styles.list, className)}>
      {stats.map((stat) => (
        <RevealItem as="li" key={stat.label} className={styles.item}>
          <p className={cn("gradient-text", styles.value)}>
            <AnimatedNumber value={stat.value} />
          </p>
          <p className="mt-2 text-sm text-fg-mute">{stat.label}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
