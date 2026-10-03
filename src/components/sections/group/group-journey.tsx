import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { groupJourney } from "@/config";

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
            <RevealItem as="li" key={leader.name} className="card-gradient rounded-card bg-surface p-6">
              <p className="type-h4">{leader.name}</p>
              <p className="mt-0.5 text-sm font-medium text-brand">{leader.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-fg-mute">{leader.bio}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <RevealGroup as="ol" interval={0.04} className="relative border-l border-border pl-8 lg:mt-2">
        {content.milestones.map((milestone) => (
          <RevealItem as="li" key={`${milestone.year}-${milestone.title}`} className="relative pb-7 last:pb-0">
            <span aria-hidden className="absolute top-1.5 -left-[37px] size-2.5 rounded-full bg-brand ring-4 ring-canvas" />
            <p className="font-display text-sm font-bold text-brand">{milestone.year}</p>
            <p className="mt-1 text-[15px] leading-snug">{milestone.title}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
