import type { Payload, ServerProps } from "payload";
import { compliance } from "@/config/about";
import { siteConfig } from "@/config/site";
import { isEmailConfigured } from "../email";
import { socialFieldName } from "../globals/company-details";

const ADMIN = "/admin";
const DAY_MS = 24 * 60 * 60 * 1000;
const RECENT_DAYS = 30;
/** Alerts your team never received; "not set up" is covered by the email note instead. */
const UNSENT_ALERTS = ["failed", "no-recipients"];

interface ChecklistItem {
  label: string;
  missing: number;
  total: number;
  href: string;
  /** Replaces the default "x of y missing" text. */
  status?: string;
}

/**
 * Dashboard welcome: quick links, plus a live checklist of content the site is
 * still waiting for, so editors can see at a glance what shows "To be added".
 */
export async function DashboardWelcome({ payload, user }: ServerProps) {
  const [company, team, galleries, resources, products, groupCompanies, markets, recentEnquiries, unsentAlerts] = await Promise.all([
    payload.findGlobal({ slug: "company-details", depth: 0 }),
    payload.find({ collection: "team-members", depth: 0, pagination: false }),
    payload.find({ collection: "galleries", depth: 0, pagination: false }),
    payload.find({ collection: "resources", depth: 0, pagination: false }),
    payload.find({ collection: "products", depth: 0, pagination: false }),
    payload.find({ collection: "group-companies", depth: 0, pagination: false }),
    payload.find({ collection: "markets", depth: 0, pagination: false }),
    countRecentEnquiries(payload),
    payload.count({ collection: "enquiries", where: { notificationStatus: { in: UNSENT_ALERTS } } }),
  ]);

  const contact = company.contact ?? {};
  const social: Partial<Record<string, string | null>> = company.social ?? {};
  const registrations = company.registrations ?? {};
  const contactValues = [contact.email, contact.phone, contact.address];
  const socialValues = siteConfig.socialPlatforms.map((platform) => social[socialFieldName(platform)]);
  const registrationValues = compliance.items.map((item) => registrations[item.key]);
  const countEmpty = (values: (string | null | undefined)[]) => values.filter((value) => !value).length;
  const companyHref = `${ADMIN}/globals/company-details`;
  const enquiriesHref = `${ADMIN}/collections/enquiries`;
  const hasRecipients =
    Boolean(contact.email) || Object.values(company.enquiryEmails ?? {}).some((list) => Boolean(list?.length));

  const checklist: ChecklistItem[] = [
    {
      label: "Enquiry alerts that didn't reach your team",
      missing: unsentAlerts.totalDocs,
      total: unsentAlerts.totalDocs,
      href: `${enquiriesHref}?where[notificationStatus][in]=${UNSENT_ALERTS.join(",")}`,
      status: `${unsentAlerts.totalDocs} to review`,
    },
    {
      label: "Who receives enquiry emails",
      missing: hasRecipients ? 0 : 1,
      total: 1,
      href: companyHref,
      status: "Nobody yet",
    },
    { label: "Contact email, phone and office address", missing: countEmpty(contactValues), total: contactValues.length, href: companyHref },
    { label: "Registration numbers", missing: countEmpty(registrationValues), total: registrationValues.length, href: companyHref },
    { label: "Social profile links", missing: countEmpty(socialValues), total: socialValues.length, href: companyHref },
    { label: "Leadership profiles", missing: team.totalDocs === 0 ? 1 : 0, total: 1, href: `${ADMIN}/collections/team-members` },
    {
      label: "Leadership photos",
      missing: team.docs.filter((member) => !member.photo).length,
      total: team.totalDocs,
      href: `${ADMIN}/collections/team-members`,
    },
    {
      label: "Product photos",
      missing: products.docs.filter((product) => !product.images?.length).length,
      total: products.totalDocs,
      href: `${ADMIN}/collections/products`,
    },
    {
      label: "BOSS Group company logos",
      missing: groupCompanies.docs.filter((groupCompany) => !groupCompany.logo).length,
      total: groupCompanies.totalDocs,
      href: `${ADMIN}/collections/group-companies`,
    },
    {
      label: "Destination ports",
      missing: markets.docs.filter((market) => !market.ports?.length).length,
      total: markets.totalDocs,
      href: `${ADMIN}/collections/markets`,
    },
    {
      label: "Indian loading ports",
      missing: company.trade?.originPorts?.length ? 0 : 1,
      total: 1,
      href: companyHref,
      status: "None yet",
    },
    {
      label: "Corporate video",
      missing: company.trade?.video?.url ? 0 : 1,
      total: 1,
      href: companyHref,
      status: "Not added",
    },
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
          Changes appear on the website as soon as you save. {products.totalDocs} products are live, and{" "}
          {recentEnquiries.totalDocs} {recentEnquiries.totalDocs === 1 ? "enquiry has" : "enquiries have"} arrived in the
          last {RECENT_DAYS} days.
        </p>
        {!isEmailConfigured() && (
          <p className="bg-welcome__notice">
            Email alerts are off until email (SMTP) is set up on the server — enquiries are still saved under Inbox →
            Enquiries.
          </p>
        )}
        <div className="bg-welcome__links">
          <a className="bg-welcome__link bg-welcome__link--primary" href="/" target="_blank" rel="noreferrer">
            View website ↗
          </a>
          <a className="bg-welcome__link" href={enquiriesHref}>
            Enquiries
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
                    {item.status ?? (item.total > 1 ? `${item.missing} of ${item.total} missing` : "None yet")}
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

function countRecentEnquiries(payload: Payload) {
  const since = new Date(Date.now() - RECENT_DAYS * DAY_MS).toISOString();
  return payload.count({ collection: "enquiries", where: { createdAt: { greater_than: since } } });
}
