import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface MarqueeProps {
  children: ReactNode;
  reverse?: boolean;
  durationSeconds?: number;
  className?: string;
}

const COPIES = [0, 1] as const;

/** Infinite, GPU-only (CSS transform) ticker. Pauses on hover; still for reduced motion. */
export function Marquee({ children, reverse = false, durationSeconds = 40, className }: MarqueeProps) {
  const style = { "--marquee-duration": `${durationSeconds}s` } as CSSProperties;

  return (
    <div className={cn("group edge-fade-x flex overflow-hidden", className)}>
      {COPIES.map((copy) => (
        <div
          key={copy}
          aria-hidden={copy > 0 || undefined}
          inert={copy > 0 || undefined}
          style={style}
          className={cn(
            "flex shrink-0 animate-marquee items-center gap-3 pr-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none",
            reverse && "[animation-direction:reverse]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
