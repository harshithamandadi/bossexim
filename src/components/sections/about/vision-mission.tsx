import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { FeatureGrid } from "@/components/sections/shared/feature-grid";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeader } from "@/components/ui/section-header";
import { visionMissionValues } from "@/config";

export function VisionMission() {
  const { heading, statements, values } = visionMissionValues;

  return (
    <>
      <SectionHeader {...heading} />
      <RevealGroup className="mt-14 grid gap-4 lg:grid-cols-2">
        {statements.map((statement, index) => (
          <RevealItem key={statement.label}>
            <div data-tone={index === 0 ? "dark" : undefined} className="h-full rounded-panel bg-surface p-8 sm:p-12">
              <Eyebrow>{statement.label}</Eyebrow>
              <p className="type-h3 mt-10 text-balance">{statement.text}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
      <FeatureGrid items={values} columns={5} variant="plain" className="mt-16" />
    </>
  );
}
