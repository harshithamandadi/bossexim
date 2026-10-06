"use client";

import { motion } from "framer-motion";
import { AnimatedHeadline } from "@/components/motion/animated-headline";
import { TradeWheel } from "@/components/sections/home/trade-wheel";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LogoMark } from "@/components/ui/logo";
import { WaveDivider } from "@/components/ui/wave-divider";
import { WorldDotsMap } from "@/components/ui/world-dots-map";
import { homeContent, siteConfig } from "@/config";
import { enterOnLoad } from "@/lib/motion";
import type { Product } from "@/types/content";

export function HeroSection({ products }: { products: Product[] }) {
  const { hero } = homeContent;
  const { company } = siteConfig;

  return (
    <section data-tone="light" className="relative overflow-hidden bg-canvas pt-28 pb-20 sm:pt-32 sm:pb-24">
      <div aria-hidden className="sky-wash absolute inset-0" />
      {/*
        A flat dotted world map across the hero (client request). It fades almost
        away behind the text column so the headline and copy stay easy to read:
        the left side on desktop, the top half on phones.
      */}
      <WorldDotsMap
        variant="backdrop"
        className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,rgb(0_0_0/0.08)_0%,rgb(0_0_0/0.08)_58%,#000_78%)] lg:[mask-image:linear-gradient(to_right,rgb(0_0_0/0.06)_0%,rgb(0_0_0/0.08)_44%,rgb(0_0_0/0.6)_54%,#000_64%)]"
      />
      <WaveDivider />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        <div className="text-center lg:text-left">
          {/* The BOSS Group badge and BGEXIM's two roles, above the headline (client request). */}
          <motion.div
            {...enterOnLoad(0)}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 lg:justify-start"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full bg-elevated/85 py-1.5 pr-4 pl-2 shadow-[0_8px_24px_-12px_rgb(8_33_79/0.35)] ring-1 ring-border backdrop-blur">
              <span className="grid h-7 w-9 place-items-center rounded-full bg-logo">
                <LogoMark className="h-3 w-auto text-white" />
              </span>
              <span className="font-display text-sm font-bold text-fg">{company.parentGroup}</span>
            </span>
            <ul className="flex items-center gap-3 text-sm font-semibold text-fg/85">
              {company.roles.map((role, index) => (
                <li key={role} className="flex items-center gap-3">
                  {index > 0 && <span aria-hidden className="h-3.5 w-px bg-brand/40" />}
                  {role}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...enterOnLoad(0.1)} className="mt-6 flex justify-center lg:justify-start">
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </motion.div>

          <AnimatedHeadline
            text={hero.title}
            highlight={hero.highlight}
            className="type-h1 mt-6 text-balance text-fg"
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

        </div>

        <motion.div {...enterOnLoad(0.25)}>
          <TradeWheel products={products} className="mx-auto max-w-[27rem]" />
        </motion.div>
      </Container>
    </section>
  );
}
