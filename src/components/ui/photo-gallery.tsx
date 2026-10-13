import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PhotoWatermark } from "@/components/ui/photo-watermark";
import { cn } from "@/lib/cn";
import type { ImageAsset } from "@/types/content";

const columnStyles = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

interface PhotoGalleryProps {
  photos: ImageAsset[];
  columns?: keyof typeof columnStyles;
  /** The first photo spans two columns and rows, as a feature image (3+ columns only). */
  featureFirst?: boolean;
  className?: string;
}

/** The client's photographs in an even grid — each cropped to the same shape and branded with the BOSS mark. */
export function PhotoGallery({ photos, columns = 3, featureFirst = false, className }: PhotoGalleryProps) {
  if (photos.length === 0) return null;
  return (
    <RevealGroup as="ul" interval={0.05} className={cn("grid gap-3", columnStyles[columns], className)}>
      {photos.map((photo, index) => {
        const isFeature = featureFirst && index === 0;
        return (
          <RevealItem
            as="li"
            key={photo.src}
            className={cn("group relative aspect-[4/3] overflow-hidden rounded-card bg-surface", isFeature && "sm:col-span-2 sm:row-span-2 sm:aspect-auto")}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={isFeature ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"}
              className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
            />
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/45 to-transparent" />
            <PhotoWatermark size={isFeature ? "lg" : "md"} />
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
