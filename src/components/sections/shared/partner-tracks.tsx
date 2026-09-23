import { Check } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { cardStyles } from "@/components/ui/card";
import { partnerContent, partnerFormHref } from "@/config";
import { cn } from "@/lib/cn";

interface PartnerTracksProps {
  /** Give each card its track id so menu anchors (#buyer, …) land on it. */
  withAnchors?: boolean;
  className?: string;
}

export function PartnerTracks({ withAnchors = false, className }: PartnerTracksProps) {
  return (
    <RevealGroup as="ul" className={cn("grid gap-4 lg:grid-cols-3", className)}>
      {partnerContent.tracks.map((track) => (
        <RevealItem as="li" key={track.id} id={withAnchors ? track.id : undefined} className="scroll-mt-32">
          <article data-tone={track.featured ? "dark" : undefined} className={cardStyles({ className: "flex h-full flex-col" })}>
            <h3 className="type-h3">{track.title}</h3>
            <p className="type-body mt-3 text-pretty text-fg-mute">{track.description}</p>
            <ul className="mt-8 space-y-3 border-t border-border pt-6">
              {track.audiences.map((audience) => (
                <li key={audience} className="flex items-center gap-3 text-[15px]">
                  <Check aria-hidden className="size-4 shrink-0 text-brand" />
                  {audience}
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
