import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { groupFounders } from "@/config";

const content = groupFounders;

/** The BOSS Group founders: photo, name and role, the opening paragraph and the full profile on request. */
export function GroupFounders() {
  return (
    <>
      <SectionHeader {...content.heading} />
      <RevealGroup as="ul" className="mt-10 grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
        {content.founders.map((founder) => {
          const [lead, ...rest] = founder.bio;
          return (
            <RevealItem as="li" key={founder.name} className="card-gradient overflow-hidden rounded-card bg-surface ring-1 ring-inset ring-border">
              <div className="relative aspect-[4/3] overflow-hidden bg-mist">
                <Image
                  src={founder.photo.src}
                  alt={founder.photo.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                  className="object-cover object-[50%_20%]"
                />
              </div>
              <div className="p-6 sm:p-7">
                <h3 className="type-h3">{founder.name}</h3>
                <p className="mt-1 text-[15px] font-semibold text-brand">{founder.role}</p>
                <div className="mt-4 text-[15px] leading-relaxed text-pretty text-fg-mute">
                  <p>{lead}</p>
                  {rest.length > 0 && (
                    <details className="group mt-3">
                      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-brand [&::-webkit-details-marker]:hidden">
                        {content.readProfile}
                        <ChevronDown aria-hidden className="size-4 transition-transform duration-300 group-open:rotate-180" />
                      </summary>
                      <div className="mt-3 space-y-3">
                        {rest.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </>
  );
}
