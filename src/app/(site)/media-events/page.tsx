import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { MediaGrid } from "@/components/sections/group/media-grid";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { mediaEvents, pageContent, routes } from "@/config";
import { createPageMetadata } from "@/lib/metadata";

const content = pageContent.media;

export const metadata = createPageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: routes.media,
});

export default function MediaEventsPage() {
  return (
    <>
      <PageHero content={content} />
      <Section spacing="compact">
        <SectionHeader {...mediaEvents.heading} />
        <MediaGrid className="mt-12" />
        <Reveal>
          <p className="mt-10 max-w-2xl text-[15px] leading-relaxed text-fg-mute">{mediaEvents.note}</p>
        </Reveal>
      </Section>
      <CtaSection />
    </>
  );
}
