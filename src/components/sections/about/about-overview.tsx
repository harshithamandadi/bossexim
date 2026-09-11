import { RevealGroup, RevealItem, Reveal } from "@/components/motion/reveal";
import { StatList } from "@/components/sections/shared/stat-list";
import { Chip } from "@/components/ui/chip";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeader } from "@/components/ui/section-header";
import { aboutOverview, siteConfig } from "@/config";
import { getHighlightStats } from "@/lib/stats";

export function AboutOverview() {
  const { company } = siteConfig;

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-20">
      <div>
        <SectionHeader {...aboutOverview.heading} />
        <RevealGroup className="mt-8 space-y-5">
          {aboutOverview.paragraphs.map((paragraph) => (
            <RevealItem key={paragraph}>
              <p className="type-body text-pretty text-fg-mute">{paragraph}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <Reveal delay={0.15}>
        <div data-tone="dark" className="rounded-panel bg-canvas p-8 sm:p-10">
          <Eyebrow>{company.descriptor}</Eyebrow>
          <StatList stats={getHighlightStats()} layout="grid" className="mt-8" />
          <ul className="mt-10 flex flex-wrap gap-2 border-t border-border pt-8">
            {company.roles.map((role) => (
              <li key={role}>
                <Chip>{role}</Chip>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
