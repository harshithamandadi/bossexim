import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { WaveDivider } from "@/components/ui/wave-divider";
import { contactNavGroup, mainNavigation, routes, siteConfig, uiLabels } from "@/config";
import { SocialLinks } from "./social-links";

const footerGroups = [...mainNavigation, contactNavGroup];

export function SiteFooter() {
  const { company, contact, url } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer data-tone="dark" className="relative overflow-hidden bg-canvas text-fg">
      <WaveDivider flip />
      <Container className="relative pt-24 pb-10">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)]">
          <div className="max-w-sm">
            <Link href={routes.home} aria-label={`${company.name} — home`} className="inline-block rounded-lg">
              <Logo showDescriptor />
            </Link>
            <p className="type-body mt-6 text-fg-mute">{company.summary}</p>
            <SocialLinks className="mt-8" />
          </div>

          <nav aria-label={uiLabels.footerNavigation} className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.label}>
                <Link href={group.href} className="text-sm font-semibold transition-colors hover:text-fg-mute">
                  {group.label}
                </Link>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-sm text-fg-mute transition-colors hover:text-fg">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p
          aria-hidden
          className="mt-24 bg-linear-to-b from-fg/25 to-transparent bg-clip-text text-center font-display text-[clamp(2.5rem,11vw,10rem)] leading-none font-semibold tracking-[-0.06em] whitespace-nowrap text-transparent select-none"
        >
          {company.wordmark.primary} {company.wordmark.secondary}
        </p>

        <div className="mt-4 flex flex-col gap-3 border-t border-border pt-8 text-sm text-fg-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName} · A {company.parentGroup} company
          </p>
          <a href={url} className="transition-colors hover:text-fg">
            {contact.website}
          </a>
        </div>
      </Container>
    </footer>
  );
}
