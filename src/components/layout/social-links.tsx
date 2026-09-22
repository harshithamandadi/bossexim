import { Chip } from "@/components/ui/chip";
import { uiLabels } from "@/config";
import { cn } from "@/lib/cn";
import type { SocialLink } from "@/types/content";

/** Social profiles (set in the admin). Profiles without a link show as "coming soon". */
export function SocialLinks({ links, className }: { links: SocialLink[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {links.map(({ platform, href }) => (
        <li key={platform}>
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="group">
              <Chip variant="outline" className="px-3.5 py-1.5 text-[13px] transition-colors group-hover:text-fg group-hover:ring-fg/30">
                {platform}
              </Chip>
            </a>
          ) : (
            <Chip variant="outline" title={uiLabels.comingSoon} className="px-3.5 py-1.5 text-[13px] opacity-60">
              {platform}
            </Chip>
          )}
        </li>
      ))}
    </ul>
  );
}
