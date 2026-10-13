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
