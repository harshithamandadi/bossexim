import { cn } from "@/lib/cn";

/** Flowing ribbons used along section edges, echoing the brand banner. */
export function WaveDivider({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 overflow-hidden leading-none",
        // Dissolve the filled area so it never ends on a hard horizontal edge.
        "[mask-image:linear-gradient(to_bottom,#000_35%,transparent)]",
        flip ? "top-0 rotate-180" : "bottom-0",
        className,
      )}
    >
      <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="h-[11vw] max-h-40 min-h-16 w-full">
        <path
          d="M0 118C240 196 480 38 720 88s480 128 720 58v74H0Z"
          className="fill-brand/10"
        />
        <path
          d="M0 158C260 90 520 188 780 140s460 24 660-12v94H0Z"
          className="fill-brand/16"
        />
        <path
          d="M0 88C260 158 520 28 800 78s380 22 640-14"
          fill="none"
          strokeWidth="2"
          className="stroke-tide/40"
        />
      </svg>
    </div>
  );
}
