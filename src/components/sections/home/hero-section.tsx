"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AnimatedHeadline } from "@/components/motion/animated-headline";
import { TradeRoutesStage } from "@/components/sections/trade/trade-routes-stage";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GradientGlow } from "@/components/ui/gradient-glow";
import { homeContent, siteConfig } from "@/config";
import { EASE_APPLE, enterOnLoad } from "@/lib/motion";

const STAGE_TILT_DEGREES = 12;
const STAGE_START_SCALE = 0.9;

export function HeroSection() {
  const { hero } = homeContent;
  const stageRef = useRef<HTMLDivElement>(null);
  // The stage tilts up and scales to full size as it scrolls into view.
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "start 25%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [STAGE_START_SCALE, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [STAGE_TILT_DEGREES, 0]);

  return (
    <section data-tone="light" className="relative overflow-hidden bg-canvas pt-36 text-fg sm:pt-44">
      <GradientGlow />

      <Container className="relative flex flex-col items-center text-center">
        <motion.div {...enterOnLoad(0)}>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
        </motion.div>
        <AnimatedHeadline text={hero.title} highlight={hero.highlight} className="type-hero mt-7 max-w-5xl text-balance" />
        <motion.p {...enterOnLoad(0.55)} className="type-lead mt-8 max-w-2xl text-pretty text-fg-mute">
          {hero.description}
        </motion.p>
        <motion.div {...enterOnLoad(0.7)} className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href={hero.primaryCta.href} size="lg" withArrow>
            {hero.primaryCta.label}
          </ButtonLink>
          <ButtonLink href={hero.secondaryCta.href} size="lg" variant="secondary">
            {hero.secondaryCta.label}
          </ButtonLink>
        </motion.div>
        <motion.ul {...enterOnLoad(0.85)} className="mt-12 flex flex-wrap justify-center gap-x-3 gap-y-2 text-sm text-fg-mute">
          {siteConfig.company.roles.map((role, index) => (
            <li key={role} className="flex items-center gap-3">
              {index > 0 && <span aria-hidden className="h-3 w-px bg-fg/20" />}
              {role}
            </li>
          ))}
        </motion.ul>
      </Container>

      <Container size="wide" className="relative mt-16 pb-24 perspective-[1600px] sm:mt-20 sm:pb-32">
        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 1.2, ease: EASE_APPLE }}>
          <motion.div
            ref={stageRef}
            style={{ scale, rotateX }}
            className="origin-top overflow-hidden rounded-panel shadow-[0_50px_120px_-40px_rgb(0_0_0/0.45)]"
          >
            <TradeRoutesStage />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
