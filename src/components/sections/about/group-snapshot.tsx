import { CompanyList } from "@/components/sections/group/company-grid";
import { ProseSplit } from "@/components/sections/shared/prose";
import { ButtonLink } from "@/components/ui/button";
import { aboutGroup } from "@/config";

export function GroupSnapshot() {
  return (
    <ProseSplit
      content={aboutGroup}
      aside={
        <ButtonLink href={aboutGroup.cta.href} variant="secondary" withArrow>
          {aboutGroup.cta.label}
        </ButtonLink>
      }
    >
      <CompanyList className="mt-12 max-w-2xl" />
    </ProseSplit>
  );
}
