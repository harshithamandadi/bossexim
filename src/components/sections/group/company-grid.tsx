import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cardStyles } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { IconTile } from "@/components/ui/icon";
import { getVerticalForCompany, groupCompanies, groupVerticalHref, routes } from "@/config";
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

/** Card grid — BOSS Group page. Each vertical's card opens its own page. */
export async function CompanyGrid({ className }: { className?: string }) {
  const companies = await getGroupCompanies();

  return (
    // Four columns with the BOSS EXIM card spanning two: seven cards fill two rows with no gap.
    <RevealGroup as="ul" className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {companies.map((company) => {
        const vertical = getVerticalForCompany(company.name);
        const href = vertical ? groupVerticalHref(vertical.slug) : company.isCurrent ? routes.about : company.href;
        const isExternal = !vertical && !company.isCurrent && Boolean(company.href);
        const Wrapper = href ? Link : "article";
        return (
          <RevealItem as="li" key={company.name} className={cn(company.isCurrent && "lg:col-span-2")}>
            <Wrapper
              href={href ?? ""}
              {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
              data-tone={company.isCurrent ? "dark" : undefined}
              className={cardStyles({
                interactive: Boolean(href),
                className: cn("group flex h-full flex-col", company.isCurrent && "deep-gradient"),
              })}
            >
              <div className="flex items-start justify-between gap-4">
                <CompanyMark company={company} size="md" iconVariant={company.isCurrent ? "brand" : "solid"} />
                {company.isCurrent ? (
                  <CurrentBadge company={company} />
                ) : (
                  href && (
                    <ArrowUpRight
                      aria-hidden
                      className="size-5 text-fg-mute transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                    />
                  )
                )}
              </div>
              <h3 className="type-h4 mt-8">{vertical ? vertical.name : company.name}</h3>
              <p className="mt-2 text-[15px] text-fg-mute">{company.description}</p>
            </Wrapper>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}
