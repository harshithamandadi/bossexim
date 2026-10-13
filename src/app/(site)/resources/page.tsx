import { PageHero } from "@/components/layout/page-hero";
import { ResourceList } from "@/components/sections/resources/resource-list";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { LogoMark } from "@/components/ui/logo";
import { SectionHeader } from "@/components/ui/section-header";
import { VideoSlot } from "@/components/ui/video-slot";
import { contactHref, pageContent, resourcesContent, routes, sectionIds } from "@/config";
import { getCompanyDetails } from "@/lib/content/queries";
import { createPageMetadata } from "@/lib/metadata";

const content = pageContent.resources;
const { specifications } = resourcesContent;

export const metadata = createPageMetadata({
  title: content.metaTitle,
  description: content.metaDescription,
  path: routes.resources,
});

export default async function ResourcesPage() {
  const { video } = await getCompanyDetails();
  const videoContent = resourcesContent.video;

  return (
    <>
      <PageHero content={content} />
      <Section id={sectionIds.resources.video} spacing="compact">
        <SectionHeader {...videoContent} />
        {video ? (
          <VideoSlot video={video} playLabel={videoContent.playLabel} className="mt-10 max-w-5xl" />
        ) : (
          <div
            data-tone="dark"
            className="deep-gradient mt-10 grid aspect-video max-w-5xl place-items-center rounded-panel p-8 text-center"
          >
            <div>
              <LogoMark className="mx-auto h-14 w-auto text-white/85" />
              <p className="mt-5 text-[15px] text-fg-mute">{videoContent.comingSoon}</p>
            </div>
          </div>
        )}
      </Section>
      <Section id={sectionIds.resources.downloads} tone="mist" spacing="compact">
        <SectionHeader {...resourcesContent.heading} />
        <ResourceList className="mt-12" />
      </Section>
      <Section id={sectionIds.resources.specifications} spacing="compact">
        <SectionHeader {...specifications}>
          <ButtonLink href={contactHref({ type: "buyer" })} variant="brand" withArrow>
            {specifications.cta}
          </ButtonLink>
        </SectionHeader>
      </Section>
      <CtaSection />
    </>
  );
}
