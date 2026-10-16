"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Carousel } from "@/components/ui/carousel";
import { PhotoWatermark } from "@/components/ui/photo-watermark";
import { uiLabels } from "@/config/ui";
import { EASE_SMOOTH } from "@/lib/motion";
import type { ImageAsset } from "@/types/content";

interface PhotoSliderProps {
  photos: ImageAsset[];
  /** Accessible name, e.g. "Retail photos". */
  label: string;
  reverse?: boolean;
  speed?: number;
  className?: string;
}

/**
 * The client's photographs as a gliding slider: every photo the same size with its name
 * underneath, and a click opens it full size (client request, 15 Oct 2026).
 */
export function PhotoSlider({ photos, label, reverse, speed = 0.8, className }: PhotoSliderProps) {
  const [open, setOpen] = useState<number | null>(null);
  if (photos.length === 0) return null;

  return (
    <>
      <Carousel
        className={className}
        label={label}
        previousLabel={uiLabels.previous}
        nextLabel={uiLabels.next}
        slideWidth="20rem"
        speed={speed}
        reverse={reverse}
        items={photos.map((photo, index) => (
          <figure key={photo.src} className="h-full">
            <button
              type="button"
              onClick={() => setOpen(index)}
              aria-label={`${uiLabels.zoom}: ${photo.alt}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-card bg-surface"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="20rem"
                className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 grid size-8 place-items-center rounded-full bg-white/85 text-navy opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn aria-hidden className="size-4" />
              </span>
              <PhotoWatermark />
            </button>
            <figcaption className="mt-2 line-clamp-2 px-1 text-[13px] leading-snug font-medium text-fg-mute">{photo.alt}</figcaption>
          </figure>
        ))}
      />
      <PhotoLightbox photos={photos} index={open} onChange={setOpen} />
    </>
  );
}

/** Full-size view of one photo, with previous/next and Escape to close. */
export function PhotoLightbox({
  photos,
  index,
  onChange,
}: {
  photos: ImageAsset[];
  index: number | null;
  onChange: (index: number | null) => void;
}) {
  const count = photos.length;
  const step = useCallback(
    (delta: number) => onChange(index === null ? null : (index + delta + count) % count),
    [index, count, onChange],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onChange(null);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onChange, step]);

  const photo = index === null ? undefined : photos[index];

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_SMOOTH }}
          className="fixed inset-0 z-[80] grid place-items-center bg-navy-deep/90 p-4 backdrop-blur-sm sm:p-10"
          onClick={() => onChange(null)}
        >
          <figure className="relative flex max-h-full w-full max-w-6xl flex-col items-center" onClick={(event) => event.stopPropagation()}>
            <div className="relative h-[75vh] w-full">
              <Image src={photo.src} alt={photo.alt} fill sizes="90vw" className="object-contain" priority />
            </div>
            <figcaption className="mt-3 text-center text-sm text-white/85">
              {photo.alt} <span className="text-white/50">· {(index ?? 0) + 1} / {count}</span>
            </figcaption>
          </figure>
          <button type="button" onClick={() => onChange(null)} aria-label={uiLabels.close} className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
            <X aria-hidden className="size-5" />
          </button>
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                aria-label={uiLabels.previous}
                className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft aria-hidden className="size-6" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                aria-label={uiLabels.next}
                className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
              >
                <ChevronRight aria-hidden className="size-6" />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
