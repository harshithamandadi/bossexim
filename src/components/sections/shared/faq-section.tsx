import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Section, type SectionTone } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { SplitLayout } from "@/components/ui/split-layout";
import { closingCta, faqContent, faqPageLabels, routes } from "@/config";

/** Shows the first `limit` questions, with a link to the full FAQ page. */
export function FaqSection({ tone, id, limit = 6 }: { tone?: SectionTone; id?: string; limit?: number }) {
  const items = faqContent.items.slice(0, limit);
  const aside = (
    <SectionHeader {...faqContent.heading}>
      <ButtonLink href={closingCta.primary.href} variant="secondary" withArrow>
        {closingCta.primary.label}
      </ButtonLink>
    </SectionHeader>
  );

  return (
    <Section id={id} tone={tone}>
      <SplitLayout aside={aside} stickyAside>
        <Reveal>
          <Accordion items={items} />
          {items.length < faqContent.items.length && (
            <Link href={routes.faq} className="group mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-brand">
              {faqPageLabels.seeAll} ({faqContent.items.length})
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-200 ease-smooth group-hover:translate-x-0.5"
              />
            </Link>
          )}
        </Reveal>
      </SplitLayout>
    </Section>
  );
}
