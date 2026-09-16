import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { WaveDivider } from "@/components/ui/wave-divider";
import { SectionHeader } from "@/components/ui/section-header";
import type { SectionContent } from "@/types/content";

interface PageHeroProps {
  content: SectionContent;
  align?: "start" | "center";
  /** Rendered above the heading, e.g. breadcrumbs. */
  leading?: ReactNode;
  /** Rendered below the description, e.g. call-to-action buttons. */
  children?: ReactNode;
}

export function PageHero({ content, align = "start", leading, children }: PageHeroProps) {
  return (
    <section data-tone="light" className="relative overflow-hidden bg-canvas pt-36 pb-16 text-fg sm:pt-44 sm:pb-20">
      <div aria-hidden className="sky-wash absolute inset-0" />
      <div
        aria-hidden
        className="map-dots absolute inset-0 opacity-50 [mask-image:radial-gradient(70%_65%_at_80%_10%,#000,transparent_72%)]"
      />
      <WaveDivider />
      <Container className="relative">
        {leading && <div className="mb-10">{leading}</div>}
        <SectionHeader
          level="page"
          align={align}
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        >
          {children}
        </SectionHeader>
      </Container>
    </section>
  );
}
