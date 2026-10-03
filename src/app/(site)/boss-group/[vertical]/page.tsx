import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalNav } from "@/components/layout/local-nav";
import { PageHero } from "@/components/layout/page-hero";
import { ContainerLineSpotlight } from "@/components/sections/group/container-line";
import { ContainerLineNetwork } from "@/components/sections/group/container-line-network";
import { VerticalLinks } from "@/components/sections/group/vertical-links";
import { CtaSection } from "@/components/sections/shared/cta-section";
import { FeatureGrid } from "@/components/sections/shared/feature-grid";
import { ProseSplit } from "@/components/sections/shared/prose";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Section } from "@/components/ui/section";
import {
  getGroupVertical,
  groupVerticalHref,
  groupVerticalLabels,
  groupVerticals,
  pageContent,
  routes,
  sectionIds,
  type GroupVertical,
} from "@/config";
import { createPageMetadata } from "@/lib/metadata";

interface VerticalPageProps {
  params: Promise<{ vertical: string }>;
}

export function generateStaticParams() {
  return groupVerticals.map((vertical) => ({ vertical: vertical.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: VerticalPageProps): Promise<Metadata> {
  const vertical = getGroupVertical((await params).vertical);
  if (!vertical) return {};
  return createPageMetadata({
    title: `${vertical.name} · BOSS Group`,
    description: vertical.hero.description ?? "",
    path: groupVerticalHref(vertical.slug),
  });
}

export default async function GroupVerticalPage({ params }: VerticalPageProps) {
  const vertical = getGroupVertical((await params).vertical);
  if (!vertical) notFound();

  return (
    <>
      <PageHero
        content={vertical.hero}
        leading={<Breadcrumbs items={[{ label: pageContent.group.metaTitle, href: routes.group }]} current={vertical.name} />}
      />
      {vertical.slug === "container-line" ? <ContainerLineBody /> : <VerticalBody vertical={vertical} />}
      <Section spacing="compact" tone="mist">
        <VerticalLinks current={vertical.slug} title={groupVerticalLabels.otherVerticals} />
      </Section>
      <CtaSection />
    </>
  );
}

function ContainerLineBody() {
  const ids = sectionIds.group;
  return (
    <>
      <LocalNav
        items={[
          { id: ids.containerLine, label: groupVerticalLabels.services },
          { id: ids.network, label: "Network & Offices" },
        ]}
      />
      <Section id={ids.containerLine} spacing="compact">
        <ContainerLineSpotlight />
      </Section>
      <Section id={ids.network} spacing="compact">
        <ContainerLineNetwork />
      </Section>
    </>
  );
}

function VerticalBody({ vertical }: { vertical: GroupVertical }) {
  return (
    <Section spacing="compact">
      <ProseSplit content={vertical.intro} accent="mark" />
      {vertical.capabilities.map((group) => (
        <div key={group.title ?? vertical.slug} className="mt-14">
          <h2 className="type-h3">{group.title ?? groupVerticalLabels.services}</h2>
          <FeatureGrid items={group.items} columns={3} className="mt-6" />
        </div>
      ))}
    </Section>
  );
}
