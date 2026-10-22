"use client";

import { useEffect, useState } from "react";
import { PhotoLightbox } from "@/components/ui/photo-slider";
import type { ImageAsset } from "@/types/content";

/** Photos smaller than this on screen (icons, flags, logos) are not enlarged. */
const MIN_SIZE_PX = 120;

/** The original image behind a Next.js optimised URL (/_next/image?url=…), so the enlarged view is sharp. */
function originalSrc(src: string): string {
  try {
    const url = new URL(src, window.location.origin);
    return url.pathname === "/_next/image" ? (url.searchParams.get("url") ?? src) : src;
  } catch {
    return src;
  }
}

function isZoomable(target: EventTarget | null): target is HTMLImageElement {
  if (!(target instanceof HTMLImageElement)) return false;
  if (!target.closest("main") || target.closest("a, button, [data-no-zoom]")) return false;
  if (!target.alt) return false; // decorative images have no alt text
  const { width, height } = target.getBoundingClientRect();
  return width >= MIN_SIZE_PX && height >= MIN_SIZE_PX;
}

/**
 * Click any photo on the site to see it full size (client request, Oct 2026). One listener
 * for the whole page, so every photo — products, awards, team, galleries — works the same.
 * Photos inside links keep their link; sliders open their own viewer.
 */
export function ImageZoom() {
  const [photo, setPhoto] = useState<ImageAsset | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!isZoomable(event.target)) return;
      setPhoto({ src: originalSrc(event.target.currentSrc || event.target.src), alt: event.target.alt });
    };
    // Show a zoom cursor on photos that can be enlarged.
    const onOver = (event: MouseEvent) => {
      if (isZoomable(event.target)) event.target.style.cursor = "zoom-in";
    };
    document.addEventListener("click", onClick);
    document.addEventListener("mouseover", onOver);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  return <PhotoLightbox photos={photo ? [photo] : []} index={photo ? 0 : null} onChange={(index) => index === null && setPhoto(null)} />;
}
