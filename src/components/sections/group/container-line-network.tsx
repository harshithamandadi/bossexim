import { ArrowUpRight, Mail, MapPin, Phone, Quote } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Chip } from "@/components/ui/chip";
import { SectionHeader } from "@/components/ui/section-header";
import { Carousel } from "@/components/ui/carousel";
import { containerLineNetwork, uiLabels } from "@/config";

const content = containerLineNetwork;

/** BOSS Container Line's agent network, offices and partner testimonials. */
export function ContainerLineNetwork() {
  const { agreements } = content;

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:items-end">
        <SectionHeader {...content.heading} />
        <Reveal className="card-gradient rounded-card bg-surface p-7">
          <p className="type-h1 gradient-text leading-none">{agreements.done}</p>
          <p className="mt-3 text-[15px] font-medium">{agreements.label}</p>
          <p className="mt-1 text-sm text-fg-mute">{agreements.note}</p>
        </Reveal>
      </div>

      <RevealGroup as="ul" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.regions.map((region) => (
          <RevealItem as="li" key={region.region} className="card-gradient rounded-card bg-surface p-6">
            <h3 className="type-h4">{region.region}</h3>
            <p className="mt-4 flex flex-wrap gap-1.5">
              {region.places.map((place) => (
                <Chip key={place} variant="outline" className="bg-canvas">
                  {place}
                </Chip>
              ))}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="mt-12 flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="type-h3">{content.officesTitle}</h3>
        <a
          href={content.website.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[15px] font-semibold text-brand underline-offset-4 hover:underline"
        >
          {content.website.label}
          <ArrowUpRight aria-hidden className="size-4" />
        </a>
      </div>
      <RevealGroup as="ul" className="mt-6 grid gap-x-8 gap-y-6 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {content.offices.map((office) => (
          <RevealItem as="li" key={`${office.city}-${office.address}`} className="flex gap-3">
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
            <div>
              <p className="font-semibold">{office.city}</p>
              <p className="mt-0.5 text-xs text-fg-mute">{office.entity}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-mute">{office.address}</p>
              {office.phone && (
                <a href={`tel:${office.phone.replace(/\s/g, "")}`} className="mt-2 flex items-center gap-1.5 text-sm font-medium hover:text-brand">
                  <Phone aria-hidden className="size-3.5 text-brand" />
                  {office.phone}
                </a>
              )}
              {office.email && (
                <a href={`mailto:${office.email}`} className="mt-1 flex items-center gap-1.5 text-sm font-medium break-all hover:text-brand">
                  <Mail aria-hidden className="size-3.5 shrink-0 text-brand" />
                  {office.email}
                </a>
              )}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <h3 className="type-h3 mt-12">{content.testimonialsTitle}</h3>
      <Carousel
        className="mt-4"
        label={content.testimonialsTitle}
        previousLabel={uiLabels.previous}
        nextLabel={uiLabels.next}
        slideWidth="min(26rem, 82vw)"
        speed={0.8}
        items={content.testimonials.map((testimonial) => (
          <figure key={testimonial.company} className="flex h-full flex-col card-gradient rounded-card bg-surface p-7">
            <Quote aria-hidden className="size-6 text-brand/40" />
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-pretty">{testimonial.quote}</blockquote>
            <figcaption className="mt-6 text-sm font-semibold">{testimonial.company}</figcaption>
          </figure>
        ))}
      />
    </>
  );
}
