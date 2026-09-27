import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cardStyles } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { IconTile } from "@/components/ui/icon";
import { groupCompanies, sectionIds, toAnchorId } from "@/config";
import { cn } from "@/lib/cn";
import { getGroupCompanies } from "@/lib/content/queries";
import type { GroupCompany } from "@/types/content";

/** The company's logo on a white tile, or its icon when no logo is uploaded. */
function CompanyMark({ company, size, iconVariant }: { company: GroupCompany; size: "sm" | "md"; iconVariant: "brand" | "solid" | "soft" }) {
  if (!company.logo) return <IconTile icon={company.icon} size={size} variant={iconVariant} />;
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden bg-white ring-1 ring-inset ring-border",
        size === "sm" ? "size-10 rounded-xl" : "h-12 w-24 rounded-2xl",
      )}
    >
      <Image src={company.logo.src} alt={company.logo.alt} fill sizes="96px" className="object-contain p-1.5" />
    </span>
  );
}

function CurrentBadge({ company }: { company: GroupCompany }) {
  return company.isCurrent ? <Chip variant="brand">{groupCompanies.currentLabel}</Chip> : null;
}

/** Card grid — BOSS Group page. */
export async function CompanyGrid({ className }: { className?: string }) {
  const companies = await getGroupCompanies();

  return (
    <RevealGroup as="ul" className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {companies.map((company) => {
        const Wrapper = company.href ? "a" : "article";
        const anchor = toAnchorId(company.name);
        return (
          <RevealItem
            as="li"
            key={company.name}
            // Container Line has its own section with this anchor.
            id={anchor === sectionIds.group.containerLine ? undefined : anchor}
            className="scroll-mt-32"
          >
            <Wrapper
              href={company.href}
              data-tone={company.isCurrent ? "dark" : undefined}
              className={cardStyles({ interactive: Boolean(company.href), className: "flex h-full flex-col" })}
            >
              <div className="flex items-start justify-between gap-4">
                <CompanyMark company={company} size="md" iconVariant={company.isCurrent ? "brand" : "solid"} />
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
export async function CompanyList({ className }: { className?: string }) {
  const companies = await getGroupCompanies();

  return (
    <RevealGroup as="ul" interval={0.05} className={cn("divide-y divide-border border-y border-border", className)}>
      {companies.map((company) => (
        <RevealItem as="li" key={company.name} className="flex items-center gap-4 py-4">
          <CompanyMark company={company} size="sm" iconVariant={company.isCurrent ? "brand" : "soft"} />
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
