import { LogoMark } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";

const { wordmark } = siteConfig.company;

/** Shown on the admin's sign-in screen. */
export function AdminLogo() {
  return (
    <div className="bg-admin-logo">
      <LogoMark className="bg-admin-logo__mark" />
      <div>
        <p className="bg-admin-logo__name">
          {wordmark.primary} <span>{wordmark.secondary}</span>
        </p>
        <p className="bg-admin-logo__label">Content admin</p>
      </div>
    </div>
  );
}

/** Shown in the admin's navigation. */
export function AdminIcon() {
  return <LogoMark className="bg-admin-icon" />;
}
