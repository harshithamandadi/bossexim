import { Check } from "lucide-react";
import Image from "next/image";
import { PhotoWatermark } from "@/components/ui/photo-watermark";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Carousel } from "@/components/ui/carousel";
import { IconTile } from "@/components/ui/icon";
import { PhotoSlider } from "@/components/ui/photo-slider";
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

/** More of the client's photos for the service. */
export function ServiceGallery({ service }: { service: ContainerLineService }) {
  return <PhotoSlider photos={[service.image, ...service.gallery]} label={`${service.title} photos`} />;
}

/** Card link to a service page — photo and heading only (client request). */
export function ServiceCardLink({ service, className }: { service: ContainerLineService; className?: string }) {
  return (
    <PhotoTitleCard href={containerLineServiceHref(service.slug)} title={service.title} photo={service.image} icon={service.icon} className={className} />
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
