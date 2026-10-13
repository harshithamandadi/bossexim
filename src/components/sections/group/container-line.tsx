import Image from "next/image";
import { PhotoWatermark } from "@/components/ui/photo-watermark";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { GradientGlow } from "@/components/ui/gradient-glow";
import { SectionHeader } from "@/components/ui/section-header";
import { containerLine } from "@/config";
import { ServiceCardLink } from "./container-line-service";

export function ContainerLineSpotlight() {
  return (
    <div data-tone="dark" className="deep-gradient relative isolate overflow-hidden rounded-panel p-8 sm:p-14">
      <GradientGlow className="-z-10 opacity-80" />
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeader {...containerLine.heading} />
          <Reveal delay={0.1} className="relative mt-8">
            <Image
              src={containerLine.image.src}
              alt={containerLine.image.alt}
              width={containerLine.image.width}
              height={containerLine.image.height}
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="h-auto w-full rounded-2xl shadow-[0_30px_40px_-20px_rgb(0_0_0/0.45)]"
            />
            <PhotoWatermark size="lg" />
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
      <RevealGroup as="ul" className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {containerLine.services.map((service) => (
          <RevealItem as="li" key={service.slug}>
            <ServiceCardLink service={service} />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
