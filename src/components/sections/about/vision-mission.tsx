import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { FeatureGrid } from "@/components/sections/shared/feature-grid";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeader } from "@/components/ui/section-header";
import { visionMissionValues } from "@/config";
import { cn } from "@/lib/cn";

export function VisionMission() {
  const { heading, statements, intro, values, valuesImage } = visionMissionValues;

  return (
    <>
      <SectionHeader {...heading} />
      <RevealGroup className="mt-10 grid gap-4 lg:grid-cols-2">
        {statements.map((statement, index) => (
          <RevealItem key={statement.label}>
            <div
              data-tone={index === 0 ? "dark" : undefined}
              className={cn(
                "flex h-full items-start gap-6 rounded-panel bg-surface p-8 sm:p-12",
                index === 0 ? "deep-gradient" : "card-gradient",
              )}
            >
              <div className="min-w-0 flex-1">
                <Eyebrow>{statement.label}</Eyebrow>
                <p className="type-h3 mt-8 text-balance">{statement.text}</p>
              </div>
              {statement.image && (
                <span className="relative hidden size-28 shrink-0 overflow-hidden rounded-3xl bg-white shadow-[0_16px_40px_-20px_rgb(8_33_79/0.5)] sm:block">
                  <Image src={statement.image.src} alt={statement.image.alt} fill sizes="112px" className="object-contain p-2" />
                </span>
              )}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
        <Reveal>
          <div className="relative aspect-square overflow-hidden rounded-panel bg-white ring-1 ring-inset ring-border">
            <Image src={valuesImage.src} alt={valuesImage.alt} fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-contain" />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="type-body max-w-2xl text-pretty text-fg-mute">{intro}</p>
          </Reveal>
          <FeatureGrid items={values} columns={2} variant="plain" className="mt-8" />
        </div>
      </div>
    </>
  );
}
