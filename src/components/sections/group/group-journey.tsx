import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { RisingTimeline } from "./rising-timeline";
import { groupJourney, type JourneyPeriod } from "@/config";
import { cn } from "@/lib/cn";

const content = groupJourney;

/** BOSS Group's journey on one line, in the client's own periods, then its values. */
export function GroupJourney() {
  return (
    <div>
      <SectionHeader {...content.heading} />
      <RisingTimeline periods={content.periods} className="mt-10 hidden lg:block" />
      <StraightTimeline periods={content.periods} className="mt-10 lg:hidden" />
      <Reveal className="mt-12 max-w-3xl">
        <p className="type-h4 border-l-2 border-brand pl-5">{content.values.title}</p>
        <p className="mt-3 pl-5 text-[15px] leading-relaxed text-fg-mute">{content.values.text}</p>
      </Reveal>
    </div>
  );
}

function StraightTimeline({ periods, className }: { periods: JourneyPeriod[]; className?: string }) {
  return (
    <RevealGroup as="ol" interval={0.06} className={cn("relative ml-2.5 space-y-7 border-l-2 border-brand/30 pl-7", className)}>
      {periods.map((item) => (
        <RevealItem as="li" key={item.period} className="relative">
          <span
            aria-hidden
            className="absolute top-1 -left-[37px] grid size-5 place-items-center rounded-full bg-canvas ring-2 ring-brand"
          >
            <span className="size-2 rounded-full bg-brand" />
          </span>
          <p className="font-display text-xl leading-none font-extrabold text-brand tabular-nums">{item.period}</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-fg-mute">{item.text}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
