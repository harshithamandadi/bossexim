import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { HeroSection } from "@/components/sections/home/hero-section";
import { ProductShowcase } from "@/components/sections/home/product-showcase";
import { StatsSection } from "@/components/sections/home/stats-section";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { ProcessStrip } from "@/components/sections/shared/process-strip";
import { ServicesBento } from "@/components/sections/shared/services-bento";
import { WorldTradeMap } from "@/components/sections/trade/world-trade-map";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { homeContent, howWeWork } from "@/config";
import { getCatalogue } from "@/lib/content/queries";
import type { LinkItem, SectionContent } from "@/types/content";

/** A section heading with its "explore" button beside it, so each home section stays short. */
function HomeSectionHeader({ content, cta }: { content: SectionContent; cta: LinkItem }) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <SectionHeader {...content} />
      <Reveal className="shrink-0">
        <ButtonLink href={cta.href} variant="secondary" withArrow>
          {cta.label}
        </ButtonLink>
      </Reveal>
    </div>
  );
}

function HomeSection({ children, ...props }: { children: ReactNode } & Parameters<typeof Section>[0]) {
  return (
    <Section spacing="compact" {...props}>
      {children}
    </Section>
  );
}

export default async function HomePage() {
  const { products, markets } = await getCatalogue();
  const { services, world, process } = homeContent;

  return (
    <>
      <HeroSection products={products} />
      <StatsSection />

      <HomeSection tone="mist">
        <HomeSectionHeader content={services} cta={services.cta} />
        <ServicesBento className="mt-10" />
      </HomeSection>

      <ProductShowcase />

      <HomeSection tone="dark">
        <HomeSectionHeader content={world} cta={world.cta} />
        <Reveal className="mt-10">
          <WorldTradeMap markets={markets} label={world.legend} />
        </Reveal>
      </HomeSection>

      <HomeSection>
        <HomeSectionHeader content={process} cta={process.cta} />
        <ProcessStrip steps={howWeWork.steps} className="mt-10" />
      </HomeSection>

      <CtaSection />
    </>
  );
}
