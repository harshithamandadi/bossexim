import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/cn";

const sizes = {
  sm: "h-3.5 bottom-2 right-2",
  md: "h-5 bottom-3 right-3",
  lg: "h-7 bottom-4 right-4",
} as const;

/**
 * A small BOSS mark in brand blue in the corner of a photo (client request: brand the
 * photos; blue, Oct 2026). Place inside a `relative` photo container, after the image.
 */
export function PhotoWatermark({ size = "md", className }: { size?: keyof typeof sizes; className?: string }) {
  return (
    <LogoMark
      className={cn(
        "pointer-events-none absolute w-auto text-brand/75 drop-shadow-[0_0_2px_rgb(255_255_255/0.9)] select-none",
        sizes[size],
        className,
      )}
    />
  );
}
