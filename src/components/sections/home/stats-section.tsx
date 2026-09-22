import { StatList } from "@/components/sections/shared/stat-list";
import { Section } from "@/components/ui/section";
import { getSiteStats } from "@/lib/content/queries";

export async function StatsSection() {
  return (
    <Section spacing="none">
      <StatList stats={await getSiteStats()} className="border-y border-border py-14" />
    </Section>
  );
}
