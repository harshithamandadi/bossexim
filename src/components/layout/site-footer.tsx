import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { WaveDivider } from "@/components/ui/wave-divider";
import { contactLink, mainNavigation, routes, siteConfig, uiLabels } from "@/config";
import { getCompanyDetails } from "@/lib/content/queries";
import { SocialLinks } from "./social-links";

const footerLinks = [
  { label: "Home", href: routes.home },
  ...mainNavigation.map(({ label, href }) => ({ label, href })),
  { label: "FAQs", href: routes.faq },
  contactLink,
];

export async function SiteFooter() {
  const { company, website, url } = siteConfig;
  const { social } = await getCompanyDetails();
  const year = new Date().getFullYear();

  return (
    <footer data-tone="dark" className="deep-gradient relative overflow-hidden text-fg">
      <WaveDivider flip />
      <Container className="relative pt-20 pb-10">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-md">
            <Link href={routes.home} aria-label={`${company.name} — home`} className="inline-block rounded-lg">
              <Logo showDescriptor />
            </Link>
            <p className="mt-6 font-display text-lg font-bold">{company.tagline}</p>
            <p className="type-body mt-2 text-fg-mute">{company.summary}</p>
            <SocialLinks links={social} className="mt-8 sm:flex-nowrap" />
          </div>

          {/* Main pages only (client feedback): one link per section, no sub-links. */}
          <nav aria-label={uiLabels.footerNavigation} className="lg:justify-self-end">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[15px] font-medium text-fg-mute transition-colors hover:text-fg">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p
          aria-hidden
          className="mt-12 bg-linear-to-b from-fg/25 to-transparent bg-clip-text text-center font-display text-[clamp(2.25rem,9vw,8.5rem)] leading-none font-semibold tracking-[-0.03em] whitespace-nowrap text-transparent select-none"
        >
          {company.wordmark.primary} {company.wordmark.secondary}
        </p>

        <div className="mt-4 flex flex-col gap-3 border-t border-border pt-8 text-sm text-fg-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName} · A {company.parentGroup} company
          </p>
          <a href={url} className="transition-colors hover:text-fg">
            {website}
          </a>
        </div>
      </Container>
    </footer>
  );
}
