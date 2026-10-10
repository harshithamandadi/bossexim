import { useId } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { groupJourney, type Milestone } from "@/config";
import { cn } from "@/lib/cn";
import { getInitials } from "@/lib/format";

const content = groupJourney;

/** BOSS Group's key milestones on one line, then its values and group leadership. */
export function GroupJourney() {
  return (
    <div>
      <SectionHeader {...content.heading} />
      <CurvedTimeline milestones={content.milestones} className="mt-8 hidden lg:block" />
      <StraightTimeline milestones={content.milestones} className="mt-10 lg:hidden" />

      <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal>
          <p className="type-h4 border-l-2 border-brand pl-5">{content.values.title}</p>
          <p className="mt-3 pl-5 text-[15px] leading-relaxed text-fg-mute">{content.values.text}</p>
        </Reveal>
        <div>
          <h3 className="type-eyebrow text-fg-mute">{content.leadersTitle}</h3>
          <RevealGroup as="ul" className="mt-4 grid gap-3 md:grid-cols-2">
            {content.leaders.map((leader) => (
              <RevealItem
                as="li"
                key={leader.name}
                className="card-gradient rounded-card bg-surface p-6 ring-1 ring-inset ring-border"
              >
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden
                    className="brand-gradient grid size-12 shrink-0 place-items-center rounded-full font-display text-base font-bold text-white"
                  >
                    {getInitials(leader.name)}
                  </span>
                  <div>
                    <p className="type-h4">{leader.name}</p>
                    <p className="mt-0.5 text-sm font-medium text-brand">{leader.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-fg-mute">{leader.bio}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </div>
  );
}

/* A gentle wave across the full width; milestones sit on it, labels alternating above and below. */
const WAVE_WIDTH = 1000;
const WAVE_HEIGHT = 120;
const WAVE_MID = WAVE_HEIGHT / 2;
const WAVE_AMPLITUDE = 34;
const WAVE_CYCLES = 1.5;
const LABEL_ZONE = "7.5rem";

const waveY = (x: number) => WAVE_MID - WAVE_AMPLITUDE * Math.sin((x / WAVE_WIDTH) * WAVE_CYCLES * 2 * Math.PI);

const WAVE_PATH = Array.from({ length: 101 }, (_, step) => {
  const x = (step / 100) * WAVE_WIDTH;
  return `${step === 0 ? "M" : "L"}${x.toFixed(1)} ${waveY(x).toFixed(1)}`;
}).join(" ");

function CurvedTimeline({ milestones, className }: { milestones: Milestone[]; className?: string }) {
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
        {milestones.map((milestone, index) => {
          const x = ((index + 0.5) / milestones.length) * WAVE_WIDTH;
          const above = index % 2 === 0;
          return (
            <li
              key={milestone.year}
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
                <div className={cn("absolute left-0 w-44 -translate-x-1/2 text-center", above ? "bottom-10" : "top-10")}>
                  <p className="font-display text-2xl leading-none font-extrabold text-brand tabular-nums">{milestone.year}</p>
                  <p className="mt-2 text-sm leading-snug text-pretty">{milestone.title}</p>
                </div>
              </RevealItem>
            </li>
          );
        })}
      </RevealGroup>
    </div>
  );
}

function StraightTimeline({ milestones, className }: { milestones: Milestone[]; className?: string }) {
  return (
    <RevealGroup as="ol" interval={0.06} className={cn("relative ml-2.5 space-y-7 border-l-2 border-brand/30 pl-7", className)}>
      {milestones.map((milestone) => (
        <RevealItem as="li" key={milestone.year} className="relative">
          <span
            aria-hidden
            className="absolute top-1 -left-[37px] grid size-5 place-items-center rounded-full bg-canvas ring-2 ring-brand"
          >
            <span className="size-2 rounded-full bg-brand" />
          </span>
          <p className="font-display text-xl leading-none font-extrabold text-brand tabular-nums">{milestone.year}</p>
          <p className="mt-1.5 text-[15px] leading-snug">{milestone.title}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
