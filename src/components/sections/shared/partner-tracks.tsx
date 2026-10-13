import { Check } from "lucide-react";
import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { cardStyles } from "@/components/ui/card";
import { partnerContent, partnerFormHref } from "@/config";
import { cn } from "@/lib/cn";

interface PartnerTracksProps {
  /** Give each card its track id so menu anchors (#buyer, …) land on it. */
  withAnchors?: boolean;
  /** Show each track's illustration and benefits (the Partner page); off for compact use. */
  detailed?: boolean;
  className?: string;
}

export function PartnerTracks({ withAnchors = false, detailed = withAnchors, className }: PartnerTracksProps) {
  return (
    <RevealGroup as="ul" className={cn("grid gap-4 lg:grid-cols-3", className)}>
      {partnerContent.tracks.map((track) => (
        <RevealItem as="li" key={track.id} id={withAnchors ? track.id : undefined} className="scroll-mt-32">
          <article data-tone={track.featured ? "dark" : undefined} className={cardStyles({ className: "flex h-full flex-col" })}>
            {detailed && track.image && (
              <div className="relative -mx-2 -mt-2 mb-6 aspect-[4/3] overflow-hidden rounded-2xl bg-white">
                <Image src={track.image.src} alt={track.image.alt} fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover" />
              </div>
            )}
            <h3 className="type-h3">{track.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-pretty text-fg-mute">{track.description}</p>
            {detailed && track.benefits && <p className="mt-3 text-[15px] leading-relaxed text-pretty text-fg-mute">{track.benefits}</p>}
            <p className="type-eyebrow mt-8 border-t border-border pt-6 text-fg-mute">{track.pointsLabel}</p>
            <ul className="mt-4 space-y-3">
              {track.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-[15px]">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-brand" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-10">
              <ButtonLink
                href={partnerFormHref(track.cta.enquiryType)}
                variant={track.featured ? "primary" : "secondary"}
                withArrow
              >
                {track.cta.label}
              </ButtonLink>
            </div>
          </article>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
