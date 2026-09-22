import type { ServerProps } from "payload";
import { compliance } from "@/config/about";
import { siteConfig } from "@/config/site";
import { socialFieldName } from "../globals/company-details";

const ADMIN = "/admin";

interface ChecklistItem {
  label: string;
  missing: number;
  total: number;
  href: string;
}

/**
 * Dashboard welcome: quick links, plus a live checklist of content the site is
 * still waiting for, so editors can see at a glance what shows "To be added".
 */
export async function DashboardWelcome({ payload, user }: ServerProps) {
  const [company, team, galleries, resources, products] = await Promise.all([
    payload.findGlobal({ slug: "company-details", depth: 0 }),
    payload.count({ collection: "team-members" }),
    payload.find({ collection: "galleries", depth: 0, pagination: false }),
    payload.find({ collection: "resources", depth: 0, pagination: false }),
    payload.count({ collection: "products" }),
  ]);

  const contact = company.contact ?? {};
  const social: Partial<Record<string, string | null>> = company.social ?? {};
  const registrations = company.registrations ?? {};
  const contactValues = [contact.email, contact.phone, contact.address];
  const socialValues = siteConfig.socialPlatforms.map((platform) => social[socialFieldName(platform)]);
  const registrationValues = compliance.items.map((item) => registrations[item.key]);
  const countEmpty = (values: (string | null | undefined)[]) => values.filter((value) => !value).length;
  const companyHref = `${ADMIN}/globals/company-details`;

  const checklist: ChecklistItem[] = [
    { label: "Contact email, phone and office address", missing: countEmpty(contactValues), total: contactValues.length, href: companyHref },
    { label: "Registration numbers", missing: countEmpty(registrationValues), total: registrationValues.length, href: companyHref },
    { label: "Social profile links", missing: countEmpty(socialValues), total: socialValues.length, href: companyHref },
    { label: "Leadership profiles", missing: team.totalDocs === 0 ? 1 : 0, total: 1, href: `${ADMIN}/collections/team-members` },
    {
      label: "Gallery photos",
      missing: galleries.docs.filter((gallery) => !gallery.images?.length).length,
      total: galleries.totalDocs,
      href: `${ADMIN}/collections/galleries`,
    },
    {
      label: "Download files",
      missing: resources.docs.filter((resource) => !resource.file).length,
      total: resources.totalDocs,
      href: `${ADMIN}/collections/resources`,
    },
  ];
  const outstanding = checklist.filter((item) => item.missing > 0);

  return (
    <section className="bg-welcome">
      <div className="bg-welcome__intro">
        <p className="bg-welcome__eyebrow">{siteConfig.company.name}</p>
        <h2 className="bg-welcome__title">Welcome back{user?.name ? `, ${user.name}` : ""}.</h2>
        <p className="bg-welcome__text">
          Changes appear on the website as soon as you save. {products.totalDocs} products are live.
        </p>
        <div className="bg-welcome__links">
          <a className="bg-welcome__link bg-welcome__link--primary" href="/" target="_blank" rel="noreferrer">
            View website ↗
          </a>
          <a className="bg-welcome__link" href={`${ADMIN}/collections/products/create`}>
            Add a product
          </a>
          <a className="bg-welcome__link" href={`${ADMIN}/collections/faqs`}>
            Edit FAQs
          </a>
          <a className="bg-welcome__link" href={companyHref}>
            Company details
          </a>
        </div>
      </div>

      <div className="bg-welcome__checklist">
        <h3 className="bg-welcome__subtitle">
          {outstanding.length > 0 ? "Still to add" : "All set"}
        </h3>
        {outstanding.length > 0 ? (
          <ul>
            {outstanding.map((item) => (
              <li key={item.label}>
                <a href={item.href}>
                  <span>{item.label}</span>
                  <span className="bg-welcome__count">
                    {item.total > 1 ? `${item.missing} of ${item.total} missing` : "None yet"}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="bg-welcome__text">Every section of the site has its content.</p>
        )}
      </div>
    </section>
  );
}
