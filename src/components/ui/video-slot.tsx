"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/cn";
import type { CorporateVideo } from "@/types/content";

const YOUTUBE_ID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/i;
const VIMEO_ID = /vimeo\.com\/(?:video\/)?(\d+)/i;

interface VideoSource {
  embedUrl: string;
  /** YouTube's own thumbnail, used when no cover image is uploaded. */
  thumbnail?: string;
}

/** Turns a YouTube or Vimeo link into a privacy-friendly embed that starts playing at once. */
export function toVideoSource(url: string): VideoSource | undefined {
  const youtube = url.match(YOUTUBE_ID)?.[1];
  if (youtube) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&rel=0&modestbranding=1`,
      thumbnail: `https://i.ytimg.com/vi/${youtube}/hqdefault.jpg`,
    };
  }
  const vimeo = url.match(VIMEO_ID)?.[1];
  if (vimeo) return { embedUrl: `https://player.vimeo.com/video/${vimeo}?autoplay=1&dnt=1` };
  return undefined;
}

/**
 * A video that costs nothing until it's wanted: only a cover image and a play
 * button load with the page, and the YouTube/Vimeo player replaces them on click.
 */
export function VideoSlot({ video, playLabel, className }: { video: CorporateVideo; playLabel: string; className?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const source = toVideoSource(video.url);
  if (!source) return null;

  const title = video.title ?? playLabel;
  const cover = video.poster?.src ?? source.thumbnail;

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-panel bg-navy-deep shadow-[0_40px_80px_-40px_rgb(8_33_79/0.45)]",
        className,
      )}
    >
      {isPlaying ? (
        <iframe
          src={source.embedUrl}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="group absolute inset-0 grid size-full place-items-center text-white"
        >
          {cover ? (
            <Image
              src={cover}
              alt=""
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.03]"
            />
          ) : (
            <LogoMark className="absolute h-1/3 w-auto text-white/10" />
          )}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-navy-deep/10 to-transparent" />
          <span className="relative grid size-20 place-items-center rounded-full bg-white/95 text-brand shadow-xl transition-transform duration-200 ease-smooth group-hover:scale-105 group-active:scale-95">
            <Play aria-hidden className="size-8 translate-x-0.5 fill-current" />
          </span>
          <span className="absolute bottom-5 left-6 right-6 text-left font-display text-lg font-bold text-pretty sm:text-xl">
            <span className="sr-only">{playLabel}: </span>
            {title}
          </span>
        </button>
      )}
    </div>
  );
}
