import { CompanyList } from "@/components/sections/group/company-grid";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { SplitLayout } from "@/components/ui/split-layout";
import { aboutGroup } from "@/config";

export function GroupSnapshot() {
  const aside = (
    <SectionHeader {...aboutGroup.heading}>
      <ButtonLink href={aboutGroup.cta.href} variant="secondary" withArrow>
        {aboutGroup.cta.label}
      </ButtonLink>
    </SectionHeader>
  );

  return (
    <SplitLayout aside={aside} stickyAside>
      <CompanyList />
    </SplitLayout>
  );
}
