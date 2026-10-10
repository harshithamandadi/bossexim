import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import { PhotoWatermark } from "@/components/ui/photo-watermark";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Carousel } from "@/components/ui/carousel";
import { GradientGlow } from "@/components/ui/gradient-glow";
import { Icon, IconTile } from "@/components/ui/icon";
import { LogoMark } from "@/components/ui/logo";
import { containerLineServiceHref, containerLineServices, groupVerticalLabels, uiLabels, type ContainerLineService } from "@/config";
import { cn } from "@/lib/cn";

/** The hero visual: the brochure cut-out on a navy panel, or the service icon when there is no photo yet. */
export function ServiceMedia({ service }: { service: ContainerLineService }) {
  return (
    <Reveal delay={0.1}>
      <div
        data-tone="dark"
        className="deep-gradient relative isolate grid aspect-[16/10] place-items-center overflow-hidden rounded-panel p-6 shadow-[0_30px_60px_-35px_rgb(8_33_79/0.6)]"
      >
        <GradientGlow className="-z-10 opacity-80" />
        <div aria-hidden className="dot-grid absolute inset-0 -z-10 opacity-25 [mask-image:radial-gradient(ellipse_at_top_right,#000,transparent_70%)]" />
        {service.image ? (
          <Image
            src={service.image.src}
            alt={service.image.alt}
            width={service.image.width}
            height={service.image.height}
            sizes="(min-width: 1024px) 40vw, 90vw"
            priority
            className="h-auto max-h-full w-full object-contain drop-shadow-[0_30px_40px_rgb(0_0_0/0.4)]"
          />
        ) : (
          <span className="grid size-36 place-items-center rounded-[2rem] bg-white/10 ring-1 ring-inset ring-white/15 backdrop-blur">
            <Icon name={service.icon} strokeWidth={1.25} className="size-16 text-white" />
          </span>
        )}
        {service.image && <PhotoWatermark size="lg" />}
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

/** "How it supports BGEXIM" — only for services the client's documents describe that way. */
export function ServiceForExim({ paragraphs }: { paragraphs: string[] }) {
  return (
    <Reveal>
      <div data-tone="dark" className="deep-gradient relative isolate overflow-hidden rounded-panel p-8 sm:p-12">
        <GradientGlow className="-z-10 opacity-70" />
        <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-12">
          <LogoMark className="h-14 w-auto text-white/90 drop-shadow-[0_10px_30px_rgb(79_168_232/0.5)]" />
          <div>
            <h2 className="type-h3">{groupVerticalLabels.forExim}</h2>
            <div className="mt-4 max-w-3xl space-y-4">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="type-body text-pretty text-fg-mute">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
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
