import { ArrowUpRight, Award } from "lucide-react";
import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { groupRecognition } from "@/config";

const content = groupRecognition;

/** Awards with photos as cards, then the remaining awards as a list. */
export function GroupRecognition() {
  const pictured = content.items.filter((item) => item.image);
  const listed = content.items.filter((item) => !item.image);

  return (
    <>
      <SectionHeader {...content.heading}>
        <a
          href={content.press.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[15px] font-semibold text-brand underline-offset-4 hover:underline"
        >
          {content.press.label}
          <ArrowUpRight aria-hidden className="size-4" />
        </a>
      </SectionHeader>

      <RevealGroup as="ul" className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {pictured.map((item) => (
          <RevealItem as="li" key={item.title}>
            <figure className="flex h-full flex-col rounded-card bg-canvas p-3 ring-1 ring-inset ring-border">
              {item.image && (
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-surface">
                  <Image src={item.image.src} alt={item.image.alt} fill sizes="(min-width: 1024px) 200px, 45vw" className="object-cover" />
                </div>
              )}
              <figcaption className="mt-3 px-1 pb-1">
                <span className="block text-[13px] leading-snug font-medium text-pretty">{item.title}</span>
                <span className="mt-1 block text-xs text-fg-mute">{item.year}</span>
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>

      <RevealGroup as="ul" className="mt-8 grid gap-3 sm:grid-cols-2">
        {listed.map((item) => (
          <RevealItem as="li" key={item.title} className="flex items-start gap-3 rounded-card bg-canvas p-5 ring-1 ring-inset ring-border">
            <Award aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
            <span className="text-[15px] leading-snug">
              {item.title}
              {item.year && <span className="text-fg-mute"> · {item.year}</span>}
            </span>
          </RevealItem>
        ))}
      </RevealGroup>
    </>
  );
}
