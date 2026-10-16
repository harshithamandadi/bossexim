import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { IconTile } from "@/components/ui/icon";
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

      {/* Values: the image and its sentence in one card, and each value with its icon beside the title (client mock-up). */}
      <div className="mt-12 grid items-start gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
        <Reveal>
          <div className="overflow-hidden rounded-panel bg-white ring-1 ring-inset ring-border">
            <div className="relative aspect-square">
              <Image src={valuesImage.src} alt={valuesImage.alt} fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-contain" />
            </div>
            <p className="px-7 pb-7 font-display text-[19px] leading-snug font-bold text-pretty text-navy">{intro}</p>
          </div>
        </Reveal>
        <RevealGroup as="ul" className="grid gap-x-10 gap-y-2 sm:grid-cols-2">
          {values.map((value) => (
            <RevealItem as="li" key={value.title} className="border-t border-border py-6">
              <div className="flex items-center gap-3">
                <IconTile icon={value.icon} variant="soft" size="sm" />
                <h3 className="type-h4">{value.title}</h3>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-pretty text-fg-mute">{value.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </>
  );
}
