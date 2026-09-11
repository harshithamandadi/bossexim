import { StatList } from "@/components/sections/shared/stat-list";
import { Section } from "@/components/ui/section";
import { getHighlightStats } from "@/lib/stats";

export function StatsSection() {
  return (
    <Section spacing="none">
      <StatList stats={getHighlightStats()} className="border-y border-border py-14" />
    </Section>
  );
}
