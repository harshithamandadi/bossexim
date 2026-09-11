import { Chip } from "@/components/ui/chip";
import { siteConfig, uiLabels } from "@/config";
import { cn } from "@/lib/cn";

/** Social profiles from config. Profiles without a URL show as "coming soon". */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {siteConfig.social.map(({ platform, href }) => (
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
