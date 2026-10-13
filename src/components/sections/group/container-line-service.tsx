import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import { PhotoWatermark } from "@/components/ui/photo-watermark";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Carousel } from "@/components/ui/carousel";
import { IconTile } from "@/components/ui/icon";
import { PhotoGallery } from "@/components/ui/photo-gallery";
import { containerLineServiceHref, containerLineServices, groupVerticalLabels, uiLabels, type ContainerLineService } from "@/config";
import { cn } from "@/lib/cn";

/** The hero visual: the client's main photo for the service (illustrations shown whole on white). */
export function ServiceMedia({ service }: { service: ContainerLineService }) {
  const contain = service.imageFit === "contain";
  return (
    <Reveal delay={0.1}>
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden rounded-panel shadow-[0_30px_60px_-35px_rgb(8_33_79/0.6)] ring-1 ring-inset ring-border",
          contain ? "bg-white" : "bg-surface",
        )}
      >
        <Image
          src={service.image.src}
          alt={service.image.alt}
          fill
          sizes="(min-width: 1024px) 40vw, 90vw"
          priority
          className={contain ? "object-contain p-4" : "object-cover"}
        />
        <PhotoWatermark size="lg" className={cn(contain && "text-navy/50 drop-shadow-none")} />
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
  return <PhotoGallery photos={service.gallery} columns={2} />;
}

/** Card link to a service page, used on the Container Line page and under each service. */
export function ServiceCardLink({ service, className }: { service: ContainerLineService; className?: string }) {
  return (
    <Link
      href={containerLineServiceHref(service.slug)}
      className={cn(
        "group flex h-full flex-col card-gradient rounded-card bg-surface/80 p-6 ring-1 ring-inset ring-border backdrop-blur",
        "transition-[transform,box-shadow] duration-500 ease-smooth hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgb(8_33_79/0.35)]",
        className,
      )}
    >
      <span className="flex items-start justify-between gap-4">
        <IconTile icon={service.icon} size="sm" variant="soft" />
        <ArrowUpRight aria-hidden className="size-4 text-fg-mute transition-colors group-hover:text-brand" />
      </span>
      <span className="type-h4 mt-5">{service.title}</span>
      <span className="mt-1.5 text-sm leading-relaxed text-fg-mute">{service.description}</span>
      <span className="mt-auto pt-4 text-sm font-semibold text-brand">{uiLabels.learnMore}</span>
    </Link>
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
        slideWidth="18rem"
        items={containerLineServices
          .filter((service) => service.slug !== current)
          .map((service) => (
            <ServiceCardLink key={service.slug} service={service} />
          ))}
      />
    </div>
  );
}
