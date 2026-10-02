import Image from "next/image";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { GradientGlow } from "@/components/ui/gradient-glow";
import { IconTile } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import { containerLine } from "@/config";

export function ContainerLineSpotlight() {
  return (
    <div data-tone="dark" className="relative isolate overflow-hidden rounded-panel bg-canvas p-8 sm:p-14">
      <GradientGlow className="-z-10 opacity-80" />
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeader {...containerLine.heading} />
          <Reveal delay={0.1} className="mt-8">
            <Image
              src={containerLine.image.src}
              alt={containerLine.image.alt}
              width={containerLine.image.width}
              height={containerLine.image.height}
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="h-auto w-full drop-shadow-[0_30px_40px_rgb(0_0_0/0.35)]"
            />
          </Reveal>
        </div>
        <Reveal className="space-y-4 lg:pt-10">
          {containerLine.paragraphs.map((paragraph) => (
            <p key={paragraph} className="type-body text-pretty text-fg-mute">
              {paragraph}
            </p>
          ))}
          <p className="type-h4 border-l-2 border-brand pt-2 pl-5">{containerLine.motto}</p>
        </Reveal>
      </div>
      <RevealGroup as="ul" className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {containerLine.services.map((service) => (
          <RevealItem
            as="li"
            key={service.title}
            className="rounded-card bg-surface/80 p-6 ring-1 ring-inset ring-border backdrop-blur"
          >
            <IconTile icon={service.icon} size="sm" variant="soft" />
            <h3 className="type-h4 mt-5">{service.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-fg-mute">{service.description}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
