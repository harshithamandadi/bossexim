import Image from "next/image";
import { PhotoWatermark } from "@/components/ui/photo-watermark";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Carousel } from "@/components/ui/carousel";
import { Icon } from "@/components/ui/icon";
import { mediaEvents, toAnchorId, uiLabels } from "@/config";
import { cn } from "@/lib/cn";
import { getGalleries } from "@/lib/content/queries";
import { GalleryViewer } from "./gallery-viewer";
import type { Gallery } from "@/types/content";

/** Placeholder washes for galleries that don't have photos yet (cycled in order). */
const PLACEHOLDER_WASHES = [
  "from-brand/25 via-brand/5 to-transparent",
  "from-tide/25 via-tide/5 to-transparent",
  "from-gold/20 via-gold/5 to-transparent",
] as const;

export async function MediaGrid({ className }: { className?: string }) {
  const galleries = await getGalleries();

  const withPhotos = galleries.filter((gallery) => gallery.images.length > 0);

  return (
    <div className={className}>
      <RevealGroup as="ul" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleries.map((gallery, index) => (
          <RevealItem as="li" key={gallery.title} id={toAnchorId(gallery.title)} className="scroll-mt-32">
            {gallery.images.length > 0 ? (
              <GalleryViewer gallery={gallery} closeLabel={mediaEvents.close}>
                <GalleryTile gallery={gallery} />
              </GalleryViewer>
            ) : (
              <GalleryTile gallery={gallery} wash={PLACEHOLDER_WASHES[index % PLACEHOLDER_WASHES.length]} />
            )}
          </RevealItem>
        ))}
      </RevealGroup>

      {/* The photos themselves, gliding past in a row per gallery (client request: scroll the photos). */}
      <div className="mt-14 space-y-8">
        {withPhotos.map((gallery, index) => (
          <div key={gallery.title}>
            <h3 className="type-h4">{gallery.title}</h3>
            <Carousel
              className="mt-2"
              label={gallery.title}
              previousLabel={uiLabels.previous}
              nextLabel={uiLabels.next}
              slideWidth="20rem"
              speed={0.9}
              reverse={index % 2 === 1}
              items={gallery.images.map((image) => (
                <figure key={image.src} className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface">
                  <Image src={image.src} alt={image.alt} fill sizes="320px" className="object-cover" />
                  <PhotoWatermark />
                </figure>
              ))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTile({ gallery, wash }: { gallery: Gallery; wash?: string }) {
  const cover = gallery.images[0];
  const caption = cover ? `${gallery.images.length} ${uiLabels.photos}` : mediaEvents.emptyLabel;

  return (
    <figure data-tone={cover ? "dark" : undefined} className="group relative aspect-[4/3] overflow-hidden rounded-card bg-surface">
      {cover ? (
        <>
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
          />
          <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
          <PhotoWatermark className="top-4 bottom-auto" />
        </>
      ) : (
        <div aria-hidden className={cn("absolute inset-0 bg-linear-to-br", wash)}>
          <div className="dot-grid absolute inset-0 opacity-60" />
        </div>
      )}
      <figcaption className="absolute inset-x-0 bottom-0 p-6">
        <Icon name={gallery.icon} className="size-5 text-fg-mute" />
        <p className="type-h4 mt-3">{gallery.title}</p>
        <p className="mt-1 text-xs text-fg-mute">{caption}</p>
      </figcaption>
    </figure>
  );
}
