import Image from "next/image";
import { Carousel } from "@/components/ui/carousel";
import { PhotoWatermark } from "@/components/ui/photo-watermark";
import { uiLabels } from "@/config";
import type { ImageAsset } from "@/types/content";

interface PhotoSliderProps {
  photos: ImageAsset[];
  /** Accessible name, e.g. "Retail photos". */
  label: string;
  slideWidth?: string;
  reverse?: boolean;
  className?: string;
}

/** The client's photographs as a gliding slider (client request: no static photo grids in BOSS Group). */
export function PhotoSlider({ photos, label, slideWidth = "26rem", reverse, className }: PhotoSliderProps) {
  if (photos.length === 0) return null;
  return (
    <Carousel
      className={className}
      label={label}
      previousLabel={uiLabels.previous}
      nextLabel={uiLabels.next}
      slideWidth={slideWidth}
      speed={0.8}
      reverse={reverse}
      items={photos.map((photo) => (
        <figure key={photo.src} className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface">
          <Image src={photo.src} alt={photo.alt} fill sizes={`(min-width: 640px) ${slideWidth}, 90vw`} className="object-cover" />
          <PhotoWatermark />
        </figure>
      ))}
    />
  );
}
