import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { IconTile } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatStepNumber } from "@/lib/format";
import type { Feature } from "@/types/content";

/** The process steps as one compact row of numbered tiles (the full version lives on Trade Process). */
export function ProcessStrip({ steps, className }: { steps: Feature[]; className?: string }) {
  return (
    <RevealGroup as="ol" className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6", className)}>
      {steps.map((step, index) => (
        <RevealItem
          as="li"
          key={step.title}
          className="relative overflow-hidden card-gradient rounded-card bg-surface p-5 ring-1 ring-inset ring-border"
        >
          <div className="flex items-start justify-between gap-3">
            <IconTile icon={step.icon} size="sm" variant="soft" />
            <span className="font-display text-2xl leading-none font-extrabold text-brand/70 tabular-nums">
              {formatStepNumber(index + 1)}
            </span>
          </div>
          <h3 className="mt-4 font-display text-[17px] font-bold">{step.title}</h3>
          <p className="mt-1.5 line-clamp-4 text-[13px] leading-snug text-fg-mute">{step.description}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
