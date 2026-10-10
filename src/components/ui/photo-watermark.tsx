import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/cn";

const sizes = {
  sm: "h-3.5 bottom-2 right-2",
  md: "h-5 bottom-3 right-3",
  lg: "h-7 bottom-4 right-4",
} as const;

/**
 * A small, faded BOSS mark in the corner of a photo (client request: brand the
 * photos). Place inside a `relative` photo container, after the image.
 */
export function PhotoWatermark({ size = "md", className }: { size?: keyof typeof sizes; className?: string }) {
  return (
    <LogoMark
      className={cn(
        "pointer-events-none absolute w-auto text-white/70 drop-shadow-[0_1px_3px_rgb(0_0_0/0.55)] select-none",
        sizes[size],
        className,
      )}
    />
  );
}
