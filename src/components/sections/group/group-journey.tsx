import { useId } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { groupJourney, type JourneyPeriod } from "@/config";
import { cn } from "@/lib/cn";

const content = groupJourney;

/** BOSS Group's journey on one line, in the client's own periods, then its values. */
export function GroupJourney() {
  return (
    <div>
      <SectionHeader {...content.heading} />
      <CurvedTimeline periods={content.periods} className="mt-8 hidden lg:block" />
      <StraightTimeline periods={content.periods} className="mt-10 lg:hidden" />
      <Reveal className="mt-12 max-w-3xl">
        <p className="type-h4 border-l-2 border-brand pl-5">{content.values.title}</p>
        <p className="mt-3 pl-5 text-[15px] leading-relaxed text-fg-mute">{content.values.text}</p>
      </Reveal>
    </div>
  );
}

/* A gentle wave across the full width; milestones sit on it, labels alternating above and below. */
const WAVE_WIDTH = 1000;
const WAVE_HEIGHT = 120;
const WAVE_MID = WAVE_HEIGHT / 2;
const WAVE_AMPLITUDE = 34;
const WAVE_CYCLES = 1.5;
const LABEL_ZONE = "10.5rem";

const waveY = (x: number) => WAVE_MID - WAVE_AMPLITUDE * Math.sin((x / WAVE_WIDTH) * WAVE_CYCLES * 2 * Math.PI);

const WAVE_PATH = Array.from({ length: 101 }, (_, step) => {
  const x = (step / 100) * WAVE_WIDTH;
  return `${step === 0 ? "M" : "L"}${x.toFixed(1)} ${waveY(x).toFixed(1)}`;
}).join(" ");

function CurvedTimeline({ periods, className }: { periods: JourneyPeriod[]; className?: string }) {
  const gradientId = `${useId().replace(/[^a-zA-Z0-9_-]/g, "")}-journey`;
  return (
    <div className={cn("relative", className)} style={{ height: `calc(${LABEL_ZONE} * 2 + ${WAVE_HEIGHT}px)` }}>
      <svg
        aria-hidden
        viewBox={`0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}`}
        preserveAspectRatio="none"
        className="absolute inset-x-0 w-full"
        style={{ top: LABEL_ZONE, height: WAVE_HEIGHT }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.25" />
            <stop offset="50%" stopColor="var(--color-brand)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <path d={WAVE_PATH} fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      </svg>

      <RevealGroup as="ol" interval={0.08}>
        {periods.map((item, index) => {
          const x = ((index + 0.5) / periods.length) * WAVE_WIDTH;
          const above = index % 2 === 0;
          return (
            <li
              key={item.period}
              className="absolute"
              style={{ left: `${(x / WAVE_WIDTH) * 100}%`, top: `calc(${LABEL_ZONE} + ${waveY(x)}px)` }}
            >
              <RevealItem>
                <span
                  aria-hidden
                  className="absolute top-0 left-0 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-canvas ring-2 ring-brand"
                >
                  <span className="size-2 rounded-full bg-brand" />
                </span>
                <span aria-hidden className={cn("absolute left-0 h-7 w-px bg-brand/30", above ? "bottom-3" : "top-3")} />
                <div className={cn("absolute left-0 w-64 -translate-x-1/2 text-center", above ? "bottom-10" : "top-10")}>
                  <p className="font-display text-xl leading-none font-extrabold text-brand tabular-nums">{item.period}</p>
                  <p className="mt-2 text-[13px] leading-snug text-pretty text-fg-mute">{item.text}</p>
                </div>
              </RevealItem>
            </li>
          );
        })}
      </RevealGroup>
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
