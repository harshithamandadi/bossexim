import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { GradientGlow } from "@/components/ui/gradient-glow";
import { Section } from "@/components/ui/section";
import { closingCta } from "@/config";
import type { CallToAction } from "@/types/content";

export function CtaSection({ content = closingCta }: { content?: CallToAction }) {
  const { title, description, primary, secondary } = content;

  return (
    <Section spacing="compact" className="pb-20 sm:pb-24">
      <Reveal>
        <div
          data-tone="dark"
          className="deep-gradient relative isolate overflow-hidden rounded-panel px-6 py-16 text-center sm:px-16 sm:py-20"
        >
          <GradientGlow className="-z-10" />
          <div
            aria-hidden
            className="dot-grid absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]"
          />
          <h2 className="type-h2 mx-auto max-w-3xl text-balance">{title}</h2>
          <p className="type-lead mx-auto mt-6 max-w-xl text-pretty text-fg-mute">{description}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href={primary.href} size="lg" variant="brand" withArrow>
              {primary.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink href={secondary.href} size="lg" variant="secondary">
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
