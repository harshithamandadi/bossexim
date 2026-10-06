import Image from "next/image";
import { cn } from "@/lib/cn";

/** The client's own BOSS footprint map (agency network from the Mediterranean to the Far East). */
export const FOOTPRINT_MAP = {
  src: "/images/group/boss-footprint-map.webp",
  width: 2000,
  height: 980,
  alt: "BOSS footprint map — agency network across the Middle East, Africa, South Asia and the Far East",
};

export function FootprintMap({ className, sizes = "(min-width: 1024px) 40vw, 100vw" }: { className?: string; sizes?: string }) {
  return (
    <Image
      src={FOOTPRINT_MAP.src}
      width={FOOTPRINT_MAP.width}
      height={FOOTPRINT_MAP.height}
      alt={FOOTPRINT_MAP.alt}
      sizes={sizes}
      className={cn("h-auto w-full rounded-2xl object-cover ring-1 ring-inset ring-white/10", className)}
    />
  );
}
