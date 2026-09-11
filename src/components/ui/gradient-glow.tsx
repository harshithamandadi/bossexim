import { cn } from "@/lib/cn";

/** Soft ambient light used behind heroes and call-to-action panels. */
export function GradientGlow({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="glow-brand absolute -top-[40%] left-1/2 size-[64rem] -translate-x-1/2 rounded-full" />
      <div className="glow-tide absolute -top-[10%] -right-[15%] size-[40rem] rounded-full" />
    </div>
  );
}
