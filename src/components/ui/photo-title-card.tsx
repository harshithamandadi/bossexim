import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PhotoWatermark } from "@/components/ui/photo-watermark";
import { cn } from "@/lib/cn";
import type { IconName } from "@/lib/icons";
import type { ImageAsset } from "@/types/content";

interface PhotoTitleCardProps {
  href: string;
  title: string;
  photo?: ImageAsset;
  /** Shown on a brand gradient when there is no photo yet. */
  icon: IconName;
  /** "contain" shows the whole image on white (illustrations with lettering); "cover" fills the frame. */
  fit?: "cover" | "contain";
  className?: string;
}

/** A standard-size card with just a photo and a heading (client request, 15 Oct 2026). */
export function PhotoTitleCard({ href, title, photo, icon, fit = "cover", className }: PhotoTitleCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group block h-full overflow-hidden rounded-card bg-surface ring-1 ring-inset ring-border",
        "transition-[transform,box-shadow] duration-500 ease-smooth hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgb(8_33_79/0.35)]",
        className,
      )}
    >
      <span className="relative block aspect-[4/3] overflow-hidden bg-white">
        {photo ? (
          <>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="18rem"
              className={cn(
                "transition-transform duration-700 ease-smooth group-hover:scale-105",
                fit === "contain" ? "object-contain p-2" : "object-cover",
              )}
            />
            <PhotoWatermark size="sm" />
          </>
        ) : (
          <span aria-hidden className="brand-gradient absolute inset-0 grid place-items-center">
            <Icon name={icon} className="size-10 text-white/90" />
          </span>
        )}
      </span>
      <span className="block px-4 py-3.5 font-display text-[17px] font-bold">{title}</span>
    </Link>
  );
}
