import { Reveal } from "@/components/motion/reveal";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Section, type SectionTone } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { SplitLayout } from "@/components/ui/split-layout";
import { closingCta, faqContent } from "@/config";

export function FaqSection({ tone, id }: { tone?: SectionTone; id?: string }) {
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
          <Accordion items={faqContent.items} />
        </Reveal>
      </SplitLayout>
    </Section>
  );
}
