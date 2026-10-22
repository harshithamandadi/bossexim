import Image from "next/image";
import { cn } from "@/lib/cn";

/** The client's BOSS Group presence map: the countries where the Group is present, shaded in navy. */
export const FOOTPRINT_MAP = {
  src: "/images/group/boss-group-presence.webp",
  width: 2200,
  height: 1159,
  alt: "BOSS Group presence map — India, Australia, the United States, Brazil, the UK and Europe, the Middle East, East Africa, China and Southeast Asia",
};

/** Shown on a light panel, so the navy-shaded countries stay visible on dark sections too. */
export function FootprintMap({ className, sizes = "(min-width: 1024px) 40vw, 100vw" }: { className?: string; sizes?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl bg-[#f3f7fc] p-2 ring-1 ring-inset ring-white/10", className)}>
      <Image
        src={FOOTPRINT_MAP.src}
        width={FOOTPRINT_MAP.width}
        height={FOOTPRINT_MAP.height}
        alt={FOOTPRINT_MAP.alt}
        sizes={sizes}
        className="h-auto w-full"
      />
    </div>
  );
}

/** The same map on a dark panel: highlighted countries in bright blue, centred (client request, 17 Oct 2026). */
export function FootprintMapDark({ className }: { className?: string }) {
  return (
    <div data-tone="dark" className={cn("deep-gradient overflow-hidden rounded-panel p-4 sm:p-8", className)}>
      <Image
        src="/images/group/boss-group-presence-dark.webp"
        width={FOOTPRINT_MAP.width}
        height={FOOTPRINT_MAP.height}
        alt={FOOTPRINT_MAP.alt}
        sizes="(min-width: 1280px) 1100px, 100vw"
        className="mx-auto h-auto w-full max-w-6xl"
      />
    </div>
  );
}
