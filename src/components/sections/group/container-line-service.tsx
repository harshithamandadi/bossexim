import { Check } from "lucide-react";
import Image from "next/image";
import { PhotoWatermark } from "@/components/ui/photo-watermark";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Carousel } from "@/components/ui/carousel";
import { IconTile } from "@/components/ui/icon";
import { PhotoTitleCard } from "@/components/ui/photo-title-card";
import { containerLineServiceHref, containerLineServices, groupVerticalLabels, uiLabels, type ContainerLineService } from "@/config";

/** The hero visual: the client's main photo for the service, shown whole at its own shape (client request). */
export function ServiceMedia({ service }: { service: ContainerLineService }) {
  return (
    <Reveal delay={0.1}>
      <div className="relative overflow-hidden rounded-panel bg-white shadow-[0_30px_60px_-35px_rgb(8_33_79/0.6)] ring-1 ring-inset ring-border">
        <Image
          src={service.image.src}
          alt={service.image.alt}
          width={service.image.width}
          height={service.image.height}
          sizes="(min-width: 1024px) 40vw, 90vw"
          priority
          className="h-auto max-h-[26rem] w-full object-contain"
        />
        <PhotoWatermark size="lg" />
      </div>
    </Reveal>
  );
}

/** The client's paragraphs beside a checklist card. */
export function ServiceOverview({ service }: { service: ContainerLineService }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
      <RevealGroup className="space-y-5">
        {service.paragraphs.map((paragraph) => (
          <RevealItem key={paragraph}>
            <p className="type-body text-pretty text-fg-mute">{paragraph}</p>
          </RevealItem>
        ))}
      </RevealGroup>
      <Reveal delay={0.1} className="lg:sticky lg:top-36 lg:self-start">
        <div className="card-gradient rounded-card bg-surface p-7 ring-1 ring-inset ring-border">
          <div className="flex items-center gap-3">
            <IconTile icon={service.icon} size="sm" />
            <h2 className="type-h4">{service.highlightsTitle}</h2>
          </div>
          <ul className="mt-6 space-y-3">
            {service.highlights.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] leading-snug">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand/15 text-brand">
                  <Check aria-hidden className="size-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}

/** How the service supports BOSS EXIM — a dark box with white lettering (client request). */
export function ServiceForExim({ service }: { service: ContainerLineService }) {
  return (
    <Reveal>
      <div data-tone="dark" className="deep-gradient relative isolate overflow-hidden rounded-panel p-8 text-white sm:p-12">
        <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-10">
          <span className="grid size-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-inset ring-white/20">
            <IconTile icon={service.icon} variant="brand" size="sm" />
          </span>
          <div>
            <h2 className="type-h3 text-white">{groupVerticalLabels.forExim}</h2>
            <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-pretty text-white/90">{service.forExim}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** Card link to a service page — photo and heading only (client request). */
export function ServiceCardLink({ service, className }: { service: ContainerLineService; className?: string }) {
  return (
    <PhotoTitleCard
      href={containerLineServiceHref(service.slug)}
      title={service.title}
      photo={service.image}
      icon={service.icon}
      fit={service.imageFit ?? "cover"}
      className={className}
    />
  );
}

/** The other Container Line services, as a slider. */
export function MoreServices({ current }: { current: string }) {
  const title = groupVerticalLabels.moreServices;
  return (
    <div>
      <h2 className="type-h3">{title}</h2>
      <Carousel
        className="mt-4"
        label={title}
        previousLabel={uiLabels.previous}
        nextLabel={uiLabels.next}
        slideWidth="16rem"
        items={containerLineServices
          .filter((service) => service.slug !== current)
          .map((service) => (
            <ServiceCardLink key={service.slug} service={service} />
          ))}
      />
    </div>
  );
}
