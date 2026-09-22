import { Download } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { buttonStyles } from "@/components/ui/button";
import { cardStyles } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { IconTile } from "@/components/ui/icon";
import { resourcesContent } from "@/config";
import { cn } from "@/lib/cn";
import { getResources } from "@/lib/content/queries";

export async function ResourceList({ className }: { className?: string }) {
  const { labels } = resourcesContent;
  const items = await getResources();

  return (
    <RevealGroup as="ul" className={cn("grid gap-4 md:grid-cols-3", className)}>
      {items.map((resource) => (
        <RevealItem as="li" key={resource.title}>
          <article className={cardStyles({ className: "flex h-full flex-col" })}>
            <div className="flex items-start justify-between gap-4">
              <IconTile icon={resource.icon} size="lg" />
              <Chip variant="outline">{resource.format}</Chip>
            </div>
            <h3 className="type-h4 mt-12">{resource.title}</h3>
            <p className="mt-2 text-[15px] text-fg-mute">{resource.description}</p>
            <div className="mt-auto pt-8">
              {resource.href ? (
                <a href={resource.href} target="_blank" rel="noopener" className={buttonStyles({ size: "sm" })}>
                  <Download aria-hidden className="size-4" />
                  {labels.download}
                </a>
              ) : (
                <Chip>{labels.comingSoon}</Chip>
              )}
            </div>
          </article>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
