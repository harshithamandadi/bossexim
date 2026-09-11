import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { GradientGlow } from "@/components/ui/gradient-glow";
import { IconTile } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import { containerLine } from "@/config";

export function ContainerLineSpotlight() {
  return (
    <div data-tone="dark" className="relative isolate overflow-hidden rounded-panel bg-canvas p-8 sm:p-14">
      <GradientGlow className="-z-10 opacity-80" />
      <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
        <SectionHeader {...containerLine.heading} />
        <RevealGroup as="ul" className="grid gap-3 sm:grid-cols-2">
          {containerLine.services.map((service) => (
            <RevealItem
              as="li"
              key={service.title}
              className="rounded-card bg-surface/80 p-6 ring-1 ring-inset ring-border backdrop-blur"
            >
              <IconTile icon={service.icon} size="sm" variant="soft" />
              <h3 className="type-h4 mt-5">{service.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-mute">{service.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
