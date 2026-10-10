import type { ServerProps } from "payload";
import { AIRA_SOURCES } from "@/lib/enquiry/assistant";

const DAY_MS = 24 * 60 * 60 * 1000;
const RECENT_DAYS = 30;
const QUESTIONS_HREF = "/admin/collections/assistant-questions";
const ENQUIRIES_HREF = "/admin/collections/enquiries";
const RECENT_UNANSWERED = 6;

function daysAgo(days: number): string {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

/** Dashboard panel: what Aira did in the last 30 days, and the questions it couldn't answer. */
export async function AiraInsights({ payload }: ServerProps) {
  const recent = { createdAt: { greater_than: daysAgo(RECENT_DAYS) } };
  const [asked, unanswered, enquiries, callbacks, latestUnanswered] = await Promise.all([
    payload.count({ collection: "assistant-questions", where: recent }),
    payload.count({ collection: "assistant-questions", where: { ...recent, result: { not_equals: "answered" } } }),
    payload.count({ collection: "enquiries", where: { ...recent, source: { in: AIRA_SOURCES }, type: { equals: "buyer" } } }),
    payload.count({ collection: "enquiries", where: { ...recent, source: { in: AIRA_SOURCES }, type: { equals: "general" } } }),
    payload.find({
      collection: "assistant-questions",
      where: { result: { not_equals: "answered" } },
      sort: "-createdAt",
      limit: RECENT_UNANSWERED,
      depth: 0,
      select: { question: true, countryName: true, createdAt: true },
    }),
  ]);

  const unansweredHref = `${QUESTIONS_HREF}?where[result][not_equals]=answered`;
  const airaEnquiriesHref = `${ENQUIRIES_HREF}?where[source][in]=${AIRA_SOURCES.map(encodeURIComponent).join(",")}`;
  const stats = [
    { label: "Questions asked", value: asked.totalDocs, href: QUESTIONS_HREF },
    { label: "Not answered by an FAQ", value: unanswered.totalDocs, href: unansweredHref },
    { label: "Buying enquiries", value: enquiries.totalDocs, href: airaEnquiriesHref },
    { label: "Call-back requests", value: callbacks.totalDocs, href: airaEnquiriesHref },
  ];

  return (
    <section className="bg-visits">
      <div className="bg-visits__header">
        <div>
          <p className="bg-welcome__eyebrow">Insights · last {RECENT_DAYS} days</p>
          <h2 className="bg-visits__title">Aira, the website assistant</h2>
          <p className="bg-welcome__text">
            Enquiries and call-back requests made through Aira are saved under Inbox → Enquiries, marked “Sent from: Aira”.
          </p>
        </div>
        <a className="bg-welcome__link" href={QUESTIONS_HREF}>
          All questions →
        </a>
      </div>

      <dl className="bg-visits__totals">
        {stats.map((stat) => (
          <a key={stat.label} href={stat.href} className="bg-visits__stat">
            <dt>{stat.label}</dt>
            <dd>{stat.value.toLocaleString("en-IN")}</dd>
          </a>
        ))}
      </dl>

      <h3 className="bg-welcome__subtitle">Recent questions Aira couldn’t answer</h3>
      {latestUnanswered.docs.length === 0 ? (
        <p className="bg-welcome__text">None yet — every question so far matched an FAQ.</p>
      ) : (
        <ul className="bg-visits__list">
          {latestUnanswered.docs.map((doc) => (
            <li key={doc.id}>
              <a href={`${QUESTIONS_HREF}/${doc.id}`}>“{doc.question}”</a>
              <span>
                {doc.countryName ? `${doc.countryName} · ` : ""}
                {new Date(doc.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="bg-welcome__text">
        Tip: add an FAQ for questions that keep coming up — Aira starts answering them straight away.
      </p>
    </section>
  );
}
