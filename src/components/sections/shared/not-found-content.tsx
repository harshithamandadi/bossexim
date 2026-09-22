import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { routes, uiLabels } from "@/config";

export function NotFoundContent() {
  const { notFound } = uiLabels;

  return (
    <div className="min-h-[70vh]">
      <PageHero align="center" content={notFound}>
        <ButtonLink href={routes.home} size="lg" withArrow>
          {notFound.cta}
        </ButtonLink>
      </PageHero>
    </div>
  );
}
