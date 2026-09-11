import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cardStyles } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { IconTile } from "@/components/ui/icon";
import { groupCompanies } from "@/config";
import { cn } from "@/lib/cn";
import type { GroupCompany } from "@/types/content";

function CurrentBadge({ company }: { company: GroupCompany }) {
  return company.isCurrent ? <Chip variant="brand">{groupCompanies.currentLabel}</Chip> : null;
}

/** Card grid — BOSS Group page. */
export function CompanyGrid({ className }: { className?: string }) {
  return (
    <RevealGroup as="ul" className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {groupCompanies.items.map((company) => {
        const Wrapper = company.href ? "a" : "article";
        return (
          <RevealItem as="li" key={company.name}>
            <Wrapper
              href={company.href}
              data-tone={company.isCurrent ? "dark" : undefined}
              className={cardStyles({ interactive: Boolean(company.href), className: "flex h-full flex-col" })}
            >
              <div className="flex items-start justify-between gap-4">
                <IconTile icon={company.icon} variant={company.isCurrent ? "brand" : "solid"} />
                <CurrentBadge company={company} />
              </div>
              <h3 className="type-h4 mt-10">{company.name}</h3>
              <p className="mt-2 text-[15px] text-fg-mute">{company.description}</p>
            </Wrapper>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}

/** Compact list — About page. */
export function CompanyList({ className }: { className?: string }) {
  return (
    <RevealGroup as="ul" interval={0.05} className={cn("divide-y divide-border border-y border-border", className)}>
      {groupCompanies.items.map((company) => (
        <RevealItem as="li" key={company.name} className="flex items-center gap-4 py-4">
          <IconTile icon={company.icon} size="sm" variant={company.isCurrent ? "brand" : "soft"} />
          <div className="min-w-0 flex-1">
            <p className="font-medium">{company.name}</p>
            <p className="text-sm text-fg-mute">{company.description}</p>
          </div>
          <CurrentBadge company={company} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
