import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cardStyles } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon";
import { siteConfig, uiLabels } from "@/config";
import type { Catalogue } from "@/lib/catalogue";
import { cn } from "@/lib/cn";
import { getCatalogue } from "@/lib/content/queries";
import type { Service } from "@/types/content";
import { serviceVisuals } from "./service-visuals";

type BentoSlot = { span: string; tone?: "dark"; layout: "stacked" | "split"; ambient?: boolean };

/**
 * Bento slots, applied to services in order (and repeated if more are added).
 * Two equal cards per row, so no card is left with a large empty middle.
 */
const BENTO_SLOTS: [BentoSlot, ...BentoSlot[]] = [
  { span: "lg:col-span-6", tone: "dark", layout: "stacked", ambient: true },
  { span: "lg:col-span-6", layout: "stacked" },
  { span: "lg:col-span-6", layout: "stacked" },
  { span: "lg:col-span-6", tone: "dark", layout: "stacked", ambient: true },
];

export async function ServicesBento({ services = siteConfig.services, className }: { services?: Service[]; className?: string }) {
  const catalogue = await getCatalogue();

  return (
    <RevealGroup className={cn("grid gap-4 lg:grid-cols-12", className)}>
      {services.map((service, index) => {
        const slot = BENTO_SLOTS[index % BENTO_SLOTS.length] ?? BENTO_SLOTS[0];
        return (
          <RevealItem key={service.id} className={slot.span}>
            <ServiceCard service={service} slot={slot} catalogue={catalogue} />
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}

function ServiceCard({ service, slot, catalogue }: { service: Service; slot: BentoSlot; catalogue: Catalogue }) {
  const Visual = serviceVisuals[service.visual];
  const isSplit = slot.layout === "split";

  return (
    <article
      data-tone={slot.tone}
      className={cardStyles({
        className: cn(
          "isolate flex h-full flex-col gap-8",
          slot.tone === "dark" && "deep-gradient",
          isSplit && "lg:grid lg:grid-cols-2 lg:items-center lg:gap-16",
        ),
      })}
    >
      {slot.ambient && <CardAmbience />}
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <IconTile icon={service.icon} variant={slot.tone === "dark" ? "brand" : "solid"} />
          <Link
            href={service.href}
            aria-label={`${uiLabels.learnMore}: ${service.title}`}
            className="grid size-10 place-items-center rounded-full bg-fg/5 transition-colors duration-300 hover:bg-fg/10"
          >
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
        <div>
          <h3 className="type-h3">{service.title}</h3>
          <p className="type-body mt-3 max-w-md text-pretty text-fg-mute">{service.summary}</p>
        </div>
        <ul className="space-y-2.5">
          {service.points.map((point) => (
            <li key={point} className="flex gap-2.5 text-[15px]">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className={cn("flex flex-col", !isSplit && "flex-1 justify-end")}>
        <Visual catalogue={catalogue} />
      </div>
    </article>
  );
}

/** Soft light and texture for the large feature card, so its open space reads as intentional. */
function CardAmbience() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="glow-brand absolute -top-1/3 -right-1/3 size-[40rem] rounded-full opacity-80" />
      <div className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top_right,#000,transparent_65%)]" />
    </div>
  );
}
