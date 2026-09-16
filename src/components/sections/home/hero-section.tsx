"use client";

import { motion } from "framer-motion";
import { AnimatedHeadline } from "@/components/motion/animated-headline";
import { TradeWheel } from "@/components/sections/home/trade-wheel";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { WaveDivider } from "@/components/ui/wave-divider";
import { homeContent, siteConfig } from "@/config";
import { enterOnLoad } from "@/lib/motion";

export function HeroSection() {
  const { hero } = homeContent;
  const { company } = siteConfig;

  return (
    <section data-tone="light" className="relative overflow-hidden bg-canvas pt-32 pb-28 sm:pt-40 sm:pb-32">
      <div aria-hidden className="sky-wash absolute inset-0" />
      <div
        aria-hidden
        className="map-dots absolute inset-0 opacity-60 [mask-image:radial-gradient(75%_60%_at_72%_18%,#000,transparent_75%)]"
      />
      <WaveDivider />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        <div className="text-center lg:text-left">
          <motion.div {...enterOnLoad(0)} className="flex justify-center lg:justify-start">
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </motion.div>

          <AnimatedHeadline
            text={hero.title}
            highlight={hero.highlight}
            className="type-h1 mt-6 text-balance text-navy"
          />

          <motion.p {...enterOnLoad(0.4)} className="type-lead mx-auto mt-7 max-w-xl text-pretty text-fg-mute lg:mx-0">
            {hero.description}
          </motion.p>

          <motion.div {...enterOnLoad(0.5)} className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
            <ButtonLink href={hero.primaryCta.href} size="lg" variant="brand" withArrow>
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} size="lg" variant="secondary">
              {hero.secondaryCta.label}
            </ButtonLink>
          </motion.div>

          <motion.ul
            {...enterOnLoad(0.6)}
            className="mt-10 flex flex-wrap justify-center gap-x-3 gap-y-2 text-sm font-semibold text-navy/85 lg:justify-start"
          >
            {company.roles.map((role, index) => (
              <li key={role} className="flex items-center gap-3">
                {index > 0 && <span aria-hidden className="h-3.5 w-px bg-brand/40" />}
                {role}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div {...enterOnLoad(0.25)}>
          <TradeWheel className="mx-auto max-w-[27rem]" />
        </motion.div>
      </Container>
    </section>
  );
}
