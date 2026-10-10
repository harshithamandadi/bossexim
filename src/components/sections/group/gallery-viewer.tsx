"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { PhotoWatermark } from "@/components/ui/photo-watermark";
import { useRef, type ReactNode } from "react";
import type { Gallery } from "@/types/content";

interface GalleryViewerProps {
  gallery: Gallery;
  closeLabel: string;
  /** The tile that opens the viewer. */
  children: ReactNode;
}

/** Opens a gallery's photos in a modal dialog (native <dialog>: focus trap and Escape for free). */
export function GalleryViewer({ gallery, closeLabel, children }: GalleryViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-haspopup="dialog"
        className="block w-full cursor-zoom-in rounded-card text-left focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
      >
        {children}
      </button>
      <dialog
        ref={dialogRef}
        aria-label={gallery.title}
        onClick={(event) => {
          // A click on the backdrop (the dialog element itself) closes it.
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="m-auto max-h-[90dvh] w-[min(64rem,calc(100vw-2rem))] overflow-y-auto rounded-panel bg-canvas p-5 text-fg shadow-2xl backdrop:bg-navy-deep/70 backdrop:backdrop-blur-sm sm:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="type-h3">{gallery.title}</h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={closeLabel}
            className="grid size-10 shrink-0 place-items-center rounded-full text-fg-mute transition-colors hover:bg-fg/5 hover:text-fg"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.images.map((image) => (
            <li key={image.src}>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface">
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw" className="object-cover" />
                  <PhotoWatermark />
                </div>
                <figcaption className="mt-2 text-sm leading-snug text-fg-mute">{image.alt}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </dialog>
    </>
  );
}
