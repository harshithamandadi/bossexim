import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ExpandableBio } from "@/components/ui/expandable-bio";
import { SectionHeader } from "@/components/ui/section-header";
import { groupFounders } from "@/config";

const content = groupFounders;

/** The BOSS Group founders: photo, name and role, the opening paragraph and the full profile on request. */
export function GroupFounders() {
  return (
    <>
      <SectionHeader {...content.heading} layout="split" />
      <RevealGroup as="ul" className="mt-10 grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
        {content.founders.map((founder) => {
          return (
            <RevealItem as="li" key={founder.name} className="card-gradient flex flex-col overflow-hidden rounded-card bg-surface ring-1 ring-inset ring-border">
              <div className="relative aspect-[4/3] overflow-hidden bg-mist">
                <Image
                  src={founder.photo.src}
                  alt={founder.photo.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="type-h3">{founder.name}</h3>
                <p className="mt-1 text-[15px] font-semibold text-brand">{founder.role}</p>
                <ExpandableBio paragraphs={founder.bio} moreLabel={content.readProfile} lessLabel={content.showLess} className="mt-4" />
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </>
  );
}
