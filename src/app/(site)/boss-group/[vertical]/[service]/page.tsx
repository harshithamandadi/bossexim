import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { MoreServices, ServiceForExim, ServiceMedia, ServiceOverview } from "@/components/sections/group/container-line-service";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Section } from "@/components/ui/section";
import {
  containerLineServiceHref,
  containerLineServices,
  getContainerLineService,
  getGroupVertical,
  groupVerticalHref,
  pageContent,
  routes,
} from "@/config";
import { createPageMetadata } from "@/lib/metadata";

/** Only BOSS Container Line has service pages: /boss-group/container-line/<service>. */
const VERTICAL = "container-line";

interface ServicePageProps {
  params: Promise<{ vertical: string; service: string }>;
}

export function generateStaticParams() {
  return containerLineServices.map((service) => ({ vertical: VERTICAL, service: service.slug }));
}

export const dynamicParams = false;

async function resolve(params: ServicePageProps["params"]) {
  const { vertical, service } = await params;
  return vertical === VERTICAL ? getContainerLineService(service) : undefined;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = await resolve(params);
  if (!service) return {};
  return createPageMetadata({
    title: `${service.title} · BOSS Container Line`,
    description: service.description,
    path: containerLineServiceHref(service.slug),
  });
}

export default async function ContainerLineServicePage({ params }: ServicePageProps) {
  const service = await resolve(params);
  const vertical = getGroupVertical(VERTICAL);
  if (!service || !vertical) notFound();

  return (
    <>
      <PageHero
        content={{ eyebrow: vertical.hero.eyebrow ?? vertical.name, title: service.title, description: service.description }}
        leading={
          <Breadcrumbs
            items={[
              { label: pageContent.group.metaTitle, href: routes.group },
              { label: vertical.name, href: groupVerticalHref(vertical.slug) },
            ]}
            current={service.title}
          />
        }
        media={<ServiceMedia service={service} />}
      />
      <Section spacing="compact">
        <ServiceOverview service={service} />
      </Section>
      {service.forExim && (
        <Section spacing="compact" className="pt-0 sm:pt-0">
          <ServiceForExim paragraphs={service.forExim} />
        </Section>
      )}
      <Section spacing="compact" tone="mist">
        <MoreServices current={service.slug} />
      </Section>
      <CtaSection />
    </>
  );
}
