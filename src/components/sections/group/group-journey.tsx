import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { groupJourney } from "@/config";
import { formatStepNumber, getInitials } from "@/lib/format";

const content = groupJourney;

/** BOSS Group's milestones, values and group leadership. */
export function GroupJourney() {
  return (
    <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
      <div>
        <SectionHeader {...content.heading} />
        <Reveal>
          <p className="type-h4 mt-10 border-l-2 border-brand pl-5">{content.values.title}</p>
          <p className="mt-3 pl-5 text-[15px] leading-relaxed text-fg-mute">{content.values.text}</p>
        </Reveal>
        <h3 className="type-eyebrow mt-12 text-fg-mute">{content.leadersTitle}</h3>
        <RevealGroup as="ul" className="mt-4 space-y-3">
          {content.leaders.map((leader) => (
            <RevealItem as="li" key={leader.name} className="card-gradient rounded-card bg-surface p-6 ring-1 ring-inset ring-border">
              <div className="flex items-center gap-4">
                <span aria-hidden className="brand-gradient grid size-12 shrink-0 place-items-center rounded-full font-display text-base font-bold text-white">
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

      <RevealGroup as="ol" interval={0.05} className="grid content-start gap-3 sm:grid-cols-2 lg:mt-2">
        {content.eras.map((era, index) => (
          <RevealItem as="li" key={era.period} className="card-gradient rounded-card bg-surface p-5 ring-1 ring-inset ring-border">
            <p className="font-display text-sm font-bold text-brand tabular-nums">
              <span className="mr-2 text-fg-mute">{formatStepNumber(index + 1)}</span>
              {era.period}
            </p>
            <h3 className="type-h4 mt-1">{era.title}</h3>
            <ol className="relative mt-4 space-y-3 border-l border-border pl-5">
              {era.milestones.map((milestone) => (
                <li key={`${milestone.year}-${milestone.title}`} className="relative">
                  <span aria-hidden className="absolute top-1.5 -left-[25px] size-2.5 rounded-full bg-brand ring-4 ring-surface" />
                  <p className="font-display text-sm font-bold text-brand tabular-nums">{milestone.year}</p>
                  <p className="mt-0.5 text-[15px] leading-snug">{milestone.title}</p>
                </li>
              ))}
            </ol>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
