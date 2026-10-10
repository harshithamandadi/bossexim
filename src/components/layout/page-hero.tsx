import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
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
  /** Rendered beside the heading on large screens, e.g. a product photo. */
  media?: ReactNode;
}

export function PageHero({ content, align = "start", leading, children, media }: PageHeroProps) {
  return (
    <section data-tone="light" className="relative overflow-hidden bg-canvas pt-32 pb-12 text-fg sm:pt-36 sm:pb-14">
      <div aria-hidden className="sky-wash absolute inset-0" />
      <div
        aria-hidden
        className="map-dots absolute inset-0 opacity-50 [mask-image:radial-gradient(70%_65%_at_80%_10%,#000,transparent_72%)]"
      />
      <WaveDivider />
      <Container className="relative">
        {leading && <div className="mb-10">{leading}</div>}
        <div className={cn(media && "grid items-center gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16")}>
          <SectionHeader
            level="page"
            align={align}
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          >
            {children}
          </SectionHeader>
          {media}
        </div>
      </Container>
    </section>
  );
}
